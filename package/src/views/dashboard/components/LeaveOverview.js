import React, { useState } from 'react';
import { Select, MenuItem, Box, Stack, Typography, Chip, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconCalendarEvent, IconUserCheck, IconUserX, IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';
import DashboardCard from '../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';

const LeaveOverview = () => {
    const [month, setMonth] = useState('1');
    const theme = useTheme();

    const handleChange = (event) => {
        setMonth(event.target.value);
    };

    const monthData = {
        '1': {
            name: 'March 2025',
            dates: ['01 Mar', '02 Mar', '03 Mar', '04 Mar', '05 Mar', '06 Mar', '07 Mar', '08 Mar', '09 Mar', '10 Mar', '11 Mar', '12 Mar', '13 Mar', '14 Mar', '15 Mar'],
            leaveRequests: [18, 22, 15, 24, 19, 12, 8, 25, 21, 17, 23, 16, 20, 14, 26],
            approvedLeaves: [16, 20, 13, 21, 17, 11, 7, 22, 19, 15, 20, 14, 18, 12, 23],
            rejectedLeaves: [2, 2, 2, 3, 2, 1, 1, 3, 2, 2, 3, 2, 2, 2, 3],
            totalRequests: 288,
            totalApproved: 248,
            totalRejected: 40,
            approvalRate: 86.1,
            trend: '+8.2%',
            trendUp: true
        },
        '2': {
            name: 'April 2025',
            dates: ['01 Apr', '02 Apr', '03 Apr', '04 Apr', '05 Apr', '06 Apr', '07 Apr', '08 Apr', '09 Apr', '10 Apr', '11 Apr', '12 Apr', '13 Apr', '14 Apr', '15 Apr'],
            leaveRequests: [24, 28, 19, 31, 25, 16, 12, 33, 27, 22, 29, 21, 26, 18, 34],
            approvedLeaves: [21, 25, 17, 27, 22, 14, 10, 29, 24, 19, 25, 18, 23, 16, 30],
            rejectedLeaves: [3, 3, 2, 4, 3, 2, 2, 4, 3, 3, 4, 3, 3, 2, 4],
            totalRequests: 365,
            totalApproved: 320,
            totalRejected: 45,
            approvalRate: 87.7,
            trend: '+14.3%',
            trendUp: true
        },
        '3': {
            name: 'May 2025',
            dates: ['01 May', '02 May', '03 May', '04 May', '05 May', '06 May', '07 May', '08 May', '09 May', '10 May', '11 May', '12 May', '13 May', '14 May', '15 May'],
            leaveRequests: [28, 32, 23, 35, 29, 20, 16, 37, 31, 26, 33, 25, 30, 22, 38],
            approvedLeaves: [23, 27, 19, 29, 24, 17, 13, 31, 26, 22, 28, 21, 25, 18, 32],
            rejectedLeaves: [5, 5, 4, 6, 5, 3, 3, 6, 5, 4, 5, 4, 5, 4, 6],
            totalRequests: 425,
            totalApproved: 355,
            totalRejected: 70,
            approvalRate: 83.5,
            trend: '-4.8%',
            trendUp: false
        }
    };

    const currentData = monthData[month];
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;
    const error = theme.palette.error.main;

    const optionscolumnchart = {
        chart: {
            type: 'bar',
            fontFamily: 'Poppins, sans-serif',
            foreColor: theme.palette.text.secondary,
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset: false
                }
            },
            height: 150,
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150
                }
            }
        },
        colors: [primary, secondary, error],
        plotOptions: {
            bar: {
                horizontal: false,
                barHeight: '60%',
                columnWidth: '55%',
                borderRadius: [4],
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'all',
            },
        },
        stroke: {
            show: true,
            width: 2,
            lineCap: "butt",
            colors: ["transparent"],
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'right',
            fontSize: '11px',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: '600',
            markers: {
                width: 8,
                height: 8,
                radius: 2
            }
        },
        grid: {
            borderColor: theme.palette.divider,
            strokeDashArray: 3,
            xaxis: {
                lines: {
                    show: false,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                }
            },
            padding: {
                top: 0,
                right: 20,
                bottom: 0,
                left: 20
            }
        },
        yaxis: {
            title: {
                text: 'Number of Applications',
                style: {
                    fontSize: '10px',
                    fontWeight: '600',
                    fontFamily: 'Poppins, sans-serif',
                    color: theme.palette.text.secondary
                }
            },
            labels: {
                style: {
                    colors: theme.palette.text.secondary,
                    fontSize: '9px',
                    fontFamily: 'Poppins, sans-serif'
                }
            },
            tickAmount: 4,
        },
        xaxis: {
            categories: currentData.dates,
            title: {
                text: 'Date',
                style: {
                    fontSize: '10px',
                    fontWeight: '600',
                    fontFamily: 'Poppins, sans-serif',
                    color: theme.palette.text.secondary
                }
            },
            labels: {
                style: {
                    colors: theme.palette.text.secondary,
                    fontSize: '9px',
                    fontFamily: 'Poppins, sans-serif'
                },
                rotate: -45
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false
            }
        },
        tooltip: {
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
            fillSeriesColor: false,
            style: {
                fontSize: '10px',
                fontFamily: 'Poppins, sans-serif'
            },
            y: {
                formatter: function(val, { seriesIndex }) {
                    const labels = ['requests', 'approved', 'rejected'];
                    return `${val} ${labels[seriesIndex]}`;
                }
            }
        },
    };

    const seriescolumnchart = [
        {
            name: 'Leave Requests',
            data: currentData.leaveRequests,
        },
        {
            name: 'Approved',
            data: currentData.approvedLeaves,
        },
        {
            name: 'Rejected',
            data: currentData.rejectedLeaves,
        }
    ];

    return (
        <DashboardCard 
            title="Leave Management Overview" 
            subtitle={`Daily leave applications for ${currentData.name}`}
            action={
                <Select
                    labelId="month-dd"
                    id="month-dd"
                    value={month}
                    size="small"
                    onChange={handleChange}
                    sx={{ minWidth: 120 }}
                >
                    <MenuItem value="1">March 2025</MenuItem>
                    <MenuItem value="2">April 2025</MenuItem>
                    <MenuItem value="3">May 2025</MenuItem>
                </Select>
            }
        >

            <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                    <Box>
                        <Typography 
                            variant="h6" 
                            color="primary" 
                            fontWeight="600" 
                            sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '16px' }}
                        >
                            {currentData.totalRequests.toLocaleString()}
                        </Typography>
                        <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px' }}
                        >
                            Total Requests
                        </Typography>
                    </Box>
                    <Box>
                        <Typography 
                            variant="h6" 
                            color="secondary" 
                            fontWeight="600" 
                            sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '16px' }}
                        >
                            {currentData.totalApproved.toLocaleString()}
                        </Typography>
                        <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px' }}
                        >
                            Approved
                        </Typography>
                    </Box>
                    <Box>
                        <Typography 
                            variant="h6" 
                            color="error" 
                            fontWeight="600" 
                            sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '16px' }}
                        >
                            {currentData.totalRejected}
                        </Typography>
                        <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px' }}
                        >
                            Rejected
                        </Typography>
                    </Box>
                    <Box>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            {currentData.trendUp ? (
                                <IconTrendingUp size={14} color={theme.palette.success.main} />
                            ) : (
                                <IconTrendingDown size={14} color={theme.palette.error.main} />
                            )}
                            <Typography 
                                variant="body1" 
                                color={currentData.trendUp ? "success.main" : "error.main"} 
                                fontWeight="600" 
                                sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}
                            >
                                {currentData.trend}
                            </Typography>
                        </Stack>
                        <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px' }}
                        >
                            vs Previous Month
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                    <Chip 
                        icon={<IconUserCheck size={14} />}
                        label={`${currentData.approvalRate}% Approval Rate`}
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{
                            fontSize: '10px',
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: '600'
                        }}
                    />
                    <Chip 
                        icon={<IconCalendarEvent size={14} />}
                        label={`${Math.round(currentData.totalRequests/15)} Daily Avg`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{
                            fontSize: '10px',
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: '600'
                        }}
                    />
                    <Chip 
                        label={`${Math.round((currentData.totalRejected/currentData.totalRequests)*100)}% Rejection Rate`}
                        size="small"
                        color="error"
                        variant="outlined"
                        sx={{
                            fontSize: '10px',
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: '600'
                        }}
                    />
                </Stack>
            </Box>

            <Chart
                options={optionscolumnchart}
                series={seriescolumnchart}
                type="bar"
                height="200px"
            />
        </DashboardCard>
    );
};

export default LeaveOverview;