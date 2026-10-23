import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './AppLayout';

// Rotas públicas carregadas diretamente para LCP rápido
import { LandingPage } from '../features/landing/LandingPage';
import { LoginPage } from '../features/auth/LoginPage';
import { SignupPage } from '../features/auth/SignupPage';
import { OnboardingPage } from '../features/onboarding/OnboardingPage';

// Rotas sob demanda via React.lazy (Section 5)
const DashboardOverview = lazy(() =>
  import('../features/dashboard/DashboardOverview').then((m) => ({ default: m.DashboardOverview }))
);
const AnswersPage = lazy(() =>
  import('../features/answers/AnswersPage').then((m) => ({ default: m.AnswersPage }))
);
const CompetitorsPage = lazy(() =>
  import('../features/competitors/CompetitorsPage').then((m) => ({ default: m.CompetitorsPage }))
);
const SourcesPage = lazy(() =>
  import('../features/sources/SourcesPage').then((m) => ({ default: m.SourcesPage }))
);
const PresencePage = lazy(() =>
  import('../features/presence/PresencePage').then((m) => ({ default: m.PresencePage }))
);
const PlanPage = lazy(() =>
  import('../features/plan/PlanPage').then((m) => ({ default: m.PlanPage }))
);
const DiagnosticsHistoryPage = lazy(() =>
  import('../features/diagnostics/DiagnosticsHistoryPage').then((m) => ({
    default: m.DiagnosticsHistoryPage,
  }))
);
const ReportsManagementPage = lazy(() =>
  import('../features/reports/ReportsManagementPage').then((m) => ({
    default: m.ReportsManagementPage,
  }))
);
const AccountPage = lazy(() =>
  import('../features/account/AccountPage').then((m) => ({ default: m.AccountPage }))
);
const AdminPage = lazy(() =>
  import('../features/admin/AdminPage').then((m) => ({ default: m.AdminPage }))
);
const PublicReportPage = lazy(() =>
  import('../features/reports/PublicReportPage').then((m) => ({ default: m.PublicReportPage }))
);

const FallbackLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 rounded-full border-2 border-[var(--menta)] border-t-transparent animate-spin" />
  </div>
);

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
    <h1 className="text-4xl font-light text-[var(--texto)]">404</h1>
    <p className="text-sm text-[var(--texto-suave)]">Não encontramos esta página. Volte para o início.</p>
    <a href="/" className="px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs">
      Voltar para o início
    </a>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/entrar" element={<LoginPage />} />
      <Route path="/criar-conta" element={<SignupPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route
        path="/r/:id"
        element={
          <Suspense fallback={<FallbackLoader />}>
            <PublicReportPage />
          </Suspense>
        }
      />

      {/* Rota Administrativa */}
      <Route
        path="/admin"
        element={
          <Suspense fallback={<FallbackLoader />}>
            <AdminPage />
          </Suspense>
        }
      />

      {/* App Logado (com todas as rotas secundárias da seção 15) */}
      <Route path="/app" element={<AppLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<FallbackLoader />}>
              <DashboardOverview />
            </Suspense>
          }
        />
        <Route
          path="analises"
          element={
            <Suspense fallback={<FallbackLoader />}>
              <DiagnosticsHistoryPage />
            </Suspense>
          }
        />
        <Route
          path="respostas"
          element={
            <Suspense fallback={<FallbackLoader />}>
              <AnswersPage />
            </Suspense>
          }
        />
        <Route
          path="concorrentes"
          element={
            <Suspense fallback={<FallbackLoader />}>
              <CompetitorsPage />
            </Suspense>
          }
        />
        <Route
          path="fontes"
          element={
            <Suspense fallback={<FallbackLoader />}>
              <SourcesPage />
            </Suspense>
          }
        />
        <Route
          path="presenca"
          element={
            <Suspense fallback={<FallbackLoader />}>
              <PresencePage />
            </Suspense>
          }
        />
        <Route
          path="plano"
          element={
            <Suspense fallback={<FallbackLoader />}>
              <PlanPage />
            </Suspense>
          }
        />
        <Route
          path="relatorios"
          element={
            <Suspense fallback={<FallbackLoader />}>
              <ReportsManagementPage />
            </Suspense>
          }
        />
        <Route
          path="conta"
          element={
            <Suspense fallback={<FallbackLoader />}>
              <AccountPage />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<FallbackLoader />}>
              <DashboardOverview />
            </Suspense>
          }
        />
      </Route>

      {/* 404 Amigável */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
