import { Link, useNavigate } from "react-router-dom";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
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
  const navigate = useNavigate();
  
  // Use original slug without aggressive sanitization
  const finalSlug = post.slug || '';
    
  const handleReadMore = () => {
    
    navigate(`/blog/${finalSlug}`);
  };

  return (
    <div>
      <Card className="overflow-hidden">
         <div className="grid md:grid-cols-4 gap-0 min-h-[200px]">
           <div className="aspect-[3/2] md:min-h-[200px]">
            {post.featured_image_url ? (
               <LazyImage
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-full object-cover"
                width={400}
                height={267}
                priority={true}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 400px"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Tag className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
          </div>
          <CardContent className="md:col-span-3 p-4 flex flex-col justify-center">
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
            <h2 className="text-xl font-bold mb-1 line-clamp-1">{post.title}</h2>
            <p className="text-muted-foreground mb-2 text-sm line-clamp-1">{post.excerpt}</p>
            
            <div className="flex items-center justify-end mb-3">
              <button
                onClick={handleReadMore}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Read More <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            
            {post.categories.length > 0 && (
              <div className="flex flex-wrap gap-1 -mt-1">
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
    </div>
  );
};