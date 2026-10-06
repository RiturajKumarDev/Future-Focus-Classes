import { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import './login.css';
import './register.css';
import { registerUserToServer } from '../../services/authService';
import {
    FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, 
    FaCalendarAlt, FaMapMarkerAlt, FaGraduationCap, FaArrowLeft, 
    FaCheck, FaArrowRight, FaMapPin, FaCity, FaUserFriends, FaVenusMars,
    FaUserGraduate
} from 'react-icons/fa';

const Register = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const user = JSON.parse(Cookies.get("userData") || "null");
        if (user) {
            if (user.userType === 'student' || user.role === 'student') navigate("/student-dashboard");
            else if (user.userType === 'teacher' || user.role === 'teacher') navigate("/teacher-dashboard");
        }
    }, [navigate]);

    const [formData, setFormData] = useState({
        // Step 1: Account Info
        fullName: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        
        // Step 2: Academic & Personal Info
        classTh: '',
        gender: '',
        dob: '',
        parentName: '',
        parentMobile: '',
        city: '',
        pincode: '',
        address: ''
    });

    const [errors, setErrors] = useState({});

    const grades = [
        'Class 6', 'Class 7', 'Class 8', 'Class 9', 
        'Class 10', 'Class 11 (Science)', 'Class 11 (Commerce)', 
        'Class 12 (Science)', 'Class 12 (Commerce)', 'Dropper / Repeaters'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full Name is required';
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.mobile.trim()) {
            newErrors.mobile = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
            newErrors.mobile = 'Enter a valid 10-digit mobile number';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(formData.password)) {
            newErrors.password = 'Must include uppercase, lowercase, number & special char';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.classTh) newErrors.classTh = 'Please select your class';
        if (!formData.gender) newErrors.gender = 'Please select gender';
        if (!formData.dob) newErrors.dob = 'Date of birth is required';
        
        if (!formData.parentName.trim()) {
            newErrors.parentName = "Parent / Guardian name is required";
        }
        
        if (!formData.parentMobile.trim()) {
            newErrors.parentMobile = "Parent's mobile is required";
        } else if (!/^\d{10}$/.test(formData.parentMobile.trim())) {
            newErrors.parentMobile = "Enter a valid 10-digit number";
        }

        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.pincode.trim()) {
            newErrors.pincode = 'Pincode is required';
        } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
            newErrors.pincode = 'Enter a valid 6-digit pincode';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep1()) {
            setCurrentStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        setCurrentStep(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep2()) return;

        setIsLoading(true);
        try {
            const userPayload = {
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                password: formData.password,
                phone: formData.mobile.trim(),
                mobile: formData.mobile.trim(),
                role: "student",
                userType: "student",
                batch: formData.classTh,
                classTh: formData.classTh,
                gender: formData.gender,
                dob: formData.dob,
                parentName: formData.parentName.trim(),
                parentMobile: formData.parentMobile.trim(),
                city: formData.city.trim(),
                pincode: formData.pincode.trim(),
                address: formData.address.trim()
            };

            const response = await registerUserToServer(userPayload);
            const data = await response.json();

            if (response.ok) {
                navigate("/login", { 
                    state: { 
                        message: "Registration successful! Please login with your credentials." 
                    } 
                });
            } else {
                let errorMessage = "Registration failed. Please try again.";
                if (data.errors) {
                    errorMessage = Array.isArray(data.errors) ? data.errors.join(", ") : data.errors;
                } else if (data.message) {
                    errorMessage = data.message;
                }
                setErrors({ submit: errorMessage });
            }
        } catch (error) {
            setErrors({ submit: "Network error occurred. Please check your connection and try again." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page register-page">
            {/* Animated Background Glows (Exact match to Login) */}
            <div className="login-bg-glow">
                <div className="glow-1"></div>
                <div className="glow-2"></div>
                <div className="glow-3"></div>
            </div>

            {/* Left Branding Panel (Identical design to Login page) */}
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

            {/* Right Form Panel (Styled with Login aesthetic) */}
            <div className="login-form-panel register-panel">
                <button type="button" className="back-link" onClick={() => navigate('/')}>
                    <FaArrowLeft /> Back to Home
                </button>

                <div className="login-form-header">
                    <h1>Student <span>Registration</span></h1>
                    <p>Create your account to start your learning journey</p>
                </div>

                {/* Stepper Tabs */}
                <div className="reg-stepper">
                    <button 
                        type="button"
                        className={`step-btn ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}
                        onClick={() => setCurrentStep(1)}
                    >
                        <span className="step-circle">
                            {currentStep > 1 ? <FaCheck /> : 1}
                        </span>
                        <span className="step-text">Account Details</span>
                    </button>

                    <div className={`step-connector ${currentStep === 2 ? 'active' : ''}`}></div>

                    <button 
                        type="button"
                        className={`step-btn ${currentStep === 2 ? 'active' : ''}`}
                        onClick={() => {
                            if (validateStep1()) setCurrentStep(2);
                        }}
                    >
                        <span className="step-circle">2</span>
                        <span className="step-text">Academic & Personal</span>
                    </button>
                </div>

                {errors.submit && (
                    <div className="reg-submit-error">
                        ⚠ {errors.submit}
                    </div>
                )}

                <form className="login-form reg-form" onSubmit={handleSubmit} noValidate>
                    {/* STEP 1: Account Information */}
                    {currentStep === 1 && (
                        <div className="form-step-container">
                            {/* Full Name */}
                            <div className="field-group">
                                <label htmlFor="fullName">Full Name</label>
                                <div className="field-input-wrapper">
                                    <FaUser className="field-icon" />
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="e.g. Rahul Sharma"
                                        className={errors.fullName ? 'input-error' : ''}
                                        autoComplete="name"
                                    />
                                </div>
                                {errors.fullName && <span className="error-text">⚠ {errors.fullName}</span>}
                            </div>

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
                                        placeholder="student@example.com"
                                        className={errors.email ? 'input-error' : ''}
                                        autoComplete="email"
                                    />
                                </div>
                                {errors.email && <span className="error-text">⚠ {errors.email}</span>}
                            </div>

                            {/* Mobile Number */}
                            <div className="field-group">
                                <label htmlFor="mobile">Mobile Number</label>
                                <div className="field-input-wrapper">
                                    <FaPhone className="field-icon" />
                                    <input
                                        type="tel"
                                        id="mobile"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        placeholder="10-digit mobile number"
                                        maxLength="10"
                                        className={errors.mobile ? 'input-error' : ''}
                                        autoComplete="tel"
                                    />
                                </div>
                                {errors.mobile && <span className="error-text">⚠ {errors.mobile}</span>}
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
                                        placeholder="Create a strong password (min 8 chars)"
                                        className={errors.password ? 'input-error' : ''}
                                        autoComplete="new-password"
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
                                {errors.password ? (
                                    <span className="error-text">⚠ {errors.password}</span>
                                ) : (
                                    <span className="helper-text">Min 8 chars, uppercase, lowercase, number & symbol</span>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="field-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <div className="field-input-wrapper">
                                    <FaLock className="field-icon" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Re-enter your password"
                                        className={errors.confirmPassword ? 'input-error' : ''}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-pass-btn"
                                        onClick={() => setShowConfirmPassword(p => !p)}
                                        aria-label="Toggle password visibility"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <span className="error-text">⚠ {errors.confirmPassword}</span>}
                            </div>

                            {/* Step 1 Next Button */}
                            <button 
                                type="button" 
                                className="login-submit-btn reg-next-btn"
                                onClick={handleNext}
                            >
                                Continue to Academic Details <FaArrowRight />
                            </button>
                        </div>
                    )}

                    {/* STEP 2: Academic & Personal Info */}
                    {currentStep === 2 && (
                        <div className="form-step-container">
                            {/* Class & Gender in 2 cols */}
                            <div className="field-grid-2">
                                <div className="field-group">
                                    <label htmlFor="classTh">Target Class / Course</label>
                                    <div className="field-input-wrapper">
                                        <FaGraduationCap className="field-icon" />
                                        <select
                                            id="classTh"
                                            name="classTh"
                                            value={formData.classTh}
                                            onChange={handleChange}
                                            className={errors.classTh ? 'input-error' : ''}
                                        >
                                            <option value="">Select Class</option>
                                            {grades.map(grade => (
                                                <option key={grade} value={grade}>{grade}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.classTh && <span className="error-text">⚠ {errors.classTh}</span>}
                                </div>

                                <div className="field-group">
                                    <label htmlFor="gender">Gender</label>
                                    <div className="field-input-wrapper">
                                        <FaVenusMars className="field-icon" />
                                        <select
                                            id="gender"
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className={errors.gender ? 'input-error' : ''}
                                        >
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    {errors.gender && <span className="error-text">⚠ {errors.gender}</span>}
                                </div>
                            </div>

                            {/* DOB */}
                            <div className="field-group">
                                <label htmlFor="dob">Date of Birth</label>
                                <div className="field-input-wrapper">
                                    <FaCalendarAlt className="field-icon" />
                                    <input
                                        type="date"
                                        id="dob"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        className={errors.dob ? 'input-error' : ''}
                                    />
                                </div>
                                {errors.dob && <span className="error-text">⚠ {errors.dob}</span>}
                            </div>

                            {/* Parent Info in 2 cols */}
                            <div className="field-grid-2">
                                <div className="field-group">
                                    <label htmlFor="parentName">Parent / Guardian Name</label>
                                    <div className="field-input-wrapper">
                                        <FaUserFriends className="field-icon" />
                                        <input
                                            type="text"
                                            id="parentName"
                                            name="parentName"
                                            value={formData.parentName}
                                            onChange={handleChange}
                                            placeholder="Parent's Name"
                                            className={errors.parentName ? 'input-error' : ''}
                                        />
                                    </div>
                                    {errors.parentName && <span className="error-text">⚠ {errors.parentName}</span>}
                                </div>

                                <div className="field-group">
                                    <label htmlFor="parentMobile">Parent's Mobile</label>
                                    <div className="field-input-wrapper">
                                        <FaPhone className="field-icon" />
                                        <input
                                            type="tel"
                                            id="parentMobile"
                                            name="parentMobile"
                                            value={formData.parentMobile}
                                            onChange={handleChange}
                                            placeholder="10-digit number"
                                            maxLength="10"
                                            className={errors.parentMobile ? 'input-error' : ''}
                                        />
                                    </div>
                                    {errors.parentMobile && <span className="error-text">⚠ {errors.parentMobile}</span>}
                                </div>
                            </div>

                            {/* City & Pincode in 2 cols */}
                            <div className="field-grid-2">
                                <div className="field-group">
                                    <label htmlFor="city">City</label>
                                    <div className="field-input-wrapper">
                                        <FaCity className="field-icon" />
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="Your City"
                                            className={errors.city ? 'input-error' : ''}
                                        />
                                    </div>
                                    {errors.city && <span className="error-text">⚠ {errors.city}</span>}
                                </div>

                                <div className="field-group">
                                    <label htmlFor="pincode">Pincode</label>
                                    <div className="field-input-wrapper">
                                        <FaMapPin className="field-icon" />
                                        <input
                                            type="text"
                                            id="pincode"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            placeholder="6-digit PIN"
                                            maxLength="6"
                                            className={errors.pincode ? 'input-error' : ''}
                                        />
                                    </div>
                                    {errors.pincode && <span className="error-text">⚠ {errors.pincode}</span>}
                                </div>
                            </div>

                            {/* Address (Optional) */}
                            <div className="field-group">
                                <label htmlFor="address">Address (Optional)</label>
                                <div className="field-input-wrapper">
                                    <FaMapMarkerAlt className="field-icon" />
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="House/Street/Area"
                                    />
                                </div>
                            </div>

                            {/* Step 2 Action Buttons */}
                            <div className="reg-actions-row">
                                <button 
                                    type="button" 
                                    className="reg-back-btn"
                                    onClick={handlePrev}
                                >
                                    <FaArrowLeft /> Back
                                </button>
                                <button 
                                    type="submit" 
                                    className="login-submit-btn reg-submit-btn" 
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Creating Account...' : (
                                        <>
                                            <FaUserGraduate /> Complete Registration
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Divider & Login link (Matching Login page) */}
                    <div className="login-divider">
                        <span>Already registered?</span>
                    </div>

                    <p className="register-prompt">
                        Already have an account?
                        <Link to="/login">Sign in here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
