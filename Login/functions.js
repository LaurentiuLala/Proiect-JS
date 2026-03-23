import { login, register } from "../User/service.js";
import { createHomePage } from "../Home/functions.js";
import { createAdminPage } from "../Admin/functions.js";


export function createLoginPage(){
    let container = document.querySelector(".container");


    container.innerHTML = `

<div class="login-page">

    <div>
        <div class="login-container">
            <h1>Welcome back</h1>
            <p class="subtitle">Sign in to your RentApp account</p>
            <div class="email-input">
                <p>Email</p>
                <input type="email" name="email" id="email-login" placeholder="Enter your email">
            </div>
            <div class="password-input">
                <p>Password</p>
                <input type="password" name="password" id="password-login" placeholder="Enter your password">
            </div>
            <button class="login-button">Sign in</button>
            <p>Don't have an account? <a href="#" class="register-link">Create one</a></p>
        </div>
    </div>


</div>

    `;


    let loginBtn = document.querySelector(".login-button");

    let registerLink = document.querySelector(".register-link");

    registerLink.addEventListener('click', ()=>{
        createRegisterPage();
    });


    loginBtn.addEventListener('click', async() =>{
        const email = document.querySelector("#email-login").value;
        const password = document.querySelector("#password-login").value;


        const loginRequest = {
            email: email,
            password: password
        };

        const result = await login(loginRequest);
            if (result.status === 200) {
                const data = result.body;
                const userId = data.id;
                const role = data.role; 
            
                // Store credentials for future requests
                const auth = btoa(`${email}:${password}`);
                localStorage.setItem("auth", auth);
                localStorage.setItem("user", JSON.stringify({ id: userId, role: role }));

                if (role === "ADMIN") {
                 createAdminPage(userId,role);
                     } else {
                 createHomePage(userId,role);
             }
            }else{
            const error = document.querySelector(".login-error");
            if(error){
                error.remove();
            }
            const popUp = failedLogin();
            const loginContainer = document.querySelector(".login-container");
            if(loginContainer){
                loginContainer.insertAdjacentElement('afterend', popUp);
                popUp.classList.toggle("show");
            }
        }

    });

}


export function createRegisterPage(){


    let container = document.querySelector(".container");


    container.innerHTML = `

<div class="register-page">
    <div>

        <div class="register-container">
            <h1>Create account</h1>
            <p class="subtitle">Join RentApp and start booking</p>
            <div class="name-input">
                <p>First Name</p>
                <input type="text" name="name" id="name-register" placeholder="Enter your first name">
            </div>
            <div class="lastname-input">
                <p>Last Name</p>
                <input type="text" name="lastName" id="lastname-register" placeholder="Enter your last name">
            </div>
            <div class="email-input">
                <p>Email</p>
                <input type="email" name="email" id="email-register" placeholder="Enter your email">
            </div>
            <div class="password-input">
                <p>Password</p>
                <input type="password" name="password" id="password-register" placeholder="Create a password">
            </div>
            <button class="register-button">Create account</button>
            <p>Already have an account? <a href="#" class="login-link">Sign in</a></p>
        </div>

    </div>
</div>
    `;


    let registerButton = document.querySelector(".register-button");
    let loginLink = document.querySelector(".login-link");


    loginLink.addEventListener('click', () => {
        createLoginPage();
    });

    registerButton.addEventListener('click',async () =>{
const userRequest = {
    name: document.querySelector('#name-register').value,
    lastName: document.querySelector('#lastname-register').value,
    email: document.querySelector('#email-register').value,
    password: document.querySelector('#password-register').value,
}




        const result = await register(userRequest);
        if (result.status == '200') {
            alert("Successfully registered, please login to continue");
            createLoginPage();
          } else {
            const error = document.querySelector(".register-error");
            if (error) {
              error.remove();
            }

            const popUp = registerError();
            const registerContainer = document.querySelector(".register-container");
            
            if (registerContainer) {
              registerContainer.insertAdjacentElement("afterend", popUp);
              popUp.classList.toggle("show");
            }
          }

    });



}

function failedLogin(){

    const popUp = document.createElement("div");
    popUp.classList.add("login-error");

    popUp.innerHTML = `
        <div class = "error-message">
            <p>Failed to login, email or password is incorrect. <br> Please try again!</p>
        </div>
    `;

    return popUp;

}

function registerError(){

    const popUp = document.createElement("div");
    popUp.classList.add("register-error");

  popUp.innerHTML = `
    <div class="error-message">
      <p class = "error-text">Failed to register. Email already used. <br> Please try again!</p>
    </div>
  `;

  return popUp;

}