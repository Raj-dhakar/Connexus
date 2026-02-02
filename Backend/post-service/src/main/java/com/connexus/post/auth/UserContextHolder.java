package com.connexus.post.auth;

public class UserContextHolder {

    private static final ThreadLocal<Long> currentUserId = new ThreadLocal<>();
    private static final ThreadLocal<String> currentUserRole = new ThreadLocal<>();

    public static Long getCurrentUserId() {
        return currentUserId.get();
    }

    static void setCurrentUserId(Long userId) {
        currentUserId.set(userId);
    }

    // ===== Role =====
    public static String getCurrentUserRole() {
        return currentUserRole.get();
    }

    static void setCurrentUserRole(String role) {
        currentUserRole.set(role);
    }

    static void clear() {
        currentUserRole.remove();
        currentUserId.remove();
    }
}
