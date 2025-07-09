import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Check, X, Info } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface EquilibriumBand {
  upper: number;
  lower: number;
  timeIndex: number;
}

interface EquilibriumBandWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chartData: number[];
  timeLabels: string[];
  onConfirm: (bands: EquilibriumBand[]) => void;
}

const EquilibriumBandWizard: React.FC<EquilibriumBandWizardProps> = ({
  open,
  onOpenChange,
  chartData,
  timeLabels,
  onConfirm
}) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bands, setBands] = useState<EquilibriumBand[]>([]);
  const [isDrawing, setIsDrawing] = useState<'upper' | 'lower' | null>(null);
  const [currentBand, setCurrentBand] = useState<Partial<EquilibriumBand>>({});

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set up gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(20, 30, 50, 0.8)');
    gradient.addColorStop(1, 'rgba(15, 23, 42, 0.9)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Calculate scales
    const maxValue = Math.max(...chartData);
    const minValue = Math.min(...chartData);
    const range = maxValue - minValue;
    const xScale = (width - 2 * padding) / (chartData.length - 1);
    const yScale = (height - 2 * padding) / range;

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let i = 0; i < chartData.length; i += Math.ceil(chartData.length / 5)) {
      const x = padding + i * xScale;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding)) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw the main chart line
    ctx.strokeStyle = '#14b8a6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    chartData.forEach((value, index) => {
      const x = padding + index * xScale;
      const y = height - padding - (value - minValue) * yScale;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();

    // Draw chart points
    ctx.fillStyle = '#14b8a6';
    chartData.forEach((value, index) => {
      const x = padding + index * xScale;
      const y = height - padding - (value - minValue) * yScale;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw existing bands
    bands.forEach((band, index) => {
      const x = padding + band.timeIndex * xScale;
      const upperY = height - padding - (band.upper - minValue) * yScale;
      const lowerY = height - padding - (band.lower - minValue) * yScale;

      // Band area
      ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
      ctx.fillRect(x - 10, upperY, 20, lowerY - upperY);

      // Band lines
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      
      // Upper line
      ctx.beginPath();
      ctx.moveTo(x - 10, upperY);
      ctx.lineTo(x + 10, upperY);
      ctx.stroke();

      // Lower line
      ctx.beginPath();
      ctx.moveTo(x - 10, lowerY);
      ctx.lineTo(x + 10, lowerY);
      ctx.stroke();

      // Labels
      ctx.fillStyle = '#22c55e';
      ctx.font = '12px monospace';
      ctx.fillText(`${band.upper.toFixed(1)}`, x + 15, upperY + 4);
      ctx.fillText(`${band.lower.toFixed(1)}`, x + 15, lowerY + 4);
    });

    // Draw current drawing band
    if (isDrawing && currentBand.timeIndex !== undefined) {
      const x = padding + currentBand.timeIndex * xScale;
      
      if (currentBand.upper !== undefined) {
        const upperY = height - padding - (currentBand.upper - minValue) * yScale;
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(x - 15, upperY);
        ctx.lineTo(x + 15, upperY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      if (currentBand.lower !== undefined) {
        const lowerY = height - padding - (currentBand.lower - minValue) * yScale;
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(x - 15, lowerY);
        ctx.lineTo(x + 15, lowerY);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Draw labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '12px sans-serif';
    
    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
      const value = minValue + (range * i) / 5;
      const y = height - padding - (i * (height - 2 * padding)) / 5;
      ctx.fillText(value.toFixed(1), 5, y + 4);
    }

    // X-axis labels
    timeLabels.forEach((label, index) => {
      if (index % Math.ceil(timeLabels.length / 5) === 0) {
        const x = padding + index * xScale;
        ctx.save();
        ctx.translate(x, height - 10);
        ctx.rotate(-Math.PI / 4);
        ctx.fillText(label, 0, 0);
        ctx.restore();
      }
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const padding = 40;
    const width = canvas.width;
    const height = canvas.height;
    const xScale = (width - 2 * padding) / (chartData.length - 1);
    const yScale = (height - 2 * padding) / (Math.max(...chartData) - Math.min(...chartData));

    // Calculate time index
    const timeIndex = Math.round((x - padding) / xScale);
    if (timeIndex < 0 || timeIndex >= chartData.length) return;

    // Calculate value
    const minValue = Math.min(...chartData);
    const value = minValue + (height - padding - y) / yScale;

    if (!isDrawing) {
      // Start new band
      setIsDrawing('upper');
      setCurrentBand({ timeIndex, upper: value });
    } else if (isDrawing === 'upper') {
      // Set upper bound, now draw lower
      setIsDrawing('lower');
      setCurrentBand(prev => ({ ...prev, upper: value }));
    } else if (isDrawing === 'lower') {
      // Complete the band
      const newBand: EquilibriumBand = {
        timeIndex: currentBand.timeIndex!,
        upper: Math.max(currentBand.upper!, value),
        lower: Math.min(currentBand.upper!, value)
      };
      
      setBands(prev => [...prev, newBand]);
      setIsDrawing(null);
      setCurrentBand({});
    }
  };

  const handleConfirm = () => {
    onConfirm(bands);
    onOpenChange(false);
    toast({
      title: t('equilibriumBandsSet'),
      description: t('targetRangesLocked'),
      duration: 3000,
    });
  };

  const handleReset = () => {
    setBands([]);
    setIsDrawing(null);
    setCurrentBand({});
  };

  useEffect(() => {
    if (open) {
      const timer = setTimeout(drawChart, 100);
      return () => clearTimeout(timer);
    }
  }, [open, chartData, bands, isDrawing, currentBand]);

  useEffect(() => {
    drawChart();
  }, [chartData, bands, isDrawing, currentBand]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] glass-panel-deep">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500">
            <Target className="w-5 h-5 text-teal-400 mr-3" />
            {t('equilibriumBandWizard')}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-sm text-gray-400">
              <Info className="w-4 h-4 mr-2" />
              {isDrawing === 'upper' && 'Click to set upper bound'}
              {isDrawing === 'lower' && 'Click to set lower bound'}
              {!isDrawing && 'Click to start drawing equilibrium band'}
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
                className="border-white/20 text-gray-400"
              >
                <X className="w-4 h-4 mr-2" />
                {t('reset')}
              </Button>
              <Button
                onClick={handleConfirm}
                className="bg-gradient-to-r from-teal-600 to-blue-600"
                disabled={bands.length === 0}
              >
                <Check className="w-4 h-4 mr-2" />
                {t('confirm')}
              </Button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center bg-white/5 rounded-xl border border-white/10">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              onClick={handleCanvasClick}
              className="cursor-crosshair rounded-lg"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          </div>

          <div className="mt-4 text-sm text-gray-400">
            <p><strong>Instructions:</strong> Click on the chart to define equilibrium bands. First click sets the upper bound, second click sets the lower bound.</p>
            <p className="mt-1">Current bands: {bands.length}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EquilibriumBandWizard;