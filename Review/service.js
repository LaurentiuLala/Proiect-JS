import { apiFetch } from "../Home/service.js";

const REVIEWS_PATH = "/reviews";

export async function getReviewsByUserId(userId) {
    const response = await apiFetch(REVIEWS_PATH, "GET");
    if (response.status !== 200) {
        return response;
    }
    const userReviews = response.body.filter(r => r.userId === userId);
    return {
        status: response.status,
        body: userReviews
    };
}

export async function createReview(reviewRequest) {
    return await apiFetch(REVIEWS_PATH, "POST", reviewRequest);
}

export async function deleteReviewByIdClient(reviewId, userId, role) {
    return apiFetch(`/reviews/${reviewId}?userId=${userId}&role=${role}`, "DELETE");
}


export async function getAllReviews() {
    return apiFetch("/reviews", "GET");
}

