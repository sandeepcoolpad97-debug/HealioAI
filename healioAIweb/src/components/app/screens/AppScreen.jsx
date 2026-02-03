import { useRef } from 'react';
import { Navbar } from '../navbar';
import { ImageSlider } from '../hero';
import { Features } from '../features';
import { Pricing } from '../pricing';
import { QueuePriority } from '../queuePriority';
import { FAQ } from '../faq';
import { Contact } from '../contact';
import { Newsletter } from '../newsletter';
import { Footer } from '../footer';

/**
 * App screen – groups all app-related (public/landing) components.
 * Renders the main landing page with navbar, hero, features, pricing, FAQ, contact, newsletter, footer.
 */
export default function AppScreen() {
  const homeSectionRef = useRef(null);
  const featuresSectionRef = useRef(null);
  const pricingSectionRef = useRef(null);
  const aboutSectionRef = useRef(null);
  const contactSectionRef = useRef(null);
  const faqsectionRef = useRef(null);

  const sections = {
    home: homeSectionRef,
    features: featuresSectionRef,
    pricing: pricingSectionRef,
    about: aboutSectionRef,
    contact: contactSectionRef,
    faq: faqsectionRef,
  };

  return (
    <>
      <Navbar sections={sections} />
      <div ref={homeSectionRef} id="home">
        <ImageSlider />
      </div>
      <div ref={featuresSectionRef} id="features">
        <Features />
      </div>
      <div ref={pricingSectionRef} id="pricing">
        <Pricing />
      </div>
      <div ref={aboutSectionRef} id="about">
        <QueuePriority />
      </div>
      <div ref={faqsectionRef} id="faq">
        <FAQ />
      </div>
      <div ref={contactSectionRef} id="contact">
        <Contact />
      </div>
      <Newsletter />
      <Footer />
    </>
  );
}
