import { useRef, useMemo } from 'react';
import type { ChartConfiguration } from 'chart.js';
import { useChart } from '@/hooks/useChart';
import type { SetRecord } from '@/types';
import { formatDateForDisplay } from '@/utils';

interface ProgressChartProps {
  data: SetRecord[];
  exercise: string;
}

export function ProgressChart({ data, exercise }: ProgressChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const chartConfig = useMemo<ChartConfiguration | null>(() => {
    if (data.length === 0) return null;

    return {
      type: 'line',
      data: {
        labels: data.map((d) => formatDateForDisplay(d.Date)),
        datasets: [
          {
            label: `${exercise} Weight (lbs)`,
            data: data.map((d) => d.Weight),
            borderColor: 'rgb(79, 70, 229)',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
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
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Weight (lbs)',
            },
          },
        },
      },
    };
  }, [data, exercise]);

  useChart(canvasRef, chartConfig);

  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-500">
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
