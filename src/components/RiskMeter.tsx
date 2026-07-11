import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { RiskLevel } from '@/types';

interface RiskMeterProps {
  probability: number;
  riskLevel: RiskLevel;
  approved: boolean;
}

export function RiskMeter({ probability, riskLevel, approved }: RiskMeterProps) {
  const angle = (probability / 100) * 180 - 90;
  const color =
    riskLevel === 'low'
      ? 'hsl(142 71% 45%)'
      : riskLevel === 'medium'
        ? 'hsl(38 92% 50%)'
        : 'hsl(0 72% 51%)';

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-40 w-64">
        <svg viewBox="0 0 200 120" className="h-full w-full">
          <defs>
            <linearGradient id="risk-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(0 72% 51%)" />
              <stop offset="50%" stopColor="hsl(38 92% 50%)" />
              <stop offset="100%" stopColor="hsl(142 71% 45%)" />
            </linearGradient>
          </defs>
          <path
            d="M 20 110 A 80 80 0 0 1 180 110"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <motion.path
            d="M 20 110 A 80 80 0 0 1 180 110"
            fill="none"
            stroke="url(#risk-gradient)"
            strokeWidth="16"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: probability / 100 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
          <motion.g
            initial={{ rotate: -90 }}
            animate={{ rotate: angle }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ transformOrigin: '100px 110px' }}
          >
            <line
              x1="100"
              y1="110"
              x2="100"
              y2="40"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="100" cy="110" r="8" fill={color} />
          </motion.g>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <span
            className="text-3xl font-bold"
            style={{ color }}
          >
            {probability.toFixed(1)}%
          </span>
          <span className="text-xs text-muted-foreground">
            Creditworthiness Score
          </span>
        </div>
      </div>
      <div
        className={cn(
          'mt-2 rounded-full px-4 py-1.5 text-sm font-semibold',
          approved
            ? 'bg-success/10 text-success'
            : 'bg-destructive/10 text-destructive'
        )}
      >
        {approved ? 'CREDITWORTHY - APPROVED' : 'HIGH RISK - REJECTED'}
      </div>
    </div>
  );
}
