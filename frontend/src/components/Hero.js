import React from 'react';
import { Search, Shield, Zap } from 'lucide-react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
      </div>
      
      <div className="relative max-w-6xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8 text-sm border border-white/20">
          <Search className="text-blue-300" size={16} />
          <span className="font-medium text-blue-100">AI-Powered Truth Detection</span>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
          Verify News
          <br />
          <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
            Instantly
          </span>
        </h1>
        
        <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-12 leading-relaxed">
          Advanced AI analyzes news content for credibility, bias, and misinformation patterns in real-time.
        </p>
        
        <div className="flex flex-wrap justify-center gap-8 mt-16">
          <div className="flex items-center gap-3 text-blue-200">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Zap className="text-blue-300" size={20} />
            </div>
            <span className="font-medium">Instant Analysis</span>
          </div>
          <div className="flex items-center gap-3 text-blue-200">
            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
              <Shield className="text-purple-300" size={20} />
            </div>
            <span className="font-medium">Source Verification</span>
          </div>
          <div className="flex items-center gap-3 text-blue-200">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
              <Search className="text-indigo-300" size={20} />
            </div>
            <span className="font-medium">Pattern Detection</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
