import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Login, Signup, TaskPage } from './pages';

const PrivateRoute = ({ children }) => {
  return (localStorage.getItem('user') ? children : <Navigate to="/login" />
  );
};

const AuthRouteWrapper = ({ children }) => {
  return (localStorage.getItem('user') ? <Navigate to="/tasks" /> : children)
};


const App = () => {
  return (
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
  );
};

export default App;