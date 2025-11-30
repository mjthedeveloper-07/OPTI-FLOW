import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { Eye, EyeOff, Zap, Shield, BarChart, CheckCircle2, Camera, User as UserIcon, X, Check } from 'lucide-react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

// --- Helpers for Cropping ---
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

// --- Components ---

const LegalModal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto text-gray-300 text-sm leading-relaxed space-y-4 custom-scrollbar">
          {children}
        </div>
        <div className="p-6 border-t border-white/5 bg-black/20 rounded-b-2xl flex justify-end">
           <button onClick={onClose} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium">
             Close
           </button>
        </div>
      </div>
    </div>
  );
};

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Avatar & Cropping State
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [showCropper, setShowCropper] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Legal Modal State
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || ''),
      );
      reader.readAsDataURL(e.target.files[0]);
      setShowCropper(true);
      // Reset input value so same file can be selected again
      e.target.value = '';
    }
  };

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  }

  const performCrop = () => {
    if (completedCrop && imgRef.current && previewCanvasRef.current) {
      const image = imgRef.current;
      const canvas = previewCanvasRef.current;
      const crop = completedCrop;

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No 2d context');
      }

      const pixelRatio = window.devicePixelRatio;

      canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
      canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

      ctx.scale(pixelRatio, pixelRatio);
      ctx.imageSmoothingQuality = 'high';

      const cropX = crop.x * scaleX;
      const cropY = crop.y * scaleY;

      const centerX = image.naturalWidth / 2;
      const centerY = image.naturalHeight / 2;

      ctx.save();

      // Translate to center for rotation (if we added rotation later)
      // ctx.translate(-cropX, -cropY);
      // ctx.translate(centerX, centerY);
      // ctx.translate(-centerX, -centerY);
      ctx.translate(-cropX, -cropY);

      ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
      );

      ctx.restore();
      
      const base64Canvas = canvas.toDataURL("image/jpeg");
      setAvatarPreview(base64Canvas);
      setShowCropper(false);
    } else {
        // Fallback if no crop happened (e.g. use original image or just close)
        setShowCropper(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth
    const user: User = {
      name: formData.name || 'User',
      email: formData.email,
      credits: 5, // Free credits
      plan: 'Free',
      avatar: avatarPreview || undefined
    };
    onLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black overflow-hidden relative">
      {/* Background Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      
      {/* --- Legal Modals --- */}
      {showTerms && (
        <LegalModal title="Terms of Service" onClose={() => setShowTerms(false)}>
           <p><strong>1. Introduction</strong><br/>Welcome to OptiFlow AI. By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions.</p>
           <p><strong>2. Use of License</strong><br/>Permission is granted to temporarily download one copy of the materials (information or software) on OptiFlow AI's website for personal, non-commercial transitory viewing only.</p>
           <p><strong>3. Disclaimer</strong><br/>The materials on OptiFlow AI's website are provided on an 'as is' basis. OptiFlow AI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
           <p><strong>4. Limitations</strong><br/>In no event shall OptiFlow AI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on OptiFlow AI's website.</p>
        </LegalModal>
      )}

      {showPrivacy && (
        <LegalModal title="Privacy Policy" onClose={() => setShowPrivacy(false)}>
           <p><strong>1. Information Collection</strong><br/>We collect information from you when you register on our site, subscribe to a newsletter, or fill out a form. Any data we request that is not required will be specified as voluntary or optional.</p>
           <p><strong>2. Use of Information</strong><br/>Any of the information we collect from you may be used in one of the following ways: to personalize your experience, to improve our website, to improve customer service, to process transactions, and to send periodic emails.</p>
           <p><strong>3. Data Protection</strong><br/>We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information.</p>
           <p><strong>4. Third Party Links</strong><br/>Occasionally, at our discretion, we may include or offer third party products or services on our website. These third party sites have separate and independent privacy policies.</p>
        </LegalModal>
      )}

      {/* --- Cropper Modal --- */}
      {showCropper && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
           <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-lg flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Adjust Profile Photo</h3>
                  <button onClick={() => setShowCropper(false)} className="text-gray-400 hover:text-white">
                      <X size={20} />
                  </button>
              </div>
              
              <div className="flex-grow overflow-auto flex justify-center bg-black/50 rounded-lg p-4 border border-white/5 mb-6">
                 {!!imgSrc && (
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={1}
                    className="max-h-[50vh]"
                  >
                    <img
                      ref={imgRef}
                      alt="Crop me"
                      src={imgSrc}
                      onLoad={onImageLoad}
                      style={{ maxHeight: '50vh', maxWidth: '100%' }}
                    />
                  </ReactCrop>
                )}
              </div>

              <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setShowCropper(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={performCrop}
                    className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-bold shadow-lg shadow-brand-600/20 flex items-center gap-2"
                  >
                    <Check size={16} /> Apply
                  </button>
              </div>
           </div>
           {/* Hidden canvas for crop processing */}
           <canvas
              ref={previewCanvasRef}
              style={{
                display: 'none',
                objectFit: 'contain',
                width: 150,
                height: 150,
              }}
            />
        </div>
      )}

      <div className="w-full max-w-5xl h-[650px] gloss-card rounded-3xl flex overflow-hidden relative z-10 shadow-2xl border border-white/10">
        
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center relative overflow-y-auto custom-scrollbar">
          
          <div className="max-w-md mx-auto w-full mt-10 lg:mt-0">
            <div className="flex items-center gap-2 mb-8">
                <div className="bg-brand-500 p-1.5 rounded-lg">
                  <Zap size={16} className="text-white" />
                </div>
                <span className="font-bold text-white tracking-wide">OptiFlow.AI</span>
             </div>

            <h2 className="text-3xl font-bold text-white mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-400 mb-6 text-sm">
              {isSignUp 
                ? 'Join 10,000+ marketers optimizing with AI.' 
                : 'Enter your credentials to access your dashboard.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="flex justify-center mb-6">
                  <div className="relative group cursor-pointer">
                    <div className="w-20 h-20 rounded-full border-2 border-brand-500/50 flex items-center justify-center bg-black/40 overflow-hidden relative shadow-[0_0_15px_rgba(99,102,241,0.2)] group-hover:border-brand-500 transition-colors">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="text-gray-500 w-10 h-10" />
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera size={20} className="text-white" />
                      </div>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <p className="text-center text-xs text-gray-500 mt-2 font-medium">Upload Photo</p>
                  </div>
                </div>
              )}

              {isSignUp && (
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Daniel Ahmadi"
                    className="w-full px-4 py-3 rounded-xl gloss-input text-white placeholder-gray-600 outline-none focus:ring-1 focus:ring-brand-500"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
              )}
              
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1 ml-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl gloss-input text-white placeholder-gray-600 outline-none focus:ring-1 focus:ring-brand-500"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1 ml-1">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl gloss-input text-white placeholder-gray-600 outline-none focus:ring-1 focus:ring-brand-500"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center gap-2 text-xs text-green-400">
                    <CheckCircle2 size={12} />
                    <span>Free 5 AI credits included</span>
                  </div>
                </div>
              )}

              <button type="submit" className="w-full py-3.5 rounded-xl text-white font-semibold btn-liquid shadow-lg shadow-brand-500/25 mt-4">
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                {isSignUp ? 'Already a member?' : "Don't have an account?"} {' '}
                <button 
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex justify-center gap-4">
               {/* Mock Social Buttons */}
               <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/5">
                 <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
               </button>
               <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/5">
                 <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
               </button>
            </div>
            
            <div className="mt-6 flex justify-center gap-6 text-[10px] uppercase tracking-widest text-gray-600">
               <button onClick={() => setShowTerms(true)} className="hover:text-brand-400 transition-colors">Terms of Service</button>
               <button onClick={() => setShowPrivacy(true)} className="hover:text-brand-400 transition-colors">Privacy Policy</button>
            </div>
          </div>
        </div>

        {/* Right Side - Visuals */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-brand-600 to-purple-800 relative items-center justify-center p-12 overflow-hidden">
          {/* Abstract geometric shapes */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10 w-full max-w-sm space-y-6">
            
            {/* Floating Card 1 */}
            <div className="gloss-card p-4 rounded-2xl border border-white/20 transform translate-x-4 hover:translate-x-2 transition-transform duration-500">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-xs font-semibold text-gray-300">Monthly Usage</span>
                 <BarChart size={16} className="text-brand-300" />
               </div>
               <div className="flex items-end gap-2">
                 <span className="text-3xl font-bold text-white">1,204</span>
                 <span className="text-xs text-green-300 mb-1">+12%</span>
               </div>
               <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                 <div className="bg-brand-400 h-full rounded-full" style={{width: '75%'}}></div>
               </div>
            </div>

            {/* Floating Card 2 */}
            <div className="gloss-card p-6 rounded-2xl border border-white/20 transform -translate-x-4 hover:-translate-x-2 transition-transform duration-500 bg-black/20">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-400">
                  <Shield size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white">Your data, your rules</h4>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    Enterprise-grade encryption ensures your strategic data never leaves your secure environment.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-brand-200 text-sm font-medium">Trusted by 500+ SEO Experts</p>
              <div className="flex justify-center gap-[-8px] mt-3">
                 {[1,2,3,4].map(i => (
                   <div key={i} className={`w-8 h-8 rounded-full border-2 border-brand-500 bg-gray-800 -ml-2 first:ml-0 flex items-center justify-center text-xs font-bold text-gray-500`}>
                     {i}
                   </div>
                 ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;