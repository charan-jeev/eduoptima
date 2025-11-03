import { useState } from 'react';
import LoginView from './components/LoginView';
import CreateAccountView from './components/CreateAccountView';
import TeacherClassSelection from './components/TeacherClassSelection';
import TeacherDashboard from './components/TeacherDashboard';
import TeacherFeedbackView from './components/TeacherFeedbackView';
import AIGradingPanel from './components/AIGradingPanel';
import StudentDashboard from './components/StudentDashboard';
import StudentFeedbackView from './components/StudentFeedbackView';
import CoursesView from './components/CoursesView';
import CourseDetailView from './components/CourseDetailView';
import SettingsView from './components/SettingsView';
import AnalyticsView from './components/AnalyticsView';
import CalendarView from './components/CalendarView';
import SubmissionsView from './components/SubmissionsView';
import CreateActivityView from './components/CreateActivityView';
import PracticeLabView from './components/PracticeLabView';
import DueThisWeekView from './components/DueThisWeekView';
import WorkAnalysisView from './components/WorkAnalysisView';
import ActivitiesView from './components/ActivitiesView';
import AIActivityAssistant from './components/AIActivityAssistant';
import ActivityDetailView from './components/ActivityDetailView';
import TeacherActivitiesLibrary from './components/TeacherActivitiesLibrary';
import CreateCustomActivity from './components/CreateCustomActivity';
import NetAcadImporter from './components/NetAcadImporter';
import StudentTargetingView from './components/StudentTargetingView';

export type UserRole = 'teacher' | 'student' | null;

export default function App() {
  const [currentView, setCurrentView] = useState<string>('login');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    if (role === 'teacher') {
      setCurrentView('teacher-class-selection');
    } else if (role === 'student') {
      setCurrentView('student-dashboard');
    }
  };

  const handleCreateAccount = (role: UserRole) => {
    setUserRole(role);
    if (role === 'teacher') {
      setCurrentView('teacher-class-selection');
    } else if (role === 'student') {
      setCurrentView('student-dashboard');
    }
  };

  const handleNavigateToCreateAccount = () => {
    setCurrentView('create-account');
  };

  const handleBackToLogin = () => {
    setCurrentView('login');
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentView('login');
    setSelectedSubmission(null);
    setSelectedClass(null);
    setSelectedCourse(null);
  };

  const handleSelectClass = (classData: any) => {
    setSelectedClass(classData);
    setCurrentView('teacher-dashboard');
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const handleViewGrading = (submission: any) => {
    setSelectedSubmission(submission);
    setCurrentView('ai-grading');
  };

  const handleSelectCourse = (course: any) => {
    setSelectedCourse(course);
    setCurrentView('course-detail');
  };

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <LoginView onLogin={handleLogin} onCreateAccount={handleNavigateToCreateAccount} />;
      case 'create-account':
        return <CreateAccountView onCreateAccount={handleCreateAccount} onBack={handleBackToLogin} />;
      case 'teacher-class-selection':
        return (
          <TeacherClassSelection
            onSelectClass={handleSelectClass}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );
      case 'teacher-dashboard':
        return (
          <TeacherDashboard
            selectedClass={selectedClass}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            onViewGrading={handleViewGrading}
            onBackToClasses={() => setCurrentView('teacher-class-selection')}
          />
        );
      case 'ai-grading':
        return (
          <AIGradingPanel
            submission={selectedSubmission}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            onBackToClasses={() => setCurrentView('teacher-class-selection')}
          />
        );
      case 'student-dashboard':
        return (
          <StudentDashboard
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case 'courses':
        return (
          <CoursesView
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            onSelectCourse={handleSelectCourse}
          />
        );
      case 'course-detail':
        return (
          <CourseDetailView
            course={selectedCourse}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            onBack={() => setCurrentView('courses')}
          />
        );
      case 'student-feedback':
        return (
          <StudentFeedbackView
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case 'teacher-feedback':
        return (
          <TeacherFeedbackView
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            onBackToClasses={() => setCurrentView('teacher-class-selection')}
          />
        );
      case 'settings':
        return (
          <SettingsView
            userRole={userRole}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case 'analytics':
        return (
          <AnalyticsView
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            onBackToClasses={() => setCurrentView('teacher-class-selection')}
          />
        );
      case 'calendar':
        return (
          <CalendarView
            userRole={userRole}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case 'submissions':
        return (
          <SubmissionsView
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            onViewSubmission={handleViewGrading}
          />
        );
      case 'create-activity':
        return (
          <CreateActivityView
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case 'practice-lab':
        return (
          <PracticeLabView
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case 'due-this-week':
        return (
          <DueThisWeekView
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case 'work-analysis':
        return (
          <WorkAnalysisView
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case 'activities':
        return (
          <ActivitiesView
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case 'ai-activity-assistant':
        return (
          <AIActivityAssistant
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case 'activity-detail':
        return (
          <ActivityDetailView
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case 'teacher-activities':
        return (
          <TeacherActivitiesLibrary
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            onBackToClasses={() => setCurrentView('teacher-class-selection')}
          />
        );
      case 'create-custom-activity':
        return (
          <CreateCustomActivity
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            onBackToClasses={() => setCurrentView('teacher-class-selection')}
          />
        );
      case 'netacad-importer':
        return (
          <NetAcadImporter
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            onBackToClasses={() => setCurrentView('teacher-class-selection')}
          />
        );
      case 'student-targeting':
        return (
          <StudentTargetingView
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            onBackToClasses={() => setCurrentView('teacher-class-selection')}
          />
        );
      default:
        return <LoginView onLogin={handleLogin} />;
    }
  };

  return (
    <div className="size-full bg-background">
      {renderView()}
    </div>
  );
}
