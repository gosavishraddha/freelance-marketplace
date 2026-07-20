import React, { useState, useEffect } from "react";
import { paymentService } from "../../services/paymentService";
import { authService } from "../../services/authService";
import { Badge } from "../../components/ui/Badge";
import { ShieldCheck, FileText, Search } from "lucide-react";

export const AdminPayments = () => {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuditLedger = async () => {
      setLoading(true);
      try {
        const txs = await paymentService.getAllTransactions();
        setTransactions(txs);
        const members = await authService.getAllUsers();
        setUsers(members);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadAuditLedger();
  }, []);

  const getUserEmail = (userId) => {
    const found = users.find(u => u.id === userId);
    return found ? found.email : "system@gigshphere.com";
  };

  const getBadge = (type) => {
    switch (type) {
      case "deposit": return <Badge variant="green">DEPOSIT</Badge>;
      case "escrow_lock": return <Badge variant="orange">ESCROW LOCK</Badge>;
      case "release": return <Badge variant="blue">RELEASE</Badge>;
      case "withdraw": return <Badge variant="red">WITHDRAWAL</Badge>;
      default: return <Badge variant="gray">{type.toUpperCase()}</Badge>;
    }
  };

  const filteredTxs = transactions.filter((tx) => {
    const email = getUserEmail(tx.userId).toLowerCase();
    const query = search.toLowerCase();
    return email.includes(query) || tx.description.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-955 dark:text-white">System Payments Auditor Ledger</h2>
        <p className="text-xs text-gray-405">Monitor platform transactions, credit cards deposits, and escrow release invoices</p>
      </div>

      {/* Search query */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter ledger by email address or transaction description..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-205 dark:border-gray-850 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/25 focus:border-rose-500"
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>

      {/* Ledger Table */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-850 shadow-premium overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            <div className="h-10 bg-gray-100 rounded animate-pulse" />
            <div className="h-10 bg-gray-100 rounded animate-pulse" />
          </div>
        ) : filteredTxs.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p className="text-xs">No transactions match your search filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-955 text-xxs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-5 py-4">Transaction Date</th>
                  <th className="px-5 py-4">Account Member</th>
                  <th className="px-5 py-4">Transfer Type</th>
                  <th className="px-5 py-4">Log Details</th>
                  <th className="px-5 py-4 text-right">Transfer Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                {filteredTxs.map((tx) => {
                  const isNegative = tx.type === "withdraw" || tx.type === "escrow_lock";
                  return (
                    <tr key={tx.id} className="hover:bg-gray-55/30 dark:hover:bg-gray-850/20">
                      <td className="px-5 py-3.5 text-gray-400 font-medium">
                        {new Date(tx.timestamp).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-gray-500">
                        {getUserEmail(tx.userId)}
                      </td>
                      <td className="px-5 py-3.5">
                        {getBadge(tx.type)}
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
    </div>
  );
};
