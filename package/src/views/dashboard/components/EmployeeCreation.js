import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Select, MenuItem, Box } from '@mui/material';
import { Stack, Typography, Avatar, Chip } from '@mui/material';
import { IconArrowUpLeft, IconArrowDownRight, IconTrendingUp, IconUsers, IconTarget, IconClock, IconCheck } from '@tabler/icons-react';

import DashboardCard from '../../../components/shared/DashboardCard';

const EmployeeCreationChart = () => {
  const theme = useTheme();
  const [month, setMonth] = useState('1');

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  // Enhanced month-wise data with realistic employee creation numbers
  const monthData = {
    '1': {
      name: 'March 2025',
      created: 89,
      inProgress: 23,
      onHold: 8,
      target: 120,
      series: [74.2], // Success rate percentage for radial
      trend: '+12.3%',
      trendIcon: IconArrowUpLeft,
      trendColor: '#10B981',
      trendBg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
    },
    '2': {
      name: 'April 2025',
      created: 97,
      inProgress: 18,
      onHold: 5,
      target: 120,
      series: [80.8],
      trend: '+16.9%',
      trendIcon: IconArrowUpLeft,
      trendColor: '#10B981',
      trendBg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
    },
    '3': {
      name: 'May 2025',
      created: 76,
      inProgress: 31,
      onHold: 13,
      target: 120,
      series: [63.3],
      trend: '-4.6%',
      trendIcon: IconArrowDownRight,
      trendColor: '#EF4444',
      trendBg: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
    }
  };

  const currentData = monthData[month];
  const totalEmployees = currentData.created + currentData.inProgress + currentData.onHold;
  const TrendIcon = currentData.trendIcon;

  const radialOptions = {
    chart: {
      type: 'radialBar',
      fontFamily: '"Inter", sans-serif',
      height: 280,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1500,
        animateGradually: {
          enabled: true,
          delay: 200
        }
      },
      dropShadow: {
        enabled: true,
        top: 0,
        left: 0,
        blur: 20,
        opacity: 0.1,
        color: '#6366F1'
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          margin: 15,
          size: '55%',
          background: 'transparent',
          dropShadow: {
            enabled: true,
            top: 0,
            left: 0,
            blur: 10,
            opacity: 0.05
          }
        },

        
        track: {
          background: theme.palette.mode === 'dark' ? '#1F2937' : '#F8FAFC',
          strokeWidth: '100%',
          margin: 0,
          dropShadow: {
            enabled: true,
            top: 0,
            left: 0,
            blur: 4,
            opacity: 0.03
          }
        },
        dataLabels: {
          show: true,
          name: {
            offsetY: 15,
            show: true,
            color: theme.palette.text.secondary,
            fontSize: '14px',
            fontWeight: '600',
            fontFamily: '"Inter", sans-serif'
          },
          value: {
            formatter: function(val) {
              return parseInt(val) + '%';
            },
            color: theme.palette.text.primary,
            fontSize: '42px',
            fontWeight: '800',
            fontFamily: '"Inter", sans-serif',
            show: true,
            offsetY: -10,
            
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.8,
        gradientToColors: ['#8B5CF6', '#3B82F6'],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.9,
        stops: [0, 50, 100]
      }
    },
    colors: ['#6366F1'],
    stroke: {
      lineCap: 'round',
      width: 8
    },
    labels: ['Success Rate'],
  };

  // Mini donut chart for breakdown
  const breakdownOptions = {
    chart: {
      type: 'donut',
      height: 120,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1000,
      }
    },
    colors: ['#10B981', '#F59E0B', '#EF4444'],
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: false
          }
        }
      }
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    stroke: { width: 0 },
    tooltip: {
      enabled: true,
      y: {
        formatter: function(val, { seriesIndex }) {
          const labels = ['Created', 'In Progress', 'On Hold'];
          const counts = [currentData.created, currentData.inProgress, currentData.onHold];
          return `${counts[seriesIndex]} ${labels[seriesIndex]}`;
        }
      }
    }
  };

  const breakdownSeries = [
    (currentData.created / totalEmployees) * 100,
    (currentData.inProgress / totalEmployees) * 100,
    (currentData.onHold / totalEmployees) * 100
  ];

  return (
    <DashboardCard
      title="Employee Creation Overview"
      action={
        <Select
          id="month-dd"
          value={month}
          size="small"
          onChange={handleChange}
          sx={{ 
            minWidth: 120,
            '& .MuiSelect-select': {
              fontSize: '12px',
              fontWeight: '600'
            }
          }}
        >
          <MenuItem value="1">March 2025</MenuItem>
          <MenuItem value="2">April 2025</MenuItem>
          <MenuItem value="3">May 2025</MenuItem>
        </Select>
      }
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        {/* Animated Background Elements */}
        <Box sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          borderRadius: '50%',
          opacity: 0.03,
          animation: 'pulse 4s ease-in-out infinite'
        }} />
        
        <Box sx={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 120,
          height: 120,
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          borderRadius: '50%',
          opacity: 0.05,
          animation: 'pulse 3s ease-in-out infinite reverse'
        }} />

        {/* Header with Enhanced Stats */}
        <Box sx={{ mb: 3, position: 'relative', zIndex: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Stack direction="row" alignItems="baseline" spacing={1}>
                <Typography 
                  variant="h2" 
                  fontWeight="900" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif', 
                    fontSize: '48px',
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1,
                    letterSpacing: '-0.02em'
                  }}
                >
                  {totalEmployees}
                </Typography>
                <Chip
                  label={`${currentData.target} Target`}
                  size="small"
                  sx={{
                    bgcolor: '#F1F5F9',
                    color: theme.palette.text.secondary,
                    fontSize: '10px',
                    fontWeight: '600',
                    height: 20
                  }}
                />
              </Stack>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  fontFamily: '"Inter", sans-serif', 
                  fontSize: '13px',
                  fontWeight: '600',
                  mt: 0.5
                }}
              >
                Total Employees Created
              </Typography>
            </Box>

            {/* Enhanced Trend Indicator */}
            <Box sx={{
              background: currentData.trendBg,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <TrendIcon size={18} color="white" />
              <Typography 
                variant="body2" 
                fontWeight="700" 
                sx={{ 
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '14px',
                  color: 'white'
                }}
              >
                {currentData.trend}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Main Content Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 4, alignItems: 'center' }}>
          {/* Left Side - Enhanced Status Cards */}
          <Box>


            {/* Enhanced Status Cards with Icons */}
            <Stack spacing={2}>
              {[
                { 
                  label: 'Successfully Created', 
                  color: '#10B981', 
                  count: currentData.created,
                  icon: IconCheck,
                  bgGradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)'
                },
                { 
                  label: 'Currently Processing', 
                  color: '#F59E0B', 
                  count: currentData.inProgress,
                  icon: IconClock,
                  bgGradient: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)'
                },
                { 
                  label: 'Temporarily On Hold', 
                  color: '#EF4444', 
                  count: currentData.onHold,
                  icon: IconTarget,
                  bgGradient: 'linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%)'
                }
              ].map((status, index) => {
                const StatusIcon = status.icon;
                return (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      borderRadius: 2,
                      background: status.bgGradient,
                      border: `2px solid ${status.color}20`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 25px ${status.color}20`
                      }
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ 
                        bgcolor: status.color, 
                        width: 40, 
                        height: 40,
                        boxShadow: `0 4px 12px ${status.color}30`
                      }}>
                        <StatusIcon size={20} color="white" />
                      </Avatar>
                      <Box>
                        <Typography 
                          variant="body2" 
                          fontWeight="600"
                          sx={{ 
                            fontFamily: '"Inter", sans-serif',
                            fontSize: '13px',
                            color: theme.palette.text.primary,
                            lineHeight: 1.2
                          }}
                        >
                          {status.label}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontFamily: '"Inter", sans-serif',
                            fontSize: '11px',
                            color: theme.palette.text.secondary
                          }}
                        >
                          {((status.count / totalEmployees) * 100).toFixed(1)}% of total
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography 
                      variant="h5" 
                      fontWeight="800"
                      sx={{ 
                        fontFamily: '"Inter", sans-serif',
                        fontSize: '24px',
                        color: status.color
                      }}
                    >
                      {status.count}
                    </Typography>
                  </Box>
                );
              })}
            </Stack>
          </Box>

          {/* Right Side - Enhanced Radial Chart with Mini Breakdown */}
          <Box sx={{ position: 'relative', textAlign: 'center' }}>
            <Chart 
              options={radialOptions} 
              series={currentData.series} 
              type="radialBar" 
              height="280px"
            />
            
          
          </Box>
        </Box>

        <style jsx>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.03; }
            50% { transform: scale(1.1); opacity: 0.08; }
          }
        `}</style>
      </Box>
    </DashboardCard>
  );
};

export default EmployeeCreationChart;