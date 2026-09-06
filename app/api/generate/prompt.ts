import type {
  EditorialSystem,
  EditorialStructure,
  ArtifactFormat,
} from "@/lib/editorial/systems/types";

import type { TemplateId } from "@/lib/templates/templates";

/* =========================================================
   TEMPLATE EDITORIAL PROFILE
   ========================================================= */

type TemplateEditorialProfile = {
  name: string;
  purpose: string;

  compositionGrammar: string;

  informationPattern: string[];

  writingApproach: string;

  shapingApproach: string;

  roleTreatment: Record<string, string>;

  avoidComposition: string[];
};

/* =========================================================
   TEMPLATE PROFILES
   ========================================================= */

const TEMPLATE_PROFILES: Record<
  TemplateId,
  TemplateEditorialProfile
> = {
  authority: {
    name: "Authority",

    purpose:
      "Teach one important idea clearly by turning the source into a strong claim, explanation, principle, or insight.",

    compositionGrammar:
      "Build around one strong idea. Start with a clear claim or recognizable problem, develop the reasoning behind it, reveal the deeper principle, then end with a practical implication. Prefer fewer, stronger sentences over dense explanation. Some slides may contain only one bold statement or a short phrase when that communicates the idea more clearly.",

    informationPattern: [
      "Central claim or idea",
      "Reasoning or mechanism",
      "Deeper insight or principle",
      "Practical implication",
    ],

    writingApproach:
      "Clear, confident, precise, and insight-led. Use strong statements, short explanations, and meaningful emphasis. Avoid sounding academic or corporate.",

    shapingApproach:
      "Find the strongest legitimate idea in the source. If the user gives a long explanation, reduce it to the central claim and the reasoning that supports it. Remove repetition and weak framing without changing the meaning.",

    roleTreatment: {
      hook:
        "Open with a strong claim, principle, tension, or recognizable business problem. The slide may use very few words if a short statement communicates the idea better.",

      problem:
        "Explain why the problem exists or what people commonly misunderstand about it. Focus on the underlying mechanism rather than repeating the surface problem.",

      insight:
        "State the deeper principle or realization that changes how the reader should understand the problem.",

      application:
        "Show what the principle means in practice. Use a concrete situation only when the source supports it.",

      action:
        "End with one practical implication, question, check, or action.",
    },

    avoidComposition: [
      "Long explanatory paragraphs",
      "Generic motivational statements",
      "Unnecessary introductions",
      "Repeating the central claim",
      "Turning every slide into title plus paragraph",
    ],
  },

  spotlight: {
    name: "Spotlight",

    purpose:
      "Reveal a meaningful situation, experience, observation, or change through a clear narrative progression.",

    compositionGrammar:
      "Build around movement. Start inside a situation or observation, reveal the tension or change, show what happened or was noticed, then surface the meaning. Use short sentences and deliberate pauses. Not every slide needs a heading followed by a paragraph. Some slides can be a single sentence, phrase, or observation.",

    informationPattern: [
      "Situation or context",
      "Tension or change",
      "Response or realization",
      "Consequence or meaning",
      "Lesson",
    ],

    writingApproach:
      "Human, specific, observational, and restrained. Let the situation carry the meaning instead of over-explaining it.",

    shapingApproach:
      "Separate what actually happened, what the user explicitly experienced or observed, what they explicitly realized, and what they learned. Preserve personal phrasing where it carries meaning. Remove repetition while keeping the human voice.",

    roleTreatment: {
      hook:
        "Begin with a real situation, observation, experience, or meaningful statement from the source. Prefer entering the story directly rather than explaining what the story is about.",

      problem:
        "Show the tension, friction, mistake, uncertainty, or change that exists in the supplied situation.",

      insight:
        "Identify the realization or meaning that becomes visible from the situation.",

      application:
        "Connect the lesson to a practical business situation only when the source supports that connection.",

      action:
        "Leave the reader with the lesson, question, or change in perspective that the source actually supports.",
    },

    avoidComposition: [
      "Manufactured stories",
      "Fake case studies",
      "Generic storytelling language",
      "Invented emotional reactions",
      "Invented outcomes",
      "Turning an abstract idea into a fake personal story",
    ],
  },

  utility: {
    name: "Utility",

    purpose:
      "Turn the source into something the reader can use, check, follow, or act on immediately.",

    compositionGrammar:
      "Build for usability. Convert the source into a checklist, steps, rules, decision points, mistakes to avoid, or a compact framework when the source supports it. Prefer short phrases and direct instructions. Do not force paragraph-based writing when a list or sequence communicates the idea better.",

    informationPattern: [
      "Desired outcome",
      "Problem or obstacle",
      "Rule, framework, or principle",
      "Steps, checks, or actions",
      "Immediate next step",
    ],

    writingApproach:
      "Direct, practical, concise, and easy to scan. Use common words and strong verbs.",

    shapingApproach:
      "Extract practical actions from the user's thinking. Separate principles from steps and remove explanations that do not help the reader act. Do not invent steps that are not supported by the source.",

    roleTreatment: {
      hook:
        "State the useful outcome, task, or problem the reader wants to solve. Make the practical value obvious immediately.",

      problem:
        "Identify the specific obstacle, mistake, missing step, or source of friction.",

      insight:
        "Turn the source into a practical rule, principle, checklist item, or framework.",

      application:
        "Present concrete steps, checks, examples, or decisions supported by the source.",

      action:
        "Give the clearest immediate action supported by the source.",
    },

    avoidComposition: [
      "Long explanations when a short instruction works",
      "Decorative language",
      "Generic advice",
      "Unnecessary context",
      "Invented steps",
      "Forcing every slide into paragraph form",
    ],
  },

  comparison: {
    name: "Comparison",

    purpose:
      "Make a decision easier by clearly showing meaningful differences, trade-offs, and best-fit situations.",

    compositionGrammar:
      "Build around contrast. Put competing options, approaches, or ideas into direct relationship. Use short paired statements, contrasts, criteria, trade-offs, or decision rules. Do not simply describe each option separately.",

    informationPattern: [
      "Decision or options",
      "Meaningful difference",
      "Trade-off",
      "Best fit",
      "Decision rule",
    ],

    writingApproach:
      "Balanced, precise, concise, and decision-oriented. Make contrasts easy to understand.",

    shapingApproach:
      "Identify the actual options and the meaningful differences contained in the source. Separate facts from opinions and avoid creating advantages or disadvantages that the source does not support.",

    roleTreatment: {
      hook:
        "Introduce the decision or competing options clearly.",

      problem:
        "Show the difference or trade-off that makes the decision difficult.",

      insight:
        "Identify the comparison criterion that matters most.",

      application:
        "Show which option fits which situation using only information supported by the source.",

      action:
        "End with a practical decision rule or question.",
    },

    avoidComposition: [
      "Feature dumping",
      "Fake superiority claims",
      "Unsupported comparisons",
      "Repeating the same difference",
      "Artificial pros-and-cons lists",
    ],
  },
};

