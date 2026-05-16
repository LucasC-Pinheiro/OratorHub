import { supabase } from "@/integrations/supabase/client";
import type {
  DashboardStats,
  NewTalk,
  Talk,
  ThemeSummary,
} from "@/types/talks";
import {
  getCached,
  setCached,
  invalidateCache,
  invalidateCachePattern,
  talksCacheKey,
  statsCacheKey,
  themeCacheKey,
} from "./cache.service";

const TABLE = "talks";

export const talksService = {
  async list(options?: {
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ data: Talk[]; count: number }> {
    const cacheKey = talksCacheKey("list", options);
    const cached = getCached<{ data: Talk[]; count: number }>(cacheKey);
    if (cached) return cached;

    let query = supabase
      .from(TABLE)
      .select("*", { count: "exact" })
      .order("talk_date", { ascending: false });

    if (options?.search) {
      const term = options.search.trim();
      if (term) {
        query = query.or(
          `theme.ilike.%${term}%,speaker_name.ilike.%${term}%,congregation.ilike.%${term}%`,
        );
      }
    }

    if (typeof options?.limit === "number") {
      const from = options.offset ?? 0;
      const to = from + options.limit - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    const result = { data: (data ?? []) as Talk[], count: count ?? 0 };
    setCached(cacheKey, result);
    return result;
  },

  async recent(limit = 5): Promise<Talk[]> {
    const cacheKey = talksCacheKey("recent", { limit });
    const cached = getCached<Talk[]>(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("talk_date", { ascending: false })
      .limit(limit);

    if (error) throw error;
    const result = (data ?? []) as Talk[];
    setCached(cacheKey, result);
    return result;
  },

  async byId(id: string): Promise<Talk | null> {
    const cacheKey = talksCacheKey("byId", { id });
    const cached = getCached<Talk | null>(cacheKey);
    if (cached !== undefined) return cached;

    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 = not found
    const result = (data as Talk | null) ?? null;
    setCached(cacheKey, result);
    return result;
  },

  async create(payload: NewTalk): Promise<Talk> {
    // @ts-expect-error - Supabase types can be tricky with generics
    const { data, error } = await supabase
      .from(TABLE)
      .insert([payload])
      .select("*")
      .single();
    if (error) throw error;

    // Invalidate related caches
    invalidateCachePattern("talks:list");
    invalidateCachePattern("talks:recent");
    invalidateCachePattern("talks:stats");

    return data as Talk;
  },

  async update(id: string, payload: Partial<NewTalk>): Promise<Talk> {
    // @ts-expect-error - Supabase types can be tricky with generics
    const { data, error } = await supabase
      .from(TABLE)
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;

    // Invalidate related caches
    invalidateCachePattern("talks:list");
    invalidateCache(talksCacheKey("byId", { id }));
    invalidateCachePattern("talks:stats");

    return data as Talk;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) throw error;

    // Invalidate related caches
    invalidateCachePattern("talks:list");
    invalidateCachePattern("talks:recent");
    invalidateCache(talksCacheKey("byId", { id }));
    invalidateCachePattern("talks:stats");
  },

  async searchTheme(theme: string): Promise<ThemeSummary | null> {
    const cacheKey = themeCacheKey(theme);
    const cached = getCached<ThemeSummary | null>(cacheKey);
    if (cached !== null) return cached;

    const term = theme.trim();
    if (!term) return null;

    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .ilike("theme", `%${term}%`)
      .order("talk_date", { ascending: false });

    if (error) throw error;
    const rows = (data ?? []) as Talk[];
    const result =
      rows.length === 0
        ? { theme: term, total: 0, last_talk: null }
        : {
            theme: rows[0].theme,
            total: rows.length,
            last_talk: rows[0],
          };

    setCached(cacheKey, result);
    return result;
  },

  async stats(): Promise<DashboardStats> {
    const cacheKey = statsCacheKey();
    const cached = getCached<DashboardStats>(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase.from(TABLE).select("*");
    if (error) throw error;

    const rows = (data ?? []) as Talk[];
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const speakers = new Set<string>();
    const themes = new Set<string>();
    const congregations = new Set<string>();
    let thisMonth = 0;

    for (const row of rows) {
      speakers.add(row.speaker_name.toLowerCase().trim());
      themes.add(row.theme.toLowerCase().trim());
      congregations.add(row.congregation.toLowerCase().trim());
      if (new Date(row.talk_date) >= startOfMonth) thisMonth += 1;
    }

    const result = {
      total_talks: rows.length,
      unique_speakers: speakers.size,
      unique_themes: themes.size,
      unique_congregations: congregations.size,
      this_month: thisMonth,
    };

    setCached(cacheKey, result);
    return result;
  },
};
