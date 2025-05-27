 function apiUser(path, method = "GET", body = null) {
    const url = "http://localhost:8080/api/users/" + path;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Requested-With': 'XMLHttpRequest',
        }
    }
    if (body != null) {
        options.body = JSON.stringify(body);
    }
    return fetch(url, options);
}

export async function login(loginRequest) {
  try {
    const response = await apiUser("login", "POST", loginRequest);

    const contentType = response.headers.get("content-type");
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Login failed");
    }

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();

      // stochează datele în localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // afiseaza sau actualizeaza UI-ul
      document.getElementById("auth").style.display = "none";
      document.getElementById("main").style.display = "block";

      return {
        status: response.status,
        success: true,
        body: data
      };
    } else {
      const text = await response.text();
      throw new Error("Expected JSON, got: " + text);
    }

  } catch (err) {
    alert("Login failed: " + err.message);
    return {
      success: false,
      message: err.message
    };
  }
}

export async function register(userRequest) {
    try {
        let response = await apiUser("register", "POST", userRequest);
        let data = await response.json();
        return {
            status: response.status,
            success: response.ok,
            body: data
        };
    } catch (err) {
        return { success: false, message: err.message };
    }
}