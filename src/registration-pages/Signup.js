import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Validation from './SignupValidation';
import './LoginStyles.css';

function Signup() {
    const [values, setValues] = useState({
        name: '',
        surname: '',
        user_email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors(Validation(values));

        if (Object.keys(errors).length === 0) {
            try {
                const response = await fetch('http://localhost:3002/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });

                const responseData = await response.json();

                console.log('Server response:', responseData);

                if (response.ok) {
                    console.log('User registered successfully');
                    setSuccess(true);
                    setTimeout(() => {
                        setSuccess(false);
                        window.location.href = '/';
                    }, 3000);
                } else {
                    console.error('Failed to register user:', responseData.message);
                }
            } catch (error) {
                console.error('Error connecting to the server', error);
            }
        }
    };

    const handleInput = (event) => {
        setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    return (
        <div className='main'>
            {success && (
                <div className='notification success-notification'>
                    Your account created
                </div>
            )}
            <div className='full-form'>
                <form action='' onSubmit={handleSubmit}>
                    <div className='line'>
                        <label htmlFor='name' className='line-heading'><strong>Name</strong></label>
                        <input type='text' placeholder='Enter Name' name='name' onChange={handleInput} className='input-field-login' />
                        {errors.name && <span className='text-danger'>{errors.name}</span>}
                    </div>
                    <div className='line'>
                        <label htmlFor='surname' className='line-heading'><strong>Surname</strong></label>
                        <input type='text' placeholder='Enter Surname' name='surname' onChange={handleInput} className='input-field-login' />
                        {errors.surname && <span className='text-danger'>{errors.surname}</span>}
                    </div>
                    <div className='line'>
                        <label htmlFor='email' className='line-heading'><strong>Email</strong></label>
                        <input type='email' placeholder='Enter Email' name='email' onChange={handleInput} className='input-field-login' />
                        {errors.user_email && <span className='text-danger'>{errors.user_email}</span>}
                    </div>
                    <div className='line'>
                        <label htmlFor='password' className='line-heading'><strong>Password</strong></label>
                        <input type='password' placeholder='Enter Password' name='password' onChange={handleInput} className='input-field-login' />
                        {errors.password && <span className='text-danger'>{errors.password}</span>}
                    </div>
                    <button type='submit' className='login-button'>Signup</button>
                    <Link to='/' className='create-account-button have-account'>I already have an account</Link>
                </form>

            </div>
        </div>
    );
}

export default Signup;