import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Server,
  Workflow,
  Activity,
  LogOut,
  Cpu,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/accelerators', label: 'Accelerator Pools', icon: Server },
  { path: '/workload', label: 'Workload Orchestration', icon: Workflow },
  { path: '/monitoring', label: 'Monitoring & Alerts', icon: Activity },
];

export function AppSidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden transition-opacity',
          isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        )}
        onClick={() => setIsCollapsed(true)}
      />

      {/* Mobile toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-card border border-border"
      >
        {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-50 transition-all duration-300',
          'lg:relative lg:translate-x-0',
          isCollapsed ? '-translate-x-full lg:w-20' : 'translate-x-0 w-64'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              {!isCollapsed && (
                <div className="animate-fade-in">
                  <h1 className="text-sm font-bold text-foreground leading-tight">
                    Accelerator
                  </h1>
                  <p className="text-xs text-muted-foreground">Orchestration</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    'hover:bg-sidebar-accent group',
                    isActive && 'nav-active bg-sidebar-accent'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5 flex-shrink-0 transition-colors',
                      isActive
                        ? 'text-primary'
                        : 'text-sidebar-foreground group-hover:text-foreground'
                    )}
                  />
                  {!isCollapsed && (
                    <span
                      className={cn(
                        'text-sm font-medium transition-colors animate-fade-in',
                        isActive
                          ? 'text-foreground'
                          : 'text-sidebar-foreground group-hover:text-foreground'
                      )}
                    >
                      {item.label}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Collapse toggle (desktop) */}
          <div className="hidden lg:block p-3 border-t border-sidebar-border">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full hover:bg-sidebar-accent transition-colors text-sidebar-foreground hover:text-foreground"
            >
              <Menu className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium animate-fade-in">
                  Collapse
                </span>
              )}
            </button>
          </div>

          {/* Logout */}
          <div className="p-3 border-t border-sidebar-border">
            <NavLink
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground hover:text-foreground"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium animate-fade-in">
                  Sign Out
                </span>
              )}
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
}
