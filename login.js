// login.js
let removeHyphens = (inputString) => inputString.replace(/-/g, '');
// Replace these values with your GitHub OAuth App credentials
const clientId = removeHyphens('11de-8f416159-bc1b5bf2');

const redirectUri = 'https://articleplanet.vercel.app/login.html';

const scope = 'user';

// Function to initiate GitHub OAuth login
async function loginWithGitHub() {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    
    // Redirect the user to the GitHub OAuth login page
    window.location.href = authUrl;
}

// Check if there is an access token in the URL (returned from GitHub OAuth)
function getGitHubAccessToken() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('access_token');
}

// Example usage
document.getElementById('login-button').addEventListener('click', loginWithGitHub);

// Check if there is an access token in the URL when the page loads
const accessToken = getGitHubAccessToken();
if (accessToken) {
    // The user has successfully logged in with GitHub
    // You can send the access token to your server for further processing
    console.log('GitHub Access Token:', accessToken);
    // Redirect or perform other actions as needed
}
