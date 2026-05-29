export interface PerformanceScore {
  employeeId: string;
  period: string;       // YYYY-MM
  score: number;        // 0-100
  model: string;
  breakdown: Record<string, number>;
  generatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assigneeId: string;
  organizationId: string;
  weight: number;       // 1-10
  status: 'todo' | 'in_progress' | 'review' | 'done';
  dueDate?: string;
  completedAt?: string;
  externalRef?: string; // Jira ticket ID etc.
  createdAt: string;
}
