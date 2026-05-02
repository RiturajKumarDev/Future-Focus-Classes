// const BASE_URL = "http://localhost:3000/api/";
const BASE_URL = "https://future-focus-classes-backend.vercel.app/api/";

export const getTechersToServer = async () => {
    const response = await fetch(`${BASE_URL}teacher/teachers`);
    return response;
}

export const getTeacherToServer = async () => {
    const response = await fetch(`${BASE_URL}course/courses`);
    return response;
}
