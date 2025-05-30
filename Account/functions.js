import { getUserById, updateUser } from "./service.js";
import { createHomePage } from "../Home/functions.js";

export async function createAccountPage(userId) {
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
        </div>
        <div class="navigation-container-icons">
            <a href="#" class="user-icon"><i class="fa-regular fa-user"></i></a>
        </div>
    </div>

    <div class="aside-container-cart">
        <div class="cart-container">
            <h1>Account</h1>
            <p><b>Home ></b> Account</p>
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
                <p class="description">Links</p>
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

    container.querySelector(".home-link").addEventListener("click", () => createHomePage(userId));
    container.querySelector(".user-icon").addEventListener("click", () => createAccountPage(userId));

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
            rentals.forEach(rental => {
                const rentalDiv = document.createElement("div");
                rentalDiv.className = "rental-card";
                rentalDiv.innerHTML = `
                    <p><b>Car:</b> ${rental.car.model} (${rental.car.brand})</p>
                    <p><b>From:</b> ${rental.startDate}</p>
                    <p><b>To:</b> ${rental.endDate}</p>
                    <p><b>Status:</b> ${rental.status}</p>
                    <hr/>
                `;
                rightSide.appendChild(rentalDiv);
            });
        } else {
            rightSide.innerHTML += `<p>No rentals found.</p>`;
        }
    });

    container.querySelector(".my-account-button").addEventListener("click", () => {
        createAccountPage(userId);
    });
}
