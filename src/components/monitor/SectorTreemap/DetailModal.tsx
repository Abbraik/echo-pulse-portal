
import React from 'react';
import { X, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import SparklineChart from '@/components/think/components/SparklineChart';

interface DetailModalProps {
  tile: {
    id: string;
    name: string;
    value: number;
    target: number;
    weight: number;
    sector: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  tile,
  isOpen,
  onClose
}) => {
  if (!tile) return null;

  const performance = (tile.value / tile.target) * 100;
  const deviation = tile.value - tile.target;

  // Mock data for 90-day trend
  const trendData = Array.from({ length: 90 }, (_, i) => ({
    date: new Date(Date.now() - (89 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    value: tile.value + (Math.random() - 0.5) * 20
  }));

  // Mock breakdown data
  const breakdownData = [
    { date: '2024-01-15', value: tile.value + 5, remark: 'Above target' },
    { date: '2024-01-14', value: tile.value - 2, remark: 'Slight decline' },
    { date: '2024-01-13', value: tile.value + 8, remark: 'Strong performance' },
    { date: '2024-01-12', value: tile.value - 1, remark: 'Normal range' },
    { date: '2024-01-11', value: tile.value + 3, remark: 'Improving' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="detail-modal">
        <div className="modal-header">
          <h3 className="modal-title">{tile.name}</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="modal-close"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="modal-content">
          {/* Performance Summary */}
          <div className="performance-summary">
            <div className="metric">
              <label>Current Value</label>
              <span className="value">{tile.value}</span>
            </div>
            <div className="metric">
              <label>Target</label>
              <span className="value">{tile.target}</span>
            </div>
            <div className="metric">
              <label>Performance</label>
              <span className={`value ${performance >= 75 ? 'good' : performance >= 50 ? 'warning' : 'critical'}`}>
                {Math.round(performance)}%
              </span>
            </div>
            <div className="metric">
              <label>Deviation</label>
              <span className={`value ${deviation >= 0 ? 'positive' : 'negative'}`}>
                {deviation > 0 ? '+' : ''}{Math.round(deviation)}
              </span>
            </div>
          </div>

          {/* 90-Day Trend Chart */}
          <div className="trend-section">
            <h4>90-Day Trend</h4>
            <div className="trend-chart">
              <SparklineChart 
                data={trendData.map(d => d.value)} 
                width={500} 
                height={120} 
                color="#00FFC3"
              />
            </div>
          </div>

          {/* Data Breakdown Table */}
          <div className="breakdown-section">
            <h4>Recent Data</h4>
            <div className="breakdown-table">
              <div className="table-header">
                <span>Date</span>
                <span>Value</span>
                <span>Remark</span>
              </div>
              {breakdownData.map((row, index) => (
                <div key={index} className="table-row">
                  <span>{row.date}</span>
                  <span>{row.value}</span>
                  <span>{row.remark}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="modal-actions">
            <Button className="detail-button">
              <TrendingUp className="w-4 h-4 mr-2" />
              Go to Detailed View
            </Button>
          </div>
        </div>

        <style jsx>{`
          .detail-modal {
            background: rgba(20,30,50,0.85);
            backdrop-filter: blur(32px);
            border: 1px solid rgba(0,255,195,0.3);
            border-radius: 1rem;
            padding: 0;
            max-width: 600px;
            max-height: 80vh;
            overflow: hidden;
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
          }

          .modal-title {
            font: 18px "Noto Sans", sans-serif;
            font-weight: 700;
            color: #00FFC3;
            margin: 0;
          }

          .modal-close {
            color: #FFFFFF;
            background: transparent;
            border: none;
            cursor: pointer;
          }

          .modal-content {
            padding: 24px;
            overflow-y: auto;
            max-height: calc(80vh - 80px);
          }

          .performance-summary {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin-bottom: 24px;
          }

          .metric {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .metric label {
            font: 12px "Noto Sans", sans-serif;
            color: #B0B0B0;
          }

          .metric .value {
            font: 20px "Noto Sans", sans-serif;
            font-weight: 700;
            color: #FFFFFF;
          }

          .metric .value.good { color: #00FFC3; }
          .metric .value.warning { color: #FFC107; }
          .metric .value.critical { color: #FF6E6E; }
          .metric .value.positive { color: #00FFC3; }
          .metric .value.negative { color: #FF6E6E; }

          .trend-section,
          .breakdown-section {
            margin-bottom: 24px;
          }

          .trend-section h4,
          .breakdown-section h4 {
            font: 14px "Noto Sans", sans-serif;
            font-weight: 600;
            color: #FFFFFF;
            margin: 0 0 12px 0;
          }

          .trend-chart {
            background: rgba(0,0,0,0.3);
            border-radius: 8px;
            padding: 16px;
            border: 1px solid rgba(255,255,255,0.1);
          }

          .breakdown-table {
            background: rgba(0,0,0,0.3);
            border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.1);
            overflow: hidden;
          }

          .table-header {
            display: grid;
            grid-template-columns: 1fr 80px 1fr;
            gap: 16px;
            padding: 12px 16px;
            background: rgba(255,255,255,0.05);
            font: 12px "Noto Sans", sans-serif;
            font-weight: 600;
            color: #B0B0B0;
          }

          .table-row {
            display: grid;
            grid-template-columns: 1fr 80px 1fr;
            gap: 16px;
            padding: 12px 16px;
            border-top: 1px solid rgba(255,255,255,0.05);
            font: 12px "Noto Sans", sans-serif;
            color: #FFFFFF;
          }

          .modal-actions {
            display: flex;
            justify-content: flex-end;
            margin-top: 24px;
          }

          .detail-button {
            background: #00B8FF;
            color: #FFFFFF;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font: 14px "Noto Sans", sans-serif;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
          }

          .detail-button:hover {
            background: #0099CC;
            transform: translateY(-1px);
          }

          @media (max-width: 768px) {
            .detail-modal {
              max-width: 95vw;
              margin: 20px;
            }

            .performance-summary {
              grid-template-columns: 1fr;
            }

            .table-header,
            .table-row {
              grid-template-columns: 1fr;
              gap: 8px;
            }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};
