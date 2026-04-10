const BASE_URL = "http://localhost:3000/api/";

export const registerUserToServer = async (student) => {
    const response = await fetch(`${BASE_URL}student/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
    });
    return response;
}

export const loginUserToServer = async (email, password) => {
    const response = await fetch(`${BASE_URL}student/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });
    return response;
}
