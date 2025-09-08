import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Select, MenuItem, Box } from '@mui/material';
import { Stack, Typography, Avatar, Chip } from '@mui/material';
import { IconArrowUpLeft, IconArrowDownRight, IconTrendingUp, IconCar } from '@tabler/icons-react';

import DashboardCard from '../../../components/shared/DashboardCard';

const VehiclePassChart = () => {
  const theme = useTheme();
  const [month, setMonth] = useState('1');

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  // Enhanced month-wise data with realistic vehicle pass numbers
  const monthData = {
    '1': {
      name: 'March 2025',
      issued: 1245,
      pending: 387,
      rejected: 168,
      series: [74.2, 21.8, 4.0], // Percentages
      trend: '+12.3%',
      trendIcon: IconArrowUpLeft,
      trendColor: '#10B981',
      trendBg: '#E0F2F1'
    },
    '2': {
      name: 'April 2025',
      issued: 1456,
      pending: 298,
      rejected: 146,
      series: [76.7, 15.7, 7.6],
      trend: '+16.9%',
      trendIcon: IconArrowUpLeft,
      trendColor: '#10B981',
      trendBg: '#E0F2F1'
    },
    '3': {
      name: 'May 2025',
      issued: 1389,
      pending: 421,
      rejected: 190,
      series: [69.6, 21.1, 9.3],
      trend: '-4.6%',
      trendIcon: IconArrowDownRight,
      trendColor: '#EF4444',
      trendBg: '#FEE2E2'
    }
  };

  const currentData = monthData[month];
  const totalPasses = currentData.issued + currentData.pending + currentData.rejected;
  const TrendIcon = currentData.trendIcon;

  const options = {
    chart: {
      type: 'donut',
      fontFamily: 'Poppins, sans-serif',
      height: 140,
      toolbar: { show: false },
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
    colors: ['#3B82F6', '#F59E0B', '#EF4444'],
    plotOptions: {
      pie: {
        startAngle: -100,
        endAngle: 270,
        donut: {
          size: '75%',
          labels: {
            show: true,
            name: { 
              show: false 
            },
            value: {
              fontSize: '18px',
              fontWeight: '600',
              fontFamily: 'Poppins, sans-serif',
              color: theme.palette.text.primary,
              formatter: (val) => `${parseFloat(val).toFixed(1)}%`,
            },
            total: {
              show: true,
              label: 'Success Rate',
              fontSize: '11px',
              fontWeight: '600',
              fontFamily: 'Poppins, sans-serif',
              color: theme.palette.text.secondary,
              formatter: () => `${currentData.series[0].toFixed(1)}%`,
            },
          },
        },
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    tooltip: {
      enabled: true,
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      style: {
        fontSize: '11px',
        fontFamily: 'Poppins, sans-serif'
      },
      y: {
        formatter: function(val, { seriesIndex }) {
          const labels = ['Issued', 'Pending', 'Rejected'];
          const counts = [currentData.issued, currentData.pending, currentData.rejected];
          return `${counts[seriesIndex].toLocaleString()} passes (${val.toFixed(1)}%)`;
        }
      }
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: { height: 130 },
          plotOptions: { pie: { donut: { size: '70%' } } },
        },
      },
    ],
  };

  const legendData = [
    { label: 'Issued', color: '#3B82F6', count: currentData.issued, percentage: currentData.series[0] },
    { label: 'Pending', color: '#F59E0B', count: currentData.pending, percentage: currentData.series[1] },
    { label: 'Rejected', color: '#EF4444', count: currentData.rejected, percentage: currentData.series[2] }
  ];

  return (
    <DashboardCard
      title="Vehicle Pass Overview"
      action={
        <Select
          id="month-dd"
          value={month}
          size="small"
          onChange={handleChange}
          className="bg-white rounded-md"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="1">March 2025</MenuItem>
          <MenuItem value="2">April 2025</MenuItem>
          <MenuItem value="3">May 2025</MenuItem>
        </Select>
      }
    >
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
        {/* Left Side - Statistics */}
        <div className="flex-1">
          {/* Total Passes */}
{/* Total Passes + Trend Indicator */}
<Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <div>
    <Typography 
      variant="h4" 
      fontWeight="600" 
      sx={{ 
        fontFamily: 'Poppins, sans-serif', 
        fontSize: '28px',
        color: theme.palette.primary.main 
      }}
    >
      {totalPasses.toLocaleString()}
    </Typography>
    <Typography 
      variant="body2" 
      color="text.secondary"
      sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px' }}
    >
      Total Applications
    </Typography>
  </div>

  {/* Trend Indicator */}
  <Stack direction="row" spacing={1} alignItems="center">
    <Avatar sx={{ 
      bgcolor: currentData.trendBg, 
      width: 24, 
      height: 24 
    }}>
      <TrendIcon size={14} color={currentData.trendColor} />
    </Avatar>
    <Typography 
      variant="body2" 
      fontWeight="600" 
      sx={{ 
        fontFamily: 'Poppins, sans-serif',
        fontSize: '12px',
        color: currentData.trendColor
      }}
    >
      {currentData.trend}
    </Typography>
  </Stack>
</Box>


        </div>

        {/* Right Side - Chart */}
        <div className="flex-shrink-0">
          <Chart options={options} series={currentData.series} type="donut" size= '155%' height="210px" />
        </div>
      </div>
    </DashboardCard>
  );
};

export default VehiclePassChart;