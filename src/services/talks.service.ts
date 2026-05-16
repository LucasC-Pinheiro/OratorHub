import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { normalize } from "@/lib/utils";
import type {
  DashboardStats,
  NewTalk,
  SpeakerSummary,
  SpeakerThemeHistory,
  Talk,
  ThemeSummary,
  TopThemeSummary,
} from "@/types/talks";

type TalkInsert = Database["public"]["Tables"]["talks"]["Insert"];

const TABLE = "talks";

/**
 * Convert any Supabase error shape (Error, PostgrestError, plain object)
 * into a real Error with the most useful message we can build, plus expose
 * the original `code/details/hint` so the UI can act on them.
 */
export type TalksServiceError = Error & {
  code?: string;
  hint?: string;
  details?: string;
};

function asServiceError(value: unknown, context: string): TalksServiceError {
  // eslint-disable-next-line no-console
  console.error(`[talksService:${context}]`, value);

  if (value instanceof Error) {
    return Object.assign(value, { code: (value as TalksServiceError).code });
  }
  if (typeof value === "object" && value !== null) {
    const v = value as Record<string, unknown>;
    const message =
      (typeof v.message === "string" && v.message) ||
      (typeof v.hint === "string" && v.hint) ||
      "Erro desconhecido ao falar com o Supabase";
    const err = new Error(message) as TalksServiceError;
    if (typeof v.code === "string") err.code = v.code;
    if (typeof v.details === "string") err.details = v.details;
    if (typeof v.hint === "string") err.hint = v.hint;
    return err;
  }
  return new Error(String(value)) as TalksServiceError;
}

