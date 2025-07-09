import { useCallback } from 'react';
import { generateTeamsMeetingUrl, generateTeamsTaskUrl, createTeamsNotification } from '@/utils/teamsIntegration';
import { logger } from '@/utils/logger';

export const useTeamsIntegration = () => {
  const joinMeeting = useCallback((entityId: string) => {
    logger.action('Teams meeting join', { entityId });
    const url = generateTeamsMeetingUrl(entityId);
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const openTask = useCallback((taskId: string) => {
    logger.action('Teams task open', { taskId });
    const url = generateTeamsTaskUrl(taskId);
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const sendNotification = useCallback((message: string, targetLead?: string) => {
    logger.action('Teams notification sent', { message, targetLead });
    createTeamsNotification(message, targetLead);
  }, []);

  return {
    joinMeeting,
    openTask,
    sendNotification
  };
};