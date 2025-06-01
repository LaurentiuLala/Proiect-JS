import { getCarById, rentCar, getAllLocations} from "../Home/service.js";
import { createAccountPage } from "../Account/functions.js";
import { getCarsByLocation } from "./service.js";

export async function createRentalPage(userId, initialCarId = null,role) {
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

    container.innerHTML = `
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

            <label>From: <input type="date" id="start-date" required></label><br>
            <label>To: <input type="date" id="end-date" required></label><br>

            <button type="submit">Confirm Rental</button>
        </form>

        <button id="back-to-account">Back to Account</button>
    </div>
    `;

    const locationSelect = document.getElementById("location-select");
    const carSelect = document.getElementById("car-select");

locationSelect.addEventListener("change", async () => {
    const locationId = locationSelect.value.trim();
    if (!locationId) return;

    carSelect.innerHTML = `<option value="">Loading cars...</option>`;
    carSelect.disabled = true;

    try {
        const { status, body: cars } = await getCarsByLocation(locationId);
        if (status === 200) {
            if (cars.length === 0) {
                carSelect.innerHTML = `<option value="">No available cars</option>`;
            } else {
                carSelect.innerHTML = `<option value="">-- Choose car --</option>` +
                    cars.map(car => `<option value="${car.id}">${car.marca} ${car.model}</option>`).join("");
            }
            carSelect.disabled = false;
        } else {
            carSelect.innerHTML = `<option value="">Error loading cars</option>`;
        }
    } catch (error) {
        carSelect.innerHTML = `<option value="">Error loading cars</option>`;
        console.error("Error loading cars:", error);
    }
});

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

        const response = await rentCar({
    userId,
    masinaId: carId,
    locatieId: locationId,
    dataInceput: data_inceput,
    dataSfarsit: data_sfarsit
});


        if (response.status === 200) {
            alert("Car successfully rented!");
            createAccountPage(userId,role);
        } else {
            alert("Rental failed. Try again.");
        }
    });

    document.getElementById("back-to-account").addEventListener("click", () => {
        createAccountPage(userId, role);
    });
}