async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    throw asServiceError(
      error ?? new Error("Sessão expirada — faça login novamente."),
      "requireUserId",
    );
  }
  return data.user.id;
}

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
        const safe = term.replace(/[%,]/g, " ");
        query = query.or(
          `theme.ilike.%${safe}%,speaker_name.ilike.%${safe}%,congregation.ilike.%${safe}%`,
        );
      }
    }

    if (typeof options?.limit === "number") {
      const from = options.offset ?? 0;
      const to = from + options.limit - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;
    if (error) throw asServiceError(error, "list");
    return { data: (data ?? []) as Talk[], count: count ?? 0 };
  },

  async recent(limit = 5): Promise<Talk[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("talk_date", { ascending: false })
      .limit(limit);

    if (error) throw asServiceError(error, "recent");
    return (data ?? []) as Talk[];
  },

  async create(payload: NewTalk): Promise<Talk> {
    // Make sure we have an authenticated session before trying to insert,
    // otherwise the RLS-protected insert will reject with a cryptic error.
    await requireUserId();

    const sanitized: TalkInsert = {
      speaker_name: payload.speaker_name.trim(),
      congregation: payload.congregation.trim(),
      theme: payload.theme.trim(),
      talk_date: payload.talk_date,
    };

    // eslint-disable-next-line no-console
    console.info("[talksService:create] inserting", sanitized);

    // The Supabase JS v2 generics resolve `insert()` to `never[]` for some
    // versions when the literal table name isn't pinned. Cast through unknown
    // to keep runtime behaviour but silence the compile-time false positive.
    const insertBuilder = supabase.from(TABLE).insert(
      sanitized as unknown as never,
    );
    const { data, error } = await insertBuilder.select("*").single();

    if (error) throw asServiceError(error, "create");
    if (!data) {
      throw asServiceError(
        new Error("O Supabase aceitou o insert mas não retornou nenhum dado."),
        "create",
      );
    }
    return data as Talk;
  },

  async remove(id: string): Promise<void> {
    await requireUserId();
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) throw asServiceError(error, "remove");
  },

  /** Loose search by theme keyword — used by the dedicated search page. */
  async searchTheme(theme: string): Promise<ThemeSummary | null> {
    const term = theme.trim();
    if (!term) return null;

    const safe = term.replace(/[%,]/g, " ");
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .ilike("theme", `%${safe}%`)
      .order("talk_date", { ascending: false });

    if (error) throw asServiceError(error, "searchTheme");
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

  /** Strict, case-insensitive last-talk lookup for an exact theme string. */
  async lastForTheme(theme: string): Promise<ThemeSummary | null> {
    const term = theme.trim();
    if (!term) return null;
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .ilike("theme", term)
      .order("talk_date", { ascending: false });
    if (error) throw asServiceError(error, "lastForTheme");
    const rows = (data ?? []) as Talk[];
    if (rows.length === 0) return { theme: term, total: 0, last_talk: null };
    return { theme: rows[0].theme, total: rows.length, last_talk: rows[0] };
  },

  /** Speaker × theme history — when did this speaker last give this theme, how often. */
  async speakerThemeHistory(
    speaker: string,
    theme: string,
  ): Promise<SpeakerThemeHistory> {
    const s = speaker.trim();
    const t = theme.trim();
    if (!s || !t) return { speaker: s, theme: t, total: 0, talks: [] };

    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .ilike("speaker_name", s)
      .ilike("theme", t)
      .order("talk_date", { ascending: false });

    if (error) throw asServiceError(error, "speakerThemeHistory");
    const rows = (data ?? []) as Talk[];
    return {
      speaker: rows[0]?.speaker_name ?? s,
      theme: rows[0]?.theme ?? t,
      total: rows.length,
      talks: rows,
    };
  },

  /** Dashboard stat counts. */
  async stats(): Promise<DashboardStats> {
    const { data, error } = await supabase.from(TABLE).select("*");
    if (error) throw asServiceError(error, "stats");

    const rows = (data ?? []) as Talk[];
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const speakers = new Set<string>();
    const themes = new Set<string>();
    const congregations = new Set<string>();
    let thisMonth = 0;

    for (const row of rows) {
      speakers.add(normalize(row.speaker_name));
      themes.add(normalize(row.theme));
      congregations.add(normalize(row.congregation));
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

  /**
   * Load everything once and keep client-side aggregations for dashboard,
   * comboboxes and instant search. The dataset for a congregation is small
   * enough that one round-trip beats many filtered queries.
   */
  async loadAll(): Promise<Talk[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("talk_date", { ascending: false });
    if (error) throw asServiceError(error, "loadAll");
    return (data ?? []) as Talk[];
  },
};

/** Group talks by normalised theme and return the most used. */
export function aggregateTopThemes(
  talks: Talk[],
  limit = 5,
): TopThemeSummary[] {
  const map = new Map<string, TopThemeSummary>();
  for (const talk of talks) {
    const key = normalize(talk.theme);
    const existing = map.get(key);
    if (!existing) {
      map.set(key, {
        theme: talk.theme,
        total: 1,
        last_talk: talk,
      });
    } else {
      existing.total += 1;
      if (new Date(talk.talk_date) > new Date(existing.last_talk.talk_date)) {
        existing.last_talk = talk;
        existing.theme = talk.theme;
      }
    }
  }
  return Array.from(map.values())
    .sort((a, b) => b.total - a.total || +new Date(b.last_talk.talk_date) - +new Date(a.last_talk.talk_date))
    .slice(0, limit);
}

/** Group talks by normalised speaker name. */
export function aggregateSpeakers(talks: Talk[]): SpeakerSummary[] {
  const map = new Map<string, SpeakerSummary>();
  for (const talk of talks) {
    const key = normalize(talk.speaker_name);
    const existing = map.get(key);
    if (!existing) {
      map.set(key, {
        name: talk.speaker_name,
        total: 1,
        last_talk: talk,
        themes: new Set([normalize(talk.theme)]),
      });
    } else {
      existing.total += 1;
      existing.themes.add(normalize(talk.theme));
      if (new Date(talk.talk_date) > new Date(existing.last_talk.talk_date)) {
        existing.last_talk = talk;
        existing.name = talk.speaker_name;
      }
    }
  }
  return Array.from(map.values()).sort(
    (a, b) => +new Date(b.last_talk.talk_date) - +new Date(a.last_talk.talk_date),
  );
}

/** Unique theme list (newest first) for comboboxes / autocompletes. */
export function aggregateThemes(talks: Talk[]): TopThemeSummary[] {
  return aggregateTopThemes(talks, Number.POSITIVE_INFINITY);
}

/** Unique congregation list (sorted alpha). */
export function aggregateCongregations(talks: Talk[]): string[] {
  const set = new Set<string>();
  for (const t of talks) set.add(t.congregation);
  return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
}
