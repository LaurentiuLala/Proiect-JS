import { apiFetch } from "../Core/service.js";

export async function login(loginRequest) {
    return await apiFetch("/users/login", "POST", loginRequest);
}

export async function register(userRequest) {
    return await apiFetch("/users/register", "POST", userRequest);
}

export async function getUserById(userId) {
    return await apiFetch(`/users/getUserById/${userId}`, "GET");
}

export async function updateUser(userId, userUpdateDTO) {
    return await apiFetch(`/users/update/${userId}`, "PUT", userUpdateDTO);
}

export async function getAllUsers() {
    return await apiFetch("/users", "GET");
}

export async function deleteUserById(userId) {
    return await apiFetch(`/users/${userId}`, "DELETE");
}

export async function getLogs() {
    return await apiFetch("/masini/logs", "GET");
}
