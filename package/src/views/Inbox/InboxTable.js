import React, { useState, useEffect, useMemo, useRef } from "react";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import {
  Box,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  CircularProgress,
  Alert,
  Tooltip,
  alpha,
  Fade,
  Grow,
} from "@mui/material";
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Warning as WarningIcon,
  KeyboardArrowDown as ArrowDownIcon,
  AssistantPhoto as AssistantPhotoIcon,
  Schedule as ScheduleIcon,
  Brightness1 as DotIcon,
} from "@mui/icons-material";
import { isWebCryptoSupported } from "src/components/Decryption/Decrypt";
import {
  decryptData,
  encryptPayloadForGo,
} from "src/components/Encryption/EncryptionKey";
import Cookies from "js-cookie";
import { navigateWithTaskData } from "src/routes/Router.js";
import { useNavigate } from "react-router-dom";
import { HostName } from "src/assets/host/Host";

const palette = {
  primary: "#1e40af",
  primaryDark: "#1e3a8a",
  secondary: "#64748b",
  success: "#059669",
  warning: "#d97706",
  danger: "#dc2626",
  info: "#0891b2",
  purple: "#7c3aed",
  slate: "#334155",
  navy: "#1e293b",
  gold: "#d97706",
  emerald: "#047857",
  background: "#f8fafc",
  surface: "#ffffff",
};

const getNumericDaysAgo = (dateString) => {
  if (!dateString || dateString === "N/A") return 0;
  const updated = new Date(dateString);
  if (isNaN(updated.getTime())) return 0;
  return Math.ceil(Math.abs(new Date() - updated) / (1000 * 60 * 60 * 24));
};

const getDaysAgoText = (days) => {
  if (days === 0) return "Today";
  return days === 1 ? "1 day" : `${days} days`;
};

// REMOVED: getEmployeeName function is no longer needed

const getHardcodedPriority = (coverPageNo, index, apiPriority) => {
  // If API provides priority (e.g. "Critical"), use it
  if (apiPriority) return apiPriority;

  // Fallback logic if API priority is null
  if (index === 0) return "sla";
  if (coverPageNo === "REF/1001" || index % 5 === 1) return "high";
  if (index % 7 === 0) return "critical";
  return "other";
};

