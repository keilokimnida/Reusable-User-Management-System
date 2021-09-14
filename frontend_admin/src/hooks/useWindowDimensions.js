// https://stackoverflow.com/a/36862446

import { useState, useEffect } from 'react';

const getDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return { width, height };
}

// https://getbootstrap.com/docs/5.0/layout/breakpoints/#available-breakpoints
const breakpointSize = (width) => {
    if (width >= 1400) return "xxl";
    if (width >= 1200) return "xl";
    if (width >= 992) return "lg";
    if (width >= 768) return "md";
    if (width >= 576) return "sm";
    return "xs";
}

const useWindowDimensions = () => {
    const [dimensions, setDimensions] = useState(getDimensions());

    useEffect(() => {
        const handleResize = () => setDimensions(getDimensions());
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    });

    return { ...dimensions, breakpoint: breakpointSize(dimensions.width) };
}

export default useWindowDimensions;
