 function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        const paramValue = urlParams.get(name);
    
        if (paramValue !== null) {
            return paramValue;
        } else {
            // If parameter is not set, try to extract it from the URL path
            const pathSegments = window.location.pathname.split('/');
            const idFromPath = pathSegments[pathSegments.length - 1];
            
            // Return the extracted ID from the URL path
            return idFromPath;
        }
    }

document.addEventListener('DOMContentLoaded', async function () {
   
    
    // Retrieve the Gist ID from the URL parameter or path
    window.gistId = getQueryParam('id');
    
    if (gistId) {
        // GitHub Gist API endpoint
        const gistApiEndpoint = `https://api.github.com/gists/${gistId}`;

        try {
            // Fetch Gist content
            const response = await fetch(gistApiEndpoint);
            window.gistData = await response.json();

            // Extract necessary information from the Gist data
            window.markdownContent = gistData.files[Object.keys(gistData.files)[0]].content;
            const title = gistData.description;
            const publishDate = gistData.updated_at; // Use updated_at as a substitute for publish date

            // Extract metadata from Markdown front matter
            window.metadata = extractMetadata(markdownContent);

            // Set document title
            document.title = title;

            // Set post title
            document.getElementById('post-title').textContent = title;

            // Set date
            const formattedDate = new Date(publishDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                timeZoneName: 'short'
            });

            document.getElementById('post-date').textContent = formattedDate;

            // Set cover image
            if (window.metadata.cover) {
                const coverImg = document.getElementById('post-cover');
                coverImg.src = window.metadata.cover;
                coverImg.alt = 'Cover Image';
            }
            function extractMarkdownFromYAML(yamlString) {
                const match = yamlString.match(/^---([\s\S]*?)\n---([\s\S]*)/);
            
                if (match && match[2]) {
                    return match[2].trim();
                }
            
                return yamlString.trim();
            }

            const converter = new showdown.Converter();
            const htmlContent = converter.makeHtml(extractMarkdownFromYAML(markdownContent));
            document.getElementById('post-content').innerHTML = htmlContent;

            // Apply Prism.js for code highlighting
            Prism.highlightAll();
        } catch (error) {
            console.error('Error fetching Gist:', error);
            document.getElementById('post-content').innerHTML = '<p>Error loading Gist content.</p>';
        }
    } else {
        document.getElementById('post-content').innerHTML = '<p>No Gist ID provided in the URL.</p>';
    }

    function extractMetadata(markdown) {
        const frontMatter = markdown.split('---')[1];
        const metadataLines = frontMatter.split('\n').filter(line => line.trim() !== '');

        const metadata = {};
        metadataLines.forEach(line => {
            const [key, ...valueParts] = line.split(':').map(item => item.trim());
            metadata[key] = valueParts.join(':').replace(/(^"|"$)/g, '').trim();
        });

        // Convert tags to an array
        metadata.tags = metadata.tags ? metadata.tags.split(',').map(tag => tag.trim()) : [];

        return metadata;
    }
    document.getElementById("editbtn").href = "../edit/?id="+gistId;
    document.getElementById("gist").href = "https://gist.github.com/"+gistId;
    document.getElementById("author").innerText = gistData.owner.login;
    document.getElementById("author").href = "user.html?id="+gistData.owner.login;
    document.getElementById("avatar").src = gistData.owner.avatar_url;
    console.log(gistData.owner.avatar_url)
    document.getElementById("vclink").href = "https://visitorbadge.io/status?path="+ gistId;
    document.getElementById("vclink").src = "https://visitorbadge.io/status?path="+ gistId;


});

async function deletePost() {

    // Display a confirmation dialog
    const isConfirmed = confirm('Are you sure you want to delete this post?');

    if (!isConfirmed) {
        // User cancelled the deletion
        return;
    }

    try {
        const response = await fetch(`https://api.github.com/gists/${gistId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.accessToken}`
            }
        });

        if (response.ok) {
            // Successfully deleted, you can handle UI updates or navigate to a different page
            console.log('Post deleted successfully');
            // Example: Redirect to the homepage
            window.location.href = '/';
        } else {
            console.error('Error deleting post:', response.statusText);
            // Handle error, show a message, etc.
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        // Handle error, show a message, etc.
    }
}

// Sample metadata.tags array

// Function to generate HTML for tags
function generateTagsHTML(tags) {
  const tagsList = document.createElement('ul');
  tagsList.classList.add('tags');

  tags.forEach(tag => {
    const tagItem = document.createElement('li');
    const tagLink = document.createElement('a');
    tagLink.href = '#';  // Replace with the actual URL for the tag

    // Assuming you want to display the tag in title case (first letter uppercase)
    const formattedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
    
    tagLink.textContent = formattedTag;
    tagItem.appendChild(tagLink);
    tagsList.appendChild(tagItem);
  });

  return tagsList.outerHTML;
}

// Example usage
const tagsHTML = generateTagsHTML(metadata.tags);

// Insert the generated HTML into your desired element
document.querySelector('.after-post-tags').innerHTML = tagsHTML;

