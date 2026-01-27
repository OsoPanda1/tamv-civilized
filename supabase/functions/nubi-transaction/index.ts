import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuantumSplitConfig {
  creatorPercent: number;
  vaultPercent: number;
  fenixPercent: number;
}

const SPLIT_CONFIGS: Record<string, QuantumSplitConfig> = {
  quantum_70_25: { creatorPercent: 70, vaultPercent: 25, fenixPercent: 5 },
  quantum_50_50: { creatorPercent: 50, vaultPercent: 45, fenixPercent: 5 },
  standard: { creatorPercent: 100, vaultPercent: 0, fenixPercent: 0 },
  gift: { creatorPercent: 95, vaultPercent: 5, fenixPercent: 0 },
  withdrawal: { creatorPercent: 100, vaultPercent: 0, fenixPercent: 0 },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, userId, amount, splitType, description, recipientId } = await req.json();

    // Get user's wallet
    const { data: wallet, error: walletError } = await supabase
      .from("nubi_wallets")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (walletError || !wallet) {
      // Create wallet if doesn't exist
      const { data: newWallet, error: createError } = await supabase
        .from("nubi_wallets")
        .insert({ user_id: userId, balance: 100 })
        .select()
        .single();
      
      if (createError) {
        throw new Error("Failed to create wallet");
      }
      
      return new Response(JSON.stringify({ 
        success: true, 
        wallet: newWallet,
        message: "Wallet created with 100 NUBI bonus" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "balance") {
      return new Response(JSON.stringify({ 
        success: true, 
        wallet,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "credit") {
      // Add funds to wallet
      const { error: updateError } = await supabase
        .from("nubi_wallets")
        .update({ 
          balance: wallet.balance + amount,
          total_earned: wallet.total_earned + amount,
        })
        .eq("id", wallet.id);

      if (updateError) throw updateError;

      // Record transaction
      await supabase.from("nubi_transactions").insert({
        wallet_id: wallet.id,
        type: "credit",
        amount,
        split_type: splitType || "standard",
        creator_amount: amount,
        status: "completed",
        description,
      });

      return new Response(JSON.stringify({ 
        success: true, 
        newBalance: wallet.balance + amount,
        message: `+${amount} NUBI credited` 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "spend" || action === "transfer") {
      if (wallet.balance < amount) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "Insufficient balance" 
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const config = SPLIT_CONFIGS[splitType || "standard"];
      const creatorAmount = (amount * config.creatorPercent) / 100;
      const vaultAmount = (amount * config.vaultPercent) / 100;
      const fenixAmount = (amount * config.fenixPercent) / 100;

      // Debit from sender
      const { error: debitError } = await supabase
        .from("nubi_wallets")
        .update({ 
          balance: wallet.balance - amount,
          total_spent: wallet.total_spent + amount,
        })
        .eq("id", wallet.id);

      if (debitError) throw debitError;

      // If transfer, credit recipient
      if (action === "transfer" && recipientId) {
        const { data: recipientWallet } = await supabase
          .from("nubi_wallets")
          .select("*")
          .eq("user_id", recipientId)
          .single();

        if (recipientWallet) {
          await supabase
            .from("nubi_wallets")
            .update({ 
              balance: recipientWallet.balance + creatorAmount,
              total_earned: recipientWallet.total_earned + creatorAmount,
            })
            .eq("id", recipientWallet.id);
        }
      }

      // Record transaction with Quantum-Split breakdown
      await supabase.from("nubi_transactions").insert({
        wallet_id: wallet.id,
        type: action,
        amount,
        split_type: splitType || "standard",
        creator_amount: creatorAmount,
        vault_amount: vaultAmount,
        fenix_amount: fenixAmount,
        status: "completed",
        description,
        metadata: { recipientId, config },
      });

      return new Response(JSON.stringify({ 
        success: true, 
        newBalance: wallet.balance - amount,
        split: {
          creator: creatorAmount,
          vault: vaultAmount,
          fenix: fenixAmount,
        },
        message: `Quantum-Split ${splitType}: ${creatorAmount} creator, ${vaultAmount} vault, ${fenixAmount} fénix` 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("NUBI transaction error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
