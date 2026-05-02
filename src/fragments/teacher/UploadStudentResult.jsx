import React, { useState } from 'react';
import './uploadStudentResult.css';
import { getStudentResultsToServer, uploadStudentResultToServer } from '../../services/resultService';


const UploadStudentResult = () => {
    const [formData, setFormData] = useState({
        name: '',
        achievement: '',
        course: '',
        before: '',
        after: '',
        testimonial: '',
        year: new Date().getFullYear().toString()
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [uploadedResults, setUploadedResults] = useState([]);

    // Available courses for dropdown
    const courses = [
        'JEE Main & Advanced',
        'NEET Preparation',
        'Mathematics Advanced',
        'Science (PCB)',
        'Web Development Bootcamp',
        'Python Programming',
        'Data Science & AI',
        'Spoken English',
        'Digital Marketing',
        'Graphic Design',
        'Personality Development',
        'Banking & SSC'
    ];

    // Available achievements
    const achievements = [
        'JEE Advanced Rank',
        'NEET Rank',
        'CBSE Topper',
        'Placed at Google',
        'Placed at Microsoft',
        'Placed at Amazon',
        'University Topper',
        'Scholarship Winner',
        'Olympiad Winner',
        'NTSE Scholar'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.achievement || !formData.course ||
            !formData.before || !formData.after || !formData.testimonial) {
            setMessage({ type: 'error', text: 'Please fill in all required fields' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Create form data for file upload
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('achievement', formData.achievement);
            submitData.append('course', formData.course);
            submitData.append('before', formData.before);
            submitData.append('after', formData.after);
            submitData.append('testimonial', formData.testimonial);
            submitData.append('year', formData.year);

            if (selectedImage) {
                submitData.append('image', selectedImage);
            }

            // API call to your backend
            const response = await uploadStudentResultToServer(formData);

            setMessage({ type: 'success', text: 'Student result uploaded successfully!' });

            // Reset form
            setFormData({
                name: '',
                achievement: '',
                course: '',
                before: '',
                after: '',
                testimonial: '',
                year: new Date().getFullYear().toString()
            });
            setSelectedImage(null);
            setImagePreview('');

            // Refresh the list
            fetchUploadedResults();

        } catch (error) {
            console.error('Upload error:', error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to upload student result' });
        } finally {
            setLoading(false);
        }
    };

    const fetchUploadedResults = async () => {
        try {
        } catch (error) {
            console.error('Error fetching results:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this result?')) {
            // try {
            //     await axios.delete(`http://localhost:5000/api/student-results/${id}`);
            //     setMessage({ type: 'success', text: 'Result deleted successfully!' });
            //     fetchUploadedResults();
            // } catch (error) {
            //     setMessage({ type: 'error', text: 'Failed to delete result' });
            // }
        }
    };

    // Fetch results on component mount
    React.useEffect(() => {
        fetchUploadedResults();
    }, []);

    return (
        <div className="upload-container">
            <div className="upload-wrapper">
                <div className="upload-header">
                    <h1>📊 Upload Student Success Story</h1>
                    <p>Share inspiring student achievements and results</p>
                </div>

                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <div className="upload-content">
                    {/* Upload Form */}
                    <div className="upload-form-section">
                        <h2>Add New Student Result</h2>
                        <form onSubmit={handleSubmit} className="upload-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Student Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g., Rahul Sharma"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Achievement *</label>
                                    <select
                                        name="achievement"
                                        value={formData.achievement}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Achievement</option>
                                        {achievements.map(achievement => (
                                            <option key={achievement} value={achievement}>
                                                {achievement}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Course *</label>
                                    <select
                                        name="course"
                                        value={formData.course}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Course</option>
                                        {courses.map(course => (
                                            <option key={course} value={course}>
                                                {course}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Year *</label>
                                    <input
                                        type="text"
                                        name="year"
                                        value={formData.year}
                                        onChange={handleChange}
                                        placeholder="e.g., 2024"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Before Score/Status *</label>
                                    <input
                                        type="text"
                                        name="before"
                                        value={formData.before}
                                        onChange={handleChange}
                                        placeholder="e.g., 85% or Beginner"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>After Score/Status *</label>
                                    <input
                                        type="text"
                                        name="after"
                                        value={formData.after}
                                        onChange={handleChange}
                                        placeholder="e.g., 98.5% or Expert"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Student Testimonial *</label>
                                <textarea
                                    name="testimonial"
                                    value={formData.testimonial}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Write the student's success story and feedback..."
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'Uploading...' : 'Upload Student Result →'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadStudentResult;
