window.addEventListener("load", () => {
  const loader = document.getElementById("loader-wrapper");

  // Function to hide loader
  const hideLoader = () => {
    if (loader) {
      loader.classList.add("fade-out");
    }
  };

  // 1. Hide immediately when page is fully loaded
  hideLoader();

  // 2. Fail-safe: Force hide after 4 seconds even if internet is slow
  setTimeout(hideLoader, 10000);
});

// --- 1. INITIALIZATION ---

// Initialize EmailJS (REPLACE WITH YOUR KEYS)
// Sign up at emailjs.com to get these
(function () {
  emailjs.init("zpPHzuR7vQR2DkKEP");
})();

// --- 2. PARTICLES JS CONFIG ---
particlesJS("particles-js", {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: "#00e5ff" },
    shape: { type: "circle" },
    opacity: { value: 0.5 },
    size: { value: 3, random: true },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#b700ff",
      opacity: 0.2,
      width: 1,
    },
    move: { enable: true, speed: 2 },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "grab" },
      onclick: { enable: true, mode: "push" },
    },
    modes: { grab: { distance: 140, line_linked: { opacity: 1 } } },
  },
});

// --- 3. CUSTOM CURSOR LOGIC ---
const cursorDot = document.querySelector(".cursor-dot");
const cursorCircle = document.querySelector(".cursor-circle");
const body = document.body;

window.addEventListener("mousemove", (e) => {
  cursorDot.style.left = `${e.clientX}px`;
  cursorDot.style.top = `${e.clientY}px`;

  // Small delay for the circle
  setTimeout(() => {
    cursorCircle.style.left = `${e.clientX}px`;
    cursorCircle.style.top = `${e.clientY}px`;
  }, 50);
});

// Hover effect for interactive elements
document.querySelectorAll(".hover-trigger, a, button, input").forEach((el) => {
  el.addEventListener("mouseenter", () => body.classList.add("hovering"));
  el.addEventListener("mouseleave", () => body.classList.remove("hovering"));
});

// --- 4. SCROLL ANIMATION (Intersection Observer) ---
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  { threshold: 0.1 },
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const hoverables = document.querySelectorAll(
  "a, button, .price-card, .mentor-card",
);
hoverables.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursorOutline.style.transform = "translate(-50%, -50%) scale(1.5)";
    cursorOutline.style.backgroundColor = "rgba(0, 229, 255, 0.1)";
  });
  el.addEventListener("mouseleave", () => {
    cursorOutline.style.transform = "translate(-50%, -50%) scale(1)";
    cursorOutline.style.backgroundColor = "transparent";
  });
});

// --- 5. NAVIGATION LOGIC (SPA FEEL) ---
function openPayment(planName, price) {
  // Scroll to top
  window.scrollTo(0, 0);

  // Hide Landing, Show Payment
  document.getElementById("landing-view").style.display = "none";
  document.getElementById("payment-view").style.display = "block";

  // Populate Form Data
  const planText = `${planName} - ₹${price}`;
  document.getElementById("selected-plan").value = planText;

  // Update QR Code Amount (Just for visual realism using API)
  // 4. SET STATIC QR CODE IMAGE
  const qrImage = document.getElementById("dynamic-qr");

  // Switch logic based on price (or planName)
  if (price === "299") {
    qrImage.src = "https://i.ibb.co/Jjv3vs4K/Screenshot-2026-02-15-022409.png"; // Path to Builder QR
    qrImage.alt = "Pay ₹299 for The Builder";
  } else if (price === "399") {
    qrImage.src = "https://i.ibb.co/qKwyLB1/Screenshot-2026-02-15-023132.png"; // Path to Networker QR
    qrImage.alt = "Pay ₹399 for The Networker";
  } else if (price === "499") {
    qrImage.src = "https://i.ibb.co/36bFtW9/Screenshot-2026-02-15-023324.png"; // Path to Elite QR
    qrImage.alt = "Pay ₹499 for The Elite";
  } else {
    // Fallback if something goes wrong
    qrImage.src = "default-qr.jpg";
  }
}

function closePayment() {
  window.scrollTo(0, 0);
  document.getElementById("payment-view").style.display = "none";
  document.getElementById("landing-view").style.display = "block";
}

// --- 6. FORM SUBMISSION LOGIC ---
async function handleFormSubmit(event) {
    event.preventDefault();

    const submitBtn = document.getElementById("submit-btn");
    const originalText = submitBtn.innerHTML;
    const fileInput = document.querySelector('input[name="screenshot"]');
    const file = fileInput.files[0];

    // --- YOUR KEY IS ALREADY CONFIRMED ---
    const imgbbAPIKey = "223628172fdaf72384576862b64dae93"; 
    // -------------------------------------

    if (!file) {
        alert("Please upload the payment screenshot first.");
        return;
    }

    // Start Upload Process
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    submitBtn.disabled = true;

    try {
        const formData = new FormData();
        formData.append("image", file);

        // 1. Upload to ImgBB
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error.message);
        }

        const imageUrl = result.data.url;
        console.log("Upload success:", imageUrl);

        // 2. Send Email
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Sending Email...';

        const emailParams = {
            plan: document.getElementById("selected-plan").value,
            name: document.querySelector('input[name="name"]').value,
            email: document.querySelector('input[name="email"]').value,
            phone: document.querySelector('input[name="phone"]').value,
            college: document.querySelector('input[name="college"]').value,
            branch: document.querySelector('input[name="branch"]').value,
            transaction_id: document.querySelector('input[name="transaction_id"]').value,
            screenshot_link: imageUrl
        };

        // REPLACE THESE WITH YOUR ACTUAL EMAILJS IDS
        const serviceID = "service_mz55an8";   
        const templateID = "template_z2s9yin"; 

        await emailjs.send(serviceID, templateID, emailParams);

        // Success!
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Registered!';
        submitBtn.style.background = "#00e5ff";
        alert("✅ Registration Successful! Check your email.");

        document.getElementById("payment-form").reset();
        setTimeout(() => {
            // Close the payment modal logic if you have it
            if (typeof closePayment === "function") { 
                closePayment(); 
            }
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = "";
        }, 2000);

    } catch (error) {
        console.error("FULL ERROR OBJECT:", error); // Check Console (F12) for details

        let errorMessage = "Something went wrong.";

        // 1. Check for Standard Errors (like Network issues)
        if (error.message) {
            errorMessage = error.message;
        } 
        // 2. Check for EmailJS Errors (they use .text instead of .message)
        else if (error.text) {
            errorMessage = error.text;
        } 
        // 3. Check if the error is just a text string
        else if (typeof error === "string") {
            errorMessage = error;
        } 
        // 4. Last resort: turn the object into text
        else {
            errorMessage = JSON.stringify(error);
        }

        alert("❌ Failed: " + errorMessage);
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = "";
    }
}
