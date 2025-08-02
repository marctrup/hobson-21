import { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { FeaturedPost } from "@/components/blog/FeaturedPost";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { useIsMobile } from "@/hooks/use-mobile";

// Request deduplication
const pendingRequests = new Map<string, Promise<any>>();

const deduplicateRequest = <T,>(key: string, requestFn: () => Promise<T>): Promise<T> => {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key) as Promise<T>;
  }
  
  const promise = requestFn();
  pendingRequests.set(key, promise);
  
  // Clean up after request completes
  promise.finally(() => {
    pendingRequests.delete(key);
  });
  
  return promise;
};

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image_url: string | null;
  published_at: string;
  reading_time: number;
  author: {
    display_name: string;
  };
  categories: {
    name: string;
    slug: string;
  }[];
}

interface Category {
  name: string;
  slug: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    loadData();
  }, [selectedCategory, isMobile]);

  const loadData = async () => {
    setLoading(true);
    try {
      const limit = isMobile ? 10 : 20;
      
      // Single optimized query for posts with categories
      const postsPromise = deduplicateRequest(
        `posts_${limit}_${selectedCategory || 'all'}`,
        async () => {
          let query = supabase
            .from('blog_posts')
            .select(`
              id,
              title,
              slug,
              excerpt,
              featured_image_url,
              published_at,
              updated_at,
              reading_time,
              sort_order,
              blog_post_categories(
                blog_categories(name, slug)
              )
            `)
            .eq('status', 'published')
            .order('sort_order', { ascending: false })
            .order('updated_at', { ascending: false })
            .limit(limit);

          if (selectedCategory) {
            query = query.eq('blog_post_categories.blog_categories.slug', selectedCategory);
          }

          const { data, error } = await query;
          return { data, error };
        }
      );

      const categoriesPromise = deduplicateRequest('categories', async () => {
        const { data, error } = await supabase
          .from('blog_categories')
          .select('name, slug')
          .order('name');
        return { data, error };
      });

      const [postsResponse, categoriesResponse] = await Promise.all([postsPromise, categoriesPromise]);

      if (postsResponse.error) {
        console.error('Error fetching posts:', postsResponse.error);
      } else {
        const formattedPosts = postsResponse.data?.map(post => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          featured_image_url: post.featured_image_url,
          published_at: post.published_at || post.updated_at,
          reading_time: post.reading_time,
          author: { display_name: 'Admin' }, // Default author
          categories: post.blog_post_categories?.map(pc => pc.blog_categories).filter(Boolean) || []
        })) || [];
        
        setPosts(formattedPosts);
      }

      if (categoriesResponse.error) {
        console.error('Error fetching categories:', categoriesResponse.error);
      } else {
        setCategories(categoriesResponse.data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Property Management AI Blog | Industry Insights & Tips | Hobson AI</title>
          <meta name="description" content="Latest insights, updates, and expert tips for property management professionals using AI-powered document intelligence and automation tools." />
          <meta name="keywords" content="property management blog, real estate AI insights, property technology news, AI automation tips, property management trends" />
          <meta property="og:title" content="Property Management AI Blog | Hobson AI" />
          <meta property="og:description" content="Latest insights, updates, and expert tips for property management professionals using AI-powered document intelligence." />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://hobsonschoice.ai/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@HobsonAI" />
          <meta name="twitter:title" content="Property Management AI Blog | Hobson AI" />
          <meta name="twitter:description" content="Latest insights and tips for property management professionals using AI." />
          <meta name="twitter:image" content="https://hobsonschoice.ai/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png" />
          <link rel="canonical" href="https://hobsonschoice.ai/blog" />
          
          {/* Performance optimizations */}
          <link rel="dns-prefetch" href="//hobsonschoice.ai" />
          <link rel="preconnect" href="https://hobsonschoice.ai" />
          {featuredPost?.featured_image_url && (
            <link rel="preload" as="image" href={featuredPost.featured_image_url} />
          )}
        </Helmet>
        
        <Header />
        <BlogHero />
        
        <div className="container mx-auto px-4 py-4 md:-mt-16">
          <CategoryFilter 
            categories={categories} 
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
          
          {posts.length > 0 ? (
            <>
              {featuredPost && (
                <div className="mb-6">
                  <FeaturedPost post={featuredPost} />
                </div>
              )}
              
              {remainingPosts.length > 0 && (
                <BlogGrid posts={remainingPosts} />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {selectedCategory 
                  ? `No posts found in "${categories.find(c => c.slug === selectedCategory)?.name}" category.`
                  : "No posts available."
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Blog;