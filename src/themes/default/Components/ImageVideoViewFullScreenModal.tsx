import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
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
}: {
  isFullscreenOpen: boolean;
  setIsFullscreenOpen: (isFullscreenOpen: boolean) => void;
  currentMediaIndex: number;
  allMedia: any;
  product: any;
  prevMedia: () => void;
  nextMedia: () => void;
  setCurrentMediaIndex: (index: number) => void;
}) => {
  const currentMedia = useMemo(
    () => allMedia[currentMediaIndex],
    [allMedia, currentMediaIndex]
  );

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
          {currentMedia?.type === "image" ? (
            <img
              src={
                currentMedia?.url && !currentMedia?.url.includes("example")
                  ? currentMedia?.url
                  : DEFAULT_IMAGE_URL
              }
              alt={currentMedia?.alt || product?.name || "Product Media"}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <video
              src={currentMedia?.url}
              controls
              controlsList="nodownload"
              className="max-w-full max-h-full object-contain"
              autoPlay
            >
              Your browser does not support the video tag.
            </video>
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
