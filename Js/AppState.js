window.appState = {
    token: null,
    role: null
};
export const getToken = () => window.appState.token;
export const getRole = () => window.appState.role;
export const setAuth = (token, role) => {
    window.appState.token = token;
    window.appState.role = role;
};
export const clearAuth = () => {
    window.appState.token = null;
    window.appState.role = null;
};