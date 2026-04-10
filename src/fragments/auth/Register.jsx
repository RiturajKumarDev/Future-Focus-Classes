import { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import './register.css';
import { registerUserToServer } from '../../services/authService';

const Register = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState('student'); // 'student' or 'teacher'
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const user = JSON.parse(Cookies.get("userData") || null);
        if (user) {
            if (user.userType == 'student')
                navigate("/student-dashboard");
            else if (user.userType == 'teacher')
                navigate("/teacher-dashboard");
        }
    }, []);
    // Common form data
    const [formData, setFormData] = useState({
        // Common fields
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        city: '',
        pincode: '',

        // Student specific fields
        studentId: '',
        grade: '',
        parentName: '',
        parentPhone: '',

        // Teacher specific fields
        teacherId: '',
        qualification: '',
        specialization: '',
        experience: '',
        resume: null,
        teachingSubjects: [],
        availableDays: [],
        bio: '',

        // Common terms
        termsAccepted: false
    });

    const [errors, setErrors] = useState({});

    // Options for selects
    const grades = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'College'];

    const subjects = {
        student: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Computer Science', 'Physics', 'Chemistry', 'Biology', 'Commerce', 'Arts'],
        teacher: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'History', 'Geography', 'Computer Science', 'Economics', 'Accountancy', 'Business Studies', 'Psychology', 'Physical Education']
    };

    const qualifications = ['B.Sc', 'M.Sc', 'B.Ed', 'M.Ed', 'B.Tech', 'M.Tech', 'Ph.D', 'Diploma', 'Other'];
    const experience = ['Fresher', '1-2 years', '3-5 years', '6-10 years', '10+ years'];

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'file') {
            setFormData({ ...formData, [name]: files[0] });
        } else if (type === 'checkbox') {
            if (name === 'subjects' || name === 'teachingSubjects' || name === 'availableDays' || name === 'teachingMode' || name === 'goals') {
                let updatedArray = [...formData[name]];
                if (checked) {
                    updatedArray.push(value);
                } else {
                    updatedArray = updatedArray.filter(item => item !== value);
                }
                setFormData({ ...formData, [name]: updatedArray });
            } else {
                setFormData({ ...formData, [name]: checked });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }

        // Clear error for this field
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateStep1 = () => {
        const newErrors = {};

        if (!formData.fullName) newErrors.fullName = 'Full name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';

        if (!formData.phone) newErrors.phone = 'Phone number is required';
        else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Valid 10-digit phone required';

        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        else if (!/(?=.*[A-Z])(?=.*[0-9])/.test(formData.password)) {
            newErrors.password = 'Password must contain 1 uppercase & 1 number';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';

        return newErrors;
    };

    const validateStudentStep2 = () => {
        const newErrors = {};
        if (!formData.grade) newErrors.grade = 'Grade is required';
        return newErrors;
    };

    const validateTeacherStep2 = () => {
        const newErrors = {};
        if (!formData.qualification) newErrors.qualification = 'Qualification is required';
        if (!formData.specialization) newErrors.specialization = 'Specialization is required';
        if (!formData.experience) newErrors.experience = 'Experience is required';
        if (formData.teachingSubjects.length === 0) newErrors.teachingSubjects = 'Select at least one teaching subject';
        if (!formData.bio) newErrors.bio = 'Please introduce yourself';
        return newErrors;
    };

    const handleNext = () => {
        const step1Errors = validateStep1();
        if (Object.keys(step1Errors).length === 0) {
            setCurrentStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setErrors(step1Errors);
        }
    };

    const handlePrevious = () => {
        setCurrentStep(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const sendOTP = async () => {
        if (!formData.phone) {
            setErrors({ ...errors, phone: 'Phone number required for verification' });
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setOtpSent(true);
            alert(`OTP sent to ${formData.phone}\nDemo OTP: 123456`);
        }, 1500);
    };

    const verifyOTP = () => {
        if (otp === '123456') {
            alert('Phone verified successfully!');
            return true;
        } else {
            alert('Invalid OTP. Please try again.');
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate based on user type
        const step2Errors = userType === 'student' ? validateStudentStep2() : validateTeacherStep2();

        if (Object.keys(step2Errors).length > 0) {
            setErrors(step2Errors);
            return;
        }

        if (!formData.termsAccepted) {
            alert('Please accept the terms and conditions');
            return;
        }


        if (!otpSent) {
            await sendOTP();
            return;
        }

        if (!verifyOTP()) return;

        const user = {
            userType: userType,
            fullName: formData.fullName,
            email: formData.email,
            mobile: formData.phone,
            dob: formData.dateOfBirth,
            gender: formData.gender,
            password: formData.password,
            confirmPassword: formData.confirmPassword,

            classTh: formData.grade,
            parentName: formData.parentName,
            parentMobile: formData.parentPhone,

            qualification: formData.qualification,
            experience: formData.experience,
            specialization: formData.specialization,
            teachingSubjects: formData.teachingSubjects,
            resume: formData.resume,

            city: formData.city,
            pincode: formData.pincode,
            address: formData.address,
        }

        setIsLoading(true);
        const response = await registerUserToServer(user);
        setIsLoading(false);
        if (response.ok) {
            alert(`Registration successful! Welcome to Future Focus Classes as a ${userType === 'student' ? 'Student' : 'Teacher'}!`);
            navigate("/login");
        } else {
            const data = await response.json();
            alert(`Registration failed!${data.errors}`);
        }
    };

    const toggleUserType = (type) => {
        setUserType(type);
        setCurrentStep(1);
        setErrors({});
        setOtpSent(false);
        setOtp('');
        // Reset form data for specific fields
        setFormData({
            ...formData,
            studentId: '',
            grade: '',
            parentName: '',
            parentPhone: '',
            teacherId: '',
            qualification: '',
            specialization: '',
            experience: '',
            resume: null,
            teachingSubjects: [],
            bio: '',
        });
    };

    return (
        <div className="dual-register-container">
            <div className="background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <div className="register-wrapper">
                {/* Header */}
                <div className="register-header">
                    <div className="logo">
                        <div className="logo-icon">FF</div>
                        <div className="logo-text">
                            <h1>FUTURE FOCUS</h1>
                            <p>CLASSES</p>
                        </div>
                    </div>
                    <div className="motto">
                        <p>तमसो मा ज्योतिर्गमय</p>
                        <small>Lead me from darkness to light</small>
                    </div>
                </div>

                {/* User Type Toggle */}
                <div className="user-type-toggle">
                    <button
                        className={`toggle-option ${userType === 'student' ? 'active' : ''}`}
                        onClick={() => toggleUserType('student')}
                    >
                        <span className="toggle-icon">🎓</span>
                        <span className="toggle-label">Student Registration</span>
                    </button>
                    <button
                        className={`toggle-option ${userType === 'teacher' ? 'active' : ''}`}
                        onClick={() => toggleUserType('teacher')}
                    >
                        <span className="toggle-icon">👨‍🏫</span>
                        <span className="toggle-label">Teacher Registration</span>
                    </button>
                </div>

                {/* Progress Steps */}
                <div className="progress-steps">
                    <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                        <div className="step-circle">1</div>
                        <div className="step-text">Basic Info</div>
                    </div>
                    <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`}></div>
                    <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                        <div className="step-circle">2</div>
                        <div className="step-text">
                            {userType === 'student' ? 'Academic Details' : 'Professional Details'}
                        </div>
                    </div>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="register-form">
                    {/* Step 1: Common Basic Information */}
                    {currentStep === 1 && (
                        <div className="form-step fade-in">
                            <a href="/">⬅️</a>
                            <h2>Create Your Account</h2>
                            <p className="subtitle">Enter your basic information to get started</p>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Full Name *</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        className={errors.fullName ? 'error' : ''}
                                    />
                                    {errors.fullName && <span className="error">{errors.fullName}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        className={errors.email ? 'error' : ''}
                                    />
                                    {errors.email && <span className="error">{errors.email}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="10-digit mobile number"
                                        className={errors.phone ? 'error' : ''}
                                    />
                                    {errors.phone && <span className="error">{errors.phone}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Date of Birth *</label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        className={errors.dateOfBirth ? 'error' : ''}
                                    />
                                    {errors.dateOfBirth && <span className="error">{errors.dateOfBirth}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Gender *</label>
                                    <div className="radio-group">
                                        <label>
                                            <input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} />
                                            Male
                                        </label>
                                        <label>
                                            <input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} />
                                            Female
                                        </label>
                                        <label>
                                            <input type="radio" name="gender" value="other" checked={formData.gender === 'other'} onChange={handleChange} />
                                            Other
                                        </label>
                                    </div>
                                    {errors.gender && <span className="error">{errors.gender}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Password *</label>
                                    <div className="password-wrapper">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Create password"
                                            className={errors.password ? 'error' : ''}
                                        />
                                        <button type="button" className="toggle-pwd" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? '🙈' : '👁️'}
                                        </button>
                                    </div>
                                    {errors.password && <span className="error">{errors.password}</span>}
                                    <small>Min 6 chars, 1 uppercase & 1 number</small>
                                </div>

                                <div className="form-group">
                                    <label>Confirm Password *</label>
                                    <div className="password-wrapper">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm password"
                                            className={errors.confirmPassword ? 'error' : ''}
                                        />
                                        <button type="button" className="toggle-pwd" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {showConfirmPassword ? '🙈' : '👁️'}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                                </div>
                            </div>

                            <div className="form-navigation">
                                <button type="button" className="btn-next" onClick={handleNext}>
                                    Next Step →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Role-specific Details */}
                    {currentStep === 2 && (
                        <div className="form-step fade-in">
                            <h2>{userType === 'student' ? 'Academic Information' : 'Professional Information'}</h2>
                            <p className="subtitle">
                                {userType === 'student'
                                    ? 'Tell us about your educational background'
                                    : 'Share your teaching experience and qualifications'}
                            </p>

                            {/* Student Fields */}
                            {userType === 'student' && (
                                <div className="role-fields">
                                    <div className="form-grid">

                                        <div className="form-group">
                                            <label>Current Grade/Class *</label>
                                            <select name="grade" value={formData.grade} onChange={handleChange} className={errors.grade ? 'error' : ''}>
                                                <option value="">Select Grade</option>
                                                {grades.map(grade => <option key={grade} value={grade}>{grade}</option>)}
                                            </select>
                                            {errors.grade && <span className="error">{errors.grade}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label>Parent/Guardian Name</label>
                                            <input
                                                type="text"
                                                name="parentName"
                                                value={formData.parentName}
                                                onChange={handleChange}
                                                placeholder="Parent's full name"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Parent Contact</label>
                                            <input
                                                type="tel"
                                                name="parentPhone"
                                                value={formData.parentPhone}
                                                onChange={handleChange}
                                                placeholder="Parent's phone number"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Teacher Fields */}
                            {userType === 'teacher' && (
                                <div className="role-fields">
                                    <div className="form-grid">

                                        <div className="form-group">
                                            <label>Highest Qualification *</label>
                                            <select name="qualification" value={formData.qualification} onChange={handleChange} className={errors.qualification ? 'error' : ''}>
                                                <option value="">Select Qualification</option>
                                                {qualifications.map(qual => <option key={qual} value={qual}>{qual}</option>)}
                                            </select>
                                            {errors.qualification && <span className="error">{errors.qualification}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label>Specialization *</label>
                                            <input
                                                type="text"
                                                name="specialization"
                                                value={formData.specialization}
                                                onChange={handleChange}
                                                placeholder="e.g., Mathematics, Physics, English"
                                                className={errors.specialization ? 'error' : ''}
                                            />
                                            {errors.specialization && <span className="error">{errors.specialization}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label>Teaching Experience *</label>
                                            <select name="experience" value={formData.experience} onChange={handleChange} className={errors.experience ? 'error' : ''}>
                                                <option value="">Select Experience</option>
                                                {experience.map(exp => <option key={exp} value={exp}>{exp}</option>)}
                                            </select>
                                            {errors.experience && <span className="error">{errors.experience}</span>}
                                        </div>

                                        <div className="form-group full-width">
                                            <label>Subjects You Can Teach *</label>
                                            <div className="checkbox-grid">
                                                {subjects.teacher.map(subject => (
                                                    <label key={subject} className="checkbox-label">
                                                        <input
                                                            type="checkbox"
                                                            name="teachingSubjects"
                                                            value={subject}
                                                            checked={formData.teachingSubjects.includes(subject)}
                                                            onChange={handleChange}
                                                        />
                                                        {subject}
                                                    </label>
                                                ))}
                                            </div>
                                            {errors.teachingSubjects && <span className="error">{errors.teachingSubjects}</span>}
                                        </div>

                                        <div className="form-group full-width">
                                            <label>Bio / Introduction *</label>
                                            <textarea
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleChange}
                                                rows="4"
                                                placeholder="Tell us about your teaching philosophy, experience, and what makes you a great teacher..."
                                                className={errors.bio ? 'error' : ''}
                                            ></textarea>
                                            {errors.bio && <span className="error">{errors.bio}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label>Upload Resume/CV</label>
                                            <input
                                                type="file"
                                                name="resume"
                                                onChange={handleChange}
                                                accept=".pdf,.doc,.docx"
                                            />
                                            <small>Upload PDF or DOC file (Max 5MB)</small>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Address Section */}
                            <div className="address-section">
                                <h3>Address Information</h3>
                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label>Address</label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows="2"
                                            placeholder="Your complete address"
                                        ></textarea>
                                    </div>

                                    <div className="form-group">
                                        <label>City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="City"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Pincode</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            placeholder="Pincode"
                                            maxLength="6"
                                        />
                                        {errors.pincode && <span className="error">{errors.pincode}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* OTP Verification */}
                            <div className="otp-section">
                                <h3>Phone Verification</h3>
                                <div className="otp-box">
                                    <input
                                        type="text"
                                        placeholder="Enter OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        disabled={!otpSent}
                                    />
                                    <button type="button" onClick={sendOTP} disabled={isLoading}>
                                        {isLoading ? 'Sending...' : otpSent ? 'Resend OTP' : 'Send OTP'}
                                    </button>
                                </div>
                                <small>We'll send a verification code to {formData.phone || 'your phone number'}</small>
                            </div>

                            {/* Terms and Conditions */}
                            <div className="terms-section">
                                <label className="terms-label">
                                    <input
                                        type="checkbox"
                                        name="termsAccepted"
                                        checked={formData.termsAccepted}
                                        onChange={handleChange}
                                    />
                                    <span>I agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a> *</span>
                                </label>
                            </div>

                            <div className="form-navigation dual">
                                <button type="button" className="btn-prev" onClick={handlePrevious}>
                                    ← Previous
                                </button>
                                <button type="submit" className="btn-submit" disabled={isLoading}>
                                    {isLoading ? 'Registering...' : `Register as ${userType === 'student' ? 'Student' : 'Teacher'}`}
                                </button>
                            </div>
                        </div>
                    )}
                </form>

                {/* Footer */}
                <div className="register-footer">
                    <p>Already have an account? <a href="/login">Login here</a></p>
                    <div className="stats">
                        <span>🌟 10,000+ Students</span>
                        <span>👨‍🏫 500+ Teachers</span>
                        <span>⭐ 4.9 Rating</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
