import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { talksService } from "@/services/talks.service";
import type { Talk } from "@/types/talks";
import { BookOpen, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export function TalksPage() {
  const navigate = useNavigate();
  const [talks, setTalks] = useState<Talk[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTalks() {
      try {
        setLoading(true);
        const result = await talksService.list();
        setTalks(result.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load talks");
        setTalks([]);
      } finally {
        setLoading(false);
      }
    }

    loadTalks();
  }, []);

  const filteredTalks = useMemo(() => {
    if (!search) {
      return talks;
    }

    return talks.filter(
      (talk) =>
        talk.theme.toLowerCase().includes(search.toLowerCase()) ||
        talk.speaker_name.toLowerCase().includes(search.toLowerCase()) ||
        talk.congregation.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, talks]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Histórico de Palestras</h1>
          <p className="text-muted-foreground mt-2">
            Visualize e gerencie todas as palestras registradas
          </p>
        </div>
        <Button 
          onClick={() => navigate("/talks/new")}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Registrar Palestra
        </Button>
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
          placeholder="Pesquise por tema, palestrante ou congregação..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Talks List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-muted animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : filteredTalks.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {filteredTalks.length} Palestra{filteredTalks.length !== 1 ? "s" : ""} Encontrada{filteredTalks.length !== 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredTalks.map((talk, index) => (
                <div
                  key={talk.id}
                  className="group flex flex-col gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer"
                  onClick={() => navigate(`/talks/${talk.id}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                          #{index + 1}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mt-1 group-hover:text-primary transition-colors">
                        {talk.theme}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Por {talk.speaker_name} • {talk.congregation}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-medium text-primary">
                        {new Date(talk.talk_date).toLocaleDateString("pt-BR", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(talk.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="font-semibold text-lg mb-2">
              {search ? "Nenhuma palestra encontrada" : "Nenhuma palestra registrada ainda"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {search
                ? "Tente ajustar seus critérios de pesquisa"
                : "Comece registrando sua primeira palestra"}
            </p>
            {!search && (
              <Button 
                onClick={() => navigate("/talks/new")}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Registrar Palestra
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results Info */}
      {!loading && talks.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Mostrando {filteredTalks.length} de {talks.length} palestra
          {talks.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
