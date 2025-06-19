
import { useState, useEffect } from 'react';
import { SGDashboardData } from '@/types/sg';
import { sgMockApi } from '@/api/sg-mock-api';
import { useToast } from '@/hooks/use-toast';

export const useSGData = () => {
  const [data, setData] = useState<SGDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [
        strategicRes,
        approvalsRes,
        coordinationRes,
        risksRes,
        anomaliesRes,
        summaryRes
      ] = await Promise.all([
        sgMockApi.getStrategic(),
        sgMockApi.getApprovals(),
        sgMockApi.getCoordination(),
        sgMockApi.getRisks(),
        sgMockApi.getAnomalies(),
        sgMockApi.getSummary()
      ]);

      // Check for any API errors
      const responses = [strategicRes, approvalsRes, coordinationRes, risksRes, anomaliesRes, summaryRes];
      const hasErrors = responses.some(res => res.status === 'error');

      if (hasErrors) {
        throw new Error('Failed to fetch some dashboard data');
      }

      // Combine all data
      const combinedData: SGDashboardData = {
        strategic: strategicRes.data,
        approvals: approvalsRes.data,
        coordination: coordinationRes.data,
        risks: risksRes.data,
        anomalies: anomaliesRes.data,
        summary: summaryRes.data
      };

      setData(combinedData);
      setLastUpdated(new Date().toISOString());
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
      setError(errorMessage);
      toast({
        title: "Data Loading Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchAllData();
  };

  // Action handlers
  const approveItem = async (id: string) => {
    try {
      const response = await sgMockApi.approveItem(id);
      if (response.status === 'success') {
        toast({
          title: "Item Approved",
          description: response.message,
        });
        // Refresh approvals data
        const approvalsRes = await sgMockApi.getApprovals();
        if (data && approvalsRes.status === 'success') {
          setData({
            ...data,
            approvals: approvalsRes.data
          });
        }
      }
    } catch (err) {
      toast({
        title: "Approval Failed",
        description: "Failed to approve item",
        variant: "destructive",
      });
    }
  };

  const reviseItem = async (id: string, notes: string) => {
    try {
      const response = await sgMockApi.reviseItem(id, notes);
      if (response.status === 'success') {
        toast({
          title: "Revision Requested",
          description: response.message,
        });
        // Refresh approvals data
        const approvalsRes = await sgMockApi.getApprovals();
        if (data && approvalsRes.status === 'success') {
          setData({
            ...data,
            approvals: approvalsRes.data
          });
        }
      }
    } catch (err) {
      toast({
        title: "Revision Failed",
        description: "Failed to submit revision request",
        variant: "destructive",
      });
    }
  };

  const acknowledgeEscalation = async (id: string) => {
    try {
      const response = await sgMockApi.acknowledgeEscalation(id);
      if (response.status === 'success') {
        toast({
          title: "Escalation Acknowledged",
          description: response.message,
        });
        // Refresh coordination data
        const coordinationRes = await sgMockApi.getCoordination();
        if (data && coordinationRes.status === 'success') {
          setData({
            ...data,
            coordination: coordinationRes.data
          });
        }
      }
    } catch (err) {
      toast({
        title: "Acknowledgment Failed",
        description: "Failed to acknowledge escalation",
        variant: "destructive",
      });
    }
  };

  const updateRisk = async (id: string, impact: number, likelihood: number) => {
    try {
      const response = await sgMockApi.updateRisk(id, impact, likelihood);
      if (response.status === 'success') {
        toast({
          title: "Risk Updated",
          description: response.message,
        });
        // Refresh risks data
        const risksRes = await sgMockApi.getRisks();
        if (data && risksRes.status === 'success') {
          setData({
            ...data,
            risks: risksRes.data
          });
        }
      }
    } catch (err) {
      toast({
        title: "Risk Update Failed",
        description: "Failed to update risk assessment",
        variant: "destructive",
      });
    }
  };

  const exportSummary = async (format: 'pdf' | 'xlsx') => {
    try {
      const response = await sgMockApi.exportSummary(format);
      if (response.status === 'success') {
        toast({
          title: "Export Started",
          description: response.message,
        });
        // In a real app, you would trigger the download here
        console.log('Download URL:', response.data.downloadUrl);
      }
    } catch (err) {
      toast({
        title: "Export Failed",
        description: "Failed to export summary",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refreshData,
    actions: {
      approveItem,
      reviseItem,
      acknowledgeEscalation,
      updateRisk,
      exportSummary
    }
  };
};
