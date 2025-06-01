import { apiFetch } from "../../Home/service.js";
import { createAdminPage } from "../functions.js";

export async function createMasinaPage(userId,role) {
    const container = document.querySelector(".container");

    container.innerHTML = `
        <div class="admin-subpage">
            <h1>Adaugă Mașină</h1>
            <form id="create-car-form">
                <input type="text" id="marca" placeholder="Marca" required>
                <input type="text" id="model" placeholder="Model" required>
                <input type="number" id="anFabricatie" placeholder="An fabricație" required>
                <input type="number" id="pretPeZi" placeholder="Preț pe zi" required>
                <select id="locatieId" required>
                    <option value="">Selectează locația</option>
                </select>
                <button type="submit">Adaugă</button>
            </form>
            <h2>Toate Mașinile</h2>
            <ul class="cars-list"></ul>
            <button id="MainPage">Back to MainPage</button>
        </div>
    `;


    const locatieSelect = document.getElementById("locatieId");
const locatiiResponse = await apiFetch("/locatii");

if (locatiiResponse.status === 200) {
    locatiiResponse.body.forEach(locatie => {
        const option = document.createElement("option");
        option.value = locatie.id;
        option.textContent = `[ID: ${locatie.id}] ${locatie.oras}, Str. ${locatie.strada} ${locatie.numar}`;
        locatieSelect.appendChild(option);
    });
}


    const form = document.getElementById("create-car-form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const car = {
            marca: document.getElementById("marca").value,
            model: document.getElementById("model").value,
            anFabricatie: document.getElementById("anFabricatie").value,
            pretPeZi: document.getElementById("pretPeZi").value,
            locatieId: document.getElementById("locatieId").value
        };

        await apiFetch("/masini", "POST", car);
        createMasinaPage();
    });

    const response = await apiFetch("/masini");
    if (response.status === 200) {
        const list = document.querySelector(".cars-list");
        response.body.forEach(m => {
            const item = document.createElement("li");
            item.innerHTML = `
                ${m.marca} ${m.model} (${m.anFabricatie}) - ${m.pretPeZi} Lei
                <button class="delete-btn" data-id="${m.id}">Șterge</button>
            `;
            item.querySelector(".delete-btn").addEventListener("click", async () => {
                await apiFetch(`/masini/${m.id}`, "DELETE");
                createMasinaPage();
            });
            list.appendChild(item);
        });
    }

    document.getElementById("MainPage").addEventListener("click", () => {
        createAdminPage(userId,role);
    });
}
