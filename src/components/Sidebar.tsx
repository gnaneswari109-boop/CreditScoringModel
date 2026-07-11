import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Calculator,
  BarChart3,
  PieChart,
  History,
  Info,
  CreditCard,
  Github,
} from 'lucide-react';
import { Page } from '@/types';
import { cn } from '@/lib/utils';

interface SidebarProps {
  current: Page;
  onNavigate: (page: Page) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const navItems: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'home', label: 'Home', icon: LayoutDashboard },
  { id: 'predict', label: 'Prediction', icon: Calculator },
  { id: 'performance', label: 'Model Performance', icon: BarChart3 },
  { id: 'analytics', label: 'Analytics', icon: PieChart },
  { id: 'history', label: 'History', icon: History },
  { id: 'about', label: 'About', icon: Info },
];

export function Sidebar({ current, onNavigate, mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-white/5 bg-card/40 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg glow-primary">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              CreditSense <span className="gradient-text">AI</span>
            </h1>
            <p className="text-xs text-muted-foreground">Credit Scoring System</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item, idx) => {
            const active = current === item.id;
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={cn(
                  'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 transition-transform group-hover:scale-110',
                    active && 'text-primary'
                  )}
                />
                {item.label}
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        <div className="border-t border-white/5 px-6 py-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            View on GitHub
          </a>
          <p className="mt-2 text-xs text-muted-foreground/60">
            CodeAlpha ML Internship
          </p>
        </div>
      </aside>
    </>
  );
}
