import { getAllReviews, createReview, deleteReview } from "./service.js";
import { getAllCars } from "../Cars/service.js";
import { getUserById } from "../User/service.js";
import { createCarsPage } from "../Cars/functions.js";
import { createAccountPage } from "../Account/functions.js";
import { createHomePage } from "../Home/functions.js";
import { handleLogout } from "../Logout/functions.js";
import { createAboutPage } from "../About/functions.js";
import { createContactPage } from "../Contact/functions.js";

export async function createClientReviewPage(userId, role) {
    const container = document.querySelector(".container");

    container.innerHTML = `
        <div class="header-container">
            <h1>RentApp</h1>
            <div class="navigation-container">
                <a href="#" class="home-link"><p>Home</p></a>
                <a href="#" class="about-link"><p>About</p></a>
                <a href="#" class="contact-link"><p>Contact</p></a>
                <a href="#" class="cars-link"><p>Cars</p></a>
                <a href="#" class="review-link"><p>Reviews</p></a>
            </div>
            <div class="navigation-container-icons">
                <a href="#" class="user-icon" title="Account"><i class="fa-regular fa-user"></i></a>
                <a href="#" class="logout-icon" title="Logout"><i class="fa-solid fa-right-from-bracket"></i></a>
            </div>
        </div>

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

    container.querySelector(".home-link").addEventListener("click", () => createHomePage(userId, role));
    container.querySelector(".about-link").addEventListener("click", () => createAboutPage(userId, role));
    container.querySelector(".contact-link").addEventListener("click", () => createContactPage(userId, role));
    container.querySelector(".user-icon").addEventListener("click", () => createAccountPage(userId, role));
    container.querySelector(".logout-icon").addEventListener("click", () => handleLogout());
    container.querySelector(".cars-link").addEventListener("click", () => createCarsPage(userId, role));
    container.querySelector(".review-link").addEventListener("click", () => createClientReviewPage(userId, role));

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
            masinaId: selectedCarId, // păstrăm ca string, dacă backend așteaptă string
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
                reviews = reviews.filter(r => r.masinaId === filterCarId);
            }

            if (reviews.length === 0) {
                reviewContainer.innerHTML = "<p>Nu există review-uri.</p>";
                return;
            }

            for (const r of reviews) {
                const masina = cars.find(c => c.id === r.masinaId);
                const masinaText = masina ? `${masina.marca} ${masina.model}` : `ID: ${r.masinaId}`;

                let userName = `Utilizator ID: ${r.userId}`;
                try {
                    const userResp = await getUserById(r.userId);
                    if (userResp.status === 200) {
                        const userData = userResp.body;
                        userName = `${userData.name} ${userData.lastName}`;
                    }
                } catch {
                    
                }

                const div = document.createElement("div");
                div.classList.add("review-card");
                div.innerHTML = `
                    <p><strong>Utilizator:</strong> ${userName}</p>
                    <p><strong>Mașină:</strong> ${masinaText}</p>
                    <p><strong>Rating:</strong> ${r.rating}</p>
                    <p>${r.comentariu || r.text || ''}</p>
                    <button class="delete-review" data-id="${r.id}">Șterge</button>
                    <hr>
                `;

                div.querySelector(".delete-review").addEventListener("click", async () => {
                    if (confirm("Ești sigur că vrei să ștergi acest review?")) {
                        const delResponse = await deleteReview(r.id);
                        if (delResponse.status === 204 || delResponse.status === 200) {
                            alert("Review șters cu succes.");
                            loadAndDisplayReviews(filterCarSelect.value);
                        } else {
                            alert("Eroare la ștergerea review-ului.");
                        }
                    }
                });

                reviewContainer.appendChild(div);
            }
        } else {
            reviewContainer.innerHTML = "<p>Eroare la încărcarea review-urilor.</p>";
        }
    }

    loadAndDisplayReviews();

    filterCarSelect.addEventListener("change", () => {
        loadAndDisplayReviews(filterCarSelect.value);
    });
}
