import { useState, useEffect, useRef } from 'react';

export const useScrollSpy = (sections) => {
  const [activeSection, setActiveSection] = useState('home');
  const observerRef = useRef(null);

  useEffect(() => {
    const sectionIds = ['home', 'features', 'pricing', 'about', 'faq', 'contact'];
    
    // Check if sections exist
    const availableSections = sectionIds.filter(id => sections[id]?.current);
    if (availableSections.length === 0) return;

    // Function to determine active section based on scroll position
    const checkActiveSection = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const triggerPoint = scrollY + windowHeight * 0.3; // 30% from top of viewport
      
      let activeId = 'home';
      let closestDistance = Infinity;

      sectionIds.forEach((sectionId) => {
        const section = sections[sectionId]?.current;
        if (section) {
          const rect = section.getBoundingClientRect();
          const sectionTop = scrollY + rect.top;
          const sectionBottom = sectionTop + rect.height;
          
          // Check if trigger point is within this section
          if (triggerPoint >= sectionTop && triggerPoint <= sectionBottom) {
            const distance = Math.abs(triggerPoint - (sectionTop + rect.height / 2));
            if (distance < closestDistance) {
              closestDistance = distance;
              activeId = sectionId;
            }
          }
          // If trigger point is before this section but close, consider it
          else if (triggerPoint < sectionTop && sectionTop - triggerPoint < 300) {
            const distance = sectionTop - triggerPoint;
            if (distance < closestDistance) {
              closestDistance = distance;
              activeId = sectionId;
            }
          }
        }
      });

      setActiveSection(activeId);
    };

    // Intersection Observer as primary method
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5]
    };

    const handleIntersection = (entries) => {
      // Use scroll check when intersections occur
      checkActiveSection();
    };

    observerRef.current = new IntersectionObserver(handleIntersection, observerOptions);

    // Observe all available sections
    availableSections.forEach((sectionId) => {
      if (sections[sectionId]?.current) {
        observerRef.current.observe(sections[sectionId].current);
      }
    });

    // Initial check
    checkActiveSection();
    const timeoutId = setTimeout(checkActiveSection, 100);

    // Scroll listener for continuous updates
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sections]);

  return activeSection;
};
