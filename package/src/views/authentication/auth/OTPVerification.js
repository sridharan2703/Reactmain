// // /**
// //  * @fileoverview OTP Verification component for two-factor authentication
// //  * @module src/components/authentication/OtpVerification
// //  * @author Rakshana
// //  * @date 22/07/2025
// //  * @since 1.0.0
// //  */

// // import React, { useState, useEffect, useRef } from 'react';
// // import {
// //   Box,
// //   TextField,
// //   Button,
// //   Alert,
// //   CircularProgress,
// //   Typography,
// //   Checkbox,
// //   FormControlLabel
// // } from '@mui/material';
// // import { Shield, Timer } from '@mui/icons-material';
// // import Cookies from 'js-cookie';
// // import {
// //   decryptData,
// //   validateJsonData,
// //   isWebCryptoSupported,
// // } from 'src/components/Decryption/Decrypt';
// // import { HostName } from "src/assets/host/Host";

// // const getAuthHeaders = async () => {
// //   const encryptedToken = Cookies.get('HRToken');
// //   return {
// //     'Content-Type': 'application/json',
// //     'Authorization': `Bearer ${encryptedToken}`,
// //   };
// // };

// // const OtpVerification = ({
// //   verifiedUser,
// //   onOtpSuccess,
// //   onResendOtp,
// //   phoneNumber,
// //   generatedOtp,
// //   otpLoading = false,
// //   trustDurationDays = 30,
// //   sessionId
// // }) => {
// //   const [otp, setOtp] = useState('');
// //   const [error, setError] = useState('');
// //   const [success, setSuccess] = useState(false);
// //   const [trustDevice, setTrustDevice] = useState(false);
// //   const [isVerifying, setIsVerifying] = useState(false);
// //   const [timeLeft, setTimeLeft] = useState(45);
// //   const [isOtpExpired, setIsOtpExpired] = useState(false);
// //   const [otpSentTime, setOtpSentTime] = useState(Date.now());
// //   const timerRef = useRef(null);
// //   //const API_BASE_URL = 'https://wftest1.iitm.ac.in:5000';
// //   const API_TOKEN = 'HRFGVJISOVp1fncC';

// //   const getUsername = () => {
// //     const username = sessionStorage.getItem('username') ||
// //                     localStorage.getItem('username') ||
// //                     Cookies.get('username');
// //     return username || '';
// //   };

// //   const startOtpTimer = () => {
// //     setTimeLeft(45);
// //     setIsOtpExpired(false);
// //     setOtpSentTime(Date.now());

// //     if (timerRef.current) {
// //       clearInterval(timerRef.current);
// //     }

// //     timerRef.current = setInterval(() => {
// //       setTimeLeft((prevTime) => {
// //         if (prevTime <= 1) {
// //           setIsOtpExpired(true);
// //           clearInterval(timerRef.current);
// //           return 0;
// //         }
// //         return prevTime - 1;
// //       });
// //     }, 1000);
// //   };

// //   useEffect(() => {
// //     startOtpTimer();
// //     return () => {
// //       if (timerRef.current) {
// //         clearInterval(timerRef.current);
// //       }
// //     };
// //   }, []);

// //   const handleOtpSubmit = async () => {
// //     if (otp.trim() === '') {
// //       setError('Please enter the OTP');
// //       return;
// //     }

// //     if (otp.length !== 6) {
// //       setError('OTP must be 6 digits');
// //       return;
// //     }

// //     if (isOtpExpired) {
// //       setError('OTP has expired. Please request a new OTP.');
// //       return;
// //     }

// //     if (!isWebCryptoSupported()) {
// //       setError('Web Crypto API not supported in this browser');
// //       return;
// //     }

// //     setIsVerifying(true);
// //     setError('');

// //     try {
// //       const username = getUsername();
// //       if (!username) {
// //         throw new Error('Username not found. Please login again.');
// //       }

// //       if (!sessionId) {
// //         throw new Error('Session ID not found. Please login again.');
// //       }

// //       const headers = await getAuthHeaders();

// //       const requestBody = {
// //         token: API_TOKEN,
// //         username: username,
// //         mobileno: parseInt(phoneNumber?.replace(/\D/g, '') || '0'),
// //         session_id: sessionId,
// //         otp: parseInt(otp),
// //         otpsendon: new Date(otpSentTime).toISOString(),
// //         otpverifiedon: new Date().toISOString(),
// //         status: 1,
// //         updatedon: new Date().toISOString()
// //       };

// //       const response = await fetch(`${HostName}/Loginotpupdate`, {
// //         method: 'POST',
// //         headers: headers,
// //         body: JSON.stringify(requestBody)
// //       });

// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }

// //       const encryptedData = await response.json();
// //       if (!encryptedData.Data) {
// //         throw new Error('No encrypted data received from API');
// //       }

// //       const decryptedData = await decryptData(encryptedData.Data);
// //       const result = validateJsonData(decryptedData);

// //       console.log('Decrypted OTP verification response:', result);

// //       if (result.success && result.validcheck === '1' && result.message && result.message.includes('successfully') && result.session_id) {
// //         setSuccess(true);
// //         setError('');
// //         Cookies.set('session_id', result.session_id, { expires: 7 });
// //         if (timerRef.current) {
// //           clearInterval(timerRef.current);
// //         }

// //         if (onOtpSuccess) {
// //           onOtpSuccess({
// //             user: {
// //               ...verifiedUser,
// //               username: username,
// //               mobileNo: phoneNumber
// //             },
// //             trustDevice: trustDevice,
// //             sessionId: result.session_id,
// //             apiResponse: result
// //           });
// //         }
// //       } else {
// //         setError(result.message || 'OTP verification failed. Please try again.');
// //       }
// //     } catch (error) {
// //       console.error('OTP verification error:', error);
// //       setError(error.message || 'Network error occurred. Please check your connection and try again.');
// //     } finally {
// //       setIsVerifying(false);
// //     }
// //   };

// //   const handleResendOtp = async () => {
// //     try {
// //       setError('');
// //       setOtp('');
// //       setSuccess(false);

