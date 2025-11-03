import { LucideIcon } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  view: string;
}

interface MobileNavProps {
  role: 'teacher' | 'student';
  activeNav: string;
  navItems: NavItem[];
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export default function MobileNav({
  activeNav,
  navItems,
  onNavigate,
}: MobileNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.view)}
              className="flex flex-col items-center gap-1 px-3 py-2 min-w-0"
            >
              <Icon
                className={`w-6 h-6 ${
                  isActive ? 'text-white' : 'text-gray-400'
                }`}
              />
              <span
                className={`text-xs ${
                  isActive ? 'text-white' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="w-8 h-1 bg-white rounded-full mt-1"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
