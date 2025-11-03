import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Brain,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  FileText,
  Calendar,
  Plus,
  ArrowLeft,
  Sparkles,
  Target,
  Users,
  Send,
  TrendingDown,
  TrendingUp,
  Award,
  CheckCircle,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import MobileNav from './MobileNav';
import {
  Activity,
  getAllActivities,
  saveAIRecommendation,
  GEMINI_API_KEY,
} from '../lib/firebase';
import { toast } from 'sonner@2.0.3';

interface StudentTargetingViewProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onBackToClasses: () => void;
}

interface Student {
  id: string;
  name: string;
  avgGrade: number;
  recentTrend: 'up' | 'down' | 'stable';
  weakAreas: string[];
  completedActivities: number;
  lastActive: string;
}

interface StudentRecommendation {
  studentId: string;
  activityId: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export default function StudentTargetingView({
  onNavigate,
  onLogout,
  onBackToClasses,
}: StudentTargetingViewProps) {
  const [activeNav, setActiveNav] = useState('activities');
  const [isMobile, setIsMobile] = useState(false);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [recommendations, setRecommendations] = useState<StudentRecommendation[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [generatingAI, setGeneratingAI] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const activitiesData = await getAllActivities();
      if (activitiesData.length === 0) {
        setActivities(mockActivities);
      } else {
        setActivities(activitiesData);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
      setActivities(mockActivities);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, view: 'teacher-dashboard' },
    { id: 'submissions', label: 'Submissions', icon: FileText, view: 'submissions' },
    { id: 'activities', label: 'Activities', icon: Sparkles, view: 'teacher-activities' },
    { id: 'ai-grading', label: 'AI Grading', icon: Brain, view: 'ai-grading' },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, view: 'teacher-feedback' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, view: 'analytics' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, view: 'calendar' },
    { id: 'settings', label: 'Settings', icon: Settings, view: 'settings' },
  ];

