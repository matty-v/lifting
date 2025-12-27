import { useRef, useEffect, RefObject } from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

export function useChart(
  canvasRef: RefObject<HTMLCanvasElement>,
  config: ChartConfiguration | null
) {
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !config) return;

    // Destroy existing chart if exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    // Create new chart
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      chartInstance.current = new Chart(ctx, config);
    }

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [canvasRef, config]);

  return chartInstance;
}
