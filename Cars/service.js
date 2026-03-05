import { apiFetch, formDataFetch } from "../Core/service.js";

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

export async function updateCar(carId, carDTO) {
    return await apiFetch(`/masini/${carId}`, "PUT", carDTO);
}

export async function uploadCarImages(carId, files) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
    }
    return await formDataFetch(`/masini/${carId}/images`, "POST", formData);
}

export async function deleteCarImages(carId) {
    return await apiFetch(`/masini/${carId}/images`, "DELETE");
}

export async function deleteCar(carId) {
    return await apiFetch(`/masini/${carId}`, "DELETE");
}
