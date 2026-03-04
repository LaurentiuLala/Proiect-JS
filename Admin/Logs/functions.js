import { getLogs } from "../../User/service.js";
import { createAdminPage } from "../functions.js";

export async function createLogPage(userId, role) {
    const container = document.querySelector(".container");

    container.innerHTML = `
        <div class="admin-subpage">
            <h1>Loguri Sistem</h1>
            <div class="filter-container">
                <input type="text" id="log-search" placeholder="Caută după mașină sau utilizator...">
            </div>
            <div id="log-list" class="logs-list">Se încarcă...</div>
            <button id="MainPage">Back to MainPage</button>
        </div>
    `;

    document.getElementById("MainPage").addEventListener("click", () => {
        createAdminPage(userId, role);
    });

    try {
        const response = await getLogs();
        const allLogs = response.body;
        const listContainer = document.getElementById("log-list");
        const searchInput = document.getElementById("log-search");

        function renderLogs(logsToRender) {
            listContainer.innerHTML = "";
            if (!logsToRender || logsToRender.length === 0) {
                listContainer.innerHTML = "<p>Nu există loguri care să corespundă căutării.</p>";
                return;
            }

            logsToRender.reverse().forEach(log => {
                const item = document.createElement("div");
                item.className = "log-item-card";
                item.style.background = "var(--bg-light)";
                item.style.padding = "20px";
                item.style.borderRadius = "var(--border-radius-md)";
                item.style.marginBottom = "15px";
                item.style.border = "1px solid var(--border-color)";
                item.style.display = "flex";
                item.style.justifyContent = "space-between";
                item.style.alignItems = "center";

                const date = new Date(log.timestamp).toLocaleString();
                
                item.innerHTML = `
                    <div>
                        <p><strong>Acțiune:</strong> <span style="color: ${log.action === 'RENTED' ? 'var(--success-color)' : 'var(--danger-color)'}">${log.action}</span></p>
                        <p><strong>Mașină:</strong> ${log.carInfo || 'ID: ' + log.masinaId}</p>
                        <p><strong>Utilizator:</strong> ${log.userInfo || 'ID: ' + log.userId}</p>
                    </div>
                    <div style="text-align: right; color: var(--text-muted); font-size: 14px;">
                        <p>${date}</p>
                        <p>ID Log: #${log.id}</p>
                    </div>
                `;
                listContainer.appendChild(item);
            });
        }

        renderLogs(allLogs);

        searchInput.addEventListener("input", () => {
            const term = searchInput.value.toLowerCase();
            const filtered = allLogs.filter(log => 
                (log.carInfo && log.carInfo.toLowerCase().includes(term)) ||
                (log.userInfo && log.userInfo.toLowerCase().includes(term)) ||
                log.action.toLowerCase().includes(term) ||
                String(log.masinaId).includes(term) ||
                String(log.userId).includes(term)
            );
            renderLogs(filtered);
        });

    } catch (err) {
        console.error("Eroare la încărcarea logurilor:", err);
        document.getElementById("log-list").innerText = "Eroare la încărcarea logurilor.";
    }
}

