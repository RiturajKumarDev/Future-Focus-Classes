// Mock data for Future Focus Classes LMS – Class 5th to 12th School Coaching

export const currentUser = {
  id: 1,
  fullName: 'RITURAJ KUMAR',
  email: 'rituraj@futurefocusclasses.com',
  batch: 'Class 10th – Batch A (CBSE)',
  role: 'Admin',
  avatar: 'RK',
  joinDate: 'Jan 2026',
  phone: '+91 98765 43210',
};

export const statsData = {
  attendance: 92,
  totalClasses: 45,
  completedClasses: 41,
  classSheets: { total: 30, completed: 26 },
  thisWeek: 4,
};

export const learningSessions = [
  {
    id: 1,
    date: '19 Jun 2026',
    day: 'Friday',
    topic: 'Quadratic Equations – Roots & Methods',
    subject: 'Mathematics',
    type: 'Class Session',
    attendance: 'Present',
    materials: [
      'Quadratic Formula Notes Class 10.pdf',
      'NCERT Exercise 4.2 Solutions.pdf',
      'Extra Practice Worksheet – Roots.pdf',
    ],
    extraFiles: 3,
  },
  {
    id: 2,
    date: '16 Jun 2026',
    day: 'Tuesday',
    topic: 'Force and Laws of Motion – Newton\'s Laws',
    subject: 'Science',
    type: 'Class Session',
    attendance: 'Present',
    materials: [
      'Laws of Motion Concept Sheet.pdf',
      'Class Notes – Action & Reaction.pdf',
    ],
    extraFiles: 2,
  },
  {
    id: 3,
    date: '12 Jun 2026',
    day: 'Friday',
    topic: 'Tenses – Present Perfect vs Past Simple',
    subject: 'English',
    type: 'Class Session',
    attendance: 'Present',
    materials: [
      'Tenses Rules & Sentence Formulas.pdf',
      'Class Sheet – Tenses Fillups.pdf',
    ],
    extraFiles: 2,
  },
  {
    id: 4,
    date: '9 Jun 2026',
    day: 'Tuesday',
    topic: 'Resources and Development – Types of Soil',
    subject: 'Social Science',
    type: 'Class Session',
    attendance: 'Absent',
    materials: [
      'Geography Chapter 1 Notes.pdf',
    ],
    extraFiles: 1,
  },
];

export const practiceTests = [
  {
    id: 1,
    title: 'Algebra – Chapter Mock Test 1',
    subject: 'Mathematics',
    totalQuestions: 20,
    duration: '40 min',
    status: 'New',
    dueDate: '30 Jun 2026',
    score: null,
  },
  {
    id: 2,
    title: 'Chemical Reactions & Equations',
    subject: 'Science',
    totalQuestions: 15,
    duration: '30 min',
    status: 'Completed',
    dueDate: '20 Jun 2026',
    score: 93,
  },
  {
    id: 3,
    title: 'Active & Passive Voice Test',
    subject: 'English',
    totalQuestions: 20,
    duration: '25 min',
    status: 'Pending',
    dueDate: '28 Jun 2026',
    score: null,
  },
  {
    id: 4,
    title: 'Rise of Nationalism in Europe',
    subject: 'Social Science',
    totalQuestions: 30,
    duration: '45 min',
    status: 'Completed',
    dueDate: '15 Jun 2026',
    score: 85,
  },
];

export const procturedTests = [
  {
    id: 1,
    title: 'Half-Yearly Mock Examination',
    subject: 'All Subjects',
    totalQuestions: 80,
    duration: '120 min',
    status: 'Scheduled',
    scheduledDate: '5 Jul 2026, 10:00 AM',
  },
  {
    id: 2,
    title: 'Mathematics Term 1 Paper',
    subject: 'Mathematics',
    totalQuestions: 50,
    duration: '90 min',
    status: 'Completed',
    scheduledDate: '10 Jun 2026',
    score: 95,
  },
];

export const videos = [
  {
    id: 1,
    title: 'Real Numbers – Euclid\'s Division Lemma',
    subject: 'Mathematics',
    duration: '35:10',
    videoUrl: 'https://youtube.com/watch?v=mock1',
    thumbnail: null,
    status: 'Watched',
    uploadedOn: '10 Jun 2026',
    instructor: 'Prof. Ravi Verma',
  },
  {
    id: 2,
    title: 'Carbon and its Compounds – Basics',
    subject: 'Science',
    duration: '48:15',
    videoUrl: 'https://youtube.com/watch?v=mock2',
    thumbnail: null,
    status: 'Pending',
    uploadedOn: '12 Jun 2026',
    instructor: 'Prof. Pankaj Singh',
  },
  {
    id: 3,
    title: 'Determiners & Modal Auxiliaries',
    subject: 'English',
    duration: '28:40',
    videoUrl: 'https://youtube.com/watch?v=mock3',
    thumbnail: null,
    status: 'Pending',
    uploadedOn: '15 Jun 2026',
    instructor: 'Prof. Anil Sharma',
  },
  {
    id: 4,
    title: 'Sectors of Indian Economy – Detailed',
    subject: 'Social Science',
    duration: '42:00',
    videoUrl: 'https://youtube.com/watch?v=mock4',
    thumbnail: null,
    status: 'Watched',
    uploadedOn: '18 Jun 2026',
    instructor: 'Prof. Neha Gupta',
  },
];

export const resources = [
  {
    id: 1,
    title: 'Class 10 Maths Chapterwise Formulas',
    subject: 'Mathematics',
    type: 'PDF',
    size: '1.2 MB',
    uploadedOn: '5 Jun 2026',
  },
  {
    id: 2,
    title: 'Science Board Exam Concept Map',
    subject: 'Science',
    type: 'PDF',
    size: '2.8 MB',
    uploadedOn: '6 Jun 2026',
  },
  {
    id: 3,
    title: 'English Grammar Rules & Practice Book',
    subject: 'English',
    type: 'PDF',
    size: '3.5 MB',
    uploadedOn: '8 Jun 2026',
  },
  {
    id: 4,
    title: 'Social Science Map Work Important Points',
    subject: 'Social Science',
    type: 'PDF',
    size: '1.4 MB',
    uploadedOn: '1 Jun 2026',
  },
  {
    id: 5,
    title: 'Class 10 CBSE Sample Papers 2026',
    subject: 'All Subjects',
    type: 'PDF',
    size: '4.6 MB',
    uploadedOn: '10 Jun 2026',
  },
];

export const recentActivity = [
  { id: 1, type: 'LEARNING', label: 'Downloaded formula sheet', detail: 'Maths Chapterwise Formulas', time: '17 Jun 2026' },
  { id: 2, type: 'TEST', label: 'Submitted Mock Test', detail: 'Chemical Reactions & Equations', time: '20 Jun 2026' },
  { id: 3, type: 'VIDEO', label: 'Finished Watching Video Lecture', detail: 'Real Numbers – Euclid\'s Lemma', time: '11 Jun 2026' },
  { id: 4, type: 'LEARNING', label: 'Attended Online Class', detail: 'Force and Laws of Motion', time: '16 Jun 2026' },
];

export const subjects = ['All Subjects', 'Mathematics', 'Science', 'English', 'Social Science'];
