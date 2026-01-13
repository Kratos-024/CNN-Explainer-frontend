import * as d3 from "d3";
import { useEffect, useRef } from "react";
import type { Point } from "./layers";
import type { ReluCompProp } from "./ReluLayer";

export const drawConnections = (
  index: number,
  animation: boolean,
  svgRef: React.RefObject<SVGSVGElement | null>,
  containerRef: React.RefObject<HTMLDivElement | null>,
  images: string[][],
  parentBoxRefs: React.RefObject<(HTMLDivElement | null)[]>,
  childBoxRefs: React.RefObject<(HTMLDivElement | null)[]>,
  path_class_name: string,
  circle_class_name: string
) => {
  if (
    !svgRef.current ||
    !containerRef.current ||
    !parentBoxRefs.current ||
    !childBoxRefs.current
  )
    return;

  const svg = d3.select(svgRef.current);
  svg.selectAll(`.${path_class_name}`).remove();
  svg.selectAll(`.${circle_class_name}`).remove();
  const containerRect = containerRef.current.getBoundingClientRect();

  images[index].forEach((_image, childIndex) => {
    const childBox = childBoxRefs.current[childIndex];
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
        .attr("class", path_class_name)
        .attr("d", pathData)
        .attr("fill", "none")
        .attr("stroke", "#cbd5e1")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "3,3")
        .attr("opacity", 1);

      const dashCycleLength = 6;
      if (animation) {
        const animateFlow = () => {
          path
            .attr("stroke-dashoffset", 0)
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", -dashCycleLength)
            .on("end", animateFlow);
        };
        setTimeout(() => animateFlow(), childIndex * 50 + parentIndex * 50);
      }
    });
  });
};

const ConvLayerComp = ({
  setModelpopUpHandler,
  label,
  index,
  animation,
  images,
  childBoxRefs,
  parentBoxRefs,
  svgRef,
  containerRef,
  path_class_name,
  circle_class_name,
  relu,
  ReluLayer,
}: ReluCompProp) => {
  const drawConnect = () => {
    return drawConnections(
      index,
      animation,
      svgRef,
      containerRef,
      images,
      parentBoxRefs,
      childBoxRefs,
      path_class_name,
      circle_class_name
    );
  };
  useEffect(() => {
    const timer = setTimeout(drawConnect, 200);
    const resizeObserver = new ResizeObserver(drawConnect);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    window.addEventListener("resize", drawConnect);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", drawConnect);
    };
  }, [images, parentBoxRefs, childBoxRefs, svgRef, containerRef, animation]);

  const svgRef_ = useRef<SVGSVGElement | null>(null);
  const containerRef_ = useRef<HTMLDivElement>(null);
  const convLayerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reluLayerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const RL = ReluLayer;

  return (
    <div
      ref={containerRef_}
      className="relative flex flex-col items-center mt-24 w-full"
    >
      <svg
        ref={svgRef_}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <div className="flex gap-6 justify-center items-center z-10">
        {images[index].map((image, i) => (
          <div
            onClick={() => {
              index === 1
                ? setModelpopUpHandler(images[0], image)
                : setModelpopUpHandler(images[index - 1], image);
            }}
            key={i}
            ref={(el) => {
              if (childBoxRefs.current) childBoxRefs.current[i] = el;
              convLayerRefs.current[i] = el;
            }}
            className="flex cursor-pointer flex-col items-center rounded-2xl bg-white"
          >
            <img
              className="w-24 h-24 rounded-2xl shadow-sm"
              src={image || "null"}
              alt={label}
            />
            <div className="text-center mt-1 text-xs text-gray-500">
              {label}
            </div>
          </div>
        ))}
      </div>{" "}
      <div>
        {relu && RL && (
          <RL
            setModelpopUpHandler={setModelpopUpHandler}
            animation={animation}
            svgRef={svgRef_}
            parentBoxRefs={convLayerRefs}
            images={images}
            childBoxRefs={reluLayerRefs}
            containerRef={containerRef_}
          />
        )}
      </div>
    </div>
  );
};

export { ConvLayerComp };
