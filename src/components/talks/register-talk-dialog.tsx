import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Hash,
  MapPin,
  Sparkles,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import {
  aggregateCongregations,
  aggregateSpeakers,
  aggregateThemes,
  talksService,
  type TalksServiceError,
} from "@/services/talks.service";
import { formatDate, formatRelative, normalize, todayIso } from "@/lib/utils";
import { pushTalk, replaceTalk, useTalksStore } from "@/hooks/use-talks-store";
import type { NewTalk, Talk } from "@/types/talks";

function emptyForm(initial?: Partial<NewTalk>): NewTalk {
  return {
    speaker_name: initial?.speaker_name ?? "",
    congregation: initial?.congregation ?? "",
    theme: initial?.theme ?? "",
    talk_date: initial?.talk_date ?? todayIso(),
  };
}

function formFromTalk(talk: Talk): NewTalk {
  return {
    speaker_name: talk.speaker_name,
    congregation: talk.congregation,
    theme: talk.theme,
    talk_date: talk.talk_date,
  };
}

function describeSupabaseError(error: unknown): {
  title: string;
  description: string;
} {
  const err = error as TalksServiceError | undefined;
  const code = err?.code;
  const message = err?.message ?? "";
  const details = err?.details ?? err?.hint ?? "";

  if (code === "42501" || /row-level security/i.test(message)) {
    return {
      title: "Permissão negada (RLS)",
      description:
        "Sua sessão não tem permissão para inserir na tabela talks. Crie a policy de INSERT para usuários autenticados no Supabase.",
    };
  }
  if (code === "23505") {
    return {
      title: "Registro duplicado",
      description:
        "Já existe um discurso com esses mesmos dados. Confira a data e o tema.",
    };
  }
  if (code === "23502") {
    return {
      title: "Campo obrigatório ausente",
      description: details || "Preencha todos os campos antes de salvar.",
    };
  }
  if (code === "42P01") {
    return {
      title: "Tabela talks não encontrada",
      description:
        "Rode o SQL de setup do README para criar a tabela talks no seu projeto Supabase.",
    };
  }
  if (/jwt|session/i.test(message)) {
    return {
      title: "Sessão expirada",
      description: "Faça login novamente para registrar o discurso.",
    };
  }
  return {
    title: "Não foi possível salvar o discurso",
    description:
      details ||
      message ||
      "Tente novamente. Se persistir, abra o console para ver detalhes.",
  };
}

export type RegisterTalkDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
  onUpdated?: (talk: Talk) => void;
  initialValues?: Partial<NewTalk>;
  editingTalk?: Talk | null;
};

export function RegisterTalkDialog({
  open,
  onOpenChange,
  onCreated,
  onUpdated,
  initialValues,
  editingTalk,
}: RegisterTalkDialogProps) {
  const { talks } = useTalksStore();
  const isEditing = Boolean(editingTalk);
  const [form, setForm] = useState<NewTalk>(() =>
    editingTalk ? formFromTalk(editingTalk) : emptyForm(initialValues),
  );
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof NewTalk, string>>>(
    {},
  );

  useEffect(() => {
    if (open) {
      setForm(
        editingTalk ? formFromTalk(editingTalk) : emptyForm(initialValues),
      );
      setErrors({});
    } else {
      setErrors({});
    }
  }, [open, initialValues, editingTalk]);

  const themeOptions = useMemo<ComboboxOption[]>(() => {
    return aggregateThemes(talks).map((t) => ({
      value: t.theme,
      label: t.theme,
      description: `Último: ${t.last_talk.speaker_name} • ${formatRelative(t.last_talk.talk_date)}`,
      badge: (
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          {t.total}×
        </span>
      ),
    }));
  }, [talks]);

  const speakerOptions = useMemo<ComboboxOption[]>(() => {
    return aggregateSpeakers(talks).map((s) => ({
      value: s.name,
      label: s.name,
      description: `${s.total} discurso${s.total === 1 ? "" : "s"} • último em ${formatDate(s.last_talk.talk_date)}`,
    }));
  }, [talks]);

  const congregationOptions = useMemo<ComboboxOption[]>(() => {
    return aggregateCongregations(talks).map((name) => ({
      value: name,
      label: name,
    }));
  }, [talks]);

  const themeIntel = useMemo(() => {
    const term = normalize(form.theme);
    if (!term) return null;
    const matches = talks.filter((t) => normalize(t.theme) === term);
    if (matches.length === 0) return { isNew: true } as const;
    matches.sort((a, b) => +new Date(b.talk_date) - +new Date(a.talk_date));
    const last = matches[0];
    return {
      isNew: false,
      last,
      total: matches.length,
    } as const;
  }, [talks, form.theme]);

  function update<K extends keyof NewTalk>(field: K, value: NewTalk[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof NewTalk, string>> = {};
    if (!form.speaker_name.trim()) next.speaker_name = "Informe o nome do orador";
    if (!form.congregation.trim()) next.congregation = "Informe a congregação";
    if (!form.theme.trim()) next.theme = "Informe o tema do discurso";
    if (!form.talk_date) next.talk_date = "Informe a data";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    const payload: NewTalk = {
      speaker_name: form.speaker_name.trim(),
      congregation: form.congregation.trim(),
      theme: form.theme.trim(),
      talk_date: form.talk_date,
    };

    setSubmitting(true);
    try {
      if (editingTalk) {
        const updated = await talksService.update(editingTalk.id, payload);
        replaceTalk(updated);
        toast.success("Discurso atualizado", {
          description: `${updated.speaker_name} • ${updated.theme}`,
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
        });
        onOpenChange(false);
        onUpdated?.(updated);
      } else {
        const created = await talksService.create(payload);
        pushTalk(created);
        toast.success("Discurso registrado", {
          description: `${created.speaker_name} • ${created.theme}`,
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
        });
        onOpenChange(false);
        onCreated?.();
      }
    } catch (error) {
      const info = describeSupabaseError(error);
      // eslint-disable-next-line no-console
      console.error("[RegisterTalkDialog] failed", error);
      toast.error(info.title, { description: info.description });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar discurso" : "Registrar novo discurso"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize os dados do discurso. As alterações ficam visíveis imediatamente para toda a congregação."
              : "Salve os dados do orador para manter o histórico da congregação sempre atualizado."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
          <div className="grid gap-1.5">
            <Label htmlFor="theme">Tema</Label>
            <Combobox
              id="theme"
              autoFocus
              value={form.theme}
              onChange={(v) => update("theme", v)}
              options={themeOptions}
              placeholder="Ex.: Coragem para falar a verdade"
              leadingIcon={<Hash className="h-4 w-4" />}
              ariaInvalid={Boolean(errors.theme)}
            />
            {errors.theme ? (
              <p className="text-xs text-destructive">{errors.theme}</p>
            ) : null}
            {themeIntel ? (
              themeIntel.isNew ? (
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Tema inédito — será o primeiro registro.
                </p>
              ) : (
                <div className="flex items-start gap-2 rounded-md border border-border bg-secondary/50 px-3 py-2 text-xs text-foreground">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="leading-relaxed">
                    Último a apresentar:{" "}
                    <strong>{themeIntel.last.speaker_name}</strong> em{" "}
                    {formatDate(themeIntel.last.talk_date)} ({themeIntel.last.congregation}).
                    Já usado {themeIntel.total}× na história.
                  </span>
                </div>
              )
            ) : null}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="speaker_name">Orador</Label>
            <Combobox
              id="speaker_name"
              value={form.speaker_name}
              onChange={(v) => update("speaker_name", v)}
              options={speakerOptions}
              placeholder="Ex.: João Silva"
              leadingIcon={<User className="h-4 w-4" />}
              ariaInvalid={Boolean(errors.speaker_name)}
            />
            {errors.speaker_name ? (
              <p className="text-xs text-destructive">{errors.speaker_name}</p>
            ) : null}
          </div>

          <div className="grid gap-1.5 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="congregation">Congregação</Label>
              <Combobox
                id="congregation"
                value={form.congregation}
                onChange={(v) => update("congregation", v)}
                options={congregationOptions}
                placeholder="Ex.: Central"
                leadingIcon={<MapPin className="h-4 w-4" />}
                ariaInvalid={Boolean(errors.congregation)}
              />
              {errors.congregation ? (
                <p className="text-xs text-destructive">
                  {errors.congregation}
                </p>
              ) : null}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="talk_date">Data</Label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="talk_date"
                  type="date"
                  value={form.talk_date}
                  onChange={(e) => update("talk_date", e.target.value)}
                  max="2999-12-31"
                  className="pl-9"
                  aria-invalid={Boolean(errors.talk_date)}
                />
              </div>
              {errors.talk_date ? (
                <p className="text-xs text-destructive">{errors.talk_date}</p>
              ) : null}
            </div>
          </div>

          <p className="flex items-start gap-2 rounded-md bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
            <span>
              Use os mesmos nomes (orador, tema e congregação) sempre que possível
              — isso garante histórico, estatísticas e contagem corretos.
            </span>
          </p>

          <DialogFooter className="mt-1 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={submitting}>
              {isEditing ? "Salvar alterações" : "Salvar discurso"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
