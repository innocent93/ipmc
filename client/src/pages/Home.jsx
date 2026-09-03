import SEO from '../components/SEO/SEO';
import HeroSection from '../components/Home/HeroSection';
import StatsSection from '../components/Home/StatsSection';
import AboutSection from '../components/Home/AboutSection';
import ServicesSection from '../components/Home/ServicesSection';
import WhyChooseUs from '../components/Home/WhyChooseUs';
import PartnersSection from '../components/Home/PartnersSection';
import BlogSection from '../components/Home/BlogSection';
import CTASection from '../components/Home/CTASection';

export default function Home() {
  return (
    <>
      <SEO 
        title="Project Management & ESG Consulting"
        description="IPMC Nigeria - Leading project monitoring, financial advisory, and ESG consultancy with 35+ years of excellence in the oil & gas sector."
        keywords="project management, ESG consulting, Nigeria, oil and gas, environmental services, financial advisory, NUPRC, NESREA"
        url="https://ipmc-ng.com"
      />
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <ServicesSection />
      <WhyChooseUs />
      <PartnersSection />
      <BlogSection />
      <CTASection />
    </>
  );
}
