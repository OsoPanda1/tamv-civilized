import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ParticleField from "@/components/ParticleField";
import SovereignDashboard from "@/components/sovereign/SovereignDashboard";
import NubiWallet from "@/components/wallet/NubiWallet";
import MarketplaceGrid from "@/components/marketplace/MarketplaceGrid";
import BookPIObservability from "@/components/bookpi/BookPIObservability";
import SocialNexus from "@/components/social/SocialNexus";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Wallet, ShoppingBag, Database, Users } from "lucide-react";

const CivilizationHub = () => {
  const [activeTab, setActiveTab] = useState("identity");

  const tabs = [
    { id: "identity", label: "Identidad", icon: User },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
    { id: "social", label: "Social", icon: Users },
    { id: "bookpi", label: "BookPI", icon: Database },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ParticleField />
      <Navbar />

      <main className="container mx-auto px-6 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <span className="text-electric font-display text-sm tracking-widest uppercase">
            Ecosistema Civilizatorio
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-2">
            <span className="text-gradient-primary">Civilization</span>{" "}
            <span className="text-foreground">Hub</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Centro de control soberano con las 7 capas federadas: Identidad, Economía, Social, XR, Gobernanza, Infraestructura y Documentación.
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass p-1 w-full md:w-auto flex overflow-x-auto">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 data-[state=active]:bg-electric data-[state=active]:text-primary-foreground"
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="identity">
            <div className="max-w-xl">
              <SovereignDashboard />
            </div>
          </TabsContent>

          <TabsContent value="wallet">
            <div className="max-w-xl">
              <NubiWallet />
            </div>
          </TabsContent>

          <TabsContent value="marketplace">
            <MarketplaceGrid />
          </TabsContent>

          <TabsContent value="social">
            <div className="max-w-2xl">
              <SocialNexus />
            </div>
          </TabsContent>

          <TabsContent value="bookpi">
            <BookPIObservability />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CivilizationHub;
