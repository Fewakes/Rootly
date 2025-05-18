import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

import Layout from './layouts/RootLayout';
import AuthCallback from './lib/AuthCallback';
import ContactDetails from './pages/ContactDetails';
import Contacts from './pages/Contacts';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
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
            <Route path="contacts/:id" element={<ContactDetails />} />
            <Route path="groups" element={<NewGroups />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
