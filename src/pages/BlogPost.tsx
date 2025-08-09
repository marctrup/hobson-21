import { useState, useEffect, useRef } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet-async";
import { HomepageHeader } from "@/components/homepage/HomepageHeader";
import { OptimizedImage } from "@/components/OptimizedImage";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  published_at: string;
  reading_time: number;
  meta_title: string | null;
  meta_description: string | null;
  author: {
    display_name: string;
  };
  categories: {
    name: string;
    slug: string;
  }[];
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      // Minimal query for faster loading
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
          updated_at,
          reading_time,
          meta_title,
          meta_description,
          profiles (
            display_name
          )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      if (error) {
        console.error('Error fetching post:', error);
        setNotFound(true);
      } else if (data) {
        // Fetch categories separately and in parallel
        const categoriesPromise = supabase
          .from('blog_post_categories')
          .select(`
            blog_categories (
              name,
              slug
            )
          `)
          .eq('post_id', data.id);

        const { data: categoriesData } = await categoriesPromise;

        const formattedPost: BlogPost = {
          id: data.id,
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          featured_image_url: data.featured_image_url,
          featured_image_alt: data.featured_image_alt,
          published_at: data.published_at || data.updated_at,
          reading_time: data.reading_time,
          meta_title: data.meta_title,
          meta_description: data.meta_description,
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

  // Preload the featured image for LCP optimization
  useEffect(() => {
    if (post?.featured_image_url) {
      // Create preload link immediately
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = post.featured_image_url;
      link.setAttribute('fetchpriority', 'high');
      link.setAttribute('media', '(max-width: 768px)'); // Prioritize mobile
      document.head.appendChild(link);
      
      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [post?.featured_image_url]);

  // Handle external links properly - only within blog content
  useEffect(() => {
    if (post && contentRef.current) {
      const handleLinkClick = (e: Event) => {
        const target = e.target as HTMLElement;
        
        if (target.tagName === 'A') {
          const link = target as HTMLAnchorElement;
          const href = link.getAttribute('href');
          
          console.log('Link clicked:', href);
          
          if (href) {
            // Handle mailto and tel links - let them work natively
            if (href.startsWith('mailto:') || href.startsWith('tel:')) {
              console.log('Mailto/Tel link detected, allowing native behavior:', href);
              // Force the native behavior by directly setting window.location
              e.preventDefault();
              e.stopPropagation();
              window.location.href = href;
              return;
            }
            
            // Check if it's an external HTTP link
            const isExternalHttp = href.startsWith('http') || 
                                 (href.includes('.') && !href.startsWith('/') && !href.startsWith('#'));
            
            if (isExternalHttp) {
              console.log('External HTTP link detected, preventing default:', href);
              e.preventDefault();
              e.stopPropagation();
              
              // Add https:// if the href doesn't have a protocol
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

  // Optimize images within blog content
  useEffect(() => {
    if (post && contentRef.current) {
      const images = contentRef.current.querySelectorAll('img');
      images.forEach((img) => {
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
        if (!img.hasAttribute('decoding')) {
          img.setAttribute('decoding', 'async');
        }
        // Add responsive sizes if not present
        if (!img.hasAttribute('sizes')) {
          img.setAttribute('sizes', '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw');
        }
      });
    }
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <HomepageHeader />
        <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-4 md:h-6 bg-muted rounded-md w-16 md:w-24 mb-4 md:mb-8"></div>
            <div className="aspect-video bg-muted rounded-lg mb-4 md:mb-8"></div>
            <div className="h-6 md:h-10 bg-muted rounded-md w-3/4 mb-3 md:mb-4"></div>
            <div className="h-3 md:h-4 bg-muted rounded-md w-32 md:w-48 mb-4 md:mb-8"></div>
            <div className="space-y-2 md:space-y-3">
              <div className="h-3 md:h-4 bg-muted rounded-md w-full"></div>
              <div className="h-3 md:h-4 bg-muted rounded-md w-5/6"></div>
              <div className="h-3 md:h-4 bg-muted rounded-md w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{post.meta_title || post.title} | Hobson's Choice AI Blog</title>
        <meta name="description" content={post.meta_description || post.excerpt} />
        <meta name="keywords" content="property management, real estate AI, property technology" />
        
        {/* Open Graph */}
        <meta property="og:title" content={post.meta_title || post.title} />
        <meta property="og:description" content={post.meta_description || post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://hobsonschoice.ai/blog/${slug}`} />
        {post.featured_image_url && (
          <meta property="og:image" content={post.featured_image_url} />
        )}
        {post.featured_image_alt && (
          <meta property="og:image:alt" content={post.featured_image_alt} />
        )}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.meta_title || post.title} />
        <meta name="twitter:description" content={post.meta_description || post.excerpt} />
        {post.featured_image_url && (
          <meta name="twitter:image" content={post.featured_image_url} />
        )}
        {post.featured_image_alt && (
          <meta name="twitter:image:alt" content={post.featured_image_alt} />
        )}
        
        {/* Article structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.meta_title || post.title,
            "description": post.meta_description || post.excerpt,
            "image": post.featured_image_url ? {
              "@type": "ImageObject",
              "url": post.featured_image_url,
              "description": post.featured_image_alt || post.title
            } : undefined,
            "author": {
              "@type": "Person",
              "name": post.author.display_name
            },
            "publisher": {
              "@type": "Organization",
              "name": "Hobson's Choice AI",
              "logo": {
                "@type": "ImageObject",
                "url": "https://hobsonschoice.ai/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png"
              }
            },
            "datePublished": post.published_at,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://hobsonschoice.ai/blog/${slug}`
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <HomepageHeader />
        
        <article className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Button */}
          <div className="mb-8">
            <Button variant="outline" asChild>
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>

          {/* Featured Image */}
          {post.featured_image_url && (
            <div className="aspect-video md:aspect-[16/9] mb-6 md:mb-8 rounded-lg overflow-hidden bg-muted">
              <OptimizedImage
                src={post.featured_image_url}
                alt={post.featured_image_alt || post.title}
                className="w-full h-full object-cover"
                width={800}
                height={450}
                priority={true}
                fetchPriority="high"
                sizes="(max-width: 480px) 100vw, (max-width: 768px) 95vw, (max-width: 1200px) 80vw, 800px"
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
            
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {format(new Date(post.published_at), 'MMMM dd, yyyy')}
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
            className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-p:mb-4 prose-strong:text-foreground prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800 hover:prose-a:no-underline [&>p]:mb-4 [&>div]:mb-4 [&_a]:text-blue-600 [&_a]:underline [&_a:hover]:text-blue-800 [&_a:hover]:no-underline [&_ul]:!list-disc [&_ul]:!pl-6 [&_ul]:!my-0 [&_ul]:!space-y-0 [&_ol]:!list-decimal [&_ol]:!pl-6 [&_ol]:!my-0 [&_ol]:!space-y-0 [&_li]:!mb-0 [&_li]:!mt-0 [&_li]:!py-0 [&_li]:!leading-[1.1] [&_ul_li]:!mb-0 [&_ol_li]:!mb-0 [&_li]:!min-h-0"
            dangerouslySetInnerHTML={{ 
              __html: post.content
                // Handle links - add target="_blank" only for http/https links, not mailto
                .replace(/<a\s+([^>]*href=["'](?:https?:\/\/[^"']+)["'][^>]*)>/gi, '<a $1 target="_blank" rel="noopener noreferrer">')
                // Convert double line breaks to paragraph breaks, but preserve existing HTML
                .replace(/\n\n+/g, '</p><p>')
                // Convert single line breaks to <br> tags
                .replace(/\n/g, '<br>')
                // Wrap the content in a paragraph if it doesn't start with an HTML tag
                .replace(/^(?!<)/, '<p>')
                .replace(/(?<!>)$/, '</p>')
                // Clean up empty paragraphs and fix paragraph issues around HTML elements
                .replace(/<p><\/p>/g, '')
                .replace(/<p>(<(?:ul|ol|div|h[1-6]|blockquote))/g, '$1')
                .replace(/(<\/(?:ul|ol|div|h[1-6]|blockquote)>)<\/p>/g, '$1')
            }}
          />

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t">
            <div className="flex justify-center">
              <Button asChild>
                <Link to="/blog">
                  More Articles
                </Link>
              </Button>
            </div>
          </footer>
        </article>
      </div>
    </>
  );
};

export default BlogPost;