import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Fab, Select, MenuItem, Box } from '@mui/material';
import { IconArrowDownRight, IconFileCheck, IconTrendingUp } from '@tabler/icons-react';
import DashboardCard from '../../../components/shared/DashboardCard';

const NOCApplicationChart = () => {
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const secondarylight = '#f5fcff';
  const errorlight = '#fdede8';
  const [month, setMonth] = useState('1');

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  const monthData = {
    '1': {
      name: 'March 2025',
      applications: [45, 52, 38, 65, 48, 71, 58, 63, 47, 69, 55, 72, 68, 74, 61, 78, 66, 82, 75, 88, 79, 91, 85, 94, 89, 97, 92, 103, 98, 105, 102],
      days: Array.from({length: 31}, (_, i) => i + 1),
      totalApplications: 2156,
      avgDaily: 69.5,
      trend: '+12.3%'
    },
    '2': {
      name: 'April 2025',
      applications: [58, 62, 55, 73, 68, 81, 76, 84, 72, 89, 85, 92, 88, 95, 91, 98, 94, 102, 99, 106, 103, 109, 107, 112, 110, 115, 113, 118, 116, 121],
      days: Array.from({length: 30}, (_, i) => i + 1),
      totalApplications: 2743,
      avgDaily: 91.4,
      trend: '+27.2%'
    },
    '3': {
      name: 'May 2025',
      applications: [68, 72, 65, 83, 78, 91, 86, 94, 82, 99, 95, 102, 98, 105, 101, 108, 104, 112, 109, 116, 113, 119, 117, 122, 120, 125, 123, 128, 126, 131, 129],
      days: Array.from({length: 31}, (_, i) => i + 1),
      totalApplications: 3254,
      avgDaily: 104.9,
      trend: '+18.6%'
    }
  };

  const currentMonthData = monthData[month];

  const options = {
    chart: {
      type: 'area',
      fontFamily: 'Inter, sans-serif',
      height: 300,
      sparkline: { enabled: false },
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
      animations: { 
        enabled: true, 
        easing: 'easeinout', 
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        }
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: { 
      curve: 'smooth', 
      width: 3,
      colors: [secondary]
    },
    fill: { 
      colors: [secondarylight], 
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    markers: { 
      size: 4,
      colors: [secondary],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        sizeOffset: 2
      }
    },
    colors: [secondary],
    grid: {
      show: true,
      borderColor: theme.palette.divider,
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        top: 0,
        right: 30,
        bottom: 0,
        left: 20
      }
    },
    xaxis: {
      categories: currentMonthData.days,
      title: {
        text: 'Day of Month',
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
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      title: {
        text: 'Applications Submitted',
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
        formatter: function (val) {
          return Math.floor(val);
        }
      }
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      style: {
        fontSize: '10px',
        fontFamily: 'Poppins, sans-serif'
      },
      x: {
        formatter: function(val) {
          return `Day ${val} of ${currentMonthData.name}`;
        }
      },
      y: {
        formatter: function(val) {
          return `${val} applications`;
        },
        title: {
          formatter: () => 'NOC Applications:'
        }
      },
      marker: {
        show: true
      }
    },
    legend: {
      show: false
    }
  };

  const series = [
    {
      name: 'NOC Applications',
      data: currentMonthData.applications,
    },
  ];

  return (
    <DashboardCard
      title="NOC Application Overview"
      action={
        <div>
          <Select
            id="month-dd"
            value={month}
            size="small"
            onChange={handleChange}
            className="bg-white rounded-md"
            sx={{ minWidth: 100, ml: 2 }}
          >
            <MenuItem value="1">March 2025</MenuItem>
            <MenuItem value="2">April 2025</MenuItem>
            <MenuItem value="3">May 2025</MenuItem>
          </Select>
        
        </div>
      }
    >
      {/* Statistics Summary */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h6" color="primary" fontWeight="600" sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '16px' }}>
              {currentMonthData.totalApplications.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px' }}>
              Total Applications
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" color="secondary" fontWeight="600" sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '16px' }}>
              {currentMonthData.avgDaily}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px' }}>
              Daily Average
            </Typography>
          </Box>
          <Box>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <IconTrendingUp size={14} color={theme.palette.success.main} />
              <Typography variant="body1" color="success.main" fontWeight="600" sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}>
                {currentMonthData.trend}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px' }}>
              vs Previous Month
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Chart */}
      <Chart options={options} series={series} type="area" height="240px" />
    </DashboardCard>
  );
};

export default NOCApplicationChart;