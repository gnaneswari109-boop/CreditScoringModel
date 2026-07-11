import { PredictionInput, PredictionResult, ModelInfo } from '@/types';
import { predictCredit, MOCK_MODEL_INFO } from './credit-engine';

const API_BASE = 'http://localhost:8000';
const API_TIMEOUT = 5000;

async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timeout);
  }
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

export async function predict(input: PredictionInput): Promise<PredictionResult> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return (await res.json()) as PredictionResult;
  } catch {
    return predictCredit(input);
  }
}

export async function getModelInfo(): Promise<ModelInfo> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/model-info`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return (await res.json()) as ModelInfo;
  } catch {
    return MOCK_MODEL_INFO as unknown as ModelInfo;
  }
}

export async function getModels(): Promise<{ name: string; metrics: any }[]> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/models`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
  } catch {
    return MOCK_MODEL_INFO.models;
  }
}

export async function trainModel(): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/train`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    return { success: true, message: data.message || 'Training completed' };
  } catch {
    return {
      success: false,
      message: 'Backend not available. Using client-side prediction engine.',
    };
  }
}

export async function batchPredict(
  rows: PredictionInput[]
): Promise<PredictionResult[]> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/batch-predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rows),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
  } catch {
    return rows.map(predictCredit);
  }
}
