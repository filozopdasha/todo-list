import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Styles.css';

function FormPage() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const storedRememberMe = localStorage.getItem("rememberMe") === "true";
        setRememberMe(storedRememberMe);
    }, []);

    const handleLogin = () => {
        const isValidEmail = login === "example@gmail.com";
        const isValidPassword = password === "123456789";

        if (isValidEmail && isValidPassword) {
            localStorage.setItem("rememberMe", rememberMe);
            navigate("/dashboard");
        } else if (!isValidEmail && isValidPassword) {
            alert("Incorrect email");
        } else if (isValidEmail && !isValidPassword) {
            alert("Incorrect password");
        } else {
            alert("Incorrect email and password");
        }
    };

    return (
        <div className='login-container'>
            <h1 className="forecast-name">Kyiv-Mohyla Forecast</h1>
            <form className="form-page-form">
                <i className="heading-text">Login to Web App</i>
                <b className="field-header">E-mail:</b>
                <input className="form-input"
                    type="text"
                    placeholder="example@gmail.com"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                />
                <b className="field-header">Password:</b>
                <input  className="form-input"
                    type="password"
                    placeholder="123456789"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="login-button" onClick={handleLogin}>Login</button>
            </form>
        </div>
    );
}

export default FormPage;
