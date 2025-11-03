import { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Settings,
  LogOut,
  Calendar,
  Clock,
  FileText,
  Code,
  Sparkles,
  Send,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import ActivityCard from './ActivityCard';
import MobileNav from './MobileNav';
import { GEMINI_API_KEY, Activity, getAllActivities } from '../lib/firebase';

interface AIActivityAssistantProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  activities?: Activity[];
  timestamp: Date;
}

export default function AIActivityAssistant({
  onNavigate,
  onLogout,
}: AIActivityAssistantProps) {
  const [activeNav, setActiveNav] = useState('activities');
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm your AI Activity Assistant. I can help you find the perfect learning activities based on your interests and goals. Try asking me:\n\n• \"I want to practice subnetting\"\n• \"Show me beginner routing activities\"\n• \"What should I learn after VLANs?\"\n• \"I'm struggling with OSPF\"\n\nWhat would you like to work on today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activities, setActivities] = useState<Activity[]>([]);

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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, view: 'student-dashboard' },
    { id: 'courses', label: 'Courses', icon: BookOpen, view: 'courses' },
    { id: 'activities', label: 'Activities', icon: Sparkles, view: 'activities' },
    { id: 'work-analysis', label: 'Work Analysis', icon: FileText, view: 'work-analysis' },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, view: 'student-feedback' },
    { id: 'practice', label: 'Practice Lab', icon: Code, view: 'practice-lab' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, view: 'calendar' },
    { id: 'due-this-week', label: 'Due This Week', icon: Clock, view: 'due-this-week' },
    { id: 'settings', label: 'Settings', icon: Settings, view: 'settings' },
  ];

  const generateAIResponse = async (userMessage: string): Promise<{ message: string; suggestedActivities: Activity[] }> => {
    try {
      const prompt = `You are an AI assistant for EduOptima, a Cisco networking education platform. A student is asking for activity recommendations.

Student request: "${userMessage}"

Available activities:
${activities.map(a => `- ${a.title} (${a.difficulty}, ${a.type}): ${a.description}`).join('\n')}

Based on the student's request, provide:
1. A helpful, encouraging response (2-3 sentences)
2. List 1-3 activity IDs that best match their needs

Format your response as JSON:
{
  "message": "your helpful response here",
  "activityIds": ["id1", "id2"]
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

      // Try to parse JSON response
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const suggestedActivities = activities.filter(a => 
            parsed.activityIds?.includes(a.id)
          );
          return {
            message: parsed.message,
            suggestedActivities,
          };
        }
      } catch (e) {
        // If JSON parsing fails, use fallback logic
      }

      // Fallback: keyword matching
      const keywords = userMessage.toLowerCase();
      const matchedActivities = activities.filter(a => {
        const searchText = `${a.title} ${a.description} ${a.tags.join(' ')}`.toLowerCase();
        return keywords.split(' ').some(word => word.length > 3 && searchText.includes(word));
      }).slice(0, 3);

      return {
        message: aiResponse.replace(/\{[\s\S]*\}/, '').trim() || 
          "Great question! I've found some activities that might help you. Check out the recommendations below!",
        suggestedActivities: matchedActivities,
      };
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Fallback response with keyword matching
      const keywords = userMessage.toLowerCase();
      const matchedActivities = activities.filter(a => {
        const searchText = `${a.title} ${a.description} ${a.tags.join(' ')}`.toLowerCase();
        return keywords.split(' ').some(word => word.length > 3 && searchText.includes(word));
      }).slice(0, 3);

      return {
        message: "I found some activities that match your interests. These should help you build your skills!",
        suggestedActivities: matchedActivities.length > 0 ? matchedActivities : activities.slice(0, 2),
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const { message, suggestedActivities } = await generateAIResponse(inputValue);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: message,
        activities: suggestedActivities,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble right now. Please try asking about activities in a different way!",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-[#fafafa] overflow-hidden">
      {/* Sidebar - Desktop */}
      {!isMobile && (
        <div className="w-80 bg-black text-white flex flex-col overflow-hidden">
          <div className="p-6 flex items-center gap-3 border-b border-gray-800">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-xl text-black">E</span>
            </div>
            <span className="text-lg">EduOptima</span>
          </div>

          <nav className="p-4 border-b border-gray-800">
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

          <div className="flex-1"></div>

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
        <div className="bg-black text-white px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => onNavigate('activities')}
                variant="ghost"
                className="text-white hover:bg-gray-800 -ml-2"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              <div className="w-px h-8 bg-gray-700"></div>
              <Sparkles className="w-8 h-8" />
              <div>
                <h2 className="text-white">AI Activity Assistant</h2>
                <p className="text-gray-400 text-sm">Get personalized activity recommendations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-auto p-4 md:p-6 bg-[#fafafa]">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-3">
                <div
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-black text-white'
                        : 'bg-white text-black border border-gray-200'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm">AI Assistant</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>

                {/* Suggested Activities */}
                {message.activities && message.activities.length > 0 && (
                  <div className="pl-4">
                    <p className="text-sm text-gray-600 mb-3">Recommended Activities:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {message.activities.map((activity) => (
                        <ActivityCard
                          key={activity.id}
                          activity={activity}
                          onSelect={() => onNavigate('activity-detail')}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-black border border-gray-200 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Ask me about activities... (e.g., 'I want to practice VLANs')"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1 border-gray-300"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-black text-white hover:bg-gray-800"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Tip: Be specific about what you want to learn or practice
            </p>
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

// Mock activities (same as ActivitiesView)
const mockActivities: Activity[] = [
  {
    id: 'act_001',
    title: 'Introduction to Subnetting',
    description: 'Learn the fundamentals of IP subnetting including subnet masks, CIDR notation, and network calculations',
    difficulty: 'Beginner',
    estimatedTime: 45,
    type: 'netacad',
    netacadUrl: 'https://www.netacad.com/courses/networking/ccna-introduction-networks',
    createdBy: 'teacher_001',
    tags: ['networking', 'subnetting', 'ip-addressing'],
    prerequisites: [],
    points: 100,
    createdAt: new Date(),
  },
  {
    id: 'act_002',
    title: 'VLAN Configuration Lab',
    description: 'Practice creating and configuring VLANs on Cisco switches using Packet Tracer',
    difficulty: 'Intermediate',
    estimatedTime: 60,
    type: 'pka',
    createdBy: 'teacher_001',
    tags: ['vlan', 'switching', 'layer-2'],
    prerequisites: ['act_001'],
    points: 150,
    createdAt: new Date(),
  },
  {
    id: 'act_003',
    title: 'OSPF Routing Protocol',
    description: 'Configure and troubleshoot OSPF routing protocol in a multi-area network',
    difficulty: 'Advanced',
    estimatedTime: 90,
    type: 'lab',
    netacadUrl: 'https://www.netacad.com/courses/networking/ccna-routing-switching',
    createdBy: 'teacher_001',
    tags: ['routing', 'ospf', 'layer-3'],
    prerequisites: ['act_001', 'act_002'],
    points: 200,
    createdAt: new Date(),
  },
];
