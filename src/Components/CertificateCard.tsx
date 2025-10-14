import { format } from 'date-fns';
import { Award, Calendar, Download, Eye, FileText } from 'lucide-react';
import React from 'react'

function CertificateCard({ cert, onGenerate }: any) {
  return (
    <div key={cert.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className={` ${cert.status === "issued" ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-amber-500 via-orange-600/80 to-red-400'}  p-6 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20  p-2 rounded-lg">
              <Award size={24} />
            </div>
            <h3 className="text-lg font-bold">{cert.student.name}</h3>
          </div>
          <p className="text-blue-100">{cert.courseName}</p>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3 text-gray-700">
          <Calendar size={18} className="text-blue-500 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-500">{cert.issuedAt ? 'Issued Date' : 'Ready on'} </p>
            <p className="font-semibold">{cert.issuedAt ? (format(cert.issuedAt?.toDate(), 'dd-MM-yyyy')) : 'NOw'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <FileText size={18} className="text-blue-500 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-500">Certificate Status</p>
            <p className="font-semibold">
              {cert.certificateUrl ? (
                <span className="text-green-600">Available</span>
              ) : (
                <span className="text-gray-400">Pending Upload</span>
              )}
            </p>
          </div>
          </div>
          {cert.certificateUrl ? (
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => window.open(cert.certificateUrl, "_blank")}
                className="flex-1 cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Eye size={18} />
                View
              </button>
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = cert.certificateUrl;
                  link.download = `certificate-${cert.studentName}.pdf`;
                  link.click();
                }}
                className="flex-1 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Download
              </button>
            </div>
          ) : (
            <button
              className="w-full cursor-pointer bg-amber-600 text-white hover:bg-amber-700 active:scale-95 border border-yellow-200 rounded-lg p-3 text-center text-sm font-medium"
              onClick={() => onGenerate && onGenerate(cert.student, cert.courseName)}
            >
              Generate Certificate
            </button>
          )}
        </div>
      </div>
      );
}

      export default CertificateCard