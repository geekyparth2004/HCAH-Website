const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector(".site-header");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll(".countup");
const parallaxItems = document.querySelectorAll("[data-speed]");
const tiltCards = document.querySelectorAll(".tilt-card");
const particleField = document.querySelector(".particle-field");
const contactForm = document.querySelector(".contact-form");
const statusMessage = document.querySelector(".status-message");


const updateScrollState = () => {
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

  document.documentElement.style.setProperty("--scroll-progress", `${progress}%`);

  if (header) {
    header.classList.toggle("scrolled", scrollTop > 18);
  }

  if (!prefersReducedMotion) {
    parallaxItems.forEach((item) => {
      const speed = Number(item.dataset.speed || 0);
      item.style.transform = `translate3d(0, ${scrollTop * speed}px, 0)`;
    });
  }
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const animateCounter = (counter) => {
  const target = Number(counter.dataset.target || 0);
  const suffix = counter.dataset.suffix || "";
  const duration = 1500;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.round(target * eased).toString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.6,
  }
);

counters.forEach((counter) => counterObserver.observe(counter));

if (!prefersReducedMotion) {
  tiltCards.forEach((card) => {
    const reset = () => {
      card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)";
      card.style.boxShadow = "0 20px 60px rgba(17, 73, 63, 0.12)";
    };

    card.addEventListener("mousemove", (event) => {
      const bounds = card.getBoundingClientRect();
      const px = (event.clientX - bounds.left) / bounds.width;
      const py = (event.clientY - bounds.top) / bounds.height;
      const rotateY = (px - 0.5) * 10;
      const rotateX = (0.5 - py) * 10;

      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.boxShadow = "0 28px 80px rgba(17, 73, 63, 0.18)";
    });

    card.addEventListener("mouseleave", reset);
    card.addEventListener("blur", reset, true);
  });
}

const createParticles = () => {
  if (!particleField || prefersReducedMotion) {
    return;
  }

  for (let i = 0; i < 18; i += 1) {
    const particle = document.createElement("span");
    const size = 6 + Math.random() * 16;
    const left = Math.random() * 100;
    const delay = Math.random() * 10;
    const duration = 8 + Math.random() * 9;

    particle.className = "particle";
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.bottom = `${-10 - Math.random() * 20}%`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    particleField.appendChild(particle);
  }
};



window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);

createParticles();

updateScrollState();

if (contactForm && statusMessage) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get("name")?.toString().trim() || "Your family";
    const service = formData.get("service")?.toString().trim() || "care program";

    statusMessage.textContent = `${name}, your enquiry for ${service} has been captured in this demo interface. Connect this form to your real CRM or WhatsApp flow next.`;
    contactForm.reset();
  });
}

if (prefersReducedMotion) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
  counters.forEach((counter) => {
    counter.textContent = counter.dataset.target || counter.textContent;
  });
}
