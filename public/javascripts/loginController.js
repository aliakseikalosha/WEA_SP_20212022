window.onload= function () {
    const usernameInput  = document.getElementById("inputUsername");
    const usernameError = document.getElementById("usernameError");

    const passwordInput = document.getElementById("inputPassword");
    const passwordError = document.getElementById("passwordError");

    const loginButton = document.getElementById("loginButton");

    const loginRegex = /([^a-zA-Z\S\.]|[0-9])/gm

    const form =  document.getElementById("login");

    usernameInput.oninput = function (e) {
        usernameError.textContent = "";
        loginButton.disabled = false;
        if(hasErrorUsername()){
            usernameError.textContent = "Username can contain only letters (a-Z) and dots";
            loginButton.disabled = true;
        }
    }

    passwordInput.oninput = function (e) {
        passwordError.textContent = "";
        loginButton.disabled = false;
        if(hasErrorPassword()){
            passwordError.textContent = "Password can should contain at least 4 letters";
            loginButton.disabled = true;
        }
    }

    form.addEventListener("submit", (e) => {
        let hasProblem = hasErrorUsername() || hasErrorPassword();
        if(hasProblem){
            e.preventDefault();
        }
    });

    function hasErrorUsername() {
        return usernameInput.value.match(loginRegex);

    }

    function hasErrorPassword() {
        return passwordInput.value.length < 3;
    }

}