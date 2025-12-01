import React from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import hobsonOwl from '@/assets/hobson-owl-mascot.png';

export const InvitationSlide = () => {
  return (
    <div className="h-full flex items-center justify-center px-6 sm:px-8">
      <div className="text-center max-w-2xl space-y-8">
        <div className="flex justify-center mb-6">
          <img 
            src={hobsonOwl} 
            alt="Hobson AI Mascot" 
            className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
          />
        </div>
        
        <div className="space-y-3">
          <div className="text-xs sm:text-sm font-semibold text-[#7c3aed] uppercase tracking-wider">
            The Invitation
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#1e293b] leading-tight">
            Let's Build the Future of<br />Real Estate Intelligence
          </h2>
        </div>

        <p className="text-base sm:text-lg text-[#475569] leading-relaxed font-light max-w-lg mx-auto">
          If you're exploring early opportunities in this space, we'd love to talk.
        </p>

        <div className="pt-4">
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] hover:from-[#6d28d9] hover:to-[#9333ea] text-white font-semibold px-8 py-6 text-base sm:text-lg shadow-lg"
            onClick={() => window.open('mailto:rochelle.t@hobsonschoice.ai?subject=Investment Opportunity Inquiry', '_blank')}
          >
            <Mail className="w-5 h-5 mr-2" />
            Start the Conversation
          </Button>
        </div>
      </div>
    </div>
  );
};
