import { getAllRentals, deleteRental, updateRentalStatus } from "../../Rental/service.js";
import { getUserById } from "../../User/service.js";
import { getCarById } from "../../Cars/service.js";
import { createAdminPage } from "../functions.js";

export async function seeAllRentPage(userId, role) {
    const container = document.querySelector(".container");

    container.innerHTML = `
        <div class="admin-subpage">
            <h1>Toate Închirierile</h1>
            <div class="search-section">
                <input type="text" id="searchInput" placeholder="Caută după cod închiriere...">
                <button id="searchBtn">Caută</button>
            </div>
            <ul class="rents-list"></ul>
            <button id="MainPage">Înapoi la Pagina Principală</button>
        </div>
    `;

    const response = await getAllRentals();
    if (response.status === 200) {
        const rentals = response.body;
        const list = document.querySelector(".rents-list");

        const renderRentals = async (filteredRentals) => {
            list.innerHTML = "";
            for (const r of filteredRentals) {
                let userName = "User necunoscut";
                let masinaName = "Mașină necunoscută";

                if (r.userId) {
                    const userResp = await getUserById(r.userId);
                    if (userResp.status === 200) {
                        userName = `${userResp.body.name} ${userResp.body.lastName}`;
                    }
                }

                if (r.masinaId) {
                    const masinaResp = await getCarById(r.masinaId);
                    if (masinaResp.status === 200) {
                        masinaName = `${masinaResp.body.marca} ${masinaResp.body.model}`;
                    }
                }

                const item = document.createElement("li");
                item.className = "rental-item";
                item.innerHTML = `
                    <div class="rental-info">
                        <strong>Închiriere #${r.id}</strong> | Cod: <span class="rental-code">${r.code}</span><br>
                        User: ${userName} | Mașina: ${masinaName}<br>
                        Perioada: ${r.dataInceput} până la ${r.dataSfarsit}<br>
                        Status: <span class="status-badge status-${r.status.toLowerCase()}">${r.status}</span>
                    </div>
                    <div class="rental-actions">
                        <select class="status-select" data-code="${r.code}">
                            <option value="PENDING" ${r.status === 'PENDING' ? 'selected' : ''}>PENDING</option>
                            <option value="RENTED" ${r.status === 'RENTED' ? 'selected' : ''}>RENTED</option>
                            <option value="RETURNED" ${r.status === 'RETURNED' ? 'selected' : ''}>RETURNED</option>
                            <option value="CANCELED" ${r.status === 'CANCELED' ? 'selected' : ''}>CANCELED</option>
                        </select>
                        <button class="update-status-btn" data-code="${r.code}">Actualizează Status</button>
                        <button class="delete-btn" data-id="${r.id}">Șterge</button>
                    </div>
                `;

                item.querySelector(".update-status-btn").addEventListener("click", async (e) => {
                    const code = e.target.getAttribute("data-code");
                    const select = item.querySelector(".status-select");
                    const newStatus = select.value;
                    const updateResp = await updateRentalStatus(code, newStatus);
                    if (updateResp.status === 200) {
                        alert(`Status actualizat cu succes pentru închirierea ${code}`);
                        seeAllRentPage(userId, role);
                    } else {
                        alert("Eroare la actualizarea statusului.");
                    }
                });

                item.querySelector(".delete-btn").addEventListener("click", async () => {
                    if (confirm("Sigur doriți să ștergeți această închiriere?")) {
                        await deleteRental(r.id);
                        seeAllRentPage(userId, role);
                    }
                });

                list.appendChild(item);
            }
        };

        renderRentals(rentals);

        document.getElementById("searchBtn").addEventListener("click", () => {
            const query = document.getElementById("searchInput").value.trim().toUpperCase();
            const filtered = rentals.filter(r => r.code.toUpperCase().includes(query));
            renderRentals(filtered);
        });

        document.getElementById("searchInput").addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                document.getElementById("searchBtn").click();
            }
        });
    }

    document.getElementById("MainPage").addEventListener("click", () => {
        createAdminPage(userId, role);
    });
}
