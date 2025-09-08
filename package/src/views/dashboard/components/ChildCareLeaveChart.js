import React, { useState } from 'react';
import { Select, MenuItem, Box, Stack, Typography, Chip, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';
import DashboardCard from '../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';

const ChildCareLeaveChart = () => {
    const [month, setMonth] = useState('1');
    const theme = useTheme();

    const handleChange = (event) => {
        setMonth(event.target.value);
    };

    const monthData = {
        '1': {
            name: 'March 2025',
            // Bubble data: [x-axis (days), y-axis (approval time in hours), z-axis (frequency/size)]
            bubbleData: [
                [1, 24, 8], [3, 18, 12], [5, 36, 6], [7, 12, 15], [10, 48, 4],
                [14, 6, 20], [21, 72, 3], [30, 24, 10], [45, 96, 2], [60, 18, 8],
                [90, 120, 1], [120, 36, 5], [180, 48, 2], [365, 168, 1]
            ],
            totalRequests: 97,
            avgProcessingTime: 42.5,
            approvalRate: 92.8,
            trend: '+12.3%',
            trendUp: true,
            avgLeaveDuration: 68
        },
        '2': {
            name: 'April 2025',
            bubbleData: [
                [1, 30, 10], [3, 24, 15], [5, 42, 8], [7, 18, 18], [10, 54, 5],
                [14, 12, 22], [21, 84, 4], [30, 36, 12], [45, 108, 3], [60, 24, 10],
                [90, 132, 2], [120, 48, 6], [180, 60, 3], [365, 192, 2]
            ],
            totalRequests: 120,
            avgProcessingTime: 48.2,
            approvalRate: 89.2,
            trend: '+8.7%',
            trendUp: true,
            avgLeaveDuration: 72
        },
        '3': {
            name: 'May 2025',
            bubbleData: [
                [1, 36, 12], [3, 30, 18], [5, 48, 10], [7, 24, 20], [10, 60, 6],
                [14, 18, 25], [21, 96, 5], [30, 42, 14], [45, 120, 4], [60, 30, 12],
                [90, 144, 3], [120, 54, 7], [180, 72, 4], [365, 216, 3]
            ],
            totalRequests: 143,
            avgProcessingTime: 52.8,
            approvalRate: 94.4,
            trend: '+15.1%',
            trendUp: true,
            avgLeaveDuration: 76
        }
    };

    const currentData = monthData[month];
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;
    const success = theme.palette.success.main;

    const bubbleChartOptions = {
        chart: {
            type: 'bubble',
            fontFamily: 'Poppins, sans-serif',
            foreColor: theme.palette.text.secondary,
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: false,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
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
        colors: [primary],
        plotOptions: {
            bubble: {
                minBubbleRadius: 8,
                maxBubbleRadius: 35,
                zScaling: true
            }
        },
        stroke: {
            show: true,
            width: 2,
            colors: [secondary]
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: false
        },
        grid: {
            borderColor: theme.palette.divider,
            strokeDashArray: 3,
            xaxis: {
                lines: {
                    show: true,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                }
            },
            padding: {
                top: 20,
                right: 20,
                bottom: 5,
                left: 20
            }
        },
        yaxis: {
            title: {
                text: 'Processing Time (Hours)',
                style: {
                    fontSize: '12px',
                    fontWeight: '600',
                    fontFamily: 'Poppins, sans-serif',
                    color: theme.palette.text.secondary
                }
            },
            labels: {
                style: {
                    colors: theme.palette.text.secondary,
                    fontSize: '10px',
                    fontFamily: 'Poppins, sans-serif'
                },
                formatter: function(val) {
                    return val + 'h';
                }
            },
            tickAmount: 6,
            min: 0,
            max: 240
        },
        xaxis: {
            title: {
                text: 'Leave Duration (Days)',
                style: {
                    fontSize: '12px',
                    fontWeight: '600',
                    fontFamily: 'Poppins, sans-serif',
                    color: theme.palette.text.secondary
                }
            },
            labels: {
                style: {
                    colors: theme.palette.text.secondary,
                    fontSize: '10px',
                    fontFamily: 'Poppins, sans-serif'
                },
                formatter: function(val) {
                    return val + 'd';
                }
            },
            type: 'numeric',
            min: 0,
            max: 400,
            tickAmount: 8
        },
        tooltip: {
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
            fillSeriesColor: false,
            style: {
                fontSize: '11px',
                fontFamily: 'Poppins, sans-serif'
            },
            custom: function({series, seriesIndex, dataPointIndex, w}) {
                const data = currentData.bubbleData[dataPointIndex];
                return `
                    <div style="padding: 10px; background: ${theme.palette.background.paper}; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                        <div style="font-weight: 600; color: ${primary}; margin-bottom: 5px;">Child Care Leave Request</div>
                        <div style="font-size: 10px; color: ${theme.palette.text.secondary};">
                            <div>Duration: <strong>${data[0]} days</strong></div>
                            <div>Frequency: <strong>${data[2]} requests</strong></div>
                        </div>
                    </div>
                `;
            }
        },
        fill: {
            opacity: 0.7,
            gradient: {
                enabled: true,
                shade: 'light',
                type: 'radial',
                shadeIntensity: 0.4,
                gradientToColors: [secondary],
                inverseColors: false,
                opacityFrom: 0.8,
                opacityTo: 0.4,
                stops: [0, 100]
            }
        }
    };

    const bubbleChartSeries = [
        {
            name: 'Child Care Leave Requests',
            data: currentData.bubbleData
        }
    ];

    return (
        <DashboardCard 
            title="Child Care Leave Analytics" 
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
                            {currentData.totalRequests}
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
                            {currentData.avgProcessingTime}h
                        </Typography>
                        <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px' }}
                        >
                            Avg Processing Time
                        </Typography>
                    </Box>
                    <Box>
                        <Typography 
                            variant="h6" 
                            color="success.main" 
                            fontWeight="600" 
                            sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '16px' }}
                        >
                            {currentData.avgLeaveDuration}d
                        </Typography>
                        <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px' }}
                        >
                            Avg Duration
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

            </Box>

            <Chart
                options={bubbleChartOptions}
                series={bubbleChartSeries}
                type="bubble"
                height="200px"
                width="640px"
            />
        </DashboardCard>
    );
};

export default ChildCareLeaveChart;