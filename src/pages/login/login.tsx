import React, { useState } from 'react';
import logo from '../../assets/paios.png';
import './login.css';
import { login } from '../../utils/auth.helper';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isRegistering, setIsRegistering] = useState(true);
    const navigate = useNavigate();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault()
        setIsRegistering((prev) => !prev)
        setEmail("")
    }

    const handleUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!email.trim()) {
            toast.error('Email field cannot be empty', { type: 'error' });
            return;
        }

        try {
            console.log('Debug: handleUser:', email, isRegistering);
            await login( email, isRegistering );
            navigate('/home');
        } catch (e) {
            console.error('Debug: Error in handleUser:', e);
            if (e instanceof Error) {
                if (e.name === 'InvalidStateError' || e.message.includes('The authenticator was previously registered')) {
                    toast.error('User already exists. Please login instead.', { type: 'error' });
                } else {
                    toast.error('An error occurred. Please try again.', { type: 'error' });
                }
            } else {
                toast.error('An unexpected error occurred. Please try again.', { type: 'error' });
            }
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    return (
        <div className="auth-container">
            <ToastContainer />
            <h1 className="paios-heading">pAI-OS</h1>
            <img src={logo} alt="pAI-OS Logo" className="logo" />
            <h2>{isRegistering ? "Register" : "Login"}</h2>
            <form onSubmit={handleUser}>
                <input type="email" id="email" placeholder="Email" className="input-field" onChange={handleChange} value={email} />
                <button type="submit" className="auth-button">{isRegistering ? "Register" : "Login"}</button>
            </form>
            <p className="auth-link">{isRegistering ? "Already have an account?" : "Don't have an account?"} <button onClick={handleClick}>{isRegistering ? "Login here" : "Register here"}</button></p>
        </div>
    );
};

export default Login;