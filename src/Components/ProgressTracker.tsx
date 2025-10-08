import React from 'react'

interface progress  {
    isGenerating:boolean;
    uploadProgress:number ;
}

function ProgressTracker({isGenerating, uploadProgress}: progress) {
  return (
    <div>
                    {isGenerating && (
                <div className="fixed inset-0 bg-black/60  flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4 text-center">
                            Generating ...
                        </h3>
                        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                            <div 
                                className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                        <p className="text-center text-sm text-gray-600">
                            {uploadProgress}% Complete
                        </p>
                        <p className="text-center text-xs text-gray-500 mt-2">
                            {uploadProgress < 30 ? "Rendering ..." : 
                             uploadProgress < 60 ? "Creating PDF..." :
                             uploadProgress < 90 ? "Uploading to cloud..." :
                             "Finalizing..."}
                        </p>
                    </div>
                </div>
            )}
    </div>
  )
}

export default ProgressTracker