import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/config";

const CLOUD_NAME = "drhqnpnjd";
const UPLOAD_PRESET = "certificates_preset";

export const uploadCertificate = async (certificateData: any, onProgress?: (progress: number) => void) => {
  try {
    const certificateEl = document.getElementById("certificate");
    if (!certificateEl) throw new Error("❌ Certificate element not found!");

    onProgress?.(10);
    const canvas = await html2canvas(certificateEl, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    onProgress?.(30);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

    onProgress?.(50);
    const pdfBlob = new Blob([pdf.output("arraybuffer")], {
      type: "application/pdf",
    });

    const pdfFile = new File(
      [pdfBlob],
      `certificate_${certificateData.student?.id}_${Date.now()}.pdf`,
      { type: "application/pdf" }
    );

    onProgress?.(60);
    const formData = new FormData();
    formData.append("file", pdfFile);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("resource_type", "raw");
    formData.append("folder", "certificates");

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

    onProgress?.(100);

    const certificateUrl = res.data.secure_url;
    if (!certificateUrl) throw new Error("Cloudinary upload failed");

    await addDoc(collection(db, "certificates"), {
      studentId: certificateData.studentId,
      courseName: certificateData.courseName,
      certificateUrl,
      issuedAt: new Date(),
    });
    onProgress?.(100);

    return certificateUrl;
  } catch (err: any) {
    console.error("Certificate generation error:", err);

    if (err.response?.status === 401 || err.response?.status === 403) {
      alert("❌ Cloudinary authentication failed. Check upload preset.");
    } else if (err.response?.data?.error?.message) {
      alert(`❌ Upload failed: ${err.response.data.error.message}`);
    } else {
      alert("❌ Failed to generate/upload certificate.");
    }
    throw err;
  }
};
