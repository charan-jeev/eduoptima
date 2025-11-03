import { useState } from 'react';
import { GraduationCap, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import type { UserRole } from '../App';

interface CreateAccountViewProps {
  onCreateAccount: (role: UserRole) => void;
  onBack: () => void;
}

export default function CreateAccountView({ onCreateAccount, onBack }: CreateAccountViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setShowForm(true);
  };

  const handleBackToRoleSelection = () => {
    setShowForm(false);
    setSelectedRole(null);
    setFullName('');
    setEmail('');
    setSchool('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (fullName.trim() && email.trim() && school.trim() && password.trim() && password === confirmPassword && selectedRole) {
      // In a real app, you would create the account here
      onCreateAccount(selectedRole);
    } else if (password !== confirmPassword) {
      alert('Passwords do not match');
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

        {!showForm ? (
          <>
            {/* Back Button */}
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to login</span>
            </button>

            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-black mb-2">Create an Account</h2>
              <p className="text-gray-600">
                Select your role to get started
              </p>
            </div>

            {/* Role Selection Buttons */}
            <div className="space-y-4">
              <Button
                onClick={() => handleRoleSelect('teacher')}
                className="w-full bg-black hover:bg-gray-800 text-white h-12"
              >
                Create Account as Teacher
              </Button>
              <Button
                onClick={() => handleRoleSelect('student')}
                variant="outline"
                className="w-full border-2 border-black text-black hover:bg-gray-100 h-12"
              >
                Create Account as Student
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Back Button */}
            <button
              onClick={handleBackToRoleSelection}
              className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to role selection</span>
            </button>

            {/* Form Title */}
            <div className="text-center mb-8">
              <h2 className="text-black mb-2">
                {selectedRole === 'teacher' ? 'Create Teacher Account' : 'Create Student Account'}
              </h2>
              <p className="text-gray-600">
                Fill in the details to create your account
              </p>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-black">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="border-gray-300 focus:border-black focus:ring-black"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-black">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-300 focus:border-black focus:ring-black"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="school" className="text-black">
                  School
                </Label>
                <Input
                  id="school"
                  type="text"
                  placeholder="Enter your school name"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
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
                    placeholder="Create a password"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-black">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-gray-300 focus:border-black focus:ring-black pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                  >
                    {showConfirmPassword ? (
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
                Create Account
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
