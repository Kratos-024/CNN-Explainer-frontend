import { useEffect, useRef } from "react";
import { type ReluCompProp } from "./ReluLayer";
import * as d3 from "d3";
import type { Point } from "./layers";
export const drawDropoutConnections = (
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
      let path;
      //@ts-ignore
      if (index === 0 && _image === Math.max(...images[index])) {
        path = svg
          .append("path")
          .attr("class", path_class_name)
          .attr("d", pathData)
          .attr("fill", "none")
          .attr("stroke", "#00FF00")
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "3,3")
          .attr("opacity", 1);
      } else {
        path = svg
          .append("path")
          .attr("class", path_class_name)
          .attr("d", pathData)
          .attr("fill", "none")
          .attr("stroke", "#cbd5e1")
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "3,3")
          .attr("opacity", 1);
      }
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

const DropOutLayer = ({
  setModelpopUpHandler,

  index,
  images,
  childBoxRefs,
  parentBoxRefs,
  svgRef,
  containerRef,
  path_class_name,
  circle_class_name,
  nextLayer,
  NextConvLayer,
  NextMaxPoolLayer,
  animation,
}: ReluCompProp) => {
  useEffect(() => {
    const drawConnect = () => {
      return drawDropoutConnections(
        index,
        (animation = animation),
        svgRef,
        containerRef,
        images,
        parentBoxRefs,
        childBoxRefs,
        path_class_name,
        circle_class_name
      );
    };
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
  const nextLayerBoxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const localBoxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const NCL = NextConvLayer;
  const NMPL = NextMaxPoolLayer;
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
        <div
          onClick={() => {
            setModelpopUpHandler(
              "dropout",
              images[index - 1],
              images[index][1]
            );
          }}
          className="flex  cursor-pointer flex-col items-center rounded-2xl relative z-10"
        >
          <div
            ref={(el) => {
              if (childBoxRefs.current) {
                childBoxRefs.current[0] = el;
              }
              localBoxRefs.current[0] = el;
            }}
            className="w-24 h-24 rounded-2xl border-2 border-dashed border-red-400 p-1 bg-white"
          >
            {" "}
          </div>

          <div className="text-center mt-1 text-xs text-gray-500">Dropout</div>
        </div>
      </div>
      <div className=" mt-16">
        {nextLayer && NCL && (
          <NCL
            setModelpopUpHandler={setModelpopUpHandler}
            animation={animation}
            images={images}
            containerRef={containerRef_}
            svgRef={svgRef_}
            parentBoxRefs={localBoxRefs}
            childBoxRefs={nextLayerBoxRefs}
          />
        )}
        {nextLayer && NMPL && (
          <NMPL
            setModelpopUpHandler={setModelpopUpHandler}
            animation={animation}
            images={images}
            containerRef={containerRef_}
            svgRef={svgRef_}
            parentBoxRefs={localBoxRefs}
            childBoxRefs={nextLayerBoxRefs}
          />
        )}
      </div>
    </div>
  );
};

export { DropOutLayer };
