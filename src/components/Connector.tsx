import * as d3 from "d3";
import { useEffect, useRef } from "react";

const Connector = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const box1Ref = useRef<HTMLDivElement | null>(null);
  const box2Ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    const box1Rect = box1Ref.current?.getBoundingClientRect();
    const box2Rect = box2Ref.current?.getBoundingClientRect();
    const x1 =
      box1Rect && containerRect
        ? box1Rect?.left + box1Rect?.width / 2 - containerRect?.left
        : 0;
    const y1 =
      box1Rect && containerRect ? box1Rect?.bottom - containerRect?.top : 0;
    const x2 =
      box2Rect && containerRect
        ? box2Rect?.left + box2Rect?.width / 2 - containerRect?.left
        : 0;
    const y2 =
      box2Rect && containerRect ? box2Rect?.top - containerRect?.top : 0;

    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove();
    const controlPoint1 = {
      x: x1,
      y: y1 + (y2 - y1) * 0.5,
    };
    const controlPoint2 = {
      x: x2,
      y: y2 - (y2 - y1) * 0.5,
    };
    const pathData = `M ${x1},${y1} C ${controlPoint1.x},${controlPoint1.y} ${controlPoint2.x},${controlPoint2.y} ${x2},${y2}`;
    const path = svg
      .append("path")
      .attr("d", pathData)
      .attr("fill", "none")
      .attr("stroke", "#cbd5e1") // Light Gray
      .attr("stroke-width", "4"); // Thinner
    const pathNode = path.node();
    // const totalLength = pathNode?.getTotalLength();
    const circle = svg.append("circle").attr("r", "5");
    const translateAlong = (pathElement: SVGPathElement) => {
      const l = pathElement.getTotalLength();
      return () => {
        return (t: number) => {
          const p = pathElement.getPointAtLength(t * l);
          return `translate(${p.x},${p.y})`;
        };
      };
    };

    if (pathNode) {
      const animate = () => {
        circle
          .transition()
          .duration(2000)
          .ease(d3.easeLinear)
          .attr("fill", "blue")
          .attrTween("transform", translateAlong(pathNode))
          .on("end", animate);
      };
      animate();
    }
  }, []);
  return (
    <div
      className=" relative bg-red-500 max-lg:w-225 max-md:w-180  h-screen w-225 space-y-74.5 mx-auto"
      ref={containerRef}
    >
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        ref={svgRef}
      ></svg>
      <div className="bg-red-200 w-40 h-40 mx-auto" ref={box1Ref}>
        fd
      </div>
      <div className="bg-red-200 w-40 h-40 mx-auto" ref={box2Ref}>
        fd
      </div>
    </div>
  );
};

export default Connector;

// import * as d3 from "d3";
// import { useEffect, useRef } from "react";

// const Connector = () => {
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const svgRef = useRef<SVGSVGElement | null>(null);
//   const box1Ref = useRef<HTMLDivElement | null>(null);
//   const box2Ref = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const containerRect = containerRef.current?.getBoundingClientRect();
//     const box1Rect = box1Ref.current?.getBoundingClientRect();
//     const box2Rect = box2Ref.current?.getBoundingClientRect();

//     if (!containerRect || !box1Rect || !box2Rect) return;

//     const x1 = box1Rect.left + box1Rect.width / 2 - containerRect.left;
//     const y1 = box1Rect.bottom - containerRect.top;

//     const x2 = box2Rect.left + box2Rect.width / 2 - containerRect.left;
//     const y2 = box2Rect.top - containerRect.top;

//     console.log("Start Point:", x1, y1);
//     console.log("End Point:", x2, y2);

//     const svg = d3.select(svgRef.current);
//     svg.selectAll("*").remove();

//     svg
//       .append("line")
//       .attr("x1", x1)
//       .attr("y1", y1)
//       .attr("x2", x2)
//       .attr("y2", y2)
//       .attr("stroke", "black");
//   }, []);

//   return (
//     <div
//       className="relative bg-red-500 h-screen w-full flex flex-col items-center gap-24 py-10"
//       ref={containerRef}
//     >
//       <svg
//         ref={svgRef}
//         className="absolute top-0 left-0 w-full h-full pointer-events-none"
//         style={{ zIndex: 10 }}
//       />

//       <div ref={box1Ref} className="bg-red-200 w-40 h-40 z-20">
//         Box 1
//       </div>

//       <div ref={box2Ref} className="bg-red-200 w-40 h-40 z-20">
//         Box 2
//       </div>
//     </div>
//   );
// };

// export default Connector;
