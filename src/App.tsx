import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login/login.tsx';
import Home from './pages/home/home.tsx';
import ShareHandler from './pages/share/shareHandler.tsx';
import { AgentsProvider } from './context/botsContext.tsx';
import ProtectedRoute from './components/protectedRoute.tsx';

const App = () => (
    <Router>
        <AgentsProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
                <Route path="/share/:shareId" element={<ShareHandler />} />
                <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
        </AgentsProvider>
    </Router>
);

export default App;
