import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import hobsonLogo from "/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png";
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

interface AnnouncementPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string;
  reading_time: number;
  author: {
    display_name: string;
  };
  categories: Array<{
    name: string;
    slug: string;
  }>;
}

const AnnouncementPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<AnnouncementPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        // Safely decode the URL slug and handle potential trailing spaces
        let decodedSlug = slug;
        try {
          decodedSlug = decodeURIComponent(slug);
        } catch (error) {
          console.log('Could not decode slug, using as-is:', slug);
        }
        
        console.log('Searching for slug:', decodedSlug);
        console.log('Trying variations:', [decodedSlug, decodedSlug.trim(), `${decodedSlug} `]);
        
        const { data: postData, error: postError } = await supabase
          .from('blog_posts')
          .select(`
            id,
            title,
            slug,
            content,
            excerpt,
            featured_image_url,
            featured_image_alt,
            meta_title,
            meta_description,
            published_at,
            reading_time,
            author_id
          `)
          .eq('link_location', 'announcements')
          .eq('status', 'published')
          .or(`slug.eq.${decodedSlug},slug.eq.${decodedSlug.trim()},slug.eq.${decodedSlug} `)
          .maybeSingle();

        console.log('Database query result:', { postData, postError });

        if (postError || !postData) {
          console.log('No post found or error occurred');
          setError('Announcement not found');
          return;
        }

        // Fetch author data
        const { data: authorData } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('user_id', postData.author_id)
          .single();

        // Fetch categories
        const { data: categoryData } = await supabase
          .from('blog_post_categories')
          .select(`
            blog_categories (
              name,
              slug
            )
          `)
          .eq('post_id', postData.id);

        const categories = categoryData?.map(item => item.blog_categories).filter(Boolean) || [];

        setPost({
          ...postData,
          author: {
            display_name: authorData?.display_name || 'Anonymous'
          },
          categories
        });
      } catch (err) {
        setError('Failed to load announcement');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Announcement Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || 'The requested announcement could not be found.'}</p>
          <Link to="/announcements" className="text-primary hover:underline">
            ← Back to Announcements
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.meta_title || post.title} - Hobson AI</title>
        <meta name="description" content={post.meta_description || post.excerpt} />
        <meta property="og:title" content={post.meta_title || post.title} />
        <meta property="og:description" content={post.meta_description || post.excerpt} />
        {post.featured_image_url && (
          <meta property="og:image" content={post.featured_image_url} />
        )}
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.published_at} />
        <meta property="article:author" content={post.author.display_name} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/announcements" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Back to Announcements</span>
                </Link>
                <div className="h-6 w-px bg-border" />
                <Link to="/" className="flex items-center gap-2">
                  <img src={hobsonLogo} alt="Hobson" className="h-8 w-auto" />
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <article>
            <div className="flex gap-8 min-h-[80vh]">
              {/* Left Container - Featured Image */}
              <div className="flex flex-col">
                {post.featured_image_url && (
                  <div className="p-4 rounded-lg">
                    <img
                      src={post.featured_image_url}
                      alt={post.featured_image_alt || post.title}
                      className="w-full h-auto rounded-lg object-cover max-h-[70vh]"
                    />
                  </div>
                )}
                
                {/* Back Link */}
                <div className="mt-2">
                  <Link 
                    to="/announcements" 
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to all announcements
                  </Link>
                </div>
              </div>

              {/* Right Container - Content */}
              <div className="flex-1 flex flex-col border-2 border-red-500">
                {/* Article Header */}
                <header className="mb-1 border-2 border-red-300">
                  <div className="flex items-center gap-2 mb-4">
                    {post.categories.map((category) => (
                      <Badge key={category.slug} variant="secondary">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                  
                  <h1 className="text-3xl font-bold text-foreground mb-4">
                    {post.title}
                  </h1>
                  
                  {post.excerpt && (
                    <p className="text-lg text-muted-foreground mb-6">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{post.author.display_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.published_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{post.reading_time} min read</span>
                    </div>
                  </div>
                </header>

                {/* Article Content */}
                <Card className="p-6 flex-1 border-2 border-red-600">
                  <div 
                    className="prose prose-lg max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </Card>
              </div>
            </div>
          </article>
        </main>
      </div>
    </>
  );
};

export default AnnouncementPost;