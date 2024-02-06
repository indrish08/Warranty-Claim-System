document.addEventListener('DOMContentLoaded', () => {
    fetch('/authStatus')
        .then(response => response.json())
        .then(data => {
            const userIsLoggedIn = data.userIsLoggedIn;
            console.log(1234);
            
            const signin = document.querySelector('.signin');
            const user_link = document.querySelector('.user-link');

            console.log(signin, user_link);
            
            if (userIsLoggedIn) {
                console.log(1);
                signin.style.display = 'none';
                user_link.style.display = 'block';
            } else {
                console.log(2);
                signin.style.display = 'block';
                user_link.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error fetching authentication status:', error);
        });
    });