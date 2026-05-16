export type Talk = {
  id: string;
  speaker_name: string;
  congregation: string;
  theme: string;
  talk_date: string;
  created_at: string;
};

export type NewTalk = {
  speaker_name: string;
  congregation: string;
  theme: string;
  talk_date: string;
};

export type ThemeSummary = {
  theme: string;
  total: number;
  last_talk: Talk | null;
};

export type TopThemeSummary = {
  theme: string;
  total: number;
  last_talk: Talk;
};

export type SpeakerSummary = {
  name: string;
  total: number;
  last_talk: Talk;
  themes: Set<string>;
};

export type SpeakerThemeHistory = {
  speaker: string;
  theme: string;
  total: number;
  talks: Talk[];
};

export type DashboardStats = {
  total_talks: number;
  unique_speakers: number;
  unique_themes: number;
  unique_congregations: number;
  this_month: number;
};
