import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { HomePage } from '@/pages/HomePage';
import { PredictionPage } from '@/pages/PredictionPage';
import { PerformancePage } from '@/pages/PerformancePage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { AboutPage } from '@/pages/AboutPage';
import { Page } from '@/types';
import { checkBackendHealth } from '@/lib/api';

const pageMeta: Record<Page, { title: string; subtitle: string }> = {
  home: { title: 'Dashboard', subtitle: 'Overview of CreditSense AI credit scoring system' },
  predict: { title: 'Credit Prediction', subtitle: 'Assess applicant creditworthiness with AI' },
  performance: { title: 'Model Performance', subtitle: 'ML model evaluation and comparison metrics' },
  analytics: { title: 'Analytics', subtitle: 'Data insights and visualizations' },
  history: { title: 'Prediction History', subtitle: 'Review past credit assessments' },
  about: { title: 'About', subtitle: 'Project information and documentation' },
};

function App() {
  const [page, setPage] = useState<Page>('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);

  useEffect(() => {
    checkBackendHealth().then(setBackendOnline);
    const interval = setInterval(() => {
      checkBackendHealth().then(setBackendOnline);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const meta = pageMeta[page];

  return (
    <div className="min-h-screen bg-background bg-radial-glow">
      <Sidebar
        current={page}
        onNavigate={setPage}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="lg:pl-72">
        <Header
          onMenuClick={() => setMobileOpen(true)}
          title={meta.title}
          subtitle={meta.subtitle}
          backendOnline={backendOnline}
        />
        <main className="p-4 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {page === 'home' && <HomePage onNavigate={setPage} />}
              {page === 'predict' && <PredictionPage onNavigate={setPage} />}
              {page === 'performance' && <PerformancePage />}
              {page === 'analytics' && <AnalyticsPage />}
              {page === 'history' && <HistoryPage />}
              {page === 'about' && <AboutPage />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
