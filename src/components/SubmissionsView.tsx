import { useState } from 'react';
import {
  LayoutDashboard,
  Brain,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  CalendarIcon,
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  Calendar as CalendarIcon2,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface SubmissionsViewProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onViewSubmission: (submission: any) => void;
}

const allSubmissions = [
  { id: 1, student: 'Beignet C.', class: 'CCNA1-A', activity: 'Lab Subnetting PT', submitted: '2025-10-05 09:30 AM', status: 'Pending', score: null },
  { id: 2, student: 'John Smith', class: 'CCNA1-A', activity: 'VLAN Configuration', submitted: '2025-10-04 02:15 PM', status: 'Graded', score: 92 },
  { id: 3, student: 'Sarah Lee', class: 'CCNA1-B', activity: 'Router Setup PT', submitted: '2025-10-03 11:45 AM', status: 'Pending', score: null },
  { id: 4, student: 'Mike Chen', class: 'CCNA2-A', activity: 'ACL Implementation', submitted: '2025-10-02 04:20 PM', status: 'Graded', score: 88 },
  { id: 5, student: 'Emma Wilson', class: 'CCNA1-A', activity: 'OSPF Routing', submitted: '2025-10-01 10:00 AM', status: 'Graded', score: 95 },
  { id: 6, student: 'Alex Turner', class: 'CCNA1-B', activity: 'IP Addressing Quiz', submitted: '2025-10-06 03:30 PM', status: 'Pending', score: null },
  { id: 7, student: 'Lisa Park', class: 'CCNA3-A', activity: 'Network Security Lab', submitted: '2025-10-05 01:15 PM', status: 'Graded', score: 87 },
  { id: 8, student: 'David Kim', class: 'CCNA1-A', activity: 'Subnetting Practice', submitted: '2025-10-04 05:45 PM', status: 'Pending', score: null },
];

export default function SubmissionsView({ onNavigate, onLogout, onViewSubmission }: SubmissionsViewProps) {
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, view: 'teacher-dashboard' },
    { id: 'submissions', label: 'Submissions', icon: FileText, view: 'submissions' },
    { id: 'create-activity', label: 'Create Activity', icon: Plus, view: 'create-activity' },
    { id: 'ai-grading', label: 'AI Grading', icon: Brain, view: 'ai-grading' },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, view: 'teacher-feedback' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, view: 'analytics' },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon2, view: 'calendar' },
    { id: 'settings', label: 'Settings', icon: Settings, view: 'settings' },
  ];

  const filteredSubmissions = allSubmissions.filter((submission) => {
    const matchesClass = selectedClass === 'all' || submission.class === selectedClass;
    const matchesStatus = selectedStatus === 'all' || submission.status.toLowerCase() === selectedStatus;
    const matchesSearch = 
      submission.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.activity.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesClass && matchesStatus && matchesSearch;
  });

  const pendingCount = allSubmissions.filter(s => s.status === 'Pending').length;

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
                item.id === 'submissions'
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:bg-gray-900 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.id === 'submissions' && pendingCount > 0 && (
                <Badge className="ml-auto bg-black text-white">{pendingCount}</Badge>
              )}
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
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-black mb-1">Student Submissions</h2>
              <p className="text-gray-600 text-sm">
                Review and grade student work across all your classes
              </p>
            </div>
            <Button className="bg-black hover:bg-gray-800 text-white">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <p className="text-gray-600 text-sm mb-1">Total Submissions</p>
              <h3 className="text-black">{allSubmissions.length}</h3>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <p className="text-gray-600 text-sm mb-1">Pending Review</p>
              <h3 className="text-black">{pendingCount}</h3>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <p className="text-gray-600 text-sm mb-1">Graded Today</p>
              <h3 className="text-black">3</h3>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <p className="text-gray-600 text-sm mb-1">Average Score</p>
              <h3 className="text-black">87%</h3>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <h3 className="text-black">Filters</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search student or activity..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              </div>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="CCNA1-A">CCNA1-A</SelectItem>
                  <SelectItem value="CCNA1-B">CCNA1-B</SelectItem>
                  <SelectItem value="CCNA2-A">CCNA2-A</SelectItem>
                  <SelectItem value="CCNA3-A">CCNA3-A</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="graded">Graded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-sm text-gray-600">Student</th>
                    <th className="text-left py-3 px-2 text-sm text-gray-600">Class</th>
                    <th className="text-left py-3 px-2 text-sm text-gray-600">Activity</th>
                    <th className="text-left py-3 px-2 text-sm text-gray-600">Submitted</th>
                    <th className="text-left py-3 px-2 text-sm text-gray-600">Status</th>
                    <th className="text-left py-3 px-2 text-sm text-gray-600">Score</th>
                    <th className="text-left py-3 px-2 text-sm text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-2 text-sm text-black">{submission.student}</td>
                      <td className="py-3 px-2">
                        <Badge className="bg-black text-white text-xs">{submission.class}</Badge>
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-600">{submission.activity}</td>
                      <td className="py-3 px-2 text-sm text-gray-600">{submission.submitted}</td>
                      <td className="py-3 px-2">
                        <Badge
                          className={
                            submission.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }
                        >
                          {submission.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-sm text-black">
                        {submission.score !== null ? `${submission.score}%` : '-'}
                      </td>
                      <td className="py-3 px-2">
                        <Button
                          onClick={() => onViewSubmission(submission)}
                          variant="ghost"
                          className="text-black hover:bg-gray-100"
                          size="sm"
                        >
                          <Eye className="w-4 h-4 mr-1" />
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
  );
}
