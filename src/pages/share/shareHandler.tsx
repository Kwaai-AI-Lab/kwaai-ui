import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DotLoader } from 'react-spinners';
import { useAgents } from '../../context/botsContext';
import AssistantsService from '../../services/assistants.service';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ShareHandler.css';

function ShareHandler() {
    const { shareId } = useParams();
    const [loading, setLoading] = useState(true);
    const { setAgentViewType } = useAgents();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const userId = localStorage.getItem('userId');
                await AssistantsService.updateShareAssistant(shareId, userId);
                toast.success('Shared Assistant added successfully');
            } catch (error) {
                setLoading(false);
                toast.error('Error adding shared assistant');
            } finally {
                setTimeout(() => {
                    setLoading(false);
                    navigate('/home');
                }, 3000);
            }
        };
        fetchData();
    }, [shareId, setAgentViewType, navigate]);

    return (
        <div className="centered-container">
            <ToastContainer />
            <h1 className="centered-title">Adding your new shared assistant</h1>
            <p className="centered-text">Share ID: {shareId}</p>
            {loading ? <DotLoader color="#5967F1" size={60} /> : null}
        </div>
    );
}

export default ShareHandler;
