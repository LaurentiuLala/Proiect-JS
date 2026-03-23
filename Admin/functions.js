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
            <p>Manage your fleet, users, and rentals</p>
            <div class="admin-buttons">
                <button class="admin-btn" id="add-car"><i class="fa-solid fa-car" style="margin-right: 8px;"></i>Cars</button>
                <button class="admin-btn" id="manage-users"><i class="fa-solid fa-users" style="margin-right: 8px;"></i>Users</button>
                <button class="admin-btn" id="add-location"><i class="fa-solid fa-location-dot" style="margin-right: 8px;"></i>Locations</button>
                <button class="admin-btn" id="view-rentals"><i class="fa-solid fa-key" style="margin-right: 8px;"></i>Rentals</button>
                <button class="admin-btn" id="btnReview"><i class="fa-solid fa-star" style="margin-right: 8px;"></i>Reviews</button>
                <button class="admin-btn" id="btnLoguri"><i class="fa-solid fa-clock-rotate-left" style="margin-right: 8px;"></i>Logs</button>
            </div>
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
