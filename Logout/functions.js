import { createLoginPage } from "../Login/functions.js";

export function handleLogout() {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    createLoginPage();
}
