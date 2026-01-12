import * as d3 from "d3";
import { useEffect, useRef } from "react";
import FirstReluLayer from "./ReluLayer";
import type { Point } from "./layers";

const FirstConvLayer = ({
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
  images: { label: string; srcImg: string }[];
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
  const svgRef3 = useRef<SVGSVGElement>(null);
  const containerRef2 = useRef<HTMLDivElement>(null);
  const secondBoxRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <div
      ref={containerRef2}
      className="flex gap-6 justify-center items-center flex-wrap mt-24"
    >
      <svg
        ref={svgRef3}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />
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
            src={image.srcImg}
            alt={image.label}
          />

          <div className="text-center mt-1 text-xs text-gray-500">
            {image.label}
          </div>
        </div>
      ))}
      <FirstReluLayer
        containerRef={containerRef2}
        parentBoxRefs={boxRefs}
        boxRefs={secondBoxRefs}
        images={images}
        svgRef={svgRef3}
      />
    </div>
  );
};

export default FirstConvLayer;
