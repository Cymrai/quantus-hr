import { Controller, Post, Body, Headers, HttpStatus } from '@nestjs/common';
import { JiraService } from '../services/jira.service';
import { IntegrationEvent } from '../../shared/types/integration-event.type';

@Controller('integrations/jira/webhook')
export class WebhookController {
  constructor(private readonly jiraService: JiraService) {}

  @Post()
  async handleWebhook(@Body() payload: any, @Headers('X-Hub-Signature') signature: string) {
    // Validate the webhook signature
    const isValid = this.validateSignature(payload, signature);
    if (!isValid) {
      return { status: HttpStatus.UNAUTHORIZED, message: 'Invalid or unsigned payload' };
    }

    try {
      await this.jiraService.processWebhookPayload(payload);
      // Enqueue a score-recalc job
      this.enqueueScoreRecalc();
      return { status: HttpStatus.OK, message: 'Payload processed successfully' };
    } catch (error) {
      // Log and handle the error appropriately
      console.error('Error processing Jira webhook:', error);
      throw new Error('Failed to process Jira webhook');
    }
  }

  private validateSignature(payload: any, signature: string): boolean {
    const secret = process.env.JIRA_WEBHOOK_SECRET; // Ensure this is securely managed
    if (!secret) throw new Error('JIRA_WEBHOOK_SECRET not set');

    const computedSignature = crypto.createHmac('sha1', secret).update(JSON.stringify(payload)).digest('hex');
    return signature === `sha1=${computedSignature}`;
  }

  private enqueueScoreRecalc() {
    // Placeholder for the actual job enqueuing logic
    console.log('Enqueuing score-recalc job...');
    // This would typically involve a message queue or task scheduler
  }
}