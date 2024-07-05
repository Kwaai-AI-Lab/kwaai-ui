import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import Home from './pages/home/home.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { AgentsProvider } from './context/botsContext.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';

const App = () => (
    <AuthProvider>
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={
                    <PrivateRoute>
                        <AgentsProvider>
                            <Home />
                        </AgentsProvider>
                    </PrivateRoute>
                } />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    </AuthProvider>
);

export default App;
