document.addEventListener('DOMContentLoaded', () => {
    fetch('/authStatus')
        .then(response => response.json())
        .then(data => {
            const signin = document.querySelector('.signin');
            const user_link = document.querySelector('.user-link');
            
            if (data.userIsLoggedIn) {
                signin.style.display = 'none';
                user_link.style.display = 'block';
                document.querySelector('.username-profile').innerHTML = getCookie('username')
            } else {
                signin.style.display = 'block';
                user_link.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error fetching authentication status:', error);
        });
    });
    
function getCookie(cookieName) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(`${cookieName}=`)) {
        return cookie.substring(cookieName.length + 1);
        }
    }
    return 'username';
}
      