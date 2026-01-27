import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ParticleField from "@/components/ParticleField";
import { useAuth } from "@/hooks/useAuth";
import { useWalletStore } from "@/stores/walletStore";
import { useEffect, useState } from "react";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Send, 
  TrendingUp,
  Zap,
  Shield,
  Flame,
  RefreshCw,
  ChevronDown,
  Coins,
  PiggyBank,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";
import { SplitType } from "@/stores/walletStore";

const SPLIT_OPTIONS: { type: SplitType; label: string; description: string; icon: any }[] = [
  { 
    type: 'quantum_70_25', 
    label: 'Quantum 70/25/5', 
    description: '70% creator, 25% vault, 5% fénix',
    icon: Zap 
  },
  { 
    type: 'quantum_50_50', 
    label: 'Quantum 50/45/5', 
    description: '50% creator, 45% vault, 5% fénix',
    icon: Shield 
  },
  { 
    type: 'standard', 
    label: 'Standard', 
    description: '100% to recipient',
    icon: Send 
  },
  { 
    type: 'gift', 
    label: 'Gift', 
    description: '95% creator, 5% vault',
    icon: Flame 
  },
];

const WalletPage = () => {
  const { user } = useAuth();
  const { wallet, transactions, isLoading, fetchWallet, spend, credit, fetchTransactions } = useWalletStore();
  const [showSend, setShowSend] = useState(false);
  const [amount, setAmount] = useState("");
  const [selectedSplit, setSelectedSplit] = useState<SplitType>('quantum_70_25');
  const [showSplitMenu, setShowSplitMenu] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchWallet(user.id);
      fetchTransactions();
    }
  }, [user?.id]);

  const handleSend = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Cantidad inválida");
      return;
    }

    const success = await spend(numAmount, selectedSplit, `Transacción ${selectedSplit}`);
    if (success) {
      toast.success(`✨ Quantum-Split ejecutado: ${numAmount} NUBI`);
      setAmount("");
      setShowSend(false);
      fetchTransactions();
    } else {
      toast.error("Transacción fallida");
    }
  };

  const handleCredit = async () => {
    const success = await credit(50, "Bonus de prueba");
    if (success) {
      toast.success("+50 NUBI credited!");
      fetchTransactions();
    }
  };

  const selectedSplitOption = SPLIT_OPTIONS.find(s => s.type === selectedSplit)!;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ParticleField />
      <Navbar />

      <main className="container mx-auto px-6 pt-24 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <span className="text-anubis font-display text-sm tracking-widest uppercase">
            Economía Cuántica
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-2">
            <span className="text-gradient-anubis">NUBI</span>{" "}
            <span className="text-foreground">Wallet™</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Sistema económico con distribución Quantum-Split™. Cada transacción 
            alimenta automáticamente la Bóveda de Resiliencia y el Fondo Fénix.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Main Column */}
          <div className="space-y-6">
            {/* Balance Card */}
            <Card className="glass border-anubis/30 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-anubis/10 via-transparent to-isabella/10" />
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-anubis flex items-center justify-center">
                      <Wallet className="w-8 h-8 text-background" />
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">NUBI Wallet</span>
                      <h3 className="font-display text-xl font-bold text-foreground">Quantum Economy™</h3>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => user?.id && fetchWallet(user.id)}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>

                {/* Balance Display */}
                <div className="text-center py-8">
                  <motion.div
                    key={wallet?.balance}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-2"
                  >
                    <span className="text-muted-foreground text-sm">Balance Disponible</span>
                    <h2 className="font-display text-6xl font-bold text-gradient-anubis">
                      {wallet?.balance?.toFixed(2) || '0.00'}
                    </h2>
                    <span className="text-anubis font-semibold text-lg">NUBI</span>
                  </motion.div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-6 mt-10">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-green-500/10 flex items-center justify-center">
                        <ArrowDownLeft className="w-6 h-6 text-green-500" />
                      </div>
                      <span className="font-bold text-lg text-foreground">
                        {wallet?.totalEarned?.toFixed(2) || '0.00'}
                      </span>
                      <p className="text-xs text-muted-foreground">Total Earned</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-red-500/10 flex items-center justify-center">
                        <ArrowUpRight className="w-6 h-6 text-red-400" />
                      </div>
                      <span className="font-bold text-lg text-foreground">
                        {wallet?.totalSpent?.toFixed(2) || '0.00'}
                      </span>
                      <p className="text-xs text-muted-foreground">Total Spent</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-isabella/10 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-isabella" />
                      </div>
                      <span className="font-bold text-lg text-foreground">
                        {wallet?.lockedBalance?.toFixed(2) || '0.00'}
                      </span>
                      <p className="text-xs text-muted-foreground">Locked</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-6">
                  <Button 
                    className="flex-1 bg-gradient-anubis hover:opacity-90 h-12 text-lg"
                    onClick={() => setShowSend(!showSend)}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Quantum-Split
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-isabella/50 hover:bg-isabella/10 h-12 text-lg"
                    onClick={handleCredit}
                  >
                    <TrendingUp className="w-5 h-5 mr-2" />
                    +50 Demo
                  </Button>
                </div>
              </div>
            </Card>

            {/* Send Panel */}
            <AnimatePresence>
              {showSend && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card className="glass border-electric/30 p-6">
                    <h4 className="font-display text-xl font-semibold mb-6 text-foreground">
                      Quantum-Split™ Transaction
                    </h4>
                    
                    {/* Amount Input */}
                    <div className="mb-6">
                      <label className="text-sm text-muted-foreground mb-2 block">Cantidad (NUBI)</label>
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="text-3xl font-bold bg-muted/50 border-muted h-16"
                      />
                    </div>

                    {/* Split Type Selector */}
                    <div className="mb-6 relative">
                      <label className="text-sm text-muted-foreground mb-2 block">Tipo de Split</label>
                      <Button
                        variant="outline"
                        className="w-full justify-between border-muted h-14"
                        onClick={() => setShowSplitMenu(!showSplitMenu)}
                      >
                        <div className="flex items-center gap-3">
                          <selectedSplitOption.icon className="w-5 h-5 text-anubis" />
                          <span className="text-lg">{selectedSplitOption.label}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 transition-transform ${showSplitMenu ? 'rotate-180' : ''}`} />
                      </Button>

                      <AnimatePresence>
                        {showSplitMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-background border border-muted rounded-lg overflow-hidden z-10"
                          >
                            {SPLIT_OPTIONS.map((option) => (
                              <button
                                key={option.type}
                                className={`w-full p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors ${
                                  selectedSplit === option.type ? 'bg-anubis/10' : ''
                                }`}
                                onClick={() => {
                                  setSelectedSplit(option.type);
                                  setShowSplitMenu(false);
                                }}
                              >
                                <option.icon className="w-5 h-5 text-anubis" />
                                <div className="text-left">
                                  <div className="font-medium text-foreground">{option.label}</div>
                                  <div className="text-sm text-muted-foreground">{option.description}</div>
                                </div>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Split Preview */}
                    {amount && parseFloat(amount) > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-muted/30 rounded-xl p-6 mb-6"
                      >
                        <span className="text-sm text-muted-foreground">Distribución Quantum-Split:</span>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          {selectedSplit === 'quantum_70_25' && (
                            <>
                              <div className="text-center p-4 bg-green-500/10 rounded-xl">
                                <Coins className="w-6 h-6 text-green-500 mx-auto mb-2" />
                                <div className="text-green-500 font-bold text-xl">{(parseFloat(amount) * 0.70).toFixed(2)}</div>
                                <div className="text-xs text-muted-foreground">Creator 70%</div>
                              </div>
                              <div className="text-center p-4 bg-anubis/10 rounded-xl">
                                <PiggyBank className="w-6 h-6 text-anubis mx-auto mb-2" />
                                <div className="text-anubis font-bold text-xl">{(parseFloat(amount) * 0.25).toFixed(2)}</div>
                                <div className="text-xs text-muted-foreground">Vault 25%</div>
                              </div>
                              <div className="text-center p-4 bg-red-500/10 rounded-xl">
                                <Flame className="w-6 h-6 text-red-400 mx-auto mb-2" />
                                <div className="text-red-400 font-bold text-xl">{(parseFloat(amount) * 0.05).toFixed(2)}</div>
                                <div className="text-xs text-muted-foreground">Fénix 5%</div>
                              </div>
                            </>
                          )}
                          {selectedSplit === 'quantum_50_50' && (
                            <>
                              <div className="text-center p-4 bg-green-500/10 rounded-xl">
                                <Coins className="w-6 h-6 text-green-500 mx-auto mb-2" />
                                <div className="text-green-500 font-bold text-xl">{(parseFloat(amount) * 0.50).toFixed(2)}</div>
                                <div className="text-xs text-muted-foreground">Creator 50%</div>
                              </div>
                              <div className="text-center p-4 bg-anubis/10 rounded-xl">
                                <PiggyBank className="w-6 h-6 text-anubis mx-auto mb-2" />
                                <div className="text-anubis font-bold text-xl">{(parseFloat(amount) * 0.45).toFixed(2)}</div>
                                <div className="text-xs text-muted-foreground">Vault 45%</div>
                              </div>
                              <div className="text-center p-4 bg-red-500/10 rounded-xl">
                                <Flame className="w-6 h-6 text-red-400 mx-auto mb-2" />
                                <div className="text-red-400 font-bold text-xl">{(parseFloat(amount) * 0.05).toFixed(2)}</div>
                                <div className="text-xs text-muted-foreground">Fénix 5%</div>
                              </div>
                            </>
                          )}
                          {selectedSplit === 'standard' && (
                            <div className="col-span-3 text-center p-4 bg-green-500/10 rounded-xl">
                              <Award className="w-8 h-8 text-green-500 mx-auto mb-2" />
                              <div className="text-green-500 font-bold text-2xl">{parseFloat(amount).toFixed(2)}</div>
                              <div className="text-sm text-muted-foreground">100% to recipient</div>
                            </div>
                          )}
                          {selectedSplit === 'gift' && (
                            <>
                              <div className="col-span-2 text-center p-4 bg-green-500/10 rounded-xl">
                                <Coins className="w-6 h-6 text-green-500 mx-auto mb-2" />
                                <div className="text-green-500 font-bold text-xl">{(parseFloat(amount) * 0.95).toFixed(2)}</div>
                                <div className="text-xs text-muted-foreground">Creator 95%</div>
                              </div>
                              <div className="text-center p-4 bg-anubis/10 rounded-xl">
                                <PiggyBank className="w-6 h-6 text-anubis mx-auto mb-2" />
                                <div className="text-anubis font-bold text-xl">{(parseFloat(amount) * 0.05).toFixed(2)}</div>
                                <div className="text-xs text-muted-foreground">Vault 5%</div>
                              </div>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}

                    <Button 
                      className="w-full bg-gradient-electric hover:opacity-90 h-14 text-lg"
                      onClick={handleSend}
                      disabled={isLoading || !amount || parseFloat(amount) <= 0}
                    >
                      {isLoading ? (
                        <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                      ) : (
                        <Zap className="w-5 h-5 mr-2" />
                      )}
                      Ejecutar Quantum-Split
                    </Button>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quantum-Split Explainer */}
            <Card className="glass border-muted p-6">
              <h4 className="font-display font-semibold mb-4 text-foreground flex items-center gap-2">
                <Zap className="w-5 h-5 text-anubis" />
                Motor Quantum-Split™
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Cada transacción distribuye automáticamente fondos para sostener el ecosistema TAMV.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
                  <Coins className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-medium text-foreground">Creator</div>
                    <div className="text-xs text-muted-foreground">70% del valor va al creador</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-anubis/10 rounded-lg">
                  <PiggyBank className="w-5 h-5 text-anubis" />
                  <div>
                    <div className="font-medium text-foreground">Bóveda de Resiliencia</div>
                    <div className="text-xs text-muted-foreground">25% para sostenibilidad</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-500/10 rounded-lg">
                  <Flame className="w-5 h-5 text-red-400" />
                  <div>
                    <div className="font-medium text-foreground">Fondo Fénix</div>
                    <div className="text-xs text-muted-foreground">5% para recuperación</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent Transactions */}
            <Card className="glass border-muted p-6">
              <h4 className="font-display font-semibold mb-4 text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-isabella" />
                Transacciones Recientes
              </h4>
              
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {transactions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No hay transacciones aún
                  </p>
                ) : (
                  transactions.slice(0, 10).map((tx) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'credit' ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}>
                          {tx.type === 'credit' ? (
                            <ArrowDownLeft className="w-5 h-5 text-green-500" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-foreground text-sm">
                            {tx.description || tx.type}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {tx.splitType} • {tx.createdAt.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <span className={`font-bold ${tx.type === 'credit' ? 'text-green-500' : 'text-red-400'}`}>
                        {tx.type === 'credit' ? '+' : '-'}{tx.amount.toFixed(2)}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WalletPage;
