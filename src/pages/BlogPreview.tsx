import { useState, useEffect, useRef } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, Edit, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet-async";
import { HomepageHeader } from "@/components/homepage/HomepageHeader";
import { OptimizedImage } from "@/components/OptimizedImage";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  published_at: string | null;
  created_at: string;
  reading_time: number;
  meta_title: string | null;
  meta_description: string | null;
  status: string;
  author: {
    display_name: string;
  };
  categories: {
    name: string;
    slug: string;
  }[];
}

const BlogPreview = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id && user) {
      fetchPost();
    } else if (!user) {
      setNotFound(true);
      setLoading(false);
    }
  }, [id, user]);

  const fetchPost = async () => {
    try {
      console.log('Fetching post with ID:', id);
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          id,
          title,
          content,
          excerpt,
          featured_image_url,
          featured_image_alt,
          published_at,
          created_at,
          reading_time,
          meta_title,
          meta_description,
          status,
          profiles (
            display_name
          )
        `)
        .eq('id', id)
        .maybeSingle();

      console.log('Query result:', { data, error });

      if (error) {
        console.error('Error fetching post:', error);
        setNotFound(true);
      } else if (data) {
        // Fetch categories
        const { data: categoriesData } = await supabase
          .from('blog_post_categories')
          .select(`
            blog_categories (
              name,
              slug
            )
          `)
          .eq('post_id', data.id);

        console.log('Categories data:', categoriesData);

        const formattedPost: BlogPost = {
          id: data.id,
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          featured_image_url: data.featured_image_url,
          featured_image_alt: data.featured_image_alt,
          published_at: data.published_at,
          created_at: data.created_at,
          reading_time: data.reading_time,
          meta_title: data.meta_title,
          meta_description: data.meta_description,
          status: data.status,
          author: {
            display_name: data.profiles?.display_name || 'Unknown Author'
          },
          categories: categoriesData?.map(item => item.blog_categories).filter(Boolean) || []
        };
        setPost(formattedPost);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Unexpected error fetching post:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle external links properly
  useEffect(() => {
    if (post && contentRef.current) {
      const handleLinkClick = (e: Event) => {
        const target = e.target as HTMLElement;
        
        if (target.tagName === 'A') {
          const link = target as HTMLAnchorElement;
          const href = link.getAttribute('href');
          
          if (href) {
            if (href.startsWith('mailto:') || href.startsWith('tel:')) {
              e.preventDefault();
              e.stopPropagation();
              window.location.href = href;
              return;
            }
            
            const isExternalHttp = href.startsWith('http') || 
                                 (href.includes('.') && !href.startsWith('/') && !href.startsWith('#'));
            
            if (isExternalHttp) {
              e.preventDefault();
              e.stopPropagation();
              const finalUrl = href.startsWith('http') ? href : `https://${href}`;
              window.open(finalUrl, '_blank', 'noopener,noreferrer');
            }
          }
        }
      };

      contentRef.current.addEventListener('click', handleLinkClick, true);
      
      return () => {
        if (contentRef.current) {
          contentRef.current.removeEventListener('click', handleLinkClick, true);
        }
      };
    }
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <HomepageHeader />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded-md w-24 mb-8"></div>
            <div className="aspect-video bg-muted rounded-lg mb-8"></div>
            <div className="h-10 bg-muted rounded-md w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded-md w-48 mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded-md w-full"></div>
              <div className="h-4 bg-muted rounded-md w-5/6"></div>
              <div className="h-4 bg-muted rounded-md w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    console.log('Post not found or notFound flag set:', { notFound, post: !!post });
    return <Navigate to="/admin/blog" replace />;
  }

  const displayDate = post.published_at || post.created_at;

  return (
    <>
      <Helmet>
        <title>Preview: {post.title} | Blog Editor</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <HomepageHeader />
        
        {/* Preview Banner */}
        <div className="bg-yellow-100 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 py-2">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">
                Preview Mode - {post.status === 'draft' ? 'Draft' : 'Published'} Post
              </span>
            </div>
            <Button size="sm" asChild>
              <Link to={`/admin/blog/edit/${post.id}`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Post
              </Link>
            </Button>
          </div>
        </div>
        
        <article className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Button */}
          <div className="mb-8">
            <Button variant="outline" asChild>
              <Link to={`/admin/blog/edit/${post.id}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Editor
              </Link>
            </Button>
          </div>

          {/* Featured Image */}
          {post.featured_image_url && (
            <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-8">
              <OptimizedImage
                src={post.featured_image_url}
                alt={post.featured_image_alt || post.title}
                className="w-full h-full object-cover"
                width={800}
                height={450}
                priority={true}
              />
            </div>
          )}

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((category) => (
                <Badge key={category.slug} variant="secondary">
                  {category.name}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {format(new Date(displayDate), 'MMMM dd, yyyy')}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.reading_time} min read
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div 
            ref={contentRef}
            className="prose-headings:text-foreground prose-strong:text-foreground [&_a]:text-blue-600 [&_a]:underline [&_a:hover]:text-blue-800 [&_a:hover]:no-underline [&_ul]:!list-disc [&_ul]:!pl-6 [&_ol]:!list-decimal [&_ol]:!pl-6 [&_li]:leading-relaxed text-foreground text-lg max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: post.content
                .replace(/<a\s+([^>]*href=["'](?:https?:\/\/[^"']+)["'][^>]*)>/gi, '<a $1 target="_blank" rel="noopener noreferrer">')
                .replace(/\n/g, '<br>')
            }}
          />

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t">
            <div className="flex justify-center">
              <Button asChild>
                <Link to={`/admin/blog/edit/${post.id}`}>
                  Continue Editing
                </Link>
              </Button>
            </div>
          </footer>
        </article>
      </div>
    </>
  );
};

export default BlogPreview;