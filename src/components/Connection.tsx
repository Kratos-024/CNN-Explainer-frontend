import * as d3 from "d3";
import type { Point } from "./layers";
export const drawReluConnections = (
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

  images[index].forEach((_image, index) => {
    const childBox = childBoxRefs.current[index];
    const parentBox = parentBoxRefs.current[index];

    if (!childBox || !parentBox) {
      console.warn(`Missing refs for index ${index}`, {
        childBox,
        parentBox,
      });
      return;
    }

    const childRect = childBox.getBoundingClientRect();
    const parentRect = parentBox.getBoundingClientRect();

    const target: Point = {
      x: childRect.left + childRect.width / 2 - containerRect.left,
      y: childRect.top - containerRect.top,
    };

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

    const path = svg
      .append("path")
      .attr("class", path_class_name)
      .attr("d", pathData)
      .attr("fill", "none")
      .attr("stroke", "#ef4444")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5")
      .attr("opacity", 0.6);

    const pathNode = path.node() as SVGPathElement;
    const pathLength = pathNode.getTotalLength();
    if (animation) {
      const circle = svg
        .append("circle")
        .attr("class", circle_class_name)
        .attr("r", 4)
        .attr("fill", "#ef4444")
        .attr("opacity", 1);

      const animate = () => {
        circle
          .transition()
          .duration(2000 + Math.random() * 1000)
          .ease(d3.easeLinear)
          .attrTween("transform", () => (t: number) => {
            const point = pathNode.getPointAtLength(t * pathLength);
            return `translate(${point.x}, ${point.y})`;
          })
          .on("end", animate);
      };

      setTimeout(() => animate(), index * 200);
    }
  });
};
