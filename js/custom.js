document.addEventListener('DOMContentLoaded', () => {
  const sliderTrack = document.querySelector('.slider-track');
  const slides = Array.from(sliderTrack.children);
  const nextButton = document.querySelector('.slider-button.next');
  const prevButton = document.querySelector('.slider-button.prev');

  if (!sliderTrack || !nextButton || !prevButton || slides.length === 0) {
    console.warn("Slider elements not found or no slides available.");
    return; // Exit if slider elements aren't found
  }

  const slideWidth = slides[0].getBoundingClientRect().width;
  let currentIndex = 0;

  // Arrange slides next to each other
  // This might not be strictly necessary if CSS flex handles it, but good for explicit control
  // slides.forEach((slide, index) => {
  //     slide.style.left = slideWidth * index + 'px';
  // });

  // Function to move slides
  const moveToSlide = (track, targetIndex) => {
    if (targetIndex < 0 || targetIndex >= slides.length) {
      console.warn(`Attempted to move to invalid index: ${targetIndex}`);
      return; // Prevent moving outside bounds
    }
    track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
    currentIndex = targetIndex;
  };

  // Next button event listener
  nextButton.addEventListener('click', e => {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= slides.length) {
      nextIndex = 0; // Loop back to the first slide
    }
    moveToSlide(sliderTrack, nextIndex);
  });

  // Previous button event listener
  prevButton.addEventListener('click', e => {
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = slides.length - 1; // Loop back to the last slide
    }
    moveToSlide(sliderTrack, prevIndex);
  });

  // Optional: Recalculate width on resize to handle responsiveness
  window.addEventListener('resize', () => {
    // Debounce or throttle this for performance if needed
    const newSlideWidth = slides[0].getBoundingClientRect().width;
    // Re-apply the transform based on the new width and current index
    sliderTrack.style.transition = 'none'; // Disable transition during resize calculation
    sliderTrack.style.transform = 'translateX(-' + newSlideWidth * currentIndex + 'px)';
    // Force reflow/repaint might be needed in some browsers
    sliderTrack.offsetHeight; // Trigger reflow
    sliderTrack.style.transition = 'transform 0.5s ease-in-out'; // Re-enable transition
  });

  // Initialize slider position
  moveToSlide(sliderTrack, 0);

});