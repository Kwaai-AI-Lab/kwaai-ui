import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/home/home.tsx';
import ShareHandler from './pages/share/shareHandler.tsx';
import { AgentsProvider } from './context/botsContext.tsx';

const App = () => (
    <Router>
        <AgentsProvider>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/share/:shareId" element={<ShareHandler />} />
                <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
        </AgentsProvider>
    </Router>
);

export default App;
