import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Box } from '@mui/material';
import HeroSlide from './HeroSlide';
import SliderNavigation from './SliderNavigation';
import SliderPagination from './SliderPagination';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import slider images
import medicalRobot from '../../assets/slider-images/medical-robot.png';
import familyCare from '../../assets/slider-images/family-care.png';

const ImageSlider = () => {
  const slides = [
    {
      id: 1,
      badge: 'AI HEALTHCARE',
      title: 'AI-Powered\nHealthcare,\nSimplified',
      description: 'Smart, secure, and accessible healthcare powered by artificial intelligence. Experience the future of medical diagnostics today.',
      primaryButton: 'Get Started',
      secondaryButton: 'View Plans',
      image: medicalRobot,
      background: 'linear-gradient(157deg, #0A5FB4 0%, #084D91 100%)'
    },
    {
      id: 2,
      badge: 'SMART MANAGEMENT',
      title: 'Intelligent\nHealth\nManagement',
      description: 'Streamline your healthcare workflow with AI-driven insights and automated patient management systems.',
      primaryButton: 'Learn More',
      secondaryButton: 'Contact Us',
      image: null,
      background: 'linear-gradient(203deg, #0A5FB4 0%, #0957A5 100%)'
    },
    {
      id: 3,
      badge: 'CARE FOR EVERYONE',
      title: 'Healthcare\nfor Every\nFamily',
      description: 'Comprehensive healthcare solutions designed to meet the needs of every individual and family.',
      primaryButton: 'Explore Services',
      secondaryButton: 'Get Started',
      image: familyCare,
      background: 'linear-gradient(23deg, #0A5FB4 0%, #0A6AD1 100%)'
    }
  ];

  return (
    <Box sx={{ position: 'relative', height: { xs: '600px', md: '700px', lg: '944px' } }}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        pagination={{
          clickable: true,
          el: '.swiper-pagination-custom',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        style={{ height: '100%' }}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <HeroSlide slide={slide} />
          </SwiperSlide>
        ))}
      </Swiper>

      <SliderPagination />

      <SliderNavigation />
    </Box>
  );
};

export default ImageSlider;
