const BASE_URL = "http://localhost:8080/api";

export async function apiFetch(path, method = "GET", body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Requested-With': 'XMLHttpRequest'
        }
    };

    if (body !== null) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${path}`, options);

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return {
            status: response.status,
            body: data
        };
    } else {
        const text = await response.text();
        return {
            status: response.status,
            body: text
        };
    }
}

export async function getAllCars() {
    return await apiFetch("/masini", "GET");
}

export async function getCarById(carId) {
    return await apiFetch(`/masini/${carId}`, "GET");
}

export async function rentCar(rentalRequest) {
    return await apiFetch("/inchirieri", "POST", rentalRequest);
}

export async function getAllLocations() {
    return await apiFetch("/locatii", "GET");
}

