document.addEventListener("DOMContentLoaded", function () {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Add the 'visible' class when the element is in view
                    entry.target.classList.add("visible");

                    // After animation finishes, keep the image visible for a while
                    entry.target.addEventListener("animationend", () => {
                        // Keep the image visible for an additional 3 seconds before removing the class
                        setTimeout(() => {
                            entry.target.classList.remove("visible");
                        }, 10000); // Adjust this time as needed (e.g., 3000ms = 3 seconds)
                    });
                }
            });
        },
        { threshold: 0.1 } // Trigger when 10% of the image is visible
    );

    // Select all images with the 'animation' class
    const images = document.querySelectorAll(".animation");
    images.forEach((image) => observer.observe(image));
});
