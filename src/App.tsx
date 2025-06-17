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
import ActivityLogPage from './pages/ActivityLog';
import GroupDetails from './pages/GroupDetails';
import TagDetails from './pages/TagDetails';
import CompanyDetails from './pages/CompanyDetails';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/Login" element={<Login />} />
          <Route path="Auth/callback" element={<AuthCallback />} />

          {/* Protected routes under layout */}
          <Route path="/" element={<ProtectedLayout />}>
            <Route index element={<Homepage />} />

            <Route path="/activity-log" element={<ActivityLogPage />} />

            <Route path="Contacts" element={<Contacts />} />
            <Route path="Contacts/:id" element={<ContactDetails />} />
            <Route path="Groups/:id" element={<GroupDetails />} />
            <Route path="Tags/:id" element={<TagDetails />} />
            <Route path="Companies/:id" element={<CompanyDetails />} />

            <Route path="Tags" element={<Tags />} />
            <Route path="Groups" element={<Groups />} />
            <Route path="Companies" element={<Companies />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
