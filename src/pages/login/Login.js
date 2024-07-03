import React, { useEffect } from 'react';
import { getCredential } from '../../webauthn';
import './Login.css';
import logo from '../../assets/kwaai.png';

const Login = () => {
    const handleLogin = async () => {
        const email = document.getElementById('email').value;
        if (!email) {
            alert('Please enter an email address.');
            return;
        }

        // Fetch the credentialId from the server using the email
        const response = await fetch(`https://localhost/getCredentialId?email=${encodeURIComponent(email)}`);
        if (!response.ok) {
            console.error('Failed to fetch credentialId');
            alert('User not found');
            return;
        }
        const { credentialId } = await response.json();
        // Ensure the credentialId is URL-safe Base64 encoded
        const base64CredentialId = credentialId.replace(/\+/g, '-').replace(/\//g, '_');

        try {
            const assertion = await getCredential(base64CredentialId); // Ensure credentialId is correctly encoded
            console.log('Assertion:', assertion);

            const loginResponse = await fetch('https://localhost/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email, // Ensure email is included in the request body
                    id: assertion.id,
                    rawId: btoa(String.fromCharCode(...new Uint8Array(assertion.rawId))), // Encode rawId to Base64
                    response: {
                        authenticatorData: btoa(String.fromCharCode(...new Uint8Array(assertion.response.authenticatorData))), // Encode to Base64
                        clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(assertion.response.clientDataJSON))), // Encode to Base64
                        signature: btoa(String.fromCharCode(...new Uint8Array(assertion.response.signature))), // Encode to Base64
                        userHandle: assertion.response.userHandle ? btoa(String.fromCharCode(...new Uint8Array(assertion.response.userHandle))) : null, // Encode to Base64 if not null
                    },
                    type: assertion.type,
                }),
                credentials: 'include' // Ensure cookies are included in the request
            });

            if (loginResponse.ok) {
                console.log('Logged in successfully');
                window.location.href = '/botsList'; // Redirect to botsList page
            } else {
                console.error('Login failed');
                alert('Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert(`Error during login: ${error.message}`);
        }
    };

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                handleLogin();
            }
        };

        document.addEventListener('keypress', handleKeyPress);
        return () => {
            document.removeEventListener('keypress', handleKeyPress);
        };
    }, []);

    return (
        <div className="auth-container">
            <img src={logo} alt="Kwaai Logo" className="logo" />
            <h1>Login</h1>
            <input type="email" id="email" placeholder="Email" className="input-field" />
            <button onClick={handleLogin} className="auth-button">Login with Passkey</button>
            <p className="auth-link">Don't have an account? <a href="/register">Register here</a></p>
        </div>
    );
};

export default Login;
