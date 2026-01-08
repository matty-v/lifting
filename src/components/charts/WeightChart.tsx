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

    const textColor = isDark ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)';
    const gridColor = isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.8)';

    return {
      type: 'line',
      data: {
        labels: data.map((d) => formatDateForDisplay(d.Date)),
        datasets: [
          {
            label: 'Body Weight (lbs)',
            data: data.map((d) => d.Weight),
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.3,
            fill: true,
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
            backgroundColor: isDark ? 'rgb(31, 41, 55)' : 'rgb(255, 255, 255)',
            titleColor: textColor,
            bodyColor: textColor,
            borderColor: isDark ? 'rgb(75, 85, 99)' : 'rgb(229, 231, 235)',
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
