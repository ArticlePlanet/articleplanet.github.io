---
title: "Get Instant Form Submissions data on Your Telegram App - GetIntoTouchBot"
seoTitle: "Get Instant Form Submissions data on Your Telegram App - GetIntoTouchB"
seoDescription: "Get Instant Form Submissions data on Your Telegram App - GetIntoTouchBot"
datePublished: Tue Jul 25 2023 06:02:47 GMT+0000 (Coordinated Universal Time)
cuid: clkhw4bul000k09mega6p980a
slug: get-instant-form-submissions-data-on-your-telegram-app-getintotouchbot
canonical: https://getintotouch.sh20raj.com/
cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1690266987772/632ea7c7-8639-4ac8-b7ee-ba76a6dd33d3.png
tags: css, apis, html5, telegram, telegram-bot

---

*Introduction*

Engaging with your website's visitors has never been more enchanting! The Telegram Contact Form Widget powered by GetIntoTouch lets you receive form submissions directly on your Telegram app as instant notifications or messages. Whether you have a blog, portfolio, or any HTML-based website, this widget effortlessly streamlines communication, ensuring you never miss a query or feedback. In this step-by-step guide, we'll show you how to integrate this captivating Telegram Contact Form Widget, while giving you the freedom to choose your preferred implementation method.

*The Magic of the Telegram Contact Form Widget*

The Telegram Contact Form Widget offers a spellbinding array of benefits for your website:

1. **Real-Time Notifications**: Instantly receive form submissions on your Telegram app, enabling swift responses to user inquiries.
    
2. **Versatile Integration**: Whether you have a blog on Blogger or any HTML-based website, this widget can work its magic anywhere.
    
3. **Customizable Form Template**: Pick any form template from the internet, and the widget will seamlessly send data to the API URL.
    
4. **User-Friendly Experience**: Visitors can easily submit information, messages, and even files through a user-friendly form.
    

*Creating Your Telegram Contact Form Widget*

**Step 1: Obtain Your Telegram User ID**

Before proceeding, ensure you have your Telegram User ID. If you don't have it already, visit [Telegram.me/userinfobot](http://Telegram.me/userinfobot) to obtain your Telegram User ID, and keep it handy for later use.

**Step 2: Access GetIntoTouch API Documentation**

Visit [GetIntoTouch API Documentation](https://getintotouch.sh20raj.com/) and explore the magic of receiving form submissions on your Telegram app.

**Step 3: Generate Your API URL**

Using the API documentation, create your unique API URL by appending your Telegram User ID to the endpoint:

[`https://getintotouch.sh20raj.com/api.php?id={YOUR_TELEGRAM_USER_ID}`](https://getintotouch.sh20raj.com/api.php?id=%7BYOUR_TELEGRAM_USER_ID%7D)

Replace `{YOUR_TELEGRAM_USER_ID}` with your Telegram User ID in the API URL.

**Step 4: Customize Your Form**

Choose a captivating form template from the internet or design your own using HTML. Make sure it includes essential fields like Name, Message, and an optional Photo/File upload.

**Step 5: Implement the Form Submission (Option 1: action Attribute)**

In the `<form>` tag of your contact form, set the `action` attribute to your unique API URL generated in Step 3, and set the `method` attribute to "POST."

```html
<form id="messageForm" method="post" enctype="multipart/form-data" action="https://getintotouch.sh20raj.com/api.php?id={YOUR_TELEGRAM_USER_ID}">
    <!-- Your form fields here -->
</form>
```

**Step 5: Implement the Form Submission (Option 2: Fetch/XHR Request)**

Alternatively, you can use JavaScript to handle the form submission and post the data to the API URL. Use the following script code:

```html
<script>
    document.getElementById("messageForm").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the default form submission

        const form = event.target;
        const formData = new FormData(form);
        const userid = 'Enter Your Telegram User ID taken from @userinfobot';

        fetch("https://getintotouch.sh20raj.com/api.php?id=" + userid, {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response data as needed
            console.log(data);
            if (data.status === 'success') {
                // Optionally, display a success message to the user
                alert("Message sent successfully!");
            } else if (data.status === 'failed') {
                alert("Message sent Failed!");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            // Optionally, display an error message to the user
            alert("An error occurred while sending the message.");
        });
    });
</script>
```

**Step 6: Test Your Telegram Contact Form Widget**

Test your Telegram Contact Form Widget by submitting a sample entry and ensuring you receive the corresponding notification on your Telegram app.

*Conclusion*

Congratulations! You've summoned the magic of the Telegram Contact Form Widget, allowing you to receive form submissions as instant notifications or messages on your Telegram app. Whether you have a blog on Blogger or any HTML-based website, this widget ensures a seamless and engaging communication experience with your visitors.

Feel free to explore more captivating widgets at [Widget Wonderland](https://widgetwonderland.hashnode.dev/) and gain valuable insights at [CodexDIndia](https://codexdindia.blogspot.com/). To start receiving your form submissions on your Telegram app, visit [GetIntoTouch](https://getintotouch.sh20raj.com/), and let the enchantment begin!

Embrace the power of real-time communication and never miss a beat with the Telegram Contact Form Widget. Happy blogging, and let the form submissions flow magically into your Telegram app notifications/messages!