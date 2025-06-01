import { getAllUsers, deleteUserById } from "./service.js";
import { createAdminPage } from "../functions.js";

export async function createAdminUsersPage(userId,role) {
    const container = document.querySelector(".container");

    container.innerHTML = `
        <div class="admin-users-page">
            <h1>Admin - Utilizatori</h1>
            <div class="users-list"></div>
            <button id="MainPage">Înapoi la Pagina Principală</button>
        </div>
    `;


    document.getElementById("MainPage").addEventListener("click", () => {
        createAdminPage(userId,role);
    });

    const response = await getAllUsers();

    if (response.status !== 200) {
        document.querySelector(".users-list").innerHTML = `<p>Eroare la încărcarea utilizatorilor.</p>`;
        return;
    }

    const users = response.body;
    renderUsers(users, userId);
}


function renderUsers(users, userId) {
    const usersList = document.querySelector(".users-list");
    usersList.innerHTML = "";

    users.forEach(user => {
        const userDiv = document.createElement("div");
        userDiv.classList.add("user-card");

        userDiv.innerHTML = `
            <p><strong>${user.name} ${user.lastName}</strong></p>
            <p>Email: ${user.email}</p>
            <p>Rol: ${user.role}</p>
            <button class="delete-user-btn" data-id="${user.id}">Șterge</button>
        `;

        userDiv.querySelector(".delete-user-btn").addEventListener("click", async () => {
            await deleteUserById(user.id);
            createAdminUsersPage(userId);  
        });

        usersList.appendChild(userDiv);
    });
}
