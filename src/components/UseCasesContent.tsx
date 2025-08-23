import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseCaseVideo {
  id: string;
  title: string;
  vimeo_url: string;
  description: string | null;
  client_name: string | null;
  client_role: string | null;
  sort_order: number;
}

export const UseCasesContent = () => {
  const [videos, setVideos] = useState<UseCaseVideo[]>([]);
  const [loading, setLoading] = useState(true);

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
            Real feedback from our clients. These videos share honest stories about how Hobson AI is being used day to day.
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
          <div className="space-y-8">
            {videos.map((video) => {
              const vimeoId = extractVimeoId(video.vimeo_url);
              
              return (
                <div key={video.id} className="bg-card border rounded-lg p-6 shadow-sm">
                  {vimeoId ? (
                    <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                      <iframe
                        src={`https://player.vimeo.com/video/${vimeoId}?byline=0&portrait=0&responsive=1`}
                        title={video.title}
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <div className="w-0 h-0 border-l-[12px] border-l-primary border-y-[8px] border-y-transparent ml-1"></div>
                        </div>
                        <p className="text-muted-foreground">Invalid video URL</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">{video.title}</h3>
                    
                    {video.description && (
                      <p className="text-muted-foreground leading-relaxed">
                        "{video.description}"
                      </p>
                    )}
                    
                    {(video.client_name || video.client_role) && (
                      <p className="text-sm text-muted-foreground font-medium">
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
            Every organisation has unique needs. These use cases highlight just some of the ways Hobson AI can bring value.
          </p>
        </div>
      </div>
    </div>
  );
};