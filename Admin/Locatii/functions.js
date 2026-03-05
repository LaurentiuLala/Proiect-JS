import { createLocation, getAllLocations, deleteLocation, updateLocation } from "../../Locatii/service.js";
import { createAdminPage } from "../functions.js";

export async function createLocationPage(userId, role) {
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
        createLocationPage(userId, role);
    });

    const response = await getAllLocations();
    if (response.status === 200) {
        const list = document.querySelector(".locations-list");
        response.body.forEach(l => {
            const item = document.createElement("li");
            item.innerHTML = `
                <div class="location-admin-info">
                    ${l.oras}, Str. ${l.strada} ${l.numar}
                </div>
                <div class="location-admin-actions">
                    <button class="edit-btn" data-id="${l.id}">Editează</button>
                    <button class="delete-btn" data-id="${l.id}">Șterge</button>
                </div>
            `;
            item.querySelector(".edit-btn").addEventListener("click", () => {
                openEditLocationModal(l, userId, role);
            });
            item.querySelector(".delete-btn").addEventListener("click", async () => {
                if (confirm("Sigur doriți să ștergeți această locație?")) {
                    await deleteLocation(l.id);
                    createLocationPage(userId, role);
                }
            });
            list.appendChild(item);
        });
    }

    document.getElementById("MainPage").addEventListener("click", () => {
        createAdminPage(userId, role);
    });
}

function openEditLocationModal(location, userId, role) {
    const modal = document.createElement("div");
    modal.className = "modal";

    modal.innerHTML = `
        <div class="modal-content admin-subpage">
            <h2>Editează Locația #${location.id}</h2>
            <form id="edit-location-form">
                <label>Oraș:</label>
                <input type="text" id="edit-oras" value="${location.oras}" required>
                <label>Stradă:</label>
                <input type="text" id="edit-strada" value="${location.strada}" required>
                <label>Număr:</label>
                <input type="number" id="edit-numar" value="${location.numar}" required>
                <div class="modal-buttons">
                    <button type="submit" class="save-changes-button">Salvează Modificările</button>
                    <button type="button" id="close-modal-loc" class="delete-btn">Anulează</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("close-modal-loc").onclick = () => {
        document.body.removeChild(modal);
    };

    document.getElementById("edit-location-form").onsubmit = async (e) => {
        e.preventDefault();
        const updatedLocation = {
            oras: document.getElementById("edit-oras").value,
            strada: document.getElementById("edit-strada").value,
            numar: document.getElementById("edit-numar").value
        };

        const response = await updateLocation(location.id, updatedLocation);
        if (response.status === 200) {
            alert("Locație actualizată cu succes!");
            document.body.removeChild(modal);
            createLocationPage(userId, role);
        } else {
            alert("Eroare la actualizarea locației.");
        }
    };
}

