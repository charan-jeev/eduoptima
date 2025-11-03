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
  ExternalLink,
  Download,
  CheckCircle,
  Search,
  Sparkles,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import MobileNav from './MobileNav';
import { Activity, saveActivity } from '../lib/firebase';
import { toast } from 'sonner@2.0.3';

interface NetAcadImporterProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onBackToClasses: () => void;
}

export default function NetAcadImporter({
  onNavigate,
  onLogout,
  onBackToClasses,
}: NetAcadImporterProps) {
  const [activeNav, setActiveNav] = useState('activities');
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(new Set());
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleToggleActivity = (activityId: string) => {
    const newSelected = new Set(selectedActivities);
    if (newSelected.has(activityId)) {
      newSelected.delete(activityId);
    } else {
      newSelected.add(activityId);
    }
    setSelectedActivities(newSelected);
  };

  const handleImportSelected = async () => {
    if (selectedActivities.size === 0) {
      toast.error('Please select at least one activity to import');
      return;
    }

    setImporting(true);

    try {
      const activitiesToImport = netacadActivities.filter(a => selectedActivities.has(a.id));
      
      for (const activity of activitiesToImport) {
        await saveActivity(activity);
      }

      toast.success(`Successfully imported ${activitiesToImport.length} activities! ✅`);
      
      setTimeout(() => {
        onNavigate('teacher-activities');
      }, 1000);
    } catch (error) {
      console.error('Error importing activities:', error);
      toast.error('Failed to import some activities');
    }

    setImporting(false);
  };

  const getFilteredActivities = () => {
    if (!searchQuery) return netacadActivities;
    
    return netacadActivities.filter(activity =>
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const filteredActivities = getFilteredActivities();

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
                <ExternalLink className="w-8 h-8 text-blue-600" />
                <div>
                  <h2 className="text-black">Import from NetAcad</h2>
                  <p className="text-gray-600 text-sm">Browse and import Cisco NetAcad activities</p>
                </div>
              </div>
            </div>
            <Button
              onClick={handleImportSelected}
              disabled={selectedActivities.size === 0 || importing}
              className="bg-black text-white hover:bg-gray-800"
            >
              {importing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Importing...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Import Selected ({selectedActivities.size})
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <ExternalLink className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-black mb-2">NetAcad Integration</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    Import activities directly from Cisco Networking Academy. All imported activities will
                    maintain links to their original NetAcad resources for seamless student access.
                  </p>
                  <p className="text-gray-600 text-sm">
                    💡 Tip: Use the search bar to find specific topics or courses
                  </p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl p-6 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search NetAcad activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-300"
                />
              </div>
            </div>

            {/* Activities List */}
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className={`bg-white rounded-2xl p-6 border-2 transition-all cursor-pointer ${
                    selectedActivities.has(activity.id)
                      ? 'border-black shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleToggleActivity(activity.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="pt-1">
                      <Checkbox
                        checked={selectedActivities.has(activity.id)}
                        onCheckedChange={() => handleToggleActivity(activity.id)}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge className={
                          activity.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                          activity.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {activity.difficulty}
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800">NetAcad</Badge>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-600">{activity.estimatedTime} min</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-600">{activity.points} pts</span>
                      </div>

                      <h3 className="text-black mb-2">{activity.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{activity.description}</p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {activity.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (activity.netacadUrl) {
                            window.open(activity.netacadUrl, '_blank');
                          }
                        }}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View on NetAcad
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredActivities.length === 0 && (
                <div className="bg-white rounded-2xl p-12 text-center">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-black mb-2">No activities found</h3>
                  <p className="text-gray-600 text-sm">
                    Try adjusting your search query
                  </p>
                </div>
              )}
            </div>
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

// Mock NetAcad activities
const netacadActivities: Activity[] = [
  {
    id: 'netacad_001',
    title: 'CCNA 1: Introduction to Networks - Chapter 1',
    description: 'Explore the network infrastructure, including network components, network representations, and basic network operation',
    difficulty: 'Beginner',
    estimatedTime: 60,
    type: 'netacad',
    netacadUrl: 'https://www.netacad.com/courses/networking/ccna-introduction-networks',
    createdBy: 'netacad',
    tags: ['networking-basics', 'network-infrastructure', 'ccna'],
    prerequisites: [],
    points: 100,
    createdAt: new Date(),
  },
  {
    id: 'netacad_002',
    title: 'CCNA 1: Network Protocols and Communications',
    description: 'Learn about protocols, protocol suites, and the OSI and TCP/IP models',
    difficulty: 'Beginner',
    estimatedTime: 90,
    type: 'netacad',
    netacadUrl: 'https://www.netacad.com/courses/networking/ccna-introduction-networks',
    createdBy: 'netacad',
    tags: ['protocols', 'osi-model', 'tcp-ip', 'ccna'],
    prerequisites: [],
    points: 150,
    createdAt: new Date(),
  },
  {
    id: 'netacad_003',
    title: 'CCNA 2: Routing and Switching Essentials',
    description: 'Configure and troubleshoot routers and switches, resolve common issues with RIPv1, OSPF, and EIGRP',
    difficulty: 'Intermediate',
    estimatedTime: 120,
    type: 'netacad',
    netacadUrl: 'https://www.netacad.com/courses/networking/ccna-routing-switching',
    createdBy: 'netacad',
    tags: ['routing', 'switching', 'ospf', 'eigrp', 'ccna'],
    prerequisites: ['netacad_001'],
    points: 200,
    createdAt: new Date(),
  },
  {
    id: 'netacad_004',
    title: 'CCNA Security: Implementing Network Security',
    description: 'Develop skills needed to design, implement, and support network security',
    difficulty: 'Advanced',
    estimatedTime: 150,
    type: 'netacad',
    netacadUrl: 'https://www.netacad.com/courses/security/ccna-security',
    createdBy: 'netacad',
    tags: ['security', 'firewall', 'vpn', 'acl', 'ccna'],
    prerequisites: ['netacad_002', 'netacad_003'],
    points: 250,
    createdAt: new Date(),
  },
  {
    id: 'netacad_005',
    title: 'IoT Fundamentals: Connecting Things',
    description: 'Introduction to the Internet of Things and how sensors, actuators, and other components connect',
    difficulty: 'Beginner',
    estimatedTime: 75,
    type: 'netacad',
    netacadUrl: 'https://www.netacad.com/courses/iot/iot-fundamentals',
    createdBy: 'netacad',
    tags: ['iot', 'sensors', 'connectivity', 'emerging-tech'],
    prerequisites: [],
    points: 125,
    createdAt: new Date(),
  },
];
