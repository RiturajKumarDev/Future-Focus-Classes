// const BASE_URL = "http://localhost:3000/api/";
const BASE_URL = "https://future-focus-classes-backend.vercel.app/api/";

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
