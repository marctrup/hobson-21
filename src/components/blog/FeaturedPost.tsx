import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
  const finalSlug = encodeURIComponent((post.slug || '').trim());
  const href = `/blog/${finalSlug}`;

  return (
    <div>
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-4 gap-0">
          <Link to={href} className="aspect-[3/2] bg-background block">
            {post.featured_image_url ? (
               <LazyImage
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-full object-contain"
                width={400}
                height={267}
                priority={true}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 400px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Tag className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
          </Link>
          <CardContent className="md:col-span-3 p-4 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <Badge className="text-xs bg-accent-amber/15 text-accent-amber border border-accent-amber/30 hover:bg-accent-amber/20">Featured</Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {post.published_at ? format(new Date(post.published_at), 'MMM dd') : 'Draft'}
              </div>
            </div>
            <h2 className="text-xl font-bold mb-1 line-clamp-1">
              <Link to={href} className="hover:text-primary transition-colors">{post.title}</Link>
            </h2>
            <p className="text-muted-foreground mb-2 text-sm line-clamp-1">{post.excerpt}</p>
            
            <div className="flex items-center justify-end mb-3">
              <Link
                to={href}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Read More <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            
            {post.categories.length > 0 && (
              <div className="flex flex-wrap gap-1 -mt-1">
                {post.categories.slice(0, 2).map((category, i) => {
                  const palette = [
                    "border-primary/40 text-primary",
                    "border-accent-teal/40 text-accent-teal",
                    "border-accent-amber/40 text-accent-amber",
                    "border-accent-rose/40 text-accent-rose",
                  ];
                  const tone = palette[i % palette.length];
                  return (
                    <Badge key={category.slug} variant="outline" className={`text-xs ${tone}`}>
                      {category.name}
                    </Badge>
                  );
                })}
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
};