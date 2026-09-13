import { useCallback, useSyncExternalStore } from "react";
import { defaultFollowing } from "@/lib/orphic-account";

/**
 * Prototype follow state (V6). In-memory only — no backend, no persistence
 * beyond the session. Following never creates a chat relationship.
 */

let following: string[] = [...defaultFollowing];
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return following;
}

export function useFollowing() {
  const list = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const toggle = useCallback((handle: string) => {
    following = following.includes(handle)
      ? following.filter((h) => h !== handle)
      : [...following, handle];
    emit();
  }, []);

  const isFollowing = useCallback((handle: string) => list.includes(handle), [list]);

  return { following: list, toggle, isFollowing };
}
