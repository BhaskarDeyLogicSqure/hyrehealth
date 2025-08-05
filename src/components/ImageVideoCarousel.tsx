import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ImageVideoViewFullScreenModal from "@/themes/default/Components/ImageVideoViewFullScreenModal";
import { DEFAULT_IMAGE_URL } from "@/configs";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Video as VideoIcon,
  Play,
} from "lucide-react";

const ImageVideoCarousel = ({
  allMedia,
  product,
}: {
  allMedia: any;
  product: any;
}) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [failedMedia, setFailedMedia] = useState<Set<number>>(new Set());
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  const _nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % allMedia.length);
  };

  const _prevMedia = () => {
    setCurrentMediaIndex(
      (prev) => (prev - 1 + allMedia.length) % allMedia.length
    );
  };

  const _getCurrentMedia = () => {
    const media = allMedia?.[currentMediaIndex];
    if (!media) return null;

    // If media failed to load, return null to show placeholder
    if (isMediaFailed(currentMediaIndex)) {
      return null;
    }

    return media;
  };

  const _goToMedia = (index: number) => {
    setCurrentMediaIndex(index);
  };

  const _handleMediaError = (index: number) => {
    setFailedMedia((prev) => new Set(prev)?.add(index));
  };

  const isMediaFailed = (index: number) => {
    return failedMedia?.has(index);
  };

  return (
    <Card className="mb-8 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative bg-gradient-to-br from-blue-50 to-purple-50">
          {/* Main Media Display */}
          <div className="relative h-80 flex items-center justify-center p-4">
            {allMedia?.length > 0 ? (
              <div className="relative w-full h-full flex items-center justify-center">
                {_getCurrentMedia()?.type === "image" ? (
                  <img
                    src={
                      _getCurrentMedia()?.url &&
                      !_getCurrentMedia()?.url.includes("example")
                        ? _getCurrentMedia()?.url
                        : DEFAULT_IMAGE_URL
                    }
                    alt={
                      _getCurrentMedia()?.alt ||
                      product?.name ||
                      "Product Media"
                    }
                    className="w-full h-full object-cover rounded-lg"
                    onError={() => _handleMediaError(currentMediaIndex)}
                  />
                ) : _getCurrentMedia()?.type === "video" ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <video
                      src={_getCurrentMedia()?.url}
                      controls
                      controlsList="nodownload"
                      className="w-full h-full object-contain rounded-lg bg-black"
                      style={{ maxHeight: "100%", maxWidth: "100%" }}
                      onError={() => _handleMediaError(currentMediaIndex)}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  // Placeholder for failed media
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      {_getCurrentMedia()?.type === "video" ? (
                        <VideoIcon className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                      ) : (
                        <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                      )}
                      <p className="text-sm text-gray-500 font-medium">
                        {_getCurrentMedia()?.type === "video"
                          ? "Video"
                          : "Image"}{" "}
                        not available
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Broken or invalid link
                      </p>
                    </div>
                  </div>
                )}

                {/* Fullscreen Button */}
                <ImageVideoViewFullScreenModal
                  isFullscreenOpen={isFullscreenOpen}
                  currentMediaIndex={currentMediaIndex}
                  allMedia={allMedia}
                  product={product}
                  nextMedia={_nextMedia}
                  prevMedia={_prevMedia}
                  setIsFullscreenOpen={setIsFullscreenOpen}
                  setCurrentMediaIndex={setCurrentMediaIndex}
                  handleMediaError={_handleMediaError}
                  isMediaFailed={isMediaFailed}
                />

                {/* Navigation Arrows */}
                {allMedia?.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white z-10"
                      onClick={_prevMedia}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white z-10"
                      onClick={_nextMedia}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-4xl font-bold text-blue-600">
                  {product?.name?.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail Navigation */}
          {allMedia?.length > 1 && (
            <div className="flex justify-center space-x-2 p-3 bg-white/50">
              {allMedia?.map((media: any, index: number) => (
                <button
                  key={index}
                  onClick={() => _goToMedia(index)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentMediaIndex
                      ? "border-blue-500 scale-110"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {media?.type === "image" ? (
                    isMediaFailed(index) ? (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    ) : (
                      <img
                        src={
                          media?.url && !media?.url?.includes("example")
                            ? media?.url
                            : DEFAULT_IMAGE_URL
                        }
                        alt={`Media ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={() => _handleMediaError(index)}
                      />
                    )
                  ) : isMediaFailed(index) ? (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <VideoIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-black flex items-center justify-center relative">
                      <video
                        src={media?.url}
                        className="w-full h-full object-cover"
                        muted
                        controls
                        controlsList="nodownload"
                        autoPlay={true}
                        onError={() => _handleMediaError(index)}
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageVideoCarousel;
