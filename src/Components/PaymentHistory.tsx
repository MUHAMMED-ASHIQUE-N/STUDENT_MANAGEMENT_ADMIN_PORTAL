

import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

type Payment = {
  amount: number;
  date: string; // Firestore timestamp stored as string
  type: "initial" | "payment";
};

const PaymentHistory: React.FC<{ userId: string }> = ({ userId }) => {
  const [history, setHistory] = useState<Payment[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const timeline: Payment[] = [];

        // 1️⃣ Get student doc (initial payment)
        const studentRef = doc(db, "userDetails", userId);
        const studentSnap = await getDoc(studentRef);

        if (studentSnap.exists()) {
          const studentData = studentSnap.data();

          if (studentData.paidAmount) {
            timeline.push({
              amount: studentData.paidAmount,
              date: studentData.createdAt || new Date().toISOString(),
              type: "initial",
            });
          }
        }

        // 2️⃣ Get payments subcollection
        const paymentsRef = collection(db, "userDetails", userId, "payments");
        const paymentSnap = await getDocs(paymentsRef);

        paymentSnap.docs.forEach((doc) => {
          const data = doc.data();
          timeline.push({
            amount: data.amount,
            date: data.date || new Date().toISOString(),
            type: "payment",
          });
        });

        // 3️⃣ Sort by date (latest first)
        timeline.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setHistory(timeline);
      } catch (error) {
        console.error("Error fetching payment history:", error);
      }
    };

    fetchPayments();
  }, [userId]);

  return (
    <div>
      <h2>Payment History</h2>
      <ul>
        {history.map((p, i) => (
          <li key={i}>
            <strong>
              {p.type === "initial" ? "Initial Payment" : "Payment"}
            </strong>
            : ₹{p.amount} — {new Date(p.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentHistory;


