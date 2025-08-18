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
      model: appSettings.ai.deepSeek.model,
    });
    const logHelper = this.helpers['Log'] as Log;
    logHelper.log('AI Answer for question: ' + question)
    logHelper.log(completion.choices[0].message.content);
    return completion.choices[0].message.content;
  }
  async askAIForGeneratePageObjectFromPageSource(className: string,extraPrompt: string = '', rootLocator: string = null): Promise<string> {
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
      messages: [{ role: "user", content: `
        As a test automation engineer I am creating a Page Object for a web application using CodeceptJS.
        Here is an sample page object in typescript:
            const { I } = inject();
            
            class ${className} {
              // setting locators
              element1: '#selector',
              element2: '.selector',
              element3: locate().withText('text'),
              // setting methods
              async doSomethingOnPage(params) {
                // ...
              },  
            }
            // Export both the class and an instance
            export default ${className};

            // For CodeceptJS compatibility
            module.exports = new ${className}();
            module.exports.default = ${className};

        I want to generate a Page Object for the page I provide.
        Write Typescript code in similar manner to list all locators on the page.
        Use locators in order of preference: by text (use locate().withText()), label, CSS, XPath.
        Avoid TailwindCSS, Bootstrap or React style formatting classes in locators.
        Add methods to to interact with page when needed.
        ${extraPrompt}
        ${rootLocator ? `All provided elements are inside '${rootLocator}'. Declare it as root variable and for every locator use locate(...).inside(root)` : ''}
        Add only locators from this HTML: \n\n${sanitizedPageSource}
  ` }],
      model: appSettings.ai.deepSeek.model,
    });
    console.log(completion.choices[0].message.content);
    return completion.choices[0].message.content;
  }
}

export = AIHelper;
