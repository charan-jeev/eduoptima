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
  Save,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import MobileNav from './MobileNav';
import { Activity, saveActivity } from '../lib/firebase';
import { toast } from 'sonner@2.0.3';

interface CreateCustomActivityProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onBackToClasses: () => void;
}

export default function CreateCustomActivity({
  onNavigate,
  onLogout,
  onBackToClasses,
}: CreateCustomActivityProps) {
  const [activeNav, setActiveNav] = useState('activities');
  const [isMobile, setIsMobile] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [type, setType] = useState<'custom' | 'netacad' | 'pka' | 'quiz' | 'lab'>('custom');
  const [estimatedTime, setEstimatedTime] = useState(30);
  const [points, setPoints] = useState(100);
  const [netacadUrl, setNetacadUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [prerequisites, setPrerequisites] = useState<string[]>([]);

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

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSaveActivity = async () => {
    // Validation
    if (!title.trim()) {
      toast.error('Please enter an activity title');
      return;
    }
    if (!description.trim()) {
      toast.error('Please enter an activity description');
      return;
    }
    if (type === 'netacad' && !netacadUrl.trim()) {
      toast.error('Please enter a NetAcad URL for NetAcad activities');
      return;
    }

    setSaving(true);

    try {
      const activity: Activity = {
        id: `act_${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        difficulty,
        type,
        estimatedTime,
        points,
        netacadUrl: netacadUrl.trim() || undefined,
        tags,
        prerequisites,
        createdBy: 'teacher_001', // In real app, use authenticated teacher ID
        createdAt: new Date(),
      };

      const success = await saveActivity(activity);

      if (success) {
        toast.success('Activity created successfully! ✅');
        // Navigate back to activities library
        setTimeout(() => {
          onNavigate('teacher-activities');
        }, 1000);
      } else {
        toast.error('Failed to create activity. Please try again.');
      }
    } catch (error) {
      console.error('Error creating activity:', error);
      toast.error('An error occurred while creating the activity');
    }

    setSaving(false);
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
              <div>
                <h2 className="text-black">Create Custom Activity</h2>
                <p className="text-gray-600 text-sm">Design a new learning activity for your students</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => onNavigate('teacher-activities')}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveActivity}
                disabled={saving}
                className="bg-black text-white hover:bg-gray-800"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Activity
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Basic Information */}
            <div className="bg-white rounded-2xl p-6 mb-6">
              <h3 className="text-black mb-4">Basic Information</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Activity Title *</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="e.g., Advanced VLAN Configuration"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 border-gray-300"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what students will learn and do in this activity..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="mt-1 border-gray-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <select
                      id="difficulty"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="type">Activity Type</Label>
                    <select
                      id="type"
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="custom">Custom</option>
                      <option value="netacad">NetAcad</option>
                      <option value="pka">Packet Tracer (PKA)</option>
                      <option value="quiz">Quiz</option>
                      <option value="lab">Lab Exercise</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="time">Estimated Time (minutes)</Label>
                    <Input
                      id="time"
                      type="number"
                      min="5"
                      max="300"
                      value={estimatedTime}
                      onChange={(e) => setEstimatedTime(parseInt(e.target.value) || 30)}
                      className="mt-1 border-gray-300"
                    />
                  </div>

                  <div>
                    <Label htmlFor="points">Points</Label>
                    <Input
                      id="points"
                      type="number"
                      min="10"
                      max="500"
                      value={points}
                      onChange={(e) => setPoints(parseInt(e.target.value) || 100)}
                      className="mt-1 border-gray-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* NetAcad Integration */}
            {(type === 'netacad' || netacadUrl) && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <ExternalLink className="w-6 h-6 text-blue-600" />
                  <h3 className="text-black">NetAcad Integration</h3>
                </div>

                <div>
                  <Label htmlFor="netacadUrl">NetAcad URL {type === 'netacad' && '*'}</Label>
                  <Input
                    id="netacadUrl"
                    type="url"
                    placeholder="https://www.netacad.com/courses/..."
                    value={netacadUrl}
                    onChange={(e) => setNetacadUrl(e.target.value)}
                    className="mt-1 border-blue-300"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Link to the corresponding NetAcad course or module
                  </p>
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="bg-white rounded-2xl p-6 mb-6">
              <h3 className="text-black mb-4">Tags & Topics</h3>

              <div>
                <Label htmlFor="tags">Add Tags</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="tags"
                    type="text"
                    placeholder="e.g., routing, switching, security"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="border-gray-300"
                  />
                  <Button
                    onClick={handleAddTag}
                    variant="outline"
                    className="border-black text-black hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag, index) => (
                      <Badge
                        key={index}
                        className="bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white rounded-2xl p-6">
              <h3 className="text-black mb-4">Preview</h3>
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex gap-2 mb-3">
                  <Badge className={
                    difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                    difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {difficulty}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800">
                    {type.toUpperCase()}
                  </Badge>
                </div>
                <h4 className="text-black mb-2">{title || 'Activity Title'}</h4>
                <p className="text-gray-600 text-sm mb-4">
                  {description || 'Activity description will appear here...'}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>⏱️ {estimatedTime} min</span>
                  <span>⭐ {points} pts</span>
                  {tags.length > 0 && <span>🏷️ {tags.length} tags</span>}
                </div>
              </div>
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
