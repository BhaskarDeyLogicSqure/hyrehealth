import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X, Upload, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadProgressPopupProps {
  isVisible: boolean;
  progress: number;
  fileName?: string;
  onClose: () => void;
  isComplete?: boolean;
  error?: string;
}

const UploadProgressPopup: React.FC<UploadProgressPopupProps> = ({
  isVisible,
  progress,
  fileName,
  onClose,
  isComplete = false,
  error,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 duration-300">
      <Card className="w-80 shadow-lg border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {isComplete ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : error ? (
                <Upload className="h-5 w-5 text-red-500" />
              ) : (
                <Upload className="h-5 w-5 text-blue-500 animate-pulse" />
              )}
              <div>
                <h4 className="font-semibold text-sm">
                  {error
                    ? "Upload Failed"
                    : isComplete
                    ? "Upload Complete"
                    : "Uploading File"}
                </h4>
                {fileName && (
                  <p className="text-xs text-gray-600 truncate max-w-48">
                    {fileName}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {!isComplete && !error && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-gray-600 text-center">
                {progress}% complete
              </p>
            </div>
          )}

          {error && (
            <div className="space-y-2">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          {isComplete && (
            <div className="space-y-2">
              <Progress value={100} className="h-2" />
              <p className="text-xs text-green-600 text-center">
                File uploaded successfully!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadProgressPopup;
