import { useRef, useMemo } from 'react';
import type { ChartConfiguration } from 'chart.js';
import { useChart } from '@/hooks/useChart';
import { useTheme } from '@/context';
import type { SetRecord } from '@/types';
import { formatDateForDisplay } from '@/utils';

interface ProgressChartProps {
  data: SetRecord[];
  exercise: string;
}

export function ProgressChart({ data, exercise }: ProgressChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartConfig = useMemo<ChartConfiguration | null>(() => {
    if (data.length === 0) return null;

    // voget.io theme colors
    const cyanColor = '#00d4ff';
    const textColor = isDark ? 'hsl(210, 40%, 98%)' : 'hsl(220, 50%, 10%)';
    const gridColor = isDark ? 'rgba(100, 150, 255, 0.1)' : 'rgba(100, 150, 255, 0.15)';
    const tooltipBg = isDark ? '#121821' : '#ffffff';

    return {
      type: 'line',
      data: {
        labels: data.map((d) => formatDateForDisplay(d.Date)),
        datasets: [
          {
            label: `${exercise} Weight (lbs)`,
            data: data.map((d) => d.Weight),
            borderColor: cyanColor,
            backgroundColor: 'rgba(0, 212, 255, 0.1)',
            tension: 0.3,
            fill: true,
            pointBackgroundColor: cyanColor,
            pointBorderColor: cyanColor,
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
  }, [data, exercise, isDark]);

  useChart(canvasRef, chartConfig);

  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-muted-foreground">
        No data to display
      </div>
    );
  }

  return (
    <div className="h-48">
      <canvas ref={canvasRef} />
    </div>
  );
}
