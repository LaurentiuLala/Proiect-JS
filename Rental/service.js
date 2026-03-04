import { apiFetch } from "../Core/service.js";

export async function createRental(rentalRequest) {
    return await apiFetch("/inchirieri", "POST", rentalRequest);
}

export async function getRentalsByUserId(userId) {
    return await apiFetch(`/inchirieri/user/${userId}`, "GET");
}

export async function getAllRentals() {
    return await apiFetch("/inchirieri", "GET");
}

export async function deleteRental(rentalId) {
    return await apiFetch(`/inchirieri/${rentalId}`, "DELETE");
}
