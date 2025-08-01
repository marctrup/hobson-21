import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { OptimizedImage } from "@/components/OptimizedImage";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image_url: string | null;
  published_at: string | null;
  reading_time: number;
  author: {
    display_name: string;
  };
  categories: {
    name: string;
    slug: string;
  }[];
}

interface FeaturedPostProps {
  post: BlogPost;
}

export const FeaturedPost = ({ post }: FeaturedPostProps) => {
  // Sanitize slug to ensure it's URL-safe
  const sanitizedSlug = post.slug
    .toLowerCase()
    .replace(/[^a-z0-9\-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
    
  const handleReadMore = () => {
    window.location.href = `/blog/${sanitizedSlug}`;
  };

  return (
    <div className="mb-6 md:mb-8">
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-3 gap-0">
          <div className="aspect-[4/3] md:aspect-[3/2]">
            {post.featured_image_url ? (
              <OptimizedImage
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-full object-cover"
                width={300}
                height={225}
                priority={true}
                fetchPriority="high"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Tag className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
          </div>
          <CardContent className="md:col-span-2 p-4 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="secondary" className="text-xs">Featured</Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {post.published_at ? format(new Date(post.published_at), 'MMM dd') : 'Draft'}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {post.reading_time}min
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2 line-clamp-1">{post.title}</h2>
            <p className="text-muted-foreground mb-3 text-sm line-clamp-1">{post.excerpt}</p>
            
            {post.categories.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {post.categories.slice(0, 2).map((category) => (
                  <Badge key={category.slug} variant="outline" className="text-xs">
                    {category.name}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="flex items-center justify-end">
              <button
                onClick={handleReadMore}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Read More <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};