const PriorityCell = ({ priority }) => {
  const getPriorityConfig = (priority) => {
    switch (priority?.toLowerCase()) {
      case "sla":
        return [{ type: "badge", text: "SLA", color: palette.danger }];
      case "critical":
        return [{ type: "icon", icon: <WarningIcon />, color: palette.danger }];
      case "high":
        return [
          {
            type: "icon",
            icon: <AssistantPhotoIcon />,
            color: palette.warning,
          },
        ];
      default:
        return [];
    }
  };

  const configs = getPriorityConfig(priority);
  if (configs.length === 0) return <Box sx={{ minWidth: 40 }} />;

  return (
    <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
      {configs.map((config, index) => (
        <Fade in key={index} timeout={300 + index * 100}>
          <Box>
            {config.type === "badge" ? (
              <Chip
                label={config.text}
                size="small"
                sx={{
                  bgcolor: config.color,
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.65rem",
                  height: 24,
                  borderRadius: 12,
                }}
              />
            ) : (
              <Box
                sx={{
                  p: 0.5,
                  borderRadius: 12,
                  bgcolor: config.color,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {React.cloneElement(config.icon, {
                  sx: { fontSize: 16, color: "white" },
                })}
              </Box>
            )}
          </Box>
        </Fade>
      ))}
    </Box>
  );
};

const BadgeCell = ({
  badge,
  coverPageNo,
  onBadgeUpdate,
  badgeOptions,
  taskId,
  apiToken,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [updating, setUpdating] = useState(false);
  const badgeColors = {
    Later: palette.secondary,
    "On Hold": palette.warning,
    Checking: palette.info,
    Urgent: palette.danger,
    Review: palette.primary,
    Done: palette.success,
  };

  const updateBadge = async (
    newBadgeId,
    newBadgeDescription,
    newStatus,
    priority
  ) => {
    setUpdating(true);
    setAnchorEl(null);

    try {
      const encryptedToken = Cookies.get("HRToken");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptedToken}`,
      };

      const sessionId = Cookies.get("session_id");

      // ✅ STEP 1: Create plain request payload
      const requestData = {
        P_id: sessionId,
        badge: newBadgeId,
        token: apiToken,
        taskid: taskId,
        starred: newStatus ? 1 : 0,
        priority: priority,
      };

      console.log("🔐 UpdateBadge - Plain request:", requestData);

      // ✅ STEP 2: Encrypt the payload
      let encryptedPayloadData;
      try {
        encryptedPayloadData = await encryptPayloadForGo(requestData);
        console.log("🔐 UpdateBadge - Encrypted payload created");
        console.log(
          "🔐 UpdateBadge - Encrypted length:",
          encryptedPayloadData?.length
        );
      } catch (encryptError) {
        console.error("❌ UpdateBadge - Encryption failed:", encryptError);
        throw new Error("Failed to encrypt request data");
      }

      // ✅ STEP 3: Verify encryption worked
      if (!encryptedPayloadData || typeof encryptedPayloadData !== "string") {
        console.error(
          "❌ UpdateBadge - Invalid encrypted data:",
          encryptedPayloadData
        );
        throw new Error("Encryption returned invalid data");
      }

      // ✅ STEP 4: Send encrypted data
      const response = await fetch(
        `${HostName}/Inboxactivity`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ Data: encryptedPayloadData }), // Send encrypted
        }
      );

      console.log("🔐 UpdateBadge - Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      // ✅ STEP 5: Handle encrypted response (optional)
      const encryptedResponse = await response.json();
      console.log("🔐 UpdateBadge - Encrypted response received");

      if (encryptedResponse.Data) {
        try {
          // ✅ STEP 6: Decrypt the response
          const decryptedData = await decryptData(encryptedResponse.Data);
          console.log("🔓 UpdateBadge - Decrypted response:", decryptedData);

          // Parse and validate response
          let parsedResponse;
          if (typeof decryptedData === "string") {
            try {
              parsedResponse = JSON.parse(decryptedData);
            } catch {
              parsedResponse = { message: decryptedData };
            }
          } else {
            parsedResponse = decryptedData;
          }

          // Validate success
          const isSuccess =
            parsedResponse.Status === 200 ||
            parsedResponse.status === 200 ||
            parsedResponse.success === true ||
            (parsedResponse.message &&
              parsedResponse.message.toLowerCase().includes("success"));

          if (!isSuccess) {
            throw new Error(parsedResponse.message || "Badge update failed");
          }

          console.log("✅ UpdateBadge - Successfully updated badge");
        } catch (decryptError) {
          console.warn(
            "⚠️ UpdateBadge - Could not decrypt response, but continuing:",
            decryptError
          );
          // Continue even if decryption fails
        }
      }

      // Call success callback
      if (onBadgeUpdate) onBadgeUpdate(taskId, newBadgeDescription);
    } catch (error) {
      console.error("❌ Failed to update badge:", error);
      // Optional: Show error to user
      // setError(error.message || "Failed to update badge");
    } finally {
      setUpdating(false);
    }
  };

  const badgeColor = badgeColors[badge] || palette.secondary;
  const handleClick = (e) => {
    e.stopPropagation();
    if (!updating) setAnchorEl(e.currentTarget);
  };

  return (
    <>
      <Chip
        label={
          updating ? (
            <CircularProgress size={12} sx={{ color: "white" }} />
          ) : (
            badge
          )
        }
        size="small"
        deleteIcon={
          <ArrowDownIcon sx={{ color: "white !important", fontSize: 14 }} />
        }
        onDelete={handleClick}
        onClick={handleClick}
        disabled={updating}
        sx={{
          bgcolor: badgeColor,
          color: "white",
          fontWeight: 500,
          cursor: "pointer",
          height: 24,
          borderRadius: 12,
          "& .MuiChip-label": { px: updating ? "12px" : "8px" },
          "&:hover": {
            bgcolor: alpha(badgeColor, 0.9),
            transform: "translateY(-1px)",
          },
        }}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        TransitionComponent={Grow}
        slotProps={{
          paper: {
            sx: {
              bgcolor: palette.navy,
              color: "white",
              borderRadius: "8px",
            },
          },
        }}
      >
        {badgeOptions.map((option) => (
          <MenuItem
            key={option.statusid}
            onClick={() =>
              updateBadge(option.statusid, option.statusdescription)
            }
            sx={{
              gap: 1,
              borderRadius: 8,
              mx: 0.5,
              my: 0.25,
              "&:hover": {
                bgcolor: alpha(palette.slate, 0.7),
              },
            }}
          >
            <DotIcon
              fontSize="small"
              sx={{
                color:
                  badgeColors[option.statusdescription] || palette.secondary,
                fontSize: 12,
              }}
            />
            {option.statusdescription}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const TaskTableDemo = ({ activeRole, searchValue, isSidebarOpen }) => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [badgeOptions, setBadgeOptions] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const gridRef = useRef();
  const apiRef = useGridApiRef();

  const API_TOKEN = "HRFGVJISOVp1fncC";
  const Role = Cookies.get("selectedRole");

  // UPDATED: transformApiData to parse Name and ID from the string "ID - Name"
  const transformApiData = (apiRecords, badgeMap) =>
    apiRecords.map((item, index) => {
      return {
        id: item.taskid || index + 1,
        coverPageNo: item.coverpageno,
        processName: item.processname,
        initiatorId: item.employeeid, // Extracted ID
        employeeName: item.Name,
        referenceNo: item.referenceno,
        priority: getHardcodedPriority(item.coverpageno, index, item.priority),
        badge: badgeMap[item.badge] || "Pending",
        updatedOn: item.task_updatedon
          ? new Date(item.task_updatedon).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A",
        favorite: item.starred === "1",
        taskId: item.taskid,
        path: item.path,
        Component: item.component,
        processid: item.processid,
        remarks: item.remarks,
        processkeyword: item.processkeyword,
        activitySeqNo: item.activityseqno,
        daysAgo: getNumericDaysAgo(item.task_updatedon),
      };
    });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!isWebCryptoSupported())
          throw new Error("WebCrypto API not supported");

        const encryptedToken = Cookies.get("HRToken");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${encryptedToken}`,
        };

        // Statusmaster API call
        const badgePayload = {
          token: API_TOKEN,
          statusname: "Badge",
          session_id: Cookies.get("session_id"),
        };

        const encryptedBadgePayload = await encryptPayloadForGo(badgePayload);

        const badgeResponse = await fetch(`${HostName}/Statusmaster`, {
          method: "POST",
          headers,
          body: JSON.stringify({ Data: encryptedBadgePayload }),
        });

        if (!badgeResponse.ok)
          throw new Error(`API Error: ${badgeResponse.status}`);

        const badgeEncrypted = await badgeResponse.json();

        if (!badgeEncrypted.Data) {
          throw new Error("No data received from Statusmaster API");
        }

        const badgeDecrypted = await decryptData(badgeEncrypted.Data);
        let options = [];

        try {
          const badgeParsed = JSON.parse(badgeDecrypted);
          if (
            badgeParsed.Data?.Records &&
            Array.isArray(badgeParsed.Data.Records)
          ) {
            options = badgeParsed.Data.Records;
          } else if (Array.isArray(badgeParsed.Records)) {
            options = badgeParsed.Records;
          } else if (Array.isArray(badgeParsed.Data)) {
            options = badgeParsed.Data;
          } else if (Array.isArray(badgeParsed)) {
            options = badgeParsed;
          }
        } catch (parseError) {
          if (typeof badgeDecrypted === "object" && badgeDecrypted !== null) {
            if (Array.isArray(badgeDecrypted)) {
              options = badgeDecrypted;
            } else if (
              badgeDecrypted.Data?.Records &&
              Array.isArray(badgeDecrypted.Data.Records)
            ) {
              options = badgeDecrypted.Data.Records;
            } else if (Array.isArray(badgeDecrypted.Records)) {
              options = badgeDecrypted.Records;
            }
          }
        }

        setBadgeOptions(options);

        const badgeMap = options.reduce((acc, opt) => {
          acc[opt.statusid] = opt.statusdescription;
          return acc;
        }, {});

        // TaskInbox API call
        const bodyObj = {
          token: API_TOKEN,
          session_id: Cookies.get("session_id"),
          empid: Cookies.get("EmpId"),
          assignedrole: Role,
        };

        if (activeRole !== "All Task") {
          bodyObj.assignedrole = activeRole;
        }

        const encryptedPayload = await encryptPayloadForGo(bodyObj);

        const taskResponse = await fetch(`${HostName}/TaskInbox`, {
          method: "POST",
          headers,
          body: JSON.stringify({ Data: encryptedPayload }),
        });

        if (!taskResponse.ok) {
          const errorText = await taskResponse.text();
          throw new Error(
            `TaskInbox API Error: ${taskResponse.status} - ${errorText}`
          );
        }

        const taskEncrypted = await taskResponse.json();

        if (!taskEncrypted.Data) {
          throw new Error("No encrypted data received from TaskInbox API");
        }

        const taskDecrypted = await decryptData(taskEncrypted.Data);

        let taskParsed;
        try {
          taskParsed = JSON.parse(taskDecrypted);
        } catch (parseError) {
          if (typeof taskDecrypted === "object" && taskDecrypted !== null) {
            taskParsed = taskDecrypted;
          } else {
            throw new Error("Invalid response format from TaskInbox API");
          }
        }

        if (taskParsed.Status !== 200) {
          throw new Error(
            taskParsed.message || "TaskInbox API returned non-200 status"
          );
        }

        const transformed = transformApiData(
          taskParsed.Data.Records || [],
          badgeMap
        );

        setTasks(transformed.sort((a, b) => a.daysAgo - b.daysAgo));
      } catch (err) {
        console.error("Failed to load task data:", err);
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeRole]);

  const filteredTasks = useMemo(() => {
    if (!searchValue || searchValue.trim() === "") {
      return tasks;
    }
    const lowerSearch = searchValue.toLowerCase().trim();
    return tasks
      .filter(
        (task) =>
          task.coverPageNo.toLowerCase().includes(lowerSearch) ||
          task.processName.toLowerCase().includes(lowerSearch) ||
          task.initiatorId.toLowerCase().includes(lowerSearch) ||
          task.referenceNo.toLowerCase().includes(lowerSearch) ||
          task.badge.toLowerCase().includes(lowerSearch) ||
          task.updatedOn.toLowerCase().includes(lowerSearch)
      )
      .sort((a, b) => a.daysAgo - b.daysAgo);
  }, [tasks, searchValue]);

  
  const updateStarred = async (task, newStatus, newBadgeId) => {
    try {
      const encryptedToken = Cookies.get("HRToken");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptedToken}`,
      };

      // ✅ FIX: Get sessionId from cookies and include coverpageno
      const sessionId = Cookies.get("session_id");

      // ✅ FIX: Prepare complete request data with all required fields
      const requestData = {
        P_id: sessionId, // Now properly defined
        session_id: sessionId, // Some endpoints need both
        starred: newStatus ? 1 : 0,
        token: API_TOKEN,
        taskid: task.taskId,
        priority: task.priority || 0,
        badge: newBadgeId || task.badge || "", // Handle badge parameter
      };

      console.log("🔐 Plain request data:", requestData);

      // Encrypt the payload using your service
      const encryptedPayload = await encryptPayloadForGo(requestData);
      console.log("🔐 Encrypted payload length:", encryptedPayload?.length);

      // Send the encrypted payload in the correct format
      const response = await fetch(
        `${HostName}/Inboxactivity`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            Data: encryptedPayload, // This should be the encrypted string
          }),
        }
      );

      console.log("📥 Inboxactivity response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("📥 Raw response received:", responseData);

      // Handle encrypted response if it exists
      if (responseData.Data) {
        try {
          const decryptedResponse = await decryptData(responseData.Data);
          console.log("✅ Response decrypted successfully:", decryptedResponse);

          // ✅ FIX: Validate the response
          let parsedResponse;
          if (typeof decryptedResponse === "string") {
            try {
              parsedResponse = JSON.parse(decryptedResponse);
            } catch {
              parsedResponse = { message: decryptedResponse };
            }
          } else {
            parsedResponse = decryptedResponse;
          }

          // Check if operation was successful
          const isSuccess =
            parsedResponse.Status === 200 ||
            parsedResponse.status === 200 ||
            parsedResponse.success === true ||
            (parsedResponse.message &&
              parsedResponse.message.toLowerCase().includes("success"));

          if (!isSuccess) {
            throw new Error(parsedResponse.message || "Server returned error");
          }
        } catch (decryptError) {
          console.warn("⚠️ Could not decrypt response:", decryptError.message);
          // Continue even if decryption fails, as the HTTP request was successful
        }
      }

      console.log("⭐ Favorite status updated successfully");
    } catch (error) {
      console.error("❌ Failed to update favorite status:", error);

      // Revert the UI change on error
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, favorite: !newStatus } : t))
      );
    }
  };

  const handleBadgeUpdate = (taskId, newBadge) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.taskId === taskId ? { ...task, badge: newBadge } : task
      )
    );
  };

  const handleToggleFavorite = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const newStatus = !task.favorite;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, favorite: newStatus } : t))
    );

    // ✅ FIX: Pass the current badge to maintain it
    updateStarred(task, newStatus, task.badge);
  };
  const handleRowClick = (params) => {
    const taskData = params.row;
    const finalTaskData = {
      TaskId: taskData.taskId,
      Path: taskData.path,
      Component: taskData.Component,
      ProcessName: taskData.processName,
      ProcessId: taskData.processid,
      EmployeeId: taskData.initiatorId,
      Status: taskData.badge,
      UpdatedOn: taskData.updatedOn,
      Remarks: taskData.remarks,
      ProcessKeyword: taskData.processkeyword,
      ActivitySeqNo: taskData.activitySeqNo,
      IsTaskOpened: true,
      CoverPageNo: taskData.coverPageNo,
      ReferenceNo: taskData.referenceNo,
    };
    navigateWithTaskData(navigate, finalTaskData);
  };

  const debouncedResize = useMemo(() => {
    let timeoutId;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        apiRef.current?.resize?.();
      }, 150);
    };
  }, [apiRef]);

  useEffect(() => {
    if (loading || !gridRef.current) return;
    const container = gridRef.current.querySelector(".MuiDataGrid-main");
    if (!container) return;
    const resizeObserver = new ResizeObserver(debouncedResize);
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [loading, debouncedResize]);

  useEffect(() => {
    if (isSidebarOpen !== undefined) {
      const timer = setTimeout(debouncedResize, 400);
      return () => clearTimeout(timer);
    }
  }, [isSidebarOpen, debouncedResize]);

  const columns = [
    {
      field: "favorite",
      headerName: "",
      width: 40,
      sortable: false,
      flex: 0.3,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleFavorite(params.row.id);
          }}
        >
          {params.value ? (
            <StarIcon sx={{ color: palette.gold, fontSize: 18 }} />
          ) : (
            <StarBorderIcon sx={{ color: palette.secondary, fontSize: 18 }} />
          )}
        </IconButton>
      ),
    },
    {
      field: "referenceNo",
      headerName: "Reference No.",
      flex: 0.9,
      minWidth: 140,
      renderCell: (params) => (
        <Box
          sx={{
            display: "inline-flex",
            px: 1,
            py: 0.5,
            borderRadius: 8,
            bgcolor: alpha(palette.primary, 0.06),
            "&:hover": { bgcolor: alpha(palette.primary, 0.1) },
          }}
        >
          <Typography
            component="span"
            sx={{
              color: palette.primary,
              fontWeight: 600,
              fontFamily: "monospace",
              fontSize: "0.8rem",
            }}
          >
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "processName",
      headerName: "Process Name",
      flex: 1.2,
      minWidth: 150,
      renderCell: (params) => (
        <Typography
          fontWeight={600}
          color={palette.navy}
          sx={{ fontSize: "0.85rem" }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "employeeName",
      headerName: "employee info",
      flex: 1,
      minWidth: 160,
      renderCell: (params) => (
        <Tooltip title={`${params.value} (${params.row.initiatorId})`} arrow>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              sx={{
                width: 28,
                height: 28,
                bgcolor: palette.primary,
                fontSize: "0.75rem",
              }}
            ></Avatar>
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ color: palette.navy, fontSize: "0.8rem" }}
            >
              {params.value}
            </Typography>
          </Box>
        </Tooltip>
      ),
    },
    {
      field: "priority",
      headerName: "Priority",
      flex: 0.6,
      minWidth: 80,
      renderCell: (params) => <PriorityCell priority={params.value} />,
    },
    {
      field: "updatedOn",
      headerName: "No. of Days",
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => {
        const numericDaysAgo = params.row.daysAgo || 0,
          daysAgoText = getDaysAgoText(numericDaysAgo),
          isRecent = numericDaysAgo <= 1,
          isOverdue = numericDaysAgo > 2;
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <ScheduleIcon
                sx={{
                  color: isRecent
                    ? palette.success
                    : isOverdue
                    ? palette.danger
                    : palette.secondary,
                  fontSize: 14,
                }}
              />
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  color: isRecent
                    ? palette.success
                    : isOverdue
                    ? palette.danger
                    : palette.navy,
                  fontSize: "0.75rem",
                }}
              >
                {daysAgoText}
              </Typography>
            </Box>
            <Typography
              variant="caption"
              sx={{ color: palette.secondary, fontSize: "0.65rem" }}
            >
              {params.value}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "badge",
      headerName: "Badge",
      flex: 0.9,
      minWidth: 110,
      renderCell: (params) => (
        <BadgeCell
          badge={params.value}
          coverPageNo={params.row.coverPageNo}
          onBadgeUpdate={handleBadgeUpdate}
          badgeOptions={badgeOptions}
          taskId={params.row.taskId}
          hostName={HostName}
          apiToken={API_TOKEN}
        />
      ),
    },
  ];

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ borderRadius: 12 }}>
          <b>Error loading tasks:</b> {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        p: 2,
        background: palette.background,
        borderRadius: 5,
      }}
    >
      <DataGrid
        apiRef={apiRef}
        ref={gridRef}
        rows={filteredTasks}
        columns={columns}
        loading={loading}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 25, 50]}
        getRowHeight={() => "auto"}
        onRowClick={handleRowClick}
        disableRowSelectionOnClick
        autoHeight
        sx={{
          border: "none",
          borderRadius: 5,
          "& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell": {
            transition: "width 150ms ease-in-out",
          },
          "& .MuiDataGrid-cell:focus-within": {
            outline: "none !important",
          },
          "& .MuiDataGrid-main": {
            bgcolor: palette.surface,
            borderRadius: "inherit",
          },
          "& .MuiDataGrid-columnHeader": {
            background: " rgba(24, 82, 129, 1)",
            py: 1.25,
            color: "#ffffff",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 600,
            fontSize: "0.8rem",
            textTransform: "uppercase",
          },
          "& .MuiDataGrid-columnHeader .MuiSvgIcon-root": {
            color: "white",
          },
          "& .MuiDataGrid-row": {
            cursor: "pointer",
            "&:hover": { bgcolor: alpha(palette.primary, 0.03) },
          },
          "& .MuiDataGrid-cell": {
            borderBottom: `1px solid ${alpha(palette.slate, 0.08)}`,
            py: 1.5,
            alignItems: "center",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: `1px solid ${alpha(palette.slate, 0.1)}`,
            bgcolor: palette.background,
          },
        }}
      />
    </Box>
  );
};

export default TaskTableDemo;
