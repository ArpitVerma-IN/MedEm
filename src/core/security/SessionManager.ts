/**
 * HIPAA & GDPR Compliance: Session Management Boilerplate
 * 
 * Requirement 1: HIPAA (§ 164.312(a)(2)(iii)) requires an Automatic Logoff
 * that terminates an electronic session after a predetermined time of inactivity
 * when dealing with clinical patient-case apps.
 * 
 * Requirement 2: JWT rotation logic and cross-tab session syncing.
 */

export class SessionManager {
    static IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 Minutes as per normal clinical defaults
    static timerId: number | null = null;
  
    // 1. HIPAA Auto-logoff
    static initializeIdleTimeout(onLogout: () => void) {
      const resetTimer = () => {
        if (this.timerId) window.clearTimeout(this.timerId);
        this.timerId = window.setTimeout(() => {
          onLogout();
        }, this.IDLE_TIMEOUT_MS);
      };
      
      // Listen to passive input
      window.addEventListener('mousemove', resetTimer, { passive: true });
      window.addEventListener('keydown', resetTimer, { passive: true });
      window.addEventListener('scroll', resetTimer, { passive: true });
      window.addEventListener('touchstart', resetTimer, { passive: true });
  
      resetTimer(); // Start the first clock tick
      
      return () => {
        window.removeEventListener('mousemove', resetTimer);
        window.removeEventListener('keydown', resetTimer);
        window.removeEventListener('scroll', resetTimer);
        window.removeEventListener('touchstart', resetTimer);
        if (this.timerId) window.clearTimeout(this.timerId);
      };
    }
  }
