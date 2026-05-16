import { useEffect, useState, type FormEvent } from "react";
import { CalendarDays } from "lucide-react";
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
import { talksService } from "@/services/talks.service";
import type { NewTalk } from "@/types/talks";

const emptyForm: NewTalk = {
  speaker_name: "",
  congregation: "",
  theme: "",
  talk_date: new Date().toISOString().slice(0, 10),
};

export function RegisterTalkDialog({
  open,
  onOpenChange,
  onCreated,
  initialValues,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
  initialValues?: Partial<NewTalk>;
}) {
  const [form, setForm] = useState<NewTalk>({ ...emptyForm, ...initialValues });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof NewTalk, string>>>(
    {},
  );

  useEffect(() => {
    if (!open) {
      setForm({ ...emptyForm, ...initialValues });
      setErrors({});
    }
  }, [open, initialValues]);

  function update<K extends keyof NewTalk>(field: K, value: NewTalk[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof NewTalk, string>> = {};
    if (!form.speaker_name.trim()) next.speaker_name = "Speaker name is required";
    if (!form.congregation.trim()) next.congregation = "Congregation is required";
    if (!form.theme.trim()) next.theme = "Theme is required";
    if (!form.talk_date) next.talk_date = "Date is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await talksService.create({
        speaker_name: form.speaker_name.trim(),
        congregation: form.congregation.trim(),
        theme: form.theme.trim(),
        talk_date: form.talk_date,
      });
      toast.success("Talk registered", {
        description: `${form.speaker_name} • ${form.theme}`,
      });
      onOpenChange(false);
      onCreated?.();
    } catch (error) {
      toast.error("Could not register talk", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Register a new talk</DialogTitle>
          <DialogDescription>
            Record speaker details so the congregation can keep an accurate
            history.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4"
          noValidate
        >
          <div className="grid gap-1.5">
            <Label htmlFor="speaker_name">Speaker name</Label>
            <Input
              id="speaker_name"
              autoFocus
              value={form.speaker_name}
              onChange={(e) => update("speaker_name", e.target.value)}
              placeholder="John Smith"
              aria-invalid={Boolean(errors.speaker_name)}
            />
            {errors.speaker_name ? (
              <p className="text-xs text-destructive">{errors.speaker_name}</p>
            ) : null}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="congregation">Congregation</Label>
            <Input
              id="congregation"
              value={form.congregation}
              onChange={(e) => update("congregation", e.target.value)}
              placeholder="Central"
              aria-invalid={Boolean(errors.congregation)}
            />
            {errors.congregation ? (
              <p className="text-xs text-destructive">{errors.congregation}</p>
            ) : null}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="theme">Talk theme</Label>
            <Input
              id="theme"
              value={form.theme}
              onChange={(e) => update("theme", e.target.value)}
              placeholder="The value of brotherly kindness"
              aria-invalid={Boolean(errors.theme)}
            />
            {errors.theme ? (
              <p className="text-xs text-destructive">{errors.theme}</p>
            ) : null}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="talk_date">Date</Label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="talk_date"
                type="date"
                value={form.talk_date}
                onChange={(e) => update("talk_date", e.target.value)}
                className="pl-9"
                aria-invalid={Boolean(errors.talk_date)}
              />
            </div>
            {errors.talk_date ? (
              <p className="text-xs text-destructive">{errors.talk_date}</p>
            ) : null}
          </div>

          <DialogFooter className="mt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Save talk
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
