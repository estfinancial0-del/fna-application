import { useEffect, useRef } from 'react';
import { UseFormWatch } from 'react-hook-form';

interface UseAutosaveOptions<T> {
  watch: UseFormWatch<T>;
  onSave: (data: T) => void;
  delay?: number;
  enabled?: boolean;
}

/**
 * Hook to automatically save form data after user stops typing
 * @param watch - react-hook-form watch function
 * @param onSave - callback function to save the data
 * @param delay - debounce delay in milliseconds (default: 2000ms)
 * @param enabled - whether autosave is enabled (default: true)
 */
export function useAutosave<T extends Record<string, any>>({
  watch,
  onSave,
  delay = 2000,
  enabled = true,
}: UseAutosaveOptions<T>) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const previousDataRef = useRef<string>('');

  useEffect(() => {
    if (!enabled) return;

    const subscription = watch((data) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Convert data to string for comparison
      const currentData = JSON.stringify(data);

      // Only save if data has changed
      if (currentData !== previousDataRef.current) {
        timeoutRef.current = setTimeout(() => {
          onSave(data as T);
          previousDataRef.current = currentData;
        }, delay);
      }
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [watch, onSave, delay, enabled]);
}
