const loginButton = document.getElementById("login-submit");

const emailInput = ''
const passwordInput = ''

loginButton.addEventListener("click", (e) => {
  e.preventDefault();
  const emailInput = document.getElementById("email")
  const passwordInput = document.getElementById("password")

  let user = {
    email: emailInput.value,
    password: passwordInput.value
  };

  fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
  .then((response) => response.json())
  .then((result) => {
    if(result.userId === 1){
      sessionStorage.setItem("token", result.token);
      sessionStorage.setItem('userId', result.userId)
      window.location.href="./index.html";
      } else {
          alert('Erreur dans l’identifiant ou le mot de passe”');
      }
  })
})
