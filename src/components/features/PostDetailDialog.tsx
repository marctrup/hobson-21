import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Calendar, 
  ThumbsUp, 
  MessageSquare,
  ArrowUp,
  ArrowDown,
  Reply,
  MoreHorizontal,
  Edit,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { PostSurvey } from './PostSurvey';

const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface Comment {
  id: string;
  content: string;
  author_name: string;
  user_id: string;
  votes: number;
  created_at: string;
  parent_comment_id?: string;
}

interface Post {
  id: string;
  title: string;
  description?: string;
  category: string;
  author_name: string;
  author_id: string;
  votes: number;
  created_at: string;
}

interface PostDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
  onCommentChange?: () => void;
}

const categoryLabels: Record<string, { label: string; emoji: string }> = {
  feedback: { label: 'Feedback', emoji: '📣' },
  'feature-request': { label: 'Feature Request', emoji: '💡' },
  integrations: { label: 'Integrations', emoji: '🧩' },
  questions: { label: 'Questions', emoji: '⁉️' },
  'bug-hunting': { label: 'Bug Hunting', emoji: '🐛' },
};

export function PostDetailDialog({ open, onOpenChange, post, onCommentChange }: PostDetailDialogProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());
  
  const { toast } = useToast();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const fetchComments = async () => {
    if (!post) return;
    
    setIsLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from('feature_request_comments')
        .select('*')
        .eq('feature_request_id', post.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setIsLoadingComments(false);
    }
  };

  useEffect(() => {
    if (open && post) {
      fetchComments();
    }
  }, [open, post]);

  const onSubmitComment = async (data: CommentFormData) => {
    if (!user || !post) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Get user profile for author name
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', user.id)
        .single();

      const authorName = profile?.display_name || user.email || 'Anonymous';

      const { error } = await supabase
        .from('feature_request_comments')
        .insert({
          feature_request_id: post.id,
          user_id: user.id,
          author_name: authorName,
          content: data.content,
          parent_comment_id: replyingTo
        });

      if (error) throw error;

      toast({
        title: "Comment posted!",
        description: "Your comment has been added successfully.",
      });

      reset();
      setReplyingTo(null);
      fetchComments();
      // Notify parent component to refresh comment count
      onCommentChange?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to post comment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
    setValue('content', '');
  };

  const toggleDropdown = (commentId: string) => {
    const newDropdowns = new Set(openDropdowns);
    if (newDropdowns.has(commentId)) {
      newDropdowns.delete(commentId);
    } else {
      newDropdowns.clear(); // Close all other dropdowns
      newDropdowns.add(commentId);
    }
    setOpenDropdowns(newDropdowns);
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment.id);
    setValue('content', comment.content);
    setOpenDropdowns(new Set());
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('feature_request_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id); // Ensure user can only delete their own comments

      if (error) throw error;

      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted successfully.",
      });

      fetchComments();
      setOpenDropdowns(new Set());
      // Notify parent component to refresh comment count
      onCommentChange?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete comment",
        variant: "destructive",
      });
    }
  };

  if (!post) return null;

  const categoryInfo = categoryLabels[post.category] || { label: post.category, emoji: '📝' };
  const topLevelComments = comments.filter(c => !c.parent_comment_id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] sm:max-h-[80vh] overflow-hidden flex flex-col w-[95vw] sm:w-full p-4 sm:p-6">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-lg sm:text-xl font-bold pr-8">{post.title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 flex-1 overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 space-y-4 overflow-y-auto max-h-full">
            {/* Post Content */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <span>{categoryInfo.emoji}</span>
                  <span>{categoryInfo.label}</span>
                </Badge>
              </div>
              
              {post.description && (
                <p className="text-foreground leading-relaxed">{post.description}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground pt-2 border-t">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="truncate max-w-[120px] sm:max-w-none">{post.author_name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="whitespace-nowrap">{formatTimeAgo(post.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Survey Section */}
            <PostSurvey postId={post.id} />

            {/* Comments Section */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MessageSquare className="w-4 h-4" />
                <span>Comments {comments.length > 0 && `(${comments.length})`}</span>
              </div>

              {/* Comment Form */}
              {user && (
                <form onSubmit={handleSubmit(onSubmitComment)} className="space-y-3">
                  {replyingTo && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Reply className="w-4 h-4" />
                      <span>Replying to comment</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setReplyingTo(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                  <Textarea
                    {...register("content")}
                    placeholder="Write a comment..."
                    className="min-h-[80px]"
                    disabled={isLoading}
                  />
                  {errors.content && (
                    <p className="text-sm text-destructive">{errors.content.message}</p>
                  )}
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Posting..." : "Comment"}
                    </Button>
                  </div>
                </form>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {isLoadingComments ? (
                  <div className="space-y-3">
                    {[...Array(2)].map((_, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-lg animate-pulse">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-muted rounded-full"></div>
                          <div className="h-4 bg-muted rounded w-20"></div>
                        </div>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : topLevelComments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  topLevelComments.map((comment) => {
                    const replies = comments.filter(c => c.parent_comment_id === comment.id);
                    
                    return (
                      <div key={comment.id} className="space-y-2">
                         {/* Main Comment */}
                         <div className="p-3 bg-muted/30 rounded-lg">
                           <div className="flex items-start justify-between">
                             <div className="flex items-center gap-2 mb-2">
                               <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                                 {comment.author_name.charAt(0).toUpperCase()}
                               </div>
                               <span className="text-sm font-medium">{comment.author_name}</span>
                               <span className="text-xs text-muted-foreground">
                                 {formatTimeAgo(comment.created_at)}
                               </span>
                             </div>
                             
                             {/* 3-dot menu - only show for comment owner */}
                             {user && user.id === comment.user_id && (
                               <div className="relative">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => toggleDropdown(comment.id)}
                              className="h-7 sm:h-8 p-1 sm:p-2"
                            >
                              <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                                 </Button>
                                 
                                 {/* Dropdown Menu */}
                                 {openDropdowns.has(comment.id) && (
                                   <div className="absolute right-0 top-8 z-50 bg-background border border-border rounded-lg shadow-lg w-40">
                                     <div className="py-1">
                                       <button
                                    onClick={() => handleEditComment(comment)}
                                    className="flex items-center gap-2 w-full px-3 py-2 text-xs sm:text-sm hover:bg-accent transition-colors"
                                  >
                                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                         Edit comment
                                       </button>
                                  <button
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="flex items-center gap-2 w-full px-3 py-2 text-xs sm:text-sm hover:bg-destructive/10 hover:text-destructive transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                         Delete comment
                                       </button>
                                     </div>
                                   </div>
                                 )}
                               </div>
                             )}
                           </div>
                            
                            <p className="text-sm mb-3">{comment.content}</p>
                           
                           <div className="flex items-center gap-3">
                             <div className="flex items-center gap-1">
                               <Button variant="ghost" size="sm" className="h-6 px-2">
                                 <ThumbsUp className="w-3 h-3 mr-1" />
                                 {comment.votes}
                               </Button>
                             </div>
                             {user && (
                               <Button 
                                 variant="ghost" 
                                 size="sm" 
                                 className="h-6 px-2"
                                 onClick={() => handleReply(comment.id)}
                               >
                                 <Reply className="w-3 h-3 mr-1" />
                                 Reply
                               </Button>
                             )}
                           </div>
                         </div>
                        
                        {/* Replies */}
                        {replies.length > 0 && (
                          <div className="ml-6 space-y-2">
                            {replies.map((reply) => (
                              <div key={reply.id} className="p-3 bg-muted/20 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-5 h-5 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                                    {reply.author_name.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="text-sm font-medium">{reply.author_name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatTimeAgo(reply.created_at)}
                                  </span>
                                </div>
                                <p className="text-sm">{reply.content}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Hidden on mobile */}
          <div className="hidden lg:block w-80 space-y-4 flex-shrink-0">
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Upvoters</span>
                <div className="flex items-center gap-1">
                  <ArrowUp className="w-4 h-4" />
                  <span className="font-medium">{post.votes}</span>
                </div>
              </div>
              
              <div>
                <span className="text-sm font-medium">Status</span>
                <div className="mt-1">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    In Review
                  </Badge>
                </div>
              </div>
              
              <div>
                <span className="text-sm font-medium">Board</span>
                <div className="mt-1">
                  <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                    <span>{categoryInfo.emoji}</span>
                    <span>{categoryInfo.label}</span>
                  </Badge>
                </div>
              </div>
              
              <div>
                <span className="text-sm font-medium">Date</span>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatTimeAgo(post.created_at)}
                </p>
              </div>
              
              <div>
                <span className="text-sm font-medium">Author</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                    {post.author_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm">{post.author_name}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-2">Subscribe to post</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Get notified by email when there are changes.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Subscribe
              </Button>
            </div>
          </div>
          
          {/* Mobile Actions Bar - Only visible on mobile */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50">
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                {post.votes}
              </Button>
              <Button variant="outline" size="sm">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}