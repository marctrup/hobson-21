import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  MessageSquare, 
  Lightbulb, 
  Puzzle, 
  HelpCircle, 
  Bug, 
  Trophy,
  Medal,
  Award,
  User,
  Calendar,
  ThumbsUp,
  ArrowLeft
} from 'lucide-react';
import hobsonLogo from "/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const FeatureRequests = () => {
  const [activeFilter, setActiveFilter] = useState('new');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = [
    { id: 'new', label: 'New' },
    { id: 'top', label: 'Top' },
    { id: 'trending', label: 'Trending' },
  ];

  const boards = [
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, emoji: '📣' },
    { id: 'feature-request', label: 'Feature Request', icon: Lightbulb, emoji: '💡' },
    { id: 'integrations', label: 'Integrations', icon: Puzzle, emoji: '🧩' },
    { id: 'questions', label: 'Questions', icon: HelpCircle, emoji: '⁉️' },
    { id: 'bug-hunting', label: 'Bug Hunting', icon: Bug, emoji: '🐛' },
    { id: 'lovable-project', label: 'Lovable Project', icon: Trophy, emoji: '' },
    { id: 'ama', label: 'AMA', icon: MessageSquare, emoji: '' },
  ];

  const leaderboard = [
    { rank: 1, name: 'Scott Richard', points: 1145, emoji: '🥇' },
    { rank: 2, name: 'Luke', points: 939, emoji: '🥈' },
    { rank: 3, name: 'Yohan Costa', points: 789, emoji: '🥉' },
    { rank: 4, name: 'InsourceGG', points: 609, emoji: '4' },
    { rank: 5, name: 'Stephane Boghossian', points: 563, emoji: '5' },
    { rank: 6, name: 'Mat', points: 485, emoji: '6' },
  ];

  const posts = [
    {
      id: 1,
      title: "Can't refresh or delete the text, so I can't use the product",
      author: "Henrik Johannessen",
      timeAgo: "1 day ago",
      category: "bug-hunting",
      categoryLabel: "Bug Hunting",
      categoryEmoji: "🐛",
      votes: 1,
      description: ""
    },
    {
      id: 2,
      title: "SEO is a fairytale with lovable built websites.",
      author: "Jiffri Khan",
      timeAgo: "1 day ago",
      category: "feature-request",
      categoryLabel: "Feature Request",
      categoryEmoji: "💡",
      votes: 2,
      description: "Is it possible to integrate Next.js into lovable? Such that users can choose between creating a create react app or a next.js app, cause the core function of a website is SEO, and currently lovables create react only framework is really really a disappointment. So it possible to fix this issue? Preferably with Next.js integration."
    },
    {
      id: 3,
      title: "Show unique website visitors 🙋",
      author: "Ellinor Axelsson",
      timeAgo: "1 day ago",
      category: "feature-request",
      categoryLabel: "Feature Request",
      categoryEmoji: "💡",
      votes: 1,
      description: "Not only total number of visitors"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Feature Requests - Hobson AI</title>
        <meta name="description" content="Share your feedback and feature requests for Hobson AI" />
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

        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Share your product feedback!</h1>
            <p className="text-lg text-muted-foreground">
              Please tell us what we can do to make Hobson the best product for you.
            </p>
          </div>

          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1 max-w-4xl">
              {/* Filters, Create Post and Search */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {filters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeFilter === filter.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                  
                  <Button size="sm" className="ml-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Create A New Post
                  </Button>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>

              {/* Posts */}
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      {/* Vote Button */}
                      <div className="flex flex-col items-center gap-1">
                        <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                          <ThumbsUp className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <span className="text-sm font-medium text-foreground">{post.votes}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <span>{post.categoryEmoji}</span>
                            <span>{post.categoryLabel}</span>
                          </Badge>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-foreground mb-2 hover:text-primary cursor-pointer">
                          {post.title}
                        </h3>
                        
                        {post.description && (
                          <p className="text-muted-foreground mb-3 line-clamp-3">
                            {post.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                          <Calendar className="w-4 h-4 ml-2" />
                          <span>{post.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-80 space-y-6">
              {/* Boards */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Boards</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-2 text-left hover:bg-accent rounded-lg transition-colors">
                    <span className="text-sm font-medium text-foreground">View all posts</span>
                  </button>
                  {boards.map((board) => (
                    <button
                      key={board.id}
                      className="w-full flex items-center gap-3 p-2 text-left hover:bg-accent rounded-lg transition-colors"
                    >
                      <span className="text-base">{board.emoji}</span>
                      <span className="text-sm text-muted-foreground">{board.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Leaderboard */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Most helpful</h3>
                <div className="space-y-3">
                  {leaderboard.map((user) => (
                    <div key={user.rank} className="flex items-center gap-3">
                      <span className="text-lg">{user.emoji}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.points} points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeatureRequests;