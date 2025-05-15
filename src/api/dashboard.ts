
// Mock API functions for fetching dashboard data
// In a real application, these would call actual API endpoints

// Types for our dashboard data
export interface KPI {
  id: string;
  name: string;
  value: number;
  target: number;
  min: number;
  max: number;
  color: string;
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  message: string;
  timestamp: string;
  isNew?: boolean;
}

export interface ActivityEvent {
  id: string;
  event: string;
  time: string;
  timeAgo: string;
}

export interface PulseData {
  score: number;
  stability: number;
  status: string;
  breakdown: {
    [key: string]: {
      name: string;
      value: number;
      color: string;
    }
  }
}

// Mock API functions
export const getKPIs = async (): Promise<KPI[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    { 
      id: '1', 
      name: 'Network Development Index', 
      value: 76, 
      target: 80, 
      min: 0, 
      max: 100,
      color: 'teal' 
    },
    { 
      id: '2', 
      name: 'Network Reach', 
      value: 45, 
      target: 60, 
      min: 0, 
      max: 100,
      color: 'blue' 
    },
    { 
      id: '3', 
      name: 'Equilibrium Status', 
      value: 82, 
      target: 75, 
      min: 0, 
      max: 100,
      color: 'emerald'
    },
  ];
};

export const getAlerts = async (): Promise<Alert[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return [
    {
      id: '1',
      type: 'warning',
      message: 'Resource allocation at 85% capacity',
      timestamp: new Date().toISOString(),
      isNew: true
    },
    {
      id: '2',
      type: 'error',
      message: 'Population model deviation detected',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 minutes ago
    },
    {
      id: '3',
      type: 'info',
      message: 'System update scheduled for tonight',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() // 45 minutes ago
    },
    {
      id: '4',
      type: 'success',
      message: 'New data sources integrated successfully',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() // 2 hours ago
    }
  ];
};

export const getActivity = async (): Promise<ActivityEvent[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return [
    {
      id: '1',
      event: 'Equilibrium bands computed',
      time: '10:45 AM',
      timeAgo: '5m ago'
    },
    {
      id: '2',
      event: 'Population model updated',
      time: '10:30 AM',
      timeAgo: '20m ago'
    },
    {
      id: '3',
      event: 'Pilot program launched',
      time: '9:15 AM',
      timeAgo: '1h ago'
    },
    {
      id: '4',
      event: 'Resource allocation optimized',
      time: '8:45 AM',
      timeAgo: '2h ago'
    },
    {
      id: '5',
      event: 'Forecast models recalibrated',
      time: '8:00 AM',
      timeAgo: '3h ago'
    },
    {
      id: '6',
      event: 'New data sources integrated',
      time: 'Yesterday',
      timeAgo: '1d ago'
    },
    {
      id: '7',
      event: 'System maintenance completed',
      time: 'Yesterday',
      timeAgo: '1d ago'
    },
  ];
};

export const getPulse = async (): Promise<PulseData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 900));
  
  return {
    score: 78,
    stability: 75,
    status: "All systems operational",
    breakdown: {
      health: {
        name: 'Health',
        value: 82,
        color: 'teal-400'
      },
      education: {
        name: 'Education',
        value: 68,
        color: 'blue-400'
      },
      economy: {
        name: 'Economy',
        value: 74,
        color: 'emerald-400'
      },
      environment: {
        name: 'Environment',
        value: 61,
        color: 'amber-400'
      },
      governance: {
        name: 'Governance',
        value: 79,
        color: 'purple-400'
      }
    }
  };
};
