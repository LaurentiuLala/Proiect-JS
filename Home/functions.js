import { createAccountPage } from "../Account/functions.js";
import { createRentalPage } from "../Rental/functions.js";
import { getAllCars } from "./service.js";
import { createCarsPage } from "../Cars/functions.js";
import { createClientReviewPage } from "../Review/functions.js";

export async function loadCars(offset = 0, limit = 8, userId,role) {
    try {
        let response = await getAllCars();
        let cars = response.body;

        let limitedCars = cars.slice(offset, offset + limit);
        attachCarCards(limitedCars, userId,role);

        if (offset + limit >= cars.length) {
            const showMore = document.querySelector('.show-more-button');
            showMore.style.display = 'none';
        }
    } catch (err) {
        console.log("Eroare la încărcarea mașinilor:", err);
    }
}


export async function createHomePage(userId,role) {
    console.log(role);
    let container = document.querySelector(".container");
    let ct = 0;
    const limit = 8;

    container.innerHTML = `
<div class="header-container">
    <h1>RentApp</h1>
    <div class="navigation-container">
        <a href="#" class="home-link"><p>Home</p></a>
        <a href="#"><p>About</p></a>
        <a href="#"><p>Contact</p></a>
        <a href="#" class = "cars-link"><p>Cars</p></a>
        <a href="#" class = "review-link"><p>Reviews</p></a>
    </div>
    <div class="navigation-container-icons">
        <a href="#" class="user-icon"><i class="fa-regular fa-user"></i></a>
    </div>
</div>

<div class="aside-container">
    <div class="content-container">
        <p class="line-space">Discover Deals</p>
        <h2>Book Your Next Ride</h2>
        <p>Fast, easy, and convenient. Explore our collection of premium vehicles for your next trip.</p>
    </div>
</div>

<div class="main-container">
    <div class="products-container">
        <div class="title">
            <h1>Available Cars</h1>
        </div>
        <div class="card-section">
        </div>
        <button class="show-more-button">Show More</button>
    </div>

    <div class="setup-container">
        <p>Share your experience with</p>
        <h1>#RentApp</h1>
        <img src="assets/imgs/setup.png" alt="setup banner">
    </div>
</div>

<div class="footer-container">
    <hr width="100%"/>
    <div class="footer-section">
        <div class="address-section">
            <h4>RentApp</h4>
            <p class="description">123 Main Street, City Center <br> Romania</p>
        </div>
        <div class="links-section">
            <a href="#"><p>Home</p></a>
            <a href="#"><p>Cars</p></a>
            <a href="#"><p>About</p></a>
            <a href="#"><p>Contact</p></a>
        </div>
        <div class="help-section">
            <p class="description">Help</p>
            <a href="#"><p>FAQ</p></a>
            <a href="#"><p>Terms</p></a>
            <a href="#"><p>Privacy</p></a>
        </div>
    </div>
    <hr width="80%"/>
    <div class="end-section">
        <p>2025 RentApp. All rights reserved.</p>
    </div>
</div>
    `;
    document.querySelector('.user-icon').addEventListener("click", () => {createAccountPage(userId,role); });
    container.querySelector(".home-link").addEventListener("click", () => createHomePage(userId,role));
    container.querySelector(".cars-link").addEventListener("click", () => createCarsPage(userId,role));
    container.querySelector(".review-link").addEventListener("click", () => createClientReviewPage(userId,role));

    const userIcon = document.querySelector('.user-icon');
    userIcon.addEventListener('click', () => {
        createAccountPage(userId,role);
    });

    const showMore = document.querySelector('.show-more-button');
    showMore.addEventListener('click', () => {
        ct += limit;
        loadCars(ct, limit, userId,role);
    });

    loadCars(ct, limit, userId,role);
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


function attachCarCards(cars, userId,role) {
    let cardSection = document.querySelector('.card-section');
    cars.map(car => createCarCard(car, userId,role)).forEach(card => {
        cardSection.appendChild(card);
    });
}
