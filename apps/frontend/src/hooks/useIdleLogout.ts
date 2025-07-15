import { useEffect, useRef } from "react";
import { useAppDispatch } from "../store";
import { logout } from "../store/authSlice";

const IDLE_MINUTES = 30;

const useIdleLogout = (enabled: boolean) => {
  const dispatch = useAppDispatch();
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const resetTimer = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(
        () => {
          dispatch(logout());
        },
        IDLE_MINUTES * 60 * 1000 // 30 minutes
      );
    };

    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach((evt) => window.addEventListener(evt, resetTimer));
    resetTimer();

    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach((evt) => window.removeEventListener(evt, resetTimer));
    };
  }, [enabled, dispatch]);
};

export default useIdleLogout;
