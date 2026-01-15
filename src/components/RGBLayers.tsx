import { useRef } from "react";
import { ConvLayerComp } from "./ConvLayer";
import { ReluLayerComp } from "./ReluLayer";
import { MaxPoolLayer } from "./MaxPool";
import { ResultantLayerComp } from "./ResultantLayerComp";
import { DropOutLayer } from "./DropoutLayer";
export interface LayersProps {
  setModelpopUpHandler: (mode?: string, src?: string[], dest?: string) => void;
  input_shape: [number, number, number];
  animation: boolean;
  svgRef: React.RefObject<SVGSVGElement | null>;
  parentBoxRefs: React.RefObject<(HTMLDivElement | null)[]>;
  images: string[][];
  childBoxRefs: React.RefObject<(HTMLDivElement | null)[]>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}
export interface ResultantLayersProps {
  input_shape: [number, number, number];
  animation: boolean;
  svgRef: React.RefObject<SVGSVGElement | null>;
  parentBoxRefs: React.RefObject<(HTMLDivElement | null)[]>;
  results: string[][];
  childBoxRefs: React.RefObject<(HTMLDivElement | null)[]>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}
const FirstConvLayer = ({
  input_shape,
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
      input_shape={input_shape}
      setModelpopUpHandler={(
        mode?: string,
        first?: string[],
        next?: string
      ) => {
        setModelpopUpHandler(mode, first, next);
      }}
      label={"Feature Map"}
      index={2}
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
  input_shape,
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
      input_shape={input_shape}
      setModelpopUpHandler={(
        mode?: string,
        first?: string[],
        next?: string
      ) => {
        setModelpopUpHandler(mode, first, next);
      }}
      label={"Relu"}
      index={3}
      animation={animation}
      circle_class_name="relu-layer-circle"
      path_class_name="relu-layer-path"
      containerRef={containerRef}
      parentBoxRefs={parentBoxRefs}
      childBoxRefs={childBoxRefs}
      images={images}
      svgRef={svgRef}
      nextLayer={true}
      NextConvLayer={FirstDropoutLayer}
    />
  );
};

const FirstDropoutLayer = ({
  input_shape,
  setModelpopUpHandler,
  animation,
  svgRef,
  parentBoxRefs,
  images,
  childBoxRefs,
  containerRef,
}: LayersProps) => {
  return (
    <DropOutLayer
      input_shape={input_shape}
      setModelpopUpHandler={(
        mode?: string,
        first?: string[],
        next?: string
      ) => {
        setModelpopUpHandler(mode, first, next);
      }}
      label={"Dropout"}
      index={3}
      animation={animation}
      circle_class_name="dropout-layer-circle"
      path_class_name="dropout-layer-path"
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
  input_shape,
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
      input_shape={input_shape}
      setModelpopUpHandler={(
        mode?: string,
        first?: string[],
        next?: string
      ) => {
        setModelpopUpHandler(mode, first, next);
      }}
      label={"Feature Map"}
      index={4}
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
  input_shape,
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
      input_shape={input_shape}
      setModelpopUpHandler={(
        mode?: string,
        first?: string[],
        next?: string
      ) => {
        setModelpopUpHandler(mode, first, next);
      }}
      label={"Relu"}
      index={5}
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
  input_shape,
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
      input_shape={input_shape}
      setModelpopUpHandler={(
        mode?: string,
        first?: string[],
        next?: string
      ) => {
        setModelpopUpHandler(mode, first, next);
      }}
      label={"Max Pool"}
      index={6}
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
  input_shape,
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
      input_shape={input_shape}
      setModelpopUpHandler={(
        mode?: string,
        first?: string[],
        next?: string
      ) => {
        setModelpopUpHandler(mode, first, next);
      }}
      label={"Feature Map"}
      index={7}
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
  input_shape,
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
      input_shape={input_shape}
      setModelpopUpHandler={(
        mode?: string,
        first?: string[],
        next?: string
      ) => {
        setModelpopUpHandler(mode, first, next);
      }}
      label={"Relu"}
      index={8}
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
  input_shape,
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
      input_shape={input_shape}
      setModelpopUpHandler={(
        mode?: string,
        first?: string[],
        next?: string
      ) => {
        setModelpopUpHandler(mode, first, next);
      }}
      label={"Feature Map"}
      index={9}
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
  input_shape,
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
      input_shape={input_shape}
      setModelpopUpHandler={(
        mode?: string,
        first?: string[],
        next?: string
      ) => {
        setModelpopUpHandler(mode, first, next);
      }}
      label={"Relu"}
      index={10}
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
  input_shape,
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
      input_shape={input_shape}
      setModelpopUpHandler={(
        mode?: string,
        first?: string[],
        next?: string
      ) => {
        setModelpopUpHandler(mode, first, next);
      }}
      label={"Max Pool"}
      index={11}
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
  input_shape,
  animation,
  svgRef,
  parentBoxRefs,
  results,
  childBoxRefs,
  containerRef,
}: ResultantLayersProps) => {
  return (
    <ResultantLayerComp
      input_shape={input_shape}
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
  setInputShape: React.Dispatch<React.SetStateAction<[number, number, number]>>;
  setModelpopUpHandler: (mode?: string, src?: string[], dest?: string) => void;
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
  const width = 224;
  const height = 224;
  const channels_num = 3;
  return (
    <div ref={containerRef} className="relative w-full">
      <svg
        ref={svgRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />
      <div className=" text-center">Input image shape (224,224,3)</div>
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
              {channel.src && typeof channel.src === "string" ? (
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
          input_shape={[height, width, channels_num]}
          setModelpopUpHandler={(
            mode?: string,
            first?: string[],
            next?: string
          ) => {
            setModelpopUpHandler(mode, first, next);
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
