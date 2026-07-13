import { useState, useRef, useCallback } from "react";
import "./Slider.scss";

export default function Slider({
  title,
  children,
  slidesToShow = 3,
  showPagination = true,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  const items = Array.isArray(children) ? children : [children];
  const totalSlides = Math.max(1, Math.ceil(items.length / slidesToShow));

  const goToSlide = useCallback(
    (index) => {
      const clamped = Math.max(0, Math.min(index, totalSlides - 1));
      setCurrentSlide(clamped);
      if (sliderRef.current) {
        const slideWidth = sliderRef.current.offsetWidth;
        sliderRef.current.scrollTo({
          left: clamped * slideWidth,
          behavior: "smooth",
        });
      }
    },
    [totalSlides]
  );

  const handleScroll = useCallback(() => {
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.offsetWidth;
      const scrollLeft = sliderRef.current.scrollLeft;
      const newIndex = Math.round(scrollLeft / slideWidth);
      setCurrentSlide(Math.max(0, Math.min(newIndex, totalSlides - 1)));
    }
  }, [totalSlides]);

  return (
    <section className="slider-section">
      {title && <h2 className="slider-section__title">{title}</h2>}

      <div className="slider">
        <button
          className="slider__btn slider__btn--prev"
          onClick={() => goToSlide(currentSlide - 1)}
          disabled={currentSlide === 0}
          aria-label="Previous slide"
        >
          ‹
        </button>

        <div
          className="slider__track"
          ref={sliderRef}
          onScroll={handleScroll}
        >
          <div
            className="slider__slides"
            style={{
              gridTemplateColumns: `repeat(${totalSlides}, 100%)`,
            }}
          >
            {Array.from({ length: totalSlides }, (_, slideIndex) => (
              <div
                key={slideIndex}
                className="slider__slide"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(
                    slidesToShow,
                    items.length - slideIndex * slidesToShow
                  )}, 1fr)`,
                }}
              >
                {items
                  .slice(
                    slideIndex * slidesToShow,
                    slideIndex * slidesToShow + slidesToShow
                  )
                  .map((item, i) => (
                    <div key={i} className="slider__card-wrapper">
                      {item}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>

        <button
          className="slider__btn slider__btn--next"
          onClick={() => goToSlide(currentSlide + 1)}
          disabled={currentSlide >= totalSlides - 1}
          aria-label="Next slide"
        >
          ›
        </button>
      </div>

      {showPagination && totalSlides > 1 && (
        <div className="slider__pagination">
          {Array.from({ length: totalSlides }, (_, i) => (
            <button
              key={i}
              className={`slider__dot ${i === currentSlide ? "slider__dot--active" : ""
                }`}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}