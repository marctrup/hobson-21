import { Link } from "react-router-dom";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
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
  const finalSlug = encodeURIComponent((post.slug || '').trim());
  const href = `/blog/${finalSlug}`;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
      <Link to={href} className="aspect-[16/10] bg-muted block overflow-hidden">
        {post.featured_image_url ? (
          <LazyImage
            src={post.featured_image_url}
            alt={post.title}
            className="w-full h-full object-cover"
            width={480}
            height={300}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Tag className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          {format(new Date(post.published_at), 'MMM dd, yyyy')}
        </div>

        <h3 className="text-lg font-semibold mb-2 line-clamp-2 leading-snug">
          <Link to={href} className="hover:text-primary transition-colors">{post.title}</Link>
        </h3>
        <p className="text-muted-foreground mb-4 text-sm line-clamp-3">{post.excerpt}</p>

        <div className="mt-auto flex items-center justify-between gap-2">
          {post.categories.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {post.categories.slice(0, 1).map((category, i) => {
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
          ) : <span />}
          <Link
            to={href}
            className="inline-flex items-center gap-1 text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ color: '#B4914F' }}
          >
            Read <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </Card>
  );
};