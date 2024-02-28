(async () => {
    try{
        var res = await fetch('/authStatus');
        const data = await res.json()
        res = await fetch('../html/header.html')
        const html = await res.text()
        document.getElementById('header').insertAdjacentHTML('beforeend', html);
        const signin = document.querySelector('.signin');
        const user_link = document.querySelector('.user-link');
        if (data.userIsLoggedIn) {
            signin.style.display = 'none';
            user_link.style.display = 'block';
            document.querySelector('.username-profile').textContent = data.username
        }
    } catch (error) {
        console.error('Error fetching authentication status:', error);
    }
})()