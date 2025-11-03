import { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Settings,
  LogOut,
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Calendar,
  Code,
  Clock,
  FileText,
} from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface WorkAnalysisViewProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export default function WorkAnalysisView({ onNavigate, onLogout }: WorkAnalysisViewProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleFileUpload = () => {
    setIsAnalyzing(true);
    setShowResults(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2500);
  };

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
                item.id === 'work-analysis'
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
            <h2 className="text-black mb-1">Work Analysis</h2>
            <p className="text-gray-600 text-sm">
              Upload your Packet Tracer activities for AI-powered analysis
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-black mb-2">Upload Your Packet Tracer Activity</h3>
              <p className="text-gray-600 text-sm mb-6">
                Upload your .pka file to get instant AI-powered feedback and identify areas for improvement
              </p>
              <div className="flex flex-col items-center gap-3">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pka"
                    onChange={handleFileUpload}
                    disabled={isAnalyzing}
                  />
                  <Button
                    className="bg-black hover:bg-gray-800 text-white"
                    disabled={isAnalyzing}
                    asChild
                  >
                    <span>
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Choose .pka File
                        </>
                      )}
                    </span>
                  </Button>
                </label>
                <p className="text-xs text-gray-500">Supported format: .pka (Packet Tracer Activity)</p>
              </div>
            </div>
          </div>

          {/* Analysis Progress */}
          {isAnalyzing && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Loader2 className="w-5 h-5 animate-spin text-black" />
                <h3 className="text-black">Analyzing Your Work...</h3>
              </div>
              <Progress value={66} className="mb-2" />
              <p className="text-sm text-gray-600">AI is reviewing your network configuration and identifying improvement areas</p>
            </div>
          )}

          {/* Results */}
          {showResults && (
            <div className="space-y-4">
              {/* Score Overview */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-black mb-4">Analysis Complete</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Overall Score</p>
                    <p className="text-3xl text-black">78%</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <Badge className="bg-yellow-100 text-yellow-800">Needs Improvement</Badge>
                  </div>
                </div>
              </div>

              {/* Issues Found */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h3 className="text-black">Issues Found</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <h4 className="text-black text-sm mb-1">Missing Default Gateway on PC1</h4>
                    <p className="text-sm text-gray-700">PC1 does not have a default gateway configured. Without this, it cannot communicate with devices on other networks.</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <h4 className="text-black text-sm mb-1">Incorrect Subnet Mask on Router Interface</h4>
                    <p className="text-sm text-gray-700">GigabitEthernet0/1 has subnet mask 255.255.0.0 but should be 255.255.255.0 based on the requirements.</p>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  <h3 className="text-black">Recommendations</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <h4 className="text-black text-sm mb-1">Review Module 4: Network Layer</h4>
                    <p className="text-sm text-gray-700">Focus on default gateway configuration and subnet masking concepts.</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <h4 className="text-black text-sm mb-1">Practice Subnetting</h4>
                    <p className="text-sm text-gray-700">Complete the subnetting practice exercises to strengthen your understanding.</p>
                  </div>
                </div>
              </div>

              {/* What You Did Well */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <h3 className="text-black">What You Did Well</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">Correct router hostname configuration</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">Proper cable types used for all connections</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">All interfaces properly enabled with "no shutdown"</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowResults(false);
                  }}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Analyze Another File
                </Button>
                <Button
                  onClick={() => onNavigate('courses')}
                  variant="outline"
                  className="border-gray-300 text-gray-700"
                >
                  Go to Recommended Lessons
                </Button>
              </div>
            </div>
          )}

          {/* Info Section */}
          {!isAnalyzing && !showResults && (
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-black mb-3">How It Works</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="text-black text-sm mb-1">Upload Your Work</h4>
                    <p className="text-sm text-gray-600">Upload your Packet Tracer activity file (.pka)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="text-black text-sm mb-1">AI Analysis</h4>
                    <p className="text-sm text-gray-600">Our AI analyzes your configuration and identifies issues</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="text-black text-sm mb-1">Get Feedback</h4>
                    <p className="text-sm text-gray-600">Receive detailed feedback and personalized recommendations</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
