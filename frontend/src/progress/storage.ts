import { levels } from "../levels/levels";

export const CURRENT_PROGRESS_SCHEMA_VERSION = 4;
export const STORAGE_KEY = "python-beginner-progress";

export type Progress = {
  completed: string[];
  attempted: string[];
  currentLevelId: string;
  codeByLevel: Record<string, string>;
  hintStepsByLevel: Record<string, number>;
  starsByLevel: Record<string, number>;
  schemaVersion: 4;
  attemptCountByLevel: Record<string, number>;
  lastPracticedAtByLevel: Record<string, string>;
  passedAtByLevel: Record<string, string>;
  practiceDates: string[];
  solutionUsedByLevel: Record<string, boolean>;
};

type StoredProgress = Partial<Omit<Progress, "schemaVersion">> & {
  schemaVersion?: number;
};

export function emptyProgress(): Progress {
  return {
    completed: [],
    attempted: [],
    currentLevelId: levels[0].id,
    codeByLevel: {},
    hintStepsByLevel: {},
    starsByLevel: {},
    schemaVersion: CURRENT_PROGRESS_SCHEMA_VERSION,
    attemptCountByLevel: {},
    lastPracticedAtByLevel: {},
    passedAtByLevel: {},
    practiceDates: [],
    solutionUsedByLevel: {},
  };
}

export function migrateProgress(parsed: StoredProgress): Progress {
  return {
    ...emptyProgress(),
    completed: Array.isArray(parsed.completed) ? parsed.completed : [],
    attempted: Array.isArray(parsed.attempted) ? parsed.attempted : [],
    currentLevelId: parsed.currentLevelId || levels[0].id,
    codeByLevel: parsed.codeByLevel || {},
    hintStepsByLevel: parsed.hintStepsByLevel || {},
    starsByLevel: parsed.starsByLevel || {},
    attemptCountByLevel: parsed.attemptCountByLevel || {},
    lastPracticedAtByLevel: parsed.lastPracticedAtByLevel || {},
    passedAtByLevel: parsed.passedAtByLevel || {},
    practiceDates: Array.isArray(parsed.practiceDates) ? parsed.practiceDates : [],
    solutionUsedByLevel: parsed.solutionUsedByLevel || {},
  };
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return emptyProgress();
    }
    return migrateProgress(JSON.parse(raw) as StoredProgress);
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
