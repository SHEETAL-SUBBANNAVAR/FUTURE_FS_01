/* script.js */
import { injectSpeedInsights } from '@vercel/speed-insights';

// Initialize Vercel Speed Insights
injectSpeedInsights();

document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const icon = themeToggle.querySelector('i');

  // Check for saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.add('light');
    updateThemeIcon(false); // false means light
  } else {
    updateThemeIcon(true); // true means dark
  }

  themeToggle.addEventListener('click', () => {
    const isLight = body.classList.toggle('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeIcon(!isLight);
  });

  function updateThemeIcon(isDark) {
    if (isDark) {
      icon.setAttribute('data-lucide', 'sun');
    } else {
      icon.setAttribute('data-lucide', 'moon');
    }
    lucide.createIcons();
  }

  // Mobile Menu
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileMenuIcon = mobileMenuToggle.querySelector('i');

  mobileMenuToggle.addEventListener('click', () => {
    const isActive = mobileNav.classList.toggle('active');
    if (isActive) {
      mobileMenuIcon.setAttribute('data-lucide', 'x');
    } else {
      mobileMenuIcon.setAttribute('data-lucide', 'menu');
    }
    lucide.createIcons();
  });

  // Close mobile menu on link click
  const mobileLinks = mobileNav.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('active');
      mobileMenuIcon.setAttribute('data-lucide', 'menu');
      lucide.createIcons();
    });
  });

  // Navbar Scroll Effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Contact Form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<div class="spinner"></div> Sending...';

      const formData = {
        name: contactForm.name.value,
        email: contactForm.email.value,
        message: contactForm.message.value
      };

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          alert('Message sent successfully!');
          contactForm.reset();
        } else {
          alert('Something went wrong. Please try again.');
        }
      } catch (err) {
        alert('Something went wrong. Please try again.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // Scroll Reveal
  const revealElements = document.querySelectorAll('.reveal');
  const revealOnScroll = () => {
    revealElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      const elementVisible = 150;
      if (elementTop < window.innerHeight - elementVisible) {
        el.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Initial check

  // Initialize Lucide Icons
  lucide.createIcons();
});
