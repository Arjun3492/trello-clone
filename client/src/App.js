import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Login, Signup, TaskPage } from './pages';

const PrivateRoute = ({ children }) => {
  return (localStorage.getItem('token') ? children : <Navigate to="/login" />
  );
};

const LoginRouteWrapper = ({ children }) => {
  return (localStorage.getItem('token') ? <Navigate to="/tasks" /> : children)
};


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <LoginRouteWrapper>
            <Login />
          </LoginRouteWrapper>} />

        <Route path="/signup" element={<Signup />} />
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