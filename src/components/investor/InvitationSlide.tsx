import React from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import hobsonOwl from '@/assets/hobson-owl-mascot.png';

export const InvitationSlide = () => {
  return (
    <div className="h-full flex items-center justify-center px-4 sm:px-6 pb-20 sm:pb-20">
      <div className="text-center max-w-2xl space-y-3 sm:space-y-4">
        <div className="flex justify-center mb-2 sm:mb-4">
          <img 
            src={hobsonOwl} 
            alt="Hobson AI Mascot" 
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-contain"
          />
        </div>
        
        <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-[#1e293b] leading-tight px-2">
          Let's Build the Future of<br />Real Estate Intelligence
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-[#475569] leading-relaxed font-light max-w-lg mx-auto px-4">
          If you're exploring early opportunities in this space, we'd love to talk.
        </p>

        <div className="pt-1">
          <Button
            size="sm"
            className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold px-3 py-1.5 text-[10px] sm:text-xs md:text-sm shadow-sm border border-gray-200 touch-manipulation"
            onClick={() => window.location.href = 'mailto:Rochelle.t@hobsonschoice.ai?subject=Investment Opportunity Inquiry'}
          >
            <Mail className="w-3 h-3 mr-1.5" />
            Start the Conversation
          </Button>
        </div>
      </div>
    </div>
  );
};
