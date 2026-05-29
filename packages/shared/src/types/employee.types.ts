export type PerformanceModel = 'output' | 'time' | 'okr' | 'milestone' | 'custom';
export type EmploymentStatus = 'active' | 'on_leave' | 'terminated';

export interface Employee {
  id: string;
  userId: string;
  organizationId: string;
  teamId?: string;
  managerId?: string;
  jobTitle?: string;
  department?: string;
  performanceModel: PerformanceModel;
  status: EmploymentStatus;
  startDate?: string;
  performanceConfig?: Record<string, unknown>;
  createdAt: string;
}
