
import React, { useState } from 'react';
import { AnalysisResult, FeatureRecommendation, SeoOptimization } from '../types';
import { 
  CheckCircle, 
  Copy, 
  Search, 
  Lightbulb, 
  Wrench, 
  Accessibility, 
  BarChart,
  Layers,
  Code,
  GitBranch,
  Download,
  Share2,
  Twitter,
  Linkedin,
  Facebook
} from 'lucide-react';

interface ResultsViewProps {
  result: AnalysisResult;
  onReset: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ result, onReset }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleExport = () => {
    // Safety check for export
    const seo: SeoOptimization = result.seo || {
      titleTag: '',
      metaDescription: '',
      keywords: [],
      headerSuggestions: []
    };
    const content = result.contentImprovements || [];
    const access = result.accessibilityTips || [];
    const features = result.recommendedFeatures || [];
    const date = new Date().toLocaleDateString();

    // Plain Text Format
    const report = [
      `OPTIFLOW AI - ANALYSIS REPORT`,
      `Generated on: ${date}`,
      `==========================================\n`,
      `EXECUTIVE SUMMARY`,
      `-----------------`,
      `${result.summary || 'N/A'}\n`,
      `SEO STRATEGY`,
      `------------`,
      `Title Tag: ${seo.titleTag || 'N/A'}`,
      `Meta Description: ${seo.metaDescription || 'N/A'}`,
      `Keywords: ${(seo.keywords || []).join(', ')}`,
      `\nHeader Suggestions:`,
      `${(seo.headerSuggestions || []).map(h => `- ${h}`).join('\n')}\n`,
      `CONTENT IMPROVEMENTS`,
      `--------------------`,
      `${content.map(c => `- ${c}`).join('\n')}\n`,
      `ACCESSIBILITY TIPS`,
      `------------------`,
      `${access.map(a => `- ${a}`).join('\n')}\n`,
      `RECOMMENDED FEATURES (RELAY STRATEGY)`,
      `-------------------------------------`,
      `${features.map(f => `FEATURE: ${f.name}\nImpact: ${f.impact} | Difficulty: ${f.difficulty}\nDescription: ${f.description}\nUser Flow: ${f.implementationExample || 'N/A'}\nTech Stack: ${f.techStackSuggestion || 'N/A'}\n`).join('\n')}`
    ].join('\n');

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `optiflow-analysis-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Social Sharing Logic
  const shareUrl = "https://optiflow.ai"; 
  const shareText = encodeURIComponent(`I just optimized my project with OptiFlow AI! Check out this analysis tool. 🚀 #SEO #AI`);
  
  const socialLinks = [
    { 
      icon: <Twitter size={16} />, 
      href: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`, 
      label: 'Twitter',
      color: 'hover:bg-[#1DA1F2] hover:border-[#1DA1F2]'
    },
    { 
      icon: <Linkedin size={16} />, 
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, 
      label: 'LinkedIn',
      color: 'hover:bg-[#0A66C2] hover:border-[#0A66C2]'
    },
    { 
      icon: <Facebook size={16} />, 
      href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, 
      label: 'Facebook',
      color: 'hover:bg-[#1877F2] hover:border-[#1877F2]'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      
      {/* Executive Summary */}
      <div className="gloss-card border-none bg-gradient-to-br from-indigo-900/40 to-brand-900/40 p-8 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <BarChart size={120} />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
             Analysis Summary
          </h2>
          <p className="text-lg text-gray-200 leading-relaxed max-w-4xl">
            {result.summary || 'Analysis completed successfully.'}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
              <button 
              onClick={onReset}
              className="text-sm font-medium text-brand-300 hover:text-white underline decoration-dotted underline-offset-4 transition-colors mr-2"
              >
              Run another analysis
              </button>
              
              <div className="h-8 w-px bg-white/10 hidden sm:block"></div>

              <button
                  onClick={handleExport}
                  className="flex items-center gap-2 text-sm font-bold bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl transition-all border border-white/5 hover:border-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl"
              >
                  <Download size={16} /> Export as .TXT
              </button>

              <div className="flex items-center gap-2">
                {socialLinks.map((link, i) => (
                  <a 
                    key={i}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-300 transition-all duration-300 hover:text-white hover:scale-110 shadow-lg ${link.color}`}
                    title={`Share on ${link.label}`}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SEO Section */}
        <section className="gloss-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
            <div className="p-2 bg-green-500/20 text-green-400 rounded-lg">
              <Search size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">SEO Strategy</h3>
          </div>

          <div className="space-y-6">
            <div className="group relative">
              <label className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2 block">Optimized Title Tag</label>
              <div className="gloss-input p-4 rounded-xl text-white font-medium flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-brand-500/50 transition-colors">
                 <span className="break-all">{result.seo?.titleTag || 'N/A'}</span>
                 <button 
                    onClick={() => result.seo?.titleTag && copyToClipboard(result.seo.titleTag, 'title')}
                    className="flex-shrink-0 bg-gradient-to-r from-brand-500/10 to-purple-500/10 hover:from-brand-500 hover:to-purple-600 text-brand-300 hover:text-white border border-brand-500/30 rounded-lg px-3 py-1.5 transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0.1)] hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] flex items-center gap-2 text-xs font-bold uppercase tracking-wider group-btn"
                 >
                   {copiedField === 'title' ? (
                     <>
                       <CheckCircle size={14} className="text-green-300" /> Copied
                     </>
                   ) : (
                     <>
                       <Copy size={14} /> Copy
                     </>
                   )}
                 </button>
              </div>
            </div>

            <div className="group relative">
              <label className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2 block">Meta Description</label>
              <div className="gloss-input p-4 rounded-xl text-gray-300 leading-relaxed flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-brand-500/50 transition-colors">
                 <span className="text-sm">{result.seo?.metaDescription || 'N/A'}</span>
                 <button 
                    onClick={() => result.seo?.metaDescription && copyToClipboard(result.seo.metaDescription, 'desc')}
                    className="flex-shrink-0 bg-gradient-to-r from-brand-500/10 to-purple-500/10 hover:from-brand-500 hover:to-purple-600 text-brand-300 hover:text-white border border-brand-500/30 rounded-lg px-3 py-1.5 transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0.1)] hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] flex items-center gap-2 text-xs font-bold uppercase tracking-wider group-btn"
                 >
                   {copiedField === 'desc' ? (
                     <>
                       <CheckCircle size={14} className="text-green-300" /> Copied
                     </>
                   ) : (
                     <>
                       <Copy size={14} /> Copy
                     </>
                   )}
                 </button>
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-3 block">Target Keywords</label>
              <div className="flex flex-wrap gap-2">
                {(result.seo?.keywords || []).map((kw, i) => (
                  <span key={i} className="px-3 py-1.5 bg-brand-500/10 border border-brand-500/20 text-brand-300 rounded-lg text-sm select-all hover:bg-brand-500/20 transition-colors">
                    #{kw}
                  </span>
                ))}
                {(!result.seo?.keywords || result.seo.keywords.length === 0) && (
                    <span className="text-gray-500 text-sm italic">No specific keywords generated.</span>
                )}
              </div>
            </div>

             <div>
              <label className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-3 block">Header Structure</label>
               <ul className="space-y-2 bg-black/20 p-4 rounded-xl border border-white/5">
                {(result.seo?.headerSuggestions || []).map((h, i) => (
                   <CopyableRow 
                    key={i} 
                    text={h} 
                    icon={<span className="text-brand-500 font-mono text-xs mt-0.5">{`H${Math.min(i+1, 3)}`}</span>} 
                  />
                ))}
                {(!result.seo?.headerSuggestions || result.seo.headerSuggestions.length === 0) && (
                    <li className="text-gray-500 text-sm italic">No header suggestions available.</li>
                )}
              </ul>
            </div>
          </div>
        </section>

        {/* Content & Accessibility Column */}
        <div className="space-y-8">
           {/* Content Improvements */}
           <section className="gloss-card rounded-2xl p-6">
             <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
                <Wrench size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Content Quality</h3>
            </div>
            <ul className="space-y-3">
              {(result.contentImprovements || []).map((tip, i) => (
                 <CopyableRow 
                    key={i} 
                    text={tip} 
                    icon={<span className="text-purple-500 mt-1">•</span>} 
                  />
              ))}
              {(!result.contentImprovements || result.contentImprovements.length === 0) && (
                  <li className="text-gray-500 text-sm italic">No content improvements generated.</li>
              )}
            </ul>
           </section>

           {/* Accessibility */}
           <section className="gloss-card rounded-2xl p-6">
             <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <div className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg">
                <Accessibility size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Accessibility & Technical</h3>
            </div>
            <ul className="space-y-3">
              {(result.accessibilityTips || []).map((tip, i) => (
                 <CopyableRow 
                    key={i} 
                    text={tip} 
                    icon={<CheckCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />} 
                  />
              ))}
              {(!result.accessibilityTips || result.accessibilityTips.length === 0) && (
                  <li className="text-gray-500 text-sm italic">No accessibility tips generated.</li>
              )}
            </ul>
           </section>
        </div>

      </div>

      {/* Feature Recommendations (Relay Features) */}
      <section>
        <div className="flex items-center gap-3 mb-6">
           <div className="p-2 bg-pink-500/20 text-pink-400 rounded-lg">
             <Layers size={24} />
           </div>
           <h3 className="text-2xl font-bold text-white">Recommended Relay Features</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(result.recommendedFeatures || []).map((feat, i) => (
            <FeatureCard key={i} feature={feat} />
          ))}
          {(!result.recommendedFeatures || result.recommendedFeatures.length === 0) && (
             <div className="col-span-full p-6 text-center text-gray-500 italic">
                 No feature recommendations available.
             </div>
          )}
        </div>
      </section>

    </div>
  );
};

