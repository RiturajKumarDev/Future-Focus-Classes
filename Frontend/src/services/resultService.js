import { API_BASE_URL as BASE_URL } from "./api";

export const uploadStudentResultToServer = async (studentResult) => {
    const response = await fetch(`${BASE_URL}result/saveResult`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(studentResult),
    });
    return response;
}

export const getStudentResultsToServer = async () => {
    const response = await fetch(`${BASE_URL}result/getResults`);
    return response;
}
