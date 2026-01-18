import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Wallet, 
  Send, 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft,
  Clock,
  Sparkles,
  QrCode
} from "lucide-react";
import { useCivilizationStore } from "@/stores/civilizationStore";
import { Button } from "@/components/ui/button";

const transactionIcons = {
  income: ArrowDownLeft,
  expense: ArrowUpRight,
  transfer: Send,
  reward: Sparkles,
};

const transactionColors = {
  income: 'text-green-400 bg-green-400/10',
  expense: 'text-red-400 bg-red-400/10',
  transfer: 'text-electric bg-electric/10',
  reward: 'text-accent bg-accent/10',
};

const NubiWallet = () => {
  const { identity, transactions, addTransaction } = useCivilizationStore();
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  if (!identity) return null;

  const displayedTransactions = showAllTransactions ? transactions : transactions.slice(0, 5);

  // Quantum-Split visualization (70/20/10)
  const quantumSplit = {
    creator: 70,
    resilience: 20,
    phoenix: 10,
  };

  return (
    <div className="space-y-6">
      {/* Main Balance Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden"
      >
        <div className="glass rounded-2xl p-6 bg-gradient-to-br from-electric/5 via-background to-isabella/5">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-32 h-32 bg-electric rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-isabella rounded-full blur-3xl" />
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-5 h-5 text-electric" />
              <span className="text-sm font-medium text-muted-foreground">NubiWallet™</span>
              <span className="ml-auto text-xs text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Conectada
              </span>
            </div>

            <div className="mb-6">
              <p className="text-xs text-muted-foreground mb-1">Balance Total</p>
              <h2 className="font-display text-4xl font-bold text-foreground">
                {identity.walletBalance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                <span className="text-lg text-electric ml-2">QS</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-1">QuantumSeeds™</p>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <Button className="flex-1 bg-gradient-primary text-primary-foreground">
                <Send className="w-4 h-4 mr-2" />
                Enviar
              </Button>
              <Button variant="outline" className="flex-1 border-muted">
                <Download className="w-4 h-4 mr-2" />
                Recibir
              </Button>
              <Button variant="outline" size="icon" className="border-muted">
                <QrCode className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quantum-Split Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-4"
      >
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          Motor Quantum-Split™
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Distribución automática de cada transacción en el Marketplace
        </p>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-foreground">Creador/Usuario</span>
              <span className="text-green-400 font-mono">{quantumSplit.creator}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                style={{ width: `${quantumSplit.creator}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-foreground">Bóveda de Resiliencia</span>
              <span className="text-electric font-mono">{quantumSplit.resilience}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full bg-gradient-primary rounded-full"
                style={{ width: `${quantumSplit.resilience}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-foreground">Fondo Fénix</span>
              <span className="text-msr font-mono">{quantumSplit.phoenix}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full bg-gradient-msr rounded-full"
                style={{ width: `${quantumSplit.phoenix}%` }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            Transacciones
          </h3>
          <button 
            onClick={() => setShowAllTransactions(!showAllTransactions)}
            className="text-xs text-electric hover:underline"
          >
            {showAllTransactions ? 'Ver menos' : 'Ver todas'}
          </button>
        </div>

        <div className="space-y-3">
          {displayedTransactions.map((tx) => {
            const Icon = transactionIcons[tx.type];
            const colorClass = transactionColors[tx.type];
            const isPositive = tx.type === 'income' || tx.type === 'reward';
            
            return (
              <div key={tx.id} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {tx.timestamp.toLocaleString()}
                  </p>
                </div>
                <span className={`font-mono text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? '+' : '-'}{tx.amount} QS
                </span>
              </div>
            );
          })}
        </div>

        {transactions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Wallet className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No hay transacciones aún</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default NubiWallet;
