import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardLayout from './pages/DashboardLayout';
import AllPosts from './pages/AllPosts';
import AddNew from './pages/AddNew';
import EditPost from './pages/EditPost';
import Preview from './pages/Preview';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<AllPosts />} />
            <Route path="add-new" element={<AddNew />} />
            <Route path="edit/:id" element={<EditPost />} />
            <Route path="preview" element={<Preview />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
