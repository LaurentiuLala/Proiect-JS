import { getAllReviews, createReview, deleteReviewById } from "./service.js";
import { createAdminPage } from "../functions.js";
import { apiFetch } from "../../Home/service.js";

export async function createReviewPage(userId, role) {
    const container = document.querySelector(".container");

    container.innerHTML = `
        <div class="admin-subpage">
            <h1>Recenzii</h1>
            <form id="create-review-form">
                <select id="masinaId" required>
                    <option value="">Selectează Mașina</option>
                </select>

                <textarea id="comentariu" placeholder="Comentariu" rows="3" required></textarea>

                <select id="rating" required>
                    <option value="">Selectează Rating</option>
                    <option value="1">⭐</option>
                    <option value="2">⭐⭐</option>
                    <option value="3">⭐⭐⭐</option>
                    <option value="4">⭐⭐⭐⭐</option>
                    <option value="5">⭐⭐⭐⭐⭐</option>
                </select>

                <button type="submit">Adaugă Recenzie</button>
            </form>

            <h2>Toate Recenziile</h2>
            <ul class="reviews-list"></ul>

            <button id="MainPage">Înapoi la Pagina Principală</button>
        </div>
    `;

    const masinaSelect = document.getElementById("masinaId");
    const masiniResp = await apiFetch("/masini");
    if (masiniResp.status === 200) {
        masiniResp.body.forEach(m => {
            const option = document.createElement("option");
            option.value = m.id;
            option.textContent = `${m.marca} ${m.model} (${m.anFabricatie})`;
            masinaSelect.appendChild(option);
        });
    }

    const form = document.getElementById("create-review-form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const review = {
            userId: userId,
            masinaId: document.getElementById("masinaId").value,
            comentariu: document.getElementById("comentariu").value,
            rating: Number(document.getElementById("rating").value)
        };

        await createReview(review);
        createReviewPage(userId, role); 
    });

    const response = await getAllReviews();
    if (response.status === 200) {
        const list = document.querySelector(".reviews-list");
        list.innerHTML = "";

        for (const r of response.body) {
            const userResp = await apiFetch(`/users/account/${r.userId}`);
            const masinaResp = await apiFetch(`/masini/${r.masinaId}`);

            const userName = userResp.status === 200 ? userResp.body.nume : r.userId;
            const masinaName = masinaResp.status === 200 ? `${masinaResp.body.marca} ${masinaResp.body.model}` : r.masinaId;

            const item = document.createElement("li");
            item.innerHTML = `
                <strong>Review #${r.id}</strong> - Utilizator: ${userName}, Mașină: ${masinaName} <br>
                Rating: ${r.rating} / 5<br>
                Comentariu: ${r.comentariu}
                <button class="delete-btn" data-id="${r.id}">Șterge</button>
            `;

            item.querySelector(".delete-btn").addEventListener("click", async () => {
                await deleteReviewById(r.id, userId, role); 
                createReviewPage(userId, role); 
            });

            list.appendChild(item);
        }
    }

    document.getElementById("MainPage").addEventListener("click", () => {
        createAdminPage(userId, role);
    });
}

