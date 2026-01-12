import * as d3 from "d3";
import { useEffect } from "react";
import type { Point } from "./layers"; // Assuming Point is defined centrally or locally

const FirstReluLayer = ({
  images,
  childBoxRefs,
  parentBoxRefs,
  svgRef,
  containerRef,
}: {
  childBoxRefs: React.RefObject<(HTMLDivElement | null)[]>;
  parentBoxRefs: React.RefObject<(HTMLDivElement | null)[]>;
  svgRef: React.RefObject<SVGSVGElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  images: { label: string; srcImg: string }[];
}) => {
  useEffect(() => {
    const drawConnections = () => {
      // 1. Safety checks
      if (!svgRef.current || !containerRef.current) return;

      const svg = d3.select(svgRef.current);
      svg.selectAll(".relu-layer-path").remove();
      svg.selectAll(".relu-layer-circle").remove();

      const containerRect = containerRef.current.getBoundingClientRect();

      images.forEach((_image, index) => {
        // 2. Get the specific elements
        const childBox = childBoxRefs.current[index]; // Destination (ReLU Image)
        const parentBox = parentBoxRefs.current[index]; // Source (Conv Image)

        // 3. THIS CHECK WAS FAILING BEFORE
        if (!childBox || !parentBox) {
          console.warn(`Missing refs for index ${index}`, {
            childBox,
            parentBox,
          });
          return;
        }

        const childRect = childBox.getBoundingClientRect();
        const parentRect = parentBox.getBoundingClientRect();

        const target: Point = {
          x: childRect.left + childRect.width / 2 - containerRect.left,
          y: childRect.top - containerRect.top,
        };

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
          .attr("class", "relu-layer-path")
          .attr("d", pathData)
          .attr("fill", "none")
          .attr("stroke", "#ef4444") // Changed to Red to match your theme
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "5,5")
          .attr("opacity", 0.6);

        const pathNode = path.node() as SVGPathElement;
        const pathLength = pathNode.getTotalLength();

        const circle = svg
          .append("circle")
          .attr("class", "relu-layer-circle")
          .attr("r", 4)
          .attr("fill", "#ef4444")
          .attr("opacity", 1);

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
  }, [images, parentBoxRefs, childBoxRefs, svgRef, containerRef]);

  return (
    <div className="flex gap-6 justify-center items-center flex-wrap mt-24">
      {images.map((image, i) => (
        <div
          key={i}
          className="flex flex-col items-center rounded-2xl relative z-10"
        >
          <img
            ref={(el) => {
              // FIX: Assign to childBoxRefs, NOT parentBoxRefs
              if (childBoxRefs.current) {
                childBoxRefs.current[i] = el;
              }
            }}
            className="w-24 h-24 rounded-2xl border-2 border-dashed border-red-400 p-1 bg-white"
            src={image.srcImg}
            alt={image.label}
          />

          <div className="text-center mt-1 text-xs text-gray-500">
            ReLU {i + 1}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FirstReluLayer;
