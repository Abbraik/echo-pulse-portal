
import { useState, useCallback } from 'react';
import { SGDashboardData } from '@/types/sg';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const useDataValidation = () => {
  const [lastValidation, setLastValidation] = useState<ValidationResult | null>(null);

  const validateData = useCallback((data: SGDashboardData): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Validate strategic data
      if (!data.strategic) {
        errors.push('Missing strategic command data');
      } else {
        if (!data.strategic.deiComposite || data.strategic.deiComposite.current < 0) {
          warnings.push('Invalid DEI composite score');
        }
        if (!data.strategic.trustIndex || data.strategic.trustIndex.current < 0) {
          warnings.push('Invalid trust index score');
        }
      }

      // Validate approvals data
      if (!Array.isArray(data.approvals)) {
        errors.push('Approvals data must be an array');
      } else if (data.approvals.length === 0) {
        warnings.push('No pending approvals found');
      }

      // Validate coordination data
      if (!data.coordination) {
        errors.push('Missing coordination hub data');
      } else {
        if (!Array.isArray(data.coordination.zoneLeads)) {
          errors.push('Zone leads data must be an array');
        }
        if (!Array.isArray(data.coordination.escalations)) {
          errors.push('Escalations data must be an array');
        }
      }

      // Validate risks and anomalies
      if (!Array.isArray(data.risks)) {
        errors.push('Risks data must be an array');
      }
      if (!Array.isArray(data.anomalies)) {
        errors.push('Anomalies data must be an array');
      }

      // Validate summary data
      if (!data.summary) {
        errors.push('Missing executive summary data');
      } else if (!Array.isArray(data.summary.bullets)) {
        errors.push('Summary bullets must be an array');
      }

      // Check data freshness (warn if older than 5 minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const dataTimestamp = new Date(); // Assuming current time for mock data
      
      if (dataTimestamp < fiveMinutesAgo) {
        warnings.push('Data appears to be stale (older than 5 minutes)');
      }

    } catch (error) {
      errors.push(`Data validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    const result: ValidationResult = {
      isValid: errors.length === 0,
      errors,
      warnings
    };

    setLastValidation(result);
    return result;
  }, []);

  const getValidationSummary = useCallback(() => {
    if (!lastValidation) return 'No validation performed';
    
    if (!lastValidation.isValid) {
      return `${lastValidation.errors.length} error(s) found`;
    }
    
    if (lastValidation.warnings.length > 0) {
      return `${lastValidation.warnings.length} warning(s)`;
    }
    
    return 'Data is valid';
  }, [lastValidation]);

  return {
    validateData,
    lastValidation,
    getValidationSummary
  };
};
