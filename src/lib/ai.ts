import {
  type CreateCycleInput,
  type DraftActionOption,
  type EffortLevel,
} from "@/lib/types";

function minutesFromEffortLevel(effortLevel: EffortLevel) {
  switch (effortLevel) {
    case "2 minutes":
      return 2;
    case "5 minutes":
      return 5;
    case "10 minutes":
      return 10;
    case "only prepare":
      return 5;
    case "only make a draft":
      return 10;
    case "only break it down":
      return 5;
  }
}

function escapeQuotes(value: string) {
  return value.replace(/"/g, '\\"');
}

function buildFallbackSuggestions(input: CreateCycleInput): DraftActionOption[] {
  const minutes = minutesFromEffortLevel(input.effortLevel);
  const target = input.reflectionText.trim() || input.blocker.toLowerCase();
  const reason = `You said you feel ${input.emotion.toLowerCase()}, your energy is ${input.energyLevel.toLowerCase()}, and ${input.blocker.toLowerCase()} feels blocked because ${input.resistanceReason.toLowerCase()}.`;

  return [
    {
      title: "Reset your nervous system first",
      description: `Set a ${Math.min(minutes, 5)}-minute timer, breathe slowly, and write one sentence about what feels heaviest about "${target}". Stop when the timer ends.`,
      estimatedMinutes: Math.min(minutes, 5),
      rationale: `${reason} This option lowers pressure first so the next step feels less loaded.`,
    },
    {
      title: "Prepare the starting edge",
      description: `Open the place where "${target}" would happen and set up only the first visible step. Do not finish the task. Just prepare the space or first draft.`,
      estimatedMinutes: Math.max(5, minutes),
      rationale: `${reason} This option removes setup friction without demanding a full effort sprint.`,
    },
    {
      title: "Make tiny visible progress",
      description: `Do one concrete move that would prove momentum started today. Keep it to ${minutes} minutes and stop while it still feels manageable.`,
      estimatedMinutes: minutes,
      rationale: `${reason} This option turns reflection into one measurable experiment instead of another promise.`,
    },
  ];
}

function sanitizeOptions(input: unknown): DraftActionOption[] {
  if (!Array.isArray(input)) {
    throw new Error("AI output was not an array.");
  }

  const normalized = input
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item) => ({
      title: String(item.title ?? "").trim(),
      description: String(item.description ?? "").trim(),
      estimatedMinutes: Number(item.estimatedMinutes ?? 0),
      rationale: String(item.rationale ?? "").trim(),
    }))
    .filter(
      (item) =>
        item.title &&
        item.description &&
        item.rationale &&
        Number.isFinite(item.estimatedMinutes) &&
        item.estimatedMinutes > 0,
    )
    .slice(0, 5);

  if (normalized.length < 3) {
    throw new Error("AI output did not include 3 valid options.");
  }

  return normalized;
}

async function requestOpenAiSuggestions(input: CreateCycleInput) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY.");
  }

  const prompt = `
You generate action suggestions for a reflection-to-action product called Momentum.

Rules:
- Return strict JSON only.
- Return exactly 3 action options as a JSON array.
- Every option must include: title, description, estimatedMinutes, rationale.
- Keep every action tiny, low-risk, and realistic for today.
- Do not diagnose, moralize, or sound clinical.
- Favor three levels: regulate first, prepare only, tiny progress.
- Make the action specific enough that a student could do it immediately.

User context:
{
  "theme": "${escapeQuotes(input.theme)}",
  "emotion": "${escapeQuotes(input.emotion)}",
  "energyLevel": "${escapeQuotes(input.energyLevel)}",
  "blocker": "${escapeQuotes(input.blocker)}",
  "resistanceReason": "${escapeQuotes(input.resistanceReason)}",
  "effortLevel": "${escapeQuotes(input.effortLevel)}",
  "desiredOutcome": "${escapeQuotes(input.desiredOutcome)}",
  "reflectionText": "${escapeQuotes(input.reflectionText)}"
}
`.trim();

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.9,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You return JSON only.",
        },
        {
          role: "user",
          content: `${prompt}\n\nFormat: {"options":[...]}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };

  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI did not return content.");
  }

  const parsed = JSON.parse(content) as { options?: unknown };
  return sanitizeOptions(parsed.options);
}

export async function generateActionSuggestions(input: CreateCycleInput) {
  try {
    return await requestOpenAiSuggestions(input);
  } catch {
    return buildFallbackSuggestions(input);
  }
}
