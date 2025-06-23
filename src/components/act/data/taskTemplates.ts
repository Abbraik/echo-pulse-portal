
import { LeveragePointTaskTemplate } from '../types/task-types';

export const taskTemplates: LeveragePointTaskTemplate[] = [
  {
    leveragePointId: '1',
    tasks: [
      { title: 'Review system constants', description: 'Audit current model constants and parameters.' },
      { title: 'Adjust parameter values', description: 'Propose new parameter values based on analysis.' }
    ]
  },
  {
    leveragePointId: '2',
    tasks: [
      { title: 'Review buffer capacity', description: 'Audit current buffer sizes across all stocks.' },
      { title: 'Adjust buffer parameters', description: 'Propose new buffer values based on simulation output.' }
    ]
  },
  {
    leveragePointId: '3',
    tasks: [
      { title: 'Map stock structures', description: 'Document current stock and flow relationships.' },
      { title: 'Redesign flow connections', description: 'Propose structural improvements to flows.' }
    ]
  },
  {
    leveragePointId: '4',
    tasks: [
      { title: 'Analyze system delays', description: 'Identify critical delays in system processes.' },
      { title: 'Optimize delay timing', description: 'Design interventions to manage time lags.' }
    ]
  },
  {
    leveragePointId: '5',
    tasks: [
      { title: 'Map reinforcing loops', description: 'Identify top 3 reinforcing loops needing intervention.' },
      { title: 'Design loop dampeners', description: 'Draft policies to balance overactive loops.' }
    ]
  },
  {
    leveragePointId: '6',
    tasks: [
      { title: 'Audit information access', description: 'Review who has access to critical information.' },
      { title: 'Redesign information flow', description: 'Propose new information sharing protocols.' }
    ]
  },
  {
    leveragePointId: '7',
    tasks: [
      { title: 'Document current rules', description: 'Map all formal and informal system rules.' },
      { title: 'Propose rule changes', description: 'Design new governance rules for better outcomes.' }
    ]
  },
  {
    leveragePointId: '8',
    tasks: [
      { title: 'Analyze power distribution', description: 'Map current power structures and decision rights.' },
      { title: 'Redistribute decision power', description: 'Propose new power allocation mechanisms.' }
    ]
  },
  {
    leveragePointId: '9',
    tasks: [
      { title: 'Clarify system purpose', description: 'Define clear goals and success metrics.' },
      { title: 'Align stakeholder goals', description: 'Facilitate alignment on system objectives.' }
    ]
  },
  {
    leveragePointId: '10',
    tasks: [
      { title: 'Assess current mindset', description: 'Understand prevailing worldview and assumptions.' },
      { title: 'Design mindset shift', description: 'Create interventions to shift paradigm thinking.' }
    ]
  },
  {
    leveragePointId: '11',
    tasks: [
      { title: 'Develop meta-awareness', description: 'Build capacity to observe paradigm limitations.' },
      { title: 'Practice paradigm fluidity', description: 'Create exercises for transcending fixed thinking.' }
    ]
  },
  {
    leveragePointId: '12',
    tasks: [
      { title: 'Review meta-rules', description: 'Examine rules about changing rules.' },
      { title: 'Design constitutional changes', description: 'Propose new meta-governance structures.' }
    ]
  }
];
