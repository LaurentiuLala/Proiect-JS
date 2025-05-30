import {apiFetch} from "../Home/service.js";
const BASE_URL = "http://localhost:8080/api";
export async function getCarsByLocation(locatieId) {
    return await apiFetch(`/masini/by-location/${locatieId}`, "GET");
}

