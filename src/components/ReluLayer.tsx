import { useEffect, useRef } from "react";
import type { LayersProps, ResultantLayersProps } from "./RGBLayers";
import { drawReluConnections } from "./Connection";
export interface LayerCompProp {
  input_shape: [number, number, number];
  relu?: boolean;
  setModelpopUpHandler: (
    mode?: string,
    src?: string[],
    dest?: string,
    input_shape?: [number, number, number]
  ) => void;
  label: string;
  index: number;
  animation: boolean;
  childBoxRefs: React.RefObject<(HTMLDivElement | null)[]>;
  parentBoxRefs: React.RefObject<(HTMLDivElement | null)[]>;
  svgRef: React.RefObject<SVGSVGElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  images: string[][];
  path_class_name: string;
  circle_class_name: string;
  nextLayer?: boolean;
  ReluLayer?: React.ComponentType<LayersProps>;
  NextConvLayer?: React.ComponentType<LayersProps>;
  NextMaxPoolLayer?: React.ComponentType<LayersProps>;
  ThirdConvLayer?: React.ComponentType<LayersProps>;
  ResultantLayer?: React.ComponentType<ResultantLayersProps>;
}

const ReluLayerComp = ({
  input_shape,
  setModelpopUpHandler,
  label,
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
}: LayerCompProp) => {
  useEffect(() => {
    const drawConnect = () => {
      return drawReluConnections(
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

  const outputWidth = Math.floor(input_shape[1]);
  const outputHeight = Math.floor(input_shape[0]);
  const nextInputShape: [number, number, number] = [
    outputHeight,
    outputWidth,
    input_shape[2],
  ];
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
      <div className=" text-center">
        Input image shape ({outputHeight},{outputWidth},3)
      </div>
      <div className="flex gap-6 justify-center items-center z-10 flex-wrap">
        {images[index].map((image, i) => (
          <div
            onClick={() => {
              setModelpopUpHandler("relu", images[index - 1], image);
            }}
            key={i}
            className="flex  cursor-pointer flex-col items-center rounded-2xl relative z-10"
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
              ReLU {i + 1}
            </div>
          </div>
        ))}
      </div>
      <div className=" mt-16">
        {nextLayer && NCL && (
          <NCL
            input_shape={nextInputShape}
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
            input_shape={nextInputShape}
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

export { ReluLayerComp };
