import { createLocation, getAllLocations, deleteLocation } from "../../Locatii/service.js";
import { createAdminPage } from "../functions.js";

export async function createLocationPage(userId,role) {
    const container = document.querySelector(".container");

    container.innerHTML = `
        <div class="admin-subpage">
            <h1>Adaugă Locație</h1>
            <form id="create-location-form">
                <input type="text" id="oras" placeholder="Oraș" required>
                <input type="text" id="strada" placeholder="Stradă" required>
                <input type="number" id="numar" placeholder="Număr" required>
                <button type="submit">Adaugă</button>
            </form>
            <h2>Toate Locațiile</h2>
            <ul class="locations-list"></ul>
            <button id="MainPage">Back to MainPage</button>
        </div>
    `;

    const form = document.getElementById("create-location-form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const location = {
            oras: document.getElementById("oras").value,
            strada: document.getElementById("strada").value,
            numar: document.getElementById("numar").value
        };

        await createLocation(location);
        createLocationPage(userId,role);
    });

    const response = await getAllLocations();
    if (response.status === 200) {
        const list = document.querySelector(".locations-list");
        response.body.forEach(l => {
            const item = document.createElement("li");
            item.innerHTML = `
                ${l.oras}, Str. ${l.strada} ${l.numar}
                <button class="delete-btn" data-id="${l.id}">Șterge</button>
            `;
            item.querySelector(".delete-btn").addEventListener("click", async () => {
                await deleteLocation(l.id);
                createLocationPage(userId,role);
            });
            list.appendChild(item);
        });
    }

    document.getElementById("MainPage").addEventListener("click", () => {
        createAdminPage(userId,role);
    });
}

