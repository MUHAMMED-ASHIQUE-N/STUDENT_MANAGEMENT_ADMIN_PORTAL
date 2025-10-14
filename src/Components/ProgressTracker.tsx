
import React from 'react'
import { CheckCircle2 } from 'lucide-react'

interface Progress {
    isGenerating: boolean;
    uploadProgress: number;
}

function ProgressTracker({ isGenerating, uploadProgress }: Progress) {
    const getStageInfo = () => {
        if (uploadProgress < 30) return { label: "Rendering", stage: 1 };
        if (uploadProgress < 60) return { label: "Creating PDF", stage: 2 };
        if (uploadProgress < 90) return { label: "Uploading", stage: 3 };
        return { label: "Finalizing", stage: 4 };
    };
    const stageInfo = getStageInfo();
    return (
        <>
            {isGenerating && (
                <div className="fixed inset-0 bg-gradient-to-br from-black/70 to-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {uploadProgress === 100 ? "Complete!" : "Processing"}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {uploadProgress === 100 ? "Your file is ready" : "Hang tight, we're almost there"}
                            </p>
                        </div>
                        <div className="mb-4">
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 transition-all duration-500 ease-out rounded-full shadow-lg"
                                    style={{ width: `${uploadProgress}%` }}
                                >
                                    <div className="h-full animate-pulse opacity-75"></div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center mb-6">
                            <p className="text-3xl font-bold text-gray-900 mb-1">
                                {uploadProgress}%
                            </p>
                            <p className="text-sm text-gray-600 h-5">
                                {stageInfo.label}
                            </p>
                        </div>
                        <div className="flex justify-center gap-1 mb-4">
                            {[0, 1, 2].map(i => (
                                <div
                                    key={i}
                                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                    style={{
                                        animationDelay: `${i * 0.15}s`,
                                        animationDuration: '1s'
                                    }}
                                />
                            ))}
                        </div>
                        {uploadProgress === 100 && (
                            <div className="flex items-center justify-center gap-2 text-green-600 font-semibold animate-fade-in">
                                <CheckCircle2 size={20} />
                                <span>Ready to download!</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default ProgressTracker