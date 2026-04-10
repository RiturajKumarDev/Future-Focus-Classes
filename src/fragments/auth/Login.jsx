import { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import './login.css';
import { Link, useNavigate } from 'react-router-dom';
import { loginUserToServer } from '../../services/authService';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const user = JSON.parse(Cookies.get("userData") || null);
        if (user) {
            if (user.userType == 'student')
                navigate("/student-dashboard");
            else if (user.userType == 'teacher')
                navigate("/teacher-dashboard");
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length === 0) {
            const response = await loginUserToServer(formData.email, formData.password);
            const data = await response.json();
            if (response.ok) {
                Cookies.set("userData", JSON.stringify(data), { expires: 7 });
                if (data.userType == 'student')
                    navigate("/student-dashboard");
                else if (data.userType == 'teacher')
                    navigate("/teacher-dashboard");
            } else
                alert(`login failed!${data.errors}`);
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <div className="login-container">
            {/* Background Animation */}
            <div className="background-animation">
                <div className="light-effect"></div>
                <div className="light-effect-2"></div>
            </div>

            {/* Main Card */}
            <div className="login-card">
                {/* Logo Section */}
                <div className="logo-section">
                    <div className="logo-icon">
                        <span className="logo-f">F</span>
                        <span className="logo-focus">F</span>
                    </div>
                    <h1 className="logo-title">FUTURE FOCUS</h1>
                    <p className="logo-subtitle">CLASSES</p>
                    <div className="sanskrit-text">तमसो मा ज्योतिर्गमय</div>
                    <p className="mode-text">Online & Offline</p>
                </div>

                {/* Form Section */}
                <div className="form-section">
                    <a href="/">⬅️</a>
                    <div className="form-header">
                        <h2>Welcome Back!</h2>
                        <p>Login to continue your journey</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">
                                <i className="icon-email"></i>
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className={errors.email ? 'error' : ''}
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">
                                <i className="icon-lock"></i>
                                Password
                            </label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className={errors.password ? 'error' : ''}
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>

                        <div className="options-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="forgot-password">Forgot Password?</a>
                        </div>

                        <button type="submit" className="submit-btn">
                            Login <span className="btn-glow"></span>
                        </button>
                    </form>

                    <div className="form-footer">
                        <p>
                            Don't have an account?
                            <Link to="/register"> Sign up</Link>
                        </p>
                    </div>

                    {/* Social Login Options */}
                    <div className="social-login">
                        <p>Or continue with</p>
                        <div className="social-icons">
                            <button className="social-btn google">
                                <span>G</span>
                            </button>
                            <button className="social-btn facebook">
                                <span>f</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
