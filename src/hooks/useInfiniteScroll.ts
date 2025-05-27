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
  const isInitialLoad = useRef<boolean>(true);
  const isFetchingRef = useRef<boolean>(false); // Prevent multiple calls

  const loadMoreImages = useCallback(() => {
    if (loading || !hasMore || isFetchingRef.current) return;

    isFetchingRef.current = true;
    scrollPositionBeforeLoad.current = window.scrollY;

    dispatch(fetchImagesThunk({
      cursor: nextCursor,
      limit: 12,
      search: searchQuery,
      initialLoad: isInitialLoad.current
    }))
      .finally(() => {
        setTimeout(() => {
          window.scrollTo({
            top: scrollPositionBeforeLoad.current,
            behavior: 'auto'
          });
        }, 100);

        if (isInitialLoad.current) {
          isInitialLoad.current = false;
        }

        isFetchingRef.current = false; // Unlock fetching
      });
  }, [dispatch, loading, hasMore, nextCursor, searchQuery]);

  // Load initial images when search query changes
  useEffect(() => {
    if (images.length === 0 && !loading) {
      isInitialLoad.current = true;
      loadMoreImages();
    }
  }, [searchQuery, loadMoreImages, images.length, loading]);

  // Setup intersection observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries, observer) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading && !isFetchingRef.current) {
          observer.unobserve(entry.target); // Prevent multiple triggers
          loadMoreImages();
        }
      },
      {
        root: null,
        rootMargin: '200px 0px',
        threshold: 0.1
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observerRef.current.observe(currentRef);
    }

    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef);
      }
    };
  }, [loadMoreImages, loading, hasMore]);

  return { loadMoreRef, loading };
};