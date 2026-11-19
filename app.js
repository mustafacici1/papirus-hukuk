/* ==========================================================================
   PAPİRÜS HUKUK & DANIŞMANLIK — INTERACTION & ANIMATION ENGINE
   GSAP + ScrollTrigger • Lenis Smooth Scroll • Lucide SVG Icons • Theme Toggle
   ========================================================================== */

(function () {
  // 1. Initialize Theme Preference (Default: Light Warm Editorial, with Dark Mode toggle)
  const savedTheme = localStorage.getItem('papirus_theme');
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark-theme');
  }

  document.addEventListener('DOMContentLoaded', function () {
    // 2. Render Lucide SVG Icons
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // 3. Theme Toggle Logic
    const themeToggleBtns = document.querySelectorAll('[data-theme-toggle]');
    function updateThemeIcons() {
      const isDark = document.documentElement.classList.contains('dark-theme');
      themeToggleBtns.forEach(btn => {
        const sunIcon = btn.querySelector('.icon-sun');
        const moonIcon = btn.querySelector('.icon-moon');
        if (sunIcon && moonIcon) {
          sunIcon.style.display = isDark ? 'block' : 'none';
          moonIcon.style.display = isDark ? 'none' : 'block';
        }
      });
    }
    updateThemeIcons();

    themeToggleBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        document.documentElement.classList.toggle('dark-theme');
        const isDark = document.documentElement.classList.contains('dark-theme');
        localStorage.setItem('papirus_theme', isDark ? 'dark' : 'light');
        updateThemeIcons();
      });
    });

    // 4. Mobile Navigation Menu Toggle
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const iconOpen = document.getElementById('menuIconOpen');
    const iconClose = document.getElementById('menuIconClose');

    if (mobileBtn && mobileMenu) {
      mobileBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const isHidden = mobileMenu.classList.contains('hidden');
        if (isHidden) {
          mobileMenu.classList.remove('hidden');
          if (iconOpen) iconOpen.classList.add('hidden');
          if (iconClose) iconClose.classList.remove('hidden');
          mobileBtn.setAttribute('aria-expanded', 'true');
        } else {
          mobileMenu.classList.add('hidden');
          if (iconOpen) iconOpen.classList.remove('hidden');
          if (iconClose) iconClose.classList.add('hidden');
          mobileBtn.setAttribute('aria-expanded', 'false');
        }
      });

      document.addEventListener('click', function (e) {
        if (!mobileMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
          mobileMenu.classList.add('hidden');
          if (iconOpen) iconOpen.classList.remove('hidden');
          if (iconClose) iconClose.classList.add('hidden');
          mobileBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // 5. Fast Page Loader Dismissal
    const loader = document.getElementById('pageLoader');
    if (loader) {
      const hideLoader = () => {
        loader.style.opacity = '0';
        loader.style.pointerEvents = 'none';
        setTimeout(() => {
          loader.style.display = 'none';
        }, 280);
      };
      if (document.readyState === 'complete') {
        hideLoader();
      } else {
        window.addEventListener('load', hideLoader);
        setTimeout(hideLoader, 800); // Fallback guarantee
      }
    }

    // 6. Initialize Lenis Smooth Scroll
    let lenis = null;
    if (window.Lenis) {
      lenis = new window.Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5
      });

      if (window.gsap && window.ScrollTrigger) {
        lenis.on('scroll', window.ScrollTrigger.update);
        window.gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        window.gsap.ticker.lagSmoothing(0);
      } else {
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }
    }

    // 7. GSAP Editorial Animations (Subtle, purposeful, non-distracting)
    if (window.gsap) {
      const gsap = window.gsap;
      if (window.ScrollTrigger) {
        gsap.registerPlugin(window.ScrollTrigger);
      }

      // Hero reveal
      const heroItems = document.querySelectorAll('[data-gsap="hero"]');
      if (heroItems.length > 0) {
        gsap.fromTo(
          heroItems,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.1,
            ease: 'power3.out',
            clearProps: 'transform'
          }
        );
      }

      // Section & Card Scroll Reveals
      const revealBlocks = document.querySelectorAll('[data-gsap="reveal"]');
      revealBlocks.forEach((block) => {
        gsap.fromTo(
          block,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: 'power2.out',
            clearProps: 'transform',
            scrollTrigger: window.ScrollTrigger
              ? {
                  trigger: block,
                  start: 'top 88%',
                  toggleActions: 'play none none none'
                }
              : undefined
          }
        );
      });

      // Staggered Grids
      const staggerGrids = document.querySelectorAll('[data-gsap-stagger]');
      staggerGrids.forEach((grid) => {
        const children = grid.children;
        if (!children.length) return;
        gsap.fromTo(
          children,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.09,
            ease: 'power2.out',
            clearProps: 'transform',
            scrollTrigger: window.ScrollTrigger
              ? {
                  trigger: grid,
                  start: 'top 86%',
                  toggleActions: 'play none none none'
                }
              : undefined
          }
        );
      });
    }
  });
})();
