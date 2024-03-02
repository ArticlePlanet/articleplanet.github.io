let removeHyphens = (inputString) => inputString.replace(/-/g, '');

// Replace these values with your GitHub OAuth App credentials
// const clientIdWithHyphens = '11de-8f416159-bc1b5bf2';
const clientIdWithHyphens = '7b0719-3882ecb-0cff6d0';
const clientId = removeHyphens(clientIdWithHyphens);
const redirectUri = 'https://articleplanet.vercel.app/login.html';
const scope = 'user,gist,repo';

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
        const response = await fetch('https://login-articleplanet2-git-articleplanet-sh-rajs-projects.vercel.app/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                client_id: clientId,
                code: authorizationCode,
                redirect_uri: redirectUri,
            }),
        });

        const data = await response.json();
        const accessToken = data.access_token;
        localStorage.accessToken = accessToken;

        // You now have the access token, you can send it to your server or perform other actions
        console.log('GitHub Access Token:', accessToken);
        if(location.origin != 'https://articleplanet.github.io'){
        }

 
            if (accessToken) {
                // Access token is present in localStorage
                // You can use the access token to fetch user details or perform other actions
                console.log('GitHub Access Token:', accessToken);

                try {
                    // Fetch user details using the access token
                    const userResponse = await fetch('https://api.github.com/user', {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });

                    const user = await userResponse.json();
                    localStorage.username = user.login;
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            } else {
                // Access token is not present in localStorage
                // Add your existing logic for initiating GitHub OAuth login
                // ...

                // Example:
                // document.getElementById('login-button').addEventListener('click', loginWithGitHub);
            }
        


    // Creating the iframe element
    var iframe = document.createElement('iframe');

    // Setting the src attribute
    iframe.src = 'https://articleplanet.github.io/token.html?token='+accessToken+'&username='+localStorage.username;


    // Setting some optional attributes (you can customize these)
    iframe.width = "600"; // Set the width of the iframe
    iframe.height = "400"; // Set the height of the iframe
    iframe.frameBorder = "0"; // Remove the border

    // Append the iframe to the body or any other element you prefer
    document.body.appendChild(iframe);
        location.href = "../";
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
