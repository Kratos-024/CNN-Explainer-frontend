import { useRef } from "react";
import { ConvLayerComp } from "./ConvLayer";
import { ReluLayerComp } from "./ReluLayer";
import { MaxPoolLayer } from "./MaxPool";
import { ResultantLayerComp } from "./ResultantLayerComp";
export interface LayersProps {
  animation: boolean;
  svgRef: React.RefObject<SVGSVGElement | null>;
  parentBoxRefs: React.RefObject<(HTMLDivElement | null)[]>;
  images: { label: string; srcImg: string }[];
  childBoxRefs: React.RefObject<(HTMLDivElement | null)[]>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}
export interface ResultantLayersProps {
  animation: boolean;
  svgRef: React.RefObject<SVGSVGElement | null>;
  parentBoxRefs: React.RefObject<(HTMLDivElement | null)[]>;
  results: { text: string }[];
  childBoxRefs: React.RefObject<(HTMLDivElement | null)[]>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}
const FirstConvLayer = ({
  animation,
  svgRef,
  parentBoxRefs,
  images,
  childBoxRefs,
  containerRef,
}: LayersProps) => {
  return (
    <ConvLayerComp
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
  animation,
  svgRef,
  parentBoxRefs,
  images,
  childBoxRefs,
  containerRef,
}: LayersProps) => {
  return (
    <ReluLayerComp
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
  animation,
  svgRef,
  parentBoxRefs,
  images,
  childBoxRefs,
  containerRef,
}: LayersProps) => {
  return (
    <ConvLayerComp
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
  animation,
  svgRef,
  parentBoxRefs,
  images,
  childBoxRefs,
  containerRef,
}: LayersProps) => {
  return (
    <ReluLayerComp
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
  animation,
  svgRef,
  parentBoxRefs,
  images,
  childBoxRefs,
  containerRef,
}: LayersProps) => {
  return (
    <MaxPoolLayer
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
  animation,
  svgRef,
  parentBoxRefs,
  images,
  childBoxRefs,
  containerRef,
}: LayersProps) => {
  return (
    <ConvLayerComp
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
  animation,
  svgRef,
  parentBoxRefs,
  images,
  childBoxRefs,
  containerRef,
}: LayersProps) => {
  return (
    <ReluLayerComp
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
  animation,
  svgRef,
  parentBoxRefs,
  images,
  childBoxRefs,
  containerRef,
}: LayersProps) => {
  return (
    <ConvLayerComp
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
  animation,
  svgRef,
  parentBoxRefs,
  images,
  childBoxRefs,
  containerRef,
}: LayersProps) => {
  return (
    <ReluLayerComp
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
  animation,
  svgRef,
  parentBoxRefs,
  images,
  childBoxRefs,
  containerRef,
}: LayersProps) => {
  return (
    <MaxPoolLayer
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
  animation: boolean;
  featImages: string[];
  images: {
    ImageR: string;
    ImageG: string;
    ImageB: string;
  };
  boxRefs: React.RefObject<(HTMLDivElement | null)[]>;
}
const RGBLayers = ({
  animation,
  featImages,
  images,
  boxRefs,
}: RGBLayersProps) => {
  const channels = [
    { src: images.ImageR, label: "Red Channel", color: "border-red-300" },
    { src: images.ImageG, label: "Green Channel", color: "border-green-300" },
    { src: images.ImageB, label: "Blue Channel", color: "border-blue-300" },
  ];

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const childBoxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const grandChildren = Array(featImages.length)
    .fill(null)
    .map((_, i) => ({
      srcImg: featImages[i],
      label: `Feature Map ${i + 1}`,
    }));

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
          animation={animation}
          images={grandChildren}
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
