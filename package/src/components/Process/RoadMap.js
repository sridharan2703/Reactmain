/**
 * @fileoverview Compact Roadmap component with API Integration
 * @module components/Roadmap
 * @author Rakshana
 * @date 12/08/2025
 */
import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  useMediaQuery,
  useTheme
} from '@mui/material';
import Cookies from "js-cookie";
import {
  decryptData,
  validateJsonData,
  isWebCryptoSupported,
  encryptPayloadForGo
} from "src/components/Encryption/EncryptionKey";
import { HostName2 } from "src/assets/host/Host";

const customFontStyles = {
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  fontSize: "12px",
  fontWeight: 400,
};

const ROADMAP_API_URL = `${HostName2}/Getflow`;

const getAuthHeaders = async () => {
  const token = Cookies.get("HRToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Compact Process Roadmap Component with dynamic steps
 * Dynamically fetches flow data from API to determine steps, completed/rejected steps
 * @param {Object} props - Component props
 * @param {number} props.processId - Process ID for the workflow (required)
 * @param {number} props.currentActivity - Current active activity (1-based index from ActivitySeqNo) (required)
 * @param {string} props.signingAuthority - Signing authority for conditions (required)
 * @param {string} props.sessionId - Session ID for API calls (required)
 * @returns {JSX.Element} The rendered roadmap component
 */
const Roadmap = ({
  processId,
  currentActivity,
  signingAuthority,
  sessionId,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const scrollRef = useRef(null);

  const [roadmapSteps, setRoadmapSteps] = useState([]);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [rejectedSteps, setRejectedSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentStep = currentActivity - 1; // Convert to 0-based for internal logic
  const stepsPalette = [
    { color: "#ef4444", bgColor: "rgba(239, 68, 68, 0.05)" },
    { color: "#10b981", bgColor: "rgba(16, 185, 129, 0.05)" },
    { color: "#3b82f6", bgColor: "rgba(59, 130, 246, 0.05)" },
    { color: "#8b5cf6", bgColor: "rgba(139, 92, 246, 0.05)" },
    { color: "#f59e0b", bgColor: "rgba(245, 158, 11, 0.05)" },
    { color: "#06b6d4", bgColor: "rgba(6, 182, 212, 0.05)" },
    { color: "#84cc16", bgColor: "rgba(132, 204, 22, 0.05)" }
  ];

  useEffect(() => {
    const fetchFlow = async () => {
      if (!processId || !currentActivity || !signingAuthority || !sessionId) {
        console.error("Missing required props: processId, currentActivity, signingAuthority, or sessionId");
        setLoading(false);
        setRoadmapSteps([]);
        setCompletedSteps([]);
        setRejectedSteps([]);
        return;
      }

      if (!isWebCryptoSupported()) {
        console.warn("WebCrypto not supported, falling back to defaults");
        setLoading(false);
        setRoadmapSteps([]);
        setCompletedSteps([]);
        setRejectedSteps([]);
        return;
      }

      try {
        setLoading(true);
        const role = Cookies.get("selectedRole") || signingAuthority;
        const rawPayload = {
          token: "HRFGVJISOVp1fncC",
          session_id: sessionId,
          ProcessId: processId,
          Current_Activity: currentActivity,
          Conditions: {
            choice: signingAuthority,
          },
        };

        const encryptedPayload = await encryptPayloadForGo(rawPayload);
        const headers = await getAuthHeaders();
        
        const response = await fetch(ROADMAP_API_URL, {
          method: "POST",
          headers,
          body: JSON.stringify({ Data: encryptedPayload }),
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const encryptedResponse = await response.json();
        const encryptedData = encryptedResponse?.Data;
        if (!encryptedData) {
          throw new Error("No encrypted data received from server.");
        }
        const decryptedData = await decryptData(encryptedData);
        const parsedData = validateJsonData(decryptedData) ? decryptedData : JSON.parse(decryptedData);
        if (
          !parsedData.Status ||
          !(String(parsedData.Status).startsWith("HRM-BUS-SUC") || String(parsedData.Status) === '200')
        ) {
          throw new Error(
            parsedData.message || `API Error: ${parsedData.Status}`
          );
        }
        const statusMap = {
          1: "pending",      // PENDING
          2: "completed",    // APPROVED
          3: "current",      // CURRENT
          4: "pending",      // NEXT (treat as pending)
          5: "pending",      // NO_REJECTION (no change)
          6: "rejected",     // DEFAULT_REJECTION
          7: "rejected"      // CUSTOM_REJECTION
        };

        const records = parsedData.Data.Records || [];
        console.log("Parsed flow records:", records);
        const sortedRecords = records.sort((a, b) => (a.step_no || 0) - (b.step_no || 0));
        const dynamicSteps = sortedRecords.map((r, index) => {
          const paletteIndex = index % stepsPalette.length;
          return {
            id: r.step_no || index + 1,
            title: r.activity_name || `Activity ${r.step_no || index + 1}`,
            description: r.role_name || `Step ${r.step_no || index + 1} details`,
            color: stepsPalette[paletteIndex].color,
            bgColor: stepsPalette[paletteIndex].bgColor,
          };
        });

        setRoadmapSteps(dynamicSteps);
        const completed = sortedRecords
          .filter((r) => statusMap[r.status] === "completed")
          .map((r) => (r.step_no || 1) - 1)
          .filter((i) => i >= 0 && i < dynamicSteps.length);

        const rejected = sortedRecords
          .filter((r) => statusMap[r.status] === "rejected")
          .map((r) => (r.step_no || 1) - 1)
          .filter((i) => i >= 0 && i < dynamicSteps.length);

        setCompletedSteps(completed);
        setRejectedSteps(rejected);
      } catch (error) {
        console.error("Failed to fetch flow:", error);
        setRoadmapSteps([]);
        setCompletedSteps(Array.from({ length: currentStep }, (_, i) => i));
        setRejectedSteps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFlow();
  }, [processId, currentActivity, signingAuthority, sessionId]);

  const getStepStatus = (stepIndex) => {
    if (rejectedSteps.includes(stepIndex)) return 'rejected';
    if (completedSteps.includes(stepIndex)) return 'completed';
    if (stepIndex === currentStep) return 'current';
    if (stepIndex < currentStep) return 'completed';
    return 'pending';
  };

  const getStepStyles = (step, index, status) => {
    let borderColor = '#e5e7eb';
    let backgroundColor = '#ffffff';
    let shadowIntensity = '0 1px 3px rgba(0, 0, 0, 0.05)';

    switch (status) {
      case 'completed':
        borderColor = '#10b981';
        backgroundColor = 'rgba(16, 185, 129, 0.05)';
        shadowIntensity = '0 2px 8px rgba(16, 185, 129, 0.15)';
        break;
      case 'rejected':
        borderColor = '#ef4444';
        backgroundColor = 'rgba(239, 68, 68, 0.02)';
        shadowIntensity = '0 2px 8px rgba(239, 68, 68, 0.15)';
        break;
      case 'current':
        borderColor = '#f59e0b';
        backgroundColor = 'rgba(245, 158, 11, 0.05)';
        shadowIntensity = '0 4px 12px rgba(245, 158, 11, 0.25)';
        break;
      case 'pending':
        borderColor = '#3b82f6';
        backgroundColor = 'rgba(59, 130, 246, 0.02)';
        shadowIntensity = '0 1px 3px rgba(59, 130, 246, 0.1)';
        break;
    }

    return { borderColor, backgroundColor, shadowIntensity };
  };

  const getStepNumberColor = (status) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      case 'current':
        return '#f59e0b';
      default:
        return '#3b82f6';
    }
  };

  const ConnectorLine = ({ status }) => {
    let lineColor = '#3b82f6';
    if (status === 'completed') lineColor = '#10b981';
    if (status === 'rejected') lineColor = '#ef4444';
    if (status === 'current') lineColor = '#f59e0b';

    return (
      <Box
        sx={{
          width: 30,
          height: 3,
          backgroundColor: lineColor,
          borderRadius: '2px',
          position: 'relative',
          mx: 1,
          '&::after': {
            content: '""',
            position: 'absolute',
            right: -2,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderLeft: `4px solid ${lineColor}`,
            borderTop: '2px solid transparent',
            borderBottom: '2px solid transparent',
          }
        }}
      />
    );
  };

  if (loading) {
    return (
      <Card sx={{ mb: 2, p: 2, textAlign: 'center', borderRadius: '12px' }}>
        <Typography variant="body2" color="textSecondary">
          Loading roadmap...
        </Typography>
      </Card>
    );
  }

  if (roadmapSteps.length === 0) {
    return (
      <Card sx={{ mb: 2, p: 2, textAlign: 'center', borderRadius: '12px' }}>
        <Typography variant="body2" color="textSecondary">
          No roadmap steps available.
        </Typography>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        overflow: 'visible',
        background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Steps Container */}
        <Box sx={{ position: 'relative', px: 1, py: 1, overflow: 'visible' }}>
          {/* Steps Container */}
          <Box
            ref={scrollRef}
            sx={{
              display: 'flex',
              flexWrap: 'nowrap',
              gap: 2,
              py: 5,
              pb: 4,
              px: 3,
              overflowX: 'auto',
              overflowY: 'hidden',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'thin',
              '&::-webkit-scrollbar': {
                height: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#c1c1c1',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#a8a8a8',
              },
              scrollBehavior: 'smooth',
            }}
          >
            {roadmapSteps.map((step, index) => {
              const status = getStepStatus(index);
              const styles = getStepStyles(step, index, status);

              return (
                <React.Fragment key={step.id}>
                  {/* Step Card */}
                  <Box
                    sx={{
                      minWidth: 200,
                      maxWidth: 200,
                      position: 'relative',
                      overflow: 'visible',
                      paddingTop: '10px',
                      paddingBottom: '6px',
                      paddingX: '8px',
                      flexShrink: 0, // Prevent shrinking on scroll
                    }}
                  >
                    {/* Step Number Badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 4,
                        left: 20,
                        zIndex: 2,
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        backgroundColor: getStepNumberColor(status),
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        border: '2px solid white'
                      }}
                    >
                      {step.id}
                    </Box>

                    {/* Main Step Card */}
                    <Card
                      sx={{
                        minHeight: 100,
                        height: 'auto',
                        border: status === 'current' ? `3px solid ${styles.borderColor}` : `2px solid ${styles.borderColor}`,
                        backgroundColor: styles.backgroundColor,
                        borderRadius: '12px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: status === 'current' ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: status === 'current' ? '0 8px 25px rgba(245, 158, 11, 0.4)' : styles.shadowIntensity,
                        position: 'relative',
                        overflow: 'visible',
                        animation: status === 'current' ? 'pulse 2s infinite' : 'none',
                        '@keyframes pulse': {
                          '0%, 100%': {
                            boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4)',
                          },
                          '50%': {
                            boxShadow: '0 8px 35px rgba(245, 158, 11, 0.6)',
                          },
                        },
                        '&:hover': {
                          transform: status === 'current' ? 'scale(1.05)' : 'scale(1.01)',
                          boxShadow: status === 'current' ? '0 12px 30px rgba(245, 158, 11, 0.5)' : '0 6px 16px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 2, pt: 3 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            ...customFontStyles,
                            fontWeight: status === 'current' ? 700 : 600,
                            fontSize: '0.875rem',
                            color: status === 'pending' ? '#1e40af' : status === 'current' ? '#92400e' : '#065f46',
                            mb: 0.5,
                            lineHeight: 1.2
                          }}
                        >
                          {step.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            ...customFontStyles,
                            fontSize: '0.75rem',
                            color: status === 'pending' ? '#1e40af' : status === 'current' ? '#92400e' : '#065f46',
                            lineHeight: 1.4,
                          }}
                        >
                          {step.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>

                  {/* Connector Line (except for last step) */}
                  {index < roadmapSteps.length - 1 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, flexShrink: 0 }}>
                      <ConnectorLine status={status} />
                    </Box>
                  )}
                </React.Fragment>
              );
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Roadmap;