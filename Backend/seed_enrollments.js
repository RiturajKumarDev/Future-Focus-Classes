const mongoose = require("mongoose");
require("dotenv").config();

const { User, Course, Section, Lesson, Enrollment, Progress, Certificate } = require("./models");

const seedEnrollments = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for enrollment seeding...");

    const student = await User.findOne({ email: "student@learnx.com" });
    const instructor = await User.findOne({ email: "instructor@learnx.com" });
    const mernCourse = await Course.findOne({ slug: "mern-stack-development-2026-master-full-stack-engineering" });
    const devopsCourse = await Course.findOne({ slug: "docker-kubernetes-aws-cloud-architecture-bootcamp" });

    if (!student || !mernCourse) {
      console.error("Student or Course not found");
      process.exit(1);
    }

    const lessons = await Lesson.find({ course: mernCourse._id });

    // 1. Enroll student in MERN course
    let enrollment = await Enrollment.findOne({ student: student._id, course: mernCourse._id });
    if (!enrollment) {
      enrollment = await Enrollment.create({
        student: student._id,
        course: mernCourse._id,
        amountPaid: 1999,
        status: "active",
      });
      console.log("Enrolled student in MERN course");
    }

    // 2. Set progress for MERN course
    const completedLessonIds = lessons.slice(0, 2).map((l) => l._id);
    let progress = await Progress.findOne({ student: student._id, course: mernCourse._id });
    if (!progress) {
      progress = await Progress.create({
        student: student._id,
        course: mernCourse._id,
        completedLessons: completedLessonIds,
        percentage: 67,
        lastAccessedLesson: lessons[0]?._id,
        status: "in_progress",
      });
      console.log("Created progress record: 67%");
    }

    // 3. Enroll student in DevOps course as 100% COMPLETED with Certificate
    if (devopsCourse) {
      let devopsEnrollment = await Enrollment.findOne({ student: student._id, course: devopsCourse._id });
      if (!devopsEnrollment) {
        devopsEnrollment = await Enrollment.create({
          student: student._id,
          course: devopsCourse._id,
          amountPaid: 0,
          status: "completed",
        });
      }

      const certId = "LX-2026-CS8891";
      let cert = await Certificate.findOne({ certificateId: certId });
      if (!cert) {
        await Certificate.create({
          certificateId: certId,
          student: student._id,
          course: devopsCourse._id,
          instructor: instructor._id,
          studentName: student.fullName,
          courseTitle: devopsCourse.title,
          instructorName: instructor.fullName,
          grade: "Distinction",
          scorePercentage: 94,
          issueDate: new Date(),
          verificationUrl: `/verify/${certId}`,
        });
        console.log(`Created verified certificate with ID: ${certId}`);
      }
    }

    console.log("Seeding enrollments and certificate completed!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding enrollments:", err);
    process.exit(1);
  }
};

seedEnrollments();
