import { useRef, useMemo } from 'react';
import type { ChartConfiguration } from 'chart.js';
import { useChart } from '@/hooks/useChart';
import type { WeightRecord } from '@/types';
import { formatDateForDisplay } from '@/utils';

interface WeightChartProps {
  data: WeightRecord[];
}

export function WeightChart({ data }: WeightChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const chartConfig = useMemo<ChartConfiguration | null>(() => {
    if (data.length === 0) return null;

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
  }, [data]);

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
