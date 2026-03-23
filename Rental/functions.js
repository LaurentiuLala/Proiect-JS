import { createRental } from "./service.js";
import { getCarsByLocation, getCarById } from "../Cars/service.js";
import { getAllLocations } from "../Locatii/service.js";
import { createAccountPage } from "../Account/functions.js";
import { createHomePage } from "../Home/functions.js";
import { createAboutPage } from "../About/functions.js";
import { createContactPage } from "../Contact/functions.js";
import { createCarsPage } from "../Cars/functions.js";
import { createClientReviewPage } from "../Review/functions.js";
import { handleLogout } from "../Logout/functions.js";

export async function createRentalPage(userId, initialCarId = null, role) {
    console.log(role);
    const container = document.querySelector(".container");

    let locationsResponse;
    try {
        locationsResponse = await getAllLocations();
    } catch (error) {
        container.innerHTML = `<p>Failed to load locations. ${error.message}</p>`;
        return;
    }

    if (!locationsResponse || locationsResponse.status !== 200 || !Array.isArray(locationsResponse.body)) {
        container.innerHTML = "<p>Failed to load locations. Please try again later.</p>";
        return;
    }

    const locations = locationsResponse.body;
    const today = new Date().toISOString().split('T')[0];

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

    <div class="rental-page">
        <h1>Complete Your Rental</h1>
        <form class="rental-form">
            <label>Select location:
                <select id="location-select" required>
                    <option value="">-- Choose location --</option>
                    ${locations.map(loc => `<option value="${loc.id}">${loc.oras}, ${loc.strada} ${loc.numar}</option>`).join("")}
                </select>
            </label><br>

            <label>Select car:
                <select id="car-select" required disabled>
                    <option value="">-- Select location first --</option>
                </select>
            </label><br>

            <label>From: <input type="date" id="start-date" min="${today}" required></label><br>
            <label>To: <input type="date" id="end-date" min="${today}" required></label><br>

            <div id="price-calculator">
                <p><b>Price per day:</b> <span id="price-per-day">0</span> Lei</p>
                <p><b>Total days:</b> <span id="total-days">0</span></p>
                <p style="font-size: 1.15rem; color: var(--primary); font-weight: 700;"><b>Total Price: <span id="total-price">0</span> Lei</b></p>
            </div>

            <button type="submit" style="margin-top: 20px;">Confirm Rental</button>
        </form>

        <button id="back-to-account">Back to Account</button>
    </div>
    `;

    // Header Navigation Listeners
    container.querySelector(".home-link").addEventListener("click", () => createHomePage(userId, role));
    container.querySelector(".about-link").addEventListener("click", () => createAboutPage(userId, role));
    container.querySelector(".contact-link").addEventListener("click", () => createContactPage(userId, role));
    container.querySelector(".cars-link").addEventListener("click", () => createCarsPage(userId, role));
    container.querySelector(".review-link").addEventListener("click", () => createClientReviewPage(userId, role));
    container.querySelector(".user-icon").addEventListener("click", () => createAccountPage(userId, role));
    container.querySelector(".logout-icon").addEventListener("click", () => handleLogout());

    const locationSelect = document.getElementById("location-select");
    const carSelect = document.getElementById("car-select");

    const updateCarsDropdown = async (locationId, selectedCarId = null) => {
        carSelect.innerHTML = `<option value="">Loading cars...</option>`;
        carSelect.disabled = true;

        try {
            const { status, body: cars } = await getCarsByLocation(locationId);
            if (status === 200) {
                const availableCars = cars.filter(car => car.cantitate > 0);

                if (availableCars.length === 0) {
                    carSelect.innerHTML = `<option value="">No available cars</option>`;
                } else {
                    carSelect.innerHTML = `<option value="">-- Choose car --</option>` +
                        availableCars.map(car => `<option value="${car.id}" ${car.id == selectedCarId ? 'selected' : ''}>${car.marca} ${car.model}</option>`).join("");
                    carSelect.disabled = false;
                }
            } else {
                carSelect.innerHTML = `<option value="">Error loading cars</option>`;
            }
        } catch (error) {
            carSelect.innerHTML = `<option value="">Error loading cars</option>`;
            console.error("Error loading cars:", error);
        }
    };

    locationSelect.addEventListener("change", async () => {
        const locationId = locationSelect.value.trim();
        if (!locationId) {
            carSelect.innerHTML = `<option value="">-- Select location first --</option>`;
            carSelect.disabled = true;
            return;
        }
        await updateCarsDropdown(locationId);
    });

    // Handle initial car selection if provided
    if (initialCarId) {
        try {
            const carResponse = await getCarById(initialCarId);
            if (carResponse.status === 200) {
                const car = carResponse.body;
                locationSelect.value = car.locatieId;
                await updateCarsDropdown(car.locatieId, initialCarId);
            }
        } catch (error) {
            console.error("Error fetching initial car details:", error);
        }
    }

    document.querySelector(".rental-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const locationId = locationSelect.value;
        const carId = carSelect.value;
        const data_inceput = document.getElementById("start-date").value;
        const data_sfarsit = document.getElementById("end-date").value;

        if (!locationId || !carId || !data_inceput || !data_sfarsit) {
            alert("Please complete all fields.");
            return;
        }

        if (new Date(data_sfarsit) < new Date(data_inceput)) {
            alert("End date cannot be before start date.");
            return;
        }

        const response = await createRental({
            userId,
            masinaId: carId,
            locatieId: locationId,
            dataInceput: data_inceput,
            dataSfarsit: data_sfarsit
        });

        if (response.status === 200 || response.status === 201) {
            alert("Car successfully rented!");
            createAccountPage(userId, role);
        } else {
            alert("Rental failed. Try again.");
        }
    });

    document.getElementById("back-to-account").addEventListener("click", () => {
        createAccountPage(userId, role);
    });

    // PRICE CALCULATOR LOGIC
    const startDateInput = document.getElementById("start-date");
    const endDateInput = document.getElementById("end-date");
    const pricePerDaySpan = document.getElementById("price-per-day");
    const totalDaysSpan = document.getElementById("total-days");
    const totalPriceSpan = document.getElementById("total-price");

    let currentCarPrice = 0;

    const calculateTotalPrice = () => {
        const start = startDateInput.value;
        const end = endDateInput.value;

        if (start && end && currentCarPrice > 0) {
            const date1 = new Date(start);
            const date2 = new Date(end);

            // Difference in time
            const diffTime = date2 - date1;
            // Difference in days (1 day minimum)
            let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

            if (diffDays < 1) diffDays = 0;

            totalDaysSpan.textContent = diffDays;
            totalPriceSpan.textContent = (diffDays * currentCarPrice).toFixed(2);
        } else {
            totalDaysSpan.textContent = "0";
            totalPriceSpan.textContent = "0";
        }
    };

    const updatePricePerDay = async () => {
        const carId = carSelect.value;
        if (carId) {
            try {
                const response = await getCarById(carId);
                if (response.status === 200) {
                    currentCarPrice = response.body.pretPeZi;
                    pricePerDaySpan.textContent = currentCarPrice;
                    calculateTotalPrice();
                }
            } catch (error) {
                console.error("Error fetching car price:", error);
            }
        } else {
            currentCarPrice = 0;
            pricePerDaySpan.textContent = "0";
            calculateTotalPrice();
        }
    };

    carSelect.addEventListener("change", updatePricePerDay);
    startDateInput.addEventListener("change", calculateTotalPrice);
    endDateInput.addEventListener("change", calculateTotalPrice);

    // If initial car is set, update price
    if (initialCarId) {
        // We need to wait for the dropdown to be populated
        setTimeout(updatePricePerDay, 1000); 
    }
}
