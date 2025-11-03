import { useState } from 'react';
import {
  LayoutDashboard,
  Brain,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Bell,
  Upload,
  FileDown,
  FileText,
  Calendar,
  Plus,
  Sparkles,
  Target,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import MobileNav from './MobileNav';

interface TeacherDashboardProps {
  selectedClass: any;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onViewGrading: (submission: any) => void;
  onBackToClasses: () => void;
}

const submissions = [
  { id: 1, name: 'Beignet C.', lab: 'Lab Subnetting PT', date: 'Oct 05', score: 85, status: 'Pending' },
  { id: 2, name: 'John Smith', lab: 'VLAN Configuration', date: 'Oct 04', score: 92, status: 'Graded' },
  { id: 3, name: 'Sarah Lee', lab: 'Router Setup PT', date: 'Oct 03', score: 78, status: 'Pending' },
  { id: 4, name: 'Mike Chen', lab: 'ACL Implementation', date: 'Oct 02', score: 88, status: 'Graded' },
  { id: 5, name: 'Emma Wilson', lab: 'OSPF Routing', date: 'Oct 01', score: 95, status: 'Graded' },
];

export default function TeacherDashboard({
  selectedClass,
  onNavigate,
  onLogout,
  onViewGrading,
  onBackToClasses,
}: TeacherDashboardProps) {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useState(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, view: 'teacher-dashboard' },
    { id: 'submissions', label: 'Submissions', icon: FileText, view: 'submissions' },
    { id: 'activities', label: 'Activities', icon: Sparkles, view: 'teacher-activities' },
    { id: 'create-activity', label: 'Create Activity', icon: Plus, view: 'create-activity' },
    { id: 'ai-grading', label: 'AI Grading', icon: Brain, view: 'ai-grading' },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, view: 'teacher-feedback' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, view: 'analytics' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, view: 'calendar' },
    { id: 'settings', label: 'Settings', icon: Settings, view: 'settings' },
  ];

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
                  if (item.view !== 'teacher-dashboard') {
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
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
              <div className="hidden md:block w-px h-8 bg-gray-200"></div>
              <div className="hidden md:block">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-black text-white">
                    {selectedClass?.code || 'CCNA1-A'}
                  </Badge>
                  <h3 className="text-black">
                    {selectedClass?.name || 'Introduction to Networks'}
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  {selectedClass?.section || 'Section A'} • {selectedClass?.students || 28}{' '}
                  students
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 md:flex-initial md:w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search submissions..."
                    className="pl-10 bg-gray-50 border-gray-200"
                  />
                </div>
              </div>
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full"></span>
              </button>
              <div className="hidden md:flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-black text-white">AS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm">Adam Solivas</p>
                  <p className="text-xs text-gray-500">Instructor</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-6 border-l-4 border-black">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">AI Grading Accuracy</p>
                    <h3 className="text-black">92%</h3>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-black" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border-l-4 border-black">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Class Average</p>
                    <h3 className="text-black">84%</h3>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-black" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border-l-4 border-black">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Pending Reviews</p>
                    <h3 className="text-black">12</h3>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-black" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => onNavigate('teacher-activities')}
                className="bg-black text-white rounded-2xl p-6 hover:bg-gray-800 transition-colors text-left"
              >
                <Sparkles className="w-8 h-8 mb-3" />
                <h3 className="text-white mb-1">Activity Library</h3>
                <p className="text-gray-300 text-sm">Manage and create learning activities with AI</p>
              </button>
              <button
                onClick={() => onNavigate('student-targeting')}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:bg-gray-50 transition-colors text-left"
              >
                <Target className="w-8 h-8 mb-3 text-black" />
                <h3 className="text-black mb-1">Target Students</h3>
                <p className="text-gray-600 text-sm">AI-powered activity recommendations for students</p>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Recent Submissions Table */}
              <div className="bg-white rounded-2xl p-6">
                <h3 className="text-black mb-4">Recent Submissions</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 text-sm text-gray-600">Student</th>
                        <th className="text-left py-3 px-2 text-sm text-gray-600">Lab</th>
                        <th className="text-left py-3 px-2 text-sm text-gray-600">Date</th>
                        <th className="text-left py-3 px-2 text-sm text-gray-600">Score</th>
                        <th className="text-left py-3 px-2 text-sm text-gray-600">Status</th>
                        <th className="text-left py-3 px-2 text-sm text-gray-600">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((submission) => (
                        <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-2 text-sm text-black">{submission.name}</td>
                          <td className="py-3 px-2 text-sm text-gray-600">{submission.lab}</td>
                          <td className="py-3 px-2 text-sm text-gray-600">{submission.date}</td>
                          <td className="py-3 px-2 text-sm text-black">{submission.score}</td>
                          <td className="py-3 px-2">
                            <Badge
                              variant="outline"
                              className="bg-gray-100 text-black border border-gray-300"
                            >
                              {submission.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-2">
                            <Button
                              onClick={() => onViewGrading(submission)}
                              variant="ghost"
                              className="text-black hover:bg-gray-100"
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>


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
            if (view !== 'teacher-dashboard') {
              onNavigate(view);
            }
          }}
          onLogout={onLogout}
        />
      )}
    </div>
  );
}
