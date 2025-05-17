import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Homepage from './pages/Homepage';
import Login from './pages/Login';
import AuthCallback from './lib/AuthCallback';
import Layout from './layouts/RootLayout';
import Contacts from './pages/Contacts';
import NewGroups from './pages/NewGroups';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Login Page */}
          <Route path="/login" element={<Login />} />

          {/* Auth Callback */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected Routes inside Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Homepage />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="groups" element={<NewGroups />} />
            {/* Add more nested protected routes here if needed */}
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