// //       if (!sessionId) {
// //         throw new Error('Session ID not available. Please login again.');
// //       }

// //       await onResendOtp();
// //       startOtpTimer();
// //       setSuccess(true);
// //       setTimeout(() => setSuccess(false), 3000);
// //     } catch (error) {
// //       setError(error.message || 'Failed to resend OTP. Please try again.');
// //     }
// //   };

// //   const handleOtpChange = (e) => {
// //     const value = e.target.value.replace(/\D/g, '');
// //     setOtp(value);
// //     if (error) setError('');
// //   };

// //   return (
// //     <Box sx={{ mt: 2 }}>
// //       {error && (
// //         <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
// //           {error}
// //         </Alert>
// //       )}

// //       {success && (
// //         <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
// //           OTP sent successfully!
// //         </Alert>
// //       )}

// //       {isOtpExpired && (
// //         <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
// //           OTP has expired. Please click "Resend OTP" to get a new code.
// //         </Alert>
// //       )}

// //       <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
// //         Welcome, {verifiedUser?.username || getUsername()}. Please enter the OTP sent to your registered mobile number ending with ****{phoneNumber?.slice(-4) || ''}.
// //       </Alert>

// //       <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
// //         <Timer sx={{ mr: 1, fontSize: '1.2rem', color: isOtpExpired ? '#ef4444' : '#3b82f6' }} />
// //         <Typography
// //           variant="body2"
// //           sx={{
// //             fontWeight: 600,
// //             color: isOtpExpired ? '#ef4444' : '#3b82f6'
// //           }}
// //         >
// //           {isOtpExpired ? 'OTP Expired' : `OTP expires in: ${timeLeft}s`}
// //         </Typography>
// //       </Box>

// //       <Box sx={{ mb: 3 }}>
// //         <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
// //           Enter OTP
// //         </Typography>
// //         <TextField
// //           fullWidth
// //           value={otp}
// //           onChange={handleOtpChange}
// //           placeholder="Enter 6-digit OTP"
// //           disabled={isOtpExpired}
// //           inputProps={{
// //             maxLength: 6,
// //             pattern: '[0-9]*',
// //             inputMode: 'numeric'
// //           }}
// //           sx={{
// //             '& .MuiOutlinedInput-root': {
// //               borderRadius: 2,
// //               '&.Mui-disabled': {
// //                 backgroundColor: '#f3f4f6'
// //               }
// //             }
// //           }}
// //         />
// //       </Box>

// //       <Box sx={{ mb: 3 }}>
// //         <FormControlLabel
// //           control={
// //             <Checkbox
// //               checked={trustDevice}
// //               onChange={(e) => setTrustDevice(e.target.checked)}
// //               sx={{
// //                 color: '#3b82f6',
// //                 '&.Mui-checked': {
// //                   color: '#3b82f6',
// //                 },
// //               }}
// //             />
// //           }
// //           label={
// //             <Box sx={{ display: 'flex', alignItems: 'center' }}>
// //               <Shield sx={{ mr: 0.5, fontSize: '1rem', color: '#3b82f6' }} />
// //               <Typography variant="body2">
// //                 Trust this device for {trustDurationDays} days
// //               </Typography>
// //             </Box>
// //           }
// //         />
// //         <Typography variant="caption" sx={{ color: '#6b7280', ml: 4, display: 'block' }}>
// //           Skip OTP verification on this device. Only enable on your personal devices.
// //         </Typography>
// //       </Box>

// //       <Button
// //         variant="contained"
// //         fullWidth
// //         onClick={handleOtpSubmit}
// //         disabled={otp.length !== 6 || isVerifying || isOtpExpired}
// //         sx={{
// //           py: 1.5,
// //           borderRadius: 2,
// //           background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
// //           color: 'white',
// //           fontWeight: 600,
// //           fontSize: '0.875rem',
// //           textTransform: 'none',
// //           mb: 2,
// //           '&:disabled': {
// //             background: '#9ca3af',
// //             color: 'white'
// //           }
// //         }}
// //       >
// //         {isVerifying ? (
// //           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
// //             <CircularProgress size={20} sx={{ color: 'white' }} />
// //             <span>Verifying...</span>
// //           </Box>
// //         ) : isOtpExpired ? 'OTP Expired' : 'Verify OTP'}
// //       </Button>

// //       <Button
// //         variant="outlined"
// //         fullWidth
// //         onClick={handleResendOtp}
// //         disabled={otpLoading || isVerifying || (!isOtpExpired && timeLeft > 0)}
// //         sx={{
// //           py: 1.5,
// //           borderRadius: 2,
// //           borderColor: '#3b82f6',
// //           color: '#3b82f6',
// //           fontWeight: 600,
// //           fontSize: '0.875rem',
// //           textTransform: 'none',
// //           '&:hover': {
// //             borderColor: '#1d4ed8',
// //             backgroundColor: 'rgba(59, 130, 246, 0.04)'
// //           },
// //           '&:disabled': {
// //             borderColor: '#9ca3af',
// //             color: '#9ca3af'
// //           }
// //         }}
// //       >
// //         {otpLoading ? (
// //           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
// //             <CircularProgress size={20} sx={{ color: '#3b82f6' }} />
// //             <span>Sending...</span>
// //           </Box>
// //         ) : 'Resend OTP'}
// //       </Button>
// //     </Box>
// //   );
// // };

// // export default OtpVerification;





// // /**
// //  * @fileoverview Enhanced OTP Verification component for two-factor authentication with navigation
// //  * @module src/components/authentication/OtpVerification
// //  * @author Rakshana
// //  * @date 22/07/2025
// //  * @since 1.0.0
// //  */

// // import React, { useState, useEffect, useRef } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import {
// //   Box,
// //   TextField,
// //   Button,
// //   Alert,
// //   CircularProgress,
// //   Typography,
// //   Checkbox,
// //   FormControlLabel
// // } from '@mui/material';
// // import { Shield, Timer } from '@mui/icons-material';
// // import Cookies from 'js-cookie';
// // import {
// //   decryptData,
// //   validateJsonData,
// //   isWebCryptoSupported,
// // } from 'src/components/Decryption/Decrypt';

