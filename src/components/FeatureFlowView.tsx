import * as d3 from "d3";
import { useState, useRef, useEffect } from "react";
import { ImCancelCircle } from "react-icons/im";
import { ConvolutionVisualizer } from "./ConvolutionVisualizer";
import type { Point } from "./layers";
interface ConvolutionFiltersProp {
  mode: string;
  setModelpopUpHandler: (mode?: string, src?: string[], dest?: string) => void;
  outputFeatureMap: string;
  inputFeatureMaps: string[];
}
const FeatureFlowView = ({
  mode,
  setModelpopUpHandler,
  inputFeatureMaps,
  outputFeatureMap,
}: ConvolutionFiltersProp) => {
  const [channel, setChannel] = useState<string>("");

  const showMathDetailHandler = (src?: string, id?: number) => {
    setShowMathDetail(!showMathDetail);
    if (src) setChannel(src);
  };

  const [showMathDetail, setShowMathDetail] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<(HTMLDivElement | null)[]>([]);
  const outputRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const drawConnections = () => {
      if (
        !inputRefs.current[0] ||
        !svgRef.current ||
        !containerRef.current ||
        !outputRef.current
      ) {
        return;
      }

      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();
      const containerRect = containerRef.current.getBoundingClientRect();
      const outputRect = outputRef.current.getBoundingClientRect();

      const target: Point = {
        x: outputRect.left - containerRect.left,
        y: outputRect.top + outputRect.height / 2 - containerRect.top,
      };

      inputRefs.current.forEach((inputBox) => {
        if (!inputBox) return;

        const inputRect = inputBox.getBoundingClientRect();

        const source: Point = {
          x: inputRect.right - containerRect.left,
          y: inputRect.top + inputRect.height / 2 - containerRect.top,
        };

        const controlPoint1: Point = {
          x: source.x + (target.x - source.x) * 0.5,
          y: source.y,
        };

        const controlPoint2: Point = {
          x: target.x - (target.x - source.x) * 0.5,
          y: target.y,
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

        if (!showMathDetail) {
          const circle = svg
            .append("circle")
            .attr("class", "second-layer-circle")
            .attr("r", 3)
            .attr("fill", "black")
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

          setTimeout(() => animate(), 1 * 100 + 1 * 300);
        }
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
  }, [inputFeatureMaps, outputFeatureMap, showMathDetail]);

  const DEFAULT_KERNEL = [
    [1, 2, 3],
    [1, 2, 3],
    [1, 2, 3],
  ];
  return (
    <div
      ref={containerRef}
      className="relative w-full z-50 h-screen flex flex-row 
      justify-between items-center px-4 md:px-10 overflow-hidden"
    >
      <svg
        style={{ zIndex: 0 }}
        ref={svgRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
      <div
        onClick={() => setModelpopUpHandler()}
        className=" cursor-pointer z-30 absolute right-5 top-12.75 "
      >
        <ImCancelCircle className=" fill-white w-8.5 h-10.5" />
      </div>
      <div
        className={`${
          showMathDetail == true ? "opacity-40" : "opacity-100"
        } relative z-10 ${
          inputFeatureMaps.length > 5
            ? "grid grid-cols-2"
            : "flex-col flex gap-4"
        } gap-4 max-h-screen py-4
         overflow-hidden`}
      >
        {inputFeatureMaps.map((channel, i) => (
          <div
            onClick={() => {
              showMathDetailHandler(channel, i);
            }}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            key={i}
            className="flex cursor-pointer flex-col items-center"
          >
            <div
              className={`w-16 h-16 md:w-20 md:h-20 rounded-lg shadow-lg border-2 overflow-hidden bg-gray-50 transition-transform hover:scale-105`}
            >
              {channel ? (
                <img
                  src={channel}
                  alt={"First layer " + i}
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
        ref={outputRef}
        className={`${
          showMathDetail == true ? "opacity-40" : "opacity-100"
        } relative z-10 flex flex-col items-center`}
      >
        <img
          src={outputFeatureMap}
          alt="Output Preview"
          className="w-32 h-32 md:w-64 md:h-64 object-cover rounded-xl shadow-2xl border-4 border-white"
        />
        <div className="text-center mt-2 font-semibold text-gray-700 bg-white/80 px-2 rounded">
          Next Layer
        </div>
      </div>

      {showMathDetail && (
        <div className="absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl">
          <ConvolutionVisualizer
            onClose={showMathDetailHandler}
            mode={mode}
            imgSrc={channel}
            resultImgSrc={channel}
            autoPlaySpeed={500}
            kernel={{ data: DEFAULT_KERNEL }}
          />
        </div>
      )}
    </div>
  );
};
export default FeatureFlowView;
