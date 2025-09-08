/**
 * @fileoverview Profile component for displaying and switching user roles with auto-logout on inactivity.
 * @module src/layouts/full/header/Profile
 * @author Rakshana
 * @date 16/07/2025
 * @since 1.0.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemText,
  Typography,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';

import ProfileImg from 'src/assets/images/profile/user-1.jpg';
import {
  decryptData,
  validateJsonData,
  isWebCryptoSupported,
} from 'src/components/Decryption/Decrypt';
import Cookies from 'js-cookie';

const getAuthHeaders = async () => {
  const encryptedToken = Cookies.get('HRToken');
     
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${encryptedToken}`,
  };
};

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [roleData, setRoleData] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const IMMEDIATE_LOGOUT_MODE = true; // Enabled for immediate checks on user interaction
  const SESSION_CHECK_INTERVAL = 30 * 1000; // Check session every 30 seconds
  const INACTIVITY_CHECK_INTERVAL = 5 * 1000; // Check inactivity every 5 seconds
  const INACTIVITY_TIMEOUT = 3600 * 1000; // Auto-logout after 1 minute of inactivity
  const RETRY_ATTEMPTS = 0; // No retries for faster logout
  const RETRY_DELAY = 1000; // Base delay (not used due to no retries)
  const MIN_CHECK_INTERVAL = 15 * 1000; // Minimum time between session checks
  
  const timeoutRef = React.useRef(null);
  const sessionCheckRef = React.useRef(null);
  const inactivityCheckRef = React.useRef(null);
  const retryCountRef = React.useRef(0);
  const isCheckingSessionRef = React.useRef(false);
  const isComponentMountedRef = React.useRef(true);
  const lastSuccessfulCheckRef = React.useRef(null);
  
  const API_BASE_URL = 'https://wftest1.iitm.ac.in:5000';
  const API_TOKEN = 'HRFGVJISOVp1fncC';

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const setCookie = (name, value, days = 1) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  };

  const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };
  
  const getLoginName = () => {
    const loginName = sessionStorage.getItem('username') || 
                     localStorage.getItem('username') || 
                     getCookie('username');
    return loginName;
  };

  const handleLogout = useCallback(async (isAutoLogout = false) => {
    try {
      stopSessionMonitoring();
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      const sessionId = getCookie('session_id');
      const clearAllStorage = () => {
        deleteCookie('session_id');
        deleteCookie('selectedRole');
        deleteCookie('userRole');
        deleteCookie('userId');
        deleteCookie('EmpId');
        deleteCookie('username');
        deleteCookie('userData');
        deleteCookie('HRToken');
        deleteCookie('isAuthenticated');
        sessionStorage.clear();
        localStorage.removeItem('username');
        localStorage.removeItem('userRole');
      };

      if (!sessionId) {
        clearAllStorage();
        navigate('/auth/login', { replace: true });
        return;
      }
      try {
        const headers = await getAuthHeaders();
        await fetch(`${API_BASE_URL}/SessionTimeout`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            token: API_TOKEN,
            session_id: sessionId,
            idletimeout: isAutoLogout ? 1 : 0
          }),
          signal: AbortSignal.timeout(2000)
        });
      } catch (apiError) {
      }
      clearAllStorage();
      if (isComponentMountedRef.current) {
        navigate('/auth/login', { replace: true });
      } else {
        window.location.href = '/auth/login';
      }
      
    } catch (error) {
      deleteCookie('session_id');
      deleteCookie('selectedRole');
      deleteCookie('userRole');
      deleteCookie('userId');
      deleteCookie('EmpId');
      deleteCookie('username');
      deleteCookie('userData');
      deleteCookie('HRToken');
      deleteCookie('isAuthenticated');
      sessionStorage.clear();
      localStorage.removeItem('username');
      localStorage.removeItem('userRole');
      
      if (isComponentMountedRef.current) {
        navigate('/auth/login', { replace: true });
      } else {
        window.location.href = '/auth/login';
      }
    }
    
    handleClose2();
  }, [navigate]);

  const checkSessionStatus = useCallback(async (isRetry = false, isUserInteraction = false) => {
    
    if (isCheckingSessionRef.current) {
      return true;
    }

    if (
      !isUserInteraction &&
      lastSuccessfulCheckRef.current &&
      Date.now() - lastSuccessfulCheckRef.current < MIN_CHECK_INTERVAL
    ) {
      return true;
    }

    if (!isWebCryptoSupported()) {
      isCheckingSessionRef.current = false;
      await handleLogout(true);
      return false;
    }
    if (!isComponentMountedRef.current) {
      return false;
    }

    isCheckingSessionRef.current = true;

    try {
      const sessionId = getCookie('session_id');
      
      if (!sessionId) {
        isCheckingSessionRef.current = false;
        await handleLogout(true);
        return false;
      }

      const headers = await getAuthHeaders();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch(`${API_BASE_URL}/Sessiondata`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          token: API_TOKEN,
          Session_id: sessionId
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Session check failed with status: ${response.status}`);
      }

      const encryptedData = await response.json();
      
      if (!encryptedData.Data) {
        throw new Error('No encrypted session data received');
      }
      
      const decryptedData = await decryptData(encryptedData.Data);
      const parsedData = validateJsonData(decryptedData);
      
      if (parsedData.Status === 200 && parsedData.Data) {
        const sessionData = parsedData.Data;
        if (!sessionData.Records || !Array.isArray(sessionData.Records) || sessionData.Records.length === 0) {
          isCheckingSessionRef.current = false;
          await handleLogout(true);
          return false;
        }
        const sessionRecord = sessionData.Records[0];
        if (!sessionRecord.hasOwnProperty('is_active')) {
          isCheckingSessionRef.current = false;
          await handleLogout(true);
          return false;
        }
        
        const isActive = sessionRecord.is_active;
        if (sessionRecord.created_at) {
          const sessionCreated = new Date(sessionRecord.created_at).getTime();
          const currentTime = Date.now();
          const SESSION_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
          if (currentTime - sessionCreated > SESSION_MAX_AGE) {
            isCheckingSessionRef.current = false;
            await handleLogout(true);
            return false;
          }
        }

        if (isActive === 0 || isActive === "0" || isActive === false || isActive === "false") {
          isCheckingSessionRef.current = false;
          await handleLogout(true);
          return false;
        } else if (isActive === 1 || isActive === "1" || isActive === true || isActive === "true") {
          lastSuccessfulCheckRef.current = Date.now();
          retryCountRef.current = 0;
          isCheckingSessionRef.current = false;
          return true;
        } else if (isActive === null || isActive === undefined) {
          isCheckingSessionRef.current = false;
          await handleLogout(true);
          return false;
        } else {
          throw new Error(`Invalid session status: ${isActive} (type: ${typeof isActive})`);
        }
      } else {
        throw new Error(`Invalid session response structure - Status: ${parsedData.Status}`);
      }
    } catch (err) {
      isCheckingSessionRef.current = false;
      await handleLogout(true);
      return false;
    }
  }, [handleLogout]);

  const startSessionMonitoring = useCallback(() => {
    
    if (sessionCheckRef.current) {
      clearInterval(sessionCheckRef.current);
    }
    const immediateCheck = async () => {
      if (!isComponentMountedRef.current) {
        return;
      }
      await checkSessionStatus(false, false);
    };
    immediateCheck();
    const checkSession = async () => {
      if (!isComponentMountedRef.current) {
        return;
      }
      await checkSessionStatus();
    };
    sessionCheckRef.current = setInterval(checkSession, SESSION_CHECK_INTERVAL);
  }, [checkSessionStatus]);

  const startInactivityMonitoring = useCallback(() => {
    
    if (inactivityCheckRef.current) {
      clearInterval(inactivityCheckRef.current);
    }

    const checkInactivity = async () => {
      if (!isComponentMountedRef.current) {
        return;
      }

      const lastActivity = parseInt(sessionStorage.getItem('lastActivity') || '0', 10);
      const timeSinceLastActivity = Date.now() - lastActivity;

      if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
        await handleLogout(true);
      }
    };

    inactivityCheckRef.current = setInterval(checkInactivity, INACTIVITY_CHECK_INTERVAL);
  }, [handleLogout]);

  const stopSessionMonitoring = useCallback(() => {
    if (sessionCheckRef.current) {
      clearInterval(sessionCheckRef.current);
      sessionCheckRef.current = null;
    }
    if (inactivityCheckRef.current) {
      clearInterval(inactivityCheckRef.current);
      inactivityCheckRef.current = null;
    }
    isCheckingSessionRef.current = false;
    retryCountRef.current = 0;
  }, []);
  
  const fetchRoleData = useCallback(async () => {
    if (!isWebCryptoSupported()) {
      setError('Web Crypto API not supported in this browser');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const loginName = getLoginName();
      
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/Defaultrole`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          token: API_TOKEN,
          UserName: loginName
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const encryptedData = await response.json();
      
      if (!encryptedData.Data) {
        throw new Error('No encrypted data received from API');
      }
      
      const decryptedData = await decryptData(encryptedData.Data);
      const parsedData = validateJsonData(decryptedData);
      
      if (parsedData.Status === 200 && parsedData.Data) {
        setRoleData(parsedData.Data);
        const savedRole = getCookie('selectedRole');
        const activeRoles = parsedData.Data.Records.filter(role => role.IsActive === "true");
        
        if (savedRole && activeRoles.some(role => role.RoleName === savedRole)) {
          setSelectedRole(savedRole);
        } else if (activeRoles.length > 0) {
          const defaultRole = activeRoles[0].RoleName;
          setSelectedRole(defaultRole);
          setCookie('selectedRole', defaultRole);
        }
      } else {
        throw new Error(parsedData.message || 'Failed to fetch role data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    isComponentMountedRef.current = true;
    
    fetchRoleData();
    startSessionMonitoring();
    startInactivityMonitoring();
    return () => {
      isComponentMountedRef.current = false;
      stopSessionMonitoring();
    };
  }, [fetchRoleData, startSessionMonitoring, startInactivityMonitoring, stopSessionMonitoring]);

  const handleRoleSelect = async (roleName) => {
    const isSessionValid = await checkSessionStatus(false, true);
    
    if (!isSessionValid) {
      return;
    }
    
    const previousRole = selectedRole;
    
    setSelectedRole(roleName);
    setCookie('selectedRole', roleName);
    setCookie('userRole', roleName, 7);
    
    const userDataCookie = getCookie('userData');
    if (userDataCookie) {
      try {
        const userData = JSON.parse(userDataCookie);
        userData.role = roleName;
        setCookie('userData', JSON.stringify(userData), 7);
      } catch (e) {
      }
    }
    
    if (sessionStorage.getItem('userRole')) {
      sessionStorage.setItem('userRole', roleName);
    }
    if (localStorage.getItem('userRole')) {
      localStorage.setItem('userRole', roleName);
    }
    
    handleClose2();
    window.dispatchEvent(new CustomEvent('roleChanged', { 
      detail: { newRole: roleName } 
    }));
    if (previousRole && previousRole !== roleName) {
      window.location.href = '/dashboard';
    } else if (!previousRole) {
      navigate('/dashboard');
    }
  };

  const handleUserActivity = useCallback(async (event) => {
    if (IMMEDIATE_LOGOUT_MODE) {
      await checkSessionStatus(false, true);
    }
    sessionStorage.setItem('lastActivity', Date.now().toString());
  }, [checkSessionStatus]);

  useEffect(() => {
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'focus',
      'blur',
      'keydown'
    ];
    const addEventListeners = () => {
      events.forEach(event => {
        document.addEventListener(event, handleUserActivity, { 
          passive: true, 
          capture: true 
        });
      });
    };

    const removeEventListeners = () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, { capture: true });
      });
    };

    addEventListeners();
    
    return () => {
      removeEventListeners();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleUserActivity]);

  const handleManualLogout = () => {
    handleLogout(false);
  };

  const handleRefreshRoles = () => {
    fetchRoleData();
  };
  
  const activeRoles = roleData?.Records?.filter(role => role.IsActive === "true") || [];

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="profile menu"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={ProfileImg}
          alt={ProfileImg}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '300px',
            maxHeight: '400px',
            overflowY: 'auto'
          },
        }}
      >
        {/* Current Role Display */}
        {selectedRole && (
          <Box px={2} py={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Current Role:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {selectedRole}
            </Typography>
          </Box>
        )}

        <Divider />

        {/* Role Information Section */}
        <Box px={2} py={1}>
          {error && (
            <Alert severity="error" sx={{ mb: 1, fontSize: '0.75rem' }}>
              {error}
            </Alert>
          )}
          
          {loading && !roleData && (
            <Box display='flex' justifyContent='center' py={2}>
              <CircularProgress size={20} />
            </Box>
          )}
          
          {activeRoles.length > 0 && (
            <Box>
              <Typography variant='caption' color='textSecondary' sx={{ mb: 1, display: 'block' }}>
                {activeRoles.length} active role{activeRoles.length !== 1 ? 's' : ''} available
              </Typography>
              {activeRoles.map((role, index) => (
                <MenuItem 
                  key={index} 
                  onClick={() => handleRoleSelect(role.RoleName)}
                  selected={role.RoleName === selectedRole}
                  sx={{ 
                    mb: 1, 
                    borderRadius: 1,
                    bgcolor: role.RoleName === selectedRole ? 'primary.light' : 'background.paper',
                    '&:hover': {
                      bgcolor: role.RoleName === selectedRole ? 'primary.light' : 'action.hover'
                    }
                  }}
                >
                  <ListItemText
                    primary={role.RoleName}
                    primaryTypographyProps={{
                      fontWeight: role.RoleName === selectedRole ? 'bold' : 'normal',
                      color: role.RoleName === selectedRole ? 'primary.main' : 'text.primary'
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.7rem',
                      color: 'success.main'
                    }}
                  />
                </MenuItem>
              ))}
            </Box>
          )}

          {/* Show message when no active roles are available */}
          {roleData && activeRoles.length === 0 && (
            <Box py={2} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                No active roles available
              </Typography>
            </Box>
          )}
        </Box>

        <Divider />

        <Box mt={1} py={1} px={2}>
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth
            onClick={handleManualLogout}
          >
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;