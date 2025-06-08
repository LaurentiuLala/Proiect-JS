import { getAllCars, getAllLocations } from "../Home/service.js";
import { createRentalPage } from "../Rental/functions.js";
import { createAccountPage } from "../Account/functions.js";
import { createHomePage } from "../Home/functions.js";
import { createClientReviewPage } from "../Review/functions.js";

export async function createCarsPage(userId,role) {
    console.log(role);
    const container = document.querySelector(".container");

    container.innerHTML = `
        <div class="header-container">
            <h1>Cars</h1>
            <div class="navigation-container">
                <a href="#" class ="home-link"><p>Home</p></a>
                <a href="#"><p>About</p></a>
                <a href="#"><p>Contact</p></a>
                <a href="#" class="cars-link"><p>Cars</p></a>
                <a href="#" class = "review-link"><p>Reviews</p></a>
            </div>
            <div class="navigation-container-icons">
                <a href="#" class="user-icon"><i class="fa-regular fa-user"></i></a>
            </div>
        </div>

        <div class="filter-container">
            <label for="location-select">Filtrează după locație:</label>
            <select id="location-select">
                <option value="all">Toate locațiile</option>
            </select>
        </div>

        <div class="main-container">
            <div class="products-container">
                <div class="title">
                    <h1>Available Cars</h1>
                </div>
                <div class="card-section">
                    <!-- Car cards will be rendered here -->
                </div>
            </div>
        </div>
    `;

    document.querySelector('.user-icon').addEventListener("click", () => {createAccountPage(userId,role); });
    container.querySelector(".home-link").addEventListener("click", () => createHomePage(userId,role));
    container.querySelector(".cars-link").addEventListener("click", () => createCarsPage(userId,role));
    container.querySelector(".review-link").addEventListener("click", () => createClientReviewPage(userId,role));

    const carsResponse = await getAllCars();
    const locationsResponse = await getAllLocations();

    if (carsResponse.status !== 200 || locationsResponse.status !== 200) {
        document.querySelector('.card-section').innerHTML = `<p>Eroare la încărcarea datelor.</p>`;
        return;
    }

    const cars = carsResponse.body;
    const locations = locationsResponse.body;


    const locatiiMap = new Map();
    locations.forEach(loc => {
        const descriere = `${loc.oras}, ${loc.strada} ${loc.numar}`;
        locatiiMap.set(loc.id, descriere);
    });

    const select = document.getElementById("location-select");
    locations.forEach(loc => {
        const option = document.createElement("option");
        option.value = loc.id;
        option.textContent = `${loc.oras}, ${loc.strada} ${loc.numar}`;
        select.appendChild(option);
    });


    cars.forEach(car => {
        car.locatieDescriere = locatiiMap.get(car.locatieId) || "Necunoscută";
    });

    renderCars(cars, userId,role);

    select.addEventListener("change", () => {
        const selectedId = select.value;
        const filteredCars = selectedId === "all"
            ? cars
            : cars.filter(c => c.locatieId == selectedId);
        renderCars(filteredCars, userId,role);
    });
}

function renderCars(cars, userId,role) {
    const cardSection = document.querySelector(".card-section");
    cardSection.innerHTML = "";

    cars.map(car => createCarCard(car, userId,role)).forEach(card => {
        cardSection.appendChild(card);
    });
}

function createCarCard(car, userId, role) {
    const div = document.createElement("div");
    div.classList.add("product-card");

    const isAvailable = car.disponibil;

    div.innerHTML = `
        <img src="assets/imgs/test.jpg" alt="Imagine mașină">
        <p><strong>${car.marca} ${car.model}</strong></p>
        <p class="description">An fabricație: ${car.anFabricatie}</p>
        <p class="description">Locație: ${car.locatieDescriere}</p>
        <p><strong>${car.pretPeZi} Lei </strong> / zi</p>
        ${isAvailable
            ? `<button class="rent-now-btn" data-id="${car.id}">Închiriază</button>`
            : `<p style="color: red; font-weight: bold;">Not Available</p>`
        }
    `;

    if (isAvailable) {
        div.querySelector(".rent-now-btn").addEventListener("click", () => {
            createRentalPage(userId, car.id, role);
        });
    }

    return div;
}

