import { apiFetch } from "../../Home/service.js";

export async function getAllUsers() {
    return await apiFetch("/users", "GET");
}

export async function deleteUserById(userId) {
    return await apiFetch(`/users/${userId}`, "DELETE");
}
