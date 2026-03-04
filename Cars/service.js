import { apiFetch } from "../Core/service.js";

export async function getAllCars() {
    return await apiFetch("/masini", "GET");
}

export async function getCarById(carId) {
    return await apiFetch(`/masini/${carId}`, "GET");
}

export async function getCarsByLocation(locatieId) {
    return await apiFetch(`/masini/by-location/${locatieId}`, "GET");
}

export async function createCar(carDTO) {
    return await apiFetch("/masini", "POST", carDTO);
}

export async function deleteCar(carId) {
    return await apiFetch(`/masini/${carId}`, "DELETE");
}
