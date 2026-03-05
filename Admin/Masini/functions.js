import { createCar, getAllCars, deleteCar, uploadCarImages, updateCar, deleteCarImages } from "../../Cars/service.js";
import { getAllLocations } from "../../Locatii/service.js";
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
                <input type="number" id="cantitate" placeholder="Cantitate" required>
                <select id="locatieId" required>
                    <option value="">Selectează locația</option>
                </select>
                <div class="file-upload-section">
                    <p>Încarcă Imagini (multiple):</p>
                    <input type="file" id="car-images" multiple accept="image/*">
                </div>
                <button type="submit">Adaugă</button>
            </form>
            <h2>Toate Mașinile</h2>
            <ul class="cars-list"></ul>
            <button id="MainPage">Back to MainPage</button>
        </div>
    `;


    const locatieSelect = document.getElementById("locatieId");
const locatiiResponse = await getAllLocations();

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
            cantitate: document.getElementById("cantitate").value,
            disponibil: true,
            locatieId: document.getElementById("locatieId").value
        };

        const response = await createCar(car);
        if (response.status === 200) {
            const createdCar = response.body;
            const imageFiles = document.getElementById("car-images").files;
            if (imageFiles.length > 0) {
                await uploadCarImages(createdCar.id, imageFiles);
            }
            alert("Mașină adăugată cu succes!");
            createMasinaPage(userId,role);
        } else {
            alert("Eroare la adăugarea mașinii.");
        }
    });

    const response = await getAllCars();
    if (response.status === 200) {
        const list = document.querySelector(".cars-list");
        response.body.forEach(m => {
            const item = document.createElement("li");
            item.innerHTML = `
                <div class="car-admin-info">
                    <strong>${m.marca} ${m.model}</strong> (${m.anFabricatie}) - ${m.pretPeZi} Lei - Cantitate: ${m.cantitate}
                </div>
                <div class="car-admin-actions">
                    <button class="edit-btn" data-id="${m.id}">Editează</button>
                    <button class="delete-btn" data-id="${m.id}">Șterge</button>
                </div>
            `;
            item.querySelector(".edit-btn").addEventListener("click", () => {
                openEditModal(m, userId, role);
            });
            item.querySelector(".delete-btn").addEventListener("click", async () => {
                if (confirm("Sigur doriți să ștergeți această mașină?")) {
                    await deleteCar(m.id);
                    createMasinaPage(userId, role);
                }
            });
            list.appendChild(item);
        });
    }

    document.getElementById("MainPage").addEventListener("click", () => {
        createAdminPage(userId, role);
    });
}

async function openEditModal(car, userId, role) {
    const modal = document.createElement("div");
    modal.className = "modal";
    const locatiiResponse = await getAllLocations();
    const locatii = locatiiResponse.body || [];

    modal.innerHTML = `
        <div class="modal-content admin-subpage">
            <h2>Editează Mașina #${car.id}</h2>
            <form id="edit-car-form">
                <label>Marca:</label>
                <input type="text" id="edit-marca" value="${car.marca}" required>
                <label>Model:</label>
                <input type="text" id="edit-model" value="${car.model}" required>
                <label>An Fabricație:</label>
                <input type="number" id="edit-anFabricatie" value="${car.anFabricatie}" required>
                <label>Preț pe zi:</label>
                <input type="number" id="edit-pretPeZi" value="${car.pretPeZi}" required>
                <label>Cantitate:</label>
                <input type="number" id="edit-cantitate" value="${car.cantitate}" required>
                <label>Locație:</label>
                <select id="edit-locatieId" required>
                    ${locatii.map(l => `<option value="${l.id}" ${l.id === car.locatieId ? 'selected' : ''}>${l.oras}, ${l.strada} ${l.numar}</option>`).join('')}
                </select>
                <div class="file-upload-section">
                    <p>Adaugă Imagini Noi (va păstra și pe cele vechi):</p>
                    <input type="file" id="edit-car-images" multiple accept="image/*">
                    <button type="button" id="clear-images-btn" class="delete-btn" style="margin-top: 10px; width: auto;">Șterge Toate Imaginile Vechi</button>
                </div>
                <div class="modal-buttons">
                    <button type="submit" class="save-changes-button">Salvează Modificările</button>
                    <button type="button" id="close-modal" class="delete-btn">Anulează</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("close-modal").onclick = () => {
        document.body.removeChild(modal);
    };

    document.getElementById("clear-images-btn").onclick = async () => {
        if (confirm("Sigur doriți să ștergeți TOATE imaginile acestei mașini?")) {
            await deleteCarImages(car.id);
            alert("Imagini șterse!");
        }
    };

    document.getElementById("edit-car-form").onsubmit = async (e) => {
        e.preventDefault();
        const updatedCar = {
            marca: document.getElementById("edit-marca").value,
            model: document.getElementById("edit-model").value,
            anFabricatie: document.getElementById("edit-anFabricatie").value,
            pretPeZi: document.getElementById("edit-pretPeZi").value,
            cantitate: document.getElementById("edit-cantitate").value,
            disponibil: document.getElementById("edit-cantitate").value > 0,
            locatieId: document.getElementById("edit-locatieId").value
        };

        const response = await updateCar(car.id, updatedCar);
        if (response.status === 200) {
            const imageFiles = document.getElementById("edit-car-images").files;
            if (imageFiles.length > 0) {
                await uploadCarImages(car.id, imageFiles);
            }
            alert("Mașină actualizată cu succes!");
            document.body.removeChild(modal);
            createMasinaPage(userId, role);
        } else {
            alert("Eroare la actualizarea mașinii.");
        }
    };
}
