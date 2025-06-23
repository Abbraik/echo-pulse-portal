
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Bundle } from '../types/act-types';

// Mock bundles data with leverage points
const mockBundles: Bundle[] = [
  {
    id: "6aa7593a-f2e6-4a0a-aace-c652bfa68925",
    name: "Education Innovation Hub",
    summary: "Modern learning platforms and curriculum reform",
    createdBy: "9b431078-a2b4-4d42-b0a8-2ec8a351dedc",
    leveragePoints: ["2", "5", "9"], // Buffer Sizes, Feedback Loops, Goals of the System
    objectives: [
      "Improve learning outcomes",
      "Increase digital literacy", 
      "Enhance teacher capabilities"
    ],
    pillars: ["Education", "Technology", "Human Development"],
    geography: ["National", "Rural Areas"],
    tags: ["education", "innovation", "technology"],
    status: "draft",
    coherence: 90,
    ndiImpact: 75.5,
    isApproved: false,
    createdAt: new Date("2025-06-16T05:40:57.466Z"),
    updatedAt: new Date("2025-06-16T05:40:57.466Z")
  },
  {
    id: "7bb8694b-g3f7-5b1b-bbdf-d763cga79936",
    name: "Healthcare Digital Transformation",
    summary: "Digitizing healthcare services and improving accessibility",
    createdBy: "9b431078-a2b4-4d42-b0a8-2ec8a351dedc", 
    leveragePoints: ["1", "6", "10"], // Constants & Parameters, Information Flows, Paradigm or Mindset
    objectives: [
      "Reduce patient wait times",
      "Improve diagnostic accuracy",
      "Expand telemedicine reach"
    ],
    pillars: ["Healthcare", "Technology", "Access"],
    geography: ["Urban", "Remote Areas"],
    tags: ["healthcare", "digital", "transformation"],
    status: "active",
    coherence: 85,
    ndiImpact: 80.2,
    isApproved: true,
    createdAt: new Date("2025-06-15T10:20:30.123Z"),
    updatedAt: new Date("2025-06-16T14:15:45.789Z")
  },
  {
    id: "8cc9705c-h4g8-6c2c-cceg-e874dhb80047",
    name: "Sustainable Energy Initiative", 
    summary: "Renewable energy transition and grid modernization",
    createdBy: "9b431078-a2b4-4d42-b0a8-2ec8a351dedc",
    leveragePoints: ["3", "7", "12"], // Stock & Flow Structures, Rules of the System, Meta-Rules
    objectives: [
      "Increase renewable energy capacity",
      "Modernize power grid infrastructure", 
      "Reduce carbon emissions"
    ],
    pillars: ["Environment", "Infrastructure", "Economy"],
    geography: ["National", "Industrial Zones"],
    tags: ["energy", "sustainability", "infrastructure"],
    status: "pilot",
    coherence: 78,
    ndiImpact: 88.7,
    isApproved: true,
    createdAt: new Date("2025-06-14T08:45:12.456Z"),
    updatedAt: new Date("2025-06-16T16:30:22.654Z")
  }
];

export const useRealBundles = () => {
  return useQuery({
    queryKey: ['bundles'],
    queryFn: async (): Promise<Bundle[]> => {
      // For now, return mock data instead of making real API calls
      // In production, this would fetch from Supabase
      return mockBundles;
    }
  });
};

export const useRealBundle = (bundleId: string) => {
  return useQuery({
    queryKey: ['bundle', bundleId],
    queryFn: async (): Promise<Bundle | null> => {
      // Find the bundle in mock data
      const bundle = mockBundles.find(b => b.id === bundleId);
      return bundle || null;
    }
  });
};
