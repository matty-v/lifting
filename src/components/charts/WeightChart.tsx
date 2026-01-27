import { useRef, useMemo } from 'react';
import type { ChartConfiguration } from 'chart.js';
import { useChart } from '@/hooks/useChart';
import { useTheme } from '@/context';
import type { WeightRecord } from '@/types';
import { formatDateForDisplay } from '@/utils';

interface WeightChartProps {
  data: WeightRecord[];
}

export function WeightChart({ data }: WeightChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartConfig = useMemo<ChartConfiguration | null>(() => {
    if (data.length === 0) return null;

    // voget.io theme colors
    const purpleColor = '#a78bfa';
    const textColor = isDark ? 'hsl(210, 40%, 98%)' : 'hsl(220, 50%, 10%)';
    const gridColor = isDark ? 'rgba(100, 150, 255, 0.1)' : 'rgba(100, 150, 255, 0.15)';
    const tooltipBg = isDark ? '#121821' : '#ffffff';

    return {
      type: 'line',
      data: {
        labels: data.map((d) => formatDateForDisplay(d.Date)),
        datasets: [
          {
            label: 'Body Weight (lbs)',
            data: data.map((d) => d.Weight),
            borderColor: purpleColor,
            backgroundColor: 'rgba(167, 139, 250, 0.1)',
            tension: 0.3,
            fill: true,
            pointBackgroundColor: purpleColor,
            pointBorderColor: purpleColor,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: tooltipBg,
            titleColor: textColor,
            bodyColor: textColor,
            borderColor: 'rgba(100, 150, 255, 0.2)',
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColor,
            },
            grid: {
              color: gridColor,
            },
          },
          y: {
            beginAtZero: false,
            ticks: {
              color: textColor,
            },
            grid: {
              color: gridColor,
            },
            title: {
              display: true,
              text: 'Weight (lbs)',
              color: textColor,
            },
          },
        },
      },
    };
  }, [data, isDark]);

  useChart(canvasRef, chartConfig);

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="h-48">
      <canvas ref={canvasRef} />
    </div>
  );
}
