export type AIProvider = 'gemini' | 'anthropic' | 'openrouter' | 'nvidia' | 'opencode_zen';

export interface ProviderConfig {
  aiProvider: AIProvider;
  apiKey: string;
  baseUrl?: string;
  selectedModel?: string;
}

export interface ModelInfo {
  id: string;
  name: string;
}

const isNative = () => {
  try {
    return typeof window !== 'undefined' && 'Capacitor' in window && (window as any).Capacitor?.isNativePlatform?.();
  } catch {
    return false;
  }
};

async function nativeFetch(url: string, options: RequestInit): Promise<Response> {
  const { CapacitorHttp } = await import('@capacitor/core');
  const response = await CapacitorHttp.request({
    url,
    method: options.method || 'GET',
    headers: options.headers as Record<string, string>,
    data: options.body,
  });
  return new Response(JSON.stringify(response.data), {
    status: response.status,
    headers: response.headers,
  });
}

async function fetchWrapper(url: string, options: RequestInit): Promise<Response> {
  if (isNative()) {
    return nativeFetch(url, options);
  }
  return fetch(url, options);
}

async function doFetch(url: string, options: RequestInit): Promise<Response> {
  return fetchWrapper(url, options);
}

export async function fetchModels(config: ProviderConfig): Promise<ModelInfo[]> {
  const { aiProvider, apiKey, baseUrl } = config;
  if (!apiKey && aiProvider !== 'gemini') {
    throw new Error(`${aiProvider.toUpperCase()} API Key missing`);
  }

  let url = '';
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  switch (aiProvider) {
    case 'gemini': {
      const key = apiKey;
      if (!key) throw new Error('Gemini API Key missing');
      const base = baseUrl?.replace(/\/$/, '') || 'https://generativelanguage.googleapis.com';
      url = base.includes('/v1') ? `${base}/models?key=${key}` : `${base}/v1beta/models?key=${key}`;
      break;
    }
    case 'anthropic': {
      if (!apiKey) throw new Error('Anthropic API Key missing');
      const base = baseUrl?.replace(/\/$/, '') || 'https://api.anthropic.com';
      url = base.includes('/v1') ? base : `${base}/v1/models`;
      headers['x-api-key'] = apiKey;
      headers['anthropic-version'] = '2023-06-01';
      break;
    }
    case 'openrouter': {
      if (!apiKey) throw new Error('OpenRouter API Key missing');
      const base = baseUrl?.replace(/\/$/, '') || 'https://openrouter.ai/api';
      url = base.includes('/v1/models') ? base : `${base}/v1/models`;
      headers['Authorization'] = `Bearer ${apiKey}`;
      break;
    }
    case 'nvidia': {
      if (!apiKey) throw new Error('NVIDIA API Key missing');
      const base = baseUrl?.replace(/\/$/, '') || 'https://integrate.api.nvidia.com';
      url = base.includes('/v1') ? base : `${base}/v1/models`;
      headers['Authorization'] = `Bearer ${apiKey}`;
      break;
    }
    case 'opencode_zen': {
      if (!apiKey) throw new Error('Opencode Zen API Key missing');
      const base = baseUrl?.replace(/\/$/, '') || 'https://api.opencodezen.com';
      url = base.includes('/v1') ? base : `${base}/v1/models`;
      headers['Authorization'] = `Bearer ${apiKey}`;
      break;
    }
    default:
      throw new Error('Invalid provider');
  }

  const response = await fetchWrapper(url, { headers });
  if (!response.ok) {
    throw new Error(`${aiProvider} API status ${response.status}`);
  }

  const data: any = await response.json();
  let models: ModelInfo[] = [];

  switch (aiProvider) {
    case 'gemini':
      models = data.models?.map((m: any) => ({
        id: m.name.includes('models/') ? m.name.replace('models/', '') : m.name,
        name: m.displayName || m.name,
      })) || [];
      break;
    case 'anthropic':
      models = data.data?.map((m: any) => ({
        id: m.id,
        name: m.display_name || m.id,
      })) || [];
      break;
    case 'openrouter':
      models = data.data?.map((m: any) => ({
        id: m.id,
        name: m.name || m.id,
      })) || [];
      break;
    case 'nvidia':
      models = data.data?.map((m: any) => ({
        id: m.id,
        name: m.id,
      })) || [];
      break;
    case 'opencode_zen':
      models = data.data?.map((m: any) => ({
        id: m.id,
        name: m.id,
      })) || [];
      break;
  }

  if (models.length === 0) {
    throw new Error(`No models returned from ${aiProvider}`);
  }
  return models;
}

