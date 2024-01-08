import React from "react";

const Line = ({
  data,
  x1Accessor = (d) => d.source.x,
  y1Accessor = (d) => d.source.y,
  x2Accessor = (d) => d.target.x,
  y2Accessor = (d) => d.target.y,
  keyAccessor,
  ...props
}) => {
  return (
    <>
      {data.map((d, i) => (
        <line
          id={d.source.productId + " " + d.target.productId}
          key={keyAccessor(d, i)}
          
          strokeWidth={1}
          x1={x1Accessor(d, i)}
          y1={y1Accessor(d, i)}
          x2={x2Accessor(d, i)}
          y2={y2Accessor(d, i)}
          {...props}
        ></line>
      ))}
    </>
  );
};

export default Line;
