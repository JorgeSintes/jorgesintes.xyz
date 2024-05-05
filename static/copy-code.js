document.addEventListener('DOMContentLoaded', function () {
    // Find all <pre> elements containing <code> blocks
    var codeBlocks = document.querySelectorAll('pre code');
    // Loop through all code blocks
    codeBlocks.forEach(function (code, i) {
        var pre = code.parentNode; // Get the <pre> element containing the <code>
        code.id = `code-${i}`;
        var wrapper = document.createElement("div");
        wrapper.className = "code-wrapper"
        // Place the wrapper just before the pre element
        pre.parentNode.insertBefore(wrapper, pre);

        // Create the button element
        var button = document.createElement('button');
        button.className = 'copy-button';
        button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z"/></svg>';
        // Set the button to copy the text within the <code> block
        button.setAttribute("data-clipboard-target", "#" + code.id);

        // Move both the button and pre elements inside the wrapper
        wrapper.appendChild(button);
        wrapper.appendChild(pre);

    });

    var clipboard = new ClipboardJS('.copy-button')
    clipboard.on('success', function (e) {
        var btn = e.trigger; // the button that was clicked
        var originalHTML = btn.innerHTML;
        btn.innerHTML = 'Yanked!'; // Change button text to 'Yanked!'

        setTimeout(function () {
            btn.innerHTML = originalHTML; // Revert text back after 2s
        }, 2000);

        e.clearSelection(); // Optionally clear the selection
    });

    clipboard.on('error', function (e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
    });
});
