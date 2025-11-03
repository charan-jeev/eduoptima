import { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Settings,
  LogOut,
  Search,
  Reply,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  Calendar,
  Code,
  FileText,
  Paperclip,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import MobileNav from './MobileNav';
import { toast } from 'sonner@2.0.3';

interface StudentFeedbackViewProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

const feedbackThreads = [
  {
    id: 1,
    subject: 'Lab Subnetting PT - Feedback',
    course: 'CCNA1',
    unread: true,
    lastUpdate: '2 hours ago',
    messages: [
      {
        id: 1,
        from: 'Adam Solivas',
        role: 'Instructor',
        timestamp: '2 hours ago',
        content: `Hi Beignet,

I've reviewed your Subnetting PT lab submission. You scored 78% overall. Here's my detailed feedback:

**What you did well:**
- Correct subnet calculations for the first three networks
- Proper VLSM implementation
- Clean router configuration syntax

**Areas for improvement:**
- VLAN 20 was not assigned to switch port Fa0/3
- Router interface Gig0/1 has incorrect subnet mask
- Missing default gateway configuration on PC3

Please review the recommended lessons I've added to your learning plan and retry the lab. Let me know if you have any questions!

Best regards,
Adam`,
        hasResponse: true,
      },
      {
        id: 2,
        from: 'Beignet Cayenne',
        role: 'Student',
        timestamp: '1 hour ago',
        content: `Hi Professor Solivas,

Thank you for the detailed feedback! I have a question about the VLAN configuration - should I use "switchport mode access" before assigning the VLAN, or does the order not matter?

Also, could you clarify what subnet mask I should be using for Gig0/1? I thought I had /24 configured correctly.

Thanks,
Beignet`,
        hasResponse: false,
      },
    ],
  },
  {
    id: 2,
    subject: 'VLAN Configuration - Great Work!',
    course: 'CCNA1',
    unread: false,
    lastUpdate: '1 day ago',
    messages: [
      {
        id: 3,
        from: 'Adam Solivas',
        role: 'Instructor',
        timestamp: '1 day ago',
        content: `Excellent work on the VLAN Configuration lab, Beignet!

You scored 85% and demonstrated strong understanding of:
- Inter-VLAN routing concepts
- Trunk port configuration
- VLAN database management

Keep up the great work!

Best,
Adam`,
        hasResponse: true,
      },
      {
        id: 4,
        from: 'Beignet Cayenne',
        role: 'Student',
        timestamp: '1 day ago',
        content: `Thank you, Professor! I really appreciate the feedback.`,
        hasResponse: false,
      },
    ],
  },
  {
    id: 3,
    subject: 'Router Setup PT - Follow-up Needed',
    course: 'CCNA1',
    unread: false,
    lastUpdate: '3 days ago',
    messages: [
      {
        id: 5,
        from: 'Adam Solivas',
        role: 'Instructor',
        timestamp: '3 days ago',
        content: `Hi Beignet,

Your Router Setup lab shows good progress (92%), but I noticed you're using deprecated commands in a few places. Please review the updated Cisco IOS syntax guide I've shared.

Let me know if you need clarification!

Adam`,
        hasResponse: false,
      },
    ],
  },
];

export default function StudentFeedbackView({ onNavigate, onLogout }: StudentFeedbackViewProps) {
  const [threads, setThreads] = useState(feedbackThreads);
  const [selectedThread, setSelectedThread] = useState<any>(threads[0]);
  const [replyMessage, setReplyMessage] = useState('');
  const [activeNav, setActiveNav] = useState('feedback');
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const handleSendReply = () => {
    if (!replyMessage.trim() && attachedFiles.length === 0) return;
    
    // Create new message
    const newMessage = {
      id: selectedThread.messages.length + 1,
      from: 'Beignet Cayenne',
      role: 'Student',
      timestamp: 'Just now',
      content: replyMessage,
      hasResponse: false,
      attachments: attachedFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
    };

    // Update threads with new message
    const updatedThreads = threads.map(thread => {
      if (thread.id === selectedThread.id) {
        return {
          ...thread,
          messages: [...thread.messages, newMessage],
          lastUpdate: 'Just now',
        };
      }
      return thread;
    });

    setThreads(updatedThreads);
    
    // Update selected thread
    const updatedSelectedThread = updatedThreads.find(t => t.id === selectedThread.id);
    setSelectedThread(updatedSelectedThread);
    
    toast.success('Reply sent successfully! ✅');
    setReplyMessage('');
    setAttachedFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  useState(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

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
      <div className="flex-1 flex overflow-hidden">
        {/* Feedback List */}
        <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-black mb-4">Feedback</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search feedback..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {threads.map((thread) => (
              <div
                key={thread.id}
                onClick={() => setSelectedThread(thread)}
                className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
                  selectedThread?.id === thread.id ? 'bg-gray-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-black text-sm flex-1 pr-2">{thread.subject}</h4>
                  {thread.unread && (
                    <div className="w-2 h-2 bg-black rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                    {thread.course}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500">{thread.lastUpdate}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 flex flex-col bg-white hidden md:flex">
          {selectedThread ? (
            <>
              {/* Thread Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-black text-white">{selectedThread.course}</Badge>
                </div>
                <h2 className="text-black">{selectedThread.subject}</h2>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-auto p-6 space-y-6">
                {selectedThread.messages.map((message: any) => (
                  <div key={message.id} className="flex gap-4">
                    <Avatar className="flex-shrink-0">
                      <AvatarFallback className="bg-black text-white">
                        {message.role === 'Instructor' ? 'AS' : 'BC'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-black">{message.from}</h4>
                        <Badge
                          variant="outline"
                          className="text-xs border-gray-300 text-gray-600"
                        >
                          {message.role}
                        </Badge>
                        <span className="text-xs text-gray-500 ml-auto">{message.timestamp}</span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line text-sm">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-start gap-4">
                  <Avatar className="flex-shrink-0">
                    <AvatarFallback className="bg-black text-white">BC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Write your reply..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      className="min-h-[100px] bg-gray-50 border-gray-200 mb-3"
                    />
                    
                    {/* Attached Files */}
                    {attachedFiles.length > 0 && (
                      <div className="mb-3 space-y-2">
                        {attachedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3"
                          >
                            <div className="flex items-center gap-2">
                              {file.type.startsWith('image/') ? (
                                <ImageIcon className="w-4 h-4 text-gray-600" />
                              ) : (
                                <Paperclip className="w-4 h-4 text-gray-600" />
                              )}
                              <div>
                                <p className="text-sm text-black">{file.name}</p>
                                <p className="text-xs text-gray-600">
                                  {(file.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            </div>
                            <Button
                              onClick={() => removeFile(index)}
                              variant="ghost"
                              size="sm"
                              className="text-gray-600 hover:text-black"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={handleSendReply}
                        className="bg-black hover:bg-gray-800 text-white"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Reply
                      </Button>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileChange}
                          accept="image/*,.pdf,.doc,.docx,.pka"
                        />
                        <Button
                          variant="outline"
                          className="border-gray-300 text-gray-700"
                          asChild
                        >
                          <span>
                            <Paperclip className="w-4 h-4 mr-2" />
                            Attach File
                          </span>
                        </Button>
                      </label>
                      <Button variant="outline" className="border-gray-300 text-gray-700">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Select a feedback thread to view messages</p>
              </div>
            </div>
          )}
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
