import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Megaphone, 
  Calendar, 
  Bell, 
  ExternalLink
} from 'lucide-react';
import hobsonLogo from "/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Announcements = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const announcements = [
    {
      id: 1,
      title: 'New AI-Powered Document Analysis Features',
      description: 'Enhanced property document processing with improved accuracy and faster analysis times.',
      date: '2024-08-15',
      type: 'feature',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Enhanced Security Updates',
      description: 'Implementation of advanced encryption and multi-factor authentication for all user accounts.',
      date: '2024-08-10',
      type: 'security',
      priority: 'high'
    },
    {
      id: 3,
      title: 'Mobile App Beta Release',
      description: 'Our mobile application is now available for beta testing. Sign up to get early access.',
      date: '2024-08-05',
      type: 'product',
      priority: 'medium'
    }
  ];

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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Subscription successful!",
        description: "You'll receive announcements at " + email,
      });
      
      setEmail('');
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'feature':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'security':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'product':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <>
      <Helmet>
        <title>Announcements - Hobson AI</title>
        <meta name="description" content="Latest updates, features, and announcements from Hobson AI" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/learn" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Back to Learn</span>
                </Link>
                <div className="h-6 w-px bg-border" />
                <Link to="/" className="flex items-center gap-2">
                  <img src={hobsonLogo} alt="Hobson" className="h-8 w-auto" />
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
            
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-64"
                />
                <Button 
                  onClick={handleSubscribe}
                  disabled={isSubscribing}
                  className="gap-2"
                >
                  <Bell className="w-4 h-4" />
                  {isSubscribing ? 'Subscribing...' : 'Subscribe to Updates'}
                </Button>
              </div>
            </div>
          </div>

          {/* Latest Announcements */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Latest Announcements
            </h2>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="p-4 rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-2">{announcement.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{announcement.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(announcement.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Badge 
                        variant="outline" 
                        className={`capitalize ${getTypeColor(announcement.type)}`}
                      >
                        {announcement.type}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`capitalize ${getPriorityColor(announcement.priority)}`}
                      >
                        {announcement.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

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