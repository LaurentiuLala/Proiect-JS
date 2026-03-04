import { apiFetch } from "../Core/service.js";

export async function getAllReviews() {
    return await apiFetch("/review", "GET");
}

export async function createReview(reviewRequest) {
    return await apiFetch("/review", "POST", reviewRequest);
}

export async function deleteReview(reviewId) {
    return await apiFetch(`/review/${reviewId}`, "DELETE");
}
