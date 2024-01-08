import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

import { debounce } from "../../utils/chartUtils";

const Tooltip = ({
  data,
  linkData,
  dimensions,
  radius,
  transitionTime = 1000,
}) => {
  const tooltipRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [quadtree, setQuadtree] = useState(null);

  const [highlightedLines, setHighlightedLines] = useState([]);
  const [highlightedCircleId, setHighlightedCircles] = useState([]);
  // Initialize quadtree and tooltip
  useEffect(() => {
    setQuadtree(
      d3
        .quadtree()
        .x((d) => d.x)
        .y((d) => d.y)
        .addAll(data)
    );

    setTooltip(
      d3
        .select(tooltipRef.current)
        .append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background", "white")
        .style("border", "1px solid #CCCCCC")
        .style("border-radius", "3px")
        .style("padding", "10px")
        .text("tooltip")
    );
  }, [data]);

  const styles = {
    inset: `${dimensions.marginTop}px ${dimensions.marginRight}px ${dimensions.marginBottom}px ${dimensions.marginLeft}px`,
  };
  const highlightStyle = { stroke: "red", strokeWidth: 3 };
  const defaultStyle = { stroke: "#CCCCCC", strokeWidth: 1 };
  function handleMouseOut(event) {
    tooltip.style("visibility", "hidden");

    d3.selectAll(highlightedLines)
      .transition()
      .duration(transitionTime)
      .style("stroke", defaultStyle.stroke)
      .style("stroke-width", defaultStyle.strokeWidth);

    d3.selectAll(highlightedCircleId.map((id) => `circle#${id}`).join(", "))
      .transition()
      .duration(transitionTime)
      .style("stroke", defaultStyle.stroke)
      .style("stroke-width", defaultStyle.strokeWidth);
  }
  function handleMouseMove(event) {
    if (quadtree._x0 && tooltip) {
      const [mx, my] = d3.pointer(event, tooltipRef.current);

      const closest = quadtree.find(mx, my, radius);

      if (closest) {
        // Hightlight
        d3.select(`#${closest.productId}`)
          .transition()
          .duration(transitionTime)
          .style("stroke", highlightStyle.stroke)
          .style("stroke-width", highlightStyle.strokeWidth);

        // Highlight connected links and adjacent nodes

        let lines = d3.selectAll("line[id*='" + `${closest.productId}` + "']");
        setHighlightedLines(lines);
        lines
          .transition()
          .duration(transitionTime)
          .style("stroke", highlightStyle.stroke);

        const circleIds = lines
          .nodes()
          .map((line) => {
            let lineId = d3.select(line).attr("id");

            let relatedCircleId1 = lineId.split(" ")[0];
            let relatedCircleId2 = lineId.split(" ")[1];
            return [relatedCircleId1, relatedCircleId2];
          })
          .flat();
        setHighlightedCircles(circleIds);

        d3.selectAll(
          circleIds
            .filter((id) => id !== closest.productId)
            .map((id) => `circle#${id}`)
            .join(", ")
        )
          .transition()
          .duration(transitionTime)
          .style("stroke", highlightStyle.stroke)
          .style("stroke-width", highlightStyle.strokeWidth);

        // Tooltip
        const parentRect = tooltipRef.current.getBoundingClientRect();

        tooltip
          .style("visibility", "visible")
          .style("top", `${event.clientY - parentRect.top - 20}px`)
          .style("left", `${event.clientX - parentRect.left}px`)
          .style("transform", "translate(-50%,-100%)")
          .html(
            `${closest.productName} (${closest.productCode}) <br> ${closest.productId}`
          );
      }
    }
  }

  return (
    <div
      ref={tooltipRef}
      style={styles}
      className="absolute"
      onMouseMove={debounce(handleMouseMove, 50)}
      onMouseOut={handleMouseOut}
    >
      {/* Optional: Any static or dynamic content */}
    </div>
  );
};

export default Tooltip;
