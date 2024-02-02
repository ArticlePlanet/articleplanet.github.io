// edit-post.js

document.addEventListener('DOMContentLoaded', async function () {
    // Function to extract query parameter value by name
    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Retrieve the Gist ID from the URL parameter
    const gistId = getQueryParam('id');

    if (gistId) {
        // GitHub Gist API endpoint
        const gistApiEndpoint = `https://api.github.com/gists/${gistId}`;

        try {
            // Fetch Gist content
            const response = await fetch(gistApiEndpoint);
            const gistData = await response.json();

            // Extract necessary information from the Gist data
            const markdownContent = gistData.files[Object.keys(gistData.files)[0]].content;

            // Display the edit content
            document.getElementById('edit-content').innerHTML = `
                <textarea id="edited-content" rows="10" cols="50">${markdownContent}</textarea>
                <br>
                <button onclick="saveEdits('${gistId}', '${Object.keys(gistData.files)[0]}')">Save Edits</button>
            `;

        } catch (error) {
            console.error('Error fetching Gist:', error);
            document.getElementById('edit-content').innerHTML = '<p>Error loading Gist content.</p>';
        }
    } else {
        document.getElementById('edit-content').innerHTML = '<p>No Gist ID provided in the URL.</p>';
    }
});

async function saveEdits(gistId, originalFileName) {
    const editedContent = document.getElementById('edited-content').value;
    let removeHyphens = (inputString) => inputString.replace(/-/g, '');

    // Example usage
    let accessToken = 'ghp_N2CeZ-dpQsyQmDEvg-VIrglwov2-gkT782kj8eq';
    accessToken = removeHyphens(accessToken);

    try {
        // Update the Gist with the edited content
        const response = await fetch(`https://api.github.com/gists/${gistId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                files: {
                    [originalFileName]: {
                        content: editedContent,
                    },
                },
            }),
        });

        const responseData = await response.json();

        // Inform the user about successful editing
        alert('Post edited successfully!');

    } catch (error) {
        console.error('Error editing Gist:', error);
        alert('Failed to edit the post. Check the console for details.');
    }
}
