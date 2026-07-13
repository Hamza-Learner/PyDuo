import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Shared reference for lazy client initialization
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY is not defined in user secrets');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Full-stack secure endpoint: /api/models
app.post('/api/models', async (req, res) => {
  const { provider, apiKey, baseUrl } = req.body;
  try {
    let url = '';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (provider === 'gemini') {
      const activeKey = apiKey || process.env.GEMINI_API_KEY;
      if (!activeKey) {
        return res.status(400).json({ error: 'Gemini API Key missing' });
      }
      let base = baseUrl ? baseUrl.replace(/\/$/, '') : 'https://generativelanguage.googleapis.com';
      if (!base.includes('/v1')) {
        url = `${base}/v1beta/models?key=${activeKey}`;
      } else {
        url = `${base}/models?key=${activeKey}`;
      }
      
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`Google API status ${response.status}`);
      }
      const data: any = await response.json();
      const models = data.models ? data.models.map((m: any) => ({
        id: m.name.includes('models/') ? m.name.replace('models/', '') : m.name,
        name: m.displayName || m.name
      })) : [];
      return res.json({ models });

    } else if (provider === 'anthropic') {
      if (!apiKey) {
        return res.status(400).json({ error: 'Anthropic API Key missing' });
      }
      let base = baseUrl ? baseUrl.replace(/\/$/, '') : 'https://api.anthropic.com';
      url = base.includes('/v1') ? base : `${base}/v1/models`;
      headers['x-api-key'] = apiKey;
      headers['anthropic-version'] = '2023-06-01';

      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`Anthropic API status ${response.status}`);
      }
      const data: any = await response.json();
      const models = data.data ? data.data.map((m: any) => ({
        id: m.id,
        name: m.display_name || m.id
      })) : [];
      return res.json({ models });

    } else if (provider === 'openrouter') {
      if (!apiKey) {
        return res.status(400).json({ error: 'OpenRouter API Key missing' });
      }
      let base = baseUrl ? baseUrl.replace(/\/$/, '') : 'https://openrouter.ai/api';
      url = base.includes('/v1/models') ? base : `${base}/v1/models`;
      headers['Authorization'] = `Bearer ${apiKey}`;

      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`OpenRouter API status ${response.status}`);
      }
      const data: any = await response.json();
      const models = data.data ? data.data.map((m: any) => ({
        id: m.id,
        name: m.name || m.id
      })) : [];
      return res.json({ models });

    } else if (provider === 'nvidia') {
      if (!apiKey) {
        return res.status(400).json({ error: 'NVIDIA API Key missing' });
      }
      let base = baseUrl ? baseUrl.replace(/\/$/, '') : 'https://integrate.api.nvidia.com';
      url = base.includes('/v1') ? base : `${base}/v1/models`;
      headers['Authorization'] = `Bearer ${apiKey}`;

      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`NVIDIA API status ${response.status}`);
      }
      const data: any = await response.json();
      const models = data.data ? data.data.map((m: any) => ({
        id: m.id,
        name: m.id
      })) : [];
      return res.json({ models });

    } else if (provider === 'opencode_zen') {
      if (!apiKey) {
        return res.status(400).json({ error: 'Opencode Zen API Key missing' });
      }
      let base = baseUrl ? baseUrl.replace(/\/$/, '') : 'https://api.opencodezen.com';
      url = base.includes('/v1') ? base : `${base}/v1/models`;
      headers['Authorization'] = `Bearer ${apiKey}`;

      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`Opencode Zen API status ${response.status}`);
      }
      const data: any = await response.json();
      const models = data.data ? data.data.map((m: any) => ({
        id: m.id,
        name: m.id
      })) : [];
      return res.json({ models });
    }

    return res.status(400).json({ error: 'Invalid provider' });

  } catch (error: any) {
    console.error('Fetch Models Error:', error?.message);
    return res.status(500).json({ error: error?.message || 'Failed to fetch models from API' });
  }
});

