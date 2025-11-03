import { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Settings,
  LogOut,
  RefreshCw,
  CheckCircle2,
  Clock,
  Lock,
  ChevronRight,
  Award,
  TrendingUp,
  Calendar,
  Code,
  FileText,
} from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import MobileNav from './MobileNav';

interface CoursesViewProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onSelectCourse: (course: any) => void;
}

const enrolledCourses = [
  {
    id: 1,
    code: 'CCNA1',
    title: 'Introduction to Networks',
    progress: 68,
    grade: 85,
    status: 'In Progress',
    modules: 17,
    completedModules: 12,
    lastAccessed: '2 hours ago',
    nextDeadline: 'Oct 15, 2025',
  },
  {
    id: 2,
    code: 'CCNA2',
    title: 'Switching, Routing, and Wireless Essentials',
    progress: 15,
    grade: 0,
    status: 'In Progress',
    modules: 16,
    completedModules: 2,
    lastAccessed: '1 day ago',
    nextDeadline: 'Nov 20, 2025',
  },
];

const availableCourses = [
  {
    id: 3,
    code: 'CCNA3',
    title: 'Enterprise Networking, Security, and Automation',
    description: 'Configure, troubleshoot, and secure enterprise network devices',
    duration: '70 hours',
    level: 'Intermediate',
    prerequisites: ['CCNA1', 'CCNA2'],
    locked: true,
  },
  {
    id: 4,
    code: 'CyberOps',
    title: 'Cybersecurity Operations Fundamentals',
    description: 'Learn security concepts, monitoring, detection and incident response',
    duration: '60 hours',
    level: 'Intermediate',
    prerequisites: ['CCNA1'],
    locked: false,
  },
  {
    id: 5,
    code: 'IoT',
    title: 'Introduction to IoT',
    description: 'Explore Internet of Things technologies and applications',
    duration: '20 hours',
    level: 'Beginner',
    prerequisites: [],
    locked: false,
  },
  {
    id: 6,
    code: 'Python',
    title: 'Python Essentials 1',
    description: 'Introduction to Python programming for network automation',
    duration: '30 hours',
    level: 'Beginner',
    prerequisites: [],
    locked: false,
  },
  {
    id: 7,
    code: 'DevNet',
    title: 'DevNet Associate',
    description: 'Software development and design for Cisco platforms',
    duration: '75 hours',
    level: 'Advanced',
    prerequisites: ['CCNA1', 'Python'],
    locked: false,
  },
  {
    id: 8,
    code: 'CCNP',
    title: 'CCNP Enterprise Core',
    description: 'Advanced routing and services for enterprise networks',
    duration: '90 hours',
    level: 'Advanced',
    prerequisites: ['CCNA1', 'CCNA2', 'CCNA3'],
    locked: true,
  },
];

export default function CoursesView({ onNavigate, onLogout, onSelectCourse }: CoursesViewProps) {
  const [syncing, setSyncing] = useState(false);
  const [activeNav, setActiveNav] = useState('courses');
  const [isMobile, setIsMobile] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      toast.success('Successfully synced with Cisco NetAcad! ✅', {
        description: 'All course progress and grades are up to date.',
      });
    }, 2000);
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
    { id: 'work-analysis', label: 'Work Analysis', icon: FileText, view: 'work-analysis' },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, view: 'student-feedback' },
    { id: 'practice', label: 'Practice Lab', icon: Code, view: 'practice-lab' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, view: 'calendar' },
    { id: 'due-this-week', label: 'Due This Week', icon: Clock, view: 'due-this-week' },
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
            <div>
              <h2 className="text-[#121212]">My Courses</h2>
              <p className="text-sm text-gray-600">Manage your Cisco NetAcad learning journey</p>
            </div>
            <Button
              onClick={handleSync}
              disabled={syncing}
              className="bg-black hover:bg-gray-800 text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync to NetAcad'}
            </Button>
          </div>
        </div>

        {/* Courses Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Currently Enrolled */}
            <div className="mb-8">
              <h3 className="text-[#121212] mb-4">Currently Enrolled</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {enrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => onSelectCourse(course)}
                    className="bg-white rounded-2xl p-6 border-2 border-black hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-black text-white">{course.code}</Badge>
                          <Badge
                            variant="outline"
                            className="border-green-500 text-green-700 bg-green-50"
                          >
                            {course.status}
                          </Badge>
                        </div>
                        <h4 className="text-[#121212] mb-1">{course.title}</h4>
                        <p className="text-sm text-gray-600">
                          Module {course.completedModules} of {course.modules}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Award className="w-4 h-4 text-black" />
                          <span className="text-black">{course.grade}%</span>
                        </div>
                        <p className="text-xs text-gray-500">Current Grade</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-black">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-3" />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Last accessed: {course.lastAccessed}</span>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-black hover:bg-gray-100 p-2"
                      >
                        Continue
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600">
                        Next deadline: <span className="text-black">{course.nextDeadline}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Courses */}
            <div>
              <h3 className="text-[#121212] mb-4">Available Courses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableCourses.map((course) => (
                  <div
                    key={course.id}
                    className={`bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all ${
                      course.locked ? 'opacity-60' : 'cursor-pointer hover:border-black'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <Badge
                        variant="outline"
                        className="border-gray-300 text-gray-700 bg-gray-50"
                      >
                        {course.level}
                      </Badge>
                      {course.locked && <Lock className="w-5 h-5 text-gray-400" />}
                      {!course.locked && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    </div>

                    <div className="mb-3">
                      <h4 className="text-[#121212] mb-1">{course.code}</h4>
                      <p className="text-sm text-[#121212] mb-2">{course.title}</p>
                      <p className="text-xs text-gray-600 line-clamp-2">{course.description}</p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      {course.prerequisites.length > 0 && (
                        <div className="flex items-start gap-2 text-xs text-gray-600">
                          <TrendingUp className="w-4 h-4 mt-0.5" />
                          <div>
                            <span className="block mb-1">Prerequisites:</span>
                            <div className="flex flex-wrap gap-1">
                              {course.prerequisites.map((prereq) => (
                                <Badge
                                  key={prereq}
                                  variant="outline"
                                  className="text-xs border-gray-300 text-gray-600"
                                >
                                  {prereq}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {course.locked ? (
                      <Button
                        disabled
                        variant="outline"
                        className="w-full border-gray-300 text-gray-400"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Locked
                      </Button>
                    ) : (
                      <Button className="w-full bg-black hover:bg-gray-800 text-white">
                        Enroll Now
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Path Suggestion */}
            <div className="mt-8 bg-black rounded-2xl p-6 text-white border-2 border-gray-800">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-black" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white mb-2">Recommended Learning Path</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Based on your progress in CCNA1, we recommend enrolling in Cybersecurity
                    Operations Fundamentals to expand your security knowledge alongside your
                    networking skills.
                  </p>
                  <Button className="bg-white text-black hover:bg-gray-200">
                    View Recommendations
                  </Button>
                </div>
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
            onNavigate(view);
          }}
          onLogout={onLogout}
        />
      )}
    </div>
  );
}
