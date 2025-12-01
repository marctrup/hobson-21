import React from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import hobsonOwl from '@/assets/hobson-owl-mascot.png';

export const InvitationSlide = () => {
  return (
    <div className="h-full flex items-center justify-center px-6 sm:px-8 pb-20">
      <div className="text-center max-w-2xl space-y-6">
        <div className="flex justify-center mb-4">
          <img 
            src={hobsonOwl} 
            alt="Hobson AI Mascot" 
            className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
          />
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1e293b] leading-tight">
          Let's Build the Future of<br />Real Estate Intelligence
        </h2>

        <p className="text-base sm:text-lg text-[#475569] leading-relaxed font-light max-w-lg mx-auto">
          If you're exploring early opportunities in this space, we'd love to talk.
        </p>

        <div className="pt-2 pb-4">
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] hover:from-[#6d28d9] hover:to-[#9333ea] text-white font-semibold px-6 py-4 text-sm sm:text-base shadow-lg"
            onClick={() => window.location.href = 'mailto:Rochelle.t@hobsonschoice.ai?subject=Investment Opportunity Inquiry'}
          >
            <Mail className="w-4 h-4 mr-2" />
            Start the Conversation
          </Button>
        </div>
      </div>
    </div>
  );
};
