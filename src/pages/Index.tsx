import Navbar from "@/components/Navbar";
import ParticleField from "@/components/ParticleField";
import QuantumHero from "@/components/QuantumHero";
import FederatedLayers from "@/components/FederatedLayers";
import IsabellaShowcase from "@/components/IsabellaShowcase";
import BlockchainMSR from "@/components/BlockchainMSR";
import GovernancePreview from "@/components/GovernancePreview";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ParticleField />
      <Navbar />
      <main className="relative z-10">
        <QuantumHero />
        <FederatedLayers />
        <IsabellaShowcase />
        <BlockchainMSR />
        <GovernancePreview />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
