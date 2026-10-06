const baseUrl = "http://localhost:3000/api";

const runTests = async () => {
  console.log("==================================================");
  console.log("🧪 STARTING COMPREHENSIVE LEARNX LMS E2E VERIFICATION");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}: ${err.message}`);
      failed++;
    }
  };

  // 1. Health check
  await test("API Gateway Health Check", async () => {
    const res = await fetch(`${baseUrl}/health`).then((r) => r.json());
    if (!res.success) throw new Error(res.message);
  });

  // 2. Fetch Catalog Courses
  let testCourseId = null;
  await test("Fetch Catalog Courses", async () => {
    const res = await fetch(`${baseUrl}/courses`).then((r) => r.json());
    if (!res.success || !res.data || res.data.length === 0) {
      throw new Error("No courses returned");
    }
    testCourseId = res.data[0]._id;
  });

  // 3. Fetch Course Details
  await test("Fetch Course Details with Curriculum", async () => {
    const res = await fetch(`${baseUrl}/courses/${testCourseId}`).then((r) => r.json());
    if (!res.success || !res.data?._id) throw new Error("Course detail not found");
  });

  // 4. Student Authentication
  let studentToken = null;
  await test("Student Login (student@learnx.com)", async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "student@learnx.com", password: "Password@123" }),
    }).then((r) => r.json());

    if (!res.success || !res.token || res.user.role !== "student") {
      throw new Error(res.message || "Login failed");
    }
    studentToken = res.token;
  });

  // 5. Student Enrolled Courses
  await test("Student Enrolled Courses Fetch", async () => {
    const res = await fetch(`${baseUrl}/enrollments/my`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    }).then((r) => r.json());

    if (!res.success || !Array.isArray(res.data)) {
      throw new Error("Failed to fetch student enrollments");
    }
  });

  // 6. Student Progress Tracking
  await test("Student Progress Tracking Query", async () => {
    const res = await fetch(`${baseUrl}/progress/${testCourseId}`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    }).then((r) => r.json());

    if (!res.success) throw new Error(res.message || "Failed to fetch progress");
  });

  // 7. Public Certificate Verification
  await test("Public Certificate Verification (/verify/LX-2026-CS8891)", async () => {
    const res = await fetch(`${baseUrl}/certificates/verify/LX-2026-CS8891`).then((r) => r.json());
    if (!res.success || !res.data) throw new Error("Certificate not verified");
  });

  // 8. Coupon Validation
  await test("Coupon Validation (LEARNX50)", async () => {
    const res = await fetch(`${baseUrl}/coupons/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({ code: "LEARNX50", amount: 2000 }),
    }).then((r) => r.json());

    if (!res.success || !res.data?.discountAmount) {
      throw new Error(res.message || "Coupon application failed");
    }
  });

  // 9. Instructor Authentication & Analytics
  let instructorToken = null;
  await test("Instructor Login (instructor@learnx.com)", async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "instructor@learnx.com", password: "Password@123" }),
    }).then((r) => r.json());

    if (!res.success || !res.token || res.user.role !== "instructor") {
      throw new Error(res.message || "Instructor login failed");
    }
    instructorToken = res.token;
  });

  await test("Instructor Dashboard Overview", async () => {
    const res = await fetch(`${baseUrl}/instructor/dashboard`, {
      headers: { Authorization: `Bearer ${instructorToken}` },
    }).then((r) => r.json());

    if (!res.success || !res.data) throw new Error("Instructor overview failed");
  });

  // 10. Admin Authentication, Dashboard & Audit Logs
  let adminToken = null;
  await test("Admin Login (admin@learnx.com)", async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@learnx.com", password: "Password@123" }),
    }).then((r) => r.json());

    if (!res.success || !res.token || res.user.role !== "admin") {
      throw new Error(res.message || "Admin login failed");
    }
    adminToken = res.token;
  });

  await test("Admin Dashboard Metrics", async () => {
    const res = await fetch(`${baseUrl}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((r) => r.json());

    if (!res.success || !res.data) throw new Error("Admin metrics failed");
  });

  await test("Admin Audit Trail Retrieval", async () => {
    const res = await fetch(`${baseUrl}/admin/audit-logs`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((r) => r.json());

    if (!res.success || !Array.isArray(res.data)) throw new Error("Audit logs failed");
  });

  console.log("==================================================");
  console.log(`🏁 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) process.exit(1);
  else process.exit(0);
};

runTests();
