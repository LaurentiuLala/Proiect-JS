import { getUserById, updateUser, getRentalsByUserId } from "./service.js";
import { createHomePage } from "../Home/functions.js";
import { createCarsPage } from "../Cars/functions.js";
import { createClientReviewPage } from "../Review/functions.js";

export async function createAccountPage(userId,role) {
    let container = document.querySelector('.container');
    let data = await getUserById(userId);
    const user = data.body;

    container.innerHTML = `
    <div class="header-container">
        <h1>RentApp</h1>
        <div class="navigation-container">
            <a href="#" class="home-link"><p>Home</p></a>
            <a href="#"><p>About</p></a>
            <a href="#"><p>Contact</p></a>
            <a href="#" class="cars-link"><p>Cars</p></a>
            <a href="#" class = "review-link"><p>Reviews</p></a>
        </div>
        <div class="navigation-container-icons">
            <a href="#" class="user-icon"><i class="fa-regular fa-user"></i></a>
        </div>
    </div>

    <div class="main-container-account">
        <div class="left-side-buttons">
            <button class="my-account-button" disabled>My account</button>
            <button class="my-rentals-button">My rentals</button>
        </div>

        <div class="right-side-info">
            <div class="email-input">
                <p>Email:</p>
                <input type="email" id="email" value="${user.email}">
            </div>
            <div class="name-input">
                <p>Full name:</p>
                <input type="text" id="fullName" value="${user.name} ${user.lastName}">
            </div>

            <button class="save-changes-button">Save Changes</button>
        </div>
    </div>

    <div class="footer-container">
        <hr width="100%"/>
        <div class="footer-section">
            <div class="address-section">
                <h4>RentApp.</h4>
                <p class="description">Your mobility partner.</p>
            </div>
            <div class="links-section">
                <a href="#"><p>Home</p></a>
                <a href="#"><p>About</p></a>
                <a href="#"><p>Contact</p></a>
            </div>
        </div>
        <hr width="80%"/>
        <div class="end-section">
            <p>2025 RentApp. All rights reserved.</p>
        </div>
    </div>
    `;

    container.querySelector(".home-link").addEventListener("click", () => createHomePage(userId,role));
    container.querySelector(".user-icon").addEventListener("click", () => createAccountPage(userId,role));
    container.querySelector(".cars-link").addEventListener("click", () => createCarsPage(userId,role));
    container.querySelector(".review-link").addEventListener("click", () => createClientReviewPage(userId,role));

    container.querySelector(".save-changes-button").addEventListener("click", async () => {
        const fullNameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('email');

        if (!fullNameInput || !emailInput) {
            alert("Account form not loaded. Please go back to 'My account' section.");
            return;
        }

        const fullNameValue = fullNameInput.value.trim();
        const nameParts = fullNameValue.split(' ');
        const name = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const updatedUser = {
            email: emailInput.value,
            name: name,
            lastName: lastName
        };

        try {
            await updateUser(userId, updatedUser);
            alert("Changes saved successfully!");
        } catch (e) {
            alert("Failed to update account.");
        }
    });

    container.querySelector(".my-rentals-button").addEventListener("click", async () => {
        const rightSide = container.querySelector(".right-side-info");
        const rentalsData = await getRentalsByUserId(userId);
        const rentals = rentalsData.body;

        container.querySelector(".my-account-button").disabled = false;
        container.querySelector(".my-rentals-button").disabled = true;

        rightSide.innerHTML = `<h2>Your Rentals</h2>`;

        if (rentals.length > 0) {
            for (const rental of rentals) {
                try {
                    const response = await fetch(`http://localhost:8080/api/masini/${rental.masinaId}`);
                    const masina = await response.json();

                    const rentalDiv = document.createElement("div");
                    rentalDiv.className = "rental-card";
                    rentalDiv.innerHTML = `
                        <p><b>Car:</b> ${masina.model} (${masina.marca})</p>
                        <p><b>From:</b> ${rental.dataInceput}</p>
                        <p><b>To:</b> ${rental.dataSfarsit}</p>
                        <button class="delete-rental-btn" data-id="${rental.id}">Delete</button>
                        <hr/>
                    `;
                    rightSide.appendChild(rentalDiv);

                    rentalDiv.querySelector(".delete-rental-btn").addEventListener("click", async () => {
                        const confirmDelete = confirm("Are you sure you want to delete this rental?");
                        if (!confirmDelete) return;

                        try {
                            const res = await fetch(`http://localhost:8080/api/inchirieri/${rental.id}`, {
                                method: "DELETE"
                            });

                            if (res.ok) {
                                alert("Rental deleted.");
                                rightSide.removeChild(rentalDiv);
                            } else {
                                alert("Failed to delete rental.");
                            }
                        } catch (e) {
                            console.error("Delete error:", e);
                            alert("Error deleting rental.");
                        }
                    });

                } catch (error) {
                    console.error("Failed to fetch car details:", error);
                }
            }
        } else {
            rightSide.innerHTML += `<p>No rentals found.</p>`;
        }
    });

    container.querySelector(".my-account-button").addEventListener("click", () => {
        createAccountPage(userId);
    });
}
