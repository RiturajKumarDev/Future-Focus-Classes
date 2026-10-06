import { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import './login.css';
import { Link, useNavigate } from 'react-router-dom';
import { loginUserToServer } from '../../services/authService';
import {
    FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaSignInAlt,
    FaGraduationCap, FaUsers, FaTrophy
} from 'react-icons/fa';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const user = JSON.parse(Cookies.get("userData") || null);
        if (user) {
            if (user.userType === 'student') navigate("/student-dashboard");
            else if (user.userType === 'teacher') navigate("/teacher-dashboard");
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
        if (errors[name]) setErrors({ ...errors, [name]: '' });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Enter a valid email address';
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
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setIsLoading(true);
        try {
            const response = await loginUserToServer(formData.email, formData.password);
            const data = await response.json();
            if (response.ok) {
                Cookies.set("userData", JSON.stringify(data), { expires: formData.rememberMe ? 30 : 7 });
                if (data.userType === 'student') navigate("/student-dashboard");
                else if (data.userType === 'teacher') navigate("/teacher-dashboard");
            } else {
                alert(`Login failed! ${data.errors || data.message || ''}`);
            }
        } catch (err) {
            alert('Something went wrong. Please try again.');
        }
        setIsLoading(false);
    };

    return (
        <div className="login-page">
            {/* Animated Background Glows */}
            <div className="login-bg-glow">
                <div className="glow-1"></div>
                <div className="glow-2"></div>
                <div className="glow-3"></div>
            </div>

            {/* Left Branding Panel */}
            <div className="login-brand-panel">
                <div className="brand-logo">
                    <img src="/future focus classes logo.png" alt="Future Focus Logo" />
                    <div className="brand-logo-text">
                        <div className="brand-name">FUTURE FOCUS</div>
                        <div className="brand-tagline">Classes</div>
                    </div>
                </div>

                <img
                    src="/img/future_focus_banner.png"
                    alt="Future Focus Banner"
                    className="brand-hero-image"
                    onError={(e) => { e.target.style.display = 'none'; }}
                />

                <div className="brand-sanskrit">तमसो मा ज्योतिर्गमय</div>
                <p className="brand-description">
                    Empowering students to achieve their dreams through quality education
                    and expert guidance since 2015.
                </p>

                <div className="brand-stats">
                    <div className="brand-stat">
                        <div className="num">15k+</div>
                        <div className="lbl">Students</div>
                    </div>
                    <div className="brand-stat">
                        <div className="num">120+</div>
                        <div className="lbl">Courses</div>
                    </div>
                    <div className="brand-stat">
                        <div className="num">95%</div>
                        <div className="lbl">Success</div>
                    </div>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="login-form-panel">
                <button type="button" className="back-link" onClick={() => navigate('/')}>
                    <FaArrowLeft /> Back to Home
                </button>

                <div className="login-form-header">
                    <h1>Welcome <span>Back!</span></h1>
                    <p>Login to continue your learning journey</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit} noValidate>
                    {/* Email */}
                    <div className="field-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="field-input-wrapper">
                            <FaEnvelope className="field-icon" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className={errors.email ? 'input-error' : ''}
                                autoComplete="email"
                            />
                        </div>
                        {errors.email && <span className="error-text">⚠ {errors.email}</span>}
                    </div>

                    {/* Password */}
                    <div className="field-group">
                        <label htmlFor="password">Password</label>
                        <div className="field-input-wrapper">
                            <FaLock className="field-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className={errors.password ? 'input-error' : ''}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="toggle-pass-btn"
                                onClick={() => setShowPassword(p => !p)}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && <span className="error-text">⚠ {errors.password}</span>}
                    </div>

                    {/* Options */}
                    <div className="form-options">
                        <label className="remember-label">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                            />
                            <span>Remember me</span>
                        </label>
                        <a href="#" className="forgot-link">Forgot Password?</a>
                    </div>

                    {/* Submit */}
                    <button type="submit" className="login-submit-btn" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : (<><FaSignInAlt /> Sign In</>)}
                    </button>

                    <div className="login-divider">
                        <span>Don't have an account?</span>
                    </div>

                    <p className="register-prompt">
                        New to Future Focus?
                        <Link to="/register">Create an account</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
