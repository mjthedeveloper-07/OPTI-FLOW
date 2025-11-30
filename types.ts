
export interface UserInput {
  url?: string;
  businessName: string;
  targetAudience: string;
  description: string;
  currentContent: string;
  image?: string; // Base64 string for image analysis
}

export interface SeoOptimization {
  titleTag: string;
  metaDescription: string;
  keywords: string[];
  headerSuggestions: string[];
}

export interface FeatureRecommendation {
  name: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  techStackSuggestion?: string;
  implementationExample?: string;
}

export interface AnalysisResult {
  seo: SeoOptimization;
  contentImprovements: string[];
  accessibilityTips: string[];
  recommendedFeatures: FeatureRecommendation[];
  summary: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface User {
  name: string;
  email: string;
  credits: number;
  plan: 'Free' | 'Pro' | 'Premium';
  avatar?: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  credits: string;
  features: string[];
  recommended?: boolean;
}
