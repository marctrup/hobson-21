import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  MessageSquare, 
  Lightbulb, 
  Puzzle, 
  HelpCircle, 
  Bug, 
  Trophy,
  Medal,
  Award,
  User,
  Calendar,
  ThumbsUp,
  ArrowLeft,
  Settings,
  Trash2
} from 'lucide-react';
import hobsonLogo from "/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CreatePostDialog } from '@/components/features/CreatePostDialog';
import { ProfileUpdateDialog } from '@/components/features/ProfileUpdateDialog';
import { PostDetailDialog } from '@/components/features/PostDetailDialog';
import { AuthDialog } from '@/components/features/AuthDialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const FeatureRequests = () => {
  const [activeFilter, setActiveFilter] = useState('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const filters = [
    { id: 'new', label: 'New' },
    { id: 'top', label: 'Top' },
    { id: 'trending', label: 'Trending' },
  ];

  const boards = [
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, emoji: '📣' },
    { id: 'feature-request', label: 'Feature Request', icon: Lightbulb, emoji: '💡' },
    { id: 'integrations', label: 'Integrations', icon: Puzzle, emoji: '🧩' },
    { id: 'questions', label: 'Questions', icon: HelpCircle, emoji: '⁉️' },
    { id: 'bug-hunting', label: 'Bug Hunting', icon: Bug, emoji: '🐛' },
  ];

  const categoryLabels: Record<string, { label: string; emoji: string }> = {
    feedback: { label: 'Feedback', emoji: '📣' },
    'feature-request': { label: 'Feature Request', emoji: '💡' },
    integrations: { label: 'Integrations', emoji: '🧩' },
    questions: { label: 'Questions', emoji: '⁉️' },
    'bug-hunting': { label: 'Bug Hunting', emoji: '🐛' },
  };

  // Fetch posts from database
  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('feature_requests')
        .select('*');

      // Apply sorting based on filter
      if (activeFilter === 'new') {
        query = query.order('created_at', { ascending: false });
      } else if (activeFilter === 'top') {
        query = query.order('votes', { ascending: false });
      } else if (activeFilter === 'trending') {
        // For trending, we'll use a combination of votes and recency
        query = query.order('votes', { ascending: false }).order('created_at', { ascending: false });
      }

      // Apply search filter
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [activeFilter, searchQuery]);

  const handleCreatePost = () => {
    if (!user) {
      setShowAuthDialog(true);
    } else {
      setShowCreateDialog(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowCreateDialog(true);
  };

  const handlePostCreated = () => {
    fetchPosts(); // Refresh the posts
  };

  const handlePostClick = (post: any) => {
    if (user) {
      setSelectedPost(post);
      setShowPostDetail(true);
    } else {
      setShowAuthDialog(true);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to delete posts.",
        variant: "destructive",
      });
      return;
    }

    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('feature_requests')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Post deleted",
        description: "Your post has been successfully deleted.",
      });

      fetchPosts(); // Refresh the posts
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const handleVote = async (postId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if user has already voted
      const { data: existingVote } = await supabase
        .from('feature_request_votes')
        .select('id')
        .eq('feature_request_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        // Remove vote
        const { error: deleteError } = await supabase
          .from('feature_request_votes')
          .delete()
          .eq('feature_request_id', postId)
          .eq('user_id', user.id);

        if (deleteError) throw deleteError;

        // Decrease vote count
        const { error: updateError } = await supabase
          .from('feature_requests')
          .update({ votes: posts.find(p => p.id === postId)?.votes - 1 || 0 })
          .eq('id', postId);

        if (updateError) throw updateError;

        toast({
          title: "Vote removed",
          description: "Your vote has been removed.",
        });
      } else {
        // Add vote
        const { error: insertError } = await supabase
          .from('feature_request_votes')
          .insert({
            feature_request_id: postId,
            user_id: user.id
          });

        if (insertError) throw insertError;

        // Increase vote count
        const { error: updateError } = await supabase
          .from('feature_requests')
          .update({ votes: (posts.find(p => p.id === postId)?.votes || 0) + 1 })
          .eq('id', postId);

        if (updateError) throw updateError;

        toast({
          title: "Vote added",
          description: "Thank you for your vote!",
        });
      }

      fetchPosts(); // Refresh the posts
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to vote",
        variant: "destructive",
      });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  return (
    <>
      <Helmet>
        <title>Feature Requests - Hobson AI</title>
        <meta name="description" content="Share your feedback and feature requests for Hobson AI" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/learn" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Back to Learn</span>
                </Link>
                <div className="h-6 w-px bg-border" />
                <Link to="/" className="flex items-center gap-2">
                  <img src={hobsonLogo} alt="Hobson" className="h-8 w-auto" />
                </Link>
              </div>
              {user && (
                <Button variant="ghost" size="sm" onClick={() => setShowProfileDialog(true)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Update Display Name
                </Button>
              )}
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Share your product feedback!</h1>
            <p className="text-lg text-muted-foreground">
              Please tell us what we can do to make Hobson the best product for you.
            </p>
          </div>

          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1 max-w-4xl">
              {/* Filters, Create Post and Search */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {filters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeFilter === filter.id
                          ? 'bg-filter-active text-filter-active-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  
                  <Button size="sm" onClick={handleCreatePost}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create A New Post
                  </Button>
                </div>
              </div>

              {/* Posts */}
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-16 bg-muted rounded"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-20"></div>
                          <div className="h-6 bg-muted rounded w-3/4"></div>
                          <div className="h-4 bg-muted rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No posts found</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchQuery ? 'Try adjusting your search' : 'Be the first to create a post!'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => {
                    const categoryInfo = categoryLabels[post.category] || { label: post.category, emoji: '📝' };
                    
                    return (
                      <div key={post.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          {/* Vote Button */}
                          <div className="flex flex-col items-center gap-1">
                            <button 
                              className="p-2 hover:bg-accent rounded-lg transition-colors group"
                              onClick={() => handleVote(post.id)}
                              disabled={!user}
                            >
                              <ThumbsUp className={`w-4 h-4 transition-colors ${
                                user ? 'text-muted-foreground group-hover:text-primary' : 'text-muted-foreground/50'
                              }`} />
                            </button>
                            <span className="text-sm font-medium text-foreground">{post.votes}</span>
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <span>{categoryInfo.emoji}</span>
                                <span>{categoryInfo.label}</span>
                              </Badge>
                            </div>
                            
                            <h3 
                              className="text-lg font-semibold text-foreground mb-2 hover:text-primary cursor-pointer"
                              onClick={() => handlePostClick(post)}
                            >
                              {post.title}
                            </h3>
                            
                            {post.description && (
                              <p className="text-muted-foreground mb-3 line-clamp-3">
                                {post.description}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <User className="w-4 h-4" />
                              <span>{post.author_name}</span>
                              <Calendar className="w-4 h-4 ml-2" />
                              <span>{formatTimeAgo(post.created_at)}</span>
                              
                              {user && user.id === post.author_id && (
                                <button
                                  onClick={() => handleDeletePost(post.id)}
                                  className="ml-auto p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
                                  title="Delete post"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="w-80 space-y-6">
              {/* Boards */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Boards</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-2 text-left hover:bg-accent rounded-lg transition-colors">
                    <span className="text-sm font-medium text-foreground">View all posts</span>
                  </button>
                  {boards.map((board) => (
                    <button
                      key={board.id}
                      className="w-full flex items-center gap-3 p-2 text-left hover:bg-accent rounded-lg transition-colors"
                    >
                      <span className="text-base">{board.emoji}</span>
                      <span className="text-sm text-muted-foreground">{board.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dialogs */}
        <CreatePostDialog 
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onPostCreated={handlePostCreated}
        />
        
        <ProfileUpdateDialog
          open={showProfileDialog}
          onOpenChange={setShowProfileDialog}
          onSuccess={handlePostCreated}
        />
        
        <PostDetailDialog
          open={showPostDetail}
          onOpenChange={setShowPostDetail}
          post={selectedPost}
        />
        
        <AuthDialog
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
          onSuccess={handleAuthSuccess}
        />
      </div>
    </>
  );
};

export default FeatureRequests;