export async function fetchHint(
  question: string,
  exerciseContext: { question?: string; hint?: string; code?: string } | undefined,
  config: ProviderConfig
): Promise<string> {
  const { aiProvider, apiKey, baseUrl, selectedModel } = config;
  if (!apiKey) throw new Error('API Key missing');

  const systemPrompt = `
    You are Slythe, the witty, humorous and supportive Python & AI/ML tutor from PyDuo platform.
    Your goal is to guide the student who is stuck on a coding lesson.
    
    CRITICAL INSTRUCTIONS:
    1. Speak EXCLUSIVELY in friendly Roman Hindi (Hindi written using the English/Latin alphabet). Example: "Arre bhai! Dekh variable assignment me space hai kya? Chinta mat kar, tum solve kar loge!"
    2. Resemble a helpful, caring tech-bro ('bhai') or college senior. Use phrases like "Bhai", "Arre yaar", "Suno", "Bilkul sahi", "Fikar mat kar".
    3. Do NOT reveal the direct code answer or direct options answer immediately unless the student specifically asks for it. Help them reason!
    4. Keep the explanation short, clean, and extremely encouraging (under 120 words).
  `;

  const promptText = `
    Current Exercise Question: "${exerciseContext?.question || 'General Python Query'}"
    Context Hints: "${exerciseContext?.hint || ''}"
    Student Question: "${question || 'Bhai, hint do!'}"
    Code context (if any):
    \`\`\`python
    ${exerciseContext?.code || ''}
    \`\`\`
  `;

  let replyText = '';

  if (!selectedModel) {
    throw new Error('Pehle Settings me jaakar API se models fetch karo aur ek model select karo! Bina model ke AI call nahi ho sakti.');
  }
  const modelName = selectedModel;

  if (aiProvider === 'gemini') {
    const activeKey = apiKey;
    
    if (baseUrl) {
      const base = baseUrl.replace(/\/$/, '');
      const url = `${base}/v1beta/models/${modelName}:generateContent?key=${activeKey}`;
      const response = await doFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt + "\n\n" + promptText }] }],
          generationConfig: { temperature: 0.8 }
        })
      });
      if (!response.ok) throw new Error(`Gemini API status ${response.status}`);
      const data: any = await response.json();
      replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else {
      const { GoogleGenAI } = await import('@google/genai');
      const customAi = new GoogleGenAI({
        apiKey: activeKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });
      const response = await customAi.models.generateContent({
        model: modelName,
        contents: promptText,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.8,
        },
      });
      replyText = response.text || '';
    }
  } else if (aiProvider === 'anthropic') {
    const base = baseUrl?.replace(/\/$/, '') || 'https://api.anthropic.com';
    const url = base.includes('/v1/messages') ? base : `${base}/v1/messages`;
    
    const response = await doFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: modelName,
        max_tokens: 300,
        system: systemPrompt,
        messages: [{ role: 'user', content: promptText }],
      }),
    });
    if (!response.ok) throw new Error('Anthropic API failed');
    const data: any = await response.json();
    replyText = data.content?.[0]?.text || '';
  } else if (aiProvider === 'openrouter') {
    const base = baseUrl?.replace(/\/$/, '') || 'https://openrouter.ai/api';
    const url = base.includes('/v1/chat/completions') ? base : `${base}/v1/chat/completions`;

    const response = await doFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: promptText },
        ],
      }),
    });
    if (!response.ok) throw new Error('OpenRouter API failed');
    const data: any = await response.json();
    replyText = data.choices?.[0]?.message?.content || '';
  } else if (aiProvider === 'nvidia') {
    const base = baseUrl?.replace(/\/$/, '') || 'https://integrate.api.nvidia.com';
    const url = base.includes('/v1/chat/completions') ? base : `${base}/v1/chat/completions`;

    const response = await doFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: promptText },
        ],
      }),
    });
    if (!response.ok) throw new Error('NVIDIA API failed');
    const data: any = await response.json();
    replyText = data.choices?.[0]?.message?.content || '';
  } else if (aiProvider === 'opencode_zen') {
    const base = baseUrl?.replace(/\/$/, '') || 'https://api.opencodezen.com';
    const url = base.includes('/v1/chat/completions') ? base : `${base}/v1/chat/completions`;

    const response = await doFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: promptText },
        ],
      }),
    });
    if (!response.ok) throw new Error('Opencode Zen API failed');
    const data: any = await response.json();
    replyText = data.choices?.[0]?.message?.content || '';
  }

  if (!replyText) {
    throw new Error('Empty response from AI');
  }

  return replyText;
}