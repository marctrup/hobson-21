import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Eye, Calendar, Clock, ChevronUp, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string;
  reading_time: number;
  sort_order: number;
  author: {
    display_name: string;
  };
}

const BlogManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      await fixSortOrders();
      await fetchPosts();
    };
    loadData();
  }, []);

  const fixSortOrders = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, sort_order')
      .order('created_at', { ascending: false });
      
    if (error || !data) return;
    
    // Fix any posts without sort_order or with duplicate values
    const updates = data.map((post, index) => ({
      id: post.id,
      sort_order: data.length - index
    }));
    
    for (const update of updates) {
      await supabase
        .from('blog_posts')
        .update({ sort_order: update.sort_order })
        .eq('id', update.id);
    }
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        status,
        published_at,
        created_at,
        reading_time,
        sort_order,
        author_id,
        profiles!blog_posts_author_id_fkey (
          display_name
        )
      `)
      .order('sort_order', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch blog posts",
        variant: "destructive",
      });
    } else {
      const formattedPosts = data?.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        status: post.status as 'draft' | 'published',
        published_at: post.published_at,
        created_at: post.created_at,
        reading_time: post.reading_time,
        sort_order: post.sort_order,
        author: {
          display_name: post.profiles?.display_name || 'Unknown Author'
        }
      })) || [];
      
      setPosts(formattedPosts);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      fetchPosts();
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const updateData: any = { status: newStatus };
    
    if (newStatus === 'published') {
      updateData.published_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating post status:', error);
      toast({
        title: "Error",
        description: "Failed to update post status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Post ${newStatus === 'published' ? 'published' : 'saved as draft'}`,
      });
      fetchPosts();
    }
  };

  const handleMoveUp = async (id: string, currentIndex: number) => {
    if (currentIndex === 0) return;
    
    // Swap positions with the post above
    const newPosts = [...posts];
    const temp = newPosts[currentIndex - 1];
    newPosts[currentIndex - 1] = newPosts[currentIndex];
    newPosts[currentIndex] = temp;
    
    // Update sort_order for both posts
    const updates = [
      {
        id: newPosts[currentIndex - 1].id,
        sort_order: posts.length - (currentIndex - 1)
      },
      {
        id: newPosts[currentIndex].id,
        sort_order: posts.length - currentIndex
      }
    ];

    try {
      for (const update of updates) {
        const { error } = await supabase
          .from('blog_posts')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id);
          
        if (error) throw error;
      }
      
      toast({
        title: "Success",
        description: "Post moved up",
      });
      fetchPosts();
    } catch (error) {
      console.error('Error moving post up:', error);
      toast({
        title: "Error",
        description: "Failed to reorder post",
        variant: "destructive",
      });
    }
  };

  const handleMoveDown = async (id: string, currentIndex: number) => {
    if (currentIndex === posts.length - 1) return;
    
    // Swap positions with the post below
    const newPosts = [...posts];
    const temp = newPosts[currentIndex + 1];
    newPosts[currentIndex + 1] = newPosts[currentIndex];
    newPosts[currentIndex] = temp;
    
    // Update sort_order for both posts
    const updates = [
      {
        id: newPosts[currentIndex].id,
        sort_order: posts.length - currentIndex
      },
      {
        id: newPosts[currentIndex + 1].id,
        sort_order: posts.length - (currentIndex + 1)
      }
    ];

    try {
      for (const update of updates) {
        const { error } = await supabase
          .from('blog_posts')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id);
          
        if (error) throw error;
      }
      
      toast({
        title: "Success",
        description: "Post moved down",
      });
      fetchPosts();
    } catch (error) {
      console.error('Error moving post down:', error);
      toast({
        title: "Error",
        description: "Failed to reorder post",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Blog Management</CardTitle>
            <Button asChild>
              <Link to="/admin/blog/new">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">No blog posts yet</h3>
              <p className="text-muted-foreground">Create your first blog post using the "New Post" button above.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Reading Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post, index) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveUp(post.id, index)}
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveDown(post.id, index)}
                          disabled={index === posts.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </Button>
                        <span className="text-xs text-muted-foreground ml-1">
                          {post.sort_order}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{post.title}</div>
                        <div className="text-sm text-muted-foreground">/{post.slug}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={post.status === 'published' ? 'default' : 'secondary'}
                        className="cursor-pointer"
                        onClick={() => handleToggleStatus(post.id, post.status)}
                      >
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{post.author.display_name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(post.created_at), 'MMM dd, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {post.published_at ? (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(post.published_at), 'MMM dd, yyyy')}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {post.reading_time} min
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {post.status === 'published' && (
                          <Button variant="outline" size="sm" asChild className="border-blue-500 text-blue-600 hover:bg-blue-50">
                            <Link to={`/blog/${post.slug}`} target="_blank">
                              <Eye className="w-3 h-3" />
                            </Link>
                          </Button>
                        )}
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/admin/blog/edit/${post.id}`}>
                            <Edit className="w-3 h-3" />
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(post.id, post.title)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogManagement;