
/**
 * @fileoverview Styles for UI components: StatCard and TaskCard.
 * These styles are applied to make the cards look neat, readable, and user-friendly.
 * @module src/components/ui
 * @author Rakshana
 * @date 12/09/2025
 * @since 1.0.0
 */

/**
 * Styles for a small card that shows a simple statistic (like total tasks, sales, or numbers).
 *
 * 📝 Example:
 * Input:
 * <div style={statCardStyles.container}>
 *   <p style={statCardStyles.title}>Total Tasks</p>
 *   <h2 style={statCardStyles.value}>42</h2>
 * </div>
 *
 * Output:
 * A white card with rounded corners that displays the title "Total Tasks"
 * in smaller text and the number "42" in large bold text in the center.
 *
 * @type {Object<string, React.CSSProperties>}
 */
export const statCardStyles = {
  container: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    textAlign: "center",
    transition: "transform 0.2s ease-in-out",
  },
  title: {
    fontSize: "14px",
    color: "#6B7280",
    marginBottom: "6px",
    fontWeight: "300",
  },
  value: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
  },
};

/**
 * Styles for a card that shows details about a task.
 * This card can hold a task title, ID, tags, assignee info, and elapsed time.
 *
 * 📝 Example:
 * Input:
 * <div style={taskCardStyles.container}>
 *   <div style={taskCardStyles.header}>
 *     <h3 style={taskCardStyles.title}>Finish Report</h3>
 *     <span style={taskCardStyles.taskId}>#123</span>
 *   </div>
 *   <div style={taskCardStyles.tagsContainer}>
 *     <span style={taskCardStyles.tag}>Urgent</span>
 *     <span style={taskCardStyles.tag}>Work</span>
 *   </div>
 *   <div style={taskCardStyles.assigneeContainer}>
 *     <div style={taskCardStyles.avatar}>A</div>
 *     <div>
 *       <p style={taskCardStyles.assigneeInfoName}>Alice</p>
 *       <p style={taskCardStyles.assigneeInfoRole}>Manager</p>
 *     </div>
 *   </div>
 *   <div style={taskCardStyles.footer}>
 *     <span style={taskCardStyles.elapsedTime}>2h ago</span>
 *   </div>
 * </div>
 *
 * Output:
 * A white rectangular card with the task title "Finish Report," task ID "#123,"
 * tags like "Urgent," the assignee "Alice (Manager)" with an avatar, and the time "2h ago."
 *
 * @type {Object<string, React.CSSProperties>}
 */
export const taskCardStyles = {
  container: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px 20px",
    transition: "all 0.3s ease-in-out",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "180px",
    maxHeight: "300px",
    overflow: "hidden",
    width: "350px",  
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "10px",
  },
  title: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#111827",
    margin: 0,
    lineHeight: "1.2",
  },
  taskId: {
    fontSize: "13px",
    color: "#9CA3AF",
    whiteSpace: "nowrap",
  },
  tagsContainer: {
    display: "flex",
    gap: "8px",
    marginBottom: "12px",
    flexWrap: "wrap",
  },
  tag: {
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: "600",
    borderRadius: "9999px",
    textTransform: "capitalize",
  },
  assigneeContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "bold",
    color: "white",
    flexShrink: 0,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  assigneeInfoName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#111827",
  },
  assigneeInfoRole: {
    fontSize: "12px",
    color: "#6B7280",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "10px",
    color: "#6B7280",
    marginBottom: "13px",
  },
  elapsedTime: {
    fontWeight: "600",
    color: " #374151",
  },
  icon: {
    color: "#9CA3AF",
  },
};
