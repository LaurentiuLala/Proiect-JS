import { login, register } from "./service.js";
import { createHomePage } from "../Home/functions.js";
import { createAdminPage } from "../Admin/functions.js";


export function createLoginPage(){
    let container = document.querySelector(".container");


    container.innerHTML = `

<div class="login-page">
    
    <div>
        <div class="login-container">
            <h1>Log in</h1>
            <div class="email-input">
                <p>Email:</p>
                <input type="email" name="email" id="email-login" placeholder="Your email here">
            </div>
            <div class="password-input">
                <p>Password:</p>
                <input type="password" name="password" id="password-login" placeholder="Your password here">
            </div>
            <p>Don't have an account? <a href="#" class="register-link">Register here</a></p>
            <button class="login-button">Log in</button>
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
            <h1>Register</h1>
            <div class="email-input">
                <p>Email:</p>
                <input type="email" name="email" id="email-register" placeholder="Your email here">
            </div>
            <div class="password-input">
                <p>Password:</p>
                <input type="password" name="password" id="password-register" placeholder="Your password here">
            </div>
            <div class="name-input">
             <p>Name:</p>
             <input type="text" name="name" id="name-register" placeholder="Your name here">
            </div>
            <div class="lastname-input">
            <p>LastName:</p>
            <input type="text" name="lastName" id="lastname-register" placeholder="Your last name here">
</div>

  
            <p>Already have an account? <a href="#" class="login-link">Log in here</a></p>
            <button class="register-button">Register</button>
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