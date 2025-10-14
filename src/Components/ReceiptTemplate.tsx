import React from "react";
import logo from "../assets/user.png"; // your logo image
import { format } from "date-fns";
import signature from '../assets/signature.jpg'

const ReceiptTemplate: React.FC<any> = ({ student, payment, course }) => {

  const courseName = (student?.courseId === course?.id) ? course?.title : "undkon"
  console.log(courseName);
  console.log(course?.title);


  return (
    <div
      id="receipt"
      style={{
        width: "650px",
        margin: "0 auto",
        padding: "40px",
        backgroundColor: "#fff",
        fontFamily: "'Times New Roman', serif",
        border: "1px solid #ccc",
        borderRadius: "10px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "5rem",
          color: "rgba(0,0,0,0.05)",
          fontWeight: "bold",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        My Institute
      </div>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          zIndex: 1,
          position: "relative",
        }}
      >
        <img src={logo} alt="Institute Logo" style={{ height: "70px" }} />
        <div style={{ textAlign: "right" }}>
          <h2 style={{ margin: 0, color: "#333" }}>Nueraq</h2>
          <p style={{ margin: 0, fontSize: "14px" }}>
            123, Main Street, Malappuram, Kerala
          </p>
          <p style={{ margin: 0, fontSize: "14px" }}>Phone: +91 9876543210</p>
        </div>
      </div>

      <hr style={{ border: "1px solid #ddd" }} />

      <h2 style={{ textAlign: "center", margin: "20px 0", color: "#444" }}>
        PAYMENT RECEIPT
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "14px",
          marginBottom: "20px",
        }}
      >
        <div>
          <p>
            <strong>Receipt No:</strong> #{payment?.id || "AUTO-001"}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {payment?.date ? format(payment.date.toDate(), "dd MMM yyyy") : 'Invalid Date'}
          </p>
        </div>
        <div>
          <p>
            <strong>Student ID:</strong> {student?.studentSeqId}
          </p>
          <p>
            <strong>Payment Status:</strong> {payment?.status}
          </p>
        </div>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
          fontSize: "15px",
          zIndex: 1,
          position: "relative",
        }}
      >
        <tbody>
          <tr>
            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
              <strong>Student Name</strong>
            </td>
            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
              {student?.name}
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
              <strong>Course</strong>
            </td>
            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
              {courseName}
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
              <strong>Payment For</strong>
            </td>
            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
              {payment?.title}
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
              <strong>Amount Paid</strong>
            </td>
            <td
              style={{
                border: "1px solid #ccc",
                padding: "8px",
                fontWeight: "bold",
                color: "green",
              }}
            >
              ₹{payment?.amount}
            </td>
          </tr>
        </tbody>
      </table>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "40px",
          fontSize: "14px",
          zIndex: 1,
          position: "relative",
        }}
      >
        <div className="relative">
          <p>Authorized Signature:</p>
            <img
              src={signature}
              alt="Signature"
              style={{ maxWidth: '180px', maxHeight: '60px', objectFit: 'contain' }}
              className="absolute"
            />
          <div
            style={{
              width: "200px",
              height: "50px",
              borderBottom: "1px solid #000",
              marginTop:"20px"
            }}
          >
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontStyle: "italic" }}>Thank you for your payment!</p>
          <p style={{ fontSize: "12px" }}>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptTemplate;
