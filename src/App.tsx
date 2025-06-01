import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import ProtectedLayout from './features/auth/ProtectedLayout';
import AuthCallback from './lib/AuthCallback';

import ContactDetails from './pages/ContactDetails';
import Contacts from './pages/Contacts';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Tags from './pages/Tags';
import Groups from './pages/Groups';
import Companies from './pages/Companies';
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected routes under layout */}
          <Route path="/" element={<ProtectedLayout />}>
            <Route index element={<Homepage />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="contacts/:id" element={<ContactDetails />} />
            <Route path="tags" element={<Tags />} />
            <Route path="Groups" element={<Groups />} />
            <Route path="Companies" element={<Companies />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
