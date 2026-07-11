import { motion } from 'framer-motion';
import { Menu, Activity, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
  subtitle: string;
  backendOnline: boolean;
}

export function Header({ onMenuClick, title, subtitle, backendOnline }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-background/60 px-4 py-4 backdrop-blur-xl lg:px-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-bold tracking-tight lg:text-2xl"
          >
            {title}
          </motion.h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge
          variant="outline"
          className={
            backendOnline
              ? 'border-success/30 bg-success/10 text-success'
              : 'border-warning/30 bg-warning/10 text-warning'
          }
        >
          {backendOnline ? (
            <>
              <Activity className="mr-1 h-3 w-3" />
              Backend Online
            </>
          ) : (
            <>
              <Zap className="mr-1 h-3 w-3" />
              Client Mode
            </>
          )}
        </Badge>
      </div>
    </header>
  );
}
