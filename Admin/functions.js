import { createMasinaPage } from "./Masini/functions.js";
import { createAdminUsersPage } from "./Users/functions.js";
import { createLocationPage } from "./Locatii/functions.js";
import { seeAllRentPage } from "./Inchiriere/functions.js";
import { createReviewPage } from "./Reviews/functions.js";
import { createLogPage } from "./Logs/functions.js";
import { handleLogout } from "../Logout/functions.js";

export function createAdminPage(userId, role) {
    const container = document.querySelector(".container");

    container.innerHTML = `
        <div class="header-container">
            <h1>Admin Panel</h1>
            <div class="navigation-container-icons">
                <a href="#" class="logout-icon" title="Logout"><i class="fa-solid fa-right-from-bracket"></i></a>
            </div>
        </div>
        <div class="admin-page">
            <h1>Admin Dashboard</h1>
            <div class="admin-buttons">
                <button class="admin-btn" id="add-car">Adaugă Mașină</button>
                <button class="admin-btn" id="manage-users">Utilizatori</button>
                <button class="admin-btn" id="add-location">Adaugă Locație</button>
                <button class="admin-btn" id="view-rentals">Vezi Închirieri</button>
                <button class="admin-btn" id="btnReview">Review-uri</button>
                <button class="admin-btn" id="btnLoguri">Loguri</button> 
        </div>
    `;

    document.querySelector('.logout-icon').addEventListener("click", () => handleLogout());

    document.getElementById("add-car").addEventListener("click", () => {
        createMasinaPage(userId, role);
    });

    document.getElementById("manage-users").addEventListener("click", () => {
        createAdminUsersPage(userId, role);
    });

    document.getElementById("add-location").addEventListener("click", () => {
        createLocationPage(userId, role);
    });

    document.getElementById("view-rentals").addEventListener("click", () => {
        seeAllRentPage(userId, role);
    });

    document.getElementById("btnReview").addEventListener("click", () => {
        createReviewPage(userId, role);
    });

    document.getElementById("btnLoguri").addEventListener("click", () => { 
        createLogPage(userId, role);
    });
}
