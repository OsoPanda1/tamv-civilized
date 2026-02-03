import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wallet, 
  Send, 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft,
  Clock,
  Sparkles,
  QrCode,
  Settings,
  TrendingUp,
  Shield,
  Zap,
  Gift,
  RefreshCw,
  ChevronDown,
  Check
} from "lucide-react";
import { useWalletStore, SPLIT_CONFIGS, type SplitType, type Transaction } from "@/stores/walletStore";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const transactionIcons = {
  credit: ArrowDownLeft,
  debit: ArrowUpRight,
  transfer: Send,
  split_payout: Sparkles,
  reward: Gift,
  gift: Gift,
};

const transactionColors = {
  credit: 'text-green-400 bg-green-400/10',
  debit: 'text-red-400 bg-red-400/10',
  transfer: 'text-electric bg-electric/10',
  split_payout: 'text-isabella bg-isabella/10',
  reward: 'text-accent bg-accent/10',
  gift: 'text-msr bg-msr/10',
};

const NubiWalletAdvanced = () => {
  const { user } = useAuth();
  const {
    wallet,
    transactions,
    isLoading,
    selectedSplitType,
    fetchWallet,
    fetchTransactions,
    createTransaction,
    setSplitType,
    calculateSplit,
  } = useWalletStore();

  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [sendAmount, setSendAmount] = useState("");
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [previewSplit, setPreviewSplit] = useState<ReturnType<typeof calculateSplit> | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchWallet(user.id);
    }
  }, [user?.id, fetchWallet]);

  useEffect(() => {
    if (wallet?.id) {
      fetchTransactions();
    }
  }, [wallet?.id, fetchTransactions]);

  useEffect(() => {
    const amount = parseFloat(sendAmount);
    if (!isNaN(amount) && amount > 0) {
      setPreviewSplit(calculateSplit(amount, selectedSplitType));
    } else {
      setPreviewSplit(null);
    }
  }, [sendAmount, selectedSplitType, calculateSplit]);

  const handleSendTransaction = async () => {
    const amount = parseFloat(sendAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Ingresa un monto válido");
      return;
    }

    const result = await createTransaction({
      type: 'transfer',
      amount,
      description: `Transferencia Quantum-Split (${SPLIT_CONFIGS[selectedSplitType].name})`,
      splitType: selectedSplitType,
    });

    if (result) {
      toast.success("Transacción completada con Quantum-Split™");
      setSendAmount("");
      setSendDialogOpen(false);
    } else {
      toast.error("Error en la transacción");
    }
  };

  const displayedTransactions = showAllTransactions ? transactions : transactions.slice(0, 6);
  const currentSplitConfig = SPLIT_CONFIGS[selectedSplitType];

  const mockBalance = wallet?.balance ?? 12450.75;

  return (
    <div className="space-y-6">
      {/* Main Balance Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden"
      >
        <Card className="glass rounded-2xl p-6 bg-gradient-to-br from-electric/5 via-background to-isabella/5 border-electric/20">
          {/* Background effects */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-electric rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-isabella rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">NubiWallet™</span>
                <p className="text-xs text-muted-foreground">Economía Cuántica TAMV</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400 font-medium">Conectada</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs text-muted-foreground mb-1">Balance Total</p>
              <div className="flex items-baseline gap-2">
                <h2 className="font-display text-4xl font-bold text-foreground">
                  {mockBalance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </h2>
                <span className="text-lg text-electric font-semibold">QS</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-green-400">+12.4%</span>
                <span className="mx-1">•</span>
                QuantumSeeds™
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex-1 bg-gradient-primary text-primary-foreground hover:opacity-90">
                    <Send className="w-4 h-4 mr-2" />
                    Enviar
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-electric/30">
                  <DialogHeader>
                    <DialogTitle className="font-display text-xl">Enviar QuantumSeeds</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4 pt-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Monto (QS)</label>
                      <Input
                        type="number"
                        value={sendAmount}
                        onChange={(e) => setSendAmount(e.target.value)}
                        placeholder="0.00"
                        className="text-2xl font-mono bg-muted/50"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Modo Quantum-Split™</label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            <span>{currentSplitConfig.name}</span>
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full">
                          {Object.values(SPLIT_CONFIGS).map((config) => (
                            <DropdownMenuItem
                              key={config.id}
                              onClick={() => setSplitType(config.id)}
                              className="flex items-center justify-between"
                            >
                              <div>
                                <p className="font-medium">{config.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {config.creator}/{config.resilience}/{config.phoenix}
                                </p>
                              </div>
                              {selectedSplitType === config.id && (
                                <Check className="w-4 h-4 text-electric" />
                              )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Split Preview */}
                    <AnimatePresence>
                      {previewSplit && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-muted/30 rounded-xl p-4"
                        >
                          <p className="text-sm font-medium text-foreground mb-3">Distribución Quantum-Split™</p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">→ Creador/Destino</span>
                              <span className="text-green-400 font-mono">{previewSplit.creator.toFixed(2)} QS</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">→ Bóveda Resiliencia</span>
                              <span className="text-electric font-mono">{previewSplit.resilience.toFixed(2)} QS</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">→ Fondo Fénix</span>
                              <span className="text-msr font-mono">{previewSplit.phoenix.toFixed(2)} QS</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button 
                      onClick={handleSendTransaction}
                      disabled={isLoading || !sendAmount}
                      className="w-full bg-gradient-primary"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Zap className="w-4 h-4 mr-2" />
                      )}
                      Confirmar Transacción
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="flex-1 border-muted hover:border-electric">
                <Download className="w-4 h-4 mr-2" />
                Recibir
              </Button>
              <Button variant="outline" size="icon" className="border-muted hover:border-electric">
                <QrCode className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quantum-Split Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass rounded-2xl p-4 border-isabella/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-isabella" />
              Motor Quantum-Split™
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs">
                  <Settings className="w-3 h-3 mr-1" />
                  {currentSplitConfig.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.values(SPLIT_CONFIGS).map((config) => (
                  <DropdownMenuItem
                    key={config.id}
                    onClick={() => setSplitType(config.id)}
                  >
                    {config.name} ({config.creator}/{config.resilience}/{config.phoenix})
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <p className="text-xs text-muted-foreground mb-4">
            {currentSplitConfig.description}
          </p>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Creador/Usuario
                </span>
                <span className="text-green-400 font-mono font-semibold">{currentSplitConfig.creator}%</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${currentSplitConfig.creator}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-electric" />
                  Bóveda de Resiliencia
                </span>
                <span className="text-electric font-mono font-semibold">{currentSplitConfig.resilience}%</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${currentSplitConfig.resilience}%` }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-msr" />
                  Fondo Fénix
                </span>
                <span className="text-msr font-mono font-semibold">{currentSplitConfig.phoenix}%</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-msr rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${currentSplitConfig.phoenix}%` }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-muted/50 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              MSR Auditable
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Distribución Instantánea
            </span>
          </div>
        </Card>
      </motion.div>

      {/* Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass rounded-2xl p-4 border-muted/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Transacciones Recientes
            </h3>
            <button 
              onClick={() => setShowAllTransactions(!showAllTransactions)}
              className="text-xs text-electric hover:underline"
            >
              {showAllTransactions ? 'Ver menos' : 'Ver todas'}
            </button>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {displayedTransactions.length > 0 ? (
                displayedTransactions.map((tx, index) => {
                  const Icon = transactionIcons[tx.type] || ArrowUpRight;
                  const colorClass = transactionColors[tx.type] || 'text-foreground bg-muted';
                  const isPositive = ['credit', 'reward', 'split_payout'].includes(tx.type);
                  
                  return (
                    <motion.div 
                      key={tx.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{tx.description}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          {tx.createdAt.toLocaleString()}
                          {tx.splitType && (
                            <span className="text-isabella">• {SPLIT_CONFIGS[tx.splitType]?.name}</span>
                          )}
                        </p>
                      </div>
                      <span className={`font-mono text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {isPositive ? '+' : '-'}{tx.amount.toFixed(2)} QS
                      </span>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Wallet className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No hay transacciones aún</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default NubiWalletAdvanced;
