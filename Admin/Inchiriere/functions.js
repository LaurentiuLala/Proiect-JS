import { apiFetch } from "../../Home/service.js";
import { createAdminPage } from "../functions.js";

export async function seeAllRentPage(userId,role) {
    const container = document.querySelector(".container");

    container.innerHTML = `
        <div class="admin-subpage">
            <h1>Toate Închirierile</h1>
            <ul class="rents-list"></ul>
            <button id="MainPage">Înapoi la Pagina Principală</button>
        </div>
    `;

    const response = await apiFetch("/inchirieri");
    if (response.status === 200) {
        const list = document.querySelector(".rents-list");

        for (const r of response.body) {
            let userName = "User necunoscut";
            let masinaName = "Mașină necunoscută";

            if (r.user && r.user.name && r.user.lastName) {
                userName = `${r.user.name} ${r.user.lastName}`;
            } else if (r.userId) {
                const userResp = await apiFetch(`/users/getUserById/${r.userId}`);
                if (userResp.status === 200) {
                    userName = `${userResp.body.name} ${userResp.body.lastName}`;
                }
            }

            if (r.masina && r.masina.marca && r.masina.model) {
                masinaName = `${r.masina.marca} ${r.masina.model}`;
            } else if (r.masinaId) {
                const masinaResp = await apiFetch(`/masini/${r.masinaId}`);
                if (masinaResp.status === 200) {
                    masinaName = `${masinaResp.body.marca} ${masinaResp.body.model}`;
                }
            }

            const item = document.createElement("li");
            item.innerHTML = `
                Închiriere #${r.id}: User ${userName} - Mașina ${masinaName}
                (${r.dataInceput} până la ${r.dataSfarsit})
                <button class="delete-btn" data-id="${r.id}">Șterge</button>
            `;

            item.querySelector(".delete-btn").addEventListener("click", async () => {
                await apiFetch(`/inchirieri/${r.id}`, "DELETE");
                seeAllRentPage();
            });

            list.appendChild(item);
        }
    }

    document.getElementById("MainPage").addEventListener("click", () => {
        createAdminPage(userId,role);
    });
}
