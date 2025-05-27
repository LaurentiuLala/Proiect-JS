import { getToken } from './appState.js';

function apiLocatii(path, method = "GET", body = null) {
    const url = "http://localhost:8080/api/locatii/" + path;
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

export async function getLocatii() {
    try {
        let response = await apiLocatii("");
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

export async function createLocatie(locatieRequest) {
    try {
        let response = await apiLocatii("", "POST", locatieRequest);
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