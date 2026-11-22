import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  Inbox,
  BarChart3,
  FolderGit2,
  Lightbulb,
  Grid,
  Bot,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Avatar, AvatarGroup } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Separator } from '../ui/Separator';

const NAV_ITEMS = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/feedback', label: 'Feedback', icon: Inbox },
  { path: '/insights', label: 'Insights', icon: BarChart3 },
  { path: '/themes', label: 'Themes', icon: FolderGit2 },
  { path: '/opportunities', label: 'Opportunities', icon: Lightbulb },
  { path: '/prioritization', label: 'Prioritization', icon: Grid },
] as const;

export function Sidebar({ collapsed, onToggleCollapsed }: { collapsed: boolean; onToggleCollapsed: () => void }) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-white border-r border-secondary-200 transition-all duration-300 flex flex-col',
        collapsed ? 'w-20' : 'w-72'
      )}
      aria-label="Main navigation"
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-secondary-200">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <span className="font-semibold text-secondary-900">VoC Copilot</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn('h-8 w-8', collapsed && 'mx-auto')}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Navigation">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive: active }) => cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                active
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.label : undefined}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-primary-600')} aria-hidden="true" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <Separator className="mx-3" />

      <div className={cn('p-3', collapsed && 'hidden')}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-secondary-500 uppercase tracking-wider">AI Assistant</span>
        </div>
        <NavLink
          to="/assistant"
          className={({ isActive }) => cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            isActive
              ? 'bg-primary-50 text-primary-700'
              : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
          )}
        >
          <Bot className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <span>Chat Assistant</span>
        </NavLink>
      </div>

      <div className={cn('p-3 border-t border-secondary-200', collapsed && 'hidden')}>
        <div className="flex items-center gap-3">
          <AvatarGroup max={3} className="flex-1">
            <Avatar fallback="SC" size="sm" />
            <Avatar fallback="MJ" size="sm" />
            <Avatar fallback="ER" size="sm" />
          </AvatarGroup>
          <Badge variant="outline" size="sm">15 users</Badge>
        </div>
        <p className="text-xs text-secondary-500 mt-2">Demo data — 15 synthetic customers</p>
      </div>
    </aside>
  );
}