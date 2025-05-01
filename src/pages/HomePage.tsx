
import Header from "@/components/home/Header";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import ScreenshotsSection from "@/components/home/ScreenshotsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import AISection from "@/components/home/AISection";
import PricingSection from "@/components/home/PricingSection";
import CTASection from "@/components/home/CTASection";
import Footer from "@/components/home/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 w-full overflow-x-hidden">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <ScreenshotsSection />
      <TestimonialsSection />
      <AISection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default HomePage;
