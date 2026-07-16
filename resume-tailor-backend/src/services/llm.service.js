import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { config, assertLLMConfigured } from "../config/env.js";

let anthropicClient = null;
let openaiClient = null;

function getAnthropic() {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey: config.llm.anthropicApiKey });
  }
  return anthropicClient;
}

function getOpenAI() {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: config.llm.openaiApiKey });
  }
  return openaiClient;
}

/**
 * Strips markdown code fences if the model wraps its JSON response in them,
 * despite being asked not to.
 */
function stripFences(text) {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

function safeParseJSON(text) {
  const cleaned = stripFences(text);
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error(
      `LLM did not return valid JSON. Raw response: ${cleaned.slice(0, 500)}`
    );
  }
}

/**
 * Sends a system + user prompt to whichever provider is configured and
 * returns the parsed JSON response. `system` should instruct the model to
 * reply with JSON only, no prose or markdown fences.
 */
export async function completeJSON({ system, user, maxTokens = 1500 }) {
  assertLLMConfigured();

  if (config.llm.provider === "openai") {
    const client = getOpenAI();
    const completion = await client.chat.completions.create({
      model: config.llm.openaiModel,
      max_tokens: maxTokens,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });
    return safeParseJSON(completion.choices[0].message.content);
  }

  // default: anthropic
  const client = getAnthropic();
  const message = await client.messages.create({
    model: config.llm.anthropicModel,
    max_tokens: maxTokens,
    temperature: 0.4,
    system,
    messages: [{ role: "user", content: user }],
  });
  const textBlock = message.content.find((b) => b.type === "text");
  return safeParseJSON(textBlock?.text || "");
}
