import { Play } from "lucide-react";
import { useState } from "react";

interface YouTubeVideoSectionProps {
  videoId: string;
  title: string;
}

export const YouTubeVideoSection = ({ videoId, title }: YouTubeVideoSectionProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-background" aria-labelledby="video-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2
            id="video-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 text-foreground"
          >
            {title}
          </h2>

          <div className="relative w-full rounded-xl overflow-hidden shadow-xl border border-border bg-black aspect-video">
            {!isPlaying ? (
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 w-full h-full group cursor-pointer"
                aria-label={`Play video: ${title}`}
              >
                <img
                  src={thumbnailUrl}
                  alt={`Thumbnail for ${title}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/90 group-hover:bg-primary group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground fill-primary-foreground ml-1" />
                  </div>
                </div>
              </button>
            ) : (
              <iframe
                src={embedUrl}
                title={title}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
