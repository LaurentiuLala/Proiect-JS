import { apiFetch } from "../Home/service.js";

export async function getUserById(userId) {
    return await apiFetch(`/users/getUserById/${userId}`, "GET");
}

export async function updateUser(userId, updateRequest) {
    return await apiFetch(`/users/update/${userId}`, "PUT", updateRequest);
}

export async function getRentalsByUserId(userId) {
    return await apiFetch(`/inchirieri/user/${userId}`, "GET");
}
