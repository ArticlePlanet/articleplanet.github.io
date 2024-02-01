// Fetch the Markdown content
fetch('sample-post.md')
    .then(response => response.text())
    .then(markdown => {
        // Extract metadata from Markdown front matter
        window.metadata = extractMetadata(markdown);

        // Set document title
        document.title = window.metadata.title;

        // Set post title
        document.getElementById('post-title').innerText = window.metadata.title;

        // Set date
        const formattedDate = new Date(window.metadata.datePublished).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short'
        });

        document.getElementById('post-date').innerText = formattedDate;

        // Set cover image
        if (window.metadata.cover) {
            const coverImg = document.getElementById('post-cover');
            coverImg.src = window.metadata.cover;
            coverImg.alt = 'Cover Image';
        }

        // Convert Markdown to HTML (excluding front matter)
        const contentWithoutMetadata = markdown.split('---').slice(2).join('---');
        const converter = new showdown.Converter();
        const html = converter.makeHtml(contentWithoutMetadata);

        // Display the HTML content in the post-content div
        document.getElementById('post-content').innerHTML = html;

        // Apply Prism.js for code highlighting
        Prism.highlightAll();
    })
    .catch(error => console.error('Error fetching Markdown:', error));

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
