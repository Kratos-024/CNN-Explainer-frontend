import * as d3 from "d3";
import { useState, useRef, useEffect } from "react";
import { ConvolutionVisualizer } from "./ConvolutionVisualizer";
import type { Point } from "./layers";

interface ConvolutionFiltersProp {
  images: {
    ImageR: string;
    ImageG: string;
    ImageB: string;
  };
  convolutedImage: string;
}

const ConvolutionFilters = ({
  images,
  convolutedImage,
}: ConvolutionFiltersProp) => {
  const ConvVisualHandler = () => {
    setConvVisual(!convVisual);
  };
  const ConvVisualFunc = (src: string, id: number) => {
    setConvVisual(!convVisual);
    console.log(src, id);
  };

  const channels = [
    { src: images.ImageR, label: "Red Channel", color: "border-red-400" },
    { src: images.ImageG, label: "Green Channel", color: "border-green-400" },
  ];
  const [convVisual, setConvVisual] = useState(false);
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

        if (!convVisual) {
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
  }, [images, convolutedImage]);
  const DEFAULT_KERNEL = [
    [1, 2, 3],
    [1, 2, 3],
    [1, 2, 3],
  ];
  return (
    <div
      ref={containerRef}
      className="relative w-full z-50 h-screen flex flex-row 
      justify-between py-15  items-center  "
    >
      <svg
        style={{ zIndex: 0 }}
        ref={svgRef}
        className="absolute  top-0 left-0 w-full h-full pointer-events-none"
      />

      <div
        className={` ${
          convVisual == true ? "opacity-40" : "opacity-100"
        } flex gap-8 md:gap-12 justify-center items-center relative
      flex-col z-10 flex-wrap`}
      >
        {channels.map((channel, i) => (
          <div
            onClick={() => {
              ConvVisualFunc(channel.src, i);
            }}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            key={i}
            className="flex cursor-pointer flex-col items-center"
          >
            <div
              className={`w-20 h-20 rounded-lg shadow-lg border-2 ${channel.color} overflow-hidden bg-gray-50`}
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
      <div
        ref={outputRef}
        className={`${
          convVisual == true ? "opacity-40" : "opacity-100"
        } mb-16 md:mb-20`}
      >
        <img
          src={convolutedImage}
          alt="Uploaded Preview"
          className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-xl shadow-2xl border-4 border-white"
        />
        <div className="text-center mt-2 font-semibold text-gray-700">
          Input Image
        </div>
      </div>
      {convVisual && (
        <div className="  absolute z-50 bottom-[25%] left-[40%] ">
          {" "}
          <ConvolutionVisualizer
            ConvVisualHandler={ConvVisualHandler}
            imgSrc="src\components\galcier.jpg"
            resultImgSrc="src\components\galcier.jpg"
            autoPlaySpeed={1000}
            kernel={{ data: DEFAULT_KERNEL }}
          />
        </div>
      )}
    </div>
  );
};

export const ConvolutionMap = () => {
  const convolutedImage = "src/components/galcier.jpg";
  const images = {
    ImageR: "src/components/galcier.jpg",
    ImageG: "src/components/galcier.jpg",
    ImageB: "src/components/galcier.jpg",
  };
  const [modelpopUp, setModelpopUp] = useState<boolean>(false);

  return (
    <div className="   bg-black">
      <button
        onClick={() => {
          setModelpopUp(!modelpopUp);
        }}
        className=" bg-amber-300 px-4"
      >
        click me
      </button>
      {modelpopUp && (
        <div className=" z-30 w-full h-screen left-0 right-0 top-0 bottom-0  absolute">
          <div className="h-screen flex items-center justify-center   bg-black/70">
            <ConvolutionFilters
              convolutedImage={convolutedImage}
              images={images}
            />
          </div>
        </div>
      )}
    </div>
  );
};
