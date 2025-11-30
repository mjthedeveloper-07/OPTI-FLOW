import React, { useState, useEffect } from 'react';
import { AnalysisResult, LoadingState, UserInput, User } from './types';
import { analyzeWebsiteContent } from './services/geminiService';
import InputForm from './components/InputForm';
import ResultsView from './components/ResultsView';
import AuthPage from './components/AuthPage';
import PricingView from './components/PricingView';
import { Bot, Zap, Crown, CreditCard, LogOut, Search, Layers } from 'lucide-react';

const loadingMessages = [
  { text: "Scanning Website DNA", emoji: "🧬" },
  { text: "Parsing Semantic Structure", emoji: "🧠" },
  { text: "Checking SEO Vital Signs", emoji: "🩺" },
  { text: "Identifying Opportunity Gaps", emoji: "🔭" },
  { text: "Dreaming up Viral Features", emoji: "✨" },
  { text: "Calibrating User Flows", emoji: "🌊" },
  { text: "Finalizing Strategy", emoji: "🚀" }
];

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);

  // App State
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // UI State
  const [showPricing, setShowPricing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Effect to cycle loading messages
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === LoadingState.LOADING) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    resetAnalysis();
    setShowPricing(false);
  };

  const handleAnalysis = async (input: UserInput) => {
    if (!user) return;
    
    if (user.credits <= 0) {
      setShowPricing(true);
      return;
    }

    setStatus(LoadingState.LOADING);
    setError(null);
    try {
      const data = await analyzeWebsiteContent(input);
      setResult(data);
      setStatus(LoadingState.SUCCESS);
      
      // Decrement credits
      setUser(prev => prev ? { ...prev, credits: prev.credits - 1 } : null);
      
    } catch (err: any) {
      console.error(err);
      setStatus(LoadingState.ERROR);
      setError(err.message || "Something went wrong during analysis. Please try again.");
    }
  };

  const resetAnalysis = () => {
    setStatus(LoadingState.IDLE);
    setResult(null);
  };

  const handlePlanSelection = (planName: string) => {
    // Mock upgrade logic
    if (user) {
       setUser({
         ...user,
         plan: planName as any,
         credits: planName.includes('Pro') ? 50 : 999
       });
       setShowPricing(false);
    }
  };

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 selection:bg-brand-500 selection:text-white overflow-x-hidden">
      
      {/* Background ambient light */}
      <div className="fixed top-0 left-0 w-full h-screen overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-600/10 rounded-full blur-[120px] animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
      </div>

      {showPricing && (
        <PricingView 
          onClose={() => setShowPricing(false)} 
          onSelectPlan={handlePlanSelection} 
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={resetAnalysis}>
            <div className="bg-gradient-to-br from-brand-500 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-all duration-300">
              <Bot className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">OptiFlow<span className="text-brand-500">.AI</span></h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/5">
               <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Credits</span>
               <span className={`text-sm font-bold ${user.credits > 0 ? 'text-white' : 'text-red-400'}`}>
                 {user.credits} Available
               </span>
            </div>

            <button 
              onClick={() => setShowPricing(true)}
              className="flex items-center gap-2 bg-white/5 hover:bg-brand-500/20 border border-white/10 hover:border-brand-500/50 text-white px-4 py-2 rounded-full transition-all duration-300 group shadow-lg hover:shadow-brand-500/20"
            >
              <Crown size={16} className="text-yellow-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-wide">Upgrade Credits</span>
            </button>
            
            <div className="h-6 w-px bg-white/10 mx-2"></div>
            
            <div className="flex items-center gap-3">
               {user.avatar ? (
                 <img 
                   src={user.avatar} 
                   alt={user.name} 
                   className="w-8 h-8 rounded-full object-cover border-2 border-brand-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]"
                 />
               ) : (
                 <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                   {user.name.charAt(0)}
                 </div>
               )}
               <button 
                onClick={handleLogout}
                className="text-gray-500 hover:text-white transition-colors"
               >
                 <LogOut size={18} />
               </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {status === LoadingState.IDLE && (
          <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in-up">
            <div className="text-center max-w-3xl mx-auto space-y-6 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                <Zap size={12} /> Powered by Gemini 2.5 Flash
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-none">
                Optimize <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-400 to-purple-400 animate-gradient-x">Everything.</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                Generate high-impact SEO strategies, content audits, and feature roadmaps in seconds using advanced AI.
              </p>
            </div>
            
            <InputForm onSubmit={handleAnalysis} isLoading={false} />
            
            {/* Features Grid Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-24">
               <div className="p-8 rounded-3xl gloss-card border-white/5 hover:border-brand-500/30 transition-all duration-500 group">
                 <div className="h-10 w-10 bg-brand-500/20 rounded-xl flex items-center justify-center mb-6 text-brand-400 group-hover:scale-110 transition-transform">
                   <Search size={20} />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">Smart SEO</h3>
                 <p className="text-sm text-gray-400 leading-relaxed">Automated meta tags and semantic keyword strategies tailored to your niche.</p>
               </div>
               <div className="p-8 rounded-3xl gloss-card border-white/5 hover:border-purple-500/30 transition-all duration-500 group">
                 <div className="h-10 w-10 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                   <CreditCard size={20} />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">Conversion Audit</h3>
                 <p className="text-sm text-gray-400 leading-relaxed">Deep analysis of your content's tone and structure to improve conversion rates.</p>
               </div>
               <div className="p-8 rounded-3xl gloss-card border-white/5 hover:border-pink-500/30 transition-all duration-500 group">
                 <div className="h-10 w-10 bg-pink-500/20 rounded-xl flex items-center justify-center mb-6 text-pink-400 group-hover:scale-110 transition-transform">
                   <Layers size={20} />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">Feature Relay</h3>
                 <p className="text-sm text-gray-400 leading-relaxed">Discover interactive features to boost user retention and move them deeper into your app.</p>
               </div>
            </div>
          </div>
        )}

        {status === LoadingState.LOADING && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 relative animate-fade-in">
             {/* Background Glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/20 rounded-full blur-[100px] animate-pulse"></div>
             
             {/* Liquid Orb */}
             <div className="relative w-32 h-32 transform hover:scale-110 transition-transform duration-500">
                {/* Outer Rings */}
                <div className="absolute inset-0 rounded-full border border-white/10 animate-[spin_8s_linear_infinite]"></div>
                <div className="absolute -inset-2 rounded-full border border-dashed border-brand-500/20 animate-[spin_12s_linear_infinite_reverse]"></div>
                
                {/* Core Liquid Blob */}
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-brand-600 via-purple-600 to-brand-400 bg-[length:200%_200%] animate-liquid shadow-[0_0_50px_rgba(99,102,241,0.6)] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-full mix-blend-overlay"></div>
                  <span className="text-5xl animate-bounce relative z-10 drop-shadow-md">
                    {loadingMessages[loadingStep].emoji}
                  </span>
                </div>
             </div>

             {/* Dynamic Text */}
             <div className="text-center space-y-4 relative z-10 max-w-md">
               <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-200 to-gray-400 animate-pulse transition-all duration-300 min-h-[40px]">
                 {loadingMessages[loadingStep].text}...
               </h3>
               <div className="h-1 w-24 mx-auto bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 animate-[liquid_2s_ease-in-out_infinite] w-full origin-left"></div>
               </div>
               <p className="text-gray-500 text-xs uppercase tracking-[0.2em] font-medium pt-2">
                 Processing via Gemini 2.5
               </p>
             </div>
          </div>
        )}

        {status === LoadingState.ERROR && (
          <div className="max-w-xl mx-auto gloss-card border-red-500/30 rounded-2xl p-10 text-center space-y-6">
             <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-400">
               <Zap size={32} />
             </div>
             <h3 className="text-2xl font-bold text-white">Analysis Failed</h3>
             <p className="text-red-200/70">{error}</p>
             <button 
               onClick={resetAnalysis}
               className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-red-600/20"
             >
               Try Again
             </button>
          </div>
        )}

        {status === LoadingState.SUCCESS && result && (
          <ResultsView result={result} onReset={resetAnalysis} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-auto relative z-10 bg-black">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} OptiFlow AI. Built with Google Gemini & React.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;