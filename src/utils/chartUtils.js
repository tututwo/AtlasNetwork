// import PropTypes from 'prop-types'
import { useEffect, useState, useRef } from "react"
import ResizeObserver from "resize-observer-polyfill"

// export const accessorPropsType = (
//   PropTypes.oneOfType([
//     PropTypes.func,
//     PropTypes.number,
//   ])
// )

export const callAccessor = (accessor, d, i) => (
  typeof accessor === "function" ? accessor(d, i) : accessor
)

// export const dimensionsPropsType = (
//   PropTypes.shape({
//     height: PropTypes.number,
//     width: PropTypes.number,
//     marginTop: PropTypes.number,
//     marginRight: PropTypes.number,
//     marginBottom: PropTypes.number,
//     marginLeft: PropTypes.number,
//   })
// )

export const combineChartDimensions = dimensions => {
  let parsedDimensions = {
    marginTop: 100,
    marginBottom: 120,
    marginLeft: 0,
    marginRight: 0,
    ...dimensions,
  }

  return {
    ...parsedDimensions,
    boundedHeight: Math.max(parsedDimensions.height - parsedDimensions.marginTop - parsedDimensions.marginBottom, 0),
    boundedWidth: Math.max(parsedDimensions.width - parsedDimensions.marginLeft - parsedDimensions.marginRight, 0),
  }
}

export const useChartDimensions = passedSettings => {
  const ref = useRef()
  const dimensions = combineChartDimensions(passedSettings)

  const [width, changeWidth] = useState(0)
  const [height, changeHeight] = useState(0)

  useEffect(() => {
    if (dimensions.width && dimensions.height) return [ref, dimensions]

    const element = ref.current
    const resizeObserver = new ResizeObserver(entries => {
      if (!Array.isArray(entries)) return
      if (!entries.length) return

      const entry = entries[0]

      if (width !== entry.contentRect.width) changeWidth(entry.contentRect.width)
      if (height !== entry.contentRect.height) changeHeight(entry.contentRect.height)
    })

    resizeObserver.observe(element)

    return () => resizeObserver.unobserve(element)
  }, [passedSettings, height, width, dimensions])

  const newSettings = combineChartDimensions({
    ...dimensions,
    width: dimensions.width || width,
    height: dimensions.height || height,
  })

  return [ref, newSettings]
}

let lastId = 0
export const useUniqueId = (prefix="") => {
  lastId++
  return [prefix, lastId].join("-")
}

export function debounce(func, timeout = 100) {
  let timer;
  return function (event) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      // Apply the 'this' context and pass the event argument to the original function
      func.call(this, event);
    }, timeout);
  };
}