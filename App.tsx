
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ArtStyle, StyleOption, Artist, TransformationResult } from './types';
import { ART_STYLES, ARTISTS, LOADING_MESSAGES } from './constants';
import { transformImage } from './services/geminiService';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeStyle, setActiveStyle] = useState<StyleOption>(ART_STYLES[0]);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [result, setResult] = useState<TransformationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredArtists = useMemo(() => {
    return ARTISTS.filter(a => 
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  useEffect(() => {
    let interval: any;
    if (isProcessing) {
      interval = setInterval(() => {
        setLoadingMsg(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const toggleArtist = (name: string) => {
    setSelectedArtists(prev => {
      if (prev.includes(name)) return prev.filter(n => n !== name);
      if (prev.length >= 3) return prev; // Limit to 3 for better prompt quality
      return [...prev, name];
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size too large. Please select an image under 5MB.");
        return;
      }
      setSelectedFile(file);
      setError(null);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResult(null);
    }
  };

  const handleTransform = async () => {
    if (!selectedFile) {
      setError("Please select a photo first.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(selectedFile);
      });
      const base64 = await base64Promise;

      // Build the blended prompt with strict illustration constraints
      let finalPrompt = `${activeStyle.prompt} 
      CRITICAL CONSTRAINT: The output must look like a 2D illustration, drawing, or cartoon. 
      Do NOT produce a realistic photograph or a simple photo filter. 
      Ensure heavy stylization and non-photorealistic rendering.`;

      if (selectedArtists.length > 0) {
        const artistStr = selectedArtists.join(", ");
        finalPrompt += ` Additionally, reconstruct this image as a MASTERFUL BLEND of the iconic art styles of: ${artistStr}. 
        Meticulously fuse their unique visual signatures (line weight, hatching, and aesthetic flair). 
        The result should be a high-end comic book illustration that clearly exhibits the hand-drawn characteristics of ${artistStr}. 
        Keep the subject recognizable but transform them entirely into a comic character.`;
      }

      const transformedUrl = await transformImage(base64, finalPrompt, selectedFile.type);
      
      setResult({
        originalUrl: previewUrl!,
        transformedUrl: transformedUrl,
        style: activeStyle.id,
        influences: selectedArtists
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong during transformation.");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setSelectedArtists([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20 rotate-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent uppercase comic-font">Toonify Blend</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-bold">Pro Art Studio</p>
            </div>
          </div>
          <button 
            onClick={reset}
            className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors border border-slate-800 rounded-lg"
          >
            Reset Studio
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: UI Controls */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Upload */}
            <section className="bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  1. Source Image
                </h2>
              </div>
              
              {!previewUrl ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-800 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-500/5 transition-all group"
                >
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  </div>
                  <p className="text-sm font-bold text-slate-200">Drop your file here</p>
                  <p className="text-xs text-slate-500 mt-2">Maximum 5MB</p>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden aspect-square ring-1 ring-slate-800">
                  <img src={previewUrl} alt="Source" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-slate-900/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"
                  >
                    <span className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl">Change Photo</span>
                  </button>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </section>

            {/* 2. Style Blending */}
            <section className="bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-800 flex flex-col max-h-[600px]">
              <div className="mb-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  2. Artist Blend
                </h2>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search 50+ Artists..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {filteredArtists.length > 0 ? filteredArtists.map((artist) => {
                  const isSelected = selectedArtists.includes(artist.name);
                  return (
                    <button
                      key={artist.name}
                      onClick={() => toggleArtist(artist.name)}
                      className={`w-full p-4 rounded-xl border transition-all text-left flex items-center justify-between group ${
                        isSelected 
                          ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(79,70,229,0.15)]' 
                          : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <p className={`font-bold transition-colors ${isSelected ? 'text-indigo-400' : 'text-slate-300 group-hover:text-white'}`}>{artist.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wide mt-0.5">{artist.specialty}</p>
                      </div>
                      {isSelected ? (
                        <div className="bg-indigo-500 rounded-full p-1 shadow-lg shadow-indigo-500/40">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-700 group-hover:border-slate-500"></div>
                      )}
                    </button>
                  );
                }) : (
                  <div className="py-10 text-center text-slate-600">
                    <p className="text-sm">No artists found.</p>
                  </div>
                )}
              </div>

              {selectedArtists.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <p className="text-[10px] font-bold uppercase text-slate-500 mb-2">Selected Influences ({selectedArtists.length}/3)</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedArtists.map(name => (
                      <span key={name} className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-bold rounded-full border border-indigo-500/30 flex items-center gap-1">
                        {name}
                        <button onClick={() => toggleArtist(name)} className="hover:text-white">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <button
              onClick={handleTransform}
              disabled={!previewUrl || isProcessing}
              className={`w-full py-5 rounded-3xl font-bold text-white shadow-2xl transition-all flex items-center justify-center gap-3 relative overflow-hidden group ${
                !previewUrl || isProcessing 
                  ? 'bg-slate-800 cursor-not-allowed text-slate-500' 
                  : 'bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98]'
              }`}
            >
              {isProcessing && <div className="absolute inset-0 bg-indigo-400/20 animate-pulse"></div>}
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span className="uppercase tracking-widest text-sm z-10">Processing Canvas...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="z-10"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <span className="uppercase tracking-[0.2em] text-sm z-10 font-black">Generate Art</span>
                </>
              )}
            </button>
            
            {error && <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex gap-3"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{error}</div>}
          </div>

          {/* Right Column: Masterpiece Area */}
          <div className="lg:col-span-8">
            <div className="bg-slate-900 rounded-[40px] shadow-3xl border border-slate-800 overflow-hidden min-h-[700px] flex flex-col relative">
              
              {isProcessing ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center relative">
                   <div className="w-full h-full absolute inset-0 opacity-10 pointer-events-none">
                      <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
                        {Array.from({length: 144}).map((_, i) => <div key={i} className="border-[0.5px] border-indigo-500/30"></div>)}
                      </div>
                   </div>
                  <div className="relative mb-8">
                    <div className="w-40 h-40 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full border-2 border-violet-500/20 border-b-violet-500 animate-[spin_3s_linear_infinite_reverse]"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500 animate-pulse"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-widest text-white mb-2 comic-font">{loadingMsg}</h3>
                  <p className="text-slate-500 max-w-sm text-sm uppercase tracking-wider">Our AI is drawing your photo using {selectedArtists.length || 1} distinct artistic methodologies.</p>
                </div>
              ) : result ? (
                <div className="flex-1 p-10 flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter comic-font italic">Masterpiece Rendered</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Styles:</span>
                        <div className="flex gap-2">
                           {result.influences.map(inf => (
                             <span key={inf} className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded uppercase">{inf}</span>
                           ))}
                           {result.influences.length === 0 && <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded uppercase">Standard Toon</span>}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = result.transformedUrl;
                        link.download = `toonify-blend.png`;
                        link.click();
                      }}
                      className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-2xl active:scale-95 text-xs"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Download Art
                    </button>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold uppercase text-slate-500 tracking-[0.3em]">Source Data</p>
                      </div>
                      <div className="aspect-[3/4] rounded-3xl overflow-hidden ring-1 ring-slate-800 shadow-inner grayscale opacity-50 contrast-125">
                        <img src={result.originalUrl} alt="Original" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold uppercase text-indigo-500 tracking-[0.3em]">Final Ink</p>
                      </div>
                      <div className="aspect-[3/4] rounded-3xl overflow-hidden ring-4 ring-indigo-500/20 shadow-[0_0_80px_rgba(79,70,229,0.2)] relative">
                        <img src={result.transformedUrl} alt="Transformed" className="w-full h-full object-cover" />
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10">
                           <p className="text-[10px] font-black italic text-white uppercase tracking-widest">AUTHENTIC AI COMIC</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                  <div className="w-32 h-32 bg-slate-950 rounded-[40px] flex items-center justify-center text-slate-800 mb-8 ring-1 ring-slate-800 rotate-6 shadow-2xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  </div>
                  <h3 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter comic-font italic">Ready to Illustrate</h3>
                  <p className="text-slate-500 max-w-lg text-lg leading-relaxed">Select up to 3 artists from our legendary catalog. We'll blend their unique line-work and shading styles to redraw your photo from scratch.</p>
                  
                  <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl">
                    <div className="p-8 rounded-3xl bg-slate-950/50 border border-slate-800 flex flex-col items-center">
                      <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 border border-indigo-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      </div>
                      <p className="text-sm font-black text-white uppercase tracking-widest mb-2">Style Fusion</p>
                      <p className="text-xs text-slate-500 leading-relaxed">Combine multiple legendary artists into one single unique style.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-950/50 border border-slate-800 flex flex-col items-center">
                      <div className="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-400 mb-6 border border-violet-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                      </div>
                      <p className="text-sm font-black text-white uppercase tracking-widest mb-2">Pro Rendering</p>
                      <p className="text-xs text-slate-500 leading-relaxed">High resolution comic-book finish with pro-level inks and colors.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-950/50 border border-slate-800 flex flex-col items-center">
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                      <p className="text-sm font-black text-white uppercase tracking-widest mb-2">Likeness</p>
                      <p className="text-xs text-slate-500 leading-relaxed">Our AI preserves your facial structure while re-imagining you.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4f46e5; }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}} />
    </div>
  );
};

export default App;
