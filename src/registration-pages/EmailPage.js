import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const EmailPage = () => {
    const [user_email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');

    const handleNext = async () => {
        if (user_email.trim() !== '') {
            console.log('Sending request to server with email:', user_email);
            try {
                const response = await fetch('http://localhost:3002/check-user-existence', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_email: user_email,
                    }),
                });

                const responseData = await response.json();

                console.log('Server response:', responseData);

                if (responseData.user_exists) {
                    setMessage('Email was sent.');
                    setNotificationType('success');
                    setEmail('');
                } else {
                    setMessage('User does not exist. Please enter a valid email address.');
                    setNotificationType('error');
                }
            } catch (error) {
                console.error('Error sending request:', error);
                setMessage('An error occurred. Please try again.');
                setNotificationType('error');
            }
        } else {
            setMessage('Please enter a valid email address.');
            setNotificationType('error');
        }
    };

    return (
        <div className="email-page">
            <div className="main">
                {message && (
                    <div className={`notification ${notificationType === 'success' ? 'success-notification' : 'incorrect-action'}`}>
                        {message}
                    </div>
                )}
                <h1>Email Page</h1>
                <div className="full-form">
                    <div className="line">
                        <label htmlFor="email" className="line-heading">Email:</label>
                        <input
                            className="input-field-login"
                            type="email"
                            id="email"
                            name="email"
                            value={user_email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>
                    <button className="login-button" onClick={handleNext}>Next</button>
                    <Link to="/" className="create-account-button">Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default EmailPage;
