import { API_BASE_URL as BASE_URL } from "./api";

export const getTechersToServer = async () => {
    const response = await fetch(`${BASE_URL}teacher/teachers`);
    return response;
}

export const getTeacherToServer = async () => {
    const response = await fetch(`${BASE_URL}course/courses`);
    return response;
}
