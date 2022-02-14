import React from "react";

function useResponsiveness() {
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    function onResize() {
      setWidth(window.innerWidth);
    }

    onResize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return { isMobile: width <= 640 };
}

export default useResponsiveness;
