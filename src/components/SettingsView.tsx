import { useState } from 'react';
import {
  LayoutDashboard,
  Brain,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  BookOpen,
  User,
  Lock,
  Shield,
  Camera,
  Calendar as CalendarIcon,
  FileText,
  Plus,
  Code,
  Clock,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import type { UserRole } from '../App';

interface SettingsViewProps {
  userRole: UserRole;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export default function SettingsView({
  userRole,
  onNavigate,
  onLogout,
}: SettingsViewProps) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const handleTwoFactorToggle = (checked: boolean) => {
    setTwoFactorEnabled(checked);
    setShowQRCode(checked);
  };

  const navItems = userRole === 'teacher'
    ? [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, view: 'teacher-dashboard' },
        { id: 'submissions', label: 'Submissions', icon: FileText, view: 'submissions' },
        { id: 'create-activity', label: 'Create Activity', icon: Plus, view: 'create-activity' },
        { id: 'ai-grading', label: 'AI Grading', icon: Brain, view: 'ai-grading' },
        { id: 'feedback', label: 'Feedback', icon: MessageSquare, view: 'teacher-feedback' },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, view: 'analytics' },
        { id: 'calendar', label: 'Calendar', icon: CalendarIcon, view: 'calendar' },
        { id: 'settings', label: 'Settings', icon: Settings, view: 'settings' },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, view: 'student-dashboard' },
        { id: 'courses', label: 'Courses', icon: BookOpen, view: 'courses' },
        { id: 'work-analysis', label: 'Work Analysis', icon: FileText, view: 'work-analysis' },
        { id: 'feedback', label: 'Feedback', icon: MessageSquare, view: 'student-feedback' },
        { id: 'practice', label: 'Practice Lab', icon: Code, view: 'practice-lab' },
        { id: 'calendar', label: 'Calendar', icon: CalendarIcon, view: 'calendar' },
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
                item.id === 'settings'
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
          <h2 className="text-black mb-6">Settings</h2>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6 bg-white border border-gray-200">
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-black data-[state=active]:text-white"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="data-[state=active]:bg-black data-[state=active]:text-white"
              >
                <Lock className="w-4 h-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="data-[state=active]:bg-black data-[state=active]:text-white"
              >
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="bg-white rounded-2xl p-6">
                <h3 className="text-black mb-6">Profile Information</h3>

                {/* Avatar */}
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="bg-black text-white text-2xl">
                      {userRole === 'teacher' ? 'AS' : 'BC'}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="border-black text-black hover:bg-gray-100">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        defaultValue={userRole === 'teacher' ? 'Adam' : 'Beignet'}
                        className="bg-white border-gray-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        defaultValue={userRole === 'teacher' ? 'Solivas' : 'Cayenne'}
                        className="bg-white border-gray-200"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      defaultValue={userRole === 'teacher' ? 'adam.solivas' : 'beignet.c'}
                      className="bg-white border-gray-200"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={
                        userRole === 'teacher'
                          ? 'adam.solivas@university.edu'
                          : 'beignet.cayenne@student.edu'
                      }
                      className="bg-white border-gray-200"
                    />
                  </div>

                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      disabled
                      value={userRole === 'teacher' ? 'Instructor' : 'Student'}
                      className="bg-gray-100 border-gray-200"
                    />
                  </div>

                  <Button className="bg-black hover:bg-gray-800 text-white">
                    Save Changes
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account">
              <div className="bg-white rounded-2xl p-6">
                <h3 className="text-black mb-6">Connected Accounts</h3>

                <div className="space-y-4">
                  {/* Blackboard */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                        <span className="text-white">B</span>
                      </div>
                      <div>
                        <p className="text-black">Blackboard</p>
                        <p className="text-sm text-gray-600">Connected</p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                      Disconnect
                    </Button>
                  </div>

                  {/* Cisco NetAcad */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                        <span className="text-white">C</span>
                      </div>
                      <div>
                        <p className="text-black">Cisco NetAcad</p>
                        <p className="text-sm text-gray-600">Connected</p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                      Disconnect
                    </Button>
                  </div>

                  {/* Add Account */}
                  <div className="flex items-center justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <div>
                      <p className="text-black">Connect Another Account</p>
                      <p className="text-sm text-gray-600">Link additional learning platforms</p>
                    </div>
                    <Button className="bg-black hover:bg-gray-800 text-white">
                      Add Account
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <div className="bg-white rounded-2xl p-6">
                <h3 className="text-black mb-6">Security Settings</h3>

                {/* Two-Factor Authentication */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-black mb-1">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      checked={twoFactorEnabled}
                      onCheckedChange={handleTwoFactorToggle}
                      className="data-[state=checked]:bg-black"
                    />
                  </div>

                  {/* QR Code Section */}
                  {showQRCode && (
                    <div className="bg-gray-50 border border-black rounded-lg p-6 animate-in fade-in slide-in-from-top-2">
                      <h4 className="text-black mb-4">Scan QR Code</h4>
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-48 h-48 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                            <div className="text-center text-gray-400">
                              <Shield className="w-12 h-12 mx-auto mb-2" />
                              <p className="text-sm">QR Code</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700 mb-4">
                            1. Download an authenticator app (Google Authenticator, Authy, etc.)
                          </p>
                          <p className="text-sm text-gray-700 mb-4">
                            2. Scan this QR code with your authenticator app
                          </p>
                          <p className="text-sm text-gray-700 mb-4">
                            3. Enter the 6-digit code from your app to verify
                          </p>
                          <div className="flex gap-2 max-w-xs">
                            <Input
                              placeholder="Enter 6-digit code"
                              className="bg-white border-gray-200"
                              maxLength={6}
                            />
                            <Button className="bg-black hover:bg-gray-800 text-white">
                              Verify
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Password Change */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-black mb-4">Change Password</h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          className="bg-white border-gray-200"
                        />
                      </div>
                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          className="bg-white border-gray-200"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          className="bg-white border-gray-200"
                        />
                      </div>
                      <Button className="bg-black hover:bg-gray-800 text-white">
                        Update Password
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Security Footer */}
                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600 text-center">
                    🔒 EduOptima uses AES-256 encryption & GDPR compliance to protect your data
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
