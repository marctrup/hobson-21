import { Link } from "react-router-dom";
import { Calendar, Clock, Tag, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { LazyImage } from "@/components/LazyImage";

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

interface BlogPostCardProps {
  post: BlogPost;
}

export const BlogPostCard = ({ post }: BlogPostCardProps) => {
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
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="grid md:grid-cols-3 gap-0">
        <div className="aspect-[3/2]">
          {post.featured_image_url ? (
            <LazyImage
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-full object-cover"
              width={243}
              height={162}
              sizes="(max-width: 768px) 90vw, 243px"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Tag className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <CardContent className="md:col-span-2 p-4 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {format(new Date(post.published_at), 'MMM dd')}
            <Clock className="w-4 h-4 ml-2" />
            {post.reading_time}m
          </div>
          
          <h3 className="text-lg font-semibold mb-1 line-clamp-2 leading-tight">{post.title}</h3>
          <p className="text-muted-foreground mb-2 text-sm line-clamp-2">{post.excerpt}</p>
          
          <div className="flex items-center justify-end mb-3">
            <button
              onClick={handleReadMore}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Read More <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          
          {post.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.categories.slice(0, 2).map((category) => (
                <Badge key={category.slug} variant="outline" className="text-xs">
                  {category.name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
};