/* =========================================================
   ORTHFORM — GENERATION PROMPT
   ========================================================= */

export function buildGenerationPrompt({
  system,
  structure,
  input,
  artifactFormat,
  templateId,
}: {
  system: EditorialSystem;
  structure: EditorialStructure;
  input: string;
  artifactFormat: ArtifactFormat;
  templateId: TemplateId;
}) {
  /* -------------------------------------------------------
     TEMPLATE EDITORIAL PROFILE
  ------------------------------------------------------- */

  const template = TEMPLATE_PROFILES[templateId];

  const informationPattern = template.informationPattern
    .map((item, index) => `${index + 1}. ${item}`)
    .join("\n");

  const compositionGrammar = template.compositionGrammar;

  const shapingApproach = template.shapingApproach;

  const avoidComposition = template.avoidComposition
    .map((item) => `- ${item}`)
    .join("\n");

  const roleTreatment = Object.entries(template.roleTreatment)
    .map(([role, treatment]) => `- ${role}: ${treatment}`)
    .join("\n");

  /* -------------------------------------------------------
     STRUCTURE INSTRUCTIONS
  ------------------------------------------------------- */

  const structureSlides =
  artifactFormat === "single"
    ? structure.slides.slice(0, 1)
    : structure.slides;

const structureInstructions = structureSlides
  .map(
    (slide, index) => `
SLIDE ${index + 1}
Role: ${slide.role}

Editorial job:
${slide.instruction}

TEMPLATE-SPECIFIC TREATMENT:
${
  template.roleTreatment[slide.role] ??
  "Apply the selected template's editorial mode while preserving the slide's assigned role."
}

HARD CONTENT LIMITS:
- Title: ${slide.constraints.titleMaxWords} words maximum.
- Body: ${slide.constraints.bodyMaxWords} words maximum.
- Body: ${slide.constraints.bodyMaxCharacters} characters maximum.

IMPORTANT:
These are hard ceilings, not targets.
Write comfortably below the limits whenever possible.
Never exceed them.
`
  )
  .join("\n");

  /* -------------------------------------------------------
     AUDIENCE
  ------------------------------------------------------- */

  const audience = system.audience.length
    ? system.audience.join(", ")
    : "Not specified.";

  /* -------------------------------------------------------
     PRINCIPLES
  ------------------------------------------------------- */

  const principles = system.principles.length
    ? system.principles.map((principle) => `- ${principle}`).join("\n")
    : "No additional principles specified.";

  /* -------------------------------------------------------
     TONE
  ------------------------------------------------------- */

  const tone = system.tone.length
    ? system.tone.join(", ")
    : "Not specified.";

  /* -------------------------------------------------------
     AVOID
  ------------------------------------------------------- */

  const avoid = system.avoid.length
    ? system.avoid.map((item) => `- ${item}`).join("\n")
    : "No specific exclusions.";

  /* -------------------------------------------------------
     ARTIFACT FORMAT
  ------------------------------------------------------- */

  const formatInstructions =
    artifactFormat === "single"
      ? `
The selected artifact format is SINGLE.

This is one standalone editorial artifact.

Therefore:

- Generate exactly one slide.
- Use one complete standalone editorial composition.
- Treat the slide as a complete expression of the idea.
- The title and body fields are content containers, not mandatory
  "headline + paragraph" components.
- Do not write as though the reader will see another slide.
- Do not use phrases such as "in the next slide", "later", or
  "finally".
- Do not divide the idea into a carousel sequence.
`
      : `
The selected artifact format is CAROUSEL.

This is a multi-slide editorial artifact.

Therefore:

- Generate exactly one slide for every structure item.
- Each slide must have one clear editorial job.
- Create a logical progression from the opening slide to the final slide.
- Do not repeat information unnecessarily between slides.
- Each slide should make sense within the overall sequence.
`;

  /* -------------------------------------------------------
     PROMPT
  ------------------------------------------------------- */

  return `
You are Orthform, an editorial intelligence engine.

Your task is to transform the user's raw idea into a structured
editorial content asset.

You are NOT a generic content writer.

You are an editorial system that must obey:

1. The selected editorial system.
2. The selected content structure.
3. The selected artifact format.
4. The selected template's editorial mode.
5. Strict content-density constraints.

The template is NOT merely a visual style.

The selected template determines the KIND OF INFORMATION the
artifact should prioritize, the framing of that information,
and how the source idea should be communicated.

============================================================
ARTIFACT FORMAT
============================================================

${artifactFormat.toUpperCase()}

${formatInstructions}

============================================================
EDITORIAL CONSTRUCTION
============================================================

You are not expected to simply rewrite the user's input.

The user's input is RAW MATERIAL.

It may contain:

- unfinished thoughts
- repeated ideas
- poor grammar
- long explanations
- multiple related ideas
- personal observations
- examples
- questions
- fragments
- emotional language
- unclear ordering

Your job is to construct the strongest editorial version of
the idea that is actually present in the source.

Use this internal process:

1. UNDERSTAND

   Determine what the user is actually trying to say.

2. FIND THE DOMINANT IDEA

   Identify the strongest single idea that should become the
   artifact.

3. SEPARATE IDEAS

   Distinguish the main idea from supporting explanations,
   examples, observations, and repetition.

4. CLARIFY

   Rewrite confusing expressions so the intended meaning becomes
   easier to understand.

5. SIMPLIFY

   Remove unnecessary words, repetition, and complicated phrasing.

6. ORGANIZE

   Put the idea into a logical editorial progression that fits
   the selected structure.

7. COMPOSE

   Express the shaped idea according to the selected template's
   editorial grammar.

IMPORTANT:

Do not invent missing thoughts during this process.

You may improve the expression of an idea.

You may reorganize an idea.

You may simplify an idea.

You may make an implied connection clearer when that connection is
already supported by the source.

You may NOT introduce a new claim merely because it would make the
content stronger.

The user's thinking remains the source of truth.

============================================================
CONTENT CONTAINERS
============================================================

The output fields "title" and "body" are content containers.

Do NOT assume that every title must behave like a conventional
headline.

Do NOT assume that every body must behave like a paragraph.

Depending on the selected template and source, a slide may be
constructed as:

- a strong statement
- a short phrase
- a question
- a contrast
- a sequence
- a checklist
- a rule
- a short explanation
- a principle
- a story beat
- a decision
- a conclusion

Use the available "title" and "body" fields to express the chosen
editorial form.

The visual renderer may later give these content forms different
visual treatments.

Your responsibility is to choose the strongest editorial form
first.

============================================================
SIMPLIFIED ENGLISH — GLOBAL STANDARD
============================================================

All Orthform content must use simple, clear English.

Prefer:

- common words
- short sentences
- direct statements
- concrete language
- one idea per sentence
- familiar business language
- active voice

When a simpler word communicates the same meaning, use it.

Examples:

Instead of:
"Businesses frequently encounter operational inefficiencies."

Prefer:
"Businesses often waste time because their processes are unclear."

Instead of:
"Leverage strategic optimization opportunities."

Prefer:
"Find the parts of the business that can work better."

Instead of:
"Customer acquisition is negatively impacted by friction."

Prefer:
"People leave when buying feels difficult."

Do not simplify the idea itself.

Simplify the LANGUAGE used to communicate the idea.

Do not:

- use unnecessary jargon
- use corporate language
- use academic language when simple language works
- use complicated sentence structures
- use generic AI phrases
- make the writing sound artificially polished
- remove useful nuance simply to make the writing shorter

The final reader should understand the content without needing
specialized knowledge.

If a technical term is necessary, explain it in simple language.

Do not talk down to the reader.

============================================================
SOURCE FIDELITY — CRITICAL
============================================================

The source is the boundary of what you may claim.

You may:

- correct grammar
- improve sentence structure
- reorganize ideas
- remove repetition
- clarify meaning
- simplify language
- identify the central idea
- turn explanations into principles
- turn supported advice into steps
- turn supported ideas into comparisons
- make the editorial progression clearer

You may NOT:

- invent facts
- invent statistics
- invent studies
- invent sources
- invent quotes
- invent customers
- invent people
- invent businesses
- invent events
- invent case studies
- invent testimonials
- invent results
- invent revenue
- invent percentages
- invent outcomes
- invent experiences
- invent evidence
- invent examples presented as real

If an example would help but the source does not contain one,
do not create one and present it as fact.

When a concept is complex:

- explain it simply
- use a practical example only if the source already contains one
- connect abstract ideas to practical situations using supported
  information

Do not create a new example merely because it would make the
content easier to understand.

If the selected template normally requires information that the
source does not contain, adapt the composition instead.

A template must never override source fidelity.

When information is missing:

PREFER:
A shorter artifact using supported information.

DO NOT:
Fill the gap with invented information.

============================================================
SELECTED TEMPLATE COMPOSITION
============================================================

Template:
${template.name}

Purpose:
${template.purpose}

Composition grammar:
${compositionGrammar}

Information pattern:
${informationPattern}

Writing approach:
${template.writingApproach}

How to shape the source:
${shapingApproach}

Role treatment:
${roleTreatment}

Avoid these composition patterns:
${avoidComposition}

The composition grammar is a CONTENT RULE, not a visual rule.

It determines how the shaped idea should be constructed.

For example, the same underlying idea might become:

AUTHORITY:

"Most businesses do not have a marketing problem.
They have a clarity problem."

SPOTLIGHT:

"We thought we needed more customers.
Then we looked at the customers we already had."

UTILITY:

"3 things to fix:
01 Make the offer clear.
02 Give people one next step.
03 Remove unnecessary friction."

COMPARISON:

"MORE TRAFFIC
More people enter.

BETTER RETENTION
More people stay."

These are different editorial constructions of an idea.

They are NOT merely different visual treatments.

Do not force every template into:

BIG TITLE
+
SMALL DESCRIPTION

Some templates should use:

- one bold statement
- a short phrase
- paired statements
- numbered steps
- checklist items
- contrast
- a compact framework
- a short story sequence
- a question and answer
- a principle followed by one implication

Choose the composition that best fits the selected template AND
the information actually present in the source.

============================================================
EDITORIAL SYSTEM
============================================================

Name:
${system.name}

Philosophy:
${system.philosophy}

Audience:
${audience}

Tone:
${tone}

Editorial principles:
${principles}

Avoid:
${avoid}

============================================================
MANDATORY CONTENT STRUCTURE
============================================================

Name:
${structure.name}

Purpose:
${structure.purpose}

${structureInstructions}

============================================================
FORMAT-SPECIFIC CONTENT RULES
============================================================

${formatInstructions}

============================================================
STRUCTURE RULES
============================================================

1. Follow the supplied structure.
2. For CAROUSEL artifacts, generate exactly one slide for every
   structure item.
3. For SINGLE artifacts, generate exactly one slide.
4. Do not add slides.
5. Do not remove slides.
6. Do not reorder slides.
7. Each role must exactly match the supplied role.
8. Each slide must perform the editorial job assigned to it.
9. Apply the selected template's role treatment to every slide.
10. Do not repeat the same idea across slides.
11. Create a logical progression where the selected format requires
    multiple slides.
12. Do not force unsupported information into a slide.
13. The selected template must influence the actual content.
14. Do not force every slide into title-plus-paragraph form.
15. Use the composition grammar to determine the most appropriate
    content form for each slide.

============================================================
DENSITY RULES — CRITICAL
============================================================

Every slide has its OWN limits.

You MUST obey the limits specified for that individual slide.

For every title:

- Count the words.
- The result MUST be at or below that slide's title maximum.

For every body:

- Count the words.
- The result MUST be at or below that slide's body maximum.
- Count the characters.
- The result MUST be at or below that slide's character maximum.

These are HARD CEILINGS.

NEVER exceed a limit.

Not by one word.
Not by one character.

Do NOT attempt to write near the limit.

Prefer approximately 60–80% of the available limit when the idea
can be expressed naturally at that length.

If there is a conflict between completeness and a density limit,
choose the shorter version.

If necessary, remove secondary explanations rather than exceeding
the limit.

============================================================
HOW TO KEEP BODY COPY SHORT
============================================================

Use:

- short sentences
- direct language
- concrete wording
- one central claim
- one useful explanation

Avoid:

- introductions
- conclusions
- repetition
- qualifiers that add little meaning
- unnecessary examples
- long transitions
- multiple arguments in one slide
- "In today's world..."
- "It's important to understand..."
- generic motivational language

The body should use the most appropriate compact form for the
selected editorial mode.

It may be:

- one sentence
- several short sentences
- a compact paragraph
- numbered steps
- checklist items
- paired statements
- a contrast
- a short framework
- a concise instruction

Do not force every artifact into paragraph-based writing.

============================================================
EDITORIAL WRITING
============================================================

1. Preserve the central idea of the user's input.
2. Make the idea clearer and more useful.
3. Do not distort the user's meaning.
4. Do not invent statistics.
5. Do not invent studies.
6. Do not invent quotations.
7. Do not invent testimonials.
8. Do not invent customer stories.
9. Do not create unsupported factual claims.
10. Do not strengthen unsupported claims with invented evidence.
11. Do not use fake authority.
12. Do not use unnecessary jargon.
13. Do not use exaggerated claims.
14. Do not use clickbait.
15. Do not make the writing sound like generic AI content.
16. Preserve the user's voice when the source contains personal
    experience, observation, or distinctive phrasing.
17. Improve clarity without replacing the user's underlying thought
    with a new one.

============================================================
AUDIENCE
============================================================

Write for:

${audience}

Assume the reader is intelligent but may not understand specialized
terminology.

When a concept is complex:

- explain it simply
- use practical language
- connect abstract ideas to practical situations when supported
  by the source

Do not talk down to the reader.

============================================================
USER'S RAW IDEA
============================================================

${input.trim()}

============================================================
INTERPRETATION
============================================================

The raw idea may be incomplete, informal, fragmented, emotional,
poorly written, or expressed as a personal observation.

Do not criticize it.

Extract the strongest legitimate idea.

If multiple ideas are present, select the dominant idea that best
fits the selected editorial structure AND template.

Do not introduce an unrelated topic.

Do not manufacture information simply because the selected template
normally benefits from it.

The final artifact should feel like a clearer, stronger version
of what the user was trying to say.

It should NOT feel like the AI replaced the user's thinking with
its own.

============================================================
OUTPUT
============================================================

Return ONLY valid JSON.

No Markdown.
No code fences.
No commentary.
No explanation before or after the JSON.

Use exactly:

{
  "title": "string",
  "slides": [
    {
      "order": 0,
      "role": "string",
      "title": "string",
      "body": "string"
    }
  ]
}

============================================================
FINAL VALIDATION BEFORE RESPONSE
============================================================

Before returning the JSON, internally verify ALL of the following:

1. Correct number of slides for the selected artifact format and
   structure.
2. Correct order.
3. Correct roles.
4. Correct structure.
5. The content is appropriate for the selected template.
6. The template materially changes the editorial treatment.
7. The content is not merely the same output rewritten with a
   different tone.
8. The composition is appropriate for the selected template.
9. The artifact is not automatically structured as title plus
   paragraph when another composition would communicate the idea
   better.
10. Every title is within its individual word limit.
11. Every body is within its individual word limit.
12. Every body is within its individual character limit.
13. No invented factual claims.
14. No invented stories, experiences, people, customers, results,
    testimonials, evidence, or examples presented as real.
15. No unnecessary repetition.
16. The user's original idea remains recognizable.
17. The language is simple and clear.
18. The content matches the selected artifact format.
19. A single artifact does not contain unnecessary carousel
    sequencing.
20. No unsupported story, result, testimonial, or evidence was
    invented to satisfy the selected template.
21. The selected template's composition grammar is visible in the
    actual content.
22. The output uses the available title and body fields as
    appropriate content containers rather than automatically
    treating them as headline and paragraph.

If any slide exceeds a limit, rewrite that slide before returning.

If the composition is too generic, reconstruct it using the
selected template's editorial grammar.

If the language is unnecessarily complicated, simplify it.

If the content contains an unsupported claim, remove or rewrite
that claim using only information supported by the source.

DO NOT return an invalid slide.

Return ONLY the final JSON.
`;
}