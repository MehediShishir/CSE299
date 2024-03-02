// Define the function to parse JWT tokens
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// Define the function to handle JWT response
function decodeJwtResponse(data) {
    // Call the signIn function with the decoded JWT data
    signIn(parseJwt(data));
}

// Define the function to handle sign-in process
function signIn(userData) {
    // Redirect to profile.html after signing in
    window.location.href = "profile.html";

    // You can store user data in localStorage or sessionStorage for access on the profile page
    localStorage.setItem("userData", JSON.stringify(userData));
}
