import { useState } from 'react';
import {
  LayoutDashboard,
  Brain,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  FileText,
  Clock,
  Code,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import type { UserRole } from '../App';

interface CalendarViewProps {
  userRole: UserRole;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

const activities = [
  { id: 1, title: 'Lab Subnetting PT', date: '2025-10-14', type: 'Lab', class: 'CCNA1-A', dueTime: '11:59 PM' },
  { id: 2, title: 'VLAN Configuration Quiz', date: '2025-10-16', type: 'Quiz', class: 'CCNA1-A', dueTime: '11:59 PM' },
  { id: 3, title: 'Router Setup Assignment', date: '2025-10-18', type: 'Assignment', class: 'CCNA2-A', dueTime: '11:59 PM' },
  { id: 4, title: 'OSPF Routing Lab', date: '2025-10-20', type: 'Lab', class: 'CCNA1-B', dueTime: '11:59 PM' },
  { id: 5, title: 'Network Security Exam', date: '2025-10-22', type: 'Exam', class: 'CCNA3-A', dueTime: '2:00 PM' },
];

export default function CalendarView({ userRole, onNavigate, onLogout }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1)); // October 2025

  const navItems = userRole === 'teacher'
    ? [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, view: 'teacher-dashboard' },
        { id: 'submissions', label: 'Submissions', icon: FileText, view: 'submissions' },
        { id: 'create-activity', label: 'Create Activity', icon: Plus, view: 'create-activity' },
        { id: 'ai-grading', label: 'AI Grading', icon: Brain, view: 'ai-grading' },
        { id: 'feedback', label: 'Feedback', icon: MessageSquare, view: 'teacher-feedback' },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, view: 'analytics' },
        { id: 'calendar', label: 'Calendar', icon: CalendarIcon, view: 'calendar' },
        { id: 'settings', label: 'Settings', icon: Settings, view: 'settings' },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, view: 'student-dashboard' },
        { id: 'courses', label: 'Courses', icon: BookOpen, view: 'courses' },
        { id: 'work-analysis', label: 'Work Analysis', icon: FileText, view: 'work-analysis' },
        { id: 'feedback', label: 'Feedback', icon: MessageSquare, view: 'student-feedback' },
        { id: 'practice', label: 'Practice Lab', icon: Code, view: 'practice-lab' },
        { id: 'calendar', label: 'Calendar', icon: CalendarIcon, view: 'calendar' },
        { id: 'due-this-week', label: 'Due This Week', icon: Clock, view: 'due-this-week' },
        { id: 'settings', label: 'Settings', icon: Settings, view: 'settings' },
      ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getActivitiesForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return activities.filter(a => a.date === dateStr);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="flex h-screen bg-[#fafafa] overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 bg-black text-white flex-col">
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
              onClick={() => onNavigate(item.view)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                item.id === 'calendar'
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

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-black">Calendar</h2>
            {userRole === 'teacher' && (
              <Button className="bg-black hover:bg-gray-800 text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Activity
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-black">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <div className="flex gap-2">
                  <Button
                    onClick={previousMonth}
                    variant="outline"
                    className="border-black text-black hover:bg-gray-100"
                    size="sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={nextMonth}
                    variant="outline"
                    className="border-black text-black hover:bg-gray-100"
                    size="sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Day Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-sm text-gray-600 py-2">
                    {day}
                  </div>
                ))}

                {/* Empty cells before first day */}
                {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dayActivities = getActivitiesForDate(day);
                  const isToday = day === 13 && currentDate.getMonth() === 9; // Oct 13, 2025

                  return (
                    <div
                      key={day}
                      className={`aspect-square border rounded-lg p-2 ${
                        isToday ? 'border-black bg-gray-100' : 'border-gray-200'
                      } hover:bg-gray-50 transition-colors`}
                    >
                      <div className="flex flex-col h-full">
                        <span className={`text-sm ${isToday ? 'text-black' : 'text-gray-600'}`}>
                          {day}
                        </span>
                        <div className="flex-1 mt-1 space-y-1">
                          {dayActivities.slice(0, 2).map((activity) => (
                            <div
                              key={activity.id}
                              className="text-xs bg-black text-white px-1 py-0.5 rounded truncate"
                              title={activity.title}
                            >
                              {activity.title}
                            </div>
                          ))}
                          {dayActivities.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{dayActivities.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Activities */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-black mb-4">Upcoming Activities</h3>
              <div className="space-y-3">
                {activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-black text-sm mb-1 truncate">{activity.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(activity.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{activity.dueTime}</span>
                        </div>
                        {userRole === 'teacher' && (
                          <Badge className="bg-gray-200 text-black mt-2 text-xs">
                            {activity.class}
                          </Badge>
                        )}
                        <Badge
                          className={`mt-2 text-xs ${
                            activity.type === 'Lab'
                              ? 'bg-black text-white'
                              : activity.type === 'Quiz'
                              ? 'bg-gray-600 text-white'
                              : activity.type === 'Exam'
                              ? 'bg-gray-800 text-white'
                              : 'bg-gray-400 text-white'
                          }`}
                        >
                          {activity.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
