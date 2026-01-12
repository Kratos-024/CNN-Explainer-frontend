import { useRef } from "react";
import FirstConvLayer from "./ConvLayer";

interface RGBLayersProps {
  featImages: string[];
  images: {
    ImageR: string;
    ImageG: string;
    ImageB: string;
  };
  boxRefs: React.RefObject<(HTMLDivElement | null)[]>;
}
const RGBLayers = ({ featImages, images, boxRefs }: RGBLayersProps) => {
  const channels = [
    { src: images.ImageR, label: "Red Channel", color: "border-red-300" },
    { src: images.ImageG, label: "Green Channel", color: "border-green-300" },
    { src: images.ImageB, label: "Blue Channel", color: "border-blue-300" },
  ];

  const svgRef2 = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const secondBoxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const grandChildren = Array(featImages.length)
    .fill(null)
    .map((_, i) => ({
      srcImg: featImages[i],
      label: `Feature Map ${i + 1}`,
    }));

  return (
    <div ref={containerRef} className="relative w-full">
      <svg
        ref={svgRef2}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />

      <div className="flex gap-8 md:gap-12 justify-center items-center relative z-10 flex-wrap">
        {channels.map((channel, i) => (
          <div
            key={i}
            ref={(el) => {
              boxRefs.current[i] = el;
            }}
            className="flex flex-col items-center"
          >
            <div
              className={`w-48 h-48 rounded-lg shadow-lg border-2 ${channel.color} overflow-hidden bg-gray-50`}
            >
              {channel.src ? (
                <img
                  src={channel.src}
                  alt={channel.label}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Loading...
                </div>
              )}
            </div>
            <div className="text-center mt-2 text-sm font-medium text-gray-600">
              {channel.label}
            </div>
          </div>
        ))}
      </div>

      <FirstConvLayer
        images={grandChildren}
        boxRefs={secondBoxRefs}
        parentBoxRefs={boxRefs}
        svgRef={svgRef2}
        containerRef={containerRef}
      />
    </div>
  );
};

export default RGBLayers;
