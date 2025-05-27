import { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchImagesThunk } from '../store/slices/imageSlice';

export const useInfiniteScroll = () => {
  const dispatch = useAppDispatch();
  const { images, loading, hasMore, nextCursor, searchQuery } = useAppSelector(
    (state) => state.images
  );

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const scrollPositionBeforeLoad = useRef<number>(0);
  const isInitialLoad = useRef(true);
  const isFetchingRef = useRef(false);

  const loadMoreImages = useCallback(() => {
    if (loading || !hasMore || isFetchingRef.current) return;

    isFetchingRef.current = true;
    scrollPositionBeforeLoad.current = window.scrollY;

    dispatch(
      fetchImagesThunk({
        cursor: nextCursor,
        limit: 12,
        search: searchQuery,
        initialLoad: isInitialLoad.current,
      })
    ).finally(() => {
      setTimeout(() => {
        window.scrollTo({
          top: scrollPositionBeforeLoad.current,
          behavior: 'auto',
        });
      }, 100);

      if (isInitialLoad.current) {
        isInitialLoad.current = false;
      }

      isFetchingRef.current = false;
    });
  }, [dispatch, loading, hasMore, nextCursor, searchQuery]);

  useEffect(() => {
    const currentRef = loadMoreRef.current;

    // Initial load if images are empty
    if (isInitialLoad.current && images.length === 0 && !loading) {
      loadMoreImages();
      return;
    }

    if (loading || !hasMore || !currentRef) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      ([entry], observer) => {
        if (entry.isIntersecting && !loading && !isFetchingRef.current) {
          observer.unobserve(entry.target);
          loadMoreImages();
        }
      },
      {
        root: null,
        rootMargin: '200px 0px',
        threshold: 0.1,
      }
    );

    observerRef.current.observe(currentRef);

    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef);
      }
    };
  }, [images.length, loading, hasMore, loadMoreImages]);

  return { loadMoreRef, loading };
};
