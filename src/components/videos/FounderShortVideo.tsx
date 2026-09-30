import React, { useState } from "react";
import { Play } from "lucide-react";
import marcTalkingToPhone from "@/assets/marc-talking-to-phone.png.asset.json";

const VIDEO_ID = "o22VxrIMPjQ";

/**
 * Portrait, phone-recorded video presented in a phone-like frame.
 * The uploaded still (Marc speaking to his phone) serves as the poster
 * until the visitor chooses to play.
 */
export const FounderShortVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-full max-w-[340px] rounded-[2.25rem] p-2.5"
        style={{
          background: "#FFFFFF",
          border: "1px solid #F7EDDC",
          boxShadow:
            "0 30px 60px -30px rgba(45,45,45,0.30), 0 10px 30px -15px rgba(45,45,45,0.18)",
        }}
      >
        <div className="relative overflow-hidden rounded-[1.75rem] bg-[#111111] aspect-[9/16]">
          {isPlaying ? (
            <iframe
              src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&playsinline=1`}
              title="How I came to be — a short film by Marc Trup"
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          ) : (
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 w-full h-full group cursor-pointer"
              aria-label="Play the short film: how I came to be"
            >
              <img
                src={marcTalkingToPhone.url}
                alt="Marc Trup, one of Hobson's Founders, recording a short film on his phone"
                className="absolute inset-0 w-full h-full object-cover object-top"
                loading="eager"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300" />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/90 group-hover:bg-primary group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg">
                  <Play className="w-7 h-7 text-primary-foreground fill-primary-foreground ml-1" />
                </div>
              </div>
            </button>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground text-center">
        Filmed on my phone, as things happen — no studio, no script.
      </p>
    </div>
  );
};
