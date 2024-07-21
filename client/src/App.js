import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Login, Signup, TaskPage } from './pages';
import { AuthProvider, useAuth } from './provider/authProvider';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return (user ? children : <Navigate to="/login" />
  );
};

const AuthRouteWrapper = ({ children }) => {
  const { user } = useAuth();
  return (user ? <Navigate to="/tasks" /> : children)
};


const App = () => {
  return (
    <AuthProvider>

      <Router>
        <Routes>
          <Route path="/login" element={
            <AuthRouteWrapper>
              <Login />
            </AuthRouteWrapper>} />

          <Route path="/signup" element={
            <AuthRouteWrapper>
              <Signup />
            </AuthRouteWrapper>} />

          <Route exact path='/tasks' element={<PrivateRoute >
            <TaskPage />
          </PrivateRoute>}>
          </Route>
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router >
    </AuthProvider>
  );
};

export default App;