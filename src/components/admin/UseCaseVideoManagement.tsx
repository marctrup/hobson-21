import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/blog/ImageUpload';

interface UseCaseVideo {
  id: string;
  title: string;
  vimeo_url: string;
  description: string | null;
  client_name: string | null;
  client_role: string | null;
  thumbnail_url: string | null;
  thumbnail_alt: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function UseCaseVideoManagement() {
  const [videos, setVideos] = useState<UseCaseVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState<UseCaseVideo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    vimeo_url: '',
    description: '',
    client_name: '',
    client_role: '',
    thumbnail_url: '',
    thumbnail_alt: ''
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('use_case_videos')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setVideos(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch videos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingVideo) {
        const { error } = await supabase
          .from('use_case_videos')
          .update({
            title: formData.title,
            vimeo_url: formData.vimeo_url,
            description: formData.description || null,
            client_name: formData.client_name || null,
            client_role: formData.client_role || null,
            thumbnail_url: formData.thumbnail_url || null,
            thumbnail_alt: formData.thumbnail_alt || null,
          })
          .eq('id', editingVideo.id);

        if (error) throw error;
        toast.success('Video updated successfully');
      } else {
        const maxSortOrder = videos.length > 0 ? Math.max(...videos.map(v => v.sort_order)) : 0;
        
        const { error } = await supabase
          .from('use_case_videos')
          .insert({
            title: formData.title,
            vimeo_url: formData.vimeo_url,
            description: formData.description || null,
            client_name: formData.client_name || null,
            client_role: formData.client_role || null,
            thumbnail_url: formData.thumbnail_url || null,
            thumbnail_alt: formData.thumbnail_alt || null,
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
        .from('use_case_videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Video deleted successfully');
      fetchVideos();
    } catch (error: any) {
      toast.error('Failed to delete video: ' + error.message);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('use_case_videos')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Video ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
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
        .from('use_case_videos')
        .update({ sort_order: targetVideo.sort_order })
        .eq('id', currentVideo.id);

      const { error: error2 } = await supabase
        .from('use_case_videos')
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
      vimeo_url: '',
      description: '',
      client_name: '',
      client_role: '',
      thumbnail_url: '',
      thumbnail_alt: ''
    });
    setEditingVideo(null);
  };

  const openEditDialog = (video: UseCaseVideo) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      vimeo_url: video.vimeo_url,
      description: video.description || '',
      client_name: video.client_name || '',
      client_role: video.client_role || '',
      thumbnail_url: video.thumbnail_url || '',
      thumbnail_alt: video.thumbnail_alt || ''
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleThumbnailChange = (imageUrl: string) => {
    setFormData({ ...formData, thumbnail_url: imageUrl });
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading videos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Use Case Videos</h2>
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
                {editingVideo ? 'Edit Use Case Video' : 'Create Use Case Video'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Contract Review Success Story"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Vimeo URL *</label>
                <Input
                  value={formData.vimeo_url}
                  onChange={(e) => setFormData({ ...formData, vimeo_url: e.target.value })}
                  placeholder="https://vimeo.com/123456789"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short description explaining the use case..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Client Name</label>
                  <Input
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    placeholder="e.g., John D."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Client Role</label>
                  <Input
                    value={formData.client_role}
                    onChange={(e) => setFormData({ ...formData, client_role: e.target.value })}
                    placeholder="e.g., Property Manager"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Thumbnail Image</label>
                <ImageUpload 
                  currentImageUrl={formData.thumbnail_url}
                  onImageChange={handleThumbnailChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Thumbnail Alt Text</label>
                <Input
                  value={formData.thumbnail_alt}
                  onChange={(e) => setFormData({ ...formData, thumbnail_alt: e.target.value })}
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
            <p className="text-muted-foreground">No use case videos found. Create your first one!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {videos.map((video, index) => (
            <Card key={video.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 flex gap-4">
                    {video.thumbnail_url && (
                      <div className="flex-shrink-0 overflow-hidden rounded max-w-20 max-h-20">
                        <img
                          src={video.thumbnail_url}
                          alt={video.thumbnail_alt || video.title}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{video.title}</CardTitle>
                        <Badge variant={video.is_active ? "default" : "secondary"}>
                          {video.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      {(video.client_name || video.client_role) && (
                        <p className="text-sm text-muted-foreground">
                          {video.client_name && `${video.client_name}`}
                          {video.client_name && video.client_role && ', '}
                          {video.client_role && video.client_role}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(video.id, video.is_active)}
                      title={video.is_active ? "Deactivate" : "Activate"}
                    >
                      {video.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                {video.description && (
                  <p className="text-sm text-muted-foreground mb-3">{video.description}</p>
                )}
                <div className="text-xs text-muted-foreground">
                  <p>Vimeo URL: {video.vimeo_url}</p>
                  <p>Created: {new Date(video.created_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}