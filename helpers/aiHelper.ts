const Helper = require("@codeceptjs/helper");
import OpenAI from "openai";
import { appSettings } from "../appSettings";
import sanitizeHtml from 'sanitize-html';


class AIHelper extends Helper {
  async askAIFromPageSource(question: string): Promise<string> {
    const openai = new OpenAI({
      baseURL: appSettings.ai.deepSeek.baseUrl,
      apiKey: appSettings.ai.deepSeek.apiKey
    });
    const playwrightHelper = this.helpers['Playwright']
    if (!playwrightHelper) {
      throw new Error('Playwright helper not found');
    }
    let pageSource = await playwrightHelper.grabSource();
    const sanitizedPageSource = sanitizeHtml(pageSource);
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: `You are a helpful assistant. Given the page source as below: \n\n ${sanitizedPageSource} \n\n Please answer the question: ${question}` }],
      model: "deepseek-chat",
    });
    const logHelper = this.helpers['Log'] as Log;
    logHelper.log('AI Answer for question: ' + question)
    logHelper.log(completion.choices[0].message.content);
    return completion.choices[0].message.content;
  }
}

export = AIHelper;
