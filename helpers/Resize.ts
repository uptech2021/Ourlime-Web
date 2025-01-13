export const ResizeListener = (setIsPc: React.Dispatch<React.SetStateAction<boolean>>) => { 
  // Function to update the state when the window is resized
  const handleResize = () => setIsPc(window.innerWidth >= 1024);

  // Call the handler once to set the initial state
  handleResize();
  
  // Set a timeout to debounce the resize event
  const debounceTimeout = setTimeout(() => {
    // Add the event listener once the timeout has expired
    window.addEventListener('resize', handleResize);
  }, 500);
  
  // Return a function to clean up the event listener when the component is unmounted
  return () => {
    // Clear the timeout to prevent the handler from being called after the component is unmounted
    clearTimeout(debounceTimeout);
    // Remove the event listener
    window.removeEventListener('resize', handleResize);
  };
};