import React, { useEffect } from "react";
import { drawConnections } from "./ConvLayer";

const ResultantLayerComp = ({
  animation,
  circle_class_name,
  results,
  childBoxRefs,
  parentBoxRefs,
  svgRef,
  containerRef,
  path_class_name,
}: {
  animation: boolean;
  circle_class_name: string;
  childBoxRefs: React.RefObject<(HTMLDivElement | null)[]>;
  parentBoxRefs: React.RefObject<(HTMLDivElement | null)[]>;
  svgRef: React.RefObject<SVGSVGElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  results: string[][];
  path_class_name: string;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      drawConnections(
        animation,
        svgRef,
        containerRef,
        results,
        parentBoxRefs,
        childBoxRefs,
        path_class_name,
        (circle_class_name = circle_class_name)
      );
    }, 200);
    const resizeObserver = new ResizeObserver(() =>
      drawConnections(
        animation,
        svgRef,
        containerRef,
        results,
        parentBoxRefs,
        childBoxRefs,
        path_class_name,
        (circle_class_name = circle_class_name)
      )
    );

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    window.addEventListener("resize", () => {
      drawConnections(
        animation,
        svgRef,
        containerRef,
        results,
        parentBoxRefs,
        childBoxRefs,
        path_class_name,
        (circle_class_name = circle_class_name)
      );
    });

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", () => {
        drawConnections(
          animation,
          svgRef,
          containerRef,
          results,
          parentBoxRefs,
          childBoxRefs,
          (path_class_name = path_class_name),
          (circle_class_name = circle_class_name)
        );
      });
    };
  }, [results, parentBoxRefs, childBoxRefs, svgRef, containerRef]);

  return (
    <div className="relative flex flex-col items-center mt-24 w-full">
      <div className="flex gap-6 justify-center items-center z-10">
        {results[0].map((result, i) => (
          <div
            key={i}
            ref={(el) => {
              if (childBoxRefs.current) childBoxRefs.current[i] = el; // Destination of RGB
            }}
            className="flex flex-col items-center rounded-2xl bg-white"
          >
            <span className="w-24 h-24 rounded-2xl shadow-sm">{result}</span>
          </div>
        ))}
      </div>{" "}
    </div>
  );
};
export { ResultantLayerComp };
