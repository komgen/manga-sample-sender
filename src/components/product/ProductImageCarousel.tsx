
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductImageCarouselProps {
  images: string[];
  alt: string;
}

export function ProductImageCarousel({ images, alt }: ProductImageCarouselProps) {
  // 画像が1つだけの場合は通常表示
  if (images.length <= 1) {
    return (
      <div className="aspect-square w-full bg-muted rounded-md overflow-hidden mb-3">
        <img
          src={images[0] || "/placeholder.svg"}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
      </div>
    );
  }

  return (
    <div className="relative mb-3">
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index} className="aspect-square">
              <div className="aspect-square w-full bg-muted rounded-md overflow-hidden">
                <img
                  src={image}
                  alt={`${alt} - イメージ ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-1 bg-white/80 hover:bg-white" />
        <CarouselNext className="right-1 bg-white/80 hover:bg-white" />
      </Carousel>
    </div>
  );
}
