import { getToken } from './appState.js';

function apiInchirieri(path, method = "GET", body = null) {
    const url = "http://localhost:8080/api/inchirieri/" + path;
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

export async function getInchirieri() {
    try {
        let response = await apiInchirieri("");
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

export async function createInchiriere(inchiriereRequest) {
    try {
        let response = await apiInchirieri("", "POST", inchiriereRequest);
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