import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle, 
  Activity, 
  Clock, 
  Bell, 
  ExternalLink,
  Globe,
  Database,
  Server,
  Shield
} from 'lucide-react';
import hobsonLogo from "/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Status = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const services = [
    {
      name: 'Web Application',
      status: 'operational',
      icon: Globe,
      description: 'Main application and user interface'
    },
    {
      name: 'API Services',
      status: 'operational',
      icon: Server,
      description: 'Backend services and data processing'
    },
    {
      name: 'Database',
      status: 'operational',
      icon: Database,
      description: 'Data storage and retrieval systems'
    },
    {
      name: 'Authentication',
      status: 'operational',
      icon: Shield,
      description: 'User login and security systems'
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
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Subscription successful!",
        description: "You'll receive status updates at " + email,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'outage':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'degraded':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'outage':
        return <Activity className="w-5 h-5 text-red-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const allOperational = services.every(service => service.status === 'operational');

  return (
    <>
      <Helmet>
        <title>System Status - Hobson AI</title>
        <meta name="description" content="Current status of Hobson AI services and infrastructure" />
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
          {/* Status Overview */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              {allOperational ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <Activity className="w-8 h-8 text-yellow-600" />
              )}
              <h1 className="text-3xl font-bold text-foreground">
                {allOperational ? 'All Systems Operational' : 'Some Systems Experiencing Issues'}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground mb-6">
              Real-time status of Hobson AI services and infrastructure
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" className="gap-2">
                <Clock className="w-4 h-4" />
                View History
              </Button>
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

          {/* Current Status */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Current Status
            </h2>
            <div className="space-y-3">
              {services.map((service) => (
                <div key={service.name} className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <service.icon className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium text-foreground">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(service.status)}
                    <Badge 
                      variant="outline" 
                      className={`capitalize ${getStatusColor(service.status)}`}
                    >
                      {service.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>


          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">
              Need help? Contact our support team
            </p>
            <Button variant="link" className="gap-2" asChild>
              <Link to="/contact">
                Contact Support
                <ExternalLink className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Status;