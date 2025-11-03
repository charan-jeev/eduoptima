import { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Settings,
  LogOut,
  Upload,
  TrendingUp,
  Target,
  Award,
  Calendar,
  Code,
  Clock,
  FileText,
} from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import FeedbackModal from './FeedbackModal';
import MobileNav from './MobileNav';

interface StudentDashboardProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export default function StudentDashboard({
  onNavigate,
  onLogout,
}: StudentDashboardProps) {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(false);

  const handleViewFeedback = (activity: any) => {
    setSelectedActivity(activity);
    setShowFeedbackModal(true);
  };

  const handleAddToPlan = () => {
    toast.success('Lessons added to your learning plan ✅');
    setShowFeedbackModal(false);
  };

  useState(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, view: 'student-dashboard' },
    { id: 'courses', label: 'Courses', icon: BookOpen, view: 'courses' },
    { id: 'activities', label: 'Activities', icon: Target, view: 'activities' },
    { id: 'work-analysis', label: 'Work Analysis', icon: FileText, view: 'work-analysis' },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, view: 'student-feedback' },
    { id: 'practice', label: 'Practice Lab', icon: Code, view: 'practice-lab' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, view: 'calendar' },
    { id: 'due-this-week', label: 'Due This Week', icon: Clock, view: 'due-this-week' },
    { id: 'settings', label: 'Settings', icon: Settings, view: 'settings' },
  ];

  const recentActivities = [
    { id: 1, name: 'Subnetting PT', date: 'Oct 05', score: 78, status: 'Graded' },
    { id: 2, name: 'VLAN Configuration', date: 'Oct 03', score: 85, status: 'Graded' },
    { id: 3, name: 'Router Setup', date: 'Oct 01', score: 92, status: 'Graded' },
  ];

  const upcomingActivities = [
    { id: 1, title: 'Lab Subnetting PT', dueDate: 'Oct 14', dueTime: '11:59 PM', type: 'Lab' },
    { id: 2, title: 'VLAN Configuration Quiz', dueDate: 'Oct 16', dueTime: '11:59 PM', type: 'Quiz' },
    { id: 3, title: 'Router Setup Assignment', dueDate: 'Oct 18', dueTime: '11:59 PM', type: 'Assignment' },
  ];

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
                  if (item.view !== 'student-dashboard') {
                    onNavigate(item.view);
                  }
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
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-lg text-black">BC</span>
              </div>
              <div>
                <h4 className="text-white">Beignet Cayenne</h4>
                <p className="text-gray-400 text-sm">CCNA 1 - Introduction to Networks</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right mr-3">
                <p className="text-xs text-gray-400">Course Progress</p>
                <p className="text-sm text-white">68%</p>
              </div>
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#374151"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#ffffff"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${68 * 1.76} ${100 * 1.76}`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs text-white">
                  68%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-black" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-1">Overall Grade</p>
                <h3 className="text-black">85%</h3>
              </div>

              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-black" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-1">AI Confidence</p>
                <h3 className="text-black">0.91</h3>
              </div>

              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-black" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-1">Next Focus</p>
                <p className="text-black text-sm">Routing Protocols - OSPF</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <button
                onClick={() => onNavigate('activities')}
                className="bg-black text-white rounded-2xl p-6 hover:bg-gray-800 transition-colors text-left"
              >
                <Target className="w-8 h-8 mb-3" />
                <h3 className="text-white mb-1">Discover Activities</h3>
                <p className="text-gray-300 text-sm">AI-powered personalized learning activities</p>
              </button>
              <button
                onClick={() => onNavigate('work-analysis')}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:bg-gray-50 transition-colors text-left"
              >
                <Upload className="w-8 h-8 mb-3 text-black" />
                <h3 className="text-black mb-1">Analyze Your Work</h3>
                <p className="text-gray-600 text-sm">Upload Packet Tracer files for AI feedback</p>
              </button>
              <button
                onClick={() => onNavigate('practice-lab')}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:bg-gray-50 transition-colors text-left"
              >
                <Code className="w-8 h-8 mb-3 text-black" />
                <h3 className="text-black mb-1">Practice Lab</h3>
                <p className="text-gray-600 text-sm">Practice Cisco IOS commands interactively</p>
              </button>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-2xl p-6 mb-6">
              <h3 className="text-black mb-4">Recent Activities</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 text-sm text-gray-600">Activity</th>
                      <th className="text-left py-3 px-2 text-sm text-gray-600">Date</th>
                      <th className="text-left py-3 px-2 text-sm text-gray-600">Score</th>
                      <th className="text-left py-3 px-2 text-sm text-gray-600">Status</th>
                      <th className="text-left py-3 px-2 text-sm text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivities.map((activity) => (
                      <tr key={activity.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2 text-sm text-black">{activity.name}</td>
                        <td className="py-3 px-2 text-sm text-gray-600">{activity.date}</td>
                        <td className="py-3 px-2 text-sm text-black">{activity.score}%</td>
                        <td className="py-3 px-2">
                          <Badge className="bg-green-100 text-green-800">{activity.status}</Badge>
                        </td>
                        <td className="py-3 px-2">
                          <Button
                            onClick={() => handleViewFeedback(activity)}
                            variant="ghost"
                            className="text-black hover:bg-gray-100"
                          >
                            View Feedback
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recommended Electives */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black text-white rounded-2xl p-6">
                <div className="h-2 bg-white rounded-full mb-4"></div>
                <h4 className="text-white mb-2">Network Security</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Build on your networking skills with security fundamentals
                </p>
                <Badge className="bg-white text-black">Recommended</Badge>
              </div>

              <div className="bg-black text-white rounded-2xl p-6">
                <div className="h-2 bg-white rounded-full mb-4"></div>
                <h4 className="text-white mb-2">CCNP Preparation</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Advanced routing and switching for professional certification
                </p>
                <Badge className="bg-white text-black">Recommended</Badge>
              </div>

              <div className="bg-black text-white rounded-2xl p-6">
                <div className="h-2 bg-white rounded-full mb-4"></div>
                <h4 className="text-white mb-2">IoT Fundamentals</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Explore the Internet of Things and connected devices
                </p>
                <Badge className="bg-white text-black">Recommended</Badge>
              </div>
            </div>
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
            if (view !== 'student-dashboard') {
              onNavigate(view);
            }
          }}
          onLogout={onLogout}
        />
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <FeedbackModal
          activity={selectedActivity}
          onClose={() => setShowFeedbackModal(false)}
          onAddToPlan={handleAddToPlan}
        />
      )}
    </div>
  );
}
