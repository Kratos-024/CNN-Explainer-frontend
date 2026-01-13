import { useRef } from "react";
import { ConvLayerComp } from "./ConvLayer";
import { ReluLayerComp } from "./ReluLayer";
import { MaxPoolLayer } from "./MaxPool";
import { ResultantLayerComp } from "./ResultantLayerComp";
export interface LayersProps {
  setModelpopUpHandler: (src: string[], dest: string) => void;

  animation: boolean;
  svgRef: React.RefObject<SVGSVGElement | null>;
  parentBoxRefs: React.RefObject<(HTMLDivElement | null)[]>;
  images: string[][];
  childBoxRefs: React.RefObject<(HTMLDivElement | null)[]>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}
export interface ResultantLayersProps {
  animation: boolean;
  svgRef: React.RefObject<SVGSVGElement | null>;
  parentBoxRefs: React.RefObject<(HTMLDivElement | null)[]>;
  results: string[][];
  childBoxRefs: React.RefObject<(HTMLDivElement | null)[]>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}
const FirstConvLayer = ({
  setModelpopUpHandler,
  animation,
  svgRef,
  parentBoxRefs,
  images,
  childBoxRefs,
  containerRef,
}: LayersProps) => {
  return (
    <ConvLayerComp
      setModelpopUpHandler={(first: string[], next: string) => {
        setModelpopUpHandler(first, next);
      }}
      label={"Feature Map"}
      index={1}
      animation={animation}
      images={images}
      childBoxRefs={childBoxRefs}
      parentBoxRefs={parentBoxRefs}
      svgRef={svgRef}
      containerRef={containerRef}
      path_class_name="first_conv_path"
      circle_class_name="first_conv_circle"
      relu={true}
      ReluLayer={FirstReluLayer}
    />
  );
};

const FirstReluLayer = ({
  setModelpopUpHandler,
  animation,
  svgRef,
  parentBoxRefs,
  images,
  childBoxRefs,
  containerRef,
}: LayersProps) => {
  return (
    <ReluLayerComp
      setModelpopUpHandler={(first: string[], next: string) => {
        setModelpopUpHandler(first, next);
      }}
      label={"Relu"}
      index={2}
      animation={animation}
      circle_class_name="relu-layer-circle"
      path_class_name="relu-layer-path"
      containerRef={containerRef}
      parentBoxRefs={parentBoxRefs}
      childBoxRefs={childBoxRefs}
      images={images}
      svgRef={svgRef}
      nextLayer={true}
      NextConvLayer={SecondConvLayer}
    />
  );
};

const SecondConvLayer = ({
  setModelpopUpHandler,
  animation,
  svgRef,
  parentBoxRefs,
  images,
  childBoxRefs,
  containerRef,
}: LayersProps) => {
  return (
    <ConvLayerComp
      setModelpopUpHandler={(first: string[], next: string) => {
        setModelpopUpHandler(first, next);
      }}
      label={"Feature Map"}
      index={3}
      animation={animation}
      path_class_name="secondConv-layer-path"
      circle_class_name="secondConv-layer-circle"
      images={images}
      childBoxRefs={childBoxRefs}
      parentBoxRefs={parentBoxRefs}
      svgRef={svgRef}
      containerRef={containerRef}
      relu={true}
      ReluLayer={SecondReluLayer}
    />
  );
};

const SecondReluLayer = ({
  setModelpopUpHandler,
  animation,
  svgRef,
  parentBoxRefs,
  images,
  childBoxRefs,
  containerRef,
}: LayersProps) => {
  return (
    <ReluLayerComp
      setModelpopUpHandler={(first: string[], next: string) => {
        setModelpopUpHandler(first, next);
      }}
      label={"Relu"}
      index={4}
      animation={animation}
      circle_class_name="relu-layer-circle"
      path_class_name="relu-layer-path"
      containerRef={containerRef}
      parentBoxRefs={parentBoxRefs}
      childBoxRefs={childBoxRefs}
      images={images}
      svgRef={svgRef}
      nextLayer={true}
      NextMaxPoolLayer={FirstMaxPoolLayer}
    />
  );
};

const FirstMaxPoolLayer = ({
  setModelpopUpHandler,
  animation,
  svgRef,
  parentBoxRefs,
  images,
  childBoxRefs,
  containerRef,
}: LayersProps) => {
  return (
    <MaxPoolLayer
      setModelpopUpHandler={(first: string[], next: string) => {
        setModelpopUpHandler(first, next);
      }}
      label={"Max Pool"}
      index={5}
      animation={animation}
      circle_class_name="max-layer-circle"
      path_class_name="max-layer-path"
      containerRef={containerRef}
      parentBoxRefs={parentBoxRefs}
      childBoxRefs={childBoxRefs}
      images={images}
      svgRef={svgRef}
      nextLayer={true}
      ThirdConvLayer={ThirdConvLayer}
    />
  );
};

