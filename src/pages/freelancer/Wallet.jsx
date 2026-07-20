import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { paymentService } from "../../services/paymentService";
import { contractService } from "../../services/contractService";
import { StatisticsCard } from "../../components/cards/StatisticsCard";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input, Select } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Wallet, ShieldCheck, FileText, ArrowUpRight, ArrowDownLeft, Landmark } from "lucide-react";

export const FreelancerWallet = () => {
  const { user, refreshUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [earningsTotal, setEarningsTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { amount: "", account: "Simulated PayPal Account" }
  });

  const loadWalletDetails = async () => {
    setLoading(true);
    try {
      const history = await paymentService.getTransactionHistory(user.id);
      setTransactions(history);

      const contracts = await contractService.getContractsByFreelancer(user.id);
      const releases = contracts.reduce((sum, c) => c.status === "completed" ? sum + c.amount : sum, 0);
      setEarningsTotal(releases);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWalletDetails();
  }, [user]);

  const onWithdraw = async (data) => {
    if (data.amount > user.walletBalance) {
      alert("Insufficient wallet balance!");
      return;
    }
    setSubmitting(true);
    try {
      // Deduct balance and log transaction
      const users = JSON.parse(localStorage.getItem("marketplace_users"));
      const userIdx = users.findIndex(u => u.id === user.id);
      if (userIdx !== -1) {
        users[userIdx].walletBalance = (users[userIdx].walletBalance || 0) - Number(data.amount);
        localStorage.setItem("marketplace_users", JSON.stringify(users));
      }

      await paymentService.logTransaction(
        user.id,
        data.amount,
        "withdraw",
        `Withdrawal request processed to: ${data.account}`,
        `wdr-${Math.random().toString(36).substr(2, 9)}`
      );

      refreshUser();
      reset();
      setIsWithdrawOpen(false);
      await loadWalletDetails();
      alert("Withdrawal request dispatched! Credits will reflect in your account shortly.");
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const getBadgeType = (type) => {
    switch (type) {
      case "release": return <Badge variant="green">PAYOUT RELEASE</Badge>;
      case "withdraw": return <Badge variant="red">WITHDRAWAL</Badge>;
      case "deposit": return <Badge variant="blue">DEPOSIT</Badge>;
      default: return <Badge variant="gray">{type.toUpperCase()}</Badge>;
    }
  };

  const accountsList = [
    { label: "Simulated PayPal Account", value: "Simulated PayPal Account" },
    { label: "Bank Transfer Routing", value: "Bank Transfer Routing" },
    { label: "Stripe Connect Balance", value: "Stripe Connect Balance" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-950 dark:text-white">Earnings Wallet Desk</h2>
          <p className="text-xs text-gray-400">Withdraw digital credits, view invoice receipts, and track releases</p>
        </div>
        <Button
          onClick={() => setIsWithdrawOpen(true)}
          className="flex items-center gap-1.5"
          variant="accent"
        >
          <Landmark className="w-4 h-4" />
          Withdraw Funds
        </Button>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatisticsCard
          title="Withdrawable Balance"
          value={`$${(user.walletBalance || 0).toLocaleString()}`}
          icon={Wallet}
        />
        <StatisticsCard
          title="Total Lifetime Earnings"
          value={`$${earningsTotal.toLocaleString()}`}
          icon={ShieldCheck}
        />
        <StatisticsCard
          title="Transaction Count"
          value={transactions.length}
          icon={FileText}
        />
      </div>

      {/* Transaction table */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-150 dark:border-gray-850 shadow-premium">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-5">Digital Invoices Log</h3>

        {loading ? (
          <div className="space-y-3">
            <div className="h-12 bg-gray-100 rounded animate-pulse" />
            <div className="h-12 bg-gray-100 rounded animate-pulse" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xs text-gray-450">No invoice transfers found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-850 text-xxs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-950">
                  <th className="px-5 py-3">Transaction Date</th>
                  <th className="px-5 py-3">Reference ID</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Details</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                {transactions.map((tx) => {
                  const isNegative = tx.type === "withdraw";
                  return (
                    <tr key={tx.id} className="hover:bg-gray-55/50 dark:hover:bg-gray-850/20">
                      <td className="px-5 py-3.5 text-gray-400 font-medium">
                        {new Date(tx.timestamp).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-gray-500">
                        {tx.referenceId}
                      </td>
                      <td className="px-5 py-3.5">
                        {getBadgeType(tx.type)}
                      </td>
                      <td className="px-5 py-3.5 text-gray-650 dark:text-gray-400 font-medium">
                        {tx.description}
                      </td>
                      <td className={`px-5 py-3.5 text-right font-bold ${
                        isNegative ? "text-red-500" : "text-emerald-600 dark:text-emerald-400"
                      }`}>
                        {isNegative ? "-" : "+"}${tx.amount.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Withdrawal Modal */}
      <Modal isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} title="Withdraw Earnings">
        <form onSubmit={handleSubmit(onWithdraw)} className="space-y-4">
          
          <div className="p-3 bg-accent-50/50 dark:bg-accent-950/20 border border-accent-100 dark:border-accent-900/30 rounded-xl text-xxs text-accent-700 dark:text-accent-400">
            Withdrawable Balance: <span className="font-bold">${(user.walletBalance || 0).toLocaleString()}</span>
          </div>

          <Input
            label="Withdrawal Amount (USD)"
            type="number"
            placeholder="500"
            error={errors.amount}
            {...register("amount", {
              required: "Amount is required",
              min: { value: 10, message: "Minimum withdrawal is $10" },
              max: { value: user.walletBalance, message: "Insufficient balance" }
            })}
          />

          <Select
            label="Disbursement Destination"
            options={accountsList}
            error={errors.account}
            {...register("account", { required: "Destination account is required" })}
          />

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button variant="secondary" onClick={() => setIsWithdrawOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" disabled={submitting}>
              {submitting ? "Processing Request..." : "Disburse Funds"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
