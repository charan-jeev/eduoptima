import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Settings,
  LogOut,
  Calendar,
  Clock,
  FileText,
  Code,
  Sparkles,
  Filter,
  Search,
  TrendingUp,
  Target,
  Zap,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import ActivityCard from './ActivityCard';
import MobileNav from './MobileNav';
import {
  Activity,
  getAllActivities,
  getAIRecommendations,
  getStudentActivity,
  AIRecommendation,
} from '../lib/firebase';

interface ActivitiesViewProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export default function ActivitiesView({
  onNavigate,
  onLogout,
}: ActivitiesViewProps) {
  const [activeNav, setActiveNav] = useState('activities');
  const [isMobile, setIsMobile] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Simulated student ID - in real app, this would come from auth
  const studentId = 'student_bc';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadActivitiesAndRecommendations();
  }, []);

  const loadActivitiesAndRecommendations = async () => {
    setLoading(true);
    try {
      const [activitiesData, recommendationsData] = await Promise.all([
        getAllActivities(),
        getAIRecommendations(studentId),
      ]);

      // If no activities in Firebase, use mock data
      if (activitiesData.length === 0) {
        setActivities(mockActivities);
        setRecommendations(mockRecommendations);
      } else {
        setActivities(activitiesData);
        setRecommendations(recommendationsData);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
      // Fallback to mock data
      setActivities(mockActivities);
      setRecommendations(mockRecommendations);
    }
    setLoading(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, view: 'student-dashboard' },
    { id: 'courses', label: 'Courses', icon: BookOpen, view: 'courses' },
    { id: 'activities', label: 'Activities', icon: Sparkles, view: 'activities' },
    { id: 'work-analysis', label: 'Work Analysis', icon: FileText, view: 'work-analysis' },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, view: 'student-feedback' },
    { id: 'practice', label: 'Practice Lab', icon: Code, view: 'practice-lab' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, view: 'calendar' },
    { id: 'due-this-week', label: 'Due This Week', icon: Clock, view: 'due-this-week' },
    { id: 'settings', label: 'Settings', icon: Settings, view: 'settings' },
  ];

  const handleSelectActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    onNavigate('activity-detail');
  };

  const getRecommendedActivities = () => {
    const recommendedIds = recommendations.map(r => r.activityId);
    return activities.filter(a => recommendedIds.includes(a.id));
  };

  const getFilteredActivities = () => {
    return activities.filter(activity => {
      const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesDifficulty = filterDifficulty === 'all' || activity.difficulty === filterDifficulty;
      const matchesType = filterType === 'all' || activity.type === filterType;

      return matchesSearch && matchesDifficulty && matchesType;
    });
  };

  const getActivitiesByCategory = (category: string) => {
    const filtered = getFilteredActivities();
    switch (category) {
      case 'recommended':
        return getRecommendedActivities();
      case 'beginner':
        return filtered.filter(a => a.difficulty === 'Beginner');
      case 'intermediate':
        return filtered.filter(a => a.difficulty === 'Intermediate');
      case 'advanced':
        return filtered.filter(a => a.difficulty === 'Advanced');
      case 'netacad':
        return filtered.filter(a => a.type === 'netacad');
      default:
        return filtered;
    }
  };

  return (
    <div className="flex h-screen bg-[#fafafa] overflow-hidden">
      {/* Sidebar - Desktop */}
      {!isMobile && (
        <div className="w-80 bg-black text-white flex flex-col overflow-hidden">
          <div className="p-6 flex items-center gap-3 border-b border-gray-800">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-xl text-black">E</span>
            </div>
            <span className="text-lg">EduOptima</span>
          </div>

          <nav className="p-4 border-b border-gray-800">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  onNavigate(item.view);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  activeNav === item.id
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex-1"></div>

          <button
            onClick={onLogout}
            className="m-4 flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-900 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-black text-white px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sparkles className="w-8 h-8" />
              <div>
                <h2 className="text-white">Activity Discovery</h2>
                <p className="text-gray-400 text-sm">AI-powered personalized learning</p>
              </div>
            </div>
            <Button
              onClick={() => onNavigate('ai-activity-assistant')}
              className="bg-white text-black hover:bg-gray-200"
            >
              <Zap className="w-4 h-4 mr-2" />
              AI Assistant
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search activities, topics, or tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-gray-300"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="all">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="netacad">NetAcad</option>
                    <option value="pka">PKA</option>
                    <option value="quiz">Quiz</option>
                    <option value="lab">Lab</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">AI Recommended</p>
                    <h3 className="text-black">{getRecommendedActivities().length} Activities</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Available</p>
                    <h3 className="text-black">{activities.length} Activities</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">NetAcad Linked</p>
                    <h3 className="text-black">
                      {activities.filter(a => a.netacadUrl).length} Activities
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Tabs */}
            <Tabs defaultValue="recommended" className="w-full">
              <TabsList className="bg-white border border-gray-200 p-1 mb-6">
                <TabsTrigger value="recommended" className="data-[state=active]:bg-black data-[state=active]:text-white">
                  Recommended for You
                </TabsTrigger>
                <TabsTrigger value="all" className="data-[state=active]:bg-black data-[state=active]:text-white">
                  All Activities
                </TabsTrigger>
                <TabsTrigger value="netacad" className="data-[state=active]:bg-black data-[state=active]:text-white">
                  NetAcad
                </TabsTrigger>
              </TabsList>

              <TabsContent value="recommended">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getActivitiesByCategory('recommended').length === 0 ? (
                    <div className="col-span-full bg-white rounded-2xl p-12 text-center">
                      <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-black mb-2">No recommendations yet</h3>
                      <p className="text-gray-600 text-sm">
                        Complete more activities to get personalized AI recommendations
                      </p>
                    </div>
                  ) : (
                    getActivitiesByCategory('recommended').map((activity) => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        onSelect={handleSelectActivity}
                      />
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getActivitiesByCategory('all').map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      onSelect={handleSelectActivity}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="netacad">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getActivitiesByCategory('netacad').length === 0 ? (
                    <div className="col-span-full bg-white rounded-2xl p-12 text-center">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-black mb-2">No NetAcad activities</h3>
                      <p className="text-gray-600 text-sm">
                        Check back later for NetAcad-linked activities
                      </p>
                    </div>
                  ) : (
                    getActivitiesByCategory('netacad').map((activity) => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        onSelect={handleSelectActivity}
                      />
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobile && (
        <MobileNav
          role="student"
          activeNav={activeNav}
          navItems={navItems}
          onNavigate={(view) => {
            setActiveNav(view);
            onNavigate(view);
          }}
          onLogout={onLogout}
        />
      )}
    </div>
  );
}

// Mock data for initial testing
const mockActivities: Activity[] = [
  {
    id: 'act_001',
    title: 'Introduction to Subnetting',
    description: 'Learn the fundamentals of IP subnetting including subnet masks, CIDR notation, and network calculations',
    difficulty: 'Beginner',
    estimatedTime: 45,
    type: 'netacad',
    netacadUrl: 'https://www.netacad.com/courses/networking/ccna-introduction-networks',
    createdBy: 'teacher_001',
    tags: ['networking', 'subnetting', 'ip-addressing'],
    prerequisites: [],
    points: 100,
    createdAt: new Date(),
  },
  {
    id: 'act_002',
    title: 'VLAN Configuration Lab',
    description: 'Practice creating and configuring VLANs on Cisco switches using Packet Tracer',
    difficulty: 'Intermediate',
    estimatedTime: 60,
    type: 'pka',
    createdBy: 'teacher_001',
    tags: ['vlan', 'switching', 'layer-2'],
    prerequisites: ['act_001'],
    points: 150,
    createdAt: new Date(),
  },
  {
    id: 'act_003',
    title: 'OSPF Routing Protocol',
    description: 'Configure and troubleshoot OSPF routing protocol in a multi-area network',
    difficulty: 'Advanced',
    estimatedTime: 90,
    type: 'lab',
    netacadUrl: 'https://www.netacad.com/courses/networking/ccna-routing-switching',
    createdBy: 'teacher_001',
    tags: ['routing', 'ospf', 'layer-3'],
    prerequisites: ['act_001', 'act_002'],
    points: 200,
    createdAt: new Date(),
  },
  {
    id: 'act_004',
    title: 'Network Security Fundamentals Quiz',
    description: 'Test your knowledge on network security concepts, ACLs, and basic firewall configurations',
    difficulty: 'Intermediate',
    estimatedTime: 30,
    type: 'quiz',
    createdBy: 'teacher_001',
    tags: ['security', 'acl', 'firewall'],
    prerequisites: [],
    points: 75,
    createdAt: new Date(),
  },
];

const mockRecommendations: AIRecommendation[] = [
  {
    activityId: 'act_001',
    reason: 'Based on your recent performance, strengthening subnetting skills will help with advanced topics',
    priority: 'high',
    timestamp: new Date(),
  },
  {
    activityId: 'act_002',
    reason: 'You excel at switching concepts - this lab will challenge your VLAN skills',
    priority: 'medium',
    timestamp: new Date(),
  },
];
