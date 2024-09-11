import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/home/home.tsx';
import { AgentsProvider } from './context/botsContext.tsx';

const App = () => (
        <Router>
            <Routes>
                <Route path="/home" element={
                        <AgentsProvider>
                            <Home />
                        </AgentsProvider>
                } />
                <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
        </Router>
);

export default App;
