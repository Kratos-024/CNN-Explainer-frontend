import * as d3 from "d3";
import { useRef, useEffect } from "react";
import { ImCancelCircle } from "react-icons/im";
import type { Point } from "./layers";

interface DropoutFeatureFlowViewProp {
  outputShape: [number, number, number];
  inputShape: [number, number, number];
  dropoutImages: string[];
  setModelpopUpHandler: (mode?: string, src?: string[], dest?: string) => void;
  inputFeatureMaps: string[];
}

const DropoutFeatureFlowView = ({
  inputShape,
  dropoutImages,
  outputShape,
  setModelpopUpHandler,
  inputFeatureMaps,
}: DropoutFeatureFlowViewProp) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dropoutRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const drawConnections = () => {
      if (
        !svgRef.current ||
        !containerRef.current ||
        inputRefs.current.length === 0 ||
        dropoutRefs.current.length === 0
      ) {
        return;
      }

      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const containerRect = containerRef.current.getBoundingClientRect();

      inputRefs.current.forEach((inputBox, index) => {
        const dropoutBox = dropoutRefs.current[index];

        if (!inputBox || !dropoutBox) return;

        const inputRect = inputBox.getBoundingClientRect();
        const dropoutRect = dropoutBox.getBoundingClientRect();

        const source: Point = {
          x: inputRect.left + inputRect.width / 2 - containerRect.left,
          y: inputRect.bottom - containerRect.top,
        };

        const target: Point = {
          x: dropoutRect.left + dropoutRect.width / 2 - containerRect.left,
          y: dropoutRect.top - containerRect.top,
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
          .attr("opacity", 0.6);
        const pathNode = path.node() as SVGPathElement;
        const pathLength = pathNode.getTotalLength();

        const circle = svg
          .append("circle")
          .attr("class", "connection-circle")
          .attr("r", 3)
          .attr("fill", "#ef4444")
          .attr("opacity", 0.8);

        const animate = () => {
          circle
            .transition()
            .duration(2000 + Math.random() * 1000)
            .ease(d3.easeLinear)
            .attrTween("transform", () => (t: number) => {
              const point = pathNode.getPointAtLength(t * pathLength);
              return `translate(${point.x}, ${point.y})`;
            })
            .on("end", animate);
        };
        setTimeout(() => animate(), index * 200);
      });
    };
    drawConnections();
    const resizeObserver = new ResizeObserver(() => {
      drawConnections();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    window.addEventListener("resize", drawConnections);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", drawConnections);
    };
  }, [inputFeatureMaps, dropoutImages]);

  return (
    <div
      ref={containerRef}
      className="relative w-full z-50 h-[50vh]  flex flex-col
      justify-between items-center px-4 md:px-10 "
    >
      <div className=" text-white absolute -top-9">
        Input shape ({inputShape[0]}, {inputShape[1]}) Output shape (
        {outputShape[0]}, {outputShape[1]})
      </div>

      <svg
        style={{ zIndex: 0 }}
        ref={svgRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
      <div
        onClick={() => setModelpopUpHandler()}
        className="cursor-pointer z-50 absolute right-5 -top-24"
      >
        <ImCancelCircle className="fill-gray-600 w-8 h-8 hover:fill-white/40 transition-colors" />
      </div>

      <div
        className={` relative z-10 flex flex-row gap-5 overflow-y-auto py-4 scrollbar-hide`}
      >
        {inputFeatureMaps.map((channel, i) => (
          <div
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            key={i}
            className="flex cursor-pointer flex-col items-center"
          >
            <div className="w-20 h-20 rounded-lg shadow-md border border-gray-200 overflow-hidden bg-gray-50 hover:scale-105 transition-transform">
              {channel ? (
                <img
                  src={channel}
                  alt={"Input layer " + i}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  ...
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div
        className={` relative z-10 flex flex-row gap-5 overflow-y-auto py-4 scrollbar-hide`}
      >
        {dropoutImages.map((src, index) => (
          <div
            key={index}
            ref={(el) => {
              dropoutRefs.current[index] = el;
            }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 rounded-lg shadow-md border-2 border-dashed border-red-300 overflow-hidden bg-gray-50">
              {src ? (
                <img
                  src={src}
                  alt="Dropout Output"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500">
                  <span className="text-xs">Dropped</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DropoutFeatureFlowView;
