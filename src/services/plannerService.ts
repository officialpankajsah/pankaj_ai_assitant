import { TaskPlanStep } from '../types';
import { executeTool } from './toolsService';

export interface PlanResult {
  isMultiStep: boolean;
  explanation: string;
  steps: TaskPlanStep[];
}

export class TaskPlanner {
  /**
   * Evaluates if a command requires a multi-step workflow and builds an execution plan
   */
  public analyzeAndPlan(query: string): PlanResult | null {
    const q = query.toLowerCase();

    // Weather + Reminder conditional plan
    if ((q.includes('weather') || q.includes('baarish') || q.includes('rain')) &&
        (q.includes('reminder') || q.includes('remind') || q.includes('umbrella') || q.includes('chhaata'))) {
      return {
        isMultiStep: true,
        explanation: 'Multi-step conditional automation: Check weather forecast and schedule an umbrella reminder if precipitation chance > 30%.',
        steps: [
          {
            stepNumber: 1,
            description: 'Resolve date and target time: Tomorrow Morning 08:00 AM',
            toolName: 'CalendarTool',
            parameters: { date: 'Tomorrow', time: '08:00 AM' },
            status: 'PENDING'
          },
          {
            stepNumber: 2,
            description: 'Retrieve live weather forecast and precipitation probability for location',
            toolName: 'WeatherTool',
            parameters: { city: 'Local Area' },
            status: 'PENDING'
          },
          {
            stepNumber: 3,
            description: 'Evaluate condition: If rain probability >= 30%, proceed to reminder creation',
            toolName: 'SettingsTool',
            parameters: { condition: 'rain_probability >= 30%' },
            status: 'PENDING'
          },
          {
            stepNumber: 4,
            description: 'Create actionable reminder: "Take umbrella with you - Rain forecast today"',
            toolName: 'ReminderTool',
            parameters: { title: 'Umbrella le lena Ji, baarish ho sakti hai ☔' },
            status: 'PENDING'
          },
          {
            stepNumber: 5,
            description: 'Notify user via high-priority audio chime and Android Notification',
            toolName: 'NotificationTool',
            parameters: { title: 'Pankaj Ji Automation', body: 'Weather evaluated: Reminder scheduled for umbrella!' },
            status: 'PENDING'
          }
        ]
      };
    }

    // Meeting + Maps + DND plan
    if (q.includes('meeting') && (q.includes('silent') || q.includes('dnd') || q.includes('calendar'))) {
      return {
        isMultiStep: true,
        explanation: 'Multi-step workflow: Schedule meeting in Calendar and prepare DND phone profile.',
        steps: [
          {
            stepNumber: 1,
            description: 'Create calendar appointment for upcoming meeting',
            toolName: 'CalendarTool',
            parameters: { title: 'Important Discussion', time: '04:00 PM' },
            status: 'PENDING'
          },
          {
            stepNumber: 2,
            description: 'Arm automated trigger to switch device to Silent mode during the meeting',
            toolName: 'SettingsTool',
            parameters: { setting: 'ringer_mode', value: 'silent' },
            status: 'PENDING'
          },
          {
            stepNumber: 3,
            description: 'Confirm schedule and automation plan to user',
            toolName: 'NotificationTool',
            parameters: { title: 'Meeting Scheduled', body: 'Device will auto-silent at 4:00 PM.' },
            status: 'PENDING'
          }
        ]
      };
    }

    // Call + Message fallback plan
    if (q.includes('call') && (q.includes('nahi uthaya') || q.includes('message') || q.includes('sms'))) {
      return {
        isMultiStep: true,
        explanation: 'Multi-step communication flow: Call contact and prepare message if unanswered.',
        steps: [
          {
            stepNumber: 1,
            description: 'Verify contact details in address book',
            toolName: 'ContactsTool',
            parameters: { query: 'Rahul' },
            status: 'PENDING'
          },
          {
            stepNumber: 2,
            description: 'Initiate voice call to contact',
            toolName: 'CallTool',
            parameters: { contactName: 'Rahul' },
            status: 'PENDING'
          },
          {
            stepNumber: 3,
            description: 'Draft fallback WhatsApp message: "Main call kar raha tha, free hoke call back karna Ji"',
            toolName: 'MessageTool',
            parameters: { recipient: 'Rahul', message: 'Main call kar raha tha, please call back.' },
            status: 'PENDING'
          }
        ]
      };
    }

    return null;
  }

  /**
   * Executes a plan step-by-step with state updates
   */
  public async executePlan(
    plan: TaskPlanStep[],
    onStepUpdate: (updatedSteps: TaskPlanStep[]) => void
  ): Promise<boolean> {
    const currentSteps = [...plan];

    for (let i = 0; i < currentSteps.length; i++) {
      currentSteps[i].status = 'RUNNING';
      onStepUpdate([...currentSteps]);

      // Small delay for realistic visual plan progression
      await new Promise(r => setTimeout(r, 600));

      const res = await executeTool(currentSteps[i].toolName, currentSteps[i].parameters);
      if (res.success) {
        currentSteps[i].status = 'COMPLETED';
        currentSteps[i].output = res.message;
      } else {
        currentSteps[i].status = 'FAILED';
        currentSteps[i].output = res.message;
        onStepUpdate([...currentSteps]);
        return false;
      }

      onStepUpdate([...currentSteps]);
    }

    return true;
  }
}

export const taskPlanner = new TaskPlanner();
