import { useEffect } from "react";
import { drawReluConnections } from "./ReluLayer";

const FirstMaxPoolLayer = ({
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

  return (
    <div
      className="relative flex flex-col   gap-6 justify-center
      items-center mt-24"
    >
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
      <div className=" mt-16"> </div>
    </div>
  );
};
export { FirstMaxPoolLayer };
