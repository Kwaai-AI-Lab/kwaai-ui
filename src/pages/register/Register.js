import React from 'react';
import { createCredential } from '../../webauthn';
import './Register.css';
import logo from '../../assets/kwaai.png';

const Register = () => {
    const handleRegister = async () => {
        const email = document.getElementById('email').value;
        
        if (!email) {
            alert('Please enter an email address.');
            return;
        }

        try {
            const credential = await createCredential(email);
            console.log('Credential created:', credential);

            const response = await fetch('https://localhost/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: credential.id,
                    rawId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))).replace(/\+/g, '-').replace(/\//g, '_'), // Encode rawId to URL-safe Base64
                    response: {
                        attestationObject: btoa(String.fromCharCode(...new Uint8Array(credential.response.attestationObject))), // Encode to Base64
                        clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(credential.response.clientDataJSON))), // Encode to Base64
                    },
                    type: credential.type,
                    email: email, 
                }),
            });

            if (response.ok) {
                console.log('Registered successfully');
            } else {
                const errorText = await response.text();
                console.error('Registration failed:', errorText);
            }
        } catch (error) {
            console.error('Error creating credential:', error);
        }
    };

    return (
        <div className="auth-container">
            <img src={logo} alt="Kwaai Logo" className="logo" />
            <h1>Register</h1>
            <input type="email" id="email" placeholder="Email" className="input-field" />
            <button onClick={handleRegister} className="auth-button">Register</button>
            <p className="auth-link">Already have an account? <a href="/login">Login here</a></p>
        </div>
    );
};

export default Register;
