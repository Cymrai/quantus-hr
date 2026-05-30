import { Injectable, HttpStatus } from '@nestjs/common';
import { JiraApiService } from '../../shared/services/jira-api.service';
import { TaskRepository } from '../repositories/task.repository';
import { TimeLogRepository } from '../repositories/time-log.repository';
import { IntegrationEventRepository } from '../repositories/integration-event.repository';

@Injectable()
export class JiraService {
  constructor(
    private readonly jiraApi: JiraApiService,
    private readonly taskRepo: TaskRepository,
    private readonly timeLogRepo: TimeLogRepository,
    private readonly integrationEventRepo: IntegrationEventRepository,
  ) {}

  async processWebhookPayload(payload: any) {
    if (payload.issue) {
      await this.handleIssueEvent(payload.issue);
    } else if (payload.worklog) {
      await this.handleWorklogEvent(payload.worklog);
    }
  }

  private async handleIssueEvent(issue: any) {
    const task = await this.taskRepo.findOne({ external_ref: issue.key });
    if (task) {
      // Update existing task
      Object.assign(task, {
        title: issue.summary,
        status: issue.status,
        due_date: issue.duedate,
        complexity_multiplier: 1.0, // Default value
      });
      await this.taskRepo.save(task);
    } else {
      // Create new task
      const newTask = this.taskRepo.create({
        external_ref: issue.key,
        title: issue.summary,
        status: issue.status,
        due_date: issue.duedate,
        complexity_multiplier: 1.0, // Default value
      });
      await this.taskRepo.save(newTask);
    }
  }

  private async handleWorklogEvent(worklog: any) {
    const timeLog = await this.timeLogRepo.findOne({ external_ref: worklog.id });
    if (timeLog) {
      // Update existing time log
      Object.assign(timeLog, {
        logged_hours: worklog.timeSpentSeconds / 3600,
        billable: true, // Default value, can be overridden by Jira settings
      });
      await this.timeLogRepo.save(timeLog);
    } else {
      // Create new time log
      const newTimeLog = this.timeLogRepo.create({
        external_ref: worklog.id,
        logged_hours: worklog.timeSpentSeconds / 3600,
        billable: true, // Default value, can be overridden by Jira settings
      });
      await this.timeLogRepo.save(newTimeLog);
    }
  }
}