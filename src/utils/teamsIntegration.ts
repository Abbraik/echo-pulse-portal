// Teams integration utilities - consolidates duplicate Teams URL generation logic

export const generateTeamsMeetingUrl = (entityId: string): string => {
  return `https://teams.microsoft.com/l/meetup-join/19%3ameeting_${entityId}`;
};

export const generateTeamsTaskUrl = (taskId: string): string => {
  return `https://teams.microsoft.com/l/entity/com.microsoft.teamspace.tab.planner/_djb2_msteams_prefix_${taskId}`;
};

export const openTeamsMeeting = (entityId: string): void => {
  const url = generateTeamsMeetingUrl(entityId);
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const openTeamsTask = (taskId: string): void => {
  const url = generateTeamsTaskUrl(taskId);
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const createTeamsNotification = (message: string, targetLead?: string): void => {
  // In a real implementation, this would integrate with Teams API
  // For now, we'll use browser notifications or toast
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Teams Notification', {
      body: message,
      icon: '/favicon.ico'
    });
  }
};