// Function to create a slug from the title
function createSlug(title) {
    const sanitizedTitle = title.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');
    return sanitizedTitle.replace(/-{2,}/g, '-');
}

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
id: {gistID}  // Placeholder for gist ID, to be replaced after publishing
slug: ${slug}
ArticlePlanet: https://articleplanet.github.io/posts/{gistID}  // Placeholder for gist ID, to be replaced after publishing
canonical: https://articleplanet.github.io/posts/{gistID}  // Placeholder for gist ID, to be replaced after publishing
cover: https://articleplanet.github.io/assets/dot.png
tags: css, js, html5, ArticlePlanet
---
`;

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
        await fetch(gistUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                files: {
                    [`${slug}.md`]: {
                        content: updatedMetadata + markdownContent // Include updated metadata before the actual content
                    }
                }
            })
        });

        // Inform the user about successful publishing
        swal('Published Successfully!', 'Your post has been published to GitHub Gist.', 'success');
        location.href = location.origin + "/post.html?id=" + gistID;

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