const ThirdConvLayer = ({
  setModelpopUpHandler,
  animation,
  svgRef,
  parentBoxRefs,
  images,
  childBoxRefs,
  containerRef,
}: LayersProps) => {
  return (
    <ConvLayerComp
      setModelpopUpHandler={(first: string[], next: string) => {
        setModelpopUpHandler(first, next);
      }}
      label={"Feature Map"}
      index={6}
      animation={animation}
      path_class_name="thirdConv-layer-path"
      circle_class_name="thirdConv-layer-circle"
      images={images}
      childBoxRefs={childBoxRefs}
      parentBoxRefs={parentBoxRefs}
      svgRef={svgRef}
      containerRef={containerRef}
      relu={true}
      ReluLayer={ThirdReluLayer}
    />
  );
};
const ThirdReluLayer = ({
  setModelpopUpHandler,
  animation,
  svgRef,
  parentBoxRefs,
  images,
  childBoxRefs,
  containerRef,
}: LayersProps) => {
  return (
    <ReluLayerComp
      setModelpopUpHandler={(first: string[], next: string) => {
        setModelpopUpHandler(first, next);
      }}
      label={"Relu"}
      index={7}
      animation={animation}
      circle_class_name="relu-layer-circle"
      path_class_name="relu-layer-path"
      containerRef={containerRef}
      parentBoxRefs={parentBoxRefs}
      childBoxRefs={childBoxRefs}
      images={images}
      svgRef={svgRef}
      nextLayer={true}
      NextConvLayer={FourthConvLayer}
    />
  );
};

const FourthConvLayer = ({
  setModelpopUpHandler,
  animation,
  svgRef,
  parentBoxRefs,
  images,
  childBoxRefs,
  containerRef,
}: LayersProps) => {
  return (
    <ConvLayerComp
      setModelpopUpHandler={(first: string[], next: string) => {
        setModelpopUpHandler(first, next);
      }}
      label={"Feature Map"}
      index={8}
      animation={animation}
      path_class_name="thirdConv-layer-path"
      circle_class_name="thirdConv-layer-circle"
      images={images}
      childBoxRefs={childBoxRefs}
      parentBoxRefs={parentBoxRefs}
      svgRef={svgRef}
      containerRef={containerRef}
      relu={true}
      ReluLayer={FourthReluLayer}
    />
  );
};
const FourthReluLayer = ({
  setModelpopUpHandler,
  animation,
  svgRef,
  parentBoxRefs,
  images,
  childBoxRefs,
  containerRef,
}: LayersProps) => {
  return (
    <ReluLayerComp
      setModelpopUpHandler={(first: string[], next: string) => {
        setModelpopUpHandler(first, next);
      }}
      label={"Relu"}
      index={9}
      animation={animation}
      circle_class_name="relu-layer-circle"
      path_class_name="relu-layer-path"
      containerRef={containerRef}
      parentBoxRefs={parentBoxRefs}
      childBoxRefs={childBoxRefs}
      images={images}
      svgRef={svgRef}
      nextLayer={true}
      NextConvLayer={SecondMaxPoolLayer}
    />
  );
};
const SecondMaxPoolLayer = ({
  setModelpopUpHandler,
  animation,
  svgRef,
  parentBoxRefs,
  images,
  childBoxRefs,
  containerRef,
}: LayersProps) => {
  return (
    <MaxPoolLayer
      setModelpopUpHandler={(first: string[], next: string) => {
        setModelpopUpHandler(first, next);
      }}
      label={"Max Pool"}
      index={10}
      animation={animation}
      circle_class_name="max-layer-circle"
      path_class_name="max-layer-path"
      containerRef={containerRef}
      parentBoxRefs={parentBoxRefs}
      childBoxRefs={childBoxRefs}
      images={images}
      svgRef={svgRef}
      nextLayer={true}
      ResultantLayer={ResultLayer}
    />
  );
};
const ResultLayer = ({
  animation,
  svgRef,
  parentBoxRefs,
  results,
  childBoxRefs,
  containerRef,
}: ResultantLayersProps) => {
  return (
    <ResultantLayerComp
      animation={animation}
      childBoxRefs={childBoxRefs}
      parentBoxRefs={parentBoxRefs}
      svgRef={svgRef}
      containerRef={containerRef}
      results={results}
      circle_class_name="result-layer-circle"
      path_class_name={"result_class"}
    />
  );
};
interface RGBLayersProps {
  setModelpopUpHandler: (src: string[], dest: string) => void;
  animation: boolean;
  featImages: string[][];

  boxRefs: React.RefObject<(HTMLDivElement | null)[]>;
}
const RGBLayers = ({
  setModelpopUpHandler,
  animation,
  featImages,
  boxRefs,
}: RGBLayersProps) => {
  const channels = [
    { src: featImages[0][0], label: "Red Channel", color: "border-red-300" },
    {
      src: featImages[0][1],
      label: "Green Channel",
      color: "border-green-300",
    },
    { src: featImages[0][2], label: "Blue Channel", color: "border-blue-300" },
  ];

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const childBoxRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <div ref={containerRef} className="relative w-full">
      <svg
        ref={svgRef}
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

      <div>
        <FirstConvLayer
          setModelpopUpHandler={(first: string[], next: string) => {
            setModelpopUpHandler(first, next);
          }}
          animation={animation}
          images={featImages}
          childBoxRefs={childBoxRefs}
          parentBoxRefs={boxRefs}
          svgRef={svgRef}
          containerRef={containerRef}
        />
      </div>
    </div>
  );
};

export default RGBLayers;
