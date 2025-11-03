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
  Upload,
  Plus,
  X,
  Calendar as CalendarIcon2,
  ChevronLeft,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';

interface CreateActivityViewProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export default function CreateActivityView({ onNavigate, onLogout }: CreateActivityViewProps) {
  const [activityType, setActivityType] = useState('lab');
  const [selectedClass, setSelectedClass] = useState('CCNA1-A');
  const [attachments, setAttachments] = useState<string[]>([]);

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

  const handleCreateActivity = () => {
    toast.success('Activity created successfully! ✅');
    onNavigate('teacher-dashboard');
  };

  const handleAddAttachment = () => {
    setAttachments([...attachments, 'Document.pdf']);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
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
                item.id === 'create-activity'
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
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          <div className="mb-6">
            <h2 className="text-black mb-1">Create New Activity</h2>
            <p className="text-gray-600 text-sm">
              Create assignments, labs, quizzes, or exams for your students
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="space-y-6">
              {/* Activity Type */}
              <div>
                <Label htmlFor="activityType">Activity Type</Label>
                <Select value={activityType} onValueChange={setActivityType}>
                  <SelectTrigger id="activityType" className="bg-gray-50 border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lab">Lab Activity</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="exam">Exam</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title">Activity Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Lab Subnetting PT"
                  className="bg-gray-50 border-gray-200"
                />
              </div>

              {/* Class Selection */}
              <div>
                <Label htmlFor="class">Assign to Class</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger id="class" className="bg-gray-50 border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CCNA1-A">CCNA1-A - Introduction to Networks</SelectItem>
                    <SelectItem value="CCNA1-B">CCNA1-B - Introduction to Networks</SelectItem>
                    <SelectItem value="CCNA2-A">CCNA2-A - Routing & Switching</SelectItem>
                    <SelectItem value="CCNA3-A">CCNA3-A - Enterprise Networking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide instructions and details for this activity..."
                  className="min-h-[120px] bg-gray-50 border-gray-200"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    defaultValue="2025-10-20"
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
                <div>
                  <Label htmlFor="dueTime">Due Time</Label>
                  <Input
                    id="dueTime"
                    type="time"
                    defaultValue="23:59"
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
              </div>

              {/* Points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="points">Total Points</Label>
                  <Input
                    id="points"
                    type="number"
                    placeholder="100"
                    defaultValue="100"
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
                <div>
                  <Label htmlFor="passingGrade">Passing Grade (%)</Label>
                  <Input
                    id="passingGrade"
                    type="number"
                    placeholder="70"
                    defaultValue="70"
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
              </div>

              {/* File Upload */}
              <div>
                <Label>Attachments</Label>
                <div className="mt-2">
                  <div
                    onClick={handleAddAttachment}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload files or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PKA, PDF, DOCX, or ZIP files
                    </p>
                  </div>

                  {attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-600" />
                            <span className="text-sm text-black">{file}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveAttachment(index)}
                            className="text-gray-400 hover:text-black transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* AI Grading Options */}
              {activityType === 'lab' && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="text-black mb-3">AI Grading Settings</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm text-gray-700">Enable automatic AI grading</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm text-gray-700">
                        Require manual review for scores below 70%
                      </span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-gray-700">
                        Send immediate feedback to students
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  onClick={handleCreateActivity}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Activity
                </Button>
                <Button
                  onClick={() => onNavigate('teacher-dashboard')}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
