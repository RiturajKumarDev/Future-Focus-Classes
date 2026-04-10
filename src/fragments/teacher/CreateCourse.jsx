import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import './CreateCourse.css';
import { uploadCourseToServer } from '../../services/courseService';
import { deleteImageToSever, uploadImageToSever } from '../../services/imageService';

const CreateCourse = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Course Form Data
    const [courseData, setCourseData] = useState({
        // Basic Information
        title: '',
        category: '',
        subcategory: '',
        level: '',
        grade: '',
        language: 'English',
        price: '',
        thumbnailUrl: null,
        instructor: '',

        // Description
        shortDescription: '',
        learningObjectives: [],

        // Course Content
        totalDuration: '',
        totalLectures: 0,

        // Additional Info
        features: ['Live Classes', 'Recorded Sessions', 'Study Material', 'Doubt Clearing'],
        certificate: true,
        welcomeMessage: '',
        completionMessage: '',

        // Pricing & Settings
        isPublished: false,
        allowDownload: true,
        hasQuiz: true,
        hasAssignment: true
    });

    useEffect(() => {
        const user = JSON.parse(Cookies.get("userData") || null);
        if (user) {
            setCourseData({ ...courseData, instructor: user.fullName });
            if (user.userType != 'teacher')
                navigate("/login");
        } else
            navigate("/login");
    }, []);

    useEffect(() => { deleteImageToSever(null) }, []);

    // Temporary form states
    const [newObjective, setNewObjective] = useState('');
    const [currentModule, setCurrentModule] = useState({ title: '', lectures: [] });
    const [currentLecture, setCurrentLecture] = useState({ title: '', duration: '', video: null, isPreview: false });

    // Categories data
    const categories = [
        { id: 'academic', name: 'Academic', subcategories: ['Mathematics', 'Science', 'English', 'Social Studies', 'Languages'] },
        { id: 'competitive', name: 'Competitive Exams', subcategories: ['JEE', 'NEET', 'Banking', 'SSC', 'UPSC', 'CAT'] },
        { id: 'coding', name: 'Coding & Tech', subcategories: ['Web Development', 'Python', 'Data Science', 'AI/ML', 'Mobile Apps'] },
        { id: 'language', name: 'Languages', subcategories: ['English Speaking', 'French', 'German', 'Spanish', 'Japanese'] },
        { id: 'skill', name: 'Skill Development', subcategories: ['Digital Marketing', 'Graphic Design', 'Personality Development', 'Communication'] }
    ];

    const grades = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'College'];
    const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
    const languages = ['English', 'Hindi', 'English/Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi'];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCourseData({
            ...courseData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadImageToSever(file)
                .then((result) => {
                    console.log(result);
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setCourseData({
                            ...courseData,
                            thumbnailUrl: result,
                            thumbnailPreview: URL.createObjectURL(file)
                        });
                    };
                    reader.readAsDataURL(file);
                });
        }
    };

    const handleImageDelete = () => {
        deleteImageToSever(courseData.thumbnailUrl);
        setCourseData(courseData => ({ ...courseData, thumbnail: '' }));
    };

    const addToList = (item, listName, setter, clearSetter) => {
        if (item.trim()) {
            setCourseData({
                ...courseData,
                [listName]: [...courseData[listName], item.trim()]
            });
        }
    };

    const removeFromList = (index, listName) => {
        const updatedList = courseData[listName].filter((_, i) => i !== index);
        setCourseData({ ...courseData, [listName]: updatedList });
    };

    const addModule = () => {
        if (currentModule.title.trim() && currentModule.lectures.length > 0) {
            setCourseData({
                ...courseData,
                curriculum: [...courseData.curriculum, { ...currentModule }]
            });
            setCurrentModule({ title: '', lectures: [] });
        } else {
            alert('Please add module title and at least one lecture');
        }
    };

    const addLecture = () => {
        if (currentLecture.title.trim() && currentLecture.duration) {
            setCurrentModule({
                ...currentModule,
                lectures: [...currentModule.lectures, { ...currentLecture }]
            });
            setCurrentLecture({ title: '', duration: '', video: null, isPreview: false });
        } else {
            alert('Please enter lecture title and duration');
        }
    };

    const removeModule = (index) => {
        const updatedCurriculum = courseData.curriculum.filter((_, i) => i !== index);
        setCourseData({ ...courseData, curriculum: updatedCurriculum });
    };

    const removeLecture = (moduleIndex, lectureIndex) => {
        const updatedCurriculum = [...courseData.curriculum];
        updatedCurriculum[moduleIndex].lectures = updatedCurriculum[moduleIndex].lectures.filter((_, i) => i !== lectureIndex);
        setCourseData({ ...courseData, curriculum: updatedCurriculum });
    };

    const calculateTotals = () => {
        let totalLectures = 0;
        let totalMinutes = 0;

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const durationString = `${hours}h ${minutes}m`;

        return { totalLectures, totalDuration: durationString };
    };

    const validateStep1 = () => {
        if (!courseData.title) return 'Course title is required';
        if (!courseData.category) return 'Category is required';
        if (!courseData.level) return 'Level is required';
        if (!courseData.price) return 'Price is required';
        if (!courseData.thumbnailUrl) return 'Course thumbnail is required';
        return null;
    };

    const validateStep2 = () => {
        if (!courseData.shortDescription) return 'Short description is required';
        if (courseData.learningObjectives.length === 0) return 'Add at least one learning objective';
        return null;
    };

    const handleNext = () => {
        let error = null;
        if (currentStep === 1) error = validateStep1();
        if (currentStep === 2) error = validateStep2();

        if (error) {
            alert(error);
            return;
        }

        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePrevious = () => {
        setCurrentStep(currentStep - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async () => {

        const { totalLectures, totalDuration } = calculateTotals();
        const finalCourseData = {
            ...courseData,
            totalLectures,
            totalDuration,
            createdAt: new Date().toISOString()
        };

        setIsLoading(true);
        const response = await uploadCourseToServer(courseData);
        setIsLoading(false);
        const data = await response.json();
        console.log(response);
        console.log(data);
        if (response.ok) {
            alert('Course created successfully!');
            navigate("/teacher-dashboard");
        } else {
            alert(`upload failed!${data.errors}`);
            deleteImageToSever(courseData.thumbnailUrl);
            setCourseData(courseData => ({ ...courseData, thumbnail: '' }));
        }
    };

    return (
        <div className="create-course-page">
            <div className="container">
                {/* Header */}
                <div className="page-header">
                    <h1>Create New Course</h1>
                    <p>Share your knowledge with thousands of students</p>
                </div>

                {/* Progress Steps */}
                <div className="progress-steps">
                    <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                        <div className="step-number">1</div>
                        <div className="step-label">Basic Info</div>
                    </div>
                    <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`}></div>
                    <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                        <div className="step-number">2</div>
                        <div className="step-label">Course Content</div>
                    </div>
                    <div className={`step-line ${currentStep >= 3 ? 'active' : ''}`}></div>
                    <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                        <div className="step-number">3</div>
                        <div className="step-label">Curriculum</div>
                    </div>
                    <div className={`step-line ${currentStep >= 4 ? 'active' : ''}`}></div>
                    <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
                        <div className="step-number">4</div>
                        <div className="step-label">Publish</div>
                    </div>
                </div>

                {/* Form */}
                <div className="form-container">
                    <a href="/teacher-dashboard">⬅️</a>
                    {/* Step 1: Basic Information */}
                    {currentStep === 1 && (
                        <div className="form-step fade-in">
                            <h2>Course Basics</h2>
                            <p className="step-description">Tell students what your course is about</p>

                            <div className="form-group">
                                <label>Course Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={courseData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Complete Web Development Bootcamp 2024"
                                    className="form-input"
                                />
                                <small>Clear and descriptive title helps students find your course</small>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Current Grade/Class *</label>
                                    <select name="grade" value={courseData.grade} onChange={handleInputChange} >
                                        <option value="">Select Grade</option>
                                        {grades.map(grade => <option key={grade} value={grade}>{grade}</option>)}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Category *</label>
                                    <select name="category" value={courseData.category} onChange={handleInputChange} className="form-select">
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Subcategory</label>
                                    <select name="subcategory" value={courseData.subcategory} onChange={handleInputChange} className="form-select">
                                        <option value="">Select Subcategory</option>
                                        {courseData.category && categories.find(c => c.id === courseData.category)?.subcategories.map(sub => (
                                            <option key={sub} value={sub}>{sub}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Level *</label>
                                    <select name="level" value={courseData.level} onChange={handleInputChange} className="form-select">
                                        <option value="">Select Level</option>
                                        {levels.map(level => (
                                            <option key={level} value={level}>{level}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Language</label>
                                    <select name="language" value={courseData.language} onChange={handleInputChange} className="form-select">
                                        {languages.map(lang => (
                                            <option key={lang} value={lang}>{lang}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Regular Price (₹) *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={courseData.price}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 9999"
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Course Thumbnail *</label>
                                <div className="thumbnail-upload">
                                    {courseData.thumbnailPreview ? (
                                        <div className="thumbnail-preview">
                                            <img src={courseData.thumbnailPreview} alt="Thumbnail preview" />
                                            <button
                                                type="button"
                                                className="remove-thumbnail"
                                                onClick={() => { handleImageDelete(); setCourseData({ ...courseData, thumbnail: null, thumbnailPreview: '' }) }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="upload-area">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                id="thumbnail-upload"
                                                style={{ display: 'none' }}
                                            />
                                            <label htmlFor="thumbnail-upload" className="upload-label">
                                                <span className="upload-icon">📸</span>
                                                <span>Click to upload thumbnail</span>
                                                <small>Recommended: 1280x720 pixels, JPG or PNG</small>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-navigation">
                                <button className="btn-next" onClick={handleNext}>
                                    Next: Course Content →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Course Content */}
                    {currentStep === 2 && (
                        <div className="form-step fade-in">
                            <h2>Course Content</h2>
                            <p className="step-description">Describe what students will learn</p>

                            <div className="form-group">
                                <label>Short Description *</label>
                                <textarea
                                    name="shortDescription"
                                    value={courseData.shortDescription}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="Brief description that appears in course cards (max 200 characters)"
                                    className="form-textarea"
                                    maxLength="200"
                                ></textarea>
                                <small>{courseData.shortDescription.length}/200 characters</small>
                            </div>

                            <div className="form-group">
                                <label>Total Duration *</label>
                                <div className="list-input">
                                    <div className="list-input-field">
                                        <input
                                            type="text"
                                            value={courseData.duration}
                                            onChange={(e) => setCourseData({ ...courseData, totalDuration: e.target.value })}
                                            placeholder="e.g., 20(hr)"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Total Lecture *</label>
                                <div className="list-input">
                                    <div className="list-input-field">
                                        <input
                                            type="number"
                                            value={courseData.lectures}
                                            onChange={(e) => setCourseData({ ...courseData, totalLectures: e.target.value })}
                                            placeholder="e.g., 10"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Learning Objectives *</label>
                                <div className="list-input">
                                    <div className="list-input-field">
                                        <input
                                            type="text"
                                            value={newObjective}
                                            onChange={(e) => setNewObjective(e.target.value)}
                                            placeholder="e.g., Master React.js fundamentals"
                                            onKeyPress={(e) => e.key === 'Enter' && addToList(newObjective, 'learningObjectives', setNewObjective)}
                                        />
                                        <button onClick={() => addToList(newObjective, 'learningObjectives', setNewObjective)}>Add</button>
                                    </div>
                                    <div className="list-items">
                                        {courseData.learningObjectives.map((item, index) => (
                                            <div key={index} className="list-item">
                                                <span>✓ {item}</span>
                                                <button onClick={() => removeFromList(index, 'learningObjectives')}>✕</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="form-navigation dual">
                                <button className="btn-prev" onClick={handlePrevious}>← Previous</button>
                                <button className="btn-next" onClick={handleNext}>Next: Curriculum →</button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Curriculum */}
                    {currentStep === 3 && (
                        <div className="form-step fade-in">
                            <h2>Course Curriculum</h2>
                            <p className="step-description">Build your course structure with modules and lectures</p>

                            <div className="form-navigation dual">
                                <button className="btn-prev" onClick={handlePrevious}>← Previous</button>
                                <button className="btn-next" onClick={handleNext}>Next: Publish →</button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Publish */}
                    {currentStep === 4 && (
                        <div className="form-step fade-in">
                            <h2>Publish Your Course</h2>
                            <p className="step-description">Review and publish your course</p>

                            {/* Course Summary */}
                            <div className="course-summary">
                                <h3>Course Summary</h3>
                                <div className="summary-grid">
                                    <div className="summary-item">
                                        <label>Title:</label>
                                        <p>{courseData.title || 'Not set'}</p>
                                    </div>
                                    <div className="summary-item">
                                        <label>Category:</label>
                                        <p>{courseData.category || 'Not set'}</p>
                                    </div>
                                    <div className="summary-item">
                                        <label>Level:</label>
                                        <p>{courseData.level || 'Not set'}</p>
                                    </div>
                                    <div className="summary-item">
                                        <label>Price:</label>
                                        <p>₹{courseData.price} </p>
                                    </div>
                                    <div className="summary-item">
                                        <label>Total Lectures:</label>
                                        <p>{calculateTotals().totalLectures}</p>
                                    </div>
                                    <div className="summary-item">
                                        <label>Total Duration:</label>
                                        <p>{calculateTotals().totalDuration}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Settings */}
                            <div className="settings-section">
                                <h3>Course Settings</h3>

                                <div className="settings-grid">
                                    <label className="setting-item">
                                        <input
                                            type="checkbox"
                                            name="certificate"
                                            checked={courseData.certificate}
                                            onChange={handleInputChange}
                                        />
                                        <span>Provide certificate upon completion</span>
                                    </label>

                                    <label className="setting-item">
                                        <input
                                            type="checkbox"
                                            name="allowDownload"
                                            checked={courseData.allowDownload}
                                            onChange={handleInputChange}
                                        />
                                        <span>Allow students to download materials</span>
                                    </label>

                                    <label className="setting-item">
                                        <input
                                            type="checkbox"
                                            name="hasQuiz"
                                            checked={courseData.hasQuiz}
                                            onChange={handleInputChange}
                                        />
                                        <span>Include quizzes in course</span>
                                    </label>

                                    <label className="setting-item">
                                        <input
                                            type="checkbox"
                                            name="hasAssignment"
                                            checked={courseData.hasAssignment}
                                            onChange={handleInputChange}
                                        />
                                        <span>Include assignments</span>
                                    </label>
                                </div>

                                <div className="form-group">
                                    <label>Welcome Message (for enrolled students)</label>
                                    <textarea
                                        name="welcomeMessage"
                                        value={courseData.welcomeMessage}
                                        onChange={handleInputChange}
                                        rows="3"
                                        placeholder="Welcome message that students will see after enrolling"
                                        className="form-textarea"
                                    ></textarea>
                                </div>

                                <div className="form-group">
                                    <label>Completion Message</label>
                                    <textarea
                                        name="completionMessage"
                                        value={courseData.completionMessage}
                                        onChange={handleInputChange}
                                        rows="3"
                                        placeholder="Message shown when students complete the course"
                                        className="form-textarea"
                                    ></textarea>
                                </div>
                            </div>

                            {/* Publishing Options */}
                            <div className="publishing-options">
                                <label className="publishing-option">
                                    <input
                                        type="checkbox"
                                        name="isPublished"
                                        checked={courseData.isPublished}
                                        onChange={handleInputChange}
                                    />
                                    <div>
                                        <strong>Publish immediately</strong>
                                        <small>Course will be visible to students right away</small>
                                    </div>
                                </label>
                            </div>

                            {/* Upload Progress */}
                            {isLoading && (
                                <div className="upload-progress">
                                    <div className="progress-bar-container">
                                        <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }}></div>
                                    </div>
                                    <p>Uploading course... {uploadProgress}%</p>
                                </div>
                            )}

                            <div className="form-navigation dual">
                                <button className="btn-prev" onClick={handlePrevious}>← Previous</button>
                                <button className="btn-submit" onClick={handleSubmit} disabled={isLoading}>
                                    {isLoading ? 'Creating Course...' : 'Create Course'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateCourse;
