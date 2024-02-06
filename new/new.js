// Function to create a slug from the title
function createSlug(title) {
    const sanitizedTitle = title.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');
    return sanitizedTitle.replace(/-{2,}/g, '-');
}
if(!localStorage.accessToken) location.href = "../login.html?from=new";

// Function to publish content to GitHub Gist and open the Gist with metadata
window.publish = async function () {
    const markdownContent = editor.getValue();
    const title = document.getElementById('title').value;
    const slug = createSlug(title);

    // Replace with your GitHub personal access token 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
    let removeHyphens = (inputString) => inputString.replace(/-/g, '');

    // Example usage
    let accessToken = removeHyphens('ghp_Ixw7ru-DuGAmi-DS58feJJp-I7IWKArPC-1SSlQo');
    accessToken = localStorage.accessToken;
    console.log(accessToken)

    // GitHub Gist API endpoint
    const gistApiEndpoint = 'https://api.github.com/gists';

    // Metadata template to include in the markdown file
    const metadataTemplate = `---
title: "${title}"
seoTitle: "${title}"
seoDescription: "${title}"
datePublished: ${new Date().toUTCString()}
id: {gistID}
slug: ${slug}
ArticlePlanet: https://articleplanet.github.io/posts/{gistID} 
canonical: https://articleplanet.github.io/post.html?id={gistID}
cover: 
tags: css, js, html5, ArticlePlanet
---
`;
async function saveToGitHubGist(markdownContent, gistId) {
    // GitHub Gist API endpoint
    const gistApiEndpoint = `https://api.github.com/gists/${gistId}`;

    try {
        // Fetch the existing Gist data
        const gistResponse = await fetch(gistApiEndpoint);
        const gistData = await gistResponse.json();

        // Extract the current filename
        const currentFilename = Object.keys(gistData.files)[0];

        // Update the title in the Gist data
        gistData.description = document.getElementById("title").value;

        // Update the existing Gist with the new data
        const response = await fetch(gistApiEndpoint, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                description: gistData.description, // Update the Gist description (title)
                files: {
                    [currentFilename]: {
                        content: markdownContent,
                    },
                },
            }),
        });

        // Check if the update was successful
        if (response.ok) {
            // Inform the user about successful saving
            swal("Changes Saved Successfully!", "", "success");
            // Inform the user about successful publishing
        swal('Published Successfully!', 'Your post has been published to GitHub Gist.', 'success');
        location.href = location.origin + "/post/" + gistID;

        } else {
            console.error("Error updating Gist:", response.statusText);
            swal("Error", "Failed to save changes. Check the console for details.", "error");
        }
    } catch (error) {
        console.error("Error updating Gist:", error);
        swal("Error", "Failed to save changes. Check the console for details.", "error");
    }
}

    try {
        // Create a new Gist with the Markdown content and title-encoded-slug.md as the filename
        const response = await fetch(gistApiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                files: {
                    [`${slug}.md`]: {
                        content: metadataTemplate + markdownContent // Include metadata before the actual content
                    }
                },
                description: `${title}`, // Include the tag in the description
                public: true
            })
        });

        const responseData = await response.json();

        // Extract necessary information from the response
        const gistUrl = responseData.html_url;
        const gistID = responseData.id;

        // Replace placeholders with actual gist ID in metadata
        const updatedMetadata = metadataTemplate.replace(/{gistID}/g, gistID);
        console.log(updatedMetadata);
        // Update the Gist with the correct metadata
        await saveToGitHubGist(updatedMetadata + markdownContent,gistID);
        


    } catch (error) {
        console.error('Error publishing to Gist:', error);
        swal('Error', 'Failed to publish the post. Check the console for details.', 'error');
    }
};

// Event listener to automatically save content and title to localStorage on editor change
function savepost() {
    const title = document.getElementById('title').value;
    localStorage.setItem('content', editor.getValue());
    localStorage.title = title;
}

// Load content and title from localStorage on page load
let storedContent = localStorage.getItem('content');
let storedTitle = localStorage.title;

if (storedContent) {
    editor.setValue(storedContent);
}

if (storedTitle) {
    document.getElementById('title').value = storedTitle;
}

// Additional Event listeners
document.addEventListener('DOMContentLoaded', function () {
    editor.on('change', savepost);
    document.getElementById("title").onchange = savepost;
});
