import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface UseCaseVideo {
  id: string;
  title: string;
  vimeo_url: string;
  description: string | null;
  client_name: string | null;
  client_role: string | null;
  sort_order: number;
  thumbnail_url: string | null;
  thumbnail_alt: string | null;
}

export const UseCasesContent = () => {
  const [videos, setVideos] = useState<UseCaseVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<UseCaseVideo | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('use_case_videos')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractVimeoId = (url: string) => {
    const match = url.match(/(?:vimeo\.com\/)(\d+)/);
    return match ? match[1] : null;
  };

  if (loading) {
    return (
      <div className="flex-1">
        <div className="container mx-auto p-8 max-w-4xl">
          <div className="text-center py-8">
            <div className="text-lg text-muted-foreground">Loading use cases...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="container mx-auto p-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Use Cases</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Every organisation has unique needs. These use cases highlight just some of the ways Hobson AI can bring value.
          </p>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-0 h-0 border-l-[12px] border-l-primary border-y-[8px] border-y-transparent ml-1"></div>
            </div>
            <p className="text-muted-foreground mb-4">No use case videos available yet.</p>
            <p className="text-sm text-muted-foreground">
              Check back soon for authentic client stories about how Hobson AI is making a difference.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map((video) => {
              const vimeoId = extractVimeoId(video.vimeo_url);
              
              return (
                <div 
                  key={video.id} 
                  className="bg-card border rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg group cursor-pointer"
                  onClick={() => setSelectedVideo(video)}
                >
                  {vimeoId ? (
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {video.thumbnail_url ? (
                        <img
                          src={video.thumbnail_url}
                          alt={video.thumbnail_alt || video.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <img
                          src={`https://vumbnail.com/${vimeoId}.jpg`}
                          alt={video.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzAgMTMwTDIzMCAxNjVMMTcwIDIwMFYxMzBaIiBmaWxsPSIjOUM0MEE2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3Mjc5IiBmb250LWZhbWlseT0ic3lzdGVtLXVpIiBmb250LXNpemU9IjE0Ij5WaWRlbyBUaHVtYm5haWw8L3RleHQ+Cjwvc3ZnPg==';
                          }}
                        />
                      )}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <div className="w-0 h-0 border-l-[12px] border-l-primary border-y-[8px] border-y-transparent ml-1"></div>
                        </div>
                        <p className="text-muted-foreground">Invalid video URL</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4 space-y-3">
                    <h3 className="text-lg font-semibold text-foreground line-clamp-2">{video.title}</h3>
                    
                    {video.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        "{video.description}"
                      </p>
                    )}
                    
                    {(video.client_name || video.client_role) && (
                      <p className="text-xs text-muted-foreground font-medium">
                        — {video.client_name && video.client_name}
                        {video.client_name && video.client_role && ', '}
                        {video.client_role && video.client_role}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Some clients don't want to be on camera, so we share their words through others.
          </p>
        </div>

        {/* Video Modal */}
        <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
          <DialogContent className="max-w-4xl w-full p-0 bg-black">
            <div className="relative">
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              {selectedVideo && (
                <div className="aspect-video">
                  <iframe
                    src={`https://player.vimeo.com/video/${extractVimeoId(selectedVideo.vimeo_url)}?autoplay=1&title=0&byline=0&portrait=0`}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={selectedVideo.title}
                  />
                </div>
              )}
              {selectedVideo && (
                <div className="p-6 bg-card">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{selectedVideo.title}</h3>
                  {selectedVideo.description && (
                    <p className="text-muted-foreground mb-3">"{selectedVideo.description}"</p>
                  )}
                  {(selectedVideo.client_name || selectedVideo.client_role) && (
                    <p className="text-sm text-muted-foreground">
                      — {selectedVideo.client_name && selectedVideo.client_name}
                      {selectedVideo.client_name && selectedVideo.client_role && ', '}
                      {selectedVideo.client_role && selectedVideo.client_role}
                    </p>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};