import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { paymentService } from "../../services/paymentService";
import { contractService } from "../../services/contractService";
import { StatisticsCard } from "../../components/cards/StatisticsCard";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { DollarSign, Wallet, ShieldAlert, FileText, ArrowDownLeft, ArrowUpRight, Plus } from "lucide-react";

export const ClientPayments = () => {
  const { user, refreshUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [escrowTotal, setEscrowTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositSubmitting, setDepositSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { amount: "" }
  });

  const loadPaymentDetails = async () => {
    setLoading(true);
    try {
      const history = await paymentService.getTransactionHistory(user.id);
      setTransactions(history);

      const contracts = await contractService.getContractsByClient(user.id);
      const activeEscrow = contracts.reduce(
        (sum, c) => c.status !== "completed" ? sum + c.amount : sum,
        0
      );
      setEscrowTotal(activeEscrow);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaymentDetails();
  }, [user]);

  const onDeposit = async (data) => {
    setDepositSubmitting(true);
    try {
      await paymentService.depositFunds(user.id, data.amount);
      refreshUser();
      reset();
      setIsDepositOpen(false);
      await loadPaymentDetails();
    } catch (e) {
      alert("Deposit failed: " + e.message);
    } finally {
      setDepositSubmitting(false);
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case "deposit": return <Badge variant="green">DEPOSIT</Badge>;
      case "escrow_lock": return <Badge variant="orange">ESCROW LOCK</Badge>;
      case "release": return <Badge variant="blue">RELEASE</Badge>;
      case "refund": return <Badge variant="green">REFUND</Badge>;
      default: return <Badge variant="gray">{type.toUpperCase()}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Workspace Wallet & Billing</h2>
          <p className="text-xs text-gray-400">Add funds, review invoice receipts, and trace escrow details</p>
        </div>
        <Button
          onClick={() => setIsDepositOpen(true)}
          className="flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Deposit Funds
        </Button>
      </div>

      {/* KPI Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatisticsCard
          title="Digital Wallet Balance"
          value={`$${(user.walletBalance || 0).toLocaleString()}`}
          icon={Wallet}
        />
        <StatisticsCard
          title="Milestones in Escrow"
          value={`$${escrowTotal.toLocaleString()}`}
          icon={ShieldAlert}
        />
        <StatisticsCard
          title="Total Transactions"
          value={transactions.length}
          icon={FileText}
        />
      </div>

      {/* Transaction History Section */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-premium">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-5">Transaction History Trail</h3>

        {loading ? (
          <div className="space-y-3">
            <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xs text-gray-400">No payment transactions recorded.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 text-xxs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-950">
                  <th className="px-5 py-3">Transaction Date</th>
                  <th className="px-5 py-3">Reference ID</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Details</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-850 text-xs">
                {transactions.map((tx) => {
                  const isNegative = tx.type === "escrow_lock";
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-850/20">
                      <td className="px-5 py-3.5 text-gray-400 font-medium">
                        {new Date(tx.timestamp).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-gray-500">
                        {tx.referenceId}
                      </td>
                      <td className="px-5 py-3.5">
                        {getTypeBadge(tx.type)}
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

      {/* Deposit Modal */}
      <Modal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} title="Deposit Funds to Wallet">
        <form onSubmit={handleSubmit(onDeposit)} className="space-y-4">
          <Input
            label="Deposit Amount (USD)"
            type="number"
            placeholder="1500"
            error={errors.amount}
            {...register("amount", {
              required: "Amount is required",
              min: { value: 10, message: "Minimum deposit is $10" }
            })}
          />

          <div className="p-3 bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-850 rounded-xl space-y-1 text-xxs text-gray-500">
            <p className="font-bold">Simulated Credit Card Integration:</p>
            <p>For this internship prototype, deposits are instantly approved. No real charge is made.</p>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button variant="secondary" onClick={() => setIsDepositOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={depositSubmitting}>
              {depositSubmitting ? "Processing..." : "Deposit Now"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
