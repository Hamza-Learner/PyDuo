import React, { useRef, useState } from 'react';
import { Settings, Volume2, VolumeX, Eye, Sparkles, Download, Upload, ShieldAlert, Check, Key, Cpu, Globe, EyeOff, Wifi } from 'lucide-react';
import { Settings as SettingsType } from '../types';
import { fetchModels, type ProviderConfig } from '../utils/api';

interface SettingsPageProps {
  settings: SettingsType;
  onUpdateSettings: (settings: SettingsType) => void;
  onExportData: () => void;
  onImportData: (jsonData: string) => void;
}

const PROVIDER_MODELS: Record<string, { id: string; name: string }[]> = {
  gemini: [
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (Super Fast)' },
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro (Smarter & Detailed)' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
  ],
  anthropic: [
    { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet' },
    { id: 'claude-3-5-haiku', name: 'Claude 3.5 Haiku' },
    { id: 'claude-3-opus', name: 'Claude 3 Opus' },
  ],
  openrouter: [
    { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B Instruct' },
    { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash (OpenRouter)' },
    { id: 'mistralai/mixtral-8x7b-instruct', name: 'Mixtral 8x7B' },
  ],
  nvidia: [
    { id: 'nvidia/llama-3.1-nemotron-70b-instruct', name: 'Llama 3.1 Nemotron 70B' },
    { id: 'meta/llama-3.1-8b-instruct', name: 'Llama 3.1 8B' },
  ],
  opencode_zen: [
    { id: 'opencode-zen-3b-instruct', name: 'Opencode Zen 3B Instruct' },
    { id: 'opencode-zen-7b-coder', name: 'Opencode Zen 7B Coder (Recommended)' },
    { id: 'opencode-zen-70b-pro', name: 'Opencode Zen 70B Pro' },
  ],
};

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  onExportData,
  onImportData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showKey, setShowKey] = useState(false);
  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const [fetchStatus, setFetchStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [fetchMessage, setFetchMessage] = useState('');
  
  const currentProvider = settings.aiProvider || 'gemini';

  // Dynamic Model Fetching state
  const [fetchedModels, setFetchedModels] = useState<{ id: string; name: string }[]>(() => {
    if (settings.selectedModel) {
      return [{ id: settings.selectedModel, name: settings.selectedModel }];
    }
    return [];
  });
  const [hasFetched, setHasFetched] = useState(() => !!settings.selectedModel);

  const handleThemeChange = (theme: 'light' | 'dark') => {
    onUpdateSettings({ ...settings, theme });
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSoundToggle = () => {
    onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled });
  };

  const handleMotionToggle = () => {
    onUpdateSettings({ ...settings, reducedMotion: !settings.reducedMotion });
  };

  const triggerImportFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        onImportData(text);
      }
    };
    reader.readAsText(file);
  };

  const handleProviderChange = (provider: 'gemini' | 'anthropic' | 'openrouter' | 'nvidia' | 'opencode_zen') => {
    onUpdateSettings({
      ...settings,
      aiProvider: provider,
      selectedModel: '',
    });
    setFetchedModels([]);
    setHasFetched(false);
    setFetchStatus('idle');
    setFetchMessage('');
  };

  const handleApiKeyChange = (val: string) => {
    const keyField = `${currentProvider}ApiKey`;
    onUpdateSettings({
      ...settings,
      [keyField]: val,
    });
  };

  const handleBaseUrlChange = (val: string) => {
    const urlField = `${currentProvider}BaseUrl`;
    onUpdateSettings({
      ...settings,
      [urlField]: val,
    });
  };

  const handleModelChange = (modelId: string) => {
    onUpdateSettings({
      ...settings,
      selectedModel: modelId,
    });
  };

  // Real fetch from provider API directly (bypass CORS via Capacitor HTTP or direct fetch)
  const fetchAvailableModels = async () => {
    const currentKey = settings[`${currentProvider}ApiKey` as keyof SettingsType];
    const customBaseUrl = settings[`${currentProvider}BaseUrl` as keyof SettingsType];

    // Gemini has optional key support because it can use backend fallback, but others require keys
    if (!currentKey && currentProvider !== 'gemini') {
      setFetchStatus('error');
      setFetchMessage(`Arre bhai! Pehle upar API Key toh dalo! Bina key ke models kaise fetch honge?`);
      return;
    }

    setIsFetchingModels(true);
    setFetchStatus('loading');
    setFetchMessage(`Connecting securely to ${currentProvider === 'opencode_zen' ? 'Opencode Zen' : currentProvider.toUpperCase()} API and synchronizing model versions...`);

    try {
      if (!navigator.onLine) {
        throw new Error('Arre bhai! Internet connect karo pehle! AI model sync ke liye online hona zaroori hai.');
      }

      const providerConfig: ProviderConfig = {
        aiProvider: currentProvider,
        apiKey: currentKey as string,
        baseUrl: customBaseUrl as string,
        selectedModel: settings.selectedModel as string,
      };

      const models = await fetchModels(providerConfig);

      setFetchedModels(models);
      setHasFetched(true);

      // Select first model automatically
      onUpdateSettings({
        ...settings,
        selectedModel: models[0].id,
      });

      setFetchStatus('success');
      setFetchMessage(`Shabash! ${models.length} active models fetched successfully for ${currentProvider === 'opencode_zen' ? 'OPENCODE ZEN' : currentProvider.toUpperCase()} directly from the provider API.`);
    } catch (err: any) {
      setFetchStatus('error');
      setFetchMessage(err.message || 'Kuch toh gadbad hai! API Key aur Base URL sahi se check karo yaar.');
    } finally {
      setIsFetchingModels(false);
    }
  };

  const getActiveKey = () => {
    return (settings[`${currentProvider}ApiKey` as keyof SettingsType] as string) || '';
  };

  const getActiveBaseUrl = () => {
    return (settings[`${currentProvider}BaseUrl` as keyof SettingsType] as string) || '';
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 select-none">
      <div className="text-center max-w-md mx-auto mb-10">
        <h2 className="text-3xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
          System Preferences
        </h2>
        <p className="text-slate-500 mt-2">
          Configure canvas theme, sound queues, motion behaviors, and custom AI coding mentors.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-900 shadow-xl flex flex-col gap-6">
        
        {/* Visual Canvas Theme */}
        <div className="flex flex-col gap-3 pb-6 border-b border-slate-100 dark:border-slate-850">
          <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">Visual Interface Theme</span>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleThemeChange('light')}
              id="theme_light_button"
              className={`p-4 rounded-2xl border-2 border-b-4 font-black font-display text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                settings.theme === 'light'
                  ? 'border-[#58CC02] bg-emerald-50/5 text-emerald-600 dark:text-emerald-400'
                  : 'border-slate-200 dark:border-slate-800 border-b-slate-300 dark:border-b-slate-950 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              ☀️ Light Theme
              {settings.theme === 'light' && <Check className="w-4 h-4 text-[#58CC02]" />}
            </button>

            <button
              onClick={() => handleThemeChange('dark')}
              id="theme_dark_button"
              className={`p-4 rounded-2xl border-2 border-b-4 font-black font-display text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                settings.theme === 'dark'
                  ? 'border-[#58CC02] bg-emerald-950/10 text-[#58CC02] dark:text-[#FFD43B]'
                  : 'border-slate-200 dark:border-slate-800 border-b-slate-300 dark:border-b-slate-950 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              🌙 Dark Theme
              {settings.theme === 'dark' && <Check className="w-4 h-4 text-[#58CC02]" />}
            </button>
          </div>
        </div>

        {/* Auditory Settings */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-850">
          <div>
            <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider block">Sound Feedback</span>
            <span className="text-sm font-extrabold font-display leading-none mt-1 block">Game Haptic Sounds</span>
            <span className="text-xs text-slate-400 block mt-0.5">Toggle sound indicators on answer submit</span>
          </div>

          <button
            onClick={handleSoundToggle}
            id="sound_toggle_button"
            className={`p-3 rounded-2xl border-2 border-b-4 transition-all cursor-pointer ${
              settings.soundEnabled
                ? 'bg-emerald-500/10 border-[#58CC02] text-emerald-600 dark:text-emerald-400'
                : 'bg-slate-100 border-slate-200 border-b-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:border-b-slate-950 text-slate-400'
            }`}
          >
            {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

        {/* Accessibility reduced motion */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-850">
          <div>
            <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider block">Accessibility Configuration</span>
            <span className="text-sm font-extrabold font-display leading-none mt-1 block">Reduced Motion Mode</span>
            <span className="text-xs text-slate-400 block mt-0.5">Minimize transitions and background mascot animations</span>
          </div>

          <button
            onClick={handleMotionToggle}
            id="motion_toggle_button"
            className={`p-3 rounded-2xl border-2 border-b-4 transition-all cursor-pointer ${
              settings.reducedMotion
                ? 'bg-emerald-500/10 border-[#58CC02] text-emerald-600 dark:text-emerald-400'
                : 'bg-slate-100 border-slate-200 border-b-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:border-b-slate-950 text-slate-400'
            }`}
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>

        {/* Bhai's custom AI Mentor Provider */}
        <div className="flex flex-col gap-4 pb-6 border-b border-slate-100 dark:border-slate-850">
          <div>
            <span className="text-xs font-bold text-amber-500 font-mono uppercase tracking-wider block">Bhai's AI Model Configurator</span>
            <span className="text-sm font-extrabold font-display leading-none mt-1 block">Choose AI Mentor Provider</span>
            <span className="text-xs text-slate-400 block mt-0.5">Select models from Gemini, Anthropic, OpenRouter, NVIDIA NIM, or Opencode Zen</span>
          </div>

          {/* Provider Select Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-1">
            {(['gemini', 'anthropic', 'openrouter', 'nvidia', 'opencode_zen'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handleProviderChange(p)}
                className={`p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer capitalize transition-all ${
                  currentProvider === p
                    ? 'border-amber-500 bg-amber-550/10 text-amber-600 dark:text-amber-400 ring-2 ring-amber-500/15'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400'
                }`}
              >
                {p === 'gemini' ? 'Google' : p === 'anthropic' ? 'Anthropic' : p === 'openrouter' ? 'OpenRouter' : p === 'nvidia' ? 'NVIDIA NIM' : 'Opencode Zen'}
              </button>
            ))}
          </div>

          {/* Base URL Input */}
          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Enter {currentProvider === 'opencode_zen' ? 'OPENCODE ZEN' : currentProvider.toUpperCase()} Base URL (Optional):
            </label>
            <div className="relative">
              <input
                type="text"
                value={getActiveBaseUrl()}
                onChange={(e) => handleBaseUrlChange(e.target.value)}
                placeholder={
                  currentProvider === 'gemini'
                    ? 'https://generativelanguage.googleapis.com'
                    : currentProvider === 'anthropic'
                    ? 'https://api.anthropic.com'
                    : currentProvider === 'openrouter'
                    ? 'https://openrouter.ai/api'
                    : currentProvider === 'nvidia'
                    ? 'https://integrate.api.nvidia.com'
                    : 'https://api.opencodezen.com'
                }
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-800 dark:text-slate-100 font-mono"
              />
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
              Default is used if left blank. Override this to use a proxy, reverse-proxy, or custom endpoint.
            </span>
          </div>

          {/* API Key Input */}
          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Key className="w-3.5 h-3.5" /> Enter {currentProvider === 'opencode_zen' ? 'OPENCODE ZEN' : currentProvider.toUpperCase()} API Key:
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={getActiveKey()}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder={`Paste your ${currentProvider === 'gemini' ? 'Gemini AI' : currentProvider === 'anthropic' ? 'Claude' : currentProvider === 'openrouter' ? 'OpenRouter' : currentProvider === 'nvidia' ? 'NVIDIA NIM' : 'Opencode Zen'} API Key`}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 px-4 py-3 pr-10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-800 dark:text-slate-100 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Load Available Models Button & Model Dropdown */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mt-2">
            <button
              type="button"
              onClick={fetchAvailableModels}
              disabled={isFetchingModels}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Wifi className="w-4 h-4" /> Fetch Active Models
            </button>

            {/* Model Selector Dropdown - ONLY shown if models are fetched successfully */}
            <div className="flex-1 max-w-xs flex flex-col gap-1.5">
              {hasFetched && fetchedModels.length > 0 ? (
                <select
                  value={settings.selectedModel || ''}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  {fetchedModels.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-full bg-slate-55/10 border border-slate-200 dark:border-slate-800 px-3 py-2.5 rounded-xl text-[11px] font-mono font-medium text-slate-400 dark:text-slate-500 text-center select-none">
                  ⚠️ Models lock: Click 'Fetch Active Models'
                </div>
              )}
            </div>
          </div>

          {/* Fetch feedback message */}
          {fetchMessage && (
            <div className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2 ${
              fetchStatus === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/50 text-emerald-800 dark:text-emerald-300'
                : fetchStatus === 'error'
                ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200/50 text-rose-800 dark:text-rose-300'
                : 'bg-blue-50 dark:bg-blue-950/20 border-blue-200/50 text-blue-800 dark:text-blue-300 animate-pulse'
            }`}>
              {fetchStatus === 'success' ? <Check className="w-4 h-4 shrink-0 mt-0.5" /> : <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />}
              <span>{fetchMessage}</span>
            </div>
          )}

          {/* Help Notice */}
          <div className="bg-amber-50/5 dark:bg-amber-950/5 border border-dashed border-amber-500/20 p-3.5 rounded-2xl text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
            💡 <strong>Pro Tip:</strong> Agar upar se API validation error aaye, check internet or server speed. Tab tak local help hints aur exercises se badhte raho. Tum kar loge!
          </div>
        </div>

        {/* Local Backup and Portability */}
        <div className="flex flex-col gap-4">
          <div>
            <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider block">Local Progress Backup</span>
            <span className="text-sm font-extrabold font-display leading-none mt-1 block">Import & Export Sandbox Progress</span>
            <span className="text-xs text-slate-400 block mt-0.5">Save your stats and lesson milestones locally, or resume anywhere.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            <button
              onClick={onExportData}
              id="export_progress_button"
              className="p-4 rounded-2xl bouncy-btn-slate font-black font-display text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-500" /> Export Backup (.json)
            </button>

            <button
              onClick={triggerImportFile}
              id="import_progress_button"
              className="p-4 rounded-2xl bouncy-btn-slate font-black font-display text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-sky-500" /> Import Backup (.json)
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileImport}
            accept=".json"
            className="hidden"
          />
        </div>

      </div>
    </div>
  );
};
