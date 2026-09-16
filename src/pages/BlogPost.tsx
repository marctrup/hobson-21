import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Calendar, ArrowLeft, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet-async";
import { HomepageHeader } from "@/components/homepage/HomepageHeader";
import { OptimizedImage } from "@/components/OptimizedImage";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { format } from "date-fns";
import { getBreadcrumbStructuredData } from "@/utils/seo-data";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  published_at: string;
  updated_at: string;
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

const PIB_ARTICLE_SLUG = "how-ai-recognises-patterns-tenancy-agreements";
const PIB_ARTICLE_URL = `https://hobsonschoice.ai/blog/${PIB_ARTICLE_SLUG}`;
const PIB_EXTERNAL_URL = "https://pibuk.org/how-ai-recognises-patterns-like-a-boxer-and-a-trainer/";
const PIB_META_TITLE = "How AI Recognises Patterns in Property Leases | Hobson AI";
const PIB_META_DESCRIPTION = "Marc Trup explains how AI recognises patterns in complex property leases, why variation in lease wording matters, and how Hobson approaches property document intelligence.";

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
          updated_at: data.updated_at,
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

  // Links inside blog content are rendered as real anchors by MarkdownRenderer,
  // so browsers (and crawlers) handle them natively.

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

  const isPibArticle = slug === PIB_ARTICLE_SLUG;
  const canonicalUrl = isPibArticle ? PIB_ARTICLE_URL : `https://hobsonschoice.ai/blog/${slug}`;
  const pageTitle = isPibArticle ? PIB_META_TITLE : `${post.meta_title || post.title} | Hobson AI`;
  const pageDescription = isPibArticle ? PIB_META_DESCRIPTION : post.meta_description || post.excerpt;
  const articleAuthor = isPibArticle ? "Marc Trup" : post.author.display_name;
  const articleContent = isPibArticle
    ? post.content.replace(/^#\s+\*{0,2}[^\n]+\*{0,2}\s*\n+/, "")
    : post.content;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="property management, real estate AI, property technology, AI document analysis" />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* OpenAI/ChatGPT optimization */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        <meta name="author" content={articleAuthor} />
        <meta name="article:published_time" content={post.published_at} />
        <meta name="article:modified_time" content={post.updated_at} />
        <meta name="article:author" content={articleAuthor} />
        
        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        {post.featured_image_url && (
          <meta property="og:image" content={post.featured_image_url} />
        )}
        {post.featured_image_alt && (
          <meta property="og:image:alt" content={post.featured_image_alt} />
        )}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
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
            "headline": isPibArticle ? "How AI Recognises Patterns in Property Leases" : post.title,
            "description": pageDescription,
            "image": post.featured_image_url ? {
              "@type": "ImageObject",
              "url": post.featured_image_url,
              "description": post.featured_image_alt || post.title,
              "width": 800,
              "height": 450
            } : undefined,
            "author": {
              "@type": "Person",
              "@id": isPibArticle ? "https://hobsonschoice.ai/#marc-trup" : undefined,
              "name": articleAuthor,
              "url": isPibArticle ? "https://hobsonschoice.ai/founder" : "https://hobsonschoice.ai"
            },
            "publisher": {
              "@type": "Organization",
              "@id": "https://hobsonschoice.ai/#organization",
              "name": "Hobson AI",
              "logo": {
                "@type": "ImageObject",
                "url": "https://hobsonschoice.ai/hobson-logo.png",
                "width": 200,
                "height": 200
              },
              "url": "https://hobsonschoice.ai"
            },
            "datePublished": post.published_at,
            "dateModified": post.updated_at,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": canonicalUrl
            },
            "keywords": post.categories.map(c => c.name).join(", "),
            "articleSection": post.categories.length > 0 ? post.categories[0].name : "Property Management",
            "wordCount": Math.ceil(articleContent.split(' ').length),
            "inLanguage": "en-GB"
          })}
        </script>
        {isPibArticle && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://hobsonschoice.ai/#marc-trup",
                  "name": "Marc Trup",
                  "url": "https://hobsonschoice.ai/founder",
                  "jobTitle": "Director",
                  "worksFor": { "@id": "https://hobsonschoice.ai/#organization" }
                },
                {
                  "@type": "Organization",
                  "@id": "https://hobsonschoice.ai/#organization",
                  "name": "Hobson AI",
                  "url": "https://hobsonschoice.ai"
                }
              ]
            })}
          </script>
        )}
        
        {/* Breadcrumb structured data */}
        <script type="application/ld+json">
          {JSON.stringify(getBreadcrumbStructuredData([
            { name: "Home", url: "https://hobsonschoice.ai/" },
            { name: "Blog", url: "https://hobsonschoice.ai/blog" },
            { name: post.title, url: canonicalUrl }
          ]))}
        </script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#FCFAF7' }}>
        <HomepageHeader />
        
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>

          <article
            className="bg-background rounded-2xl p-6 md:p-12 lg:p-16"
            style={{ boxShadow: '0 10px 40px -20px rgba(180, 145, 79, 0.25), 0 2px 8px -2px rgba(45, 45, 45, 0.06)' }}
          >
            {/* Featured Image */}
            {post.featured_image_url && (
              <div className="mb-6 md:mb-8 rounded-lg overflow-hidden bg-background">
                <OptimizedImage
                  src={post.featured_image_url}
                  alt={post.featured_image_alt || post.title}
                  className="w-full h-auto object-contain"
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
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
                {isPibArticle && <span>By Marc Trup, Director of Hobson AI</span>}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(post.published_at), 'MMMM dd, yyyy')}
                </div>
              </div>
            </header>

            {isPibArticle && (
              <aside className="mb-8 border-y border-bone bg-bone-wash px-4 py-5 sm:px-6" aria-labelledby="external-publication-heading">
                <p className="text-xs font-semibold uppercase text-brass-text">Published externally</p>
                <h2 id="external-publication-heading" className="mt-2 font-serif text-xl font-normal text-foreground">
                  Also published by Property Investors Bureau
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  This article by Marc Trup, Director of Hobson AI, was also published by the Property Investors Bureau.
                </p>
                <a
                  href={PIB_EXTERNAL_URL}
                  target="_blank"
                  rel="noopener noreferrer external"
                  className="mt-3 inline-flex items-center text-sm font-medium text-[hsl(var(--link))] underline underline-offset-4 hover:text-[hsl(var(--link-hover))]"
                >
                  Read the article on Property Investors Bureau
                  <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </aside>
            )}

            {/* Article Content */}
            <div ref={contentRef}>
              <MarkdownRenderer
                content={articleContent}
                className="prose-headings:text-foreground prose-strong:text-foreground text-foreground text-lg max-w-none"
              />
            </div>

            {isPibArticle && (
              <>
                <aside className="mt-10 border-t border-bone pt-8" aria-labelledby="related-reading-heading">
                  <h2 id="related-reading-heading" className="font-serif text-2xl font-normal text-foreground">Related Hobson reading</h2>
                  <ul className="mt-4 space-y-2 text-base">
                    <li><Link className="text-[hsl(var(--link))] underline underline-offset-4 hover:text-[hsl(var(--link-hover))]" to="/ai-lease-abstraction">How AI lease abstraction turns varied wording into structured property knowledge</Link></li>
                    <li><Link className="text-[hsl(var(--link))] underline underline-offset-4 hover:text-[hsl(var(--link-hover))]" to="/lease-management-software">Lease management software for understanding obligations and dates</Link></li>
                    <li><Link className="text-[hsl(var(--link))] underline underline-offset-4 hover:text-[hsl(var(--link-hover))]" to="/property-management-software">AI software for property teams</Link></li>
                  </ul>
                </aside>
                <aside className="mt-10 border-y border-bone bg-bone-wash px-5 py-7 sm:px-7" aria-labelledby="author-heading">
                  <p className="text-xs font-semibold uppercase text-brass-text">Author</p>
                  <h2 id="author-heading" className="mt-2 font-serif text-2xl font-normal text-foreground">About Marc Trup</h2>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    Marc Trup is a Director of Hobson AI and an experienced property technology founder. He previously co-founded Arthur Online after managing property portfolios first-hand, and now applies that experience to property document intelligence and proactive work.
                  </p>
                  <Link className="mt-4 inline-flex items-center text-sm font-medium text-[hsl(var(--link))] underline underline-offset-4 hover:text-[hsl(var(--link-hover))]" to="/founder">
                    Meet Marc Trup
                  </Link>
                </aside>
              </>
            )}

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
      </div>

    </>
  );
};

export default BlogPost;