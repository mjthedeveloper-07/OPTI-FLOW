
import React, { useState, useRef } from 'react';
import { UserInput } from '../types';
import { Sparkles, Globe, Target, FileText, AlignLeft, Image as ImageIcon, X, UploadCloud } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserInput>({
    url: '',
    businessName: '',
    targetAudience: '',
    description: '',
    currentContent: '',
    image: undefined
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Keep the full data URL for preview, pass it to formData as is
        setImagePreview(base64String);
        setFormData(prev => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: undefined }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-3xl mx-auto gloss-card rounded-2xl overflow-hidden animate-fade-in-up">
      <div className="bg-gradient-to-r from-brand-600/20 to-purple-900/20 p-6 border-b border-white/5">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-400" />
          Start Your Analysis
        </h2>
        <p className="text-gray-400 text-sm mt-1">Provide details about your project to generate tailored recommendations.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-3 h-3" /> Website URL (Optional)
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full gloss-input rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <AlignLeft className="w-3 h-3" /> Business/Project Name
            </label>
            <input
              type="text"
              name="businessName"
              required
              value={formData.businessName}
              onChange={handleChange}
              placeholder="e.g. EcoStore, DevPortfolio"
              className="w-full gloss-input rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Target className="w-3 h-3" /> Target Audience & Goals
          </label>
          <input
            type="text"
            name="targetAudience"
            required
            value={formData.targetAudience}
            onChange={handleChange}
            placeholder="e.g. Tech-savvy millennials looking for sustainable products..."
            className="w-full gloss-input rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-3 h-3" /> Context / Description
          </label>
          <textarea
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Briefly describe what your site does and what you want to achieve..."
            className="w-full gloss-input rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-3 h-3" /> Website Screenshot (Optional)
          </label>
          
          <div className="relative group">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              className="hidden"
              id="website-screenshot-upload"
            />
            
            {!imagePreview ? (
              <label 
                htmlFor="website-screenshot-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-brand-500/50 hover:bg-white/5 transition-all group"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-brand-400 mb-2 transition-colors" />
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold text-brand-300">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-600 mt-1">PNG, JPG or GIF (MAX. 5MB)</p>
                </div>
              </label>
            ) : (
              <div className="relative w-full h-48 bg-black/40 rounded-xl overflow-hidden border border-white/10">
                <img 
                  src={imagePreview} 
                  alt="Website Preview" 
                  className="w-full h-full object-contain" 
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/80 text-white rounded-full transition-colors backdrop-blur-sm"
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2 text-xs text-center text-gray-300">
                  Image uploaded
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <AlignLeft className="w-3 h-3" /> Current Content Snippet (Optional)
          </label>
          <textarea
            name="currentContent"
            value={formData.currentContent}
            onChange={handleChange}
            rows={5}
            placeholder="Paste your homepage text, a blog post draft, or your 'About Us' content here..."
            className="w-full gloss-input rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none font-mono text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-[0.98] ${
            isLoading 
              ? 'bg-gray-800 cursor-not-allowed opacity-70' 
              : 'btn-liquid'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Context...
            </span>
          ) : (
            'Generate Optimization Report (1 Credit)'
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
