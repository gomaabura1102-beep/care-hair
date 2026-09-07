"use client";

import { useCallback, useEffect, useState } from "react";
import type { DiagnosisResult, PublicDiagnosis } from "@/types/diagnosis";
import type {
  CareHairState,
  PendingDiagnosisContext,
  SavedDiagnosis,
  UsageFeedback,
  UsageRecord
} from "@/types/user-state";

const stateKey = "care-hair:user-state:v1";
const pendingKey = "care-hair:pending-diagnosis:v1";
const localResultKey = "care-hair:local-diagnosis-result:v1";
const stateEvent = "care-hair-state-change";

export const emptyCareHairState: CareHairState = {
  version: 1,
  favoriteProductIds: [],
  comparisonProductIds: [],
  recentlyViewedProductIds: [],
  diagnoses: [],
  usages: []
};

function normalizeState(value: Partial<CareHairState> | null): CareHairState {
  return {
    ...emptyCareHairState,
    ...value,
    version: 1,
    favoriteProductIds: Array.isArray(value?.favoriteProductIds) ? value.favoriteProductIds : [],
    comparisonProductIds: Array.isArray(value?.comparisonProductIds) ? value.comparisonProductIds.slice(0, 3) : [],
    recentlyViewedProductIds: Array.isArray(value?.recentlyViewedProductIds)
      ? value.recentlyViewedProductIds.slice(0, 10)
      : [],
    diagnoses: Array.isArray(value?.diagnoses) ? value.diagnoses.slice(0, 20) : [],
    usages: Array.isArray(value?.usages) ? value.usages.slice(0, 30) : []
  };
}

export function readCareHairState(): CareHairState {
  if (typeof window === "undefined") return emptyCareHairState;
  try {
    return normalizeState(JSON.parse(window.localStorage.getItem(stateKey) ?? "null") as Partial<CareHairState> | null);
  } catch {
    return emptyCareHairState;
  }
}

function writeCareHairState(next: CareHairState) {
  window.localStorage.setItem(stateKey, JSON.stringify(normalizeState(next)));
  window.dispatchEvent(new Event(stateEvent));
}

function updateCareHairState(updater: (current: CareHairState) => CareHairState) {
  writeCareHairState(updater(readCareHairState()));
}

export function useCareHairState() {
  const [state, setState] = useState<CareHairState>(emptyCareHairState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => setState(readCareHairState());
    sync();
    setHydrated(true);
    window.addEventListener(stateEvent, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(stateEvent, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggleFavorite = useCallback((productId: string) => {
    updateCareHairState((current) => ({
      ...current,
      favoriteProductIds: current.favoriteProductIds.includes(productId)
        ? current.favoriteProductIds.filter((id) => id !== productId)
        : [productId, ...current.favoriteProductIds]
    }));
  }, []);

  const toggleComparison = useCallback((productId: string) => {
    const current = readCareHairState();
    if (current.comparisonProductIds.includes(productId)) {
      writeCareHairState({
        ...current,
        comparisonProductIds: current.comparisonProductIds.filter((id) => id !== productId)
      });
      return { added: false, full: false };
    }
    if (current.comparisonProductIds.length >= 3) return { added: false, full: true };
    writeCareHairState({
      ...current,
      comparisonProductIds: [...current.comparisonProductIds, productId]
    });
    return { added: true, full: false };
  }, []);

  const markRecentlyViewed = useCallback((productId: string) => {
    updateCareHairState((current) => ({
      ...current,
      recentlyViewedProductIds: [
        productId,
        ...current.recentlyViewedProductIds.filter((id) => id !== productId)
      ].slice(0, 10)
    }));
  }, []);

  return { state, hydrated, toggleFavorite, toggleComparison, markRecentlyViewed };
}

export function savePendingDiagnosisContext(context: PendingDiagnosisContext) {
  window.sessionStorage.setItem(pendingKey, JSON.stringify(context));
}

export function readPendingDiagnosisContext(diagnosisId: string): PendingDiagnosisContext | null {
  try {
    const value = JSON.parse(window.sessionStorage.getItem(pendingKey) ?? "null") as PendingDiagnosisContext | null;
    return value?.diagnosisId === diagnosisId ? value : null;
  } catch {
    return null;
  }
}

export function saveLocalDiagnosisResult(diagnosis: PublicDiagnosis) {
  window.sessionStorage.setItem(localResultKey, JSON.stringify(diagnosis));
}

export function readLocalDiagnosisResult(diagnosisId: string): PublicDiagnosis | null {
  try {
    const value = JSON.parse(window.sessionStorage.getItem(localResultKey) ?? "null") as PublicDiagnosis | null;
    return value?.diagnosisId === diagnosisId && value.result ? value : null;
  } catch {
    return null;
  }
}

export function saveDiagnosisToDevice(input: {
  diagnosisId: string;
  createdAt: string;
  result: DiagnosisResult;
  recommendedProductIds: string[];
  mode: "questions" | "photo";
  currentProductId: string | null;
}) {
  const saved: SavedDiagnosis = {
    diagnosisId: input.diagnosisId,
    createdAt: input.createdAt,
    labels: {
      hairBody: input.result.hairBody,
      hairShape: input.result.hairShape,
      scalpState: input.result.scalpState,
      condition: input.result.condition
    },
    scores: input.result.scores,
    recommendedProductIds: input.recommendedProductIds,
    currentProductId: input.currentProductId,
    mode: input.mode
  };
  updateCareHairState((current) => ({
    ...current,
    diagnoses: [saved, ...current.diagnoses.filter((item) => item.diagnosisId !== saved.diagnosisId)].slice(0, 20)
  }));
}

export function startUsingProduct(input: {
  productId: string;
  diagnosisId?: string | null;
  hairType?: string | null;
  concerns?: string[];
}) {
  const usage: UsageRecord = {
    id: `usage-${Date.now()}`,
    productId: input.productId,
    startDate: new Date().toISOString(),
    diagnosisId: input.diagnosisId ?? null,
    hairType: input.hairType ?? null,
    concerns: input.concerns ?? [],
    feedback: null
  };
  updateCareHairState((current) => ({ ...current, usages: [usage, ...current.usages].slice(0, 30) }));
  return usage;
}

export function saveUsageFeedback(usageId: string, feedback: Omit<UsageFeedback, "recordedAt">) {
  updateCareHairState((current) => ({
    ...current,
    usages: current.usages.map((usage) =>
      usage.id === usageId ? { ...usage, feedback: { ...feedback, recordedAt: new Date().toISOString() } } : usage
    )
  }));
}
