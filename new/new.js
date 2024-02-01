// Function to create a slug from the title
function createSlug(title) {
    return title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
}

// Function to publish content to GitHub Gist and open the Gist with metadata
window.publish = async function () {
    const markdownContent = editor.getValue();
    const title = document.getElementById('title').value;
    const slug = createSlug(title);

    // Replace with your GitHub personal access token
    const accessToken = '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';

    // GitHub Gist API endpoint
    const gistApiEndpoint = 'https://api.github.com/gists';

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
                        content: markdownContent // Include only the actual content
                    }
                },
                description: `${title} - ArticlePlanet`, // Include the tag in the description
                public: true
            })
        });

        const responseData = await response.json();
        const gistID = responseData.id; // Get the Gist ID from the response

        // Metadata to include in the markdown file
        const metadata = `
---
title: "${title}"
seoTitle: "${title}"
seoDescription: "${title}"
datePublished: ${new Date().toUTCString()}
cuid: ${gistID} // Use the Gist ID as cuid
gistid: ${gistID} // Include the Gist ID in metadata
slug: ${slug}
canonical: https://articleplanet.github.io/${slug}
cover: https://articleplanet.github.io/cover-image.jpg
tags: css, apis, html5, telegram, telegram-bot, ArticlePlanet
ArticlePlanet: https://articleplanet.github.io/post/${gistID}
---
`;

After this edit the file once and add the metadata in the markdown file 

        // Extract necessary information from the response
        const gistUrl = responseData.html_url;
        const publishDate = new Date().toUTCString();
        const canonical = gistUrl;

        // Open the published Gist with metadata in a new window
        const metadataUrl = `${gistUrl}?title=${encodeURIComponent(title)}&publishdate=${encodeURIComponent(publishDate)}&canonical=${encodeURIComponent(canonical)}`;
        window.open(metadataUrl, '_blank');

        // Inform the user about successful publishing
        swal('Published Successfully!', 'Your post has been published to GitHub Gist.', 'success');
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
