import { useEffect, useRef } from "react";
import { drawReluConnections, type ReluCompProp } from "./ReluLayer";

const MaxPoolLayer = ({
  setModelpopUpHandler,
  index,
  label,
  animation,
  images,
  childBoxRefs,
  parentBoxRefs,
  svgRef,
  containerRef,
  path_class_name,
  circle_class_name,
  nextLayer,
  ThirdConvLayer,
  ResultantLayer,
}: ReluCompProp) => {
  useEffect(() => {
    const drawConnect = () => {
      return drawReluConnections(
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
  }, [images, parentBoxRefs, childBoxRefs, svgRef, containerRef]);

  const results = [["glacier", "mountains", "sea"]];

  const svgRef_ = useRef<SVGSVGElement>(null);
  const containerRef_ = useRef<HTMLDivElement>(null);
  const nextLayerBoxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const localBoxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const NCL = ThirdConvLayer;
  const ResultL = ResultantLayer;
  return (
    <div
      ref={containerRef_}
      className="relative flex flex-col  gap-6 justify-center
      items-center mt-24"
    >
      <svg
        ref={svgRef_}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <div className="flex gap-6 justify-center items-center z-10 flex-wrap">
        {images[index].map((image, i) => (
          <div
            key={i}
            onClick={() => {
              setModelpopUpHandler(images[index - 1], image);
            }}
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
              src={image}
              alt={label}
            />

            <div className="text-center mt-1 text-xs text-gray-500">
              MaxPool {i + 1}
            </div>
          </div>
        ))}
      </div>{" "}
      <div className=" mt-16">
        {nextLayer && NCL && (
          <NCL
            setModelpopUpHandler={setModelpopUpHandler}
            animation={animation}
            images={images}
            childBoxRefs={nextLayerBoxRefs}
            parentBoxRefs={localBoxRefs}
            svgRef={svgRef_}
            containerRef={containerRef_}
          />
        )}
      </div>
      <div className=" mt-16">
        {nextLayer && ResultL && (
          <ResultL
            animation={animation}
            results={results}
            childBoxRefs={nextLayerBoxRefs}
            parentBoxRefs={localBoxRefs}
            svgRef={svgRef_}
            containerRef={containerRef_}
          />
        )}
      </div>
    </div>
  );
};
export { MaxPoolLayer };
