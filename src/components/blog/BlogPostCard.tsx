import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  
  // Use original slug without aggressive sanitization
  const finalSlug = post.slug || '';
    
  const handleReadMore = () => {
    
    navigate(`/blog/${finalSlug}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
      <div className="flex flex-col h-full">
        <div className="w-full aspect-[4/3] bg-muted">
          {post.featured_image_url ? (
            <LazyImage
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-full object-cover"
              width={400}
              height={300}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Tag className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
        </div>
        
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {format(new Date(post.published_at), 'MMM dd')}
            <Clock className="w-4 h-4 ml-2" />
            {post.reading_time}m
          </div>
          
          <h3 className="text-xl font-semibold mb-3 line-clamp-2 leading-tight">{post.title}</h3>
          <p className="text-muted-foreground mb-4 text-sm line-clamp-3 flex-1">{post.excerpt}</p>
          
          {post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.slice(0, 2).map((category) => (
                <Badge key={category.slug} variant="outline" className="text-xs">
                  {category.name}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex justify-end mt-auto">
            <button
              onClick={handleReadMore}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Read More <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};