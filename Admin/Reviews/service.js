import { apiFetch } from "../../Home/service.js";

export async function getAllReviews() {
    return await apiFetch("/reviews");
}

export async function createReview(review) {
    return await apiFetch("/reviews", "POST", review);
}

export async function deleteReviewById(id, userId, role) {
    return await apiFetch(`/reviews/${id}?userId=${userId}&role=${role}`, "DELETE");
}

export async function getCurrentUserById(id) {
    return await apiFetch(`/users/account/${id}`);
}
