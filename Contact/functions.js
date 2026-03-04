import { createHomePage } from "../Home/functions.js";
import { createCarsPage } from "../Cars/functions.js";
import { createClientReviewPage } from "../Review/functions.js";
import { createAccountPage } from "../Account/functions.js";
import { handleLogout } from "../Logout/functions.js";
import { createAboutPage } from "../About/functions.js";

export function createContactPage(userId, role) {
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

        <div class="contact-page" style="padding: 50px; text-align: center;">
            <h1>Contact Us</h1>
            <div style="max-width: 600px; margin: 30px auto; text-align: left; background: #f9f9f9; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <p><strong>Email:</strong> support@rentapp.ro</p>
                <p><strong>Phone:</strong> +40 700 000 000</p>
                <p><strong>Address:</strong> 123 Main Street, City Center, Romania</p>
                <hr style="margin: 20px 0;">
                <h3>Send us a message</h3>
                <form id="contact-form">
                    <input type="text" placeholder="Your Name" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;">
                    <input type="email" placeholder="Your Email" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;">
                    <textarea placeholder="Message" style="width: 100%; padding: 10px; margin-bottom: 10px; height: 100px; border: 1px solid #ccc; border-radius: 5px;"></textarea>
                    <button type="submit" style="background: #333; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Send Message</button>
                </form>
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

    document.getElementById("contact-form").addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Message sent! We'll get back to you soon.");
    });
}
