import { useSyncExternalStore } from 'react';

export interface ExState {
  status: 'ok' | 'fail';
  tries: number;
}

interface Store {
  ex: Record<string, ExState>;
  lessons: Record<string, true>;
}

const KEY = 'quimica-sofia-v1';
let state: Store = load();
const listeners = new Set<() => void>();

function load(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);
      return { ex: s.ex ?? {}, lessons: s.lessons ?? {} };
    }
  } catch {
    /* sem storage: segue sem salvar */
  }
  return { ex: {}, lessons: {} };
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignora */
  }
  listeners.forEach((l) => l());
}

export function recordExercise(id: string, st: ExState) {
  const prev = state.ex[id];
  // acerto nunca é rebaixado
  if (prev?.status === 'ok' && st.status !== 'ok') return;
  state = { ...state, ex: { ...state.ex, [id]: st } };
  save();
}

export function markLesson(id: string) {
  if (state.lessons[id]) return;
  state = { ...state, lessons: { ...state.lessons, [id]: true } };
  save();
}

export function resetAll() {
  state = { ex: {}, lessons: {} };
  save();
}

export function useProgress(): Store {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
  );
}