// // const getAuthHeaders = async () => {
// //   const encryptedToken = Cookies.get('HRToken');
// //   return {
// //     'Content-Type': 'application/json',
// //     'Authorization': `Bearer ${encryptedToken}`,
// //   };
// // };

// // const OtpVerification = ({
// //   verifiedUser,
// //   onOtpSuccess,
// //   onResendOtp,
// //   phoneNumber,
// //   generatedOtp,
// //   otpLoading = false,
// //   trustDurationDays = 30,
// //   sessionId
// // }) => {
// //   const [otp, setOtp] = useState('');
// //   const [error, setError] = useState('');
// //   const [success, setSuccess] = useState(false);
// //   const [trustDevice, setTrustDevice] = useState(false);
// //   const [isVerifying, setIsVerifying] = useState(false);
// //   const [timeLeft, setTimeLeft] = useState(45);
// //   const [isOtpExpired, setIsOtpExpired] = useState(false);
// //   const [otpSentTime, setOtpSentTime] = useState(Date.now());
// //   const [resendAttempts, setResendAttempts] = useState(3);
// //   const timerRef = useRef(null);
// //   const navigate = useNavigate();
// //   const API_BASE_URL = 'https://wftest1.iitm.ac.in:5000';
// //   const API_TOKEN = 'HRFGVJISOVp1fncC';

// //   const getUsername = () => {
// //     const username = sessionStorage.getItem('username') ||
// //                     localStorage.getItem('username') ||
// //                     Cookies.get('username');
// //     return username || '';
// //   };

// //   const startOtpTimer = () => {
// //     setTimeLeft(45);
// //     setIsOtpExpired(false);
// //     setOtpSentTime(Date.now());

// //     if (timerRef.current) {
// //       clearInterval(timerRef.current);
// //     }

// //     timerRef.current = setInterval(() => {
// //       setTimeLeft((prevTime) => {
// //         if (prevTime <= 1) {
// //           setIsOtpExpired(true);
// //           clearInterval(timerRef.current);
// //           return 0;
// //         }
// //         return prevTime - 1;
// //       });
// //     }, 1000);
// //   };

// //   useEffect(() => {
// //     startOtpTimer();
// //     return () => {
// //       if (timerRef.current) {
// //         clearInterval(timerRef.current);
// //       }
// //     };
// //   }, []);

// //   const handleOtpSubmit = async () => {
// //     if (otp.trim() === '') {
// //       setError('Please enter the OTP');
// //       return;
// //     }

// //     if (otp.length !== 6) {
// //       setError('OTP must be 6 digits');
// //       return;
// //     }

// //     if (isOtpExpired) {
// //       setError('OTP has expired. Please request a new OTP.');
// //       return;
// //     }

// //     if (!isWebCryptoSupported()) {
// //       setError('Web Crypto API not supported in this browser');
// //       return;
// //     }

// //     setIsVerifying(true);
// //     setError('');

// //     try {
// //       const username = getUsername();
// //       if (!username) {
// //         throw new Error('Username not found. Please login again.');
// //       }

// //       if (!sessionId) {
// //         throw new Error('Session ID not found. Please login again.');
// //       }

// //       const headers = await getAuthHeaders();

// //       const requestBody = {
// //         token: API_TOKEN,
// //         username: username,
// //         mobileno: parseInt(phoneNumber?.replace(/\D/g, '') || '0'),
// //         session_id: sessionId,
// //         otp: parseInt(otp),
// //         otpsendon: new Date(otpSentTime).toISOString(),
// //         otpverifiedon: new Date().toISOString(),
// //         status: 1,
// //         updatedon: new Date().toISOString()
// //       };

// //       const response = await fetch(`${API_BASE_URL}/Loginotpupdate`, {
// //         method: 'POST',
// //         headers: headers,
// //         body: JSON.stringify(requestBody)
// //       });

// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }

// //       const encryptedData = await response.json();
// //       if (!encryptedData.Data) {
// //         throw new Error('No encrypted data received from API');
// //       }

// //       const decryptedData = await decryptData(encryptedData.Data);
// //       const result = validateJsonData(decryptedData);

// //       console.log('Decrypted OTP verification response:', result);

// //       if (result.success && result.validcheck === '1' && result.message && result.message.includes('successfully') && result.session_id) {
// //         setSuccess(true);
// //         setError('');
// //         Cookies.set('session_id', result.session_id, { expires: 7 });
// //         if (timerRef.current) {
// //           clearInterval(timerRef.current);
// //         }

// //         if (onOtpSuccess) {
// //           onOtpSuccess({
// //             user: {
// //               ...verifiedUser,
// //               username: username,
// //               mobileNo: phoneNumber
// //             },
// //             trustDevice: trustDevice,
// //             sessionId: result.session_id,
// //             apiResponse: result
// //           });
// //         }
// //       } else {
// //         setError(result.message || 'OTP verification failed. Please try again.');
// //       }
// //     } catch (error) {
// //       console.error('OTP verification error:', error);
// //       setError(error.message || 'Network error occurred. Please check your connection and try again.');
// //     } finally {
// //       setIsVerifying(false);
// //     }
// //   };

// //   const handleResendOtp = async () => {
// //     if (resendAttempts <= 0) {
// //       setError('Maximum resend attempts reached. Redirecting to login screen...');
// //       setTimeout(() => {
// //         navigate('/login'); // Navigate back to AuthLogin screen
// //       }, 2000);
// //       return;
// //     }

// //     try {
// //       setError('');
// //       setOtp('');
// //       setSuccess(false);

// //       if (!sessionId) {
// //         throw new Error('Session ID not available. Please login again.');
// //       }

// //       await onResendOtp();
// //       setResendAttempts((prev) => prev - 1);
// //       startOtpTimer();
// //       setSuccess(true);
// //       setTimeout(() => setSuccess(false), 3000);
// //     } catch (error) {
// //       setError(error.message || 'Failed to resend OTP. Please try again.');
// //     }
// //   };

// //   const handleOtpChange = (e) => {
// //     const value = e.target.value.replace(/\D/g, '');
// //     setOtp(value);
// //     if (error) setError('');
// //   };

