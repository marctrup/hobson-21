import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, ArrowUp, ArrowDown, Eye, EyeOff, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/blog/ImageUpload';

interface VideoPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  video_url: string;
  video_thumbnail_url: string | null;
  video_thumbnail_alt: string | null;
  status: 'draft' | 'published';
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author: {
    display_name: string;
  };
}

export default function VideoManagement() {
  const [videos, setVideos] = useState<VideoPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState<VideoPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    video_url: '',
    video_thumbnail_url: '',
    video_thumbnail_alt: ''
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          id,
          title,
          slug,
          excerpt,
          video_url,
          video_thumbnail_url,
          video_thumbnail_alt,
          status,
          sort_order,
          published_at,
          created_at,
          updated_at,
          profiles!blog_posts_author_id_fkey (
            display_name
          )
        `)
        .eq('content_type', 'video')
        .order('sort_order', { ascending: false });

      if (error) throw error;
      
      const formattedVideos = data?.map(video => ({
        id: video.id,
        title: video.title,
        slug: video.slug,
        excerpt: video.excerpt,
        video_url: video.video_url,
        video_thumbnail_url: video.video_thumbnail_url,
        video_thumbnail_alt: video.video_thumbnail_alt,
        status: video.status as 'draft' | 'published',
        sort_order: video.sort_order,
        published_at: video.published_at,
        created_at: video.created_at,
        updated_at: video.updated_at,
        author: {
          display_name: video.profiles?.display_name || 'Unknown Author'
        }
      })) || [];
      
      setVideos(formattedVideos);
    } catch (error: any) {
      toast.error('Failed to fetch videos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.video_url) {
      toast.error('Title and video URL are required');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in');
        return;
      }

      const slug = formData.slug || generateSlug(formData.title);

      if (editingVideo) {
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: formData.title,
            slug: slug,
            excerpt: formData.excerpt || null,
            video_url: formData.video_url,
            video_thumbnail_url: formData.video_thumbnail_url || null,
            video_thumbnail_alt: formData.video_thumbnail_alt || null,
          })
          .eq('id', editingVideo.id);

        if (error) throw error;
        toast.success('Video updated successfully');
      } else {
        const maxSortOrder = videos.length > 0 ? Math.max(...videos.map(v => v.sort_order)) : 0;
        
        const { error } = await supabase
          .from('blog_posts')
          .insert({
            title: formData.title,
            slug: slug,
            excerpt: formData.excerpt || null,
            content: '', // Empty content for video posts
            video_url: formData.video_url,
            video_thumbnail_url: formData.video_thumbnail_url || null,
            video_thumbnail_alt: formData.video_thumbnail_alt || null,
            status: 'draft',
            content_type: 'video',
            link_location: 'blog',
            author_id: user.id,
            sort_order: maxSortOrder + 1
          });

        if (error) throw error;
        toast.success('Video created successfully');
      }

      resetForm();
      setIsDialogOpen(false);
      fetchVideos();
    } catch (error: any) {
      toast.error('Failed to save video: ' + error.message);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Video deleted successfully');
      fetchVideos();
    } catch (error: any) {
      toast.error('Failed to delete video: ' + error.message);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: 'draft' | 'published') => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      const updateData: any = { status: newStatus };
      
      if (newStatus === 'published') {
        updateData.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      toast.success(`Video ${newStatus === 'published' ? 'published' : 'saved as draft'}`);
      fetchVideos();
    } catch (error: any) {
      toast.error('Failed to update video status: ' + error.message);
    }
  };

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = videos.findIndex(v => v.id === id);
    if (currentIndex === -1) return;
    
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= videos.length) return;

    try {
      const currentVideo = videos[currentIndex];
      const targetVideo = videos[targetIndex];

      // Swap sort orders
      const { error: error1 } = await supabase
        .from('blog_posts')
        .update({ sort_order: targetVideo.sort_order })
        .eq('id', currentVideo.id);

      const { error: error2 } = await supabase
        .from('blog_posts')
        .update({ sort_order: currentVideo.sort_order })
        .eq('id', targetVideo.id);

      if (error1 || error2) throw error1 || error2;
      
      toast.success('Video order updated');
      fetchVideos();
    } catch (error: any) {
      toast.error('Failed to update video order: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      video_url: '',
      video_thumbnail_url: '',
      video_thumbnail_alt: ''
    });
    setEditingVideo(null);
  };

  const openEditDialog = (video: VideoPost) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      slug: video.slug,
      excerpt: video.excerpt || '',
      video_url: video.video_url,
      video_thumbnail_url: video.video_thumbnail_url || '',
      video_thumbnail_alt: video.video_thumbnail_alt || ''
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleThumbnailChange = (imageUrl: string) => {
    setFormData({ ...formData, video_thumbnail_url: imageUrl });
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading videos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Video Posts</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingVideo ? 'Edit Video Post' : 'Create Video Post'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setFormData({ 
                      ...formData, 
                      title,
                      slug: generateSlug(title)
                    });
                  }}
                  placeholder="e.g., Video Tutorial: Getting Started"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Slug</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generated from title"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Video URL *</label>
                <Input
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://vimeo.com/123456789 or https://youtube.com/watch?v=..."
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Excerpt</label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Short description of the video..."
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Thumbnail Image</label>
                <ImageUpload 
                  currentImageUrl={formData.video_thumbnail_url}
                  onImageChange={handleThumbnailChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Thumbnail Alt Text</label>
                <Input
                  value={formData.video_thumbnail_alt}
                  onChange={(e) => setFormData({ ...formData, video_thumbnail_alt: e.target.value })}
                  placeholder="Describe the thumbnail image for accessibility"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingVideo ? 'Update Video' : 'Create Video'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {videos.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No video posts found. Create your first one!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {videos.map((video, index) => (
            <Card key={video.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 flex gap-4">
                    {video.video_thumbnail_url && (
                      <img
                        src={video.video_thumbnail_url}
                        alt={video.video_thumbnail_alt || video.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{video.title}</CardTitle>
                        <Badge variant={video.status === 'published' ? "default" : "secondary"}>
                          {video.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">/{video.slug}</p>
                      {video.excerpt && (
                        <p className="text-sm text-muted-foreground">{video.excerpt}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(video.id, video.status)}
                      title={video.status === 'published' ? "Set as Draft" : "Publish"}
                    >
                      {video.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMove(video.id, 'up')}
                      disabled={index === 0}
                      title="Move up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMove(video.id, 'down')}
                      disabled={index === videos.length - 1}
                      title="Move down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(video)}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(video.id, video.title)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  <p>Video URL: {video.video_url}</p>
                  <p>Author: {video.author.display_name}</p>
                  <p>Created: {new Date(video.created_at).toLocaleDateString()}</p>
                  {video.published_at && (
                    <p>Published: {new Date(video.published_at).toLocaleDateString()}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}