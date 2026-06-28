import { useRef, useEffect, useCallback } from 'react';

interface TouchPoint {
  x: number;
  y: number;
}

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  preventScroll?: boolean;
}

interface PinchZoomOptions {
  onZoomIn?: (scale: number) => void;
  onZoomOut?: (scale: number) => void;
  onZoomChange?: (scale: number) => void;
  minScale?: number;
  maxScale?: number;
}

export const useSwipeGesture = (options: SwipeGestureOptions) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    preventScroll = false
  } = options;

  const touchStart = useRef<TouchPoint | null>(null);
  const touchEnd = useRef<TouchPoint | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (preventScroll) {
      e.preventDefault();
    }
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
  }, [preventScroll]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) return;

    const deltaX = touchStart.current.x - touchEnd.current.x;
    const deltaY = touchStart.current.y - touchEnd.current.y;

    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    const isVerticalSwipe = Math.abs(deltaY) > Math.abs(deltaX);

    if (isHorizontalSwipe && Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        onSwipeLeft?.();
      } else {
        onSwipeRight?.();
      }
    }

    if (isVerticalSwipe && Math.abs(deltaY) > threshold) {
      if (deltaY > 0) {
        onSwipeUp?.();
      } else {
        onSwipeDown?.();
      }
    }
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold]);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  };
};

export const usePinchZoom = (options: PinchZoomOptions) => {
  const {
    onZoomIn,
    onZoomOut,
    onZoomChange,
    minScale = 0.5,
    maxScale = 3
  } = options;

  const lastDistance = useRef<number>(0);
  const currentScale = useRef<number>(1);

  const getDistance = (touches: TouchList): number => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      lastDistance.current = getDistance(e.touches);
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const currentDistance = getDistance(e.touches);
      const scale = currentDistance / lastDistance.current;
      
      currentScale.current = Math.min(Math.max(currentScale.current * scale, minScale), maxScale);
      
      onZoomChange?.(currentScale.current);
      
      if (scale > 1.1) {
        onZoomIn?.(currentScale.current);
      } else if (scale < 0.9) {
        onZoomOut?.(currentScale.current);
      }
      
      lastDistance.current = currentDistance;
    }
  }, [onZoomIn, onZoomOut, onZoomChange, minScale, maxScale]);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    scale: currentScale.current
  };
};

export const useHapticFeedback = () => {
  const vibrate = useCallback((pattern: number | number[] = 10) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  const lightTap = useCallback(() => vibrate(10), [vibrate]);
  const mediumTap = useCallback(() => vibrate(20), [vibrate]);
  const heavyTap = useCallback(() => vibrate(50), [vibrate]);
  const doubleTap = useCallback(() => vibrate([10, 50, 10]), [vibrate]);

  return { vibrate, lightTap, mediumTap, heavyTap, doubleTap };
};

export const useResponsive = () => {
  const isMobile = () => window.innerWidth < 768;
  const isTablet = () => window.innerWidth >= 768 && window.innerWidth < 1024;
  const isDesktop = () => window.innerWidth >= 1024;

  return { isMobile, isTablet, isDesktop };
};
