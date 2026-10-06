const mongoose = require("mongoose");
require("dotenv").config();
const {
  User,
  Category,
  Course,
  Section,
  Lesson,
  Quiz,
  Assignment,
  Review,
  Coupon,
  Enrollment,
  Progress,
  Certificate,
} = require("./models");

const SEED_PASSWORD = "Password@123";

const seedData = async () => {
  try {
    console.log("🌱 Connecting to MongoDB Atlas for Future Focus Classes LMS...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(" Connected to MongoDB!");

    // Clean existing seed collections
    console.log("🧹 Clearing old data and obsolete indexes...");
    await Course.collection.dropIndex("instructor_1").catch(() => {});
    await Promise.all([
      User.deleteMany({
        email: {
          $in: [
            "admin@learnx.com",
            "instructor@learnx.com",
            "student@learnx.com",
            "admin@futurefocus.com",
            "instructor@futurefocus.com",
            "student@futurefocus.com",
          ],
        },
      }),
      Category.deleteMany({}),
      Course.deleteMany({}),
      Section.deleteMany({}),
      Lesson.deleteMany({}),
      Quiz.deleteMany({}),
      Assignment.deleteMany({}),
      Review.deleteMany({}),
      Coupon.deleteMany({}),
      Enrollment.deleteMany({}),
      Progress.deleteMany({}),
      Certificate.deleteMany({}),
    ]);

    // 1. Create Users (Support both learnx and futurefocus emails for seamless recruiter testing)
    console.log("👤 Creating Seed Users for Future Focus Classes...");
    const admin = await User.create({
      fullName: "Admin Rituraj (Director)",
      email: "admin@learnx.com",
      password: SEED_PASSWORD,
      role: "admin",
      headline: "Founder & Director, Future Focus Classes",
      bio: "Overseeing Future Focus Classes offline & online quality education across CBSE/State boards, competitive exams, and technical graduation.",
      avatar: "/img/future focus classes logo.png",
      status: "active",
      isEmailVerified: true,
    });

    // Also alias for futurefocus.com
    await User.create({
      fullName: "Admin Rituraj (Director)",
      email: "admin@futurefocus.com",
      password: SEED_PASSWORD,
      role: "admin",
      headline: "Founder & Director, Future Focus Classes",
      bio: "Overseeing Future Focus Classes offline & online academic operations.",
      avatar: "/img/future focus classes logo.png",
      status: "active",
      isEmailVerified: true,
    });

    const instructor = await User.create({
      fullName: "Er. Alok Sharma (Senior Faculty)",
      email: "instructor@learnx.com",
      password: SEED_PASSWORD,
      role: "instructor",
      headline: "Ex-IITian & Senior Physics / Mathematics Mentor",
      bio: "14+ years of mentoring thousands of students for Board Toppers, JEE Advanced, and Engineering Computer Science.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      status: "active",
      isEmailVerified: true,
    });

    await User.create({
      fullName: "Er. Alok Sharma (Senior Faculty)",
      email: "instructor@futurefocus.com",
      password: SEED_PASSWORD,
      role: "instructor",
      headline: "Senior Faculty, Future Focus Classes",
      bio: "14+ years of mentoring for Boards, JEE, NEET, and Computer Science.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      status: "active",
      isEmailVerified: true,
    });

    const student = await User.create({
      fullName: "Rohan Verma",
      email: "student@learnx.com",
      password: SEED_PASSWORD,
      role: "student",
      headline: "Aspiring Engineer & Board Scholar",
      bio: "Enrolled in Class 12th & JEE Batch at Future Focus Classes.",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400",
      status: "active",
      isEmailVerified: true,
    });

    await User.create({
      fullName: "Rohan Verma",
      email: "student@futurefocus.com",
      password: SEED_PASSWORD,
      role: "student",
      headline: "Aspiring Engineer & Board Scholar",
      bio: "Enrolled in Class 12th & JEE Batch at Future Focus Classes.",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400",
      status: "active",
      isEmailVerified: true,
    });

    console.log(` Admin created: ${admin.email}`);
    console.log(` Instructor created: ${instructor.email}`);
    console.log(` Student created: ${student.email}`);

    // 2. Create Categories covering Class 8-12, Graduation, Coding, and Competition Exams
    console.log("📂 Creating Comprehensive Future Focus Classes Academic Categories...");
    const categories = await Category.insertMany([
      {
        name: "Class 8th - 10th (Boards & Foundation)",
        slug: "class-8-10-foundation",
        description: "Complete NCERT curriculum, Board Exam prep, Science (Physics, Chemistry, Biology), and Mathematics mastery.",
        icon: "BookOpen",
        thumbnail: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600",
      },
      {
        name: "Class 11th & 12th (Senior Secondary)",
        slug: "class-11-12-boards",
        description: "Targeted preparation for CBSE & State Board Exams in Physics, Chemistry, Mathematics (PCM) and Biology (PCB).",
        icon: "GraduationCap",
        thumbnail: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600",
      },
      {
        name: "Competition Exams (IIT-JEE & NEET)",
        slug: "competition-exams",
        description: "Intensive coaching for JEE Main, JEE Advanced, NEET-UG, CUET, and National Olympiads with DPPs and mock tests.",
        icon: "Target",
        thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600",
      },
      {
        name: "Graduation & Engineering College",
        slug: "graduation-college",
        description: "Curriculum support for B.Tech, BCA, B.Sc, B.Com: Engineering Mathematics, Discrete Structures, Operating Systems.",
        icon: "Library",
        thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600",
      },
      {
        name: "Coding & Software Development",
        slug: "coding-skills",
        description: "Hands-on Full-Stack Web Development (MERN), Python Programming, Data Structures & Algorithms (DSA), and AI.",
        icon: "Code",
        thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600",
      },
    ]);

    // 3. Create Courses across all academic domains
    console.log("🎓 Creating Future Focus Classes Flagship Courses...");

    // Course 1: Class 10th Boards
    const class10Course = await Course.create({
      title: "Class 10th CBSE & State Boards: Complete Science & Maths Mastery",
      slug: "class-10th-boards-science-maths-mastery",
      subtitle: "Score 95%+ in Board Examinations with chapter-wise concept lectures, NCERT solutions, and sample papers.",
      description: "A comprehensive foundation course specifically designed for Class 10th aspirants. Covers Complete Mathematics (Real Numbers, Quadratic Equations, Trigonometry, Statistics) and Science (Chemical Reactions, Electricity, Magnetic Effects, Life Processes) with interactive video lectures and board pattern mock tests.",
      instructor: instructor._id,
      category: categories[0]._id, // Class 8-10
      level: "beginner",
      language: "English",
      pricing: { isFree: false, price: 2999, discountPrice: 999 },
      thumbnail: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
      previewVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      requirements: ["Enrolled in Class 9th or 10th", "Notebook and NCERT Textbook"],
      learningOutcomes: [
        "Master all 14 Class 10th Mathematics chapters with step-by-step proofs",
        "Clear Physics numericals, Chemistry balancing equations & Biology diagrams",
        "Solve 10+ previous year question papers (PYQs) with board marking schemes",
        "Daily practice sheets (DPPs) and real-time timed chapter quizzes",
      ],
      status: "PUBLISHED",
      durationHours: 45,
      enrollmentCount: 3420,
      rating: { average: 4.9, count: 520 },
      isFeatured: true,
      tags: ["Class 10", "CBSE", "Board Exam", "Mathematics", "Science"],
    });

    // Course 2: Class 12th PCM
    const class12Course = await Course.create({
      title: "Class 12th Physics & Chemistry: Board Masterclass + Formula Crash Course",
      slug: "class-12th-physics-chemistry-board-masterclass",
      subtitle: "Crucial derivations, numerical problem solving, and organic reaction mechanisms for Class 12 Boards.",
      description: "Designed for Class 12th science students aiming for top scores in CBSE and State Board exams. Features in-depth derivations of Electrostatics, Magnetism, Optics, Electrochemistry, and Named Organic Reactions.",
      instructor: instructor._id,
      category: categories[1]._id, // Class 11-12
      level: "intermediate",
      language: "English",
      pricing: { isFree: false, price: 3499, discountPrice: 1299 },
      thumbnail: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800",
      previewVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      requirements: ["Class 11th fundamental basics in Physics and Chemistry"],
      learningOutcomes: [
        "Master all standard derivations in Wave Optics, Electrostatics & Modern Physics",
        "Solve complex numericals in Chemical Kinetics & Solutions easily",
        "Memorize Organic synthesis conversions with rapid reaction roadmaps",
      ],
      status: "PUBLISHED",
      durationHours: 50,
      enrollmentCount: 2890,
      rating: { average: 4.9, count: 410 },
      isFeatured: true,
      tags: ["Class 12", "Physics", "Chemistry", "CBSE 12th", "Boards"],
    });

    // Course 3: IIT-JEE Mathematics & Problem Solving
    const jeeCourse = await Course.create({
      title: "IIT-JEE (Main + Advanced) Comprehensive Mathematics & Problem Solving 2026",
      slug: "iit-jee-main-advanced-mathematics-problem-solving",
      subtitle: "Master Calculus, Coordinate Geometry, Complex Numbers & Vector Algebra with Advanced Problem Solving.",
      description: "Our premier flagship program for engineering aspirants. Mentored by experienced faculty with rigorous multi-concept problem solving strategies, graphical approaches, shortcuts, and 15 years of JEE Advanced analysis.",
      instructor: instructor._id,
      category: categories[2]._id, // Competition Exams
      level: "advanced",
      language: "English",
      pricing: { isFree: false, price: 5999, discountPrice: 2499 },
      thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
      previewVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      requirements: ["Basic high school Algebra and Trigonometry"],
      learningOutcomes: [
        "Crack complex Calculus problems (Differential & Integral Calculus)",
        "Master Coordinate Geometry (Conic Sections) through intuitive visualizations",
        "Timed JEE mock tests with percentile analysis and ranking benchmarks",
      ],
      status: "PUBLISHED",
      durationHours: 65,
      enrollmentCount: 4150,
      rating: { average: 5.0, count: 680 },
      isFeatured: true,
      tags: ["IIT-JEE", "JEE Main", "JEE Advanced", "Mathematics", "Engineering"],
    });

    // Course 4: B.Tech Engineering Mathematics & Data Structures
    const btechCourse = await Course.create({
      title: "B.Tech & BCA: Engineering Mathematics, Data Structures & Algorithms",
      slug: "btech-bca-engineering-mathematics-data-structures",
      subtitle: "Clear university semester exams and placement rounds with Matrices, Calculus, Trees, and Graphs.",
      description: "Essential college-level curriculum program for undergraduate students of B.Tech (CSE, ECE, ME) and BCA. Covers Engineering Mathematics (Linear Algebra, Differential Equations) combined with Core Computer Science (Data Structures in C++/Java).",
      instructor: instructor._id,
      category: categories[3]._id, // Graduation & College
      level: "intermediate",
      language: "English",
      pricing: { isFree: false, price: 3999, discountPrice: 1499 },
      thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
      previewVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      requirements: ["Enrolled in B.Tech, BCA, or B.Sc Degree program"],
      learningOutcomes: [
        "Clear University semester exams in Engineering Mathematics with top GPA",
        "Implement Linked Lists, Stacks, Queues, Trees, and Graphs from scratch",
        "Crack placement coding rounds with Space and Time Complexity analysis",
      ],
      status: "PUBLISHED",
      durationHours: 38,
      enrollmentCount: 1980,
      rating: { average: 4.8, count: 230 },
      isFeatured: true,
      tags: ["B.Tech", "BCA", "College", "Data Structures", "Engineering Maths"],
    });

    // Course 5: Coding - Full Stack MERN Development 2026
    const codingCourse = await Course.create({
      title: "MERN Stack & Python Coding Bootcamp 2026: From Scratch to Cloud Deployment",
      slug: "mern-stack-development-2026-master-full-stack-engineering",
      subtitle: "Build modern production web apps with React 19, Node.js, Express, and MongoDB.",
      description: "From beginner programming logic to architecting resilient, full-stack software applications. Learn JavaScript, modern React components, secure Express backend APIs, Mongoose schema modeling, and Docker deployment.",
      instructor: instructor._id,
      category: categories[4]._id, // Coding & Tech
      level: "intermediate",
      language: "English",
      pricing: { isFree: false, price: 4999, discountPrice: 1999 },
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
      previewVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      requirements: ["Basic computer literacy and passion for learning programming"],
      learningOutcomes: [
        "Architect production-grade MERN web applications from scratch",
        "Implement secure JWT authentication, HTTP-only cookies, and RBAC",
        "Design robust MongoDB schemas with indexing and aggregate pipelines",
        "Build portfolio projects that impress tech recruiters and secure internships",
      ],
      status: "PUBLISHED",
      durationHours: 32,
      enrollmentCount: 2420,
      rating: { average: 4.9, count: 340 },
      isFeatured: true,
      tags: ["Coding", "React", "Node.js", "MongoDB", "Full Stack"],
    });

    // Course 6: Free Foundation Starter (DevOps & Cloud Starter)
    const freeStarterCourse = await Course.create({
      title: "Future Focus Foundation Starter: Computer Fundamentals & Study Techniques",
      slug: "future-focus-foundation-starter-computer-fundamentals",
      subtitle: "Learn how to prepare effectively for board exams and master basic digital tools.",
      description: "A free introductory course offered by Future Focus Classes to help students in classes 8th-12th cultivate disciplined study schedules, solve mock tests methodically, and understand core computer literacy.",
      instructor: instructor._id,
      category: categories[0]._id,
      level: "beginner",
      language: "English",
      pricing: { isFree: true, price: 0, discountPrice: 0 },
      thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
      previewVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      requirements: ["Curiosity to learn and succeed"],
      learningOutcomes: [
        "Discover memory techniques for retaining formulas and diagrams",
        "Time management blueprints for board exams and competitive tests",
        "Digital tools, note-taking apps, and computer literacy essentials",
      ],
      status: "PUBLISHED",
      durationHours: 8,
      enrollmentCount: 5200,
      rating: { average: 4.9, count: 710 },
      isFeatured: true,
      tags: ["Foundation", "Study Skills", "Free", "Class 8-10"],
    });

    // 4. Create Curriculum for Flagship Coding / Academic Course
    console.log("📚 Creating Curriculum (Sections & Lessons)...");
    const section1 = await Section.create({
      course: codingCourse._id,
      title: "Section 1: Architecture, Core Foundations & Setup",
      order: 1,
    });

    const lesson1_1 = await Lesson.create({
      course: codingCourse._id,
      section: section1._id,
      title: "1. Welcome to Future Focus Classes & Course Blueprint",
      description: "Course orientation, platform walkthrough, and system setup.",
      type: "video",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      durationMinutes: 12,
      content: "Welcome to Future Focus Classes! In this lecture we establish foundational goals, study timelines, and development environments.",
      isFreePreview: true,
      order: 1,
    });

    const lesson1_2 = await Lesson.create({
      course: codingCourse._id,
      section: section1._id,
      title: "2. Setting Up Express REST Gateway & MongoDB Schemas",
      description: "Hands-on configuration of Express controllers and Mongoose schemas.",
      type: "video",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      durationMinutes: 24,
      content: "Understand schema validation, indexing strategies, and database relationships.",
      isFreePreview: false,
      order: 2,
    });

    const section2 = await Section.create({
      course: codingCourse._id,
      title: "Section 2: Authentication & RBAC Security",
      order: 2,
    });

    const lesson2_1 = await Lesson.create({
      course: codingCourse._id,
      section: section2._id,
      title: "3. JWT Authentication & HTTP-Only Cookie Tokens",
      description: "Deep dive into secure session handling, bcrypt hashing, and authorization.",
      type: "video",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      durationMinutes: 30,
      content: "Learn why HTTP-only cookies prevent XSS theft and how role-based middleware operates.",
      isFreePreview: false,
      order: 1,
    });

    // 5. Create Interactive Quiz
    console.log("📝 Creating Chapter Assessment Quiz...");
    await Quiz.create({
      course: codingCourse._id,
      section: section1._id,
      title: "Future Focus Core Engineering Assessment",
      description: "Validate your conceptual grasp on backend middleware, database indexing, and async logic.",
      timeLimitMinutes: 10,
      passingPercentage: 60,
      maxAttempts: 3,
      questions: [
        {
          questionText: "Which HTTP header is essential for enabling cross-origin requests with cookie credentials in Express?",
          questionType: "MCQ",
          options: [
            { text: "Access-Control-Allow-Origin with specific origin and Access-Control-Allow-Credentials: true", isCorrect: true },
            { text: "Access-Control-Allow-Origin: * with no credentials", isCorrect: false },
            { text: "Content-Type: application/json", isCorrect: false },
            { text: "Authorization: Bearer *", isCorrect: false },
          ],
          marks: 5,
          explanation: "Browsers require Access-Control-Allow-Credentials: true and an explicit non-wildcard origin to pass HTTP cookies securely.",
        },
        {
          questionText: "Why should sensitive JWT tokens preferably be stored in HTTP-Only cookies rather than localStorage?",
          questionType: "MCQ",
          options: [
            { text: "HTTP-Only cookies are protected from malicious JavaScript reads (mitigating XSS theft)", isCorrect: true },
            { text: "Cookies hold larger amounts of data than localStorage", isCorrect: false },
            { text: "localStorage is deprecated in modern browsers", isCorrect: false },
            { text: "Cookies are encrypted automatically by the CPU", isCorrect: false },
          ],
          marks: 5,
          explanation: "HTTP-Only flag prevents client-side scripts from reading the token via document.cookie, safeguarding against XSS attacks.",
        },
        {
          questionText: "What MongoDB feature allows combining collections dynamically without manual multiple queries?",
          questionType: "MCQ",
          options: [
            { text: "Mongoose populate or MongoDB $lookup aggregation", isCorrect: true },
            { text: "MongoDB SQL JOIN operator", isCorrect: false },
            { text: "JSON.stringify()", isCorrect: false },
            { text: "Collection.concat()", isCorrect: false },
          ],
          marks: 5,
          explanation: "MongoDB uses $lookup aggregations, which Mongoose surfaces elegantly through the .populate() method.",
        },
      ],
    });

    // 6. Create Assignment
    console.log("📑 Creating Project Assignment...");
    await Assignment.create({
      course: codingCourse._id,
      section: section2._id,
      title: "Capstone Project: Build an RBAC Protected Microservice",
      description: "Design and implement a standalone Node/Express service featuring role-based authorization for admin, instructor, and student roles.",
      instructions: "1. Setup an Express server with MongoDB.\n2. Implement /api/auth/register, /api/auth/login, and /api/profile.\n3. Add role-based middleware ensuring only admins can access a simulated /api/admin/metrics route.\n4. Submit your GitHub repository link and deployed live URL.",
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      maxMarks: 100,
    });

    // 7. Create Promotional Coupons
    console.log("🏷️ Creating Promotional Coupons...");
    await Coupon.create({
      code: "FUTURE50",
      discountType: "percentage",
      discountValue: 50,
      maxDiscount: 2000,
      minPurchase: 1000,
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      usageLimit: 500,
      isActive: true,
    });

    await Coupon.create({
      code: "LEARNX50",
      discountType: "percentage",
      discountValue: 50,
      maxDiscount: 2000,
      minPurchase: 1000,
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      usageLimit: 500,
      isActive: true,
    });

    await Coupon.create({
      code: "WELCOME20",
      discountType: "fixed",
      discountValue: 500,
      minPurchase: 1000,
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      usageLimit: 1000,
      isActive: true,
    });

    // 8. Create Reviews
    console.log("⭐ Creating Reviews...");
    await Review.create({
      course: codingCourse._id,
      student: student._id,
      rating: 5,
      comment: "Future Focus Classes transformed my understanding of full stack engineering. The mentorship and practical assignments are second to none!",
    });

    // 9. Create Active Enrollment and Progress for Student
    console.log("🎒 Creating Student Enrollment & Progress...");
    await Enrollment.create({
      student: student._id,
      course: codingCourse._id,
      amountPaid: 1999,
      status: "active",
    });

    await Progress.create({
      student: student._id,
      course: codingCourse._id,
      completedLessons: [lesson1_1._id, lesson1_2._id],
      percentage: 67,
      lastAccessedLesson: lesson1_1._id,
      status: "in_progress",
    });

    // 10. Create Completed Enrollment and Verified Certificate for Free Starter
    await Enrollment.create({
      student: student._id,
      course: freeStarterCourse._id,
      amountPaid: 0,
      status: "completed",
    });

    const certId = "LX-2026-CS8891";
    await Certificate.create({
      certificateId: certId,
      student: student._id,
      course: freeStarterCourse._id,
      instructor: instructor._id,
      studentName: student.fullName,
      courseTitle: freeStarterCourse.title,
      instructorName: instructor.fullName,
      grade: "Distinction",
      scorePercentage: 96,
      issueDate: new Date(),
      verificationUrl: `/verify/${certId}`,
    });

    console.log("\n==========================================");
    console.log("🎉 FUTURE FOCUS CLASSES SEED COMPLETE!");
    console.log("==========================================");
    console.log("🔑 Ready-to-use Accounts:");
    console.log("   Admin:      admin@learnx.com (or admin@futurefocus.com)      | Password: " + SEED_PASSWORD);
    console.log("   Instructor: instructor@learnx.com (or instructor@futurefocus.com) | Password: " + SEED_PASSWORD);
    console.log("   Student:    student@learnx.com (or student@futurefocus.com)    | Password: " + SEED_PASSWORD);
    console.log("🏷️ Active Coupons: FUTURE50, LEARNX50, WELCOME20");
    console.log("📜 Verified Certificate ID: " + certId);
    console.log("==========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed with error:", error);
    process.exit(1);
  }
};

seedData();
