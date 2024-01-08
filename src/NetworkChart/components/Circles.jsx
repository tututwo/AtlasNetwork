import { color } from "d3";
import React from "react";

const Circles = ({
  data,
  keyAccessor,
  xAccessor = (d) => +d.x,
  yAccessor = (d) => +d.y,
  colorAccessor = (d) => d.color,
  radius,
  ...props
}) => (
  <React.Fragment>
    {data.map((d, i) => (
      <circle
      className="hover:cursor-pointer"
        key={keyAccessor(d, i)}
        cx={xAccessor(d, i)}
        cy={yAccessor(d, i)}
        r={typeof radius == "function" ? radius(d) : radius}
        fill={colorAccessor(d, i)}
        id={d.productId}
        {...props}
      />
    ))}
  </React.Fragment>
);

export default Circles;
