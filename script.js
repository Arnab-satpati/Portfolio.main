// Global variables
let locoScroll;

// Setup reveal elements
function setupRevealElements() {
    document.querySelectorAll(".reveal").forEach(function(elem) {
        let parent = document.createElement("span");
        let child = document.createElement("span");

        parent.setAttribute('class', 'parent');
        child.setAttribute('class', 'child');

        child.innerHTML = elem.innerHTML;
        parent.appendChild(child);
        elem.innerHTML = "";
        elem.appendChild(parent);
    });
}

// Initial setup for GSAP animations
function initialSetup() {
    gsap.set("nav a", { y: "-100%", opacity: 0 });
    gsap.set("#home .down-arrow img", { opacity: 0 });
    gsap.set("#home svg", { opacity: 0 });
}

// Loader animation
function runLoaderAnimation() {
    return gsap.timeline()
        .from(".child span", {
            x: 150,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.inOut",
            opacity: 0.2,
        })
        .to(".parent .child", {
            y: "-110%",
            duration: 0.6,
            ease: "circ.inOut",
        })
        .to(".black", {
            height: 0,
            duration: 0.6,
            ease: "circ.inOut",
        })
        .from(".green", {
            height: "60%",
            duration: 0.6,
            ease: "power3.inOut",
        })
        .set("#loader", {
            zIndex: -6,
            onComplete: function() {
                // Also set the z-index directly to ensure it's applied
                document.querySelector('#loader').style.zIndex = "-6";
            }
        });
}

// Homepage animation
function animateHomepage() {
    return gsap.timeline()
        .to("#home", {
            height: "100%",
            duration: 0.8,
            ease: "circ.inOut",
        })
        .to("nav a", {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            ease: "expo.inOut",
        })
        .to("#home .reveal .parent .child", {
            y: 0,
            stagger: 0.1,
            ease: "expo.inOut",
        })
        .to("#home img", {
            opacity: 1,
        });
}

// SVG animation
function animateSVG() {
    document.querySelectorAll('#Visual>g').forEach(function(e) {
        try {
            let character = e.childNodes[1].childNodes[1];
            character.style.strokeDasharray = character.getTotalLength() + 'px';
            character.style.strokeDashoffset = character.getTotalLength() + 'px';
        } catch (error) {
            console.log("Error setting up SVG animation:", error);
        }
    });

    gsap.to("svg", {
        opacity: 1,
    });

    gsap.to("#Visual>g>g>path,polyline", {
        strokeDashoffset: 0,
        stagger: 0.3,
        duration: 1.2,
        ease: "power3.inOut",
    });
}

// Initialize Locomotive Scroll
function initLocomotiveScroll() {
    try {
        // Kill any existing instance
        if (locoScroll) {
            locoScroll.destroy();
        }

        // Check if LocomotiveScroll is available
        if (typeof LocomotiveScroll === 'undefined') {
            console.error('LocomotiveScroll is not defined. Make sure the library is loaded correctly.');
            return null;
        }

        // Create new instance with improved settings
        locoScroll = new LocomotiveScroll({
            el: document.querySelector('#main'),
            smooth: true,
            multiplier: 0.5,  // Reduced for smoother scrolling
            class: 'is-inview',
            getDirection: true,
            getSpeed: false,  // Disable speed calculation for smoother experience
            reloadOnContextChange: true,
            lerp: 0.12,  // Adjusted for smoother scrolling
            smartphone: {
                smooth: true,
                multiplier: 0.5,
                lerp: 0.12
            },
            tablet: {
                smooth: true,
                multiplier: 0.5,
                lerp: 0.12
            }
        });
    } catch (error) {
        console.error('Error initializing LocomotiveScroll:', error);
        return null;
    }

    // Fix for container issues - force update after a short delay
    setTimeout(() => {
        if (locoScroll) {
            locoScroll.update();
        }
    }, 1000);

    // Add scroll event listener to manually handle image parallax
    try {
        locoScroll.on('scroll', (instance) => {
        // Target only img tags with data-scroll-speed attribute
        document.querySelectorAll('img[data-scroll-speed]').forEach(element => {
            const speed = parseFloat(element.getAttribute('data-scroll-speed'));
            // Adjust the multiplier to make the effect more pronounced
            const y = (instance.scroll.y * speed) * 0.25;

            // Apply transform ONLY to the image, not the container
            element.style.transform = `translateY(${y}px)`;
        });

        // Force all elements with no-locomotive-effect class to stay in place
        document.querySelectorAll('.no-locomotive-effect').forEach(element => {
            // Override any transform that locomotive might have applied
            if (element.tagName.toLowerCase() !== 'img') {
                element.style.transform = 'none';
            }
        });

        // Create horizontal movement and rotation effect for imgc elements based on scroll direction
        const scrollPosition = instance.scroll.y;
        const maxScroll = 1200; // Adjusted for a moderate speed effect

        // Calculate horizontal shift factor with reduced speed for slower movement
        // Positive when scrolling up (moves right toward original position)
        // Negative when scrolling down (moves left from original position)
        const horizontalShift = -1 * (scrollPosition / maxScroll) * 8; // Adjusted to 8% for moderate speed

        // Calculate rotation factor with a strict maximum of 10 degrees and reduced speed
        // Positive when scrolling up (rotates right)
        // Negative when scrolling down (rotates left)
        let rotationFactor = -1 * (scrollPosition / maxScroll) * 5; // Adjusted to 5 for moderate rotation speed

        // Ensure rotation doesn't exceed 10 degrees in either direction
        rotationFactor = Math.max(Math.min(rotationFactor, 10), -10);

        document.querySelectorAll('.imgrig .imgc').forEach((imgc, index) => {
            // Get original translation values for each imgc
            let originalX = 0;
            let translateY = 0;
            let originalRotate = 0;

            // Set exact initial positions for each imgc as specified
            if (index === 0) {
                originalX = -24.26;
                translateY = -51;
                originalRotate = -4.786;
            } else if (index === 1) {
                originalX = -9.45;
                translateY = -34;
                originalRotate = -5.3;
            } else if (index === 2) {
                originalX = 16.55;
                translateY = -20;
                originalRotate = -2.3;
            }

            // Apply the transform with adjusted horizontal position and rotation based on scroll
            // When scrolling up: moves right toward original position and rotates right
            // When scrolling down: moves left from original position and rotates left
            const adjustedX = originalX + horizontalShift;

            // Calculate final rotation, ensuring it doesn't exceed 10 degrees from original
            const adjustedRotation = originalRotate + rotationFactor;

            // Apply the transform with the exact positioning and limited rotation
            imgc.style.transform = `translate(${adjustedX}%, ${translateY}%) rotate(${adjustedRotation}deg)`;
        });
    });
    } catch (error) {
        console.error('Error setting up scroll event listener:', error);
    }

    return locoScroll;
}

// Main initialization function
function init() {
    // Add loading class to body to prevent scrolling during animation
    document.body.classList.add('loading');

    // Setup elements and initial states
    setupRevealElements();
    initialSetup();

    // Run animations in sequence
    const loaderTimeline = runLoaderAnimation();

    loaderTimeline.eventCallback("onComplete", () => {
        // Remove loading class to allow scrolling after animation
        document.body.classList.remove('loading');

        // Initialize locomotive scroll first
        initLocomotiveScroll();

        // Then run homepage animations
        const homepageTimeline = animateHomepage();

        homepageTimeline.eventCallback("onComplete", () => {
            // Finally animate SVG
            animateSVG();

            // Update locomotive scroll after all animations
            if (locoScroll) {
                locoScroll.update();
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (locoScroll) {
            locoScroll.update();
        }
    });

    // Update on image load
    window.addEventListener('load', () => {
        if (locoScroll) {
            locoScroll.update();
        }
    });
}

// Start everything when DOM is ready
document.addEventListener('DOMContentLoaded', init);
