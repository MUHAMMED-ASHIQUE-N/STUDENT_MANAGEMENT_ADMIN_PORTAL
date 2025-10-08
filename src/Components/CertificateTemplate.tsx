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
      <div className="container" style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Certificate Details</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ fontSize: '13px', color: '#555', marginBottom: '4px', display: 'block' }}>
              Recipient Name
            </label>
            <input
              type="text"
              value={certData.recipientName}
              onChange={e => handleInputChange('recipientName', e.target.value)}
              style={{ width: '100%', padding: '6px 10px', fontSize: '15px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '8px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: '#555', marginBottom: '4px', display: 'block' }}>
              Course Name
            </label>
            <input
              type="text"
              value={certData.courseName}
              onChange={e => handleInputChange('courseName', e.target.value)}
              style={{ width: '100%', padding: '6px 10px', fontSize: '15px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '8px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: '#555', marginBottom: '4px', display: 'block' }}>
              Completion Date
            </label>
            <input
              type="text"
              value={certData.completionDate}
              onChange={e => handleInputChange('completionDate', e.target.value)}
              style={{ width: '100%', padding: '6px 10px', fontSize: '15px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '8px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: '#555', marginBottom: '4px', display: 'block' }}>
              Institution Name
            </label>
            <input
              type="text"
              value={certData.institution}
              onChange={e => handleInputChange('institution', e.target.value)}
              style={{ width: '100%', padding: '6px 10px', fontSize: '15px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '8px' }}
            />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '13px', color: '#555', marginBottom: '4px', display: 'block' }}>
              Signature Upload
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleSignatureUpload}
              style={{ width: '100%', padding: '6px 10px', fontSize: '15px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '8px' }}
            />
            {signaturePreview && (
              <div style={{ marginTop: '8px' }}>
                <img
                  src={signaturePreview}
                  alt="Signature Preview"
                  style={{ maxWidth: '180px', maxHeight: '60px', objectFit: 'contain', border: '1px solid #eee', borderRadius: '4px' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Certificate Preview */}
      <div className="container" id="certificate">
        {/* Header */}
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
            <div className="signatureLine"></div>
            {signaturePreview && (
              <img
                src={signaturePreview}
                alt="Signature"
                style={{ maxWidth: '180px', maxHeight: '60px', objectFit: 'contain', margin: '0 auto 8px auto', display: 'block' }}
              />
            )}
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

      {/* Upload Button */}
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
  );
};

export default CertificateTemplate;