// //   return (
// //     <Box className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
// //       {error && (
// //         <Alert severity="error" className="mb-4 rounded-lg animate-pulse">
// //           {error}
// //         </Alert>
// //       )}

// //       {success && (
// //         <Alert severity="success" className="mb-4 rounded-lg animate-pulse">
// //           OTP sent successfully! {resendAttempts} attempts remaining.
// //         </Alert>
// //       )}

// //       {isOtpExpired && (
// //         <Alert severity="warning" className="mb-4 rounded-lg animate-pulse">
// //           OTP has expired. {resendAttempts > 0 ? `Please click "Resend OTP" to get a new code (${resendAttempts} attempts left).` : 'No resend attempts left. Redirecting to login screen...'}
// //         </Alert>
// //       )}

// //       <Alert severity="info" className="mb-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
// //         Welcome, {verifiedUser?.username || getUsername()}. Please enter the OTP sent to your registered mobile number ending with ****{phoneNumber?.slice(-4) || ''}.
// //       </Alert>

// //       <Box className="mb-4 flex items-center justify-center">
// //         <Timer className={`mr-2 ${isOtpExpired ? 'text-red-500' : 'text-blue-500'}`} />
// //         <Typography
// //           variant="body2"
// //           className={`font-semibold ${isOtpExpired ? 'text-red-500' : 'text-blue-500'}`}
// //         >
// //           {isOtpExpired ? 'OTP Expired' : `OTP expires in: ${timeLeft}s`}
// //         </Typography>
// //       </Box>

// //       <Box className="mb-6">
// //         <Typography variant="body2" className="mb-2 font-medium text-gray-700">
// //           Enter OTP
// //         </Typography>
// //         <TextField
// //           fullWidth
// //           value={otp}
// //           onChange={handleOtpChange}
// //           placeholder="Enter 6-digit OTP"
// //           disabled={isOtpExpired}
// //           inputProps={{
// //             maxLength: 6,
// //             pattern: '[0-9]*',
// //             inputMode: 'numeric'
// //           }}
// //           className="rounded-lg transition-all duration-200 hover:ring-2 hover:ring-blue-200 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
// //         />
// //       </Box>

// //       <Box className="mb-6">
// //         <FormControlLabel
// //           control={
// //             <Checkbox
// //               checked={trustDevice}
// //               onChange={(e) => setTrustDevice(e.target.checked)}
// //               className="text-blue-500"
// //             />
// //           }
// //           label={
// //             <Box className="flex items-center">
// //               <Shield className="mr-1 text-blue-500 text-sm" />
// //               <Typography variant="body2" className="text-gray-700">
// //                 Trust this device for {trustDurationDays} days
// //               </Typography>
// //             </Box>
// //           }
// //         />
// //         <Typography variant="caption" className="ml-8 block text-gray-500">
// //           Skip OTP verification on this device. Only enable on your personal devices.
// //         </Typography>
// //       </Box>

// //       <Button
// //         variant="contained"
// //         fullWidth
// //         onClick={handleOtpSubmit}
// //         disabled={otp.length !== 6 || isVerifying || isOtpExpired}
// //         className="py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-sm uppercase tracking-wide transform transition-all duration-200 hover:scale-105 disabled:bg-gray-400 disabled:scale-100"
// //       >
// //         {isVerifying ? (
// //           <Box className="flex items-center gap-2">
// //             <CircularProgress size={20} className="text-white" />
// //             <span>Verifying...</span>
// //           </Box>
// //         ) : isOtpExpired ? 'OTP Expired' : 'Verify OTP'}
// //       </Button>

// //       <Button
// //         variant="outlined"
// //         fullWidth
// //         onClick={handleResendOtp}
// //         disabled={otpLoading || isVerifying || (!isOtpExpired && timeLeft > 0) || resendAttempts <= 0}
// //         className="mt-4 py-3 rounded-lg border-blue-500 text-blue-500 font-semibold text-sm uppercase tracking-wide transform transition-all duration-200 hover:bg-blue-50 hover:scale-105 disabled:border-gray-400 disabled:text-gray-400 disabled:hover:bg-transparent disabled:hover:scale-100"
// //       >
// //         {otpLoading ? (
// //           <Box className="flex items-center gap-2">
// //             <CircularProgress size={20} className="text-blue-500" />
// //             <span>Sending...</span>
// //           </Box>
// //         ) : `Resend OTP (${resendAttempts} left)`}
// //       </Button>
// //     </Box>
// //   );
// // };

// // export default OtpVerification;


// /**
//  * @fileoverview Professional OTP Verification component with modern UI design
//  * @module src/components/authentication/OtpVerification
//  * @author Rakshana
//  * @date 22/07/2025
//  * @since 2.0.0
//  */

// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Box,
//   TextField,
//   Button,
//   Alert,
//   CircularProgress,
//   Typography,
//   Checkbox,
//   FormControlLabel,
//   Paper,
//   Stack,
//   Chip,
//   IconButton,
//   InputAdornment
// } from '@mui/material';
// import { 
//   Shield, 
//   Timer, 
//   Security, 
//   PhoneAndroid, 
//   CheckCircle, 
//   Error,
//   Refresh,
//   Lock,
//   ArrowBack,
//   Visibility,
//   VisibilityOff
// } from '@mui/icons-material';
// import Cookies from 'js-cookie';
// import {
//   decryptData,
//   validateJsonData,
//   isWebCryptoSupported,
// } from 'src/components/Decryption/Decrypt';

// const getAuthHeaders = async () => {
//   const encryptedToken = Cookies.get('HRToken');
//   return {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${encryptedToken}`,
//   };
// };

// // Individual OTP Input Component
// const OtpInput = ({ value, onChange, disabled, autoFocus }) => {
//   const inputRef = useRef(null);

//   useEffect(() => {
//     if (autoFocus && inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [autoFocus]);

//   const handleChange = (e) => {
//     const val = e.target.value.replace(/\D/g, '');
//     onChange(val);
    
//     // Move to next input if value is entered
//     if (val && e.target.nextElementSibling) {
//       e.target.nextElementSibling.focus();
//     }
//   };

