import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { talksService } from "@/services/talks.service";
import type { NewTalk } from "@/types/talks";
import { ArrowLeft, BookOpen, Loader } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function NewTalkPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<NewTalk>({
    speaker_name: "",
    congregation: "",
    theme: "",
    talk_date: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.speaker_name.trim()) {
      setError("Nome do palestrante é obrigatório");
      return;
    }
    if (!formData.congregation.trim()) {
      setError("Congregação é obrigatória");
      return;
    }
    if (!formData.theme.trim()) {
      setError("Tema é obrigatório");
      return;
    }
    if (!formData.talk_date) {
      setError("Data é obrigatória");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await talksService.create(formData);
      setSuccess(true);

      // Redirect after success
      setTimeout(() => {
        navigate("/talks", { replace: true });
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao registrar palestra");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="max-w-md text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <BookOpen className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div>
              <h2 className="font-semibold text-lg">Palestra Registrada com Sucesso!</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Redirecionando para a lista de palestras...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/talks")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Registrar Palestra</h1>
          <p className="text-muted-foreground mt-1">
            Adicione uma nova palestra ao sistema
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Palestra</CardTitle>
          <CardDescription>
            Preencha as informações sobre a palestra
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Speaker Name */}
            <div className="space-y-2">
              <Label htmlFor="speaker_name">Nome do Palestrante *</Label>
              <Input
                id="speaker_name"
                name="speaker_name"
                placeholder="ex: João Silva"
                value={formData.speaker_name}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            {/* Congregation */}
            <div className="space-y-2">
              <Label htmlFor="congregation">Congregação *</Label>
              <Input
                id="congregation"
                name="congregation"
                placeholder="ex: Salão do Reino Central"
                value={formData.congregation}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            {/* Theme */}
            <div className="space-y-2">
              <Label htmlFor="theme">Tema/Título *</Label>
              <Input
                id="theme"
                name="theme"
                placeholder="ex: O Poder da Fé"
                value={formData.theme}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="talk_date">Data da Palestra *</Label>
              <Input
                id="talk_date"
                name="talk_date"
                type="date"
                value={formData.talk_date}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                className="flex-1 gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4" />
                    Registrar Palestra
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/talks")}
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-sm mb-2">Dicas</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Use o mesmo nome de palestrante consistentemente para melhores estatísticas</li>
            <li>• O tema deve ser um título claro e descritivo da palestra</li>
            <li>• Certifique-se de que a data está correta para registros históricos adequados</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
