import { useState } from 'react';
import {
  Users,
  Clock,
  TrendingUp,
  BookOpen,
  ChevronRight,
  Award,
  Settings,
  LogOut,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';

interface TeacherClassSelectionProps {
  onSelectClass: (classData: any) => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

const teacherClasses = [
  {
    id: 1,
    code: 'CCNA1-A',
    name: 'Introduction to Networks',
    section: 'Section A',
    semester: 'Fall 2025',
    students: 28,
    avgGrade: 84,
    pendingSubmissions: 12,
    nextClass: 'Mon, Oct 14 - 9:00 AM',
    progress: 68,
    color: '#000000',
  },
  {
    id: 2,
    code: 'CCNA1-B',
    name: 'Introduction to Networks',
    section: 'Section B',
    semester: 'Fall 2025',
    students: 32,
    avgGrade: 79,
    pendingSubmissions: 8,
    nextClass: 'Mon, Oct 14 - 2:00 PM',
    progress: 65,
    color: '#000000',
  },
  {
    id: 3,
    code: 'CCNA2-A',
    name: 'Routing & Switching Essentials',
    section: 'Section A',
    semester: 'Fall 2025',
    students: 24,
    avgGrade: 82,
    pendingSubmissions: 5,
    nextClass: 'Tue, Oct 15 - 10:00 AM',
    progress: 45,
    color: '#000000',
  },
  {
    id: 4,
    code: 'CCNA3-A',
    name: 'Enterprise Networking',
    section: 'Section A',
    semester: 'Fall 2025',
    students: 18,
    avgGrade: 88,
    pendingSubmissions: 3,
    nextClass: 'Wed, Oct 16 - 1:00 PM',
    progress: 52,
    color: '#000000',
  },
];

export default function TeacherClassSelection({
  onSelectClass,
  onLogout,
  onNavigate,
}: TeacherClassSelectionProps) {
  const [hoveredClass, setHoveredClass] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Top Bar */}
      <div className="bg-black text-white px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-xl text-black">E</span>
            </div>
            <span className="text-lg">EduOptima</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('settings')}
              className="p-2 hover:bg-gray-900 rounded-lg transition-colors hidden md:block"
            >
              <Settings className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-white text-black">AS</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm">Adam Solivas</p>
                <p className="text-xs text-gray-400">Instructor</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-2 hover:bg-gray-900 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-black mb-2">Select a Class</h1>
          <p className="text-gray-600">
            Choose a class to view dashboard, grade submissions, and manage students
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Total Classes</p>
              <BookOpen className="w-5 h-5 text-black" />
            </div>
            <h3 className="text-black">{teacherClasses.length}</h3>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Total Students</p>
              <Users className="w-5 h-5 text-black" />
            </div>
            <h3 className="text-black">
              {teacherClasses.reduce((acc, c) => acc + c.students, 0)}
            </h3>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Pending Reviews</p>
              <Clock className="w-5 h-5 text-black" />
            </div>
            <h3 className="text-black">
              {teacherClasses.reduce((acc, c) => acc + c.pendingSubmissions, 0)}
            </h3>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Overall Avg</p>
              <TrendingUp className="w-5 h-5 text-black" />
            </div>
            <h3 className="text-black">
              {Math.round(
                teacherClasses.reduce((acc, c) => acc + c.avgGrade, 0) / teacherClasses.length
              )}
              %
            </h3>
          </div>
        </div>

        {/* Class Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teacherClasses.map((classData) => (
            <div
              key={classData.id}
              onMouseEnter={() => setHoveredClass(classData.id)}
              onMouseLeave={() => setHoveredClass(null)}
              onClick={() => onSelectClass(classData)}
              className="bg-white rounded-2xl p-6 cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] border-2 border-transparent hover:border-black"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-black text-white">{classData.code}</Badge>
                    <Badge variant="outline" className="border-gray-300 text-gray-600">
                      {classData.semester}
                    </Badge>
                  </div>
                  <h3 className="text-black mb-1">{classData.name}</h3>
                  <p className="text-sm text-gray-600">{classData.section}</p>
                </div>
                <ChevronRight
                  className={`w-6 h-6 text-black transition-transform ${
                    hoveredClass === classData.id ? 'translate-x-1' : ''
                  }`}
                />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <p className="text-xs text-gray-600">Students</p>
                  </div>
                  <p className="text-black">{classData.students}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="w-4 h-4 text-gray-400" />
                    <p className="text-xs text-gray-600">Avg Grade</p>
                  </div>
                  <p className="text-black">{classData.avgGrade}%</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <p className="text-xs text-gray-600">Pending</p>
                  </div>
                  <p className="text-black">{classData.pendingSubmissions}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Course Progress</span>
                  <span className="text-black">{classData.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full transition-all duration-500"
                    style={{ width: `${classData.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Next Class */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Next class session</p>
                <p className="text-sm text-black">{classData.nextClass}</p>
              </div>

              {/* Hover Action */}
              {hoveredClass === classData.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <Button className="w-full bg-black hover:bg-gray-800 text-white">
                    Open Dashboard
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black rounded-2xl p-6 text-white">
            <h4 className="text-white mb-2">Need to add a new class?</h4>
            <p className="text-gray-400 text-sm mb-4">
              Create a new class section or import from Cisco NetAcad
            </p>
            <Button className="bg-white text-black hover:bg-gray-200">
              Add New Class
            </Button>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h4 className="text-black mb-2">View All Analytics</h4>
            <p className="text-gray-600 text-sm mb-4">
              See combined insights and performance across all your classes
            </p>
            <Button
              onClick={() => onNavigate('analytics')}
              variant="outline"
              className="border-black text-black hover:bg-gray-100"
            >
              Open Analytics
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
