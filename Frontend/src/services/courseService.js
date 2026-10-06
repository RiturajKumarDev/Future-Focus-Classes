const BASE_URL = import.meta.env.VITE_BASE_URL;

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