const FeatureCard: React.FC<{ feature: FeatureRecommendation }> = ({ feature }) => {
  const impactColor = {
    High: 'bg-green-500/20 text-green-400 border-green-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Low: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  }[feature.impact] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';

  const diffColor = {
    Easy: 'text-blue-400',
    Moderate: 'text-orange-400',
    Hard: 'text-red-400',
  }[feature.difficulty] || 'text-gray-400';

  return (
    <div className="gloss-card rounded-2xl p-6 hover:border-brand-500/50 transition-all hover:scale-[1.02] duration-300 group flex flex-col h-full relative overflow-hidden">
      {/* Liquid hover background hint */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/5 rounded-lg group-hover:bg-brand-500/20 group-hover:text-brand-400 transition-colors">
            <Lightbulb size={20} />
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded border ${impactColor}`}>
            {feature.impact} Impact
            </span>
        </div>
        
        <h4 className="text-lg font-bold text-white mb-2">{feature.name}</h4>
        <p className="text-gray-400 text-sm mb-4 leading-relaxed">{feature.description}</p>
        
        {feature.implementationExample && (
            <div className="mb-4 bg-black/40 p-4 rounded-xl border border-white/5 flex-grow">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-300 mb-2 uppercase tracking-wide">
                <GitBranch size={12} />
                User Flow
            </div>
            <p className="text-gray-300 text-xs leading-relaxed italic">
                "{feature.implementationExample}"
            </p>
            </div>
        )}

        <div className="mt-auto pt-4 border-t border-white/5 space-y-3">
            <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 font-medium">Difficulty</span>
            <span className={`font-semibold ${diffColor}`}>{feature.difficulty}</span>
            </div>
            {feature.techStackSuggestion && (
            <div className="text-xs bg-black/30 p-2 rounded-lg border border-white/5 text-gray-400 flex items-start gap-2">
                <Code size={14} className="mt-0.5 flex-shrink-0" />
                <span className="font-mono">{feature.techStackSuggestion}</span>
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

// Helper component for list items
const CopyableRow: React.FC<{ text: string; icon: React.ReactNode }> = ({ text, icon }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <li className="flex gap-3 text-gray-300 text-sm leading-relaxed group items-start p-2 rounded-lg hover:bg-white/5 transition-colors">
      <div className="mt-1 flex-shrink-0">{icon}</div>
      <span className="flex-grow pt-0.5">{text}</span>
      <button 
        onClick={handleCopy}
        className={`mt-0.5 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide transition-all flex-shrink-0 flex items-center gap-1 border border-transparent ${
          copied 
            ? 'text-green-400 bg-green-500/10 border-green-500/20 opacity-100' 
            : 'text-brand-300 bg-brand-500/10 hover:bg-brand-500 hover:text-white border-brand-500/20 opacity-0 group-hover:opacity-100'
        }`}
        title="Copy"
      >
        {copied ? <CheckCircle size={10} /> : <Copy size={10} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </li>
  );
};

export default ResultsView;
