import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Image as ImageIcon,
  Video as VideoIcon,
} from "lucide-react";
import { DEFAULT_IMAGE_URL } from "@/configs";

const ImageVideoViewFullScreenModal = ({
  isFullscreenOpen,
  setIsFullscreenOpen,
  currentMediaIndex,
  allMedia,
  product,
  prevMedia,
  nextMedia,
  setCurrentMediaIndex,
  handleMediaError,
  isMediaFailed,
}: {
  isFullscreenOpen: boolean;
  setIsFullscreenOpen: (isFullscreenOpen: boolean) => void;
  currentMediaIndex: number;
  allMedia: any;
  product: any;
  prevMedia: () => void;
  nextMedia: () => void;
  setCurrentMediaIndex: (index: number) => void;
  handleMediaError: (index: number) => void;
  isMediaFailed: (index: number) => boolean;
}) => {
  const currentMedia = useMemo(
    () => allMedia[currentMediaIndex],
    [allMedia, currentMediaIndex]
  );

  const getCurrentMedia = () => {
    const media = allMedia?.[currentMediaIndex];
    if (!media) return null;

    // If media failed to load, return null to show placeholder
    if (isMediaFailed(currentMediaIndex)) {
      return null;
    }

    return media;
  };

  // Keyboard accessibility for fullscreen modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isFullscreenOpen || allMedia.length <= 1) return;

      switch (event.key) {
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          prevMedia();
          break;
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          nextMedia();
          break;
        case "Home":
          event.preventDefault();
          setCurrentMediaIndex(0);
          break;
        case "End":
          event.preventDefault();
          setCurrentMediaIndex(allMedia.length - 1);
          break;
        case " ":
        case "Space":
          event.preventDefault();
          nextMedia();
          break;
      }
    };

    if (isFullscreenOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreenOpen, allMedia.length, prevMedia, nextMedia]);

  return (
    <Dialog open={isFullscreenOpen} onOpenChange={setIsFullscreenOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white z-10"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-full h-[90vh] p-2">
        {/* Custom Close Button */}
        <DialogClose asChild>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 bg-white/80 hover:bg-white z-50"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogClose>

        <div className="relative w-full h-full flex items-center justify-center bg-black rounded-lg">
          {getCurrentMedia()?.type === "image" ? (
            <img
              src={
                getCurrentMedia()?.url &&
                !getCurrentMedia()?.url.includes("example")
                  ? getCurrentMedia()?.url
                  : DEFAULT_IMAGE_URL
              }
              alt={getCurrentMedia()?.alt || product?.name || "Product Media"}
              className="max-w-full max-h-full object-contain"
              onError={() => handleMediaError(currentMediaIndex)}
            />
          ) : getCurrentMedia()?.type === "video" ? (
            <video
              src={getCurrentMedia()?.url}
              controls
              controlsList="nodownload"
              className="max-w-full max-h-full object-contain"
              autoPlay
              onError={() => handleMediaError(currentMediaIndex)}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            // Placeholder for failed media in fullscreen
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 rounded-lg">
              <div className="text-center text-white">
                {getCurrentMedia()?.type === "video" ? (
                  <VideoIcon className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                ) : (
                  <ImageIcon className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                )}
                <p className="text-lg text-gray-300 font-medium mb-2">
                  {getCurrentMedia()?.type === "video" ? "Video" : "Image"} not
                  available
                </p>
                <p className="text-sm text-gray-400">Broken or invalid link</p>
              </div>
            </div>
          )}

          {/* Fullscreen Navigation Arrows */}
          {allMedia?.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white z-50"
                onClick={prevMedia}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white z-50"
                onClick={nextMedia}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageVideoViewFullScreenModal;
