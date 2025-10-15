
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const CLOUD_NAME = "drhqnpnjd";
const UPLOAD_PRESET = "receipts";

export const generateAndUploadReceipt = async (
  payment: any,
  onProgress?: (progress: number) => void
) => {


  try {
    const receiptEl = document.getElementById("receipt");
    if (!receiptEl) return alert("❌ Receipt element not found!");

    onProgress?.(10);
    const canvas = await html2canvas(receiptEl, {
      scale: 2, 
      useCORS: true,
      logging: false
    });
    
    onProgress?.(30);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({ 
      orientation: "portrait", 
      unit: "mm", 
      format: "a4" 
    });
    
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    onProgress?.(50);

    const pdfBlob = new Blob([pdf.output("arraybuffer")], { type: "application/pdf" });
    const pdfFile = new File([pdfBlob], `receipt_${payment.id}_${Date.now()}.pdf`, { type: "application/pdf" });
 
    onProgress?.(60);
    const formData = new FormData();
    formData.append("file", pdfFile);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("resource_type", "raw");
    formData.append("folder", "receipts"); 

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, 
      formData,
      {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              60 + (progressEvent.loaded / progressEvent.total) * 30
            );
            onProgress?.(percentCompleted);
          }
        }
      }
    );

    onProgress?.(98);

    const receiptUrl = res.data.secure_url;
    if (!receiptUrl) throw new Error("Cloudinary upload failed");

    const paymentRef = doc(db, "payments", payment.id);
    await updateDoc(paymentRef, { receiptUrl });

    onProgress?.(100);
    return receiptUrl;



  } catch (err: any) {
    console.error("Receipt generation error:", err);
    
    // Better error messages
    if (err.response?.status === 401 || err.response?.status === 403) {
      alert("❌ Cloudinary authentication failed. Check your upload preset configuration.");
    } else if (err.response?.data?.error?.message) {
      alert(`❌ Upload failed: ${err.response.data.error.message}`);
    } else {
      alert("❌ Failed to generate/upload receipt. Check console for details.");
    }
    
    throw err;
  }
};

