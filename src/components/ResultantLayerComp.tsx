import React, { useEffect } from "react";
import { drawConnections } from "./ConvLayer";

const ResultantLayerComp = ({
  input_shape,
  animation,
  circle_class_name,
  results,
  childBoxRefs,
  parentBoxRefs,
  svgRef,
  containerRef,
  path_class_name,
}: {
  input_shape: [number, number, number];
  animation: boolean;
  circle_class_name: string;
  childBoxRefs: React.RefObject<(HTMLDivElement | null)[]>;
  parentBoxRefs: React.RefObject<(HTMLDivElement | null)[]>;
  svgRef: React.RefObject<SVGSVGElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  results: string[][];
  path_class_name: string;
}) => {
  const classes = [
    ["glacier", "sea", "street", "forest", "buildings", "mountain"],
  ];
  //@ts-ignore
  let resultProb = results[1].replace(/'/g, "");
  resultProb = JSON.parse(resultProb);
  resultProb = resultProb[0].map((num: number) => Number(num.toFixed(2)));
  resultProb = [resultProb];
  const index = 0;
  const drawConnect = () => {
    return drawConnections(
      index,
      animation,
      svgRef,
      containerRef,
      resultProb,
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
  }, [classes, parentBoxRefs, childBoxRefs, svgRef, containerRef]);

  return (
    <div className="relative flex flex-col items-center mt-24 w-full">
      <div className="flex z-50 gap-8 flex-wrap justify-center">
        {classes[0].map((class_, i) => (
          <div
            key={i}
            ref={(el) => {
              childBoxRefs.current[i] = el;
            }}
          >
            <p className=" text-black text-[24px] ">
              {class_.charAt(0).toUpperCase() + class_.slice(1)}
            </p>
            <p className=" text-center  text-[11px] opacity-50">
              {Number(100 * resultProb[0][i].toFixed(2))}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
export { ResultantLayerComp };
