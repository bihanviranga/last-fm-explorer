import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import SearchPage from './pages/SearchPage';
import AlbumOverviewPage from './pages/AlbumOverviewPage';
import AlbumDetailPage from './pages/AlbumDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/artist/:artistName/albums" element={<AlbumOverviewPage />} />
          <Route path="/album/:artistName/:albumName" element={<AlbumDetailPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
