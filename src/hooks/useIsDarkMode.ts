import { useEffect, useState } from "react";

const useIsDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // set initial dark mode
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setIsDarkMode(true);
    }
    // listen for dark mode changes
    const setIsDarkModeListener = (event: any) => {
      console.log(event);
      setIsDarkMode(event?.matches);
    };
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", setIsDarkModeListener);
    return () =>
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", setIsDarkModeListener);
  }, []);

  return isDarkMode;
};

export default useIsDarkMode;
