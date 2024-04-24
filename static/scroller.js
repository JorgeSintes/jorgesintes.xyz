var buttonContainer = document.getElementById("scroll-to-top-container");

window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.documentElement.scrollTop > 150) {
        buttonContainer.style.top = "90dvh";  // Position it 20px up from the bottom of the view
    } else {
        buttonContainer.style.top = "120dvh";  // Hide it by moving it below the viewport
    }
}

buttonContainer.onclick = function () {
    scrollToTop();
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}