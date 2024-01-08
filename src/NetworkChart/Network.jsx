// import PropTypes from "prop-types";
import * as d3 from "d3";

import Lines from "./components/Lines";
import Circles from "./components/Circles";
import Chart from "./components/Chart";
import { useChartDimensions } from "../utils/chartUtils";
import Tooltip from "./components/Tooltip";
// color scale
const hs92ColorsMap = new Map([
  ["product-HS92-1", "rgb(125, 218, 161)"],
  ["product-HS92-2", "#F5CF23"],
  ["product-HS92-3", "rgb(218, 180, 125)"],
  ["product-HS92-4", "rgb(187, 150, 138)"],
  ["product-HS92-5", "rgb(217, 123, 123)"],
  ["product-HS92-6", "rgb(197, 123, 217)"],
  ["product-HS92-7", "rgb(141, 123, 216)"],
  ["product-HS92-8", "rgb(123, 162, 217)"],
  ["product-HS92-9", "rgb(125, 218, 218)"],
  ["product-HS92-10", "#2a607c"],
  ["product-HS92-14", "rgb(178, 61, 109)"],
]);
const colorScale = d3
  .scaleOrdinal()
  .domain(Array.from(hs92ColorsMap.keys())) // Get the keys from the map
  .range(Array.from(hs92ColorsMap.values())); // Get the values from the map

const Network = ({ data, xAccessor = (d) => d.x, yAccessor = (d) => d.y }) => {
  const [ref, dimensions] = useChartDimensions({
    marginTop: 100,
    marginBottom: 120,
    marginLeft: 0,
    marginRight: 0,
  });

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data.nodes, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data.nodes, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice();
  data.nodes.forEach((d) => {
    d.x = xScale(d.x);
    d.y = yScale(d.y);
    d.color = colorScale(d.productSector);
  });
  const keyAccessorNode = (d, i) => d.productId;
  const keyAccessorLink = (d, i) => i;
  const colorAccessorNode = (d, i) => d.color;

  const radius = 5
  return (
    <div className="w-full h-full relative" ref={ref}>
      <Chart dimensions={dimensions}>
        <Lines
          data={data.links}
          keyAccessor={keyAccessorLink}
          stroke={"#CCCCCC"}
        ></Lines>
        <Circles
          data={data.nodes}
          radius={radius}
          keyAccessor={keyAccessorNode}
          colorAccessor={colorAccessorNode}
          stroke="#CCCCCC"
          strokeWidth={1}
        ></Circles>
      </Chart>
      <Tooltip data={data.nodes} linkData={data.links} dimensions={dimensions} radius={radius} transitionTime={500}></Tooltip>
    </div>
  );
};

// Network.propTypes = {
//   xAccessor: accessorPropsType,
//   yAccessor: accessorPropsType,
//   xLabel: PropTypes.string,
//   yLabel: PropTypes.string,
// };

// Network.defaultProps = {
//   xAccessor: (d) => d.x,
//   yAccessor: (d) => d.y,
// };
export default Network;
