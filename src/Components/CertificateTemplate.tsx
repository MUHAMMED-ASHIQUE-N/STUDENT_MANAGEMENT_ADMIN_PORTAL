import React, { useState } from 'react';
import { BsUpload } from 'react-icons/bs';
import { uploadCertificate } from '../utils/uplodCertificate';
import { format } from 'date-fns';
import ProgressTracker from './ProgressTracker';

interface CertificateData {
  recipientName: string;
  courseName: string;
  completionDate: string;
  institution: string;
}

const CertificateTemplate: React.FC<any> = ({ student, course, onUploaded }) => {
  const [certData, setCertData] = useState<CertificateData>({
    recipientName: student?.name || '',
    courseName: course || '',
    completionDate: format(Date.now(), 'dd-MM-yyyy'),
    institution: 'Nueraq Academy'
  });

  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);


  const handleInputChange = (field: keyof CertificateData, value: string) => {
    setCertData(prev => ({ ...prev, [field]: value }));
  };

  // Handle signature image upload (preview only, not uploading to server)
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSignaturePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Submission: generate PDF with embedded signature image
  const handleSubmit = async () => {
    if (!student) {
      alert('No student found!');
      return;
    }
          setIsGenerating(true);
        setUploadProgress(0);
    setTimeout(async () => {
      try {
        await uploadCertificate({
          ...certData,
          studentId: student.id,
          courseName: certData.courseName,
          signaturePreview
        }, (progress) => {
          setUploadProgress(progress)
        });
        alert('✅ certificate generated successfully!');
        if (onUploaded) onUploaded();
      } catch (error) {
        console.error('certificate generation failed:', error);
      }finally{
              setIsGenerating(false);
        setUploadProgress(0);
      }
    }, 100);
  };

  return (
    <div className="page">
     <ProgressTracker isGenerating={isGenerating} uploadProgress={uploadProgress} />
        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center font-bold">1</div>
            Certificate Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recipient Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Recipient Name
              </label>
              <input
                type="text"
                value={certData.recipientName}
                onChange={e => handleInputChange('recipientName', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Enter recipient name"
              />
            </div>

            {/* Course Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Course Name
              </label>
              <input
                type="text"
                value={certData.courseName}
                onChange={e => handleInputChange('courseName', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Enter course name"
              />
            </div>

            {/* Completion Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Completion Date
              </label>
              <input
                type="text"
                value={certData.completionDate}
                onChange={e => handleInputChange('completionDate', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Institution Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Institution Name
              </label>
              <input
                type="text"
                value={certData.institution}
                onChange={e => handleInputChange('institution', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Signature Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Signature Upload
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSignatureUpload}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>
              {signaturePreview && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2 font-medium">Signature Preview</p>
                  <img
                    src={signaturePreview}
                    alt="Signature Preview"
                    className="h-16 object-contain border border-gray-200 rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

      {/* Certificate Preview */}
       <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center font-bold">2</div>
            Preview
          </h2>
      <div className="container" id="certificate">
        <div className="header">
          <div className="headerBorder">
            <h1 className="mainTitle">Certificate of Completion</h1>
            <p className="subTitle">This Certifies That</p>
          </div>
        </div>

        {/* Recipient Name */}
        <div className="recipientSection">
          <h2 className="recipientName">{certData.recipientName}</h2>
        </div>

        {/* Course Details */}
        <div className="courseSection">
          <p className="courseText">has successfully completed the course</p>
          <h3 className="courseName">{certData.courseName}</h3>
        </div>

        {/* Description */}
        <div className="description">
          <p className="descriptionText">
            This certificate is proudly presented to recognize the successful completion of the course and demonstration of proficiency in the subject matter.
          </p>
        </div>

        {/* Footer */}
        <div className="footer">
          {/* Issuer Signature */}
          <div className="signature">
            {signaturePreview && (
              <img
              src={signaturePreview}
              alt="Signature"
              style={{ maxWidth: '180px', maxHeight: '60px', objectFit: 'contain', margin: '0 auto 4px auto', display: 'block' }}
              />
            )}
            <div className="signatureLine"></div>
            <p className="signatureName">{certData.institution}</p>
            <p className="signatureTitle">Authorized Signatory</p>
          </div>
          {/* Date */}
          <div className="dateSection">
            <p className="dateLabel">Date of Completion</p>
            <p className="dateValue">{certData.completionDate}</p>
          </div>
        </div>
      </div>
         <div className="uploadButton">
        <button
          onClick={handleSubmit}
          className="button"
          onMouseOver={e => e.currentTarget.classList.add('buttonHover')}
          onMouseOut={e => e.currentTarget.classList.remove('buttonHover')}
        >
          <BsUpload style={{ width: '20px', height: '20px' }} />
          Upload Certificate
        </button>
      </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;


// import React, { useState } from 'react';
// import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
// import { format } from 'date-fns';
// import { uploadCertificate } from '../utils/uplodCertificate';

// interface CertificateData {
//   recipientName: string;
//   courseName: string;
//   completionDate: string;
//   institution: string;
// }

// const CertificateTemplate: React.FC<any> = ({ student, course, onUploaded }) => {

//   const [certData, setCertData] = useState<CertificateData>({
//     recipientName: student?.name || '',
//     courseName: course || '',
//     completionDate: format(Date.now(), 'dd-MM-yyyy'),
//     institution: 'Nueraq Academy'
//   });

//   const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [isGenerating, setIsGenerating] = useState(false);


//   const handleInputChange = (field: keyof CertificateData, value: string) => {
//     setCertData(prev => ({ ...prev, [field]: value }));
//   };

//   // Handle signature image upload (preview only, not uploading to server)
//   const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setSignaturePreview(reader.result as string);
//     };
//     reader.readAsDataURL(file);
//   };

//   // Submission: generate PDF with embedded signature image
//   const handleSubmit = async () => {
//     if (!student) {
//       alert('No student found!');
//       return;
//     }
//           setIsGenerating(true);
//         setUploadProgress(0);
//     setTimeout(async () => {
//       try {
//         await uploadCertificate({
//           ...certData,
//           studentId: student.id,
//           courseName: certData.courseName,
//           signaturePreview
//         }, (progress) => {
//           setUploadProgress(progress)
//         });
//         alert('✅ certificate generated successfully!');
//         if (onUploaded) onUploaded();
//       } catch (error) {
//         console.error('certificate generation failed:', error);
//       }finally{
//               setIsGenerating(false);
//         setUploadProgress(0);
//       }
//     }, 100);
//   };


//   // const [certData, setCertData] = useState<CertificateData>({
//   //   recipientName: student?.name || '',
//   //   courseName: course || '',
//   //   completionDate: format(Date.now(), 'dd-MM-yyyy'),
//   //   institution: 'Nueraq Academy'
//   // });

//   // const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
//   // const [uploadProgress, setUploadProgress] = useState(0);
//   // const [isGenerating, setIsGenerating] = useState(false);

//   // const handleInputChange = (field: keyof CertificateData, value: string) => {
//   //   setCertData(prev => ({ ...prev, [field]: value }));
//   // };

//   // const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//   //   const file = e.target.files?.[0];
//   //   if (!file) return;
//   //   const reader = new FileReader();
//   //   reader.onloadend = () => {
//   //     setSignaturePreview(reader.result as string);
//   //   };
//   //   reader.readAsDataURL(file);
//   // };

//   // const handleSubmit = async () => {
//   //   if (!student) {
//   //     alert('No student found!');
//   //     return;
//   //   }
//   //   setIsGenerating(true);
//   //   setUploadProgress(0);
//   //   setTimeout(async () => {
//   //     try {
//   //       await new Promise(resolve => setTimeout(resolve, 2000));
//   //       setUploadProgress(100);
//   //       alert('✅ certificate generated successfully!');
//   //       if (onUploaded) onUploaded();
//   //     } catch (error) {
//   //       console.error('certificate generation failed:', error);
//   //     } finally {
//   //       setIsGenerating(false);
//   //       setUploadProgress(0);
//   //     }
//   //   }, 100);
//   // };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
//       {/* Progress Tracker */}
//       {isGenerating && (
//         <div className="fixed inset-0 bg-gradient-to-br from-black/70 to-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
//             <div className="text-center mb-8">
//               <h3 className="text-2xl font-bold text-gray-900 mb-2">
//                 {uploadProgress === 100 ? "Complete!" : "Processing"}
//               </h3>
//               <p className="text-sm text-gray-600">
//                 {uploadProgress === 100 ? "Your certificate is ready" : "Generating your certificate..."}
//               </p>
//             </div>
//             <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
//               <div 
//                 className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 transition-all duration-500 ease-out rounded-full shadow-lg"
//                 style={{ width: `${uploadProgress}%` }}
//               />
//             </div>
//             <p className="text-center text-3xl font-bold text-gray-900">{uploadProgress}%</p>
//           </div>
//         </div>
//       )}

//       <div className="max-w-5xl mx-auto">
//         {/* Header Section */}
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">Certificate Generator</h1>
//           <p className="text-gray-600">Create and upload professional certificates for course completion</p>
//         </div>

//         {/* Input Section */}
//         <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
//           <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//             <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center font-bold">1</div>
//             Certificate Details
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Recipient Name */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Recipient Name
//               </label>
//               <input
//                 type="text"
//                 value={certData.recipientName}
//                 onChange={e => handleInputChange('recipientName', e.target.value)}
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
//                 placeholder="Enter recipient name"
//               />
//             </div>

//             {/* Course Name */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Course Name
//               </label>
//               <input
//                 type="text"
//                 value={certData.courseName}
//                 onChange={e => handleInputChange('courseName', e.target.value)}
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
//                 placeholder="Enter course name"
//               />
//             </div>

//             {/* Completion Date */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Completion Date
//               </label>
//               <input
//                 type="text"
//                 value={certData.completionDate}
//                 onChange={e => handleInputChange('completionDate', e.target.value)}
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
//               />
//             </div>

//             {/* Institution Name */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Institution Name
//               </label>
//               <input
//                 type="text"
//                 value={certData.institution}
//                 onChange={e => handleInputChange('institution', e.target.value)}
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
//               />
//             </div>

//             {/* Signature Upload */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Signature Upload
//               </label>
//               <div className="relative">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleSignatureUpload}
//                   className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
//                 />
//               </div>
//               {signaturePreview && (
//                 <div className="mt-4 p-4 bg-gray-50 rounded-lg">
//                   <p className="text-sm text-gray-600 mb-2 font-medium">Signature Preview</p>
//                   <img
//                     src={signaturePreview}
//                     alt="Signature Preview"
//                     className="h-16 object-contain border border-gray-200 rounded-lg"
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Certificate Preview Section */}
//         <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
//           <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//             <div className="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center font-bold">2</div>
//             Preview
//           </h2>
          
//           {/* Certificate */}
//           <div id="certificate" className="bg-gradient-to-br from-amber-50 via-white to-amber-50 border-8 border-amber-900 rounded-xl p-12 text-center relative overflow-hidden">
//             {/* Decorative corners */}
//             <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-900 opacity-30"></div>
//             <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-900 opacity-30"></div>
//             <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-900 opacity-30"></div>
//             <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-900 opacity-30"></div>

//             {/* Header */}
//             <div className="mb-8 pb-6 border-b-2 border-amber-300">
//               <h1 className="text-5xl font-bold text-amber-900 mb-2 font-serif">Certificate of Completion</h1>
//               <p className="text-lg text-amber-800 font-semibold">This Certifies That</p>
//             </div>

//             {/* Recipient Name */}
//             <div className="my-8">
//               <p className="text-5xl font-bold text-amber-900 font-serif">{certData.recipientName}</p>
//             </div>

//             {/* Course Details */}
//             <div className="my-8">
//               <p className="text-lg text-gray-700 mb-2">has successfully completed the course</p>
//               <h3 className="text-3xl font-bold text-amber-900 font-serif">{certData.courseName}</h3>
//             </div>

//             {/* Description */}
//             <div className="my-8 px-8">
//               <p className="text-gray-700 leading-relaxed">
//                 This certificate is proudly presented to recognize the successful completion of the course and demonstration of proficiency in the subject matter.
//               </p>
//             </div>

//             {/* Footer */}
//             <div className="mt-12 pt-8 border-t-2 border-amber-300 flex justify-between items-end">
//               {/* Signature */}
//               <div className="text-center flex-1">
//                 {signaturePreview && (
//                   <img
//                     src={signaturePreview}
//                     alt="Signature"
//                     className="h-12 object-contain mx-auto mb-2"
//                   />
//                 )}
//                 <div className="w-40 h-1 bg-gray-400 mx-auto mb-2"></div>
//                 <p className="text-sm font-semibold text-amber-900">{certData.institution}</p>
//                 <p className="text-xs text-gray-600">Authorized Signatory</p>
//               </div>

//               {/* Date */}
//               <div className="text-center flex-1">
//                 <p className="text-xs text-gray-600 mb-1">Date of Completion</p>
//                 <p className="text-lg font-semibold text-amber-900">{certData.completionDate}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Upload Button */}
//         <div className="flex justify-center">
//           <button
//             onClick={handleSubmit}
//             disabled={isGenerating}
//             className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
//           >
//             <Upload size={22} />
//             {isGenerating ? 'Generating...' : 'Upload Certificate'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CertificateTemplate;