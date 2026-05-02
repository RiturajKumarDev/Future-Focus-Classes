const BASE_URL = "http://localhost:3000/api/";

export const getTechersToServer = async () => {
    const response = await fetch(`${BASE_URL}teacher/teachers`);
    return response;
}

export const getTeacherToServer = async () => {
    const response = await fetch(`${BASE_URL}course/courses`);
    return response;
}
