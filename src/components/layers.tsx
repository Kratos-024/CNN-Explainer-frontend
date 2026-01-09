import * as d3 from "d3";
import React, { useRef, useEffect } from "react";

interface Point {
  x: number;
  y: number;
}

interface LayersProps {
  images: {
    ImageR: string;
    ImageG: string;
    ImageB: string;
  };
  boxRefs: React.RefObject<(HTMLDivElement | null)[]>;
}

interface VisualizationContainerProps {
  imagePreview: string;
  images: {
    ImageR: string;
    ImageG: string;
    ImageB: string;
  };
}

const Layers = ({ images, boxRefs }: LayersProps) => {
  const channels = [
    { src: images.ImageR, label: "Red Channel", color: "border-red-300" },
    { src: images.ImageG, label: "Green Channel", color: "border-green-300" },
    { src: images.ImageB, label: "Blue Channel", color: "border-blue-300" },
  ];

  return (
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
  );
};

const VisualizationContainer = ({
  imagePreview,
  images,
}: VisualizationContainerProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const uploadedImageRef = useRef<HTMLDivElement>(null);
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const drawConnections = () => {
      if (
        !svgRef.current ||
        !containerRef.current ||
        !uploadedImageRef.current
      ) {
        return;
      }

      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();
      const containerRect = containerRef.current.getBoundingClientRect();
      const upImgRect = uploadedImageRef.current.getBoundingClientRect();
      const source: Point = {
        x: upImgRect.left + upImgRect.width / 2 - containerRect.left,
        y: upImgRect.bottom - containerRect.top,
      };

      boxRefs.current.forEach((box, i) => {
        if (!box) return;
        const boxRect = box.getBoundingClientRect();
        const target: Point = {
          x: boxRect.left + boxRect.width / 2 - containerRect.left,
          y: boxRect.top - containerRect.top,
        };
        const controlPoint1: Point = {
          x: source.x,
          y: source.y + (target.y - source.y) * 0.5,
        };

        const controlPoint2: Point = {
          x: target.x,
          y: target.y - (target.y - source.y) * 0.5,
        };

        const pathData = `M ${source.x},${source.y} 
                          C ${controlPoint1.x},${controlPoint1.y} 
                            ${controlPoint2.x},${controlPoint2.y} 
                            ${target.x},${target.y}`;

        const path = svg
          .append("path")
          .attr("d", pathData)
          .attr("fill", "none")
          .attr("stroke", "#94a3b8")
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "5,5")
          .attr("opacity", 0.5);

        const pathNode = path.node() as SVGPathElement;
        const pathLength = pathNode.getTotalLength();

        const circle = svg
          .append("circle")
          .attr("r", 5)
          .attr("fill", "#3b82f6")
          .attr("filter", "drop-shadow(0px 0px 3px rgba(59, 130, 246, 0.8))");

        const animate = () => {
          circle
            .transition()
            .duration(2000 + i * 300)
            .ease(d3.easeLinear)
            .attrTween("transform", () => (t: number) => {
              const point = pathNode.getPointAtLength(t * pathLength);
              return `translate(${point.x}, ${point.y})`;
            })
            .on("end", animate);
        };

        setTimeout(() => animate(), i * 400);
      });
    };
    const timer = setTimeout(drawConnections, 100);
    const resizeObserver = new ResizeObserver(() => {
      drawConnections();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    window.addEventListener("resize", drawConnections);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", drawConnections);
    };
  }, [imagePreview, images]);

  return (
    <div
      ref={containerRef}
      className="relative w-full flex flex-col items-center px-4"
      style={{ minHeight: "600px" }}
    >
      <svg
        ref={svgRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />

      <div ref={uploadedImageRef} className="relative z-10 mb-16 md:mb-20">
        <img
          src={imagePreview}
          alt="Uploaded Preview"
          className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-xl shadow-2xl border-4 border-white"
        />
        <div className="text-center mt-2 font-semibold text-gray-700">
          Input Image
        </div>
      </div>

      <Layers images={images} boxRefs={boxRefs} />
    </div>
  );
};

export { VisualizationContainer };
