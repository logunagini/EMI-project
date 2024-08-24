let responsePayload;

function handleCredentialResponse(response) {
    responsePayload = decodeJwtResponse(response.credential);

    document.getElementById('sign-in-page').style.display = 'none';
    document.getElementById('home-page').style.display = 'block';
    document.getElementById('email-display').textContent = "Signed in as: " + responsePayload.email;
    document.getElementById('signout-button').disabled = false;

    console.log("ID: " + responsePayload.sub);
    console.log('Full Name: ' + responsePayload.name);
    console.log('Given Name: ' + responsePayload.given_name);
    console.log('Family Name: ' + responsePayload.family_name);
    console.log("Image URL: " + responsePayload.picture);
    console.log("Email: " + responsePayload.email);

    // Send token to backend for verification
    fetch('/tokensignin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_token: response.credential })
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function decodeJwtResponse(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

function signOut() {
    google.accounts.id.revoke(responsePayload.email, done => {
        console.log('User signed out.');
        document.getElementById('sign-in-page').style.display = 'block';
        document.getElementById('home-page').style.display = 'none';
        document.getElementById('email-display').textContent = "";
        document.getElementById('signout-button').disabled = true;
    });
}

function showSignUp() {
    document.getElementById('sign-in-page').style.display = 'block';
    document.getElementById('home-page').style.display = 'none';
}

function showSignIn() {
    document.getElementById('sign-in-page').style.display = 'block';
    document.getElementById('home-page').style.display = 'none';
}

function handleSignUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email && password) {
        // For demonstration, we're storing in sessionStorage
        sessionStorage.setItem('signupEmail', email);
        sessionStorage.setItem('signupPassword', password);

        alert('Sign up successful! You can now sign in.');
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
    } else {
        alert('Please enter both email and password.');
    }
}

window.onload = function () {
    google.accounts.id.initialize({
        client_id: '205468551568-easqmig20adbo9ltqikqf5cl91566koc.apps.googleusercontent.com', // Replace with your Client ID
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.querySelector(".g_id_signin"),
        { theme: "outline", size: "large" }
    );
    google.accounts.id.prompt();
};