//   const handleKeyDown = (e) => {
//     // Move to previous input on backspace if current input is empty
//     if (e.key === 'Backspace' && !value && e.target.previousElementSibling) {
//       e.target.previousElementSibling.focus();
//     }
//   };

//   return (
//     <TextField
//       ref={inputRef}
//       value={value}
//       onChange={handleChange}
//       onKeyDown={handleKeyDown}
//       disabled={disabled}
//       inputProps={{
//         maxLength: 1,
//         style: {
//           textAlign: 'center',
//           fontSize: '2rem',
//           fontWeight: 'bold',
//           height: '60px',
//           padding: 0
//         }
//       }}
//       sx={{
//         width: '60px',
//         height: '60px',
//         '& .MuiOutlinedInput-root': {
//           borderRadius: '12px',
//           backgroundColor: disabled ? '#f5f5f5' : 'white',
//           transition: 'all 0.2s ease',
//           '& fieldset': {
//             borderColor: '#e0e0e0',
//             borderWidth: '2px'
//           },
//           '&:hover fieldset': {
//             borderColor: disabled ? '#e0e0e0' : '#2196f3'
//           },
//           '&.Mui-focused fieldset': {
//             borderColor: '#2196f3',
//             borderWidth: '2px'
//           },
//           '&.Mui-error fieldset': {
//             borderColor: '#f44336'
//           }
//         }
//       }}
//     />
//   );
// };

// const OtpVerification = ({
//   verifiedUser,
//   onOtpSuccess,
//   onResendOtp,
//   phoneNumber,
//   generatedOtp,
//   otpLoading = false,
//   trustDurationDays = 30,
//   sessionId
// }) => {
//   const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [trustDevice, setTrustDevice] = useState(false);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(45);
//   const [isOtpExpired, setIsOtpExpired] = useState(false);
//   const [otpSentTime, setOtpSentTime] = useState(Date.now());
//   const [resendAttempts, setResendAttempts] = useState(3);
//   const [showRefreshCountdown, setShowRefreshCountdown] = useState(false);
//   const [refreshCountdown, setRefreshCountdown] = useState(5);
//   const timerRef = useRef(null);
//   const refreshTimerRef = useRef(null);
//   const navigate = useNavigate();
//   const API_BASE_URL = 'https://wftest1.iitm.ac.in:5000';
//   const API_TOKEN = 'HRFGVJISOVp1fncC';

//   const getUsername = () => {
//     const username = sessionStorage.getItem('username') ||
//                     localStorage.getItem('username') ||
//                     Cookies.get('username');
//     return username || '';
//   };

//   const otp = otpValues.join('');

//   const startRefreshCountdown = () => {
//     setShowRefreshCountdown(true);
//     setRefreshCountdown(5);
//     setError(''); // Clear any existing errors

//     refreshTimerRef.current = setInterval(() => {
//       setRefreshCountdown((prevCount) => {
//         if (prevCount <= 1) {
//           clearInterval(refreshTimerRef.current);
//           // Force page refresh using multiple methods to ensure it works
//           try {
//             window.location.reload(true); // Force reload from server
//           } catch (e) {
//             window.location.href = window.location.href; // Fallback method
//           }
//           return 0;
//         }
//         return prevCount - 1;
//       });
//     }, 1000);
//   };

// const startOtpTimer = () => {
//   setTimeLeft(45);
//   setIsOtpExpired(false);
//   setOtpSentTime(Date.now());

//   if (timerRef.current) {
//     clearInterval(timerRef.current);
//   }

//   timerRef.current = setInterval(() => {
//     setTimeLeft((prevTime) => {
//       if (prevTime <= 1) {
//         setIsOtpExpired(true);
//         clearInterval(timerRef.current);
        
//         // Check if no resend attempts are left and refresh the page
//         if (resendAttempts <= 0) {
//           setTimeout(() => {
//             window.location.reload(); // Refresh the entire page
//           }, 1000); // Small delay to show the expired message
//         }
        
//         return 0;
//       }
//       return prevTime - 1;
//     });
//   }, 1000);
// };

//   useEffect(() => {
//     startOtpTimer();
//     return () => {
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//       }
//       if (refreshTimerRef.current) {
//         clearInterval(refreshTimerRef.current);
//       }
//     };
//   }, []);

//   const handleOtpChange = (index, value) => {
//     const newOtpValues = [...otpValues];
//     newOtpValues[index] = value;
//     setOtpValues(newOtpValues);
//     if (error) setError('');
//   };

//   const handleOtpSubmit = async () => {
//     if (otp.length !== 6) {
//       setError('Please enter all 6 digits of the OTP');
//       return;
//     }

//     if (isOtpExpired) {
//       setError('OTP has expired. Please request a new OTP.');
//       return;
//     }

//     if (!isWebCryptoSupported()) {
//       setError('Web Crypto API not supported in this browser');
//       return;
//     }

//     setIsVerifying(true);
//     setError('');

//     try {
//       const username = getUsername();
//       if (!username) {
//         throw new Error('Username not found. Please login again.');
//       }

//       if (!sessionId) {
//         throw new Error('Session ID not found. Please login again.');
//       }

//       const headers = await getAuthHeaders();

//       const requestBody = {
//         token: API_TOKEN,
//         username: username,
//         mobileno: parseInt(phoneNumber?.replace(/\D/g, '') || '0'),
//         session_id: sessionId,
//         otp: parseInt(otp),
//         otpsendon: new Date(otpSentTime).toISOString(),
//         otpverifiedon: new Date().toISOString(),
//         status: 1,
//         updatedon: new Date().toISOString()
//       };

//       const response = await fetch(`${API_BASE_URL}/Loginotpupdate`, {
//         method: 'POST',
//         headers: headers,
//         body: JSON.stringify(requestBody)
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const encryptedData = await response.json();
//       if (!encryptedData.Data) {
//         throw new Error('No encrypted data received from API');
//       }

//       const decryptedData = await decryptData(encryptedData.Data);
//       const result = validateJsonData(decryptedData);

