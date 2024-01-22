import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './LoginValidation';
import './LoginStyles.css';

function Login() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [loginMessage, setLoginMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);

        try {
            const response = await fetch('http://localhost:3002/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                }),
            });
            const data = await response.json();
            console.log('Before navigate:', data);
            if (data.success) {
                console.log('Userid:', data.userid);
                navigate('/calendar', { state: { userid: data.user_id } });
            } else {
                console.log('Login failed. Message:', data.message);
                setLoginMessage(data.message);
                setTimeout(() => setLoginMessage(''), 3000);
            }
            console.log('After navigate');
        } catch (error) {
            setLoginMessage('Network error or server is not responding');
            setTimeout(() => setLoginMessage(''), 3000);
        }
    };

    const handleInput = (event) => {
        setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    return (
        <div className="main">
            {loginMessage && (
                <div className="incorrect-action">
                    {loginMessage}
                </div>
            )}
            <div className="full-form">
                <form onSubmit={handleSubmit}>

                    <div className="line">
                        <label htmlFor="email" className="line-heading">
                            <strong>Email</strong>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            name="email"
                            onChange={handleInput}
                            className="input-field-login"
                        />
                        {errors.email && <div className="error-message">{errors.email}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="line-heading">
                            <strong>Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            onChange={handleInput}
                            className="input-field-login"
                        />
                        {errors.password && <div className="error-message">{errors.password}</div>}
                    </div>

                    <button type="submit" className="login-button">
                        Log in
                    </button>
                    <div className="account-actions">
                        <Link to="/signup" className="create-account-button">
                            Create Account
                        </Link>
                        <Link to="/emailpage" className="forgot-password">Forgot Password</Link>
                   </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
