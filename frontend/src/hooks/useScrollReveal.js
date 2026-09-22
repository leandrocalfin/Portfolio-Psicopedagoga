import { useEffect, useRef, useState } from "react";

export function useScrollReveal(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = "0px 0px -50px 0px",
    triggerOnce = true,
  } = options;

  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) observer.unobserve(element);
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isVisible];
}

export function useStaggeredReveal(count, options = {}) {
  const refs = useRef([]);
  const [visibleIndices, setVisibleIndices] = useState(new Set());

  useEffect(() => {
    const elements = refs.current.filter(Boolean);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = elements.indexOf(entry.target);
          if (index >= 0) {
            if (entry.isIntersecting) {
              setVisibleIndices((prev) => new Set([...prev, index]));
              if (options.triggerOnce !== false) observer.unobserve(entry.target);
            } else if (options.triggerOnce === false) {
              setVisibleIndices((prev) => {
                const next = new Set(prev);
                next.delete(index);
                return next;
              });
            }
          }
        });
      },
      { threshold: options.threshold || 0.1, rootMargin: options.rootMargin || "0px 0px -50px 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [count, options.threshold, options.rootMargin, options.triggerOnce]);

  const setRef = (index) => (el) => {
    refs.current[index] = el;
  };

  return [setRef, visibleIndices];
}