//       if (result.success && result.validcheck === '1' && result.message && result.message.includes('successfully') && result.session_id) {
//         setSuccess('OTP verified successfully! Redirecting...');
//         setError('');
//         Cookies.set('session_id', result.session_id, { expires: 7 });
//         if (timerRef.current) {
//           clearInterval(timerRef.current);
//         }

//         if (onOtpSuccess) {
//           onOtpSuccess({
//             user: {
//               ...verifiedUser,
//               username: username,
//               mobileNo: phoneNumber
//             },
//             trustDevice: trustDevice,
//             sessionId: result.session_id,
//             apiResponse: result
//           });
//         }
//       } else {
//         setError(result.message || 'OTP verification failed. Please try again.');
//       }
//     } catch (error) {
//       console.error('OTP verification error:', error);
//       setError(error.message || 'Network error occurred. Please check your connection and try again.');
//     } finally {
//       setIsVerifying(false);
//     }
//   };

// // const handleResendOtp = async () => {
// //   if (resendAttempts <= 0) {
// //     setError('Maximum resend attempts reached. Page will refresh when timer expires...');
// //     return; // Remove the navigation logic, let the timer handle the refresh
// //   }

// //   try {
// //     setError('');
// //     setOtpValues(['', '', '', '', '', '']); // Clear OTP inputs - FIXED
// //     setSuccess('');

// //     if (!sessionId) {
// //       throw new Error('Session ID not available. Please login again.');
// //     }

// //     await onResendOtp();
// //     setResendAttempts((prev) => prev - 1);
// //     startOtpTimer();
// //     setSuccess('New verification code sent successfully!');
// //     setTimeout(() => setSuccess(''), 3000);
// //   } catch (error) {
// //     setError(error.message || 'Failed to resend OTP. Please try again.');
// //   }
// // };



// const handleResendOtp = async () => {
//   if (resendAttempts <= 0) {
//     setError('Maximum resend attempts reached. Page will refresh shortly...');
//     startRefreshCountdown(); // Trigger immediate page refresh
//     return;
//   }

//   try {
//     setError('');
//     setOtpValues(['', '', '', '', '', '']); // Clear OTP inputs - FIXED
//     setSuccess('');

//     if (!sessionId) {
//       throw new Error('Session ID not available. Please login again.');
//     }

//     await onResendOtp();
//     const newAttempts = resendAttempts - 1;
//     setResendAttempts(newAttempts);
    
//     // Check if this was the last attempt
//     if (newAttempts <= 0) {
//       setError('This was your last resend attempt. Page will refresh shortly...');
//       setTimeout(() => {
//         startRefreshCountdown();
//       }, 2000); // Give user time to read the message
//       return;
//     }
    
//     startOtpTimer();
//     setSuccess('New verification code sent successfully!');
//     setTimeout(() => setSuccess(''), 3000);
//   } catch (error) {
//     setError(error.message || 'Failed to resend OTP. Please try again.');
//   }
// };
//   const getTimerChipColor = () => {
//     if (isOtpExpired) return 'error';
//     if (timeLeft <= 10) return 'error';
//     if (timeLeft <= 20) return 'warning';
//     return 'primary';
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: '50vh',
//         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         p: 2
//       }}
//     >
//       <Paper
//         elevation={24}
//         sx={{
//           width: '100%',
//           maxWidth: 500,
//           borderRadius: 4,
//           overflow: 'hidden',
//           background: 'rgba(255, 255, 255, 0.95)',
//           backdropFilter: 'blur(20px)'
//         }}
//       >
//         {/* Header */}
//         <Box
//           sx={{
//             background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
//             color: 'white',
//             p: 4,
//             textAlign: 'center',
//             position: 'relative'
//           }}
//         >
//           <Box
//             sx={{
//               width: 80,
//               height: 70,
//               borderRadius: '50%',
//               background: 'rgba(255, 255, 255, 0.15)',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               mx: 'auto',
//               mb: 2,
//               backdropFilter: 'blur(10px)'
//             }}
//           >
//             <Security sx={{ fontSize: 40 }} />
//           </Box>
//           <Typography variant="h5" fontWeight="bold" gutterBottom>
//             Two-Factor Authentication
//           </Typography>
//           <Typography variant="body2" sx={{ opacity: 0.9 }}>
//             Enter the verification code sent to your mobile device
//           </Typography>
//         </Box>

//         <Box sx={{ p: 4 }}>
//           {/* User Info */}
//           <Paper
//             elevation={0}
//             sx={{
//               p: 3,
//               mb: 3,
//               background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
//               borderRadius: 2
//             }}
//           >
//             <Box display="flex" alignItems="center" mb={1}>
//               <PhoneAndroid sx={{ color: '#1976d2', mr: 1 }} />
//               <Typography variant="h6" fontWeight="600">
//                 Welcome, {verifiedUser?.username || getUsername()}
//               </Typography>
//             </Box>
//             <Typography variant="body2" color="text.secondary">
//               Verification code sent to ••••••{phoneNumber?.slice(-4) || ''}
//             </Typography>
//           </Paper>

//           {/* Timer */}
//           <Box display="flex" justifyContent="center" mb={3}>
//             <Chip
//               icon={<Timer />}
//               label={isOtpExpired ? 'Code Expired' : `${formatTime(timeLeft)}`}
//               color={getTimerChipColor()}
//               variant={isOtpExpired ? 'filled' : 'outlined'}
//               sx={{
//                 fontSize: '1rem',
//                 height: 40,
//                 '& .MuiChip-icon': {
//                   fontSize: '1.2rem'
//                 }
//               }}
//             />
//           </Box>

//           {/* Alerts */}
//           {error && (
//             <Alert 
//               severity="error" 
//               sx={{ mb: 3, borderRadius: 2 }}
//               icon={<Error />}
//             >
//               {error}
//             </Alert>
//           )}

//           {success && (
//             <Alert 
//               severity="success" 
//               sx={{ mb: 3, borderRadius: 2 }}
//               icon={<CheckCircle />}
//             >
//               {success}
//             </Alert>
//           )}

