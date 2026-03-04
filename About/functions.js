import { createHomePage } from "../Home/functions.js";
import { createCarsPage } from "../Cars/functions.js";
import { createClientReviewPage } from "../Review/functions.js";
import { createAccountPage } from "../Account/functions.js";
import { handleLogout } from "../Logout/functions.js";
import { createContactPage } from "../Contact/functions.js";

export function createAboutPage(userId, role) {
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

        <div class="about-page" style="padding: 50px; text-align: center;">
            <h1>About Us</h1>
            <p style="max-width: 800px; margin: 20px auto; line-height: 1.6;">
                Welcome to RentApp, your premier destination for car rentals. We offer a wide range of high-quality vehicles 
                to suit all your travel needs, from compact cars for city trips to spacious SUVs for family vacations.
            </p>
            <p style="max-width: 800px; margin: 20px auto; line-height: 1.6;">
                Founded in 2025, our mission is to provide a fast, easy, and convenient car rental experience. 
                With multiple locations across the country, we are always near you when you need a ride.
            </p>
            <div style="margin-top: 50px;">
                <img src="assets/imgs/test.jpg" alt="Our Fleet" style="width: 100%; max-width: 600px; border-radius: 10px;">
            </div>
        </div>
    `;

    container.querySelector(".home-link").addEventListener("click", () => createHomePage(userId, role));
    container.querySelector(".about-link").addEventListener("click", () => createAboutPage(userId, role));
    container.querySelector(".contact-link").addEventListener("click", () => createContactPage(userId, role));
    container.querySelector(".cars-link").addEventListener("click", () => createCarsPage(userId, role));
    container.querySelector(".review-link").addEventListener("click", () => createClientReviewPage(userId, role));
    container.querySelector(".user-icon").addEventListener("click", () => createAccountPage(userId, role));
    container.querySelector(".logout-icon").addEventListener("click", () => handleLogout());
}
