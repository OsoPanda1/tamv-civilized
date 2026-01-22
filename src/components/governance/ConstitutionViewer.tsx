import { motion } from "framer-motion";
import { BookOpen, Scale, Shield, Coins, FileText, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { useMSRLedgerStore, ConstitutionalArticle } from "@/stores/msrLedgerStore";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const categoryIcons = {
  foundational: Scale,
  operational: FileText,
  ethical: Shield,
  economic: Coins,
};

const categoryColors = {
  foundational: 'text-primary bg-primary/20',
  operational: 'text-muted-foreground bg-muted',
  ethical: 'text-isabella bg-isabella/20',
  economic: 'text-msr bg-msr/20',
};

const statusConfig = {
  active: { icon: CheckCircle2, color: 'text-green-500', label: 'Activo' },
  deprecated: { icon: AlertTriangle, color: 'text-amber-500', label: 'Deprecado' },
  pending: { icon: Clock, color: 'text-muted-foreground', label: 'Pendiente' },
};

const ConstitutionViewer = () => {
  const { constitution, currentVersion } = useMSRLedgerStore();

  const groupedArticles = constitution.reduce((acc, article) => {
    if (!acc[article.category]) acc[article.category] = [];
    acc[article.category].push(article);
    return acc;
  }, {} as Record<string, ConstitutionalArticle[]>);

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-muted">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-background" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">BookPI™</h3>
            <p className="text-xs text-muted-foreground">Constitución Digital Viva</p>
          </div>
          <Badge className="ml-auto bg-accent/20 text-accent">
            v{currentVersion}
          </Badge>
        </div>
      </div>

      {/* Constitution Content */}
      <ScrollArea className="h-[400px]">
        <div className="p-4 space-y-6">
          {Object.entries(groupedArticles).map(([category, articles], categoryIndex) => {
            const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons];
            const colorClass = categoryColors[category as keyof typeof categoryColors];
            
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${colorClass}`}>
                    <CategoryIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-display text-sm font-semibold capitalize">
                    {category === 'foundational' ? 'Fundacional' :
                     category === 'operational' ? 'Operacional' :
                     category === 'ethical' ? 'Ético' : 'Económico'}
                  </span>
                </div>

                {/* Articles */}
                <div className="space-y-2 ml-8">
                  {articles.map((article, index) => {
                    const StatusIcon = statusConfig[article.status].icon;
                    
                    return (
                      <motion.div
                        key={article.code}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: categoryIndex * 0.1 + index * 0.05 }}
                        className="bg-muted/30 rounded-lg p-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <code className="text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                {article.code}
                              </code>
                              <span className="text-[10px] text-muted-foreground">
                                v{article.version}
                              </span>
                            </div>
                            <h4 className="font-medium text-sm text-foreground mt-1">
                              {article.title}
                            </h4>
                          </div>
                          <StatusIcon className={`w-4 h-4 ${statusConfig[article.status].color}`} />
                        </div>
                        
                        <p className="text-xs text-muted-foreground">
                          {article.text}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          Efectivo desde: {article.effectiveFrom.toLocaleDateString()}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-muted bg-muted/20">
        <p className="text-[10px] text-muted-foreground text-center">
          Constitución inmutable por versión • Gobernada por Governance Service • Anclada en MSR
        </p>
      </div>
    </div>
  );
};

export default ConstitutionViewer;