// Full-stack secure endpoint: /api/hint
app.post('/api/hint', async (req, res) => {
  const { question, exerciseContext, providerConfig } = req.body;

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

  try {
    const provider = providerConfig?.aiProvider || 'gemini';
    const userApiKey = providerConfig?.apiKey;
    const chosenModel = providerConfig?.selectedModel;
    const baseUrl = providerConfig?.baseUrl;

    let replyText = '';

    if (provider === 'gemini') {
      const activeKey = userApiKey || process.env.GEMINI_API_KEY;
      if (!activeKey) {
        throw new Error('NO_KEY');
      }
      const modelName = chosenModel || 'gemini-3.5-flash';
      
      // If user has a custom baseUrl, fetch it via standard HTTP call to support proxy custom endpoints
      if (baseUrl) {
        let base = baseUrl.replace(/\/$/, '');
        const url = `${base}/v1beta/models/${modelName}:generateContent?key=${activeKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt + "\n\n" + promptText }] }],
            generationConfig: { temperature: 0.8 }
          })
        });
        if (!response.ok) throw new Error(`PROXY_GEMINI_FAIL status ${response.status}`);
        const data: any = await response.json();
        replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      } else {
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
    } else if (provider === 'anthropic') {
      if (!userApiKey) throw new Error('NO_KEY');
      let base = baseUrl ? baseUrl.replace(/\/$/, '') : 'https://api.anthropic.com';
      const url = base.includes('/v1/messages') ? base : `${base}/v1/messages`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': userApiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: chosenModel || 'claude-3-5-sonnet',
          max_tokens: 300,
          system: systemPrompt,
          messages: [{ role: 'user', content: promptText }],
        }),
      });
      if (!response.ok) throw new Error('API_FAIL');
      const data: any = await response.json();
      replyText = data.content?.[0]?.text || '';
    } else if (provider === 'openrouter') {
      if (!userApiKey) throw new Error('NO_KEY');
      let base = baseUrl ? baseUrl.replace(/\/$/, '') : 'https://openrouter.ai/api';
      const url = base.includes('/v1/chat/completions') ? base : `${base}/v1/chat/completions`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userApiKey}`,
        },
        body: JSON.stringify({
          model: chosenModel || 'meta-llama/llama-3.1-70b-instruct',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: promptText },
          ],
        }),
      });
      if (!response.ok) throw new Error('API_FAIL');
      const data: any = await response.json();
      replyText = data.choices?.[0]?.message?.content || '';
    } else if (provider === 'nvidia') {
      if (!userApiKey) throw new Error('NO_KEY');
      let base = baseUrl ? baseUrl.replace(/\/$/, '') : 'https://integrate.api.nvidia.com';
      const url = base.includes('/v1/chat/completions') ? base : `${base}/v1/chat/completions`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userApiKey}`,
        },
        body: JSON.stringify({
          model: chosenModel || 'nvidia/llama-3.1-nemotron-70b-instruct',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: promptText },
          ],
        }),
      });
      if (!response.ok) throw new Error('API_FAIL');
      const data: any = await response.json();
      replyText = data.choices?.[0]?.message?.content || '';
    } else if (provider === 'opencode_zen') {
      if (!userApiKey) throw new Error('NO_KEY');
      let base = baseUrl ? baseUrl.replace(/\/$/, '') : 'https://api.opencodezen.com';
      const url = base.includes('/v1/chat/completions') ? base : `${base}/v1/chat/completions`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userApiKey}`,
        },
        body: JSON.stringify({
          model: chosenModel || 'opencode-zen-7b-coder',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: promptText },
          ],
        }),
      });
      if (!response.ok) throw new Error('API_FAIL');
      const data: any = await response.json();
      replyText = data.choices?.[0]?.message?.content || '';
    }

    if (!replyText) {
      throw new Error('EMPTY_RESPONSE');
    }

    res.json({ reply: replyText });

  } catch (error: any) {
    console.error("LLM Provider Execution Error: ", error?.message);
    
    // Always return the user-specified feedback message on key configure error or speed/failure
    res.json({
      reply: "Arre bhai! Tera Gemini API Key configure nahi hai, ya server response slow hai! Setting menu me Secrets check kar. Tab tak dhyan se check karo local hint ko, tum kar loge!"
    });
  }
});

// Configure Vite integration for dev vs prod environments
async function bootstrapServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Highly robust path checking for production environments to prevent "Page not found"
    let distPath = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(path.join(distPath, 'index.html'))) {
      distPath = path.resolve(__dirname, '..', 'dist');
    }
    if (!fs.existsSync(path.join(distPath, 'index.html'))) {
      distPath = path.resolve(__dirname, 'dist');
    }

    console.log(`[Production] Serving static files from verified path: ${distPath}`);
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Error: Static production files (dist/index.html) not found on server.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PyDuo backend server running on http://localhost:${PORT}`);
  });
}

bootstrapServer();
