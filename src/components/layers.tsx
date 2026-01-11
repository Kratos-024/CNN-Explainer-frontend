import * as d3 from "d3";
import React, { useRef, useEffect, useState } from "react";
import { ConvolutionVisualizer } from "./ConvolutionVisualizer";

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
  const ShowMatrixMulti = (src: string, id: number) => {
    setShowMat(!showMat);
    console.log(src, id);
  };
  const channels = [
    { src: images.ImageR, label: "Red Channel", color: "border-red-400" },
    { src: images.ImageG, label: "Green Channel", color: "border-green-400" },
  ];
  const [showMat, setShowMat] = useState(false);
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
      className="relative z-50 h-screen flex flex-row justify-between py-15  items-center  w-full"
    >
      <svg
        style={{ zIndex: 0 }}
        ref={svgRef}
        className="absolute  top-0 left-0 w-full h-full pointer-events-none"
      />

      <div
        className="flex gap-8 md:gap-12 justify-center items-center relative
      flex-col z-10 flex-wrap"
      >
        {channels.map((channel, i) => (
          <div
            onClick={() => {
              ShowMatrixMulti(channel.src, i);
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
      <div className="flex-1"></div>
      <div ref={outputRef} className="   mb-16 md:mb-20">
        <img
          src={convolutedImage}
          alt="Uploaded Preview"
          className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-xl shadow-2xl border-4 border-white"
        />
        <div className="text-center mt-2 font-semibold text-gray-700">
          Input Image
        </div>
      </div>
      {showMat && (
        // <ConvolutionVisualizer
        //   srcImg="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png"
        //   destImg="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/132.png"
        // />

        <ConvolutionVisualizer
          imgSrc="src\components\galcier.jpg"
          resultImgSrc="src\components\galcier.jpg"
          autoPlaySpeed={500}
          kernel={{ data: DEFAULT_KERNEL }}
        />
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

const SecondLayers = ({
  images,
  boxRefs,
  parentBoxRefs,
  svgRef,
  containerRef,
}: {
  boxRefs: React.RefObject<(HTMLDivElement | null)[]>;
  parentBoxRefs: React.RefObject<(HTMLDivElement | null)[]>;
  svgRef: React.RefObject<SVGSVGElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  images: { label: string }[];
}) => {
  useEffect(() => {
    const drawConnections = () => {
      if (!svgRef.current || !containerRef.current) return;

      const svg = d3.select(svgRef.current);
      svg.selectAll(".second-layer-path").remove();
      svg.selectAll(".second-layer-circle").remove();

      const containerRect = containerRef.current.getBoundingClientRect();

      images.forEach((_image, childIndex) => {
        const childBox = boxRefs.current[childIndex];
        if (!childBox) return;
        const childRect = childBox.getBoundingClientRect();

        const target: Point = {
          x: childRect.left + childRect.width / 2 - containerRect.left,
          y: childRect.top - containerRect.top,
        };

        parentBoxRefs.current.forEach((parentBox, parentIndex) => {
          if (!parentBox) return;

          const parentRect = parentBox.getBoundingClientRect();

          const source: Point = {
            x: parentRect.left + parentRect.width / 2 - containerRect.left,
            y: parentRect.bottom - containerRect.top,
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
            .attr("class", "second-layer-path")
            .attr("d", pathData)
            .attr("fill", "none")
            .attr("stroke", "#cbd5e1")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "3,3")
            .attr("opacity", 0.8);

          const pathNode = path.node() as SVGPathElement;
          const pathLength = pathNode.getTotalLength();

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

          setTimeout(() => animate(), childIndex * 100 + parentIndex * 300);
        });
      });
    };

    const timer = setTimeout(drawConnections, 200);
    const resizeObserver = new ResizeObserver(() => drawConnections());

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    window.addEventListener("resize", drawConnections);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", drawConnections);
    };
  }, [images, parentBoxRefs, boxRefs, svgRef, containerRef]);

  return (
    <div className="flex gap-6 justify-center items-center flex-wrap mt-24">
      {images.map((image, i) => (
        <div
          key={i}
          ref={(el) => {
            boxRefs.current[i] = el;
          }}
          className="flex flex-col items-center rounded-2xl"
        >
          <img
            className="w-24 h-24 rounded-2xl"
            src="src\components\galcier.jpg"
            alt={image.label}
          />

          <div className="text-center mt-1 text-xs text-gray-500">
            {image.label}
          </div>
        </div>
      ))}
    </div>
  );
};

const Layers = ({ images, boxRefs }: LayersProps) => {
  const channels = [
    { src: images.ImageR, label: "Red Channel", color: "border-red-300" },
    { src: images.ImageG, label: "Green Channel", color: "border-green-300" },
    { src: images.ImageB, label: "Blue Channel", color: "border-blue-300" },
  ];

  const svgRef2 = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const secondBoxRefs = useRef<(HTMLDivElement | null)[]>([]);

  const grandChildren = Array(10)
    .fill(null)
    .map((_, i) => ({
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

      <SecondLayers
        images={grandChildren}
        boxRefs={secondBoxRefs}
        parentBoxRefs={boxRefs}
        svgRef={svgRef2}
        containerRef={containerRef}
      />
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
  }, [imagePreview, images]);

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

      <Layers images={images} boxRefs={boxRefs} />
    </div>
  );
};

export default VisualizationContainer;
