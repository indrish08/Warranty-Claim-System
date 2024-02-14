document.addEventListener('DOMContentLoaded', () => {
    fetch('/authStatus')
        .then(response => response.json())
        .then(data => {
            const signin = document.querySelector('.signin');
            const user_link = document.querySelector('.user-link');
            
            if (data.userIsLoggedIn) {
                signin.style.display = 'none';
                user_link.style.display = 'block';
            } else {
                signin.style.display = 'block';
                user_link.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error fetching authentication status:', error);
        });
    });