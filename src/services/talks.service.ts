import { supabase } from "@/integrations/supabase/client";
import type {
  DashboardStats,
  NewTalk,
  Talk,
  ThemeSummary,
} from "@/types/talks";

const TABLE = "talks";

export const talksService = {
  async list(options?: {
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ data: Talk[]; count: number }> {
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
    return { data: (data ?? []) as Talk[], count: count ?? 0 };
  },

  async recent(limit = 5): Promise<Talk[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("talk_date", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data ?? []) as Talk[];
  },

  async create(payload: NewTalk): Promise<Talk> {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(payload)
      .select("*")
      .single();
    if (error) throw error;
    return data as Talk;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) throw error;
  },

  async searchTheme(theme: string): Promise<ThemeSummary | null> {
    const term = theme.trim();
    if (!term) return null;

    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .ilike("theme", `%${term}%`)
      .order("talk_date", { ascending: false });

    if (error) throw error;
    const rows = (data ?? []) as Talk[];
    if (rows.length === 0) {
      return { theme: term, total: 0, last_talk: null };
    }
    return {
      theme: rows[0].theme,
      total: rows.length,
      last_talk: rows[0],
    };
  },

  async stats(): Promise<DashboardStats> {
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

    return {
      total_talks: rows.length,
      unique_speakers: speakers.size,
      unique_themes: themes.size,
      unique_congregations: congregations.size,
      this_month: thisMonth,
    };
  },
};
