const password = document.querySelector('#password')
const eye_icon = document.querySelector('.eye-icon')

eye_icon.addEventListener('mousedown', function(){
    // this.classList.toggle('fa-eye')
    this.classList.toggle('fa-eye-slash')
    password.type = 'text'
    // if(password.type === 'password'){
    //     password.type = 'text'
    // }else{
    //     password.type = 'password'
    // }
})

eye_icon.addEventListener('mouseup', function(){
    // this.classList.toggle('fa-eye')
    this.classList.toggle('fa-eye-slash')
    password.type = 'password'
})

document.getElementById('signin-form').addEventListener('submit', async function(e){
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try{
        const response = await fetch('/login', {
            method: 'POST',
            body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
        });

        const data = await response.json();
    } catch (error) {

    }
})