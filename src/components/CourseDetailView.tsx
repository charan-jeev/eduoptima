import { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  PlayCircle,
  CheckCircle2,
  Clock,
  FileText,
  Calendar,
  Code,
} from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import MobileNav from './MobileNav';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface CourseDetailViewProps {
  course: any;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onBack: () => void;
}

const courseModules = [
  {
    id: 1,
    title: 'Module 1: Networking Today',
    duration: '4 hours',
    completed: true,
    progress: 100,
    topics: [
      { id: 1, title: 'Networks Affect our Lives', completed: true, type: 'video', duration: '15 min' },
      { id: 2, title: 'Network Components', completed: true, type: 'reading', duration: '20 min' },
      { id: 3, title: 'Network Representations and Topologies', completed: true, type: 'activity', duration: '30 min' },
      { id: 4, title: 'Module 1 Quiz', completed: true, type: 'quiz', duration: '20 min' },
    ],
  },
  {
    id: 2,
    title: 'Module 2: Basic Switch and End Device Configuration',
    duration: '5 hours',
    completed: true,
    progress: 100,
    topics: [
      { id: 5, title: 'Cisco IOS Access', completed: true, type: 'video', duration: '18 min' },
      { id: 6, title: 'IOS Navigation', completed: true, type: 'reading', duration: '25 min' },
      { id: 7, title: 'The Command Structure', completed: true, type: 'activity', duration: '35 min' },
      { id: 8, title: 'Basic Device Configuration', completed: true, type: 'lab', duration: '45 min' },
      { id: 9, title: 'Module 2 Quiz', completed: true, type: 'quiz', duration: '25 min' },
    ],
  },
  {
    id: 3,
    title: 'Module 3: Protocols and Models',
    duration: '6 hours',
    completed: false,
    progress: 67,
    topics: [
      { id: 10, title: 'The Rules', completed: true, type: 'video', duration: '20 min' },
      { id: 11, title: 'Protocols', completed: true, type: 'reading', duration: '30 min' },
      { id: 12, title: 'Network Protocol Suites', completed: false, type: 'activity', duration: '40 min' },
      { id: 13, title: 'Data Encapsulation', completed: false, type: 'lab', duration: '50 min' },
      { id: 14, title: 'Module 3 Quiz', completed: false, type: 'quiz', duration: '30 min' },
    ],
  },
  {
    id: 4,
    title: 'Module 4: Physical Layer',
    duration: '5 hours',
    completed: false,
    progress: 0,
    topics: [
      { id: 15, title: 'Purpose of the Physical Layer', completed: false, type: 'video', duration: '15 min' },
      { id: 16, title: 'Physical Layer Characteristics', completed: false, type: 'reading', duration: '25 min' },
      { id: 17, title: 'Copper Cabling', completed: false, type: 'activity', duration: '35 min' },
      { id: 18, title: 'Fiber-Optic Cabling', completed: false, type: 'activity', duration: '35 min' },
      { id: 19, title: 'Module 4 Quiz', completed: false, type: 'quiz', duration: '25 min' },
    ],
  },
];

export default function CourseDetailView({
  course,
  onNavigate,
  onLogout,
  onBack,
}: CourseDetailViewProps) {
  const [openModules, setOpenModules] = useState<number[]>([1, 2, 3]);
  const [activeNav, setActiveNav] = useState('courses');
  const [isMobile, setIsMobile] = useState(false);

  const toggleModule = (moduleId: number) => {
    setOpenModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
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

  const getTopicIcon = (type: string) => {
    switch (type) {
      case 'video':
        return PlayCircle;
      case 'quiz':
        return FileText;
      case 'lab':
      case 'activity':
        return BookOpen;
      default:
        return FileText;
    }
  };

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
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-black hover:bg-gray-100 -ml-2"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Courses
            </Button>
          </div>
        </div>

        {/* Course Header */}
        <div className="bg-black text-white px-4 md:px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-white text-black hover:bg-gray-100">
                {course?.code || 'CCNA1'}
              </Badge>
              <Badge variant="outline" className="border-white text-white">
                {course?.status || 'In Progress'}
              </Badge>
            </div>
            <h1 className="text-white mb-2">{course?.title || 'Introduction to Networks'}</h1>
            <p className="text-gray-300 mb-4">
              Module {course?.completedModules || 12} of {course?.modules || 17}
            </p>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">Progress</p>
                <p className="text-2xl text-white">{course?.progress || 68}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Current Grade</p>
                <p className="text-2xl text-white">{course?.grade || 85}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Next Deadline</p>
                <p className="text-sm text-white">{course?.nextDeadline || 'Oct 15, 2025'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modules List */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-black mb-6">Course Modules</h2>
            <div className="space-y-4">
              {courseModules.map((module) => (
                <Collapsible
                  key={module.id}
                  open={openModules.includes(module.id)}
                  onOpenChange={() => toggleModule(module.id)}
                >
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4 flex-1">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              module.completed ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            {module.completed ? (
                              <CheckCircle2 className="w-6 h-6" />
                            ) : (
                              <span className="text-lg">{module.id}</span>
                            )}
                          </div>
                          <div className="flex-1 text-left">
                            <h3 className="text-black mb-1">{module.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {module.duration}
                              </span>
                              <span>{module.topics.length} topics</span>
                            </div>
                          </div>
                          <div className="hidden md:block w-48">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Progress</span>
                              <span className="text-black">{module.progress}%</span>
                            </div>
                            <Progress value={module.progress} className="h-2" />
                          </div>
                        </div>
                        <div className="ml-4">
                          {openModules.includes(module.id) ? (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="border-t border-gray-200 bg-gray-50">
                        {module.topics.map((topic, index) => {
                          const Icon = getTopicIcon(topic.type);
                          return (
                            <div
                              key={topic.id}
                              className={`flex items-center justify-between p-4 hover:bg-white transition-colors cursor-pointer ${
                                index !== module.topics.length - 1 ? 'border-b border-gray-200' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    topic.completed ? 'bg-black text-white' : 'bg-white border border-gray-300'
                                  }`}
                                >
                                  {topic.completed ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                  ) : (
                                    <Icon className="w-4 h-4 text-gray-400" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-black text-sm mb-1">{topic.title}</p>
                                  <div className="flex items-center gap-3 text-xs text-gray-600">
                                    <span className="capitalize">{topic.type}</span>
                                    <span>•</span>
                                    <span>{topic.duration}</span>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                className="text-black hover:bg-gray-100"
                                size="sm"
                              >
                                {topic.completed ? 'Review' : 'Start'}
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
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
