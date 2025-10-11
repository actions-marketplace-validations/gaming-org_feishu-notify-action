import * as core from '@actions/core';
import { FeishuClient } from './client';
import { parseEventToTemplateData } from './github';

async function run() {
  try {
    const appId = core.getInput('app_id', { required: true });
    const appSecret = core.getInput('app_secret', { required: true });
    const templateId = core.getInput('template_id', { required: true });
    const chatId = core.getInput('chat_id', { required: true });

    let templateData: Record<string, any>;
    const templateDataRaw = core.getInput('template_data');

    if (templateDataRaw && templateDataRaw.trim().length > 0) {
      try {
        templateData = JSON.parse(templateDataRaw);
      } catch (e: any) {
        core.warning(`Invalid template_data JSON, falling back to GitHub event: ${e.message}`);
        templateData = parseEventToTemplateData();
      }
    } else {
      templateData = parseEventToTemplateData();
    }

    const feishu = new FeishuClient(appId, appSecret);
    const result = await feishu.sendCard(chatId, templateId, templateData);

    core.info(`Feishu notify success: ${JSON.stringify(result)}`);
  } catch (error: any) {
    core.setFailed(`Feishu notify failed: ${error.message}`);
  }
}

run();
