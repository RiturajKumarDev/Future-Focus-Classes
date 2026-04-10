const BASE_URL = "http://localhost:3000/api/";

export const uploadCourseToServer = async (course) => {
    const response = await fetch(`${BASE_URL}course/createCourse`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
    });
    return response;
}

export const getCoursesToServer = async () => {
    const response = await fetch(`${BASE_URL}course/courses`);
    return response;
}
