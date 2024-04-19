const themeToggle = {
    // Config
    rootAttribute: "data-theme",
    localStorageKey: "preferredColorScheme",

    // Init
    init() {
        this.scheme = this.schemeFromLocalStorage || this.preferredColorScheme;
        this.initToggle();
    },

    // Get color scheme from local storage
    get schemeFromLocalStorage() {
        return window.localStorage.getItem(this.localStorageKey);
    },

    // Preferred color scheme based on media query
    get preferredColorScheme() {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    },

    // Initialize toggle button
    initToggle() {
        const toggleButton = document.querySelector("div[data-theme-toggle]");
        toggleButton.addEventListener("click", () => {
            this.scheme = this.scheme === "dark" ? "light" : "dark";  // Toggle scheme
        }, false);
    },

    // Set scheme
    set scheme(value) {
        document.querySelector("html").setAttribute(this.rootAttribute, value);
        window.localStorage.setItem(this.localStorageKey, value);
        const visible = value === "dark" ? "sun-icon" : "moon-icon";
        const notVisible = value === "dark" ? "moon-icon" : "sun-icon";
        document.getElementById(visible).style.display = "block";
        document.getElementById(notVisible).style.display = "none";
    },

    // Get scheme
    get scheme() {
        return document.querySelector("html").getAttribute(this.rootAttribute) || "light";
    },
};

// Initialize the theme toggle
themeToggle.init();
