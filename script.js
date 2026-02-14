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
function handleFormSubmit(event) {
  event.preventDefault();
  const btn = document.getElementById("submit-btn");
  const originalText = btn.innerHTML;

  // Show loading state
  btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
  btn.disabled = true;

  // Prepare Parameters
  // NOTE: In a real scenario, you need to match these keys with your EmailJS template variables
  const templateParams = {
    plan: document.querySelector('[name="plan"]').value,
    name: document.querySelector('[name="name"]').value,
    email: document.querySelector('[name="email"]').value,
    phone: document.querySelector('[name="phone"]').value,
    college: document.querySelector('[name="college"]').value,
    branch: document.querySelector('[name="branch"]').value,
    transaction_id: document.querySelector('[name="transaction_id"]').value,
    // Note: File attachments require advanced EmailJS setup or a cloud link.
    // For this code, we assume the text data sends successfully.
  };

  // EMAILJS SEND FUNCTION
  // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID'
  emailjs.send('service_mz55an8', 'template_z2s9yin', templateParams)
                .then(function() {
                    alert('Registration Successful! Check your email for confirmation.');
                    closePayment();
                    document.getElementById('payment-form').reset();
                }, function(error) {
                    alert('Failed to send. Please contact admin manually via WhatsApp.');
                    console.log('FAILED...', error);
                })
                .finally(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                });
            

  // SIMULATED SUCCESS (Remove this block when using real keys)
  setTimeout(() => {
    alert(
      "SUCCESS! \n\n(Simulated) Data sent to Admin. \nTransaction ID: " +
        templateParams.transaction_id,
    );
    btn.innerHTML = originalText;
    btn.disabled = false;
    closePayment();
  }, 1500);
}
