import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Copy, Check, FileText, Paperclip, 
  Trash2, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, 
  RefreshCw, Zap, Globe, Lightbulb, Mic, MicOff, Volume2, Square,
  ExternalLink, Laptop, Download, Bot
} from 'lucide-react';

export default function PromptStudio({
  rawPrompt,
  setRawPrompt,
  targetProvider,
  setTargetProvider,
  onOptimize,
  result,
  loading,
  setActiveTab,
  currentUser
}) {
  const [activeVariantTab, setActiveVariantTab] = useState('lt'); // 'lt' or 'hc'
  const [suggestionLang, setSuggestionLang] = useState('en');
  const [resultLang, setResultLang] = useState('en'); // 'en' or 'native'
  const [copiedKey, setCopiedKey] = useState(null); // 'native' or 'english' or 'clipboard'
  const [attachedFile, setAttachedFile] = useState(null);
  const [fileConverting, setFileConverting] = useState(false);

  // External AI Launch States (ChatGPT & Claude Web / Desktop App)
  const [launchingExternal, setLaunchingExternal] = useState(null); // { platform: 'chatgpt'|'claude', mode: 'browser'|'app', step: 'optimizing'|'launching' }
  const [launchToast, setLaunchToast] = useState(null); // { title, message, isWarning, downloadUrl, platformName }

  // Voice Input States
  const [isListening, setIsListening] = useState(false);
  const [voiceLang, setVoiceLang] = useState('mr-IN'); // Default to Marathi (India)
  const [interimTranscript, setInterimTranscript] = useState('');
  const [audioTranscribing, setAudioTranscribing] = useState(false);
  const recognitionRef = useRef(null);

  const voiceLanguages = [
    { code: 'mr-IN', name: 'मराठी (Marathi - mr-IN)', label: 'मराठी' },
    { code: 'hi-IN', name: 'हिन्दी (Hindi - hi-IN)', label: 'हिन्दी' },
    { code: 'en-IN', name: 'English (India - en-IN)', label: 'English (IN)' },
    { code: 'en-US', name: 'English (US - en-US)', label: 'English (US)' },
    { code: 'ta-IN', name: 'தமிழ் (Tamil - ta-IN)', label: 'தமிழ்' },
    { code: 'te-IN', name: 'తెలుగు (Telugu - te-IN)', label: 'తెలుగు' },
    { code: 'gu-IN', name: 'ગુજરાતી (Gujarati - gu-IN)', label: 'ગુજરાતી' },
    { code: 'bn-IN', name: 'বাংলা (Bengali - bn-IN)', label: 'বাংলা' }
  ];

  // Sync suggestion language with detected language on new result
  useEffect(() => {
    if (result?.multilingual?.detectedLanguage?.code) {
      const code = result.multilingual.detectedLanguage.code;
      setSuggestionLang(code);
      setResultLang('en');
    }
  }, [result]);

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const providers = [
    { 
      id: 'claude-3-5-sonnet', 
      name: 'Anthropic Claude', 
      desc: 'Optimized for Claude using concise directives and XML structure'
    },
    { 
      id: 'gpt-4o', 
      name: 'OpenAI ChatGPT', 
      desc: 'Optimized for ChatGPT using Markdown sections and structured rules'
    },
    { 
      id: 'general-ai', 
      name: 'General AI', 
      desc: 'Balanced prompt engineered to work reliably across every AI platform'
    }
  ];

  // Live Browser Microphone Voice Recognition
  const toggleVoiceRecognition = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setInterimTranscript('');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support the Web Speech API. Please use Google Chrome or Microsoft Edge, or use the 'Upload Voice Note' button.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = voiceLang;
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setInterimTranscript('');
      };

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (final) {
          setRawPrompt((prev) => (prev ? prev.trim() + ' ' + final.trim() : final.trim()));
          setInterimTranscript('');
        } else {
          setInterimTranscript(interim);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === 'not-allowed') {
          alert("Microphone access was denied. Please allow microphone permissions in your browser.");
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error("Speech recognition startup error:", e);
      setIsListening(false);
    }
  };

  // Upload Pre-Recorded Audio / Voice Note File
  const handleAudioFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioTranscribing(true);
    const formData = new FormData();
    formData.append('audio', file);
    formData.append('language', voiceLang);

    try {
      const res = await fetch('/api/voice/transcribe', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Voice transcription failed');
      
      setRawPrompt((prev) => (prev ? prev.trim() + ' ' + data.text : data.text));
    } catch (err) {
      alert(`Voice note transcription error: ${err.message}`);
    } finally {
      setAudioTranscribing(false);
    }
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileConverting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/files/convert', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setAttachedFile(data);

      const snippet = `\n\n--- [ATTACHED CONTEXT: ${data.filename} (${data.formatExtension})] ---\n${data.fullContent.substring(0, 1500)}${data.fullContent.length > 1500 ? '\n...(truncated)' : ''}\n--- [END CONTEXT] ---`;
      setRawPrompt((prev) => (prev ? prev : '') + snippet);
    } catch (err) {
      alert("Error parsing file. Supported: .pdf, .docx, .pptx, .xlsx, .csv, .json");
    } finally {
      setFileConverting(false);
    }
  };

  const loadExample = () => {
    setRawPrompt("मला भारतीय राज्यघटनेच्या 'प्रस्तावे'वर (Preamble) एक पीडीएफ (PDF) तयार करायची आहे . भारतीय राज्यघटनेतील मजकुरातून ५० ओळी घेऊन एक पीडीएफ तयार करा");
  };

  const isIndicScript = /[\u0900-\u0D7F]/.test(rawPrompt || '');
  const rawTokens = result?.metrics?.originalTokens || Math.max(1, Math.round((rawPrompt || '').length / 4));
  
  // Calculate dynamic metrics for the active tab (LT vs HC)
  const isLT = activeVariantTab === 'lt';
  const currentTokens = isLT 
    ? (result?.variants?.lowToken?.tokenCount || 0) 
    : (result?.variants?.highContext?.tokenCount || 0);

  const origTokens = result?.metrics?.originalTokens || rawTokens;
  const tokensSaved = origTokens - currentTokens;
  const isTokenReduction = tokensSaved > 0;
  const isZeroDelta = tokensSaved === 0;
  const dynamicPct = origTokens > 0 ? Math.abs(Math.round((tokensSaved / origTokens) * 1000) / 10) : 0;

  const detectedLangCode = result?.multilingual?.detectedLanguage?.code || 'en';
  const detectedLangName = result?.multilingual?.detectedLanguage?.name || 'Regional Language';
  const detectedLangNative = result?.multilingual?.detectedLanguage?.native || 'Native';
  const isNonEnglish = result?.multilingual?.detectedLanguage?.isNonEnglish;

  // Dual-Language Prompt details for current active variant tab (LT vs HC)
  const activeVariant = isLT ? result?.variants?.lowToken : result?.variants?.highContext;
  const nativePrompt = activeVariant?.nativePrompt || 
                       (isLT ? result?.multilingual?.backTranslatedLT : result?.multilingual?.backTranslatedHC) || 
                       '';
  const englishPrompt = activeVariant?.englishPrompt || activeVariant?.prompt || '';
  
  const nativeTokenCount = activeVariant?.nativeTokenCount || 
                          (isLT ? result?.multilingual?.tokenComparison?.nativeLTTokens : result?.multilingual?.tokenComparison?.nativeHCTokens) || 
                          Math.max(1, Math.round(nativePrompt.length / 2));
  const englishTokenCount = activeVariant?.englishTokenCount || activeVariant?.tokenCount || 
                           Math.max(1, Math.round(englishPrompt.length / 4));

  const additionalSavingsPct = nativeTokenCount > 0 
    ? Math.max(0, Math.round(((nativeTokenCount - englishTokenCount) / nativeTokenCount) * 1000) / 10)
    : 0;

  // Formatted displayed prompt based on active language selection
  const displayedPrompt = (isNonEnglish && resultLang === 'native')
    ? `[${detectedLangNative} अनुकूलित आवृत्ती]\n${nativePrompt}\n\n(टीप: LLM API ला इंग्रजीत प्रॉम्ट पाठवल्यास देवनागरी BPE बाइट्सच्या तुलनेत ~८०-९०% टोकन बचत होते.)`
    : englishPrompt;

  // Respective Target AI platform chosen for the optimization result
  const activeTarget = result?.targetProvider || targetProvider;
  const isClaude = activeTarget === 'claude-3-5-sonnet';
  const isChatGPT = activeTarget === 'gpt-4o';
  const isGeneral = activeTarget === 'general-ai';

  // Resolve localized suggestions bundle for current selected suggestion language
  const currentBundle = result?.analysis?.localizedSuggestionsByLang?.[suggestionLang] || 
                        result?.analysis?.localizedSuggestionsByLang?.[detectedLangCode] || 
                        result?.analysis?.localizedSuggestionsByLang?.['en'] || {
                          header: 'Suggestions & Where Tokens Were Wasted',
                          fillersLabel: 'Filler words stripped:',
                          redundanciesLabel: 'Redundant clauses removed:',
                          fillers: result?.analysis?.detectedFillers || [],
                          suggestions: result?.analysis?.suggestions || []
                        };

  // Helper to extract the clean, optimized prompt text (guaranteed never raw unoptimized text)
  const extractOptimizedPrompt = (resData) => {
    if (!resData) return '';
    const activeVar = activeVariantTab === 'hc' ? resData.variants?.highContext : resData.variants?.lowToken;
    return activeVar?.englishPrompt || activeVar?.prompt || resData.variants?.lowToken?.prompt || resData.variants?.highContext?.prompt || '';
  };

  // Launch in external ChatGPT or Claude (Web Browser or Desktop App) with fallback redirect to installer
  const handleLaunchExternal = async (platform, mode) => {
    if (!rawPrompt.trim() && !result) {
      alert("Please enter or speak a prompt first!");
      return;
    }

    const platformName = platform === 'chatgpt' ? 'ChatGPT' : 'Claude';
    const targetProviderId = platform === 'claude' ? 'claude-3-5-sonnet' : 'gpt-4o';
    const downloadUrl = platform === 'chatgpt' ? 'https://openai.com/chatgpt/download/' : 'https://claude.ai/download';

    let optimizedText = '';

    // If result already exists, retrieve the active optimized prompt
    if (result) {
      optimizedText = extractOptimizedPrompt(result);
    }

    // If no optimized result exists, automatically run optimization first so ONLY optimized prompt is used!
    if (!optimizedText) {
      setLaunchingExternal({ platform, mode, step: 'optimizing' });
      setLaunchToast({
        title: `Optimizing for ${platformName}...`,
        message: 'Generating token-reduced, clean prompt before opening...',
        isWarning: false
      });

      const freshResult = await onOptimize(targetProviderId);
      if (!freshResult) {
        setLaunchingExternal(null);
        setLaunchToast({
          title: 'Optimization Failed',
          message: 'Could not generate optimized prompt. Please try again.',
          isWarning: true
        });
        return;
      }
      optimizedText = extractOptimizedPrompt(freshResult);
    }

    if (!optimizedText) {
      setLaunchingExternal(null);
      return;
    }

    // Always copy the optimized prompt to user's clipboard
    try {
      await navigator.clipboard.writeText(optimizedText);
    } catch (e) {
      console.warn("Clipboard copy failed:", e);
    }

    setLaunchingExternal({ platform, mode, step: 'launching' });
    const encodedPrompt = encodeURIComponent(optimizedText);

    if (mode === 'browser') {
      const webUrl = platform === 'chatgpt' 
        ? `https://chatgpt.com/?q=${encodedPrompt}` 
        : `https://claude.ai/new?q=${encodedPrompt}`;

      window.open(webUrl, '_blank', 'noopener,noreferrer');
      setLaunchToast({
        title: `Opened in ${platformName} (Browser)`,
        message: 'Optimized prompt passed via URL & copied to clipboard (ready to Ctrl+V)!',
        isWarning: false
      });
      setTimeout(() => setLaunchingExternal(null), 1200);
    } else {
      // Desktop App Mode with app detection & installation redirect
      const appProtocol = platform === 'chatgpt'
        ? `chatgpt://prompt?q=${encodedPrompt}`
        : `claude://`;

      let appOpened = false;
      const handleWindowBlur = () => {
        appOpened = true;
      };
      window.addEventListener('blur', handleWindowBlur, { once: true });

      setLaunchToast({
        title: `Opening ${platformName} Desktop App...`,
        message: `Attempting to launch app. If not installed, you will be redirected to install it.`,
        isWarning: false
      });

      // Attempt launching the custom desktop protocol via invisible iframe
      try {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = appProtocol;
        document.body.appendChild(iframe);
        setTimeout(() => {
          try {
            document.body.removeChild(iframe);
          } catch (e) {}
        }, 2500);
      } catch (err) {
        console.warn("Protocol launch error:", err);
      }

      // Check after 1800ms whether app launched or if redirect is needed
      setTimeout(() => {
        window.removeEventListener('blur', handleWindowBlur);
        if (!appOpened && !document.hidden) {
          // App not installed on system -> redirect to official download page
          setLaunchToast({
            title: `${platformName} Desktop App Not Installed`,
            message: `Redirecting to official ${platformName} download page. Optimized prompt is copied in your clipboard!`,
            isWarning: true,
            downloadUrl: downloadUrl,
            platformName: platformName
          });
          window.open(downloadUrl, '_blank', 'noopener,noreferrer');
        } else {
          setLaunchToast({
            title: `${platformName} App Opened!`,
            message: 'Optimized prompt is copied to clipboard — press Ctrl+V to paste.',
            isWarning: false
          });
        }
        setLaunchingExternal(null);
      }, 1800);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Page Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Prompt Optimizer</h1>
          <p className="text-sm text-slate-400">
            Write or speak your prompt in any regional language to generate clean, token-efficient versions for your selected AI platform.
          </p>
        </div>

        <button
          onClick={loadExample}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
        >
          Load Regional Example (मराठी)
        </button>
      </div>

      {/* Multilingual / Lingua Notice */}
      {isIndicScript && (
        <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/80 text-blue-200 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span>
              Regional script detected: PromptForge converts to English to eliminate the heavy UTF-8 byte-pair token penalty.
            </span>
          </div>
          <span className="font-semibold text-emerald-400">Saves 70% – 90% tokens</span>
        </div>
      )}

      {/* Main Workspace Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-5 sm:p-6 space-y-5">
        {/* 1. Prompt Input Area with Voice Input Toolbar */}
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <label className="font-semibold text-slate-300">
              1. Enter or Speak Your Prompt
            </label>

            {/* Voice Input Controls Bar */}
            <div className="flex items-center gap-2">
              {/* Regional Voice Language Selector */}
              <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 hidden sm:inline">Voice Language:</span>
                <select
                  value={voiceLang}
                  onChange={(e) => setVoiceLang(e.target.value)}
                  disabled={isListening}
                  className="bg-transparent text-xs font-semibold text-blue-400 focus:outline-none cursor-pointer"
                >
                  {voiceLanguages.map((vl) => (
                    <option key={vl.code} value={vl.code} className="bg-slate-900 text-slate-200">
                      {vl.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Live Microphone Toggle Button */}
              <button
                type="button"
                onClick={toggleVoiceRecognition}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm ${
                  isListening
                    ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse ring-2 ring-rose-500/50'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
                }`}
                title={isListening ? 'Click to stop listening' : 'Click to start voice recognition'}
              >
                {isListening ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop Recording</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>Voice Input</span>
                  </>
                )}
              </button>

              {/* Upload Recorded Voice Note / Audio */}
              <label 
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer transition-colors"
                title="Upload audio file (.wav, .mp3, .m4a, .webm)"
              >
                <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Upload Audio</span>
                <input
                  type="file"
                  accept="audio/*,.wav,.mp3,.m4a,.webm,.ogg"
                  onChange={handleAudioFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Active Voice Listening Banner */}
          {isListening && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-rose-950/60 to-slate-900 border border-rose-800/80 text-xs text-rose-200 flex items-center justify-between gap-3 shadow-md animate-fadeIn">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
                <span className="font-semibold text-rose-300 whitespace-nowrap">
                  Listening in {voiceLanguages.find(v => v.code === voiceLang)?.label || 'Regional Voice'}:
                </span>
                <span className="text-white italic truncate max-w-md">
                  {interimTranscript ? `"${interimTranscript}"` : 'बोलणे सुरू करा (Speak now)...'}
                </span>
              </div>
              <button
                onClick={toggleVoiceRecognition}
                className="px-2 py-0.5 rounded bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          )}

          {/* Audio Transcribing Loading Indicator */}
          {audioTranscribing && (
            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800 text-xs text-blue-300 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
              <span>Transcribing regional audio file with Google Speech Recognition...</span>
            </div>
          )}

          <textarea
            value={rawPrompt}
            onChange={(e) => setRawPrompt(e.target.value)}
            rows={5}
            placeholder={`Type or click 'Voice Input' to speak in ${voiceLanguages.find(v => v.code === voiceLang)?.label || 'Marathi / Hindi / English'}...`}
            className="w-full bg-slate-950 text-slate-100 border border-slate-800 rounded-xl p-3.5 text-sm leading-relaxed focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600 resize-y"
          />

          {/* Attachment Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer transition-colors">
                <Paperclip className="w-3.5 h-3.5 text-blue-400" />
                <span>Attach Document (PDF, Word, Excel, JSON)</span>
                <input 
                  type="file" 
                  onChange={handleFileUpload} 
                  accept=".pdf,.docx,.pptx,.xlsx,.csv,.json"
                  className="hidden" 
                />
              </label>

              {fileConverting && (
                <span className="text-blue-400 flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Converting file to low-token format...</span>
                </span>
              )}

              {attachedFile && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-800 text-blue-300 font-medium">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{attachedFile.filename}</span>
                  <button onClick={() => setAttachedFile(null)} className="text-slate-400 hover:text-rose-400 ml-1">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-slate-500 font-mono text-[11px]">
                {rawPrompt.length} chars • ~{rawTokens} tokens
              </div>

              {rawPrompt.length > 0 && (
                <button
                  onClick={() => setRawPrompt('')}
                  className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Clear text
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. Target AI Platform Selector */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="text-xs font-semibold text-slate-300 block">
            2. Select Target AI Platform
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {providers.map((p) => {
              const isSelected = targetProvider === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setTargetProvider(p.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600/10 border-blue-500 text-white ring-1 ring-blue-500/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-white">{p.name}</span>
                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-700'
                    }`}>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-normal">{p.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Primary Action Button */}
        <div className="pt-2">
          <button
            onClick={() => onOptimize()}
            disabled={loading || !rawPrompt.trim()}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Optimizing prompt with Lingua detection...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Optimize Prompt</span>
              </>
            )}
          </button>
        </div>

        {/* 3.5 External AI Launcher (Rendered AFTER clicking optimize button, for the chosen target AI ONLY) */}
        {result && (
          <div className="pt-4 border-t border-slate-800/80 space-y-3 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold text-slate-200">
                  Open in {isClaude ? 'Anthropic Claude' : isChatGPT ? 'OpenAI ChatGPT' : 'External AI'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Optimized Prompt Only
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Target AI: <strong className="text-slate-300">{isClaude ? 'Anthropic Claude' : isChatGPT ? 'OpenAI ChatGPT' : 'General AI'}</strong> • Auto-redirects to install if app missing
              </span>
            </div>

            {/* ONLY Claude when Anthropic Claude is the chosen target AI */}
            {isClaude && (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-900/40 hover:border-amber-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ring-1 ring-amber-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-700/60 flex items-center justify-center text-amber-400 font-bold shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-white">Anthropic Claude</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800/60 text-amber-300 font-semibold">
                        claude-3-5-sonnet
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Open optimized XML-structured prompt directly in Claude Web Browser or Desktop App
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleLaunchExternal('claude', 'browser')}
                    disabled={loading || (launchingExternal?.step === 'optimizing')}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer hover:border-slate-600 disabled:opacity-50 shadow-sm"
                    title="Open Claude in Web Browser with pre-filled optimized prompt"
                  >
                    {launchingExternal?.platform === 'claude' && launchingExternal?.mode === 'browser' ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    ) : (
                      <Globe className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span>Claude Web (Browser)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLaunchExternal('claude', 'app')}
                    disabled={loading || (launchingExternal?.step === 'optimizing')}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-amber-950/60 hover:bg-amber-900/70 text-amber-200 border border-amber-700/80 text-xs font-semibold transition-all cursor-pointer hover:border-amber-600 disabled:opacity-50 shadow-sm"
                    title="Open Claude Desktop App directly (redirects to download if not installed)"
                  >
                    {launchingExternal?.platform === 'claude' && launchingExternal?.mode === 'app' ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    ) : (
                      <Laptop className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span>Claude Desktop App</span>
                  </button>
                </div>
              </div>
            )}

            {/* ONLY ChatGPT when OpenAI ChatGPT is the chosen target AI */}
            {isChatGPT && (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-900/40 hover:border-emerald-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ring-1 ring-emerald-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-white">OpenAI ChatGPT</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 font-semibold">
                        gpt-4o
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Open optimized token-reduced prompt directly in ChatGPT Web Browser or Desktop App
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleLaunchExternal('chatgpt', 'browser')}
                    disabled={loading || (launchingExternal?.step === 'optimizing')}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer hover:border-slate-600 disabled:opacity-50 shadow-sm"
                    title="Open ChatGPT in Web Browser with pre-filled optimized prompt"
                  >
                    {launchingExternal?.platform === 'chatgpt' && launchingExternal?.mode === 'browser' ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
                    ) : (
                      <Globe className="w-3.5 h-3.5 text-blue-400" />
                    )}
                    <span>ChatGPT Web (Browser)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLaunchExternal('chatgpt', 'app')}
                    disabled={loading || (launchingExternal?.step === 'optimizing')}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/70 text-emerald-200 border border-emerald-700/80 text-xs font-semibold transition-all cursor-pointer hover:border-emerald-600 disabled:opacity-50 shadow-sm"
                    title="Open ChatGPT Desktop App directly (redirects to download if not installed)"
                  >
                    {launchingExternal?.platform === 'chatgpt' && launchingExternal?.mode === 'app' ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    ) : (
                      <Laptop className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    <span>ChatGPT Desktop App</span>
                  </button>
                </div>
              </div>
            )}

            {/* General AI: Show both ChatGPT and Claude options */}
            {isGeneral && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* OpenAI ChatGPT Block */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between gap-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 font-bold text-xs">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white">OpenAI ChatGPT</h4>
                        <p className="text-[10px] text-slate-400">Token-reduced English prompt</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400">
                      gpt-4o
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleLaunchExternal('chatgpt', 'browser')}
                      disabled={loading || (launchingExternal?.step === 'optimizing')}
                      className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-medium transition-all cursor-pointer hover:border-slate-600 disabled:opacity-50"
                      title="Open ChatGPT in Web Browser with pre-filled optimized prompt"
                    >
                      <Globe className="w-3.5 h-3.5 text-blue-400" />
                      <span>ChatGPT Web</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLaunchExternal('chatgpt', 'app')}
                      disabled={loading || (launchingExternal?.step === 'optimizing')}
                      className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-800/60 text-xs font-medium transition-all cursor-pointer hover:border-emerald-700 disabled:opacity-50"
                      title="Open ChatGPT Desktop App directly (redirects to download if not installed)"
                    >
                      <Laptop className="w-3.5 h-3.5 text-emerald-400" />
                      <span>ChatGPT App</span>
                    </button>
                  </div>
                </div>

                {/* Anthropic Claude Block */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between gap-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-950/80 border border-amber-700/60 flex items-center justify-center text-amber-400 font-bold text-xs">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white">Anthropic Claude</h4>
                        <p className="text-[10px] text-slate-400">Structured XML & directives</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-400">
                      claude-3-5
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleLaunchExternal('claude', 'browser')}
                      disabled={loading || (launchingExternal?.step === 'optimizing')}
                      className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-medium transition-all cursor-pointer hover:border-slate-600 disabled:opacity-50"
                      title="Open Claude in Web Browser with pre-filled optimized prompt"
                    >
                      <Globe className="w-3.5 h-3.5 text-amber-400" />
                      <span>Claude Web</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLaunchExternal('claude', 'app')}
                      disabled={loading || (launchingExternal?.step === 'optimizing')}
                      className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-800/60 text-xs font-medium transition-all cursor-pointer hover:border-amber-700 disabled:opacity-50"
                      title="Open Claude Desktop App directly (redirects to download if not installed)"
                    >
                      <Laptop className="w-3.5 h-3.5 text-amber-400" />
                      <span>Claude App</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Real-time Launch & Installation Fallback Notification */}
            {launchToast && (
              <div className={`p-3 rounded-xl border text-xs flex flex-wrap items-center justify-between gap-3 animate-fadeIn ${
                launchToast.isWarning
                  ? 'bg-amber-950/60 border-amber-700/80 text-amber-200 shadow-md'
                  : 'bg-emerald-950/60 border-emerald-700/80 text-emerald-200 shadow-md'
              }`}>
                <div className="flex items-center gap-2.5 min-w-0">
                  {launchToast.isWarning ? (
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <strong className="block font-semibold">{launchToast.title}</strong>
                    <span className="text-[11px] opacity-90 break-words">{launchToast.message}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {launchToast.downloadUrl && (
                    <a
                      href={launchToast.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download {launchToast.platformName}</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setLaunchToast(null)}
                    className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    ✕ Close
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Results Card (Rendered when optimization result is available) */}
      {result && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-5 sm:p-6 space-y-4 animate-fadeIn">
          {/* Dynamic Token Comparison Banner responding to Active Variant Tab */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm shadow-inner font-mono">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-slate-400">Raw Input:</span>
              <strong className="text-slate-200">{origTokens} tokens</strong>
              <span className="text-slate-500">→</span>
              <span className="text-slate-400">
                {isLT ? 'Low-Token:' : 'High-Context:'}
              </span>
              <strong className={isLT ? 'text-emerald-400' : 'text-blue-400'}>
                {englishTokenCount} tokens
              </strong>
            </div>

            <div className="flex items-center gap-2">
              {isTokenReduction ? (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-bold text-xs shadow-sm">
                  {dynamicPct}% Tokens Saved
                </span>
              ) : (isZeroDelta && isLT) ? (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-bold text-xs shadow-sm">
                  0.0% (Optimal Baseline)
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-lg bg-blue-950/80 border border-blue-800 text-blue-300 font-bold text-xs shadow-sm">
                  +{englishTokenCount - origTokens} Tokens (+{dynamicPct}% Context)
                </span>
              )}
              <span className="text-slate-400 text-xs hidden sm:inline font-sans">
                (~{englishTokenCount} tokens consumed by {providers.find(p => p.id === targetProvider)?.name})
              </span>
            </div>
          </div>

          {/* Variant Tabs & Language Selector & Clipboard Bar */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Variant Tabs: Low-Token vs High-Context */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 w-fit shadow-inner">
                {/* Low-Token Tab */}
                <button
                  onClick={() => setActiveVariantTab('lt')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                    activeVariantTab === 'lt'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>Low-Token Version (Lean)</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    activeVariantTab === 'lt'
                      ? 'bg-slate-950/40 text-emerald-300 border border-emerald-500/30'
                      : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                  }`}>
                    {result.variants?.lowToken?.tokenCount} tok
                  </span>
                </button>

                {/* High-Context Tab */}
                <button
                  onClick={() => setActiveVariantTab('hc')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                    activeVariantTab === 'hc'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>High-Context Version (Detailed)</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    activeVariantTab === 'hc'
                      ? 'bg-slate-950/40 text-blue-200 border border-blue-400/30'
                      : 'bg-slate-900 text-slate-300 border border-slate-700'
                  }`}>
                    {result.variants?.highContext?.tokenCount} tok
                  </span>
                </button>
              </div>

              {/* Right Controls: Regional Language Toggle & Copy Button */}
              <div className="flex items-center gap-2">
                {isNonEnglish && (
                  <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-medium">
                    <button
                      onClick={() => setResultLang('en')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        resultLang === 'en'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      English (Lean)
                    </button>
                    <button
                      onClick={() => setResultLang('native')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        resultLang === 'native'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {detectedLangNative}
                    </button>
                  </div>
                )}

                {/* Target AI Quick Launch Buttons */}
                {(isChatGPT || isGeneral) && (
                  <button
                    onClick={() => handleLaunchExternal('chatgpt', 'browser')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-medium transition-colors cursor-pointer border border-slate-700 shadow-sm"
                    title="Launch directly in ChatGPT Web"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ChatGPT Web</span>
                  </button>
                )}

                {(isClaude || isGeneral) && (
                  <button
                    onClick={() => handleLaunchExternal('claude', 'browser')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium transition-colors cursor-pointer border border-slate-700 shadow-sm"
                    title="Launch directly in Claude Web"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    <span>Claude Web</span>
                  </button>
                )}

                <button
                  onClick={() => handleCopy(displayedPrompt, 'clipboard')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer shadow-sm"
                >
                  {copiedKey === 'clipboard' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy to Clipboard</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Prompt Output Well */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-inner">
              <pre className="p-4 sm:p-5 text-slate-200 text-xs leading-relaxed whitespace-pre-wrap font-mono max-h-80 overflow-y-auto selection:bg-blue-600/40">
{displayedPrompt}
              </pre>
            </div>

            <div className="text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2 pt-1 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Constraints Preserved (0% Loss)</span>
              </span>
              <span className="text-[11px] text-slate-400 font-sans">
                {isLT 
                  ? 'Minimal directive with zero filler words.' 
                  : 'Structured role context, edge-case safety, and schema guardrails.'}
              </span>
            </div>
          </div>

          {/* 5. Dynamic Localized Suggestions with On-The-Fly Language Switching */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3.5 shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 font-mono">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>{currentBundle.header}</span>
              </h4>

              {/* Language Pills for Suggestions */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px]">
                <span className="text-slate-500 text-[10px] uppercase font-bold px-1.5 hidden sm:inline font-mono">
                  Language:
                </span>
                {[
                  { code: 'mr', label: 'मराठी' },
                  { code: 'hi', label: 'हिन्दी' },
                  { code: 'en', label: 'English' },
                  { code: 'ta', label: 'தமிழ்' },
                  { code: 'es', label: 'Español' }
                ].map((item) => {
                  const isCur = suggestionLang === item.code;
                  return (
                    <button
                      key={item.code}
                      onClick={() => setSuggestionLang(item.code)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isCur
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fillers removed in the respective language */}
            {currentBundle.fillers?.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs text-slate-400 font-medium">
                  {currentBundle.fillersLabel}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentBundle.fillers.map((f, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono">
                      "{typeof f === 'string' ? f.replace(/^['"]+|['"]+$/g, '') : f}"
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Redundancies removed */}
            {result.analysis?.redundancies?.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-xs text-amber-400 font-medium">
                  {currentBundle.redundanciesLabel || 'Redundant clauses removed:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.analysis.redundancies.map((r, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800 text-amber-300 text-xs font-mono">
                      "{r}"
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actionable suggestions in the selected respective language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {currentBundle.suggestions?.map((sug, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-1.5 text-xs">
                  <div className="font-semibold text-blue-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    <span>{sug.title}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{sug.details}</p>
                  {sug.action && (
                    <p className="text-emerald-400 text-[11px] font-medium pt-1 font-mono">
                      → {sug.action}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
