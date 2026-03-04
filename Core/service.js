export const BASE_URL = "http://localhost:8080/api";

export async function apiFetch(path, method = "GET", body = null) {
    const headers = {
        'Content-Type': 'application/json; charset=utf-8'
    };

    const auth = localStorage.getItem("auth");
    const isPublicPath = path === "/users/login" || path === "/users/register";

    if (auth && !isPublicPath) {
        headers['Authorization'] = `Basic ${auth}`;
    }

    const options = {
        method,
        headers
    };

    if (body !== null) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${path}`, options);

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return {
            status: response.status,
            body: data
        };
    } else {
        const text = await response.text();
        return {
            status: response.status,
            body: text
        };
    }
}
