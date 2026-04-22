'use client';

import {
  useEffect,
  useRef,
  useState,
  ReactNode,
  TouchEvent,
  WheelEvent,
} from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Safely detect whether a media source points at YouTube by parsing the URL
// and checking the hostname, rather than doing a substring match that could
// match arbitrary query strings or paths.
const isYouTubeUrl = (src: string): boolean => {
  try {
    const base =
      typeof window !== 'undefined' ? window.location.href : 'http://localhost';
    const url = new URL(src, base);
    return /(^|\.)youtube\.com$/.test(url.hostname);
  } catch {
    return false;
  }
};

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc?: string;
  scrollToExpand?: string;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  scrollToExpand,
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);
  const [viewportWidth, setViewportWidth] = useState<number>(0);
  const [viewportHeight, setViewportHeight] = useState<number>(0);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Drive local video playback position from scroll progress so the video
  // plays forward as the user scrolls down and rewinds as they scroll back.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (mediaType !== 'video') return;
    if (isYouTubeUrl(mediaSrc)) return;

    const applyTime = () => {
      const duration = video.duration;
      if (!duration || Number.isNaN(duration) || !Number.isFinite(duration)) {
        return;
      }
      const target = Math.min(
        Math.max(scrollProgress * duration, 0),
        Math.max(duration - 0.05, 0)
      );
      // Only seek if noticeably different to avoid jitter.
      if (Math.abs(video.currentTime - target) > 0.03) {
        try {
          video.currentTime = target;
        } catch {
          // Ignore if the media isn't seekable yet.
        }
      }
    };

    if (video.readyState >= 1) {
      applyTime();
    } else {
      const onLoaded = () => {
        // Prime the video on iOS so it becomes seekable: briefly play then pause.
        video.play().then(() => {
          video.pause();
          applyTime();
        }).catch(() => {
          // Autoplay was blocked — still attempt to apply time directly.
          applyTime();
        });
      };
      video.addEventListener('loadedmetadata', onLoaded, { once: true });
      return () => video.removeEventListener('loadedmetadata', onLoaded);
    }
  }, [scrollProgress, mediaType, mediaSrc]);

  useEffect(() => {
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
  }, [mediaType]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0015;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        // Consistent sensitivity for forward and backward touch scrubbing.
        const scrollFactor = 0.006;
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }

        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = (): void => {
      setTouchStartY(0);
    };

    const handleScroll = (): void => {
      if (!mediaFullyExpanded) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('wheel', handleWheel as unknown as EventListener, {
      passive: false,
    });
    window.addEventListener('scroll', handleScroll as EventListener);
    window.addEventListener(
      'touchstart',
      handleTouchStart as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener(
      'touchmove',
      handleTouchMove as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener('touchend', handleTouchEnd as EventListener);

    return () => {
      window.removeEventListener(
        'wheel',
        handleWheel as unknown as EventListener
      );
      window.removeEventListener('scroll', handleScroll as EventListener);
      window.removeEventListener(
        'touchstart',
        handleTouchStart as unknown as EventListener
      );
      window.removeEventListener(
        'touchmove',
        handleTouchMove as unknown as EventListener
      );
      window.removeEventListener('touchend', handleTouchEnd as EventListener);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobileState(window.innerWidth < 768);
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Base size is viewport-relative so the card looks good on all screen sizes.
  // On mobile the card starts at ~85% of viewport width / ~48% of viewport height.
  // On desktop it starts as a centred card (~24vw wide / ~52vh tall) and expands
  // to fill the viewport. Fall back to fixed values before the viewport dimensions
  // are known (pre-hydration / initial SSR render).
  const vw = viewportWidth || 1280;
  const vh = viewportHeight || 800;
  const baseWidth = isMobileState ? Math.round(vw * 0.85) : Math.round(vw * 0.24);
  const baseHeight = isMobileState ? Math.round(vh * 0.48) : Math.round(vh * 0.52);
  const expandWidth = isMobileState ? Math.round(vw * 0.13) : Math.round(vw * 0.74);
  const expandHeight = isMobileState ? Math.round(vh * 0.40) : Math.round(vh * 0.36);
  const mediaWidth = baseWidth + scrollProgress * expandWidth;
  const mediaHeight = baseHeight + scrollProgress * expandHeight;

  return (
    <div
      ref={sectionRef}
      className='transition-colors duration-700 ease-in-out overflow-x-hidden'
    >
      <section className='relative flex flex-col items-center justify-start min-h-[100dvh]'>
        <div className='relative w-full flex flex-col items-center min-h-[100dvh]'>
          {bgImageSrc ? (
            <motion.div
              className='absolute inset-0 z-0 h-full'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 - scrollProgress }}
              transition={{ duration: 0.1 }}
            >
              <Image
                src={bgImageSrc}
                alt='Background'
                width={1920}
                height={1080}
                className='w-screen h-screen'
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
                priority
              />
              <div className='absolute inset-0 bg-black/10' />
            </motion.div>
          ) : (
            <div className='absolute inset-0 z-0 h-full bg-black' />
          )}

          <div className='container mx-auto flex flex-col items-center justify-start relative z-10'>
            <div className='flex flex-col items-center justify-center w-full h-[100dvh] relative'>
              <div
                className='absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-none rounded-2xl'
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: '95vw',
                  maxHeight: '85vh',
                  boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.3)',
                }}
              >
                {mediaType === 'video' ? (
                  isYouTubeUrl(mediaSrc) ? (
                    <div className='relative w-full h-full pointer-events-none'>
                      <iframe
                        width='100%'
                        height='100%'
                        src={
                          mediaSrc.includes('embed')
                            ? mediaSrc +
                              (mediaSrc.includes('?') ? '&' : '?') +
                              'autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1'
                            : mediaSrc.replace('watch?v=', 'embed/') +
                              '?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=' +
                              mediaSrc.split('v=')[1]
                        }
                        className='w-full h-full rounded-xl'
                        frameBorder='0'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                      />
                      <div
                        className='absolute inset-0 z-10'
                        style={{ pointerEvents: 'none' }}
                      ></div>

                      <motion.div
                        className='absolute inset-0 bg-black/30 rounded-xl'
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  ) : (
                    <div className='relative w-full h-full pointer-events-none'>
                      <video
                        ref={videoRef}
                        src={mediaSrc}
                        poster={posterSrc}
                        muted
                        playsInline
                        preload='auto'
                        aria-label='Scroll-controlled hero video'
                        className='w-full h-full object-cover rounded-xl'
                        controls={false}
                        disablePictureInPicture
                        disableRemotePlayback
                      />
                      <div
                        className='absolute inset-0 z-10'
                        style={{ pointerEvents: 'none' }}
                      ></div>

                      <motion.div
                        className='absolute inset-0 bg-black/30 rounded-xl'
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  )
                ) : (
                  <div className='relative w-full h-full'>
                    <Image
                      src={mediaSrc}
                      alt='Media content'
                      width={1280}
                      height={720}
                      className='w-full h-full object-cover rounded-xl'
                    />

                    <motion.div
                      className='absolute inset-0 bg-black/50 rounded-xl'
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.7 - scrollProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}
              </div>

              {/* "Scroll to explore" hint — fades out as the user starts scrolling */}
              {scrollToExpand && (
                <motion.p
                  className='absolute bottom-8 left-1/2 -translate-x-1/2 text-sm font-medium text-blue-200 pointer-events-none select-none whitespace-nowrap'
                  animate={{ opacity: 1 - scrollProgress * 3 }}
                  transition={{ duration: 0.1 }}
                >
                  <span aria-hidden='true'>↕ </span>
                  {scrollToExpand}
                </motion.p>
              )}
            </div>

            <motion.section
              className='flex flex-col w-full px-8 py-10 md:px-16 lg:py-20'
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
