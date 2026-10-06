const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getTechersToServer = async () => {
    const response = await fetch(`${BASE_URL}teacher/teachers`);
    return response;
}

export const getTeacherToServer = async () => {
    const response = await fetch(`${BASE_URL}course/courses`);
    return response;
}
