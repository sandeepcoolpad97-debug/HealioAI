import { useRef } from 'react'

import { Navbar } from './components/Navbar'
import { ImageSlider } from './components/hero'
import { Features } from './components/features'
import { Pricing } from './components/pricing'
import { QueuePriority } from './components/queuePriority'
import { FAQ } from './components/faq'
import { Contact } from './components/contact'
import { Newsletter } from './components/newsletter'
import { Footer } from './components/footer'

function App() {
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
    faq: faqsectionRef
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
  )
}

export default App
