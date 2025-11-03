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
  ArrowLeft,
  ExternalLink,
  Star,
  Award,
  CheckCircle,
  Play,
  BookmarkPlus,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import NetAcadLinkButton from './NetAcadLinkButton';
import MobileNav from './MobileNav';
import { Activity, getActivity, saveStudentActivity, getStudentActivity } from '../lib/firebase';
import { toast } from 'sonner@2.0.3';

interface ActivityDetailViewProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
  activityId?: string;
}

export default function ActivityDetailView({
  onNavigate,
  onLogout,
  activityId = 'act_001',
}: ActivityDetailViewProps) {
  const [activeNav, setActiveNav] = useState('activities');
  const [isMobile, setIsMobile] = useState(false);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [studentActivity, setStudentActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Simulated student ID
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
    loadActivityDetails();
  }, [activityId]);

  const loadActivityDetails = async () => {
    setLoading(true);
    try {
      const activityData = await getActivity(activityId);
      if (activityData) {
        setActivity(activityData);
      } else {
        // Fallback to mock data
        setActivity(mockActivity);
      }

      const studentActivityData = await getStudentActivity(studentId, activityId);
      setStudentActivity(studentActivityData);
    } catch (error) {
      console.error('Error loading activity:', error);
      setActivity(mockActivity);
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

  const handleStartActivity = async () => {
    if (!activity) return;

    try {
      await saveStudentActivity(studentId, activity.id, {
        activityId: activity.id,
        status: 'in-progress',
        startedAt: new Date(),
        attempts: (studentActivity?.attempts || 0) + 1,
      });

      toast.success('Activity started! Good luck! 🚀');
      
      // Navigate based on activity type
      if (activity.type === 'netacad' && activity.netacadUrl) {
        window.open(activity.netacadUrl, '_blank');
      } else if (activity.type === 'pka' || activity.type === 'lab') {
        onNavigate('practice-lab');
      } else {
        onNavigate('courses');
      }
    } catch (error) {
      toast.error('Failed to start activity');
    }
  };

  const handleAddToLearningPlan = async () => {
    if (!activity) return;

    try {
      await saveStudentActivity(studentId, activity.id, {
        activityId: activity.id,
        status: 'assigned',
        attempts: 0,
      });

      toast.success('Added to your learning plan! 📚');
    } catch (error) {
      toast.error('Failed to add to learning plan');
    }
  };

  if (loading || !activity) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fafafa]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading activity...</p>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <div className="flex items-center gap-4">
            <Button
              onClick={() => onNavigate('activities')}
              variant="ghost"
              className="text-white hover:bg-gray-800 -ml-2"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              All Activities
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Activity Header */}
            <div className="bg-white rounded-2xl p-6 md:p-8 mb-6">
              <div className="flex flex-wrap items-start gap-2 mb-4">
                <Badge className={getDifficultyColor(activity.difficulty)}>
                  {activity.difficulty}
                </Badge>
                <Badge className="bg-blue-100 text-blue-800">
                  {activity.type.toUpperCase()}
                </Badge>
                {studentActivity?.status && (
                  <Badge className="bg-purple-100 text-purple-800">
                    {studentActivity.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                )}
              </div>

              <h1 className="text-black mb-4">{activity.title}</h1>
              <p className="text-gray-600 mb-6">{activity.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-600">Duration</span>
                  </div>
                  <p className="text-black">{activity.estimatedTime} min</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-600">Points</span>
                  </div>
                  <p className="text-black">{activity.points} pts</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-600">Attempts</span>
                  </div>
                  <p className="text-black">{studentActivity?.attempts || 0}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-600">Best Score</span>
                  </div>
                  <p className="text-black">{studentActivity?.score || '--'}%</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleStartActivity}
                  className="flex-1 bg-black text-white hover:bg-gray-800"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {studentActivity?.status === 'in-progress' ? 'Continue Activity' : 'Start Activity'}
                </Button>
                {activity.netacadUrl && (
                  <NetAcadLinkButton url={activity.netacadUrl} className="flex-1" />
                )}
                <Button
                  onClick={handleAddToLearningPlan}
                  variant="outline"
                  className="border-black text-black hover:bg-gray-100"
                >
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>

            {/* Tags */}
            {activity.tags.length > 0 && (
              <div className="bg-white rounded-2xl p-6 mb-6">
                <h3 className="text-black mb-3">Topics Covered</h3>
                <div className="flex flex-wrap gap-2">
                  {activity.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Prerequisites */}
            {activity.prerequisites.length > 0 && (
              <div className="bg-white rounded-2xl p-6 mb-6">
                <h3 className="text-black mb-3">Prerequisites</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Complete these activities first for the best learning experience
                </p>
                <div className="space-y-2">
                  {activity.prerequisites.map((prereq, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <CheckCircle className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-700">{prereq}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Learning Outcomes */}
            <div className="bg-white rounded-2xl p-6 mb-6">
              <h3 className="text-black mb-3">What You'll Learn</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">
                    Master the core concepts and practical applications
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">
                    Gain hands-on experience with real-world scenarios
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">
                    Build confidence for certification exams
                  </span>
                </li>
              </ul>
            </div>

            {/* NetAcad Integration Info */}
            {activity.netacadUrl && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <ExternalLink className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-black mb-2">NetAcad Integration</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      This activity is linked with Cisco Networking Academy. Your progress
                      will be synced automatically.
                    </p>
                    <NetAcadLinkButton
                      url={activity.netacadUrl}
                      variant="outline"
                    />
                  </div>
                </div>
              </div>
            )}
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

// Mock activity for fallback
const mockActivity: Activity = {
  id: 'act_001',
  title: 'Introduction to Subnetting',
  description: 'Learn the fundamentals of IP subnetting including subnet masks, CIDR notation, and network calculations. This comprehensive activity will help you master one of the most important networking skills.',
  difficulty: 'Beginner',
  estimatedTime: 45,
  type: 'netacad',
  netacadUrl: 'https://www.netacad.com/courses/networking/ccna-introduction-networks',
  createdBy: 'teacher_001',
  tags: ['networking', 'subnetting', 'ip-addressing', 'CIDR', 'subnet-masks'],
  prerequisites: [],
  points: 100,
  createdAt: new Date(),
};
