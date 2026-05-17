import { useCallback, useEffect, useState } from "react";
import { talksService } from "@/services/talks.service";
import type { Talk } from "@/types/talks";

type Listener = (talks: Talk[]) => void;

let cache: Talk[] | null = null;
let loadPromise: Promise<Talk[]> | null = null;
const listeners = new Set<Listener>();

function publish(next: Talk[]) {
  cache = next;
  listeners.forEach((l) => l(next));
}

async function loadOnce(force = false): Promise<Talk[]> {
  if (cache && !force) return cache;
  if (loadPromise && !force) return loadPromise;
  loadPromise = talksService
    .loadAll()
    .then((rows) => {
      publish(rows);
      return rows;
    })
    .finally(() => {
      loadPromise = null;
    });
  return loadPromise;
}

export function invalidateTalks() {
  cache = null;
  loadPromise = null;
}

export function pushTalk(talk: Talk) {
  const next = [talk, ...(cache ?? [])];
  publish(next);
}

export function replaceTalk(talk: Talk) {
  const current = cache ?? [];
  const next = current.map((t) => (t.id === talk.id ? talk : t));
  publish(next);
}

export function removeTalk(id: string) {
  const current = cache ?? [];
  publish(current.filter((t) => t.id !== id));
}

export function useTalksStore() {
  const [talks, setTalks] = useState<Talk[]>(() => cache ?? []);
  const [loading, setLoading] = useState<boolean>(() => cache === null);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async (force = true) => {
    setError(null);
    setLoading(true);
    try {
      const rows = await loadOnce(force);
      setTalks(rows);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const listener: Listener = (next) => setTalks(next);
    listeners.add(listener);

    if (cache === null) {
      void refresh(false);
    } else {
      setTalks(cache);
      setLoading(false);
    }

    return () => {
      listeners.delete(listener);
    };
  }, [refresh]);

  return { talks, loading, error, refresh };
}
