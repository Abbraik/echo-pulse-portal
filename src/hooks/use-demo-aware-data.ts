
import { useQuery } from '@tanstack/react-query';
import { useDemoManager } from './use-demo-manager';

interface DemoAwareDataOptions {
  queryKey: string[];
  realDataFetcher: () => Promise<any>;
  demoDataType: string;
  demoContext?: any;
  enabled?: boolean;
  refetchInterval?: number;
}

export const useDemoAwareData = ({
  queryKey,
  realDataFetcher,
  demoDataType,
  demoContext,
  enabled = true,
  refetchInterval
}: DemoAwareDataOptions) => {
  const { isDemoMode, getContextualData } = useDemoManager();

  return useQuery({
    queryKey: isDemoMode ? ['demo', ...queryKey] : queryKey,
    queryFn: async () => {
      if (isDemoMode) {
        const demoData = await getContextualData(demoDataType, demoContext);
        // Simulate network delay for realism
        await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
        return demoData;
      }
      return realDataFetcher();
    },
    enabled,
    refetchInterval: isDemoMode ? undefined : refetchInterval,
    staleTime: isDemoMode ? Infinity : 5 * 60 * 1000, // 5 minutes for real data
  });
};
