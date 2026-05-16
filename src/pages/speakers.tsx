import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { talksService } from "@/services/talks.service";
import type { Talk } from "@/types/talks";
import { Mic2, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface SpeakerStats {
  name: string;
  count: number;
  themes: string[];
  lastTalk: Talk | null;
}

export function SpeakersPage() {
  const [talks, setTalks] = useState<Talk[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTalks() {
      try {
        setLoading(true);
        const result = await talksService.list({ limit: 1000 });
        setTalks(result.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Falha ao carregar palestrantes");
        setTalks([]);
      } finally {
        setLoading(false);
      }
    }

    loadTalks();
  }, []);

  const speakers = useMemo<SpeakerStats[]>(() => {
    const speakerMap = new Map<string, SpeakerStats>();

    talks.forEach((talk) => {
      if (!talk.speaker_name) return;

      if (!speakerMap.has(talk.speaker_name)) {
        speakerMap.set(talk.speaker_name, {
          name: talk.speaker_name,
          count: 0,
          themes: [],
          lastTalk: null,
        });
      }

      const speaker = speakerMap.get(talk.speaker_name)!;
      speaker.count++;

      if (!speaker.themes.includes(talk.theme)) {
        speaker.themes.push(talk.theme);
      }

      if (!speaker.lastTalk || new Date(talk.talk_date) > new Date(speaker.lastTalk.talk_date)) {
        speaker.lastTalk = talk;
      }
    });

    let result = Array.from(speakerMap.values());

    // Apply search filter
    if (search) {
      result = result.filter((speaker) =>
        speaker.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort by talk count descending
    return result.sort((a, b) => b.count - a.count);
  }, [talks, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Palestrantes</h1>
        <p className="text-muted-foreground mt-2">
          Navegue por todos os palestrantes e suas contribuições
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Pesquise palestrantes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Speakers Grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 bg-muted animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : speakers.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {speakers.map((speaker) => (
              <Card
                key={speaker.name}
                className="hover:border-primary/50 transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">
                        {speaker.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {speaker.count} palestra{speaker.count !== 1 ? "s" : ""}
                      </CardDescription>
                    </div>
                    <Mic2 className="w-5 h-5 text-primary/60 flex-shrink-0" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Temas
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {speaker.themes.slice(0, 3).map((theme) => (
                        <span
                          key={theme}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                        >
                          {theme}
                        </span>
                      ))}
                      {speaker.themes.length > 3 && (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                          +{speaker.themes.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {speaker.lastTalk && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Última Palestra
                      </p>
                      <p className="text-sm text-foreground">
                        {new Date(speaker.lastTalk.talk_date).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Results Info */}
          <div className="text-center text-sm text-muted-foreground">
            Mostrando {speakers.length} palestrante{speakers.length !== 1 ? "s" : ""}
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <Mic2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="font-semibold text-lg mb-2">
              {search ? "Nenhum palestrante encontrado" : "Nenhum palestrante ainda"}
            </h3>
            <p className="text-muted-foreground">
              {search
                ? "Tente ajustar seus critérios de pesquisa"
                : "Palestrantes aparecerão aqui após registrar palestras"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
