import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Brain,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  FileText,
  Calendar,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Users,
  ExternalLink,
  Sparkles,
  Target,
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
  saveActivity,
} from '../lib/firebase';
import { toast } from 'sonner@2.0.3';

interface TeacherActivitiesLibraryProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onBackToClasses: () => void;
}

export default function TeacherActivitiesLibrary({
  onNavigate,
  onLogout,
  onBackToClasses,
}: TeacherActivitiesLibraryProps) {
  const [activeNav, setActiveNav] = useState('activities');
  const [isMobile, setIsMobile] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const activitiesData = await getAllActivities();
      if (activitiesData.length === 0) {
        // Use mock data if no activities in Firebase
        setActivities(mockActivities);
      } else {
        setActivities(activitiesData);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
      setActivities(mockActivities);
    }
    setLoading(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, view: 'teacher-dashboard' },
    { id: 'submissions', label: 'Submissions', icon: FileText, view: 'submissions' },
    { id: 'activities', label: 'Activities', icon: Sparkles, view: 'teacher-activities' },
    { id: 'ai-grading', label: 'AI Grading', icon: Brain, view: 'ai-grading' },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, view: 'teacher-feedback' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, view: 'analytics' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, view: 'calendar' },
    { id: 'settings', label: 'Settings', icon: Settings, view: 'settings' },
  ];

  const getFilteredActivities = () => {
    return activities.filter(activity => {
      const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = filterType === 'all' || activity.type === filterType;
      const matchesDifficulty = filterDifficulty === 'all' || activity.difficulty === filterDifficulty;

      return matchesSearch && matchesType && matchesDifficulty;
    });
  };

  const getActivityStats = () => {
    return {
      total: activities.length,
      netacad: activities.filter(a => a.type === 'netacad').length,
      custom: activities.filter(a => a.type === 'custom').length,
      pka: activities.filter(a => a.type === 'pka').length,
    };
  };

  const stats = getActivityStats();

  return (
    <div className="flex h-screen bg-[#fafafa] overflow-hidden">
      {/* Sidebar - Desktop */}
      {!isMobile && (
        <div className="w-64 bg-black text-white flex flex-col">
          <div className="p-6 flex items-center gap-3 border-b border-gray-800">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-xl text-black">E</span>
            </div>
            <span className="text-lg">EduOptima</span>
          </div>

          <nav className="flex-1 p-4">
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
        <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={onBackToClasses}
                variant="ghost"
                className="text-black hover:bg-gray-100 -ml-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                All Classes
              </Button>
              <div className="w-px h-8 bg-gray-200"></div>
              <div>
                <h2 className="text-black">Activity Library</h2>
                <p className="text-gray-600 text-sm">Manage and create learning activities</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => onNavigate('netacad-importer')}
                variant="outline"
                className="border-black text-black hover:bg-gray-100"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Import from NetAcad
              </Button>
              <Button
                onClick={() => onNavigate('create-custom-activity')}
                className="bg-black text-white hover:bg-gray-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Activity
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Total Activities</p>
                    <h3 className="text-black">{stats.total}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <ExternalLink className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">NetAcad Linked</p>
                    <h3 className="text-black">{stats.netacad}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Custom Activities</p>
                    <h3 className="text-black">{stats.custom}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">PKA Labs</p>
                    <h3 className="text-black">{stats.pka}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search activities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-gray-300"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="netacad">NetAcad</option>
                    <option value="custom">Custom</option>
                    <option value="pka">PKA</option>
                    <option value="quiz">Quiz</option>
                    <option value="lab">Lab</option>
                  </select>
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
                  <Button
                    onClick={() => onNavigate('student-targeting')}
                    variant="outline"
                    className="border-black text-black hover:bg-gray-100"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Target Students
                  </Button>
                </div>
              </div>
            </div>

            {/* Activities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredActivities().length === 0 ? (
                <div className="col-span-full bg-white rounded-2xl p-12 text-center">
                  <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-black mb-2">No activities found</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {activities.length === 0
                      ? 'Create your first activity to get started'
                      : 'Try adjusting your search or filters'}
                  </p>
                  <Button
                    onClick={() => onNavigate('create-custom-activity')}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Activity
                  </Button>
                </div>
              ) : (
                getFilteredActivities().map((activity) => (
                  <div key={activity.id} className="relative group">
                    <ActivityCard
                      activity={activity}
                      showNetAcadLink={true}
                    />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white border-gray-300 hover:bg-gray-100"
                        onClick={() => toast.info('Edit functionality coming soon')}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white border-red-300 text-red-600 hover:bg-red-50"
                        onClick={() => toast.info('Delete functionality coming soon')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobile && (
        <MobileNav
          role="teacher"
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

// Mock activities
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
];
