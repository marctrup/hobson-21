
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Megaphone, 
  Calendar, 
  Bell,
  Clock,
  User
} from 'lucide-react';
import hobsonLogo from "/hobson-logo.png";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Announcements = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        published_at,
        reading_time,
        priority,
        author_id,
        profiles!blog_posts_author_id_fkey (
          display_name
        ),
        blog_post_categories (
          blog_categories (
            name,
            slug
          )
        )
      `)
      .eq('link_location', 'announcements')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching announcements:', error);
    } else {
      const formattedAnnouncements = data?.map(announcement => ({
        id: announcement.id,
        title: announcement.title,
        slug: announcement.slug,
        description: announcement.excerpt,
        date: announcement.published_at,
        type: announcement.blog_post_categories?.[0]?.blog_categories?.slug || 'announcement',
        priority: announcement.priority || 'medium',
        readingTime: announcement.reading_time,
        author: announcement.profiles?.display_name || 'Anonymous'
      })) || [];
      
      setAnnouncements(formattedAnnouncements);
    }
  };

  const handleSubscribe = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to subscribe.",
        variant: "destructive",
      });
      return;
    }

    setIsSubscribing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('newsletter-subscribe', {
        body: {
          email: email.trim(),
          subscriptionType: 'announcements'
        }
      });

      if (error) {
        throw error;
      }

      if (data?.alreadySubscribed) {
        toast({
          title: "Already subscribed!",
          description: "You're already subscribed to our announcements.",
        });
      } else {
        toast({
          title: "Subscription successful!",
          description: `You'll receive announcements at ${email}. Check your email for a welcome message!`,
        });
      }
      
      setEmail('');
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription failed",
        description: error?.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleAnnouncementClick = (slug) => {
    console.log('Navigating to announcement:', slug);
    // Properly encode the slug to handle special characters like %
    const encodedSlug = encodeURIComponent(slug.trim());
    navigate(`/announcement/${encodedSlug}`);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'feature':
        return 'text-charcoal bg-paper border-bone';
      case 'security':
        return 'text-danger bg-danger-bg border-danger-border';
      case 'product':
        return 'text-success bg-success-bg border-success-border';
      default:
        return 'text-charcoal bg-paper border-bone';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-danger bg-danger-bg border-danger-border';
      case 'medium':
        return 'text-warning bg-warning-bg border-warning-border';
      case 'low':
        return 'text-success bg-success-bg border-success-border';
      default:
        return 'text-charcoal bg-paper border-bone';
    }
  };

  return (
    <>
      <Helmet>
        <title>Announcements | Hobson AI — AI assistance to operators, occupiers and owners of real estate</title>
        <meta name="description" content="Latest updates, features, and announcements from Hobson AI" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                
                <Link to="/" className="flex items-center gap-2">
                  <img src={hobsonLogo} alt="Hobson" className="h-[59px] w-auto" />
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Announcements Overview */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Megaphone className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">
                Product Announcements
              </h1>
            </div>
            <p className="text-lg text-muted-foreground mb-6">
              Stay updated with the latest features, updates, and news from Hobson AI
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full md:w-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full md:w-64"
                />
                <Button 
                  onClick={handleSubscribe}
                  disabled={isSubscribing}
                  className="gap-2 w-full md:w-auto"
                >
                  <Bell className="w-4 h-4" />
                  {isSubscribing ? 'Subscribing...' : 'Subscribe to Updates'}
                </Button>
              </div>
            </div>
          </div>

          {/* Latest Announcements */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Latest Announcements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {announcements.map((announcement) => (
                <div 
                  key={announcement.id} 
                  className="bg-gradient-to-br from-paper to-bone-wash dark:from-ink/20 dark:to-ink/30 border border-bone/50 dark:border-charcoal/30 rounded-lg p-4 md:p-6 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex flex-col"
                  onClick={() => handleAnnouncementClick(announcement.slug)}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <Badge 
                        variant="outline" 
                        className={`capitalize text-xs ${getTypeColor(announcement.type)}`}
                      >
                        {announcement.type}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`capitalize text-xs ${getPriorityColor(announcement.priority)}`}
                      >
                        {announcement.priority}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-foreground mb-3 text-base md:text-lg leading-tight">{announcement.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{announcement.description}</p>
                  </div>
                  
                  <div className="space-y-2 text-xs md:text-sm text-muted-foreground pt-3 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(announcement.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{announcement.readingTime} min read</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5" />
                      <span>{announcement.author}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* View Archive Button */}
          <div className="flex justify-center">
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              View Archive
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Announcements;
