
import Header from "@/components/home/Header";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import ScreenshotsSection from "@/components/home/ScreenshotsSection";
import AISection from "@/components/home/AISection";
import CTASection from "@/components/home/CTASection";
import Footer from "@/components/home/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 w-full overflow-x-hidden">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <ScreenshotsSection />
      <AISection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default HomePage;
