import React, { useState, useRef, useEffect } from "react";
import {
  IconFlame,
  IconBolt,
  IconFileText,
  IconAlertTriangle,
  IconExclamationMark,
  IconStar,
  IconStarFilled,
  IconTag,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconSquareRoundedLetterS,
  IconLoader2,
  IconAlertCircle
} from "@tabler/icons-react";

import {
  decryptData,
  validateJsonData,
  isWebCryptoSupported,
} from 'src/components/Decryption/Decrypt';
import Cookies from 'js-cookie';

const palette = {
  primary: "#2563EB",
  secondary: "#64748B",
  success: "#059669",
  warning: "#D97706",
  danger: "#DC2626",
  info: "#0891B2",
  neutral: "#374151",
  light: "#F8FAFC",
  white: "#FFFFFF",
  border: "#E2E8F0",
  hover: "#F1F5F9",
  text: {
    primary: "#1E293B",
    secondary: "#64748B",
    muted: "#94A3B8",
  },
};

const SmartTooltip = ({ children, content, visible }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [placement, setPlacement] = useState("bottom");
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (visible && tooltipRef.current && triggerRef.current) {
      const tooltip = tooltipRef.current;
      const trigger = triggerRef.current;
      const triggerRect = trigger.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newPlacement = "bottom";
      let top = triggerRect.bottom + 8;
      let left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
      
      if (top + tooltipRect.height > viewportHeight - 10) {
        newPlacement = "top";
        top = triggerRect.top - tooltipRect.height - 8;
      }

      if (left < 10) {
        left = triggerRect.left;
      } else if (left + tooltipRect.width > viewportWidth - 10) {
        left = triggerRect.right - tooltipRect.width;
      }
      
      left = Math.max(10, Math.min(left, viewportWidth - tooltipRect.width - 10));
      top = Math.max(10, Math.min(top, viewportHeight - tooltipRect.height - 10));

      setPosition({ top, left });
      setPlacement(newPlacement);
    }
  }, [visible]);

  return (
    <div ref={triggerRef} style={{ position: "relative", display: "inline-flex" }}>
      {children}
      {visible && (
        <div
          ref={tooltipRef}
          style={{
            position: "fixed",
            top: `${position.top}px`,
            left: `${position.left}px`,
            background: "rgb(248, 250, 252)",
            color: "rgb(0, 0, 0)",
            padding: "8px 10px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "500",
            whiteSpace: "nowrap",
            zIndex: 999,
            boxShadow: "0 8px 25px rgba(139, 92, 246, 0.3), 0 4px 12px rgba(0,0,0,0.15)",
            pointerEvents: "none",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {content}
          <div
            style={{
              position: "absolute",
              top: "-6px",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderBottom: "6px solid rgb(248, 250, 252)",
            }}
          />
        </div>
      )}
    </div>
  );
};

const PriorityIcon = ({ priority, color }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getPriorityConfig = (priority) => {
    const priorityLower = priority?.toLowerCase() || "medium";
    switch (priorityLower) {
      case "sla":
        return { icon: IconSquareRoundedLetterS, color: palette.danger, label: "SLA" };
      case "critical":
        return { icon: IconExclamationMark, color: palette.danger, label: "Critical" };
      case "high":
        return { icon: IconFlame, color: palette.danger, label: "High" };
      case "urgent":
        return { icon: IconAlertTriangle, color: palette.warning, label: "Urgent" };
      case "medium":
        return { icon: IconBolt, color: palette.warning, label: "Medium" };
      case "low":
        return { icon: IconFileText, color: palette.secondary, label: "Low" };
      default:
        return { icon: IconBolt, color: palette.secondary, label: "Medium" };
    }
  };

  const config = getPriorityConfig(priority);
  const IconComponent = config.icon;

  return (
    <SmartTooltip content={`${config.label} Priority`} visible={showTooltip}>
      <div
        style={{
          padding: "6px",
          borderRadius: "6px",
          background: `${config.color}10`,
          border: `1px solid ${config.color}20`,
          cursor: "pointer",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseEnter={(e) => {
          setShowTooltip(true);
          e.currentTarget.style.background = `${config.color}20`;
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          setShowTooltip(false);
          e.currentTarget.style.background = `${config.color}10`;
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <IconComponent size={16} color={config.color} stroke={1.5} />
      </div>
    </SmartTooltip>
  );
};

const ProfileAvatar = ({ initiator }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [palette.primary, palette.success, palette.info, palette.warning];
    const hash = name.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  const avatarColor = getAvatarColor(initiator);

  return (
    <SmartTooltip content={initiator} visible={showTooltip}>
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "8px",
          background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}DD)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: palette.white,
          fontSize: "13px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.2s ease",
          border: `2px solid ${palette.white}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
        onMouseEnter={(e) => {
          setShowTooltip(true);
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
        }}
        onMouseLeave={(e) => {
          setShowTooltip(false);
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
        }}
      >
        {getInitials(initiator)}
      </div>
    </SmartTooltip>
  );
};

const getAuthHeaders = async () => {
  const encryptedToken = Cookies.get('HRToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${encryptedToken}`,
  };
};

const BadgeChip = ({ badge, coverPageNo, fetchTasks, badgeOptions }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [updating, setUpdating] = useState(false);
  const dropdownRef = useRef(null);

  const API_BASE_URL = 'https://wftest1.iitm.ac.in:5000';
  const API_TOKEN = 'HRFGVJISOVp1fncC';

  const badgeColors = {
    Later: palette.secondary,
    "On Hold": palette.warning,
    Checking: palette.info,
    Urgent: palette.danger,
    Review: palette.primary,
    Done: palette.success,
  };

  const currentBadgeColor = badgeColors[badge] || palette.secondary;

  const updateBadge = async (newBadgeId) => {
    setUpdating(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/Inboxactivity`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          coverpageno: coverPageNo,
          badge: newBadgeId,
          token: API_TOKEN
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const encryptedResult = await response.json();
      const decryptedData = await decryptData(encryptedResult.Data);
      const result = JSON.parse(decryptedData);
      
      if (result.status === 200) {
        if (fetchTasks) {
          await fetchTasks();
        }
      } else {
        throw new Error(result.message || `Unexpected response status: ${result.status}`);
      }
    } catch (error) {
      console.error('Failed to update badge:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <div
        onClick={handleDropdownToggle}
        style={{
          background: `${currentBadgeColor}10`,
          border: `1px solid ${currentBadgeColor}30`,
          color: currentBadgeColor,
          padding: "6px 12px",
          borderRadius: "6px",
          fontSize: "11px",
          fontWeight: "600",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          whiteSpace: "nowrap",
          cursor: updating ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          opacity: updating ? 0.7 : 1,
        }}
        onMouseEnter={(e) => { if (!updating) e.currentTarget.style.background = `${currentBadgeColor}20`; }}
        onMouseLeave={(e) => { if (!updating) e.currentTarget.style.background = `${currentBadgeColor}10`; }}
      >
        {updating ? <IconLoader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <IconTag size={12} stroke={1.5} />}
        {badge}
        <IconChevronDown size={12} stroke={1.5} />
      </div>

      {showDropdown && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            background: palette.white,
            border: `1px solid ${palette.border}`,
            borderRadius: "8px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            zIndex: 1000,
            minWidth: "160px",
            marginTop: "4px",
            overflow: "hidden",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {badgeOptions.map((option) => (
            <div
              key={option.statusid}
              onClick={(e) => {
                e.stopPropagation();
                updateBadge(option.statusid);
                setShowDropdown(false);
              }}
              style={{
                padding: "10px 14px",
                cursor: "pointer",
                fontSize: "12px",
                color: badgeColors[option.statusdescription] || palette.text.secondary,
                fontWeight: "500",
                transition: "background-color 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = palette.hover; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = palette.white; }}
            >
              <IconTag size={14} stroke={1.5} />
              {option.statusdescription}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProgressBar = ({ progress, color }) => (
  <div style={{ width: "100px", height: "8px", backgroundColor: palette.border, borderRadius: "4px", overflow: "hidden", position: "relative" }}>
    <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg, ${color || palette.primary}, ${color || palette.primary}DD)`, borderRadius: "4px", transition: "width 0.3s ease" }} />
  </div>
);

const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    isMobile: windowSize.width <= 768,
    isTablet: windowSize.width <= 1024 && windowSize.width > 768,
    isDesktop: windowSize.width > 1024,
    width: windowSize.width,
  };
};

const TaskTableDemo = () => {
  const responsive = useResponsive();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage, setTasksPerPage] = useState(10);
  const [badgeOptions, setBadgeOptions] = useState([]);
  
  const API_BASE_URL = 'https://wftest1.iitm.ac.in:5000';
  const API_TOKEN = 'HRFGVJISOVp1fncC';

  const transformApiData = (apiRecords, options) => {
    const badgeMap = options.reduce((acc, option) => {
      acc[option.statusid] = option.statusdescription;
      return acc;
    }, {});

    return apiRecords.map((record, index) => ({
      id: record.taskid || index + 1,
      coverPageNo: record.coverpageno,
      processName: record.processname,
      initiator: record.employeeid,
      priority: record.priority,
      badge: badgeMap[record.badge] || record.badge, // Use description from map
      badgeId: record.badgeid,
      progress: Math.floor(Math.random() * 100),
      updatedOn: record.updatedon ? new Date(record.updatedon).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A',
      favorite: record.starred === '1' || false,
      statusColor: getStatusColor(badgeMap[record.badge] || record.badge),
      taskId: record.taskid
    }));
  };

  const getStatusColor = (badge) => {
    switch(badge?.toLowerCase()) {
      case 'done': return '#10B981';
      case 'urgent': return '#EF4444';
      case 'on hold': return '#F59E0B';
      case 'later': return '#8B5CF6';
      case 'review': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const fetchBadgeOptions = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/Statusmaster`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ token: API_TOKEN, statusname: "Badge" })
      });
      if (!response.ok) throw new Error(`API request failed: ${response.status}`);
      
      const encryptedData = await response.json();
      if (!encryptedData.Data) throw new Error('No encrypted data received for badges');
      
      const decryptedData = await decryptData(encryptedData.Data);
      const parsedData = validateJsonData(decryptedData);

      if (parsedData.Data && parsedData.Data.Records) {
        setBadgeOptions(parsedData.Data.Records);
      } else {
        throw new Error('Invalid badge options structure');
      }
    } catch (err) {
      console.error('Failed to fetch badge options:', err);
      throw err;
    }
  };

  const fetchTasks = async () => {
    if (badgeOptions.length === 0) return; // Don't fetch tasks until options are ready
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/TaskInbox`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ token: API_TOKEN, empid: Cookies.get('EmpId'), assignedrole: null })
      });
      if (!response.ok) throw new Error(`API request failed: ${response.status}`);
      
      const encryptedData = await response.json();
      if (!encryptedData.Data) throw new Error('No encrypted data received for tasks');
      
      const decryptedData = await decryptData(encryptedData.Data);
      const parsedData = validateJsonData(decryptedData);
      if (parsedData.Status !== 200) throw new Error(parsedData.message || 'API error');
      
      const transformedTasks = transformApiData(parsedData.Data.Records || [], badgeOptions);
      setTasks(transformedTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message || 'Failed to fetch tasks');
    }
  };

  const updateStarred = async (coverPageNo, starred) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/Inboxactivity`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          coverpageno: coverPageNo,
          starred: starred ? 1 : 0,
          token: API_TOKEN
        })
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to update starred status:', error);
      return false;
    }
  };

  const onToggleFavorite = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const newStarredStatus = !task.favorite;
    setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? { ...t, favorite: newStarredStatus } : t));
    const success = await updateStarred(task.coverPageNo, newStarredStatus);
    if (!success) {
      setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? { ...t, favorite: !newStarredStatus } : t));
    } else {
      await fetchTasks(); // Refresh data on success
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!isWebCryptoSupported()) throw new Error('WebCrypto API not supported');
        await fetchBadgeOptions();
      } catch (err) {
        setError(err.message || 'Failed to load initial data');
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const loadTasks = async () => {
      if (badgeOptions.length > 0) {
        await fetchTasks();
        setLoading(false);
      }
    };
    loadTasks();
  }, [badgeOptions]);

  const onToggleTaskSelection = (taskId) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) newSelected.delete(taskId);
    else newSelected.add(taskId);
    setSelectedTasks(newSelected);
  };

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleTasksPerPageChange = (e) => {
    setTasksPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const getGridTemplate = () => {
    if (responsive.isMobile) return "1fr";
    if (responsive.isTablet) return "40px 60px 140px minmax(0,1fr) 100px 80px 130px";
    return "50px 70px 180px minmax(0,1fr) 120px 90px 160px 180px 140px";
  };

  if (loading) {
    return (
      <div style={{ padding: "24px", backgroundColor: palette.light, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <IconLoader2 size={32} color={palette.primary} style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: palette.text.secondary, fontSize: "16px" }}>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "24px", backgroundColor: palette.light, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <IconAlertCircle size={32} color={palette.danger} />
        <p style={{ color: palette.danger, fontSize: "16px", textAlign: "center" }}>{error}</p>
        <button onClick={() => window.location.reload()} style={{ padding: "8px 16px", background: palette.primary, color: palette.white, border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "500" }}>
          Retry
        </button>
      </div>
    );
  }

  if (responsive.isMobile) {
    return (
      <div style={{ padding: "16px", backgroundColor: palette.light, minHeight: "100vh" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {currentTasks.map((task, index) => (
            <div key={task.id} style={{ background: palette.white, borderRadius: "12px", border: `1px solid ${palette.border}`, padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button onClick={() => onToggleFavorite(task.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
                    {task.favorite ? <IconStarFilled size={18} color={palette.warning} /> : <IconStar size={18} color={palette.text.muted} />}
                  </button>
                  <span style={{ fontSize: "12px", color: palette.text.secondary, fontFamily: "monospace" }}>#{String(indexOfFirstTask + index + 1).padStart(2, "0")}</span>
                </div>
                <PriorityIcon priority={task.priority} />
              </div>
              <div style={{ marginBottom: "8px" }}><span style={{ fontSize: "12px", color: palette.primary, fontWeight: "600", fontFamily: "monospace" }}>{task.coverPageNo}</span></div>
              <div style={{ marginBottom: "12px" }}><h3 style={{ fontSize: "14px", fontWeight: "500", color: palette.text.primary, margin: 0, lineHeight: "1.4" }}>{task.processName}</h3></div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                <ProfileAvatar initiator={task.initiator} />
                <BadgeChip badge={task.badge} coverPageNo={task.coverPageNo} fetchTasks={fetchTasks} badgeOptions={badgeOptions} />
              </div>
              <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                <ProgressBar progress={task.progress} color={task.statusColor} />
                <span style={{ fontSize: "12px", color: palette.text.secondary, fontWeight: "500" }}>{task.progress}%</span>
              </div>
              <div style={{ marginTop: "8px", textAlign: "right" }}><span style={{ fontSize: "12px", color: palette.text.muted }}>{task.updatedOn}</span></div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", padding: "16px", background: palette.white, borderRadius: "8px", border: `1px solid ${palette.border}` }}>
          <button onClick={() => paginate(Math.max(1, currentPage - 1))} disabled={currentPage === 1} style={{ padding: "8px 12px", border: `1px solid ${palette.border}`, borderRadius: "6px", background: palette.white, cursor: "pointer", opacity: currentPage === 1 ? 0.5 : 1, display: "flex", alignItems: "center" }}><IconChevronLeft size={16} /></button>
          <span style={{ fontSize: "14px", color: palette.text.secondary }}>Page {currentPage} of {totalPages}</span>
          <button onClick={() => paginate(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} style={{ padding: "8px 12px", border: `1px solid ${palette.border}`, borderRadius: "6px", background: palette.white, cursor: "pointer", opacity: currentPage === totalPages ? 0.5 : 1, display: "flex", alignItems: "center" }}><IconChevronRight size={16} /></button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: responsive.isTablet ? "16px" : "24px", backgroundColor: palette.light, minHeight: "100vh" }}>
      <div style={{ background: palette.white, borderRadius: "12px", border: `1px solid ${palette.border}`, boxShadow: "0 4px 24px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <div style={{ background: palette.light, padding: "16px 20px", borderBottom: `1px solid ${palette.border}`, display: "grid", gridTemplateColumns: getGridTemplate(), gap: "16px", fontSize: "12px", fontWeight: "600", color: palette.text.secondary, textTransform: "uppercase", letterSpacing: "0.5px", alignItems: "center" }}>
          <div></div>
          <div>Si.No.</div>
          <div>Track ID</div>
          <div>Process Name</div>
          <div>Initiator</div>
          <div>Priority</div>
          <div>Status</div>
          {!responsive.isTablet && <div>Progress</div>}
          {!responsive.isTablet && <div>Updated</div>}
        </div>
        <div style={{ minHeight: "400px" }}>
          {currentTasks.length === 0 ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px", color: palette.text.muted }}>No tasks found</div>
          ) : (
            currentTasks.map((task, index) => (
              <div
                key={task.id}
                style={{ display: "grid", gridTemplateColumns: getGridTemplate(), gap: "16px", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${palette.border}`, transition: "all 0.2s ease", background: selectedTasks.has(task.id) ? `${palette.primary}08` : "transparent" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = selectedTasks.has(task.id) ? `${palette.primary}12` : palette.hover; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = selectedTasks.has(task.id) ? `${palette.primary}08` : "transparent"; }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <button onClick={() => onToggleFavorite(task.id)} style={{ background: "none", border: "none", cursor: "pointer", transition: "transform 0.2s ease", display: "flex", alignItems: "center", justifyContent: "center", padding: "4px", borderRadius: "4px" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.background = palette.hover; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "transparent"; }}>
                    {task.favorite ? <IconStarFilled size={18} color={palette.warning} /> : <IconStar size={18} color={palette.text.muted} />}
                  </button>
                </div>
                <div><span style={{ fontSize: "14px", fontWeight: "500", color: palette.text.secondary, fontFamily: "monospace" }}>{String(indexOfFirstTask + index + 1).padStart(2, "0")}</span></div>
                <div><span style={{ fontSize: responsive.isTablet ? "12px" : "14px", fontWeight: "600", color: palette.primary, fontFamily: "monospace" }}>{task.coverPageNo}</span></div>
                <div><span style={{ fontSize: responsive.isTablet ? "13px" : "14px", fontWeight: "500", color: palette.text.primary, lineHeight: "1.4" }} title={task.processName}>{task.processName}</span></div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}><ProfileAvatar initiator={task.initiator} /></div>
                <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}><PriorityIcon priority={task.priority} /></div>
                <div>
                  <BadgeChip badge={task.badge} coverPageNo={task.coverPageNo} fetchTasks={fetchTasks} badgeOptions={badgeOptions} />
                </div>
                {!responsive.isTablet && (
                  <>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <ProgressBar progress={task.progress} color={task.statusColor || palette.primary} />
                        <span style={{ fontSize: "12px", color: palette.text.secondary, fontWeight: "500", minWidth: "35px", fontFamily: "monospace" }}>{task.progress}%</span>
                      </div>
                    </div>
                    <div><span style={{ fontSize: "13px", color: palette.text.secondary, fontWeight: "400" }}>{task.updatedOn}</span></div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderTop: `1px solid ${palette.border}`, background: palette.light, flexWrap: responsive.isTablet ? "wrap" : "nowrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "14px", color: palette.text.secondary, fontWeight: "500" }}>Show:</span>
            <select value={tasksPerPage} onChange={handleTasksPerPageChange} style={{ padding: "6px 12px", border: `1px solid ${palette.border}`, borderRadius: "6px", fontSize: "14px", background: palette.white, color: palette.text.primary, fontWeight: "500", cursor: "pointer" }}>
              <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option>
            </select>
            <span style={{ fontSize: "14px", color: palette.text.secondary }}>entries</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", order: responsive.isTablet ? 3 : 2 }}><span style={{ fontSize: "14px", color: palette.text.secondary, fontWeight: "500" }}>{indexOfFirstTask + 1}–{Math.min(indexOfLastTask, tasks.length)} of {tasks.length}</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", order: responsive.isTablet ? 2 : 3 }}>
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} style={{ padding: "8px 12px", border: `1px solid ${palette.border}`, borderRadius: "6px", background: palette.white, cursor: "pointer", opacity: currentPage === 1 ? 0.5 : 1, color: palette.text.primary, display: "flex", alignItems: "center", transition: "all 0.2s ease" }} onMouseEnter={(e) => { if (currentPage !== 1) e.currentTarget.style.background = palette.hover; }} onMouseLeave={(e) => { e.currentTarget.style.background = palette.white; }}><IconChevronLeft size={16} /></button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;
              if (pageNum > totalPages || pageNum < 1) return null;
              return (<button key={pageNum} onClick={() => paginate(pageNum)} style={{ padding: "8px 12px", border: `1px solid ${currentPage === pageNum ? palette.primary : palette.border}`, borderRadius: "6px", background: currentPage === pageNum ? palette.primary : palette.white, color: currentPage === pageNum ? palette.white : palette.text.primary, cursor: "pointer", minWidth: "40px", fontWeight: "600", transition: "all 0.2s ease" }} onMouseEnter={(e) => { if (currentPage !== pageNum) e.currentTarget.style.background = palette.hover; }} onMouseLeave={(e) => { if (currentPage !== pageNum) e.currentTarget.style.background = palette.white; }}>{pageNum}</button>);
            })}
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} style={{ padding: "8px 12px", border: `1px solid ${palette.border}`, borderRadius: "6px", background: palette.white, cursor: "pointer", opacity: currentPage === totalPages ? 0.5 : 1, color: palette.text.primary, display: "flex", alignItems: "center", transition: "all 0.2s ease" }} onMouseEnter={(e) => { if (currentPage !== totalPages) e.currentTarget.style.background = palette.hover; }} onMouseLeave={(e) => { e.currentTarget.style.background = palette.white; }}><IconChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskTableDemo;