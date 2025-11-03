import { useState } from 'react';
import {
  LayoutDashboard,
  Brain,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  CheckCircle,
  Edit3,
  Send,
  Loader2,
  TrendingUp,
  FileText,
  Plus,
  Calendar as CalendarIcon,
  Download,
} from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';

interface AIGradingPanelProps {
  submission: any;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onBackToClasses?: () => void;
}

export default function AIGradingPanel({
  submission,
  onNavigate,
  onLogout,
}: AIGradingPanelProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [feedback, setFeedback] = useState(
    'VLAN naming inconsistent. Router mask mismatch in subnet configuration.'
  );

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, view: 'teacher-dashboard' },
    { id: 'submissions', label: 'Submissions', icon: FileText, view: 'submissions' },
    { id: 'create-activity', label: 'Create Activity', icon: Plus, view: 'create-activity' },
    { id: 'ai-grading', label: 'AI Grading', icon: Brain, view: 'ai-grading' },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, view: 'teacher-feedback' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, view: 'analytics' },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon, view: 'calendar' },
    { id: 'settings', label: 'Settings', icon: Settings, view: 'settings' },
  ];

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
                item.id === 'ai-grading'
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
        <div className="flex flex-col lg:flex-row h-full">
          {/* Left Panel - 2/3 */}
          <div className="flex-1 lg:w-2/3 bg-white p-4 md:p-8 overflow-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm mb-6">
              <button
                onClick={() => onNavigate('teacher-dashboard')}
                className="text-black hover:underline"
              >
                Dashboard
              </button>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">AI Grading</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-black">{submission?.lab || 'Lab Subnetting PT'}</span>
            </div>

            {/* File Preview */}
            <div className="mb-6">
              <h3 className="text-black mb-4">File Preview</h3>
              <div className="bg-gray-50 rounded-2xl p-8 relative min-h-[300px] flex items-center justify-center border border-gray-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-black" />
                  </div>
                  <p className="text-gray-600 mb-4">
                    {submission?.lab || 'Lab Subnetting PT'}.pka
                  </p>
                  {!showResults && !isAnalyzing && (
                    <Button
                      onClick={handleAnalyze}
                      className="bg-black hover:bg-gray-800 text-white"
                    >
                      Start AI Analysis
                    </Button>
                  )}
                </div>

                {/* Analyzing Overlay */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-white/90 rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 text-black animate-spin mx-auto mb-4" />
                      <p className="text-black">Analyzing network configuration...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Results */}
            {showResults && (
              <>
                {/* Score Card */}
                <div className="bg-black rounded-2xl p-6 mb-6 text-white">
                  <h3 className="mb-4">AI Grading Result</h3>
                  <div className="text-6xl mb-2">{submission?.score || 85}</div>
                  <p className="text-gray-400">out of 100</p>
                </div>

                {/* Breakdown */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
                  <h4 className="text-black mb-4">Score Breakdown</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Routing</span>
                        <span className="text-sm text-black">90 / 100</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">VLAN Configuration</span>
                        <span className="text-sm text-black">72 / 100</span>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">IP Addressing</span>
                        <span className="text-sm text-black">88 / 100</span>
                      </div>
                      <Progress value={88} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Troubleshooting</span>
                        <span className="text-sm text-black">80 / 100</span>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>
                  </div>
                </div>

                {/* Feedback */}
                <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-200">
                  <h4 className="text-black mb-3">AI Feedback</h4>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-[100px] bg-white border-gray-200"
                  />
                </div>

                {/* Confidence Meter */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
                  <h4 className="text-black mb-3">AI Confidence Score</h4>
                  <div className="flex items-center gap-4">
                    <Progress value={88} className="flex-1 h-3" />
                    <span className="text-2xl text-black">0.88</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    High confidence - AI recommendations are reliable
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-black hover:bg-gray-800 text-white">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Grade
                  </Button>
                  <Button variant="outline" className="border-black text-black hover:bg-gray-100">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Feedback
                  </Button>
                  <Button className="bg-gray-800 hover:bg-gray-700 text-white">
                    <Send className="w-4 h-4 mr-2" />
                    Send to Student
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Right Panel - 1/3 */}
          <div className="lg:w-1/3 bg-white border-l border-gray-200 p-6 overflow-auto">
            {/* Student Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-black text-white text-xl">
                    BC
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-black">{submission?.name || 'Beignet C.'}</h4>
                  <p className="text-gray-600 text-sm">Student ID: 2024-1234</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Course Progress</span>
                    <span className="text-black">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Overall Grade</span>
                    <span className="text-black">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </div>
            </div>

            {/* Submission Details */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
              <h4 className="text-black mb-4">Submission Details</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Submitted:</span>
                  <span className="text-black">{submission?.date || 'Oct 05, 2025'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge className="bg-gray-200 text-gray-800 border border-gray-300">
                    {submission?.status || 'Pending'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">File Type:</span>
                  <span className="text-black">.PKA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span className="text-black">2.4 MB</span>
                </div>
              </div>
              
              {/* Download Button */}
              <Button 
                className="w-full mt-4 bg-black hover:bg-gray-800 text-white"
                onClick={() => {
                  // In a real app, this would download the file
                  console.log('Downloading student work...');
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Student Work
              </Button>
            </div>

            {/* Previous Submissions */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h4 className="text-black mb-4">Previous Submissions</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-sm text-black">VLAN Configuration</p>
                    <p className="text-xs text-gray-600">Oct 03</p>
                  </div>
                  <Badge className="bg-black text-white">85</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-sm text-black">Router Setup</p>
                    <p className="text-xs text-gray-600">Oct 01</p>
                  </div>
                  <Badge className="bg-black text-white">92</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-sm text-black">IP Addressing</p>
                    <p className="text-xs text-gray-600">Sep 28</p>
                  </div>
                  <Badge className="bg-black text-white">78</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
