// const BASE_URL = "http://localhost:3000/api/";
const BASE_URL = "https://future-focus-classes-backend.vercel.app/api/";

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
