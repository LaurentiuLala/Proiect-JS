import { apiFetch } from "../Core/service.js";

export async function getAllLocations() {
    return await apiFetch("/locatii", "GET");
}

export async function createLocation(locationDTO) {
    return await apiFetch("/locatii", "POST", locationDTO);
}

export async function deleteLocation(locationId) {
    return await apiFetch(`/locatii/${locationId}`, "DELETE");
}
