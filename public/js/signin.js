const password = document.querySelector('#password')
const eye_span = document.querySelector('.eye-span')
const eye_icon = document.querySelector('.eye-icon')

eye_span.addEventListener('mousedown', function(){
    eye_icon.classList.toggle('fa-eye-slash')
    password.type = 'text'
})

eye_span.addEventListener('mouseup', function(){
    eye_icon.classList.toggle('fa-eye-slash')
    password.type = 'password'
})

document.getElementById('signin-form').addEventListener('submit', async function(e){
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const modal_content = document.getElementById('modal-content');

    try{
        const response = await fetch('/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            }),
        })
        const data = await response.json();
        console.log(data);
        if(response.ok){
            location.href = '/orders';
            localStorage.setItem('username', username)
        }else{
            if(!data.username){
                modal_content.innerHTML = 'Username not found. Please try again.';
            }else if(!data.password){
                modal_content.innerHTML = 'The password you entered is incorrect. Please try again.';
            }
            else{
                modal_content.innerHTML = data.message;
            }
            $("#login-error").modal('show')
        }
    } catch (error) {
        console.error('Error fetching :', error);
    }
})