  const handleToggleStudent = (studentId: string) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const handleGenerateAIRecommendations = async () => {
    setGeneratingAI(true);
    
    try {
      const prompt = `You are an educational AI assistant for EduOptima, analyzing student performance data to recommend activities.

Available activities:
${activities.map(a => `- ${a.id}: ${a.title} (${a.difficulty}, Topics: ${a.tags.join(', ')})`).join('\n')}

Student performance data:
${students.map(s => `- ${s.name} (ID: ${s.id}): Avg Grade ${s.avgGrade}%, Trend: ${s.recentTrend}, Weak Areas: ${s.weakAreas.join(', ')}`).join('\n')}

For each student, recommend 1-2 activities that would best help them improve. Provide a brief reason for each recommendation.

Format your response as JSON:
{
  "recommendations": [
    {
      "studentId": "student_id",
      "activityId": "activity_id",
      "reason": "brief explanation",
      "priority": "high|medium|low"
    }
  ]
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;

      // Parse JSON response
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setRecommendations(parsed.recommendations || []);
          toast.success('AI recommendations generated! ✨');
        } else {
          // Fallback to rule-based recommendations
          generateRuleBasedRecommendations();
        }
      } catch (e) {
        generateRuleBasedRecommendations();
      }
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      generateRuleBasedRecommendations();
    }

    setGeneratingAI(false);
  };

  const generateRuleBasedRecommendations = () => {
    const newRecommendations: StudentRecommendation[] = [];
    
    students.forEach(student => {
      // Find activities matching student's weak areas
      const matchingActivities = activities.filter(activity =>
        student.weakAreas.some(weakArea =>
          activity.tags.some(tag => tag.toLowerCase().includes(weakArea.toLowerCase()))
        )
      );

      if (matchingActivities.length > 0) {
        // Recommend based on difficulty and grade
        let recommendedActivity = matchingActivities[0];
        if (student.avgGrade < 70) {
          recommendedActivity = matchingActivities.find(a => a.difficulty === 'Beginner') || matchingActivities[0];
        } else if (student.avgGrade >= 85) {
          recommendedActivity = matchingActivities.find(a => a.difficulty === 'Advanced') || matchingActivities[0];
        }

        newRecommendations.push({
          studentId: student.id,
          activityId: recommendedActivity.id,
          reason: `This activity addresses ${student.weakAreas[0]} and matches the student's current skill level`,
          priority: student.avgGrade < 70 ? 'high' : student.avgGrade < 85 ? 'medium' : 'low',
        });
      }
    });

    setRecommendations(newRecommendations);
    toast.success('Recommendations generated! ✅');
  };

  const handleSendRecommendations = async () => {
    const studentsToSend = selectedStudents.size > 0
      ? Array.from(selectedStudents)
      : students.map(s => s.id);

    if (studentsToSend.length === 0) {
      toast.error('No students selected');
      return;
    }

    if (selectedActivity) {
      // Send specific activity to selected students
      setSending(true);
      try {
        for (const studentId of studentsToSend) {
          await saveAIRecommendation(studentId, {
            activityId: selectedActivity,
            reason: 'Recommended by teacher',
            priority: 'medium',
            timestamp: new Date(),
          });
        }
        toast.success(`Activity assigned to ${studentsToSend.length} students! 📚`);
      } catch (error) {
        toast.error('Failed to send recommendations');
      }
      setSending(false);
    } else if (recommendations.length > 0) {
      // Send AI recommendations
      setSending(true);
      try {
        const recommendationsToSend = recommendations.filter(r =>
          studentsToSend.includes(r.studentId)
        );

        for (const rec of recommendationsToSend) {
          await saveAIRecommendation(rec.studentId, {
            activityId: rec.activityId,
            reason: rec.reason,
            priority: rec.priority,
            timestamp: new Date(),
          });
        }
        toast.success(`Sent ${recommendationsToSend.length} AI recommendations! ✨`);
      } catch (error) {
        toast.error('Failed to send recommendations');
      }
      setSending(false);
    } else {
      toast.error('Please generate AI recommendations or select an activity first');
    }
  };

  const getStudentRecommendation = (studentId: string) => {
    return recommendations.find(r => r.studentId === studentId);
  };

  const getStudentsByPerformance = (category: string) => {
    switch (category) {
      case 'struggling':
        return students.filter(s => s.avgGrade < 70);
      case 'average':
        return students.filter(s => s.avgGrade >= 70 && s.avgGrade < 85);
      case 'excelling':
        return students.filter(s => s.avgGrade >= 85);
      default:
        return students;
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => onNavigate('teacher-activities')}
                variant="ghost"
                className="text-black hover:bg-gray-100 -ml-2"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Activity Library
              </Button>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-purple-600" />
                <div>
                  <h2 className="text-black">Student Targeting</h2>
                  <p className="text-gray-600 text-sm">AI-powered activity recommendations for students</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleGenerateAIRecommendations}
                disabled={generatingAI}
                variant="outline"
                className="border-purple-300 text-purple-600 hover:bg-purple-50"
              >
                {generatingAI ? (
                  <>
                    <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate AI Recommendations
                  </>
                )}
              </Button>
              <Button
                onClick={handleSendRecommendations}
                disabled={sending || (selectedStudents.size === 0 && recommendations.length === 0)}
                className="bg-black text-white hover:bg-gray-800"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send to Students
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Needs Support</p>
                    <h3 className="text-black">{students.filter(s => s.avgGrade < 70).length} students</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Average Performance</p>
                    <h3 className="text-black">{students.filter(s => s.avgGrade >= 70 && s.avgGrade < 85).length} students</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Excelling</p>
                    <h3 className="text-black">{students.filter(s => s.avgGrade >= 85).length} students</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Selection */}
            {!recommendations.length && (
              <div className="bg-white rounded-2xl p-6 mb-6">
                <h3 className="text-black mb-4">Assign Specific Activity</h3>
                <select
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Select an activity to assign...</option>
                  {activities.map(activity => (
                    <option key={activity.id} value={activity.id}>
                      {activity.title} ({activity.difficulty})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Student Tabs */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="bg-white border border-gray-200 p-1 mb-6">
                <TabsTrigger value="all" className="data-[state=active]:bg-black data-[state=active]:text-white">
                  All Students ({students.length})
                </TabsTrigger>
                <TabsTrigger value="struggling" className="data-[state=active]:bg-black data-[state=active]:text-white">
                  Needs Support ({getStudentsByPerformance('struggling').length})
                </TabsTrigger>
                <TabsTrigger value="excelling" className="data-[state=active]:bg-black data-[state=active]:text-white">
                  Excelling ({getStudentsByPerformance('excelling').length})
                </TabsTrigger>
              </TabsList>

              {['all', 'struggling', 'excelling'].map(category => (
                <TabsContent key={category} value={category}>
                  <div className="space-y-4">
                    {getStudentsByPerformance(category).map(student => {
                      const recommendation = getStudentRecommendation(student.id);
                      const recommendedActivity = recommendation
                        ? activities.find(a => a.id === recommendation.activityId)
                        : null;

                      return (
                        <div
                          key={student.id}
                          className={`bg-white rounded-2xl p-6 border-2 transition-all ${
                            selectedStudents.has(student.id)
                              ? 'border-black shadow-md'
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="pt-1">
                              <Checkbox
                                checked={selectedStudents.has(student.id)}
                                onCheckedChange={() => handleToggleStudent(student.id)}
                              />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h4 className="text-black mb-1">{student.name}</h4>
                                  <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <span>Avg Grade: {student.avgGrade}%</span>
                                    <span>•</span>
                                    <span>Completed: {student.completedActivities}</span>
                                    <span>•</span>
                                    <span>Last Active: {student.lastActive}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {student.recentTrend === 'up' && (
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                  )}
                                  {student.recentTrend === 'down' && (
                                    <TrendingDown className="w-5 h-5 text-red-600" />
                                  )}
                                  <Badge className={
                                    student.avgGrade >= 85 ? 'bg-green-100 text-green-800' :
                                    student.avgGrade >= 70 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }>
                                    {student.avgGrade >= 85 ? 'Excelling' :
                                     student.avgGrade >= 70 ? 'Average' : 'Needs Support'}
                                  </Badge>
                                </div>
                              </div>

                              <div className="mb-3">
                                <p className="text-sm text-gray-600 mb-2">Weak Areas:</p>
                                <div className="flex flex-wrap gap-2">
                                  {student.weakAreas.map((area, index) => (
                                    <span
                                      key={index}
                                      className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded"
                                    >
                                      {area}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {recommendation && recommendedActivity && (
                                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                                  <div className="flex items-start gap-3">
                                    <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                                    <div className="flex-1">
                                      <p className="text-sm text-black mb-1">AI Recommended Activity:</p>
                                      <p className="text-sm mb-2">
                                        <strong>{recommendedActivity.title}</strong>
                                      </p>
                                      <p className="text-xs text-gray-700 mb-2">{recommendation.reason}</p>
                                      <Badge className={
                                        recommendation.priority === 'high' ? 'bg-red-100 text-red-800' :
                                        recommendation.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                      }>
                                        {recommendation.priority.toUpperCase()} PRIORITY
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobile && (
        <MobileNav
          role="teacher"
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

// Mock student data
const mockStudents: Student[] = [
  {
    id: 'student_bc',
    name: 'Beignet Cayenne',
    avgGrade: 78,
    recentTrend: 'down',
    weakAreas: ['subnetting', 'routing'],
    completedActivities: 12,
    lastActive: '2 hours ago',
  },
  {
    id: 'student_js',
    name: 'John Smith',
    avgGrade: 92,
    recentTrend: 'up',
    weakAreas: ['security'],
    completedActivities: 18,
    lastActive: '1 day ago',
  },
  {
    id: 'student_sl',
    name: 'Sarah Lee',
    avgGrade: 65,
    recentTrend: 'down',
    weakAreas: ['vlan', 'switching', 'ospf'],
    completedActivities: 8,
    lastActive: '3 days ago',
  },
  {
    id: 'student_mc',
    name: 'Mike Chen',
    avgGrade: 88,
    recentTrend: 'stable',
    weakAreas: ['acl'],
    completedActivities: 15,
    lastActive: '5 hours ago',
  },
  {
    id: 'student_ew',
    name: 'Emma Wilson',
    avgGrade: 95,
    recentTrend: 'up',
    weakAreas: [],
    completedActivities: 20,
    lastActive: '30 minutes ago',
  },
];

// Mock activities
const mockActivities: Activity[] = [
  {
    id: 'act_001',
    title: 'Introduction to Subnetting',
    description: 'Learn the fundamentals of IP subnetting',
    difficulty: 'Beginner',
    estimatedTime: 45,
    type: 'netacad',
    netacadUrl: 'https://www.netacad.com',
    createdBy: 'teacher_001',
    tags: ['networking', 'subnetting', 'ip-addressing'],
    prerequisites: [],
    points: 100,
    createdAt: new Date(),
  },
  {
    id: 'act_002',
    title: 'VLAN Configuration Lab',
    description: 'Practice creating and configuring VLANs',
    difficulty: 'Intermediate',
    estimatedTime: 60,
    type: 'pka',
    createdBy: 'teacher_001',
    tags: ['vlan', 'switching', 'layer-2'],
    prerequisites: [],
    points: 150,
    createdAt: new Date(),
  },
  {
    id: 'act_003',
    title: 'OSPF Routing Protocol',
    description: 'Configure and troubleshoot OSPF',
    difficulty: 'Advanced',
    estimatedTime: 90,
    type: 'lab',
    createdBy: 'teacher_001',
    tags: ['routing', 'ospf', 'layer-3'],
    prerequisites: [],
    points: 200,
    createdAt: new Date(),
  },
];