//           {showRefreshCountdown && (
//             <Alert 
//               severity="info" 
//               sx={{ mb: 3, borderRadius: 2 }}
//               icon={<Refresh />}
//             >
//               Page will refresh in {refreshCountdown} seconds...
//             </Alert>
//           )}

//           {/* OTP Input */}
//           <Box sx={{ mb: 4 }}>
//             <Typography 
//               variant="body1" 
//               fontWeight="600" 
//               gutterBottom
//               sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
//             >
//               <Lock sx={{ mr: 1, color: 'text.secondary' }} />
//               Enter 6-Digit Code
//             </Typography>
            
//             <Stack direction="row" spacing={1} justifyContent="center">
//               {otpValues.map((value, index) => (
//                 <OtpInput
//                   key={index}
//                   value={value}
//                   onChange={(val) => handleOtpChange(index, val)}
//                   disabled={isOtpExpired || isVerifying}
//                   autoFocus={index === 0}
//                 />
//               ))}
//             </Stack>
//           </Box>

//           {/* Trust Device */}
//           <Paper
//             elevation={0}
//             sx={{
//               p: 2.5,
//               mb: 4,
//               backgroundColor: '#f8f9fa',
//               borderRadius: 2,
//               border: '1px solid #e9ecef'
//             }}
//           >
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={trustDevice}
//                   onChange={(e) => setTrustDevice(e.target.checked)}
//                   sx={{ color: '#1976d2' }}
//                 />
//               }
//               label={
//                 <Box>
//                   <Box display="flex" alignItems="center" mb={0.5}>
//                     <Shield sx={{ mr: 1, color: '#1976d2', fontSize: 20 }} />
//                     <Typography variant="body1" fontWeight="500">
//                       Trust this device for {trustDurationDays} days
//                     </Typography>
//                   </Box>
//                   <Typography variant="caption" color="text.secondary">
//                     Skip verification on this device. Only use on personal devices.
//                   </Typography>
//                 </Box>
//               }
//             />
//           </Paper>

//           {/* Action Buttons */}
//           <Stack spacing={2}>
//             <Button
//               variant="contained"
//               size="large"
//               onClick={handleOtpSubmit}
//               disabled={otp.length !== 6 || isVerifying || isOtpExpired}
//               startIcon={isVerifying ? <CircularProgress size={20} /> : <CheckCircle />}
//               sx={{
//                 py: 2,
//                 borderRadius: 2,
//                 background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
//                 fontSize: '1rem',
//                 fontWeight: 'bold',
//                 textTransform: 'none',
//                 boxShadow: '0 8px 24px rgba(25, 118, 210, 0.3)',
//                 '&:hover': {
//                   background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
//                   boxShadow: '0 12px 32px rgba(25, 118, 210, 0.4)',
//                 },
//                 '&:disabled': {
//                   background: '#bdbdbd',
//                   boxShadow: 'none'
//                 }
//               }}
//             >
//               {isVerifying ? 'Verifying...' : 'Verify Code'}
//             </Button>

//             <Button
//               variant="outlined"
//               size="large"
//               onClick={handleResendOtp}
//               disabled={otpLoading || isVerifying || (!isOtpExpired && timeLeft > 0) || resendAttempts <= 0 || showRefreshCountdown}
//               startIcon={otpLoading ? <CircularProgress size={20} /> : <Refresh />}
//               sx={{
//                 py: 2,
//                 borderRadius: 2,
//                 borderWidth: 2,
//                 fontSize: '1rem',
//                 fontWeight: 'bold',
//                 textTransform: 'none',
//                 '&:hover': {
//                   borderWidth: 2,
//                 }
//               }}
//             >
//               {otpLoading ? 'Sending...' : `Resend Code (${resendAttempts} left)`}
//             </Button>
//           </Stack>

//           {/* Footer */}
//           <Box sx={{ mt: 4, textAlign: 'center' }}>
//             <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//               <Lock sx={{ fontSize: 16, mr: 0.5 }} />
//               Your session is secured with end-to-end encryption
//             </Typography>
//           </Box>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default OtpVerification;



