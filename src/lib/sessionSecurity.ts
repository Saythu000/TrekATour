/**
 * Session security manager
 * Handles secure session management and token lifecycle
 */

import { secureStorage } from './secureStorage';

interface SessionInfo {
  userId: string;
  email: string;
  role: string;
  loginTime: number;
  lastActivity: number;
  ipAddress?: string;
  userAgent?: string;
}

class SessionSecurityManager {
  private readonly SESSION_KEY = 'user_session';
  private readonly ACTIVITY_KEY = 'last_activity';
  private readonly MAX_IDLE_TIME = 30 * 60 * 1000; // 30 minutes
  private readonly MAX_SESSION_TIME = 24 * 60 * 60 * 1000; // 24 hours
  
  private activityTimer: NodeJS.Timeout | null = null;

  /**
   * Initialize session security monitoring
   */
  init(): void {
    this.startActivityMonitoring();
    this.validateExistingSession();
  }

  /**
   * Create secure session
   */
  createSession(sessionInfo: Omit<SessionInfo, 'loginTime' | 'lastActivity'>): void {
    const session: SessionInfo = {
      ...sessionInfo,
      loginTime: Date.now(),
      lastActivity: Date.now(),
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent
    };

    secureStorage.setItem(this.SESSION_KEY, session, {
      encrypt: true,
      expiry: this.MAX_SESSION_TIME
    });

    this.updateActivity();
  }

  /**
   * Get current session info
   */
  getSession(): SessionInfo | null {
    const session = secureStorage.getItem(this.SESSION_KEY, { encrypt: true });
    
    if (!session) return null;

    // Check if session is expired
    if (this.isSessionExpired(session)) {
      this.destroySession();
      return null;
    }

    return session;
  }

  /**
   * Update last activity timestamp
   */
  updateActivity(): void {
    const session = this.getSession();
    if (!session) return;

    session.lastActivity = Date.now();
    secureStorage.setItem(this.SESSION_KEY, session, {
      encrypt: true,
      expiry: this.MAX_SESSION_TIME
    });

    secureStorage.setItem(this.ACTIVITY_KEY, Date.now(), { encrypt: false });
  }

  /**
   * Check if session is expired
   */
  private isSessionExpired(session: SessionInfo): boolean {
    const now = Date.now();
    const idleTime = now - session.lastActivity;
    const sessionTime = now - session.loginTime;

    return idleTime > this.MAX_IDLE_TIME || sessionTime > this.MAX_SESSION_TIME;
  }

  /**
   * Destroy current session
   */
  destroySession(): void {
    secureStorage.removeItem(this.SESSION_KEY, { encrypt: true });
    secureStorage.removeItem(this.ACTIVITY_KEY, { encrypt: false });
    
    // Clear all auth-related storage
    this.clearAuthStorage();
    
    if (this.activityTimer) {
      clearInterval(this.activityTimer);
      this.activityTimer = null;
    }
  }

  /**
   * Clear all authentication-related storage
   */
  private clearAuthStorage(): void {
    // Clear Supabase auth tokens
    ['sb-auth-token', 'sb-refresh-token'].forEach(key => {
      secureStorage.removeItem(key, { encrypt: true });
    });

    // Clear Clerk tokens from localStorage (Clerk manages its own storage)
    const clerkKeys = Object.keys(localStorage).filter(key => 
      key.includes('clerk') || key.includes('__clerk')
    );
    clerkKeys.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Start monitoring user activity
   */
  private startActivityMonitoring(): void {
    // Update activity on user interactions
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const updateActivity = () => {
      this.updateActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    // Check session validity every minute
    this.activityTimer = setInterval(() => {
      this.validateExistingSession();
    }, 60 * 1000);
  }

  /**
   * Validate existing session
   */
  private validateExistingSession(): void {
    const session = secureStorage.getItem(this.SESSION_KEY, { encrypt: true });
    
    if (session && this.isSessionExpired(session)) {
      console.warn('Session expired, logging out user');
      this.destroySession();
      
      // Redirect to login or show session expired message
      if (window.location.pathname.includes('/admin')) {
        window.location.href = '/';
      }
    }
  }

  /**
   * Get client IP (best effort)
   */
  private getClientIP(): string {
    // This is a placeholder - in production, you'd get this from server
    return 'client-ip-unknown';
  }

  /**
   * Check if current session is from same device/browser
   */
  validateSessionFingerprint(session: SessionInfo): boolean {
    const currentUserAgent = navigator.userAgent;
    return session.userAgent === currentUserAgent;
  }

  /**
   * Get session statistics
   */
  getSessionStats(): {
    isActive: boolean;
    timeRemaining: number;
    idleTime: number;
    sessionDuration: number;
  } {
    const session = this.getSession();
    
    if (!session) {
      return {
        isActive: false,
        timeRemaining: 0,
        idleTime: 0,
        sessionDuration: 0
      };
    }

    const now = Date.now();
    const idleTime = now - session.lastActivity;
    const sessionDuration = now - session.loginTime;
    const timeRemaining = Math.max(0, this.MAX_IDLE_TIME - idleTime);

    return {
      isActive: !this.isSessionExpired(session),
      timeRemaining,
      idleTime,
      sessionDuration
    };
  }
}

// Export singleton instance
export const sessionSecurity = new SessionSecurityManager();
