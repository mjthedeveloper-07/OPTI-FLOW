import React from 'react';
import { Check, Star, Zap } from 'lucide-react';
import { PricingPlan } from '../types';

interface PricingViewProps {
  onSelectPlan: (plan: string) => void;
  onClose: () => void;
}

const plans: PricingPlan[] = [
  {
    name: "Free Starter",
    price: "$0",
    credits: "5 Credits",
    features: [
      "Basic SEO Analysis",
      "Standard Response Speed",
      "1 Project Profile",
      "Community Support"
    ]
  },
  {
    name: "Pro Professional",
    price: "$29",
    credits: "50 Credits / mo",
    features: [
      "Deep Content Analysis",
      "Feature Relay Recommendations",
      "Priority Processing",
      "Export to PDF/Markdown",
      "Email Support"
    ],
    recommended: true
  },
  {
    name: "Premium Agency",
    price: "$99",
    credits: "Unlimited",
    features: [
      "Everything in Pro",
      "Team Collaboration",
      "API Access",
      "Whitelabel Reports",
      "Dedicated Success Manager"
    ]
  }
];

const PricingView: React.FC<PricingViewProps> = ({ onSelectPlan, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-6xl mx-auto">
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-gray-400 hover:text-white transition-colors"
        >
          Close X
        </button>
        
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Choose Your Power Level</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Unlock advanced AI analysis and feature recommendations to scale your digital presence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative gloss-card rounded-2xl p-8 border transition-all duration-300 hover:scale-105 flex flex-col
                ${plan.recommended 
                  ? 'border-brand-500 shadow-[0_0_30px_rgba(99,102,241,0.2)]' 
                  : 'border-white/10 hover:border-white/30'
                }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-brand-500 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                  <Star size={12} fill="white" /> MOST POPULAR
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.price !== '$0' && <span className="text-gray-500">/month</span>}
                </div>
                <div className="mt-4 inline-block bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-brand-300 font-mono">
                  {plan.credits}
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                    <Check size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => onSelectPlan(plan.name)}
                className={`w-full py-3 rounded-xl font-bold transition-all
                  ${plan.recommended 
                    ? 'btn-liquid text-white shadow-lg shadow-brand-500/25' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
              >
                {plan.price === '$0' ? 'Current Plan' : 'Upgrade Now'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingView;