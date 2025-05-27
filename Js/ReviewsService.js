import { getToken } from './appState.js';

function apiReviews(path, method = "GET", body = null) {
    const url = "http://localhost:8080/api/reviews/" + path;
    const token = getToken();
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Requested-With': 'XMLHttpRequest',
            'Authorization': 'Bearer ' + token
        }
    }
    if (body != null) {
        options.body = JSON.stringify(body);
    }
    return fetch(url, options);
}

export async function getReviews() {
    try {
        let response = await apiReviews("");
        let data = await response.json();
        return {
            status: response.status,
            success: response.ok,
            body: data
        };
    } catch (err) {
        return { success: false, message: err.message };
    }
}

export async function createReview(reviewRequest) {
    try {
        let response = await apiReviews("", "POST", reviewRequest);
        let data = await response.json();
        return {
            status: response.status,
            success: response.ok,
            body: data
        };
    } catch (err) {
        return { success: false, message: err.message };
    }
}