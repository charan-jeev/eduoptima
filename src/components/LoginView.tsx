import { useState } from 'react';
import { GraduationCap, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import type { UserRole } from '../App';

interface LoginViewProps {
  onLogin: (role: UserRole) => void;
  onCreateAccount: () => void;
}

export default function LoginView({ onLogin, onCreateAccount }: LoginViewProps) {
  const [showCredentials, setShowCredentials] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setShowCredentials(true);
  };

  const handleBack = () => {
    setShowCredentials(false);
    setSelectedRole(null);
    setEmail('');
    setPassword('');
    setShowPassword(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email.trim() && password.trim() && selectedRole) {
      onLogin(selectedRole);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex items-center justify-center w-12 h-12 bg-black rounded-xl">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-black">EduOptima</h1>
        </div>

        {!showCredentials ? (
          <>
            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-black mb-2">Welcome to EduOptima</h2>
              <p className="text-gray-600">
                AI-powered grading & learning for Cisco NetAcad
              </p>
            </div>

            {/* Role Selection Buttons */}
            <div className="space-y-4 mb-6">
              <Button
                onClick={() => handleRoleSelect('teacher')}
                className="w-full bg-black hover:bg-gray-800 text-white h-12"
              >
                Login as Teacher
              </Button>
              <Button
                onClick={() => handleRoleSelect('student')}
                variant="outline"
                className="w-full border-2 border-black text-black hover:bg-gray-100 h-12"
              >
                Login as Student
              </Button>
            </div>

            {/* Create Account Section */}
            <div className="mb-8 text-center">
              <p className="text-sm text-gray-600 mb-3">
                Don't have an account?
              </p>
              <Button
                onClick={onCreateAccount}
                variant="outline"
                className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 h-10"
              >
                Create Account
              </Button>
            </div>

            {/* SSO Options */}
            <div className="mb-8">
              <p className="text-center text-gray-500 mb-4 text-sm">
                Sign in with
              </p>
              <div className="flex gap-4 justify-center">
                <a 
                  href="https://mapua.blackboard.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-5 h-5 bg-black rounded"></div>
                  <span className="text-sm text-gray-700">Blackboard</span>
                </a>
                <a 
                  href="https://www.netacad.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-5 h-5 bg-gray-600 rounded"></div>
                  <span className="text-sm text-gray-700">Cisco NetAcad</span>
                </a>
              </div>
            </div>

            {/* Footer Links */}
            <div className="flex gap-4 justify-center text-sm text-gray-500">
              <a href="#" className="hover:text-black transition-colors">
                About Us
              </a>
              <span>|</span>
              <a href="#" className="hover:text-black transition-colors">
                Privacy
              </a>
              <span>|</span>
              <a href="#" className="hover:text-black transition-colors">
                Help
              </a>
              <span>|</span>
              <a href="#" className="hover:text-black transition-colors">
                Terms
              </a>
            </div>
          </>
        ) : (
          <>
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to role selection</span>
            </button>

            {/* Credentials Form */}
            <div className="text-center mb-8">
              <h2 className="text-black mb-2">
                {selectedRole === 'teacher' ? 'Teacher Login' : 'Student Login'}
              </h2>
              <p className="text-gray-600">
                Enter your credentials to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-black">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-300 focus:border-black focus:ring-black"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-black">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-gray-300 focus:border-black focus:ring-black pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white h-12"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-gray-600 hover:text-black transition-colors">
                Forgot password?
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
