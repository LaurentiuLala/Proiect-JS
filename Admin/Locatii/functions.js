import { apiFetch } from "../../Home/service.js";
import { createAdminPage } from "../functions.js";

export async function createLocationPage(userId) {
    const container = document.querySelector(".container");

    container.innerHTML = `
        <div class="admin-subpage">
            <h1>Adaugă Locație</h1>
            <form id="create-location-form">
                <input type="text" id="oras" placeholder="Oraș" required>
                <input type="text" id="strada" placeholder="Stradă" required>
                <input type="text" id="numar" placeholder="Număr" required>
                <button type="submit">Adaugă</button>
            </form>
            <h2>Toate Locațiile</h2>
            <ul class="locations-list"></ul>
            <button id="MainPage">Înapoi la Pagina Principală</button>
        </div>
    `;

    const form = document.getElementById("create-location-form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const locatie = {
            oras: document.getElementById("oras").value,
            strada: document.getElementById("strada").value,
            numar: document.getElementById("numar").value
        };

        await apiFetch("/locatii", "POST", locatie);
        createLocationPage();
    });

    const response = await apiFetch("/locatii");
    if (response.status === 200) {
        const list = document.querySelector(".locations-list");
        response.body.forEach(loc => {
            const item = document.createElement("li");
            item.innerHTML = `
                ${loc.oras}, ${loc.strada} ${loc.numar}
                <button class="delete-btn" data-id="${loc.id}">Șterge</button>
            `;
            item.querySelector(".delete-btn").addEventListener("click", async () => {
                await apiFetch(`/locatii/${loc.id}`, "DELETE");
                createLocationPage();
            });
            list.appendChild(item);
        });
    }

       document.getElementById("MainPage").addEventListener("click", () => {
          createAdminPage(userId);
      });
}