/**
 * @fileoverview Simplified OTP Verification component
 * @module src/components/authentication/OtpVerification
 * @author Rakshana
 * @date 22/07/2025
 * @since 2.0.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Typography,
  Paper,
  Stack
} from '@mui/material';
import { Security, Timer } from '@mui/icons-material';
import Cookies from 'js-cookie';
import {
  decryptData,
  validateJsonData,
  isWebCryptoSupported,
} from 'src/components/Decryption/Decrypt';

const getAuthHeaders = async () => {
  const encryptedToken = Cookies.get('HRToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${encryptedToken}`,
  };
};

// Simplified OTP Input Component
const OtpInput = ({ value, onChange, disabled, autoFocus }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    onChange(val);
    
    if (val && e.target.nextElementSibling) {
      e.target.nextElementSibling.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' && !value && e.target.previousElementSibling) {
      e.target.previousElementSibling.focus();
    }
  };

  return (
    <TextField
      ref={inputRef}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      inputProps={{
        maxLength: 1,
        style: { textAlign: 'center', fontSize: '1.5rem', fontWeight: '500' }
      }}
      sx={{
        width: '50px',
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          '&:hover fieldset': { borderColor: disabled ? '#e0e0e0' : '#1976d2' },
          '&.Mui-focused fieldset': { borderColor: '#1976d2' }
        }
      }}
    />
  );
};

const OtpVerification = ({
  verifiedUser,
  onOtpSuccess,
  onResendOtp,
  phoneNumber,
  generatedOtp,
  otpLoading = false,
  sessionId
}) => {
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const [otpSentTime, setOtpSentTime] = useState(Date.now());
  const [resendAttempts, setResendAttempts] = useState(3);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  
  const API_BASE_URL = 'https://wftest1.iitm.ac.in:5000';
  const API_TOKEN = 'HRFGVJISOVp1fncC';

  const getUsername = () => {
    const username = sessionStorage.getItem('username') ||
                    localStorage.getItem('username') ||
                    Cookies.get('username');
    return username || '';
  };

  const otp = otpValues.join('');

  const startOtpTimer = () => {
    setTimeLeft(45);
    setIsOtpExpired(false);
    setOtpSentTime(Date.now());

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setIsOtpExpired(true);
          clearInterval(timerRef.current);
          if (resendAttempts <= 0) {
            setTimeout(() => window.location.reload(), 1000);
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startOtpTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleOtpChange = (index, value) => {
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    if (error) setError('');
  };

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    if (isOtpExpired) {
      setError('OTP has expired. Please request a new one.');
      return;
    }

    if (!isWebCryptoSupported()) {
      setError('Web Crypto API not supported');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const username = getUsername();
      if (!username) {
        throw new Error('Username not found. Please login again.');
      }

      if (!sessionId) {
        throw new Error('Session ID not found. Please login again.');
      }

      const headers = await getAuthHeaders();
      const requestBody = {
        token: API_TOKEN,
        username: username,
        mobileno: parseInt(phoneNumber?.replace(/\D/g, '') || '0'),
        session_id: sessionId,
        otp: parseInt(otp),
        otpsendon: new Date(otpSentTime).toISOString(),
        otpverifiedon: new Date().toISOString(),
        status: 1,
        updatedon: new Date().toISOString()
      };

      const response = await fetch(`${API_BASE_URL}/Loginotpupdate`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const encryptedData = await response.json();
      if (!encryptedData.Data) {
        throw new Error('No data received from server');
      }

      const decryptedData = await decryptData(encryptedData.Data);
      const result = validateJsonData(decryptedData);

      if (result.success && result.validcheck === '1' && result.message?.includes('successfully') && result.session_id) {
        setSuccess('OTP verified successfully!');
        setError('');
        Cookies.set('session_id', result.session_id, { expires: 7 });
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }

        if (onOtpSuccess) {
          onOtpSuccess({
            user: {
              ...verifiedUser,
              username: username,
              mobileNo: phoneNumber
            },
            sessionId: result.session_id,
            apiResponse: result
          });
        }
      } else {
        setError(result.message || 'OTP verification failed. Please try again.');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError(error.message || 'Network error. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendAttempts <= 0) {
      setError('Maximum resend attempts reached. Page will refresh shortly...');
      setTimeout(() => window.location.reload(), 3000);
      return;
    }

    try {
      setError('');
      setOtpValues(['', '', '', '', '', '']);
      setSuccess('');

      if (!sessionId) {
        throw new Error('Session ID not available. Please login again.');
      }

      await onResendOtp();
      const newAttempts = resendAttempts - 1;
      setResendAttempts(newAttempts);
      
      if (newAttempts <= 0) {
        setError('This was your last resend attempt. Page will refresh shortly...');
        setTimeout(() => window.location.reload(), 3000);
        return;
      }
      
      startOtpTimer();
      setSuccess('New verification code sent!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || 'Failed to resend OTP. Please try again.');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box
      sx={{
        backgroundColor: 'rgb(255, 255, 255)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
<Paper
  elevation={3}
  sx={{
    width: 380,
    minHeight: 440,
    borderRadius: 3,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between'
  }}
>
  {/* Header */}
  <Box sx={{ textAlign: 'center' }}>
    <Box
      sx={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        backgroundColor: '#e3f2fd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mx: 'auto',
        mb: 2
      }}
    >
      <Security sx={{ fontSize: 28, color: '#1976d2' }} />
    </Box>
    <Typography variant="h6" fontWeight="600">
      Verify OTP
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Code sent to ••••••{phoneNumber?.slice(-4) || ''}
    </Typography>
  </Box>

  {/* Timer */}
  <Box display="flex" alignItems="center" justifyContent="center" mt={3} mb={1}>
    <Timer
      sx={{ mr: 1, color: timeLeft <= 10 ? '#f44336' : '#1976d2', fontSize: 20 }}
    />
    <Typography
      variant="body2"
      color={timeLeft <= 10 ? 'error' : 'primary'}
      fontWeight="500"
    >
      {isOtpExpired ? 'Code Expired' : formatTime(timeLeft)}
    </Typography>
  </Box>

  {/* Alerts */}
  <Box sx={{ width: '100%', mb: 2 }}>
    {error && (
      <Alert severity="error" sx={{ borderRadius: 2, mb: 2 }}>
        {error}
      </Alert>
    )}
    {success && (
      <Alert severity="success" sx={{ borderRadius: 2 }}>
        {success}
      </Alert>
    )}
  </Box>

  {/* OTP Input */}
  <Box sx={{ width: '100%', mb: 3 }}>
    <Typography variant="body1" fontWeight="500" gutterBottom textAlign="center">
      Enter Code
    </Typography>

    <Stack
      direction="row"
      spacing={1.5}
      justifyContent="center"
      alignItems="center"
    >
      {otpValues.map((value, index) => (
        <OtpInput
          key={index}
          value={value}
          onChange={(val) => handleOtpChange(index, val)}
          disabled={isOtpExpired || isVerifying}
          autoFocus={index === 0}
        />
      ))}
    </Stack>
  </Box>

  {/* Buttons */}
  <Stack spacing={2} sx={{ width: '100%' }}>
    <Button
      variant="contained"
      size="large"
      onClick={handleOtpSubmit}
      disabled={otp.length !== 6 || isVerifying || isOtpExpired}
      sx={{
        py: 1.5,
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: '600'
      }}
    >
      {isVerifying ? (
        <CircularProgress size={20} sx={{ mr: 1 }} />
      ) : null}
      {isVerifying ? 'Verifying...' : 'Verify Code'}
    </Button>

    <Button
      variant="outlined"
      size="large"
      onClick={handleResendOtp}
      disabled={
        otpLoading || isVerifying || (!isOtpExpired && timeLeft > 0) || resendAttempts <= 0
      }
      sx={{
        py: 1.5,
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: '600'
      }}
    >
      {otpLoading ? (
        <CircularProgress size={20} sx={{ mr: 1 }} />
      ) : null}
      {otpLoading ? 'Sending...' : `Resend Code (${resendAttempts} left)`}
    </Button>
  </Stack>
</Paper>

    </Box>
  );
};

export default OtpVerification;