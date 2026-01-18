import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  Star, 
  Filter,
  Search,
  Sparkles,
  Layers,
  Headphones,
  Briefcase
} from "lucide-react";
import { useCivilizationStore } from "@/stores/civilizationStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categoryIcons = {
  digital: Layers,
  nft: Sparkles,
  service: Briefcase,
  experience: Headphones,
};

const categoryColors = {
  digital: 'text-electric bg-electric/10 border-electric/30',
  nft: 'text-isabella bg-isabella/10 border-isabella/30',
  service: 'text-dream bg-dream/10 border-dream/30',
  experience: 'text-msr bg-msr/10 border-msr/30',
};

type Category = 'all' | 'digital' | 'nft' | 'service' | 'experience';

const MarketplaceGrid = () => {
  const { marketplaceItems } = useCivilizationStore();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = marketplaceItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: { key: Category; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'nft', label: 'NFTs' },
    { key: 'digital', label: 'Digital' },
    { key: 'service', label: 'Servicios' },
    { key: 'experience', label: 'Experiencias' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center gap-4"
      >
        <div className="flex-1">
          <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-electric" />
            Marketplace TAMV
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {marketplaceItems.length} productos tokenizados en MSR
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-muted"
          />
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 overflow-x-auto pb-2"
      >
        <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              selectedCategory === cat.key
                ? 'bg-electric text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </motion.div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item, index) => {
          const Icon = categoryIcons[item.category];
          const colorClass = categoryColors[item.category];
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl overflow-hidden group hover:glow-cyan transition-all duration-300"
            >
              {/* Image placeholder */}
              <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon className="w-12 h-12 text-muted-foreground/30" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                
                {/* Category Badge */}
                <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
                  {item.category.toUpperCase()}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-display font-semibold text-foreground group-hover:text-electric transition-colors">
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Creador</p>
                    <p className="text-sm font-medium text-foreground">{item.creatorName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Precio</p>
                    <p className="font-display font-bold text-electric">{item.price} QS</p>
                  </div>
                </div>

                <Button className="w-full mt-4 bg-gradient-primary text-primary-foreground">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Adquirir
                </Button>
              </div>

              {/* MSR Badge */}
              <div className="px-4 pb-4">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Star className="w-3 h-3 text-msr" />
                  <span>Tokenizado en MSR Blockchain</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16 glass rounded-2xl">
          <ShoppingBag className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            No se encontraron productos
          </h3>
          <p className="text-sm text-muted-foreground">
            Intenta con otra categoría o término de búsqueda
          </p>
        </div>
      )}
    </div>
  );
};

export default MarketplaceGrid;
