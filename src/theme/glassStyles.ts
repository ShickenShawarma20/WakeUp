export const getGlassStyles = (_isDark: boolean) => ({
  standard: {
    background: "rgba(30, 20, 60, 0.65)",
    backdropFilter: "blur(24px) saturate(180%)",
    WebkitBackdropFilter: "blur(24px) saturate(180%)",
    border: "1px solid rgba(180, 120, 255, 0.12)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    borderRadius: "20px",
  },
  navBar: {
    background: "rgba(20, 14, 40, 0.85)",
    backdropFilter: "blur(24px) saturate(200%)",
    WebkitBackdropFilter: "blur(24px) saturate(200%)",
    borderTop: "1px solid rgba(180, 120, 255, 0.1)",
    boxShadow: "0 -4px 32px rgba(0, 0, 0, 0.2)",
    borderRadius: "24px",
  },
  card: {
    background: "rgba(20, 14, 40, 0.85)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(180, 120, 255, 0.1)",
    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.25)",
    borderRadius: "20px",
  },
});