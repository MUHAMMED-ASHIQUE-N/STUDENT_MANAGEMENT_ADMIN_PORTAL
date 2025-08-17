import React from "react";

type Payment = {
  id: number;
  date: string;
  amountPaid: number;
  totalAmount: number;
  receiptUrl?: string;
};

const paymentHistory: Payment[] = [
  {
    id: 1,
    date: "2025-01-15",
    amountPaid: 6500,
    totalAmount: 10000,
    receiptUrl: "/receipts/receipt1.pdf",
  },
  {
    id: 2,
    date: "2025-03-10",
    amountPaid: 3500,
    totalAmount: 10000,
    receiptUrl: "/receipts/receipt2.pdf",
  },
];

const PaymentHistory: React.FC = () => {
  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Payment History</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Paid</th>
            <th className="border border-gray-300 px-4 py-2">Due</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Receipt</th>
          </tr>
        </thead>
        <tbody>
          {paymentHistory.map((payment) => {
            const due = payment.totalAmount - payment.amountPaid;
            const status = due === 0 ? "Paid" : "Partially Paid";

            return (
              <tr key={payment.id}>
                <td className="border border-gray-300 px-4 py-2">{payment.date}</td>
                <td className="border border-gray-300 px-4 py-2">₹{payment.amountPaid}</td>
                <td className="border border-gray-300 px-4 py-2">₹{due}</td>
                <td
                  className={`border border-gray-300 px-4 py-2 font-semibold ${
                    status === "Paid" ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {status}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-blue-600 underline">
                  <a href={payment.receiptUrl} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
