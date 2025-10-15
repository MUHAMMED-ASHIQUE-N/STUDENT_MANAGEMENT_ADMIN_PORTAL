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

