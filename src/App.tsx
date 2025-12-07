import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy load pages for code splitting
const SearchPage = lazy(() => import('./pages/SearchPage'));
const AlbumOverviewPage = lazy(() => import('./pages/AlbumOverviewPage'));
const AlbumDetailPage = lazy(() => import('./pages/AlbumDetailPage'));

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<SearchPage />} />
              <Route path="/artist/:artistName/albums" element={<AlbumOverviewPage />} />
              <Route path="/album/:artistName/:albumName" element={<AlbumDetailPage />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
