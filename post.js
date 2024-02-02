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
    document.getElementById('editbtn').addEventListener("click",function (){
        let h = "../edit/index.html?id="+ gistId ;
        location.href = h;
    })
    
});
