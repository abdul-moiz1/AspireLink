import { useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseSessionTimeoutProps {
  timeoutMs?: number;
  warningMs?: number;
  onTimeout?: () => void;
  onWarning?: () => void;
}

export function useSessionTimeout({
  timeoutMs = 7 * 60 * 1000, // 7 minutes
  warningMs = 6 * 60 * 1000, // 6 minutes (1 minute warning)
  onTimeout,
  onWarning,
}: UseSessionTimeoutProps = {}) {
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningRef = useRef<NodeJS.Timeout>();
  const warningShownRef = useRef(false);

  const resetTimers = useCallback(() => {
    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
    }
    
    // Reset warning flag
    warningShownRef.current = false;

    // Set warning timer
    warningRef.current = setTimeout(() => {
      if (!warningShownRef.current) {
        warningShownRef.current = true;
        if (onWarning) {
          onWarning();
        } else {
          toast({
            title: "Session Warning",
            description: "Your session will expire in 1 minute due to inactivity.",
            variant: "destructive",
          });
        }
      }
    }, warningMs);

    // Set timeout timer
    timeoutRef.current = setTimeout(() => {
      if (onTimeout) {
        onTimeout();
      } else {
        toast({
          title: "Session Expired",
          description: "You have been logged out due to inactivity. Redirecting to login...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = '/api/logout';
        }, 1000);
      }
    }, timeoutMs);
  }, [timeoutMs, warningMs, onTimeout, onWarning, toast]);

  useEffect(() => {
    // Activity events that reset the timer
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    // Reset timers on mount
    resetTimers();

    // Add event listeners
    const resetOnActivity = () => resetTimers();
    events.forEach(event => {
      document.addEventListener(event, resetOnActivity, true);
    });

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningRef.current) {
        clearTimeout(warningRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, resetOnActivity, true);
      });
    };
  }, [resetTimers]);

  return { resetTimers };
}