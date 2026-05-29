export type PlanTier = 'starter' | 'growth' | 'enterprise';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  industry?: string;
  plan: PlanTier;
  isActive: boolean;
  settings?: Record<string, unknown>;
  createdAt: string;
}
