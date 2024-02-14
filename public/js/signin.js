const password = document.querySelector('#password')
const eye_icon = document.querySelector('.eye-icon')

eye_icon.addEventListener('mousedown', function(){
    this.classList.toggle('fa-eye-slash')
    password.type = 'text'
})

eye_icon.addEventListener('mouseup', function(){
    this.classList.toggle('fa-eye-slash')
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
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `username=${username}&password=${password}`,
        })
        const data = await response.json();
        console.log(data);
        if(response.ok){
            location.href = '/products';
        }else{
            if(!data.username){
                modal_content.innerHTML = 'Username not found. Please try again.';
            }else if(!data.password){
                modal_content.innerHTML = 'The password you entered is incorrect. Please try again.';
            }
            else{
                modal_content.innerHTML = data.message;
            }
            $("#login-error").modal()
        }
    } catch (error) {
        console.error('Error fetching :', error);
    }
})