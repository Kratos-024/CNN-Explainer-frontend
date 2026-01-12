import * as d3 from "d3";
import { useEffect, useRef } from "react";
import type { Point } from "./layers";
import { SecondConvLayer } from "./ConvLayer";
import { FirstMaxPoolLayer } from "./MaxPool";
//relu-layer-path
//relu-layer-circle
export const drawReluConnections = (
  svgRef: React.RefObject<SVGSVGElement | null>,
  containerRef: React.RefObject<HTMLDivElement | null>,
  images: { label: string; srcImg: string }[],
  parentBoxRefs: React.RefObject<(HTMLDivElement | null)[]>,
  childBoxRefs: React.RefObject<(HTMLDivElement | null)[]>,
  path_class_name: string,
  circle_class_name: string
) => {
  if (!svgRef.current || !containerRef.current) return;

  const svg = d3.select(svgRef.current);
  svg.selectAll(path_class_name).remove();
  svg.selectAll(circle_class_name).remove();

  const containerRect = containerRef.current.getBoundingClientRect();

  images.forEach((_image, index) => {
    const childBox = childBoxRefs.current[index];
    const parentBox = parentBoxRefs.current[index];

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
      .attr("class", path_class_name)
      .attr("d", pathData)
      .attr("fill", "none")
      .attr("stroke", "#ef4444")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5")
      .attr("opacity", 0.6);

    const pathNode = path.node() as SVGPathElement;
    const pathLength = pathNode.getTotalLength();

    const circle = svg
      .append("circle")
      .attr("class", circle_class_name)
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
const FirstReluLayer = ({
  images,
  childBoxRefs,
  parentBoxRefs,
  svgRef,
  containerRef,
  path_class_name,
  circle_class_name,
}: {
  childBoxRefs: React.RefObject<(HTMLDivElement | null)[]>;
  parentBoxRefs: React.RefObject<(HTMLDivElement | null)[]>;
  svgRef: React.RefObject<SVGSVGElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  images: { label: string; srcImg: string }[];
  path_class_name: string;
  circle_class_name: string;
}) => {
  useEffect(() => {
    const timer = setTimeout(drawReluConnections, 200);
    const resizeObserver = new ResizeObserver(() =>
      drawReluConnections(
        svgRef,
        containerRef,
        images,
        parentBoxRefs,
        childBoxRefs,
        path_class_name,
        circle_class_name
      )
    );

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    window.addEventListener("resize", () => {
      drawReluConnections(
        svgRef,
        containerRef,
        images,
        parentBoxRefs,
        childBoxRefs,
        path_class_name,
        circle_class_name
      );
    });

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", () => {
        drawReluConnections(
          svgRef,
          containerRef,
          images,
          parentBoxRefs,
          childBoxRefs,
          path_class_name,
          circle_class_name
        );
      });
    };
  }, [images, parentBoxRefs, childBoxRefs, svgRef, containerRef]);

  const svgRef_ = useRef<SVGSVGElement>(null);
  const containerRef_ = useRef<HTMLDivElement>(null);
  const nextLayerBoxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const localBoxRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <div
      ref={containerRef_}
      className="relative flex flex-col   gap-6 justify-center
      items-center mt-24"
    >
      <svg
        ref={svgRef_}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <div className="flex gap-6 justify-center items-center z-10 flex-wrap">
        {images.map((image, i) => (
          <div
            key={i}
            className="flex flex-col items-center rounded-2xl relative z-10"
          >
            <img
              ref={(el) => {
                if (childBoxRefs.current) {
                  childBoxRefs.current[i] = el;
                }
                localBoxRefs.current[i] = el;
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
      <div className=" mt-16">
        {" "}
        <SecondConvLayer
          path_class_name=".second-layer-path"
          circle_class_name=".second-layer-circle"
          images={images}
          childBoxRefs={nextLayerBoxRefs}
          parentBoxRefs={localBoxRefs}
          svgRef={svgRef_}
          containerRef={containerRef_}
        />
      </div>
    </div>
  );
};

const SecondReluLayer = ({
  images,
  childBoxRefs,
  parentBoxRefs,
  svgRef,
  containerRef,
  path_class_name,
  circle_class_name,
}: {
  childBoxRefs: React.RefObject<(HTMLDivElement | null)[]>;
  parentBoxRefs: React.RefObject<(HTMLDivElement | null)[]>;
  svgRef: React.RefObject<SVGSVGElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  images: { label: string; srcImg: string }[];
  path_class_name: string;
  circle_class_name: string;
}) => {
  useEffect(() => {
    // const drawConnections = () => {
    //   if (!svgRef.current || !containerRef.current) return;

    //   const svg = d3.select(svgRef.current);
    //   svg.selectAll(".relu-2-layer-path").remove();
    //   svg.selectAll(".relu-2-layer-circle").remove();

    //   const containerRect = containerRef.current.getBoundingClientRect();

    //   images.forEach((_image, index) => {
    //     const childBox = childBoxRefs.current[index];
    //     const parentBox = parentBoxRefs.current[index];

    //     if (!childBox || !parentBox) {
    //       console.warn(`Missing refs for index ${index}`, {
    //         childBox,
    //         parentBox,
    //       });
    //       return;
    //     }

    //     const childRect = childBox.getBoundingClientRect();
    //     const parentRect = parentBox.getBoundingClientRect();

    //     const target: Point = {
    //       x: childRect.left + childRect.width / 2 - containerRect.left,
    //       y: childRect.top - containerRect.top,
    //     };

    //     const source: Point = {
    //       x: parentRect.left + parentRect.width / 2 - containerRect.left,
    //       y: parentRect.bottom - containerRect.top,
    //     };

    //     const controlPoint1: Point = {
    //       x: source.x,
    //       y: source.y + (target.y - source.y) * 0.5,
    //     };

    //     const controlPoint2: Point = {
    //       x: target.x,
    //       y: target.y - (target.y - source.y) * 0.5,
    //     };

    //     const pathData = `M ${source.x},${source.y}
    //                       C ${controlPoint1.x},${controlPoint1.y}
    //                         ${controlPoint2.x},${controlPoint2.y}
    //                         ${target.x},${target.y}`;

    //     const path = svg
    //       .append("path")
    //       .attr("class", "relu-2-layer-path")
    //       .attr("d", pathData)
    //       .attr("fill", "none")
    //       .attr("stroke", "#ef4444")
    //       .attr("stroke-width", 2)
    //       .attr("stroke-dasharray", "5,5")
    //       .attr("opacity", 0.6);

    //     const pathNode = path.node() as SVGPathElement;
    //     const pathLength = pathNode.getTotalLength();

    //     const circle = svg
    //       .append("circle")
    //       .attr("class", "relu-2-layer-circle")
    //       .attr("r", 4)
    //       .attr("fill", "#ef4444")
    //       .attr("opacity", 1);

    //     const animate = () => {
    //       circle
    //         .transition()
    //         .duration(2000 + Math.random() * 1000)
    //         .ease(d3.easeLinear)
    //         .attrTween("transform", () => (t: number) => {
    //           const point = pathNode.getPointAtLength(t * pathLength);
    //           return `translate(${point.x}, ${point.y})`;
    //         })
    //         .on("end", animate);
    //     };

    //     setTimeout(() => animate(), index * 200);
    //   });
    // };

    const timer = setTimeout(drawReluConnections, 200);
    const resizeObserver = new ResizeObserver(() =>
      drawReluConnections(
        svgRef,
        containerRef,
        images,
        parentBoxRefs,
        childBoxRefs,
        path_class_name,
        circle_class_name
      )
    );

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    window.addEventListener("resize", () => {
      drawReluConnections(
        svgRef,
        containerRef,
        images,
        parentBoxRefs,
        childBoxRefs,
        path_class_name,
        circle_class_name
      );
    });

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", () => {
        drawReluConnections(
          svgRef,
          containerRef,
          images,
          parentBoxRefs,
          childBoxRefs,
          path_class_name,
          circle_class_name
        );
      });
    };
  }, [images, parentBoxRefs, childBoxRefs, svgRef, containerRef]);

  const svgRef_ = useRef<SVGSVGElement>(null);
  const containerRef_ = useRef<HTMLDivElement>(null);
  const convLayerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const MaxLayerRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <div
      ref={containerRef_}
      className="relative flex flex-col   gap-6 justify-center
      items-center mt-24"
    >
      <svg
        ref={svgRef_}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <div className="flex gap-6 justify-center items-center z-10 flex-wrap">
        {images.map((image, i) => (
          <div
            key={i}
            className="flex flex-col items-center rounded-2xl relative z-10"
          >
            <img
              ref={(el) => {
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
      <div>
        <FirstMaxPoolLayer
          circle_class_name=".max-layer-circle"
          path_class_name=".max-layer-path"
          containerRef={containerRef_}
          parentBoxRefs={convLayerRefs}
          childBoxRefs={MaxLayerRefs}
          images={images}
          svgRef={svgRef_}
        />
      </div>
    </div>
  );
};

export { FirstReluLayer, SecondReluLayer };
