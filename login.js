let removeHyphens = (inputString) => inputString.replace(/-/g, '');

// Replace these values with your GitHub OAuth App credentials
const clientIdWithHyphens = '11de-8f416159-bc1b5bf2';
const clientId = removeHyphens(clientIdWithHyphens);
const clientSecret = removeHyphens('43f31fd2e-d2105a8d9d27e14-63edf401a807a5ae'); // Replace with your GitHub OAuth App client secret
const redirectUri = 'https://articleplanet.vercel.app/login.html';
const scope = 'user';

// Function to initiate GitHub OAuth login
async function loginWithGitHub() {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    
    // Redirect the user to the GitHub OAuth login page
    window.location.href = authUrl;
}
    const urlParams = new URLSearchParams(window.location.search);

// Check if there is an access token in the URL (returned from GitHub OAuth)
function getGitHubAccessToken() {
    return urlParams.get('access_token');
}



// Function to exchange authorization code for access token
async function exchangeCodeForToken(authorizationCode) {
    try {
        const response = await fetch('https://login-articleplanet.vercel.app/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                code: authorizationCode,
                redirect_uri: redirectUri,
            }),
        });

        const data = await response.json();
        const accessToken = data.access_token;

        // You now have the access token, you can send it to your server or perform other actions
        console.log('GitHub Access Token:', accessToken);
    } catch (error) {
        console.error('Error exchanging authorization code for access token:', error);
    }
}
    const authorizationCode = getGitHubAccessToken();
if (urlParams.get('code')) {
    exchangeCodeForToken(urlParams.get('code'));
} 
// Example usage
document.getElementById('login-button').addEventListener('click', async () => {
    // If there is an authorization code in the URL, exchange it for an access token
    if (authorizationCode) {
        exchangeCodeForToken(authorizationCode);
    } else {
        // If there is no authorization code, initiate the GitHub OAuth login
        loginWithGitHub();
    }
});



// Check if there is an access token in the URL when the page loads
const accessToken = getGitHubAccessToken();
if (accessToken) {
    // The user has successfully logged in with GitHub
    // You can send the access token to your server for further processing
    console.log('GitHub Access Token:', accessToken);
    // Redirect or perform other actions as needed
}
