import { useState } from 'react';
import {
  LayoutDashboard,
  Brain,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  FileDown,
  Filter,
  TrendingUp,
  AlertCircle,
  FileText,
  Plus,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface AnalyticsViewProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onBackToClasses?: () => void;
}

const lineData = [
  { name: 'Week 1', ai: 82, manual: 80 },
  { name: 'Week 2', ai: 85, manual: 83 },
  { name: 'Week 3', ai: 83, manual: 82 },
  { name: 'Week 4', ai: 88, manual: 85 },
  { name: 'Week 5', ai: 90, manual: 87 },
  { name: 'Week 6', ai: 89, manual: 88 },
];

const barData = [
  { module: 'Routing', score: 88 },
  { module: 'VLAN', score: 72 },
  { module: 'IP Addr', score: 85 },
  { module: 'Security', score: 78 },
  { module: 'OSPF', score: 92 },
];

const pieData = [
  { name: 'A (90-100)', value: 25, color: '#000000' },
  { name: 'B (80-89)', value: 35, color: '#404040' },
  { name: 'C (70-79)', value: 28, color: '#808080' },
  { name: 'D (60-69)', value: 12, color: '#c0c0c0' },
];

const scatterData = [
  { confidence: 0.92, score: 95 },
  { confidence: 0.88, score: 85 },
  { confidence: 0.75, score: 78 },
  { confidence: 0.95, score: 98 },
  { confidence: 0.82, score: 82 },
  { confidence: 0.70, score: 72 },
  { confidence: 0.90, score: 90 },
  { confidence: 0.85, score: 88 },
  { confidence: 0.78, score: 80 },
  { confidence: 0.93, score: 92 },
];

export default function AnalyticsView({ onNavigate, onLogout }: AnalyticsViewProps) {
  const [selectedCourse, setSelectedCourse] = useState('ccna1');
  const [dateRange, setDateRange] = useState('last-30');

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
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 bg-black text-white flex-col border-r border-gray-800">
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
                item.id === 'analytics'
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
      <div className="flex-1 overflow-auto bg-black text-white">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h2 className="text-white">Analytics & Insights</h2>
            <Button className="bg-white hover:bg-gray-200 text-black">
              <FileDown className="w-4 h-4 mr-2" />
              Download Report (PDF)
            </Button>
          </div>

          {/* Filters */}
          <div className="bg-gray-900 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <h3 className="text-white">Filters</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Course</label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger className="bg-black border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ccna1">CCNA 1 - Intro to Networks</SelectItem>
                    <SelectItem value="ccna2">CCNA 2 - Routing & Switching</SelectItem>
                    <SelectItem value="ccna3">CCNA 3 - Enterprise Networking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Date Range</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="bg-black border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-7">Last 7 days</SelectItem>
                    <SelectItem value="last-30">Last 30 days</SelectItem>
                    <SelectItem value="last-90">Last 90 days</SelectItem>
                    <SelectItem value="all">All time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Compare</label>
                <Select defaultValue="ai-vs-manual">
                  <SelectTrigger className="bg-black border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai-vs-manual">AI vs Manual</SelectItem>
                    <SelectItem value="class-sections">Class Sections</SelectItem>
                    <SelectItem value="modules">By Module</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Line Chart */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <h3 className="text-white mb-4">Average Scores Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="ai" stroke="#ffffff" strokeWidth={3} name="AI Grading" />
                  <Line type="monotone" dataKey="manual" stroke="#9ca3af" strokeWidth={3} name="Manual Grading" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <h3 className="text-white mb-4">Module Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="module" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="score" fill="#ffffff" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <h3 className="text-white mb-4">Grade Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Scatter Chart */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <h3 className="text-white mb-4">Confidence vs Score</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    type="number"
                    dataKey="confidence"
                    name="Confidence"
                    domain={[0.6, 1]}
                    stroke="#9ca3af"
                  />
                  <YAxis type="number" dataKey="score" name="Score" stroke="#9ca3af" />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Scatter data={scatterData} fill="#ffffff" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-gray-900 rounded-2xl p-6">
            <h3 className="text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-white" />
              Key Insights
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-black rounded-lg">
                <AlertCircle className="w-5 h-5 text-white mt-0.5" />
                <div>
                  <p className="text-white mb-1">AI grading accuracy improved by 8% this month</p>
                  <p className="text-sm text-gray-400">
                    The machine learning model is getting better with more training data
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-black rounded-lg">
                <AlertCircle className="w-5 h-5 text-white mt-0.5" />
                <div>
                  <p className="text-white mb-1">VLAN configuration shows lowest average score</p>
                  <p className="text-sm text-gray-400">
                    Consider dedicating additional lab time or creating supplementary materials
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-black rounded-lg">
                <AlertCircle className="w-5 h-5 text-white mt-0.5" />
                <div>
                  <p className="text-white mb-1">High correlation between AI confidence and actual scores</p>
                  <p className="text-sm text-gray-400">
                    AI predictions with confidence above 0.85 are 94% accurate
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-black rounded-lg">
                <AlertCircle className="w-5 h-5 text-white mt-0.5" />
                <div>
                  <p className="text-white mb-1">Grade distribution follows normal curve</p>
                  <p className="text-sm text-gray-400">
                    Most students scoring in B range (80-89) indicates appropriate difficulty level
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
