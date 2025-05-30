import { apiFetch } from "../Home/service.js";

export async function login(loginRequest) {
    try {
        const { status, body } = await apiFetch("/users/login", "POST", loginRequest);
        return { status, success: true, body };
    } catch (err) {
        return { success: false, message: err.message || "Login failed" };
    }
}

export async function register(userRequest) {
    try {
        const { status, body } = await apiFetch("/users/register", "POST", userRequest);
        return { status, success: true, body };
    } catch (err) {
        return { success: false, message: err.message || "Register failed" };
    }
}
