const password = document.querySelector('#password')
const eye_icon = document.querySelector('.eye-icon')

eye_icon.addEventListener('click', function(){
    this.classList.toggle('fa-eye')
    this.classList.toggle('fa-eye-slash')
    if(password.type === 'password'){
        password.type = 'text'
    }else{
        password.type = 'password'
    }
})

