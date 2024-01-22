import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const PasswordPage = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userId, setUserId] = useState('');

    const location = useLocation();

    useEffect(() => {
        const pathSegments = location.pathname.split('/');
        const userId = pathSegments[pathSegments.length - 1];
        setUserId(userId);
    }, [location.search]);

    const handleConfirm = async () => {
        if (newPassword === confirmPassword) {
            try {
                const response = await fetch('http://localhost:3002/update-password', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        new_password: newPassword,
                    }),
                });

                const responseData = await response.json();
                console.log('Response Data:', responseData);

                if (response.ok) {
                    console.log('Password updated successfully');
                    window.location.href = '/';
                } else {
                    console.error('Failed to update password:', responseData.message);
                    alert('Failed to update password. Please try again.');
                }
            } catch (error) {
                console.error('Error connecting to the server', error);
                alert('Error connecting to the server. Please try again.');
            }
        } else {
            alert('Passwords do not match. Please try again.');
        }
    };



    return (
        <div className="password-page">
            <div className="main">
                <h1>Password Page</h1>
                <div className="full-form">
                    <div className="line">
                        <label htmlFor="newPassword" className="line-heading">Enter New Password:</label>
                        <input
                            className="input-field-login"
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                        />
                    </div>
                    <div className="line">
                        <label htmlFor="confirmPassword" className="line-heading">Confirm New Password:</label>
                        <input
                            className="input-field-login"
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                        />
                    </div>
                    <button onClick={handleConfirm} className="login-button">Confirm</button>
                    <Link to="/" className="create-account-button">Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default PasswordPage;
