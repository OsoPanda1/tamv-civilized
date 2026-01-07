import Navbar from "@/components/Navbar";
import ParticleField from "@/components/ParticleField";
import Hero from "@/components/Hero";
import FeaturesGrid from "@/components/FeaturesGrid";
import IsabellaSection from "@/components/IsabellaSection";
import BlockchainSection from "@/components/BlockchainSection";
import GovernanceSection from "@/components/GovernanceSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ParticleField />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <FeaturesGrid />
        <IsabellaSection />
        <BlockchainSection />
        <GovernanceSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
