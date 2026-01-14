import * as d3 from "d3";
import { useRef, useEffect } from "react";
import RGBLayers from "./RGBLayers";

interface Point {
  x: number;
  y: number;
}

interface VisualizationContainerProps {
  setModelpopUpHandler: (mode?: string, src?: string[], dest?: string) => void;
  animation: boolean;
  featImages: string[][];
  imagePreview: string;
}

const VisualizationContainer = ({
  setModelpopUpHandler,
  animation,
  featImages,
  imagePreview,
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
      const inputImage = uploadedImageRef.current.getBoundingClientRect();
      const source: Point = {
        x: inputImage.left + inputImage.width / 2 - containerRect.left,
        y: inputImage.bottom - containerRect.top,
      };

      boxRefs.current.forEach((box, _i) => {
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

        svg
          .append("path")
          .attr("d", pathData)
          .attr("fill", "none")
          .attr("stroke", "#94a3b8")
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "5,5")
          .attr("opacity", 0.5);
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
  }, [imagePreview, featImages]);

  return (
    <div
      ref={containerRef}
      className="relative w-full flex flex-col items-center px-4 py-8"
      style={{ minHeight: "900px" }}
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

      <RGBLayers
        setModelpopUpHandler={(
          mode?: string,
          first?: string[],
          next?: string
        ) => {
          setModelpopUpHandler(mode, first, next);
        }}
        animation={animation}
        featImages={featImages}
        boxRefs={boxRefs}
      />
    </div>
  );
};

export { VisualizationContainer };
export type { Point };
