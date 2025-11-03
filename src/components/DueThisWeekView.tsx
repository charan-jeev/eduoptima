import { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Settings,
  LogOut,
  Calendar,
  Code,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle2,
  Upload,
  Paperclip,
  X,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';

interface DueThisWeekViewProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

const upcomingActivities = [
  { 
    id: 1, 
    title: 'Lab Subnetting PT', 
    course: 'CCNA 1 - Introduction to Networks',
    dueDate: 'Oct 14, 2025', 
    dueTime: '11:59 PM', 
    type: 'Lab',
    priority: 'high',
    points: 100,
    description: 'Configure subnetting for multiple networks using Packet Tracer',
    status: 'Not Started',
  },
  { 
    id: 2, 
    title: 'VLAN Configuration Quiz', 
    course: 'CCNA 1 - Introduction to Networks',
    dueDate: 'Oct 16, 2025', 
    dueTime: '11:59 PM', 
    type: 'Quiz',
    priority: 'medium',
    points: 50,
    description: '20 multiple choice questions on VLAN concepts',
    status: 'Not Started',
  },
  { 
    id: 3, 
    title: 'Router Setup Assignment', 
    course: 'CCNA 2 - Routing & Switching',
    dueDate: 'Oct 18, 2025', 
    dueTime: '11:59 PM', 
    type: 'Assignment',
    priority: 'medium',
    points: 75,
    description: 'Document your router configuration process',
    status: 'In Progress',
  },
  { 
    id: 4, 
    title: 'OSPF Routing Lab', 
    course: 'CCNA 2 - Routing & Switching',
    dueDate: 'Oct 20, 2025', 
    dueTime: '11:59 PM', 
    type: 'Lab',
    priority: 'low',
    points: 100,
    description: 'Implement OSPF routing protocol in a multi-area network',
    status: 'Not Started',
  },
];

export default function DueThisWeekView({ onNavigate, onLogout }: DueThisWeekViewProps) {
  const [filter, setFilter] = useState<'all' | 'lab' | 'quiz' | 'assignment'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Not Started' | 'In Progress' | 'Completed'>('all');
  const [selectedActivity, setSelectedActivity] = useState<typeof upcomingActivities[0] | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState('');

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

  const filteredActivities = upcomingActivities.filter(activity => {
    const typeMatch = filter === 'all' || activity.type.toLowerCase() === filter;
    const statusMatch = statusFilter === 'all' || activity.status === statusFilter;
    return typeMatch && statusMatch;
  });

  const totalPoints = upcomingActivities.reduce((sum, a) => sum + a.points, 0);
  const completedActivities = upcomingActivities.filter(a => a.status === 'Completed').length;

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date(2025, 9, 13); // Oct 13, 2025
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const handleSubmit = () => {
    if (!attachedFile) {
      toast.error('Please attach a file before submitting');
      return;
    }
    toast.success('Assignment submitted successfully');
    setSelectedActivity(null);
    setAttachedFile(null);
    setSubmissionNotes('');
  };

  const handleStartActivity = (activity: typeof upcomingActivities[0]) => {
    setSelectedActivity(activity);
  };

  // If an activity is selected, show the submission interface
  if (selectedActivity) {
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
                onClick={() => {
                  setSelectedActivity(null);
                  onNavigate(item.view);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  item.id === 'due-this-week'
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

        {/* Submission Interface */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <Button
              onClick={() => setSelectedActivity(null)}
              variant="outline"
              className="mb-6 border-gray-300 text-gray-700"
            >
              ← Back to Due This Week
            </Button>

            <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-6">
              <h2 className="text-black mb-2">{selectedActivity.title}</h2>
              <p className="text-gray-600 text-sm mb-4">{selectedActivity.course}</p>
              <p className="text-gray-700 mb-4">{selectedActivity.description}</p>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge className="bg-black text-white">{selectedActivity.type}</Badge>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Due: {selectedActivity.dueDate} at {selectedActivity.dueTime}</span>
                </div>
                <div className="text-sm text-gray-600">{selectedActivity.points} points</div>
              </div>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-6">
              <h3 className="text-black mb-4">Submit Your Work</h3>
              
              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm text-gray-700 mb-2">Attachment *</label>
                {!attachedFile ? (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pka,.pdf,.doc,.docx"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-black mb-1">Click to upload file</p>
                      <p className="text-sm text-gray-600">Supported formats: .pka, .pdf, .doc, .docx</p>
                    </div>
                  </label>
                ) : (
                  <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Paperclip className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-black">{attachedFile.name}</p>
                        <p className="text-xs text-gray-600">
                          {(attachedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setAttachedFile(null)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-black"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm text-gray-700 mb-2">Notes (Optional)</label>
                <Textarea
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="Add any notes or comments about your submission..."
                  className="min-h-[100px]"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  onClick={handleSubmit}
                  className="bg-black hover:bg-gray-800 text-white"
                  disabled={!attachedFile}
                >
                  Submit Assignment
                </Button>
                <Button
                  onClick={() => setSelectedActivity(null)}
                  variant="outline"
                  className="border-gray-300 text-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                item.id === 'due-this-week'
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
          <div className="mb-6">
            <h2 className="text-black mb-1">Due This Week</h2>
            <p className="text-gray-600 text-sm">
              Stay on top of your assignments and deadlines
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <p className="text-gray-600 text-sm mb-1">Total Activities</p>
              <h3 className="text-black">{upcomingActivities.length}</h3>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <p className="text-gray-600 text-sm mb-1">Completed</p>
              <h3 className="text-black">{completedActivities}</h3>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <p className="text-gray-600 text-sm mb-1">In Progress</p>
              <h3 className="text-black">
                {upcomingActivities.filter(a => a.status === 'In Progress').length}
              </h3>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <p className="text-gray-600 text-sm mb-1">Total Points</p>
              <h3 className="text-black">{totalPoints}</h3>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <h4 className="text-black mb-3">Filter by Type</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                onClick={() => setFilter('all')}
                variant={filter === 'all' ? 'default' : 'outline'}
                className={filter === 'all' ? 'bg-black text-white' : 'border-gray-300 text-gray-700'}
              >
                All
              </Button>
              <Button
                onClick={() => setFilter('lab')}
                variant={filter === 'lab' ? 'default' : 'outline'}
                className={filter === 'lab' ? 'bg-black text-white' : 'border-gray-300 text-gray-700'}
              >
                Labs
              </Button>
              <Button
                onClick={() => setFilter('quiz')}
                variant={filter === 'quiz' ? 'default' : 'outline'}
                className={filter === 'quiz' ? 'bg-black text-white' : 'border-gray-300 text-gray-700'}
              >
                Quizzes
              </Button>
              <Button
                onClick={() => setFilter('assignment')}
                variant={filter === 'assignment' ? 'default' : 'outline'}
                className={filter === 'assignment' ? 'bg-black text-white' : 'border-gray-300 text-gray-700'}
              >
                Assignments
              </Button>
            </div>

            <h4 className="text-black mb-3">Filter by Status</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setStatusFilter('all')}
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                className={statusFilter === 'all' ? 'bg-black text-white' : 'border-gray-300 text-gray-700'}
              >
                All Status
              </Button>
              <Button
                onClick={() => setStatusFilter('Not Started')}
                variant={statusFilter === 'Not Started' ? 'default' : 'outline'}
                className={statusFilter === 'Not Started' ? 'bg-black text-white' : 'border-gray-300 text-gray-700'}
              >
                Not Started
              </Button>
              <Button
                onClick={() => setStatusFilter('In Progress')}
                variant={statusFilter === 'In Progress' ? 'default' : 'outline'}
                className={statusFilter === 'In Progress' ? 'bg-black text-white' : 'border-gray-300 text-gray-700'}
              >
                In Progress
              </Button>
              <Button
                onClick={() => setStatusFilter('Completed')}
                variant={statusFilter === 'Completed' ? 'default' : 'outline'}
                className={statusFilter === 'Completed' ? 'bg-black text-white' : 'border-gray-300 text-gray-700'}
              >
                Completed
              </Button>
            </div>
          </div>

          {/* Activities List */}
          <div className="space-y-4">
            {filteredActivities.map((activity) => {
              const daysUntil = getDaysUntilDue(activity.dueDate);
              const isUrgent = daysUntil <= 2;

              return (
                <div key={activity.id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-black mb-1">{activity.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{activity.course}</p>
                          <p className="text-sm text-gray-700">{activity.description}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 items-center">
                        <Badge
                          className={`text-xs ${
                            activity.type === 'Lab'
                              ? 'bg-black text-white'
                              : activity.type === 'Quiz'
                              ? 'bg-gray-600 text-white'
                              : 'bg-gray-400 text-white'
                          }`}
                        >
                          {activity.type}
                        </Badge>
                        <Badge
                          className={`text-xs ${
                            activity.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : activity.status === 'In Progress'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {activity.status}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span>{activity.dueDate} • {activity.dueTime}</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          {activity.points} points
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      {isUrgent ? (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm">Due in {daysUntil} day{daysUntil !== 1 ? 's' : ''}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">Due in {daysUntil} days</span>
                        </div>
                      )}
                      
                      <Button
                        onClick={() => handleStartActivity(activity)}
                        className="bg-black hover:bg-gray-800 text-white"
                        size="sm"
                      >
                        {activity.status === 'Not Started' ? 'Start' : 'Continue'}
                      </Button>
                    </div>
                  </div>

                  {activity.status === 'In Progress' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-xs text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>35%</span>
                      </div>
                      <Progress value={35} className="h-2" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredActivities.length === 0 && (
            <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-black mb-2">All caught up!</h3>
              <p className="text-gray-600">No {filter !== 'all' ? filter + 's' : 'activities'} due this week.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
