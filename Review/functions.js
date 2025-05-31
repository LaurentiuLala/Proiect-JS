import { getAllReviews, createReview, deleteReviewByIdClient } from "./service.js";
import { getAllCars } from "../Home/service.js";

export async function createClientReviewPage(userId, role) 
 {
    const container = document.querySelector(".container");

    container.innerHTML = `
        <div class="client-review-page">
            <h1>Review-uri</h1>
            <div id="review-form">
                <h2>Adaugă un review</h2>
                <label for="carSelect">Mașină:</label>
                <select id="carSelect">
                    <option value="">Selectează mașina</option>
                </select>
                <label for="reviewText">Review:</label>
                <textarea id="reviewText" placeholder="Scrie ceva..."></textarea>
                <label for="ratingSelect">Rating (1-5):</label>
                <select id="ratingSelect">
                    <option value="">Selectează rating</option>
                    <option value="1">⭐</option>
                    <option value="2">⭐⭐</option>
                    <option value="3">⭐⭐⭐</option>
                    <option value="4">⭐⭐⭐⭐</option>
                    <option value="5">⭐⭐⭐⭐⭐</option>
                </select>
                <button id="submitReview">Trimite Review</button>
            </div>

            <div id="filter-section" style="margin-top: 30px;">
                <h2>Filtrează review-uri după mașină</h2>
                <select id="filterCarSelect">
                    <option value="">Toate mașinile</option>
                </select>
            </div>

            <div class="client-reviews-list" style="margin-top: 20px;">
                <h2>Recenzii</h2>
                <div id="userReviews"></div>
            </div>
        </div>
    `;

    const carSelect = document.getElementById("carSelect");
    const filterCarSelect = document.getElementById("filterCarSelect");

    const carsResponse = await getAllCars();
    if (carsResponse.status !== 200) {
        alert("Eroare la încărcarea mașinilor.");
        return;
    }
    const cars = carsResponse.body;


    cars.forEach(car => {
        const option1 = document.createElement("option");
        option1.value = car.id;
        option1.textContent = `${car.marca} ${car.model}`;
        carSelect.appendChild(option1);

        const option2 = document.createElement("option");
        option2.value = car.id;
        option2.textContent = `${car.marca} ${car.model}`;
        filterCarSelect.appendChild(option2);
    });

    document.getElementById("submitReview").addEventListener("click", async () => {
        const selectedCarId = carSelect.value;
        const text = document.getElementById("reviewText").value.trim();
        const rating = document.getElementById("ratingSelect").value;

        if (!selectedCarId || !text || !rating) {
            alert("Toate câmpurile sunt obligatorii!");
            return;
        }

        const reviewRequest = {
            userId: userId,
            masinaId: parseInt(selectedCarId),
            comentariu: text,
            rating: parseInt(rating)
        };

        const response = await createReview(reviewRequest);
        if (response.status === 200 || response.status === 201) {
            alert("Review adăugat!");
            loadAndDisplayReviews(filterCarSelect.value);
        } else {
            alert("Eroare la adăugarea review-ului.");
        }
    });

    async function loadAndDisplayReviews(filterCarId = "") {
        const response = await getAllReviews();
        const reviewContainer = document.getElementById("userReviews");
        reviewContainer.innerHTML = "";

        if (response.status === 200) {
            let reviews = response.body;

            if (filterCarId) {
                reviews = reviews.filter(r => r.masinaId == filterCarId);
            }

            if (reviews.length === 0) {
                reviewContainer.innerHTML = "<p>Nu există review-uri.</p>";
                return;
            }

            reviews.forEach(r => {

                const masina = cars.find(c => c.id === r.masinaId);
                const masinaText = masina ? `${masina.marca} ${masina.model}` : `ID: ${r.masinaId}`;

                const div = document.createElement("div");
                div.classList.add("review-card");
                div.innerHTML = `
                    <p><strong>Mașină:</strong> ${masinaText}</p>
                    <p><strong>Rating:</strong> ${r.rating}</p>
                    <p>${r.comentariu || r.text || ''}</p>
                    <button class="delete-review" data-id="${r.id}">Șterge</button>
                    <hr>
                `;

                div.querySelector(".delete-review").addEventListener("click", async () => {
                    const confirmDelete = confirm("Ești sigur că vrei să ștergi acest review?");
                    if (confirmDelete) {
                        const delResponse = await deleteReviewByIdClient(r.id, userId, role);
                        if (delResponse.status === 204) {
                            alert("Review șters cu succes.");
                            loadAndDisplayReviews(filterCarSelect.value);
                        } else {
                            alert("Eroare la ștergerea review-ului.");
                        }
                    }
                });

                reviewContainer.appendChild(div);
            });
        } else {
            reviewContainer.innerHTML = "<p>Eroare la încărcarea review-urilor.</p>";
        }
    }

    loadAndDisplayReviews();

    filterCarSelect.addEventListener("change", () => {
        loadAndDisplayReviews(filterCarSelect.value);
    });
}
