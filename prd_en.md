# PRD

## 1. Document Info

- Product Name: Momentum
- Product Type: A self-awareness and action experiment web app for university students
- Language: English
- Version: V0.1
- Based on: [concept.md](/Users/tara/Desktop/CP192/concept.md),

## 2. Product Overview

Momentum is a web app that helps university students move from thought to action. Users first answer a short set of questions to identify their current emotions, stress, and main source of resistance. The system then turns those answers into a small, low-risk action experiment. AI can generate several suggested actions based on the user’s responses, and users can also create their own action.

After trying the action, users return to the app to reflect on what happened, how they felt, and whether they are in a better state than before. Over time, repeated cycles help users understand their patterns, interests, values, and what kinds of actions actually help them move forward.

### 2.1 Key Terms

- Reflection: A short response focused on one specific question or issue
- Action experiment: A small action meant to test, explore, or restart movement
- AI action suggestions: 3 to 5 action options generated from the user’s answers
- Reflection after action: A short review of what happened and how the user feels now
- Cycle: One full round of reflection, action, and review

## 3. Background and Problem

University students often think deeply about identity, career direction, personal growth, and the future. The problem is that these reflections often stay abstract and never turn into real-world action. Many students do want to grow. They are simply stuck in overthinking, pressure, low energy, or emotional resistance.

There is also a common situation where a user knows what they "should" do, such as starting an assignment, preparing an application, replying to an email, or making an important decision, but still cannot begin. That resistance may come from anxiety, fear of failure, fatigue, self-doubt, or the feeling that the task is too large.

Current tools often fall into two groups:

- Reflection tools help users write, but do not help them act
- Productivity tools help users execute, but assume the user already knows what to do

This leaves a gap for students who:

- care about growth
- want to understand themselves better
- are willing to try change
- still struggle to turn insight into action

Based on the current survey:

- 69% of respondents often think about their future or personal growth
- more than 60% said repeated reflection made them less clear or less likely to act
- more than 85% agreed that small actions helped them understand themselves better
- around 85% said peer support or light accountability would help

These results suggest that the problem is real and that students respond well to action-based self-discovery.

### 3.1 Psychology Concepts Behind the Design

The product direction is supported by several psychology concepts:

- Analysis paralysis: too much thinking can delay or block action
- Affect labeling: naming current emotions can help people process what they are feeling more clearly
- Motivational interviewing and ambivalence: people often want change and resist it at the same time; making that conflict visible can help
- Behavioral activation: small actions can reduce stuckness and make it easier to re-engage
- Implementation intentions: actions are more likely to happen when they are concrete, specific, and tied to time or context
- Self-Determination Theory: people are more willing to act when they feel autonomy, competence, and support

Together, these ideas support a simple principle: students often do not need a bigger plan first. They need a clearer emotional check-in and one action that feels small enough to start.

### 3.2 Competitive Landscape

Momentum sits near several existing products, but its focus is different.

#### Notion

Notion is flexible and useful for journaling, planning, and organizing goals. Its weakness for this use case is that it starts from a blank space. For students who already know how to structure themselves, that works well. For students who feel stuck, Notion offers freedom but not much guidance from reflection to action.

#### Day One

Day One is strong as a journaling and memory-keeping tool. It works well for capturing emotions and experiences, but it offers limited support for deciding what small action to take next.

#### Todoist

Todoist is effective for task management and execution. It helps when users already know their goals. It is less helpful when users are still trying to understand what they feel, why they are resisting, or what first step is realistic.

#### Fabulous

Fabulous focuses on habit building, routine, and behavior change. It shares Momentum’s emphasis on action, but its center is habit formation and wellbeing. Momentum focuses more on self-discovery through small experiments.

#### Competitive Conclusion

There are already strong products for journaling, planning, and habit building. Fewer products connect emotional awareness, resistance, AI-supported small actions, and post-action reflection in one simple loop. That is where Momentum has room to stand out.

## 4. Product Goals

### 4.1 Product Goals

- Validate whether a reflection-action-review loop increases meaningful engagement
- Validate whether the product helps students move from abstract thinking to real action
- Deliver a realistic MVP within one semester and leave room for iteration

### 4.2 User Goals

- Identify what they are feeling right now
- Understand why they are resisting a task or decision
- Get one small, realistic next action
- Reflect after acting and notice whether they feel more stable or more ready
- See their longer-term patterns over time

### 4.3 Non-Goals

- The product does not provide therapy, diagnosis, or crisis care
- The product is not a full task management system
- The product is not a social platform
- Early versions do not rely on complex AI analysis as the core value

## 5. Target Users

### 5.1 Core User Profile

University students, especially undergraduates, who care about personal growth and often reflect on their future, interests, identity, or goals, but find it hard to turn that reflection into action.

### 5.2 User Characteristics

- They reflect often, but do not always know what to do next
- They are open to trying small experiments
- They respond better to low-pressure, low-risk tools
- They may benefit from light peer support

### 5.3 Typical User Situations

- "I am not sure whether I actually like this path, but I do not know how to test it."
- "I keep thinking about what I should do next, but I do not start."
- "I know what I should do, but I feel too anxious or tired to begin."
- "I want something that helps me restart without making me feel judged."

## 6. Core Value Proposition

Momentum helps users notice their current emotional state, understand what is blocking action, and take one small step that feels possible now.

One-line summary:

"Start small, understand more."

## 7. Product Principles

- Small steps first: every suggested action should feel low-risk and realistic
- Emotion-aware: the system should respond to the user’s current state, not just the task itself
- Actionable reflection: every reflection flow should support a next step
- Low pressure: avoid competitive or performance-heavy design
- Support without force: peers and AI are optional support layers, not control mechanisms

## 8. Core Loop

Momentum is built around a five-step loop:

1. Emotional check-in: the user identifies their current emotion, energy, and pressure
2. Resistance mapping: the user answers why they do not want to start or what feels blocked
3. Action selection: the system generates several small action options; the user can pick one or create their own
4. Post-action review: the user records what happened and whether they feel better, calmer, or more ready
5. Pattern building: the system stores the cycle and helps the user notice useful patterns over time

The core success condition is simple: does the user gain clarity through action, not just through thinking?

### 8.1 Ideal User Path

The ideal Momentum flow is:

1. The user recognizes what they are feeling right now, such as anxiety, guilt, exhaustion, frustration, or fear
2. The user sees that the issue is not simply "lack of discipline" but a specific kind of resistance
3. The system generates several small action options based on that state
4. The user picks the least overwhelming option, or writes a better one
5. The user completes the action
6. The user returns and reflects on whether they feel more stable, more capable, or more ready to continue
7. Over time, the system helps the user learn what kinds of actions work best in different states

## 9. Core Hypotheses

- If users identify their emotional state before choosing an action, the action will feel more relevant
- If suggested actions are very small and low-risk, users are more likely to begin
- If the system offers several action options instead of one, users will feel more autonomy
- If users review right after acting, they are more likely to turn experience into insight
- If users can see repeated patterns, they are more likely to keep using the product
- If light peer support is added later, completion and return rates may improve

## 10. Key User Stories

- As a student who overthinks, I want a focused reflection flow so I do not spiral into vague writing
- As a student who knows what I should do but still cannot start, I want help identifying what I feel and what is blocking me
- As a user who does not know the first step, I want the system to give me a few AI-generated action options
- As a user with high resistance, I want one small action that feels possible now
- As a user who completed an action, I want to quickly record what changed so the experience is not lost
- As a returning user, I want to see which actions help me most in different emotional states
- As a user who wants support, I want optional peer check-ins without pressure

## 11. Information Architecture

- Landing page
- Sign up / Log in
- Onboarding
- Dashboard
- Reflection flow
- Action selection
- Post-action review
- History
- Insights
- Peer page
- Settings

### 11.1 Core User Flow

1. The user enters Momentum and learns the basic logic
2. The user selects a current issue or focus area
3. The user answers a short set of questions about emotion, resistance, and goal
4. The system generates several small action options; the user picks one or writes their own
5. The user tries the action in real life
6. The user returns to review what happened and whether they feel more stable or ready
7. The system saves the cycle and prompts the next round when needed

## 12. MVP Roadmap

The product should be built in three MVP stages. Each stage validates a different assumption.

### 12.1 MVP V1: Validate the Personal Core Loop

#### Goal

Validate whether one user can complete the minimum loop of reflection, action, and review.

#### Key Questions

- Can users move from reflection to action smoothly?
- Will users return to complete the review?
- Do AI-generated action options make it easier to start?
- Does the product already provide value in solo use?

#### Core Features

- User registration and login
- Basic onboarding
- Structured reflection questions
- Text input and save
- AI-generated 3 to 5 action options
- User-created custom action option
- Estimated action time
- Post-action review form
- History view
- Basic dashboard showing the current cycle

#### Included

- Full single-user loop
- Basic data storage
- Simple status tracking such as pending, completed, and reviewed

#### Not Included

- Peer pairing
- Notifications
- AI insight summaries
- Advanced analytics
- Community features

#### Success Metrics

- Rate of first reflection completion
- Rate of action selection after reflection
- Rate of AI suggestion selection
- Rate of review completion after action
- Share of users who report feeling more stable after the action
- Share of users who complete at least one full cycle within 7 days

#### Release Criteria

- Users can complete one full cycle without major friction
- Data saves correctly
- The main path is understandable and usable

### 12.2 MVP V2: Validate Light Peer Support

#### Goal

After the solo loop works, validate whether light peer support improves completion and follow-through.

#### Key Questions

- Are users willing to invite or match with one peer?
- Does peer presence increase action completion?
- Does light accountability help without increasing stress?

#### New Features

- Peer pairing or invitation
- Shared action summary
- Light check-in for each cycle
- Short peer-visible status updates
- Option to exit peer mode at any time

#### Included

- One-to-one lightweight support
- Low-pressure check-ins
- Clear privacy controls

#### Not Included

- Group features
- Chat rooms
- Real-time messaging
- Rankings or competition

#### Success Metrics

- Peer mode adoption rate
- Completion rate comparison between peer and non-peer users
- Review return rate in peer mode
- User rating of whether support feels helpful without pressure

#### Release Criteria

- Users can complete peer invite or pairing clearly
- Sharing and exit controls are easy to understand
- Peer features do not create major extra cognitive load

### 12.3 MVP V3: Validate Long-Term Value Through Insights

#### Goal

After users can complete multiple cycles, validate whether pattern-based insights improve retention and long-term value.

#### Key Questions

- Will users continue using the product across multiple cycles?
- Do insights help users understand their patterns more clearly?
- Can simple rule-based summaries provide value before more advanced AI features?

#### New Features

- Reflection, action, and emotion tags
- Pattern summaries such as common blockers, useful actions, and recurring emotions
- Periodic review page
- Rule-based next-step experiment suggestions
- Personal growth timeline

#### Included

- Basic data visualization
- Explainable summaries and recommendations
- Editable tags and categories

#### Not Included

- High-cost AI diagnosis
- Complex personality testing
- Campus social network features

#### Success Metrics

- Share of users who complete 3 or more cycles
- Insights page visit rate
- Rate of starting a new action after viewing insights
- 30-day retention improvement compared with V1 and V2

#### Release Criteria

- Insights are understandable and explainable
- The summaries are helpful and not misleading
- Users can start the next cycle directly from insights

## 13. Functional Requirements

### 13.1 Account System

- Users can sign up, log in, and log out
- Users can view and edit basic profile details
- User data is linked to each cycle

Priority: P0 (V1)

### 13.2 Onboarding

- Explain the product logic clearly: reflection should lead to a small experiment
- Help the user choose a current focus area
- Explain what a "small action experiment" means
- Explain that AI suggestions are optional and the user can always write their own action

Priority: P0 (V1)

### 13.3 Reflection Module

- Provide short, focused questions
- Allow text input
- Allow users to select themes such as interest, career, relationships, habits, or values
- Identify current emotion, energy level, and source of resistance

Priority: P0 (V1)

### 13.3.1 Reflection Question Design Principles

- Start with easy questions such as "How do I feel right now?"
- Move next to "What am I avoiding?" and "Why do I not want to start?"
- Keep the question set short
- Combine multiple-choice and short text
- Use non-judgmental wording
- Make sure every question supports later action generation

Suggested structure:

1. What best describes how I feel right now?

Example options: anxious, tired, frustrated, guilty, stuck, low, calm
2. What feels most blocked right now?
Example options: homework, applications, replying to someone, starting a project, making a decision
3. Why do I not want to begin?
Example options: too tired, afraid of doing badly, do not know where to start, task feels too big, no motivation, worried about the outcome
4. What amount of effort feels possible right now?
Example options: 2 minutes, 5 minutes, 10 minutes, only prepare, only make a draft, only break it down
5. What do I want this next action to help me do?
Example options: calm down, restart, make progress, test interest, regain some control

### 13.3.2 Theory Support for Question Design

- Affect labeling supports asking users to name what they feel before taking action
- Motivational interviewing supports making ambivalence and resistance visible
- Behavioral activation supports breaking stuckness through small action
- Implementation intentions support making the action concrete and specific
- Self-Determination Theory supports offering multiple options so users retain choice

Priority: P0 (V1)

### 13.4 Action Experiment Module

- Users can create a small action based on reflection
- The system can generate 3 to 5 action suggestions based on structured answers and text input
- Each suggestion should explain what to do, how long it takes, and why it fits the user’s current state
- Users can choose an AI suggestion or write their own
- Each action includes a title, description, estimated duration, and optional context or location
- The system should encourage clear action wording, such as "Tonight at 8 PM, open the document and write only the title"
- All suggested actions should stay small, low-risk, and realistic within a short time frame

Priority: P0 (V1)

### 13.5 Post-Action Review Module

- Users record what happened, how they felt, and what surprised them
- Users can rate engagement, emotional shift, and willingness to continue
- Users can answer whether they feel more stable or more ready than before

Priority: P0 (V1)

### 13.6 History Module

- Users can review past reflections, actions, and reviews by time
- Users can clearly see the status of each cycle

Priority: P1 (V1)

### 13.7 Dashboard

- Show the current active cycle
- Show the next pending step
- Expand into an insights entry point in V3

Priority: P1 (V1)

### 13.8 Peer Module

- Users can invite one peer or accept an invitation
- Users can share a short summary of one cycle
- Users can complete lightweight check-ins
- Users can leave peer mode at any time

Priority: P1 (V2)

### 13.9 Insights Module

- Aggregate history using tags
- Show common themes, emotions, blockers, and useful actions
- Suggest next experiments based on simple rules

Priority: P1 (V3)

### 13.10 AI Suggestion Module

- Read structured answers and short text input
- Prioritize current emotion, main blocker, target task, acceptable action size, and desired next state
- Generate suggestions at different levels, such as "regulate first," "prepare only," or "move the task forward one step"
- Avoid suggestions that are too large, vague, or judgmental
- Let users ignore, replace, or rewrite any AI-generated suggestion
- Never present AI output as diagnosis or treatment

Priority: P0 (V1)

## 14. Non-Functional Requirements

- Support desktop and mobile browsers
- Keep the core flow lightweight and responsive
- Prevent text loss through autosave or similar protection
- Protect user privacy and personal data
- Make sharing permissions clear in peer mode
- Keep the system modular for future expansion

## 15. Success Metrics

### 15.1 North Star Metric

- Weekly active users who complete a full reflection-action-review cycle

### 15.2 Supporting Metrics

- First reflection completion rate
- AI action suggestion click and selection rate
- Reflection-to-action conversion rate
- Action-to-review completion rate
- Average cycles completed per user
- Share of users who report feeling more stable after action
- 7-day retention
- 30-day retention
- Peer mode adoption rate
- Completion lift in peer mode
- New action start rate after visiting insights

## 16. Risks and Mitigations

### 16.1 The Product Feels Like Just Another Journal

Mitigation:

- Repeatedly emphasize the small action experiment in onboarding and product copy
- Tie reflection directly to action generation

### 16.2 Users Still Do Not Act

Mitigation:

- Keep action size small
- Provide clear examples
- Frame actions as experiments, not commitments

### 16.3 Peer Features Add Social Pressure

Mitigation:

- Keep the model one-to-one, low frequency, and easy to exit
- Avoid public competition or rankings

### 16.4 Insights Are Weak Because There Is Not Enough Data

Mitigation:

- Delay complex insights until V3
- First focus on helping users complete more cycles
- Use explainable rules, not black-box summaries

### 16.5 Mental Health Boundaries Become Unclear

Mitigation:

- State clearly that the product supports self-awareness and everyday action, not therapy or medical care
- If user input includes self-harm, extreme hopelessness, or crisis signals, do not continue with normal action suggestions; show support resources instead
- Avoid framing normal emotional fluctuation as diagnosis

## 17. Future Directions Beyond MVP

- Smart reminders and notifications
- AI-assisted summaries and personalization
- Connections to campus resources or activities
- Richer mood and state tracking
- Small group experiments or themed challenges

## 18. Development Priority

### Stage 1

- Build the V1 solo core loop
- Validate that the main path is clear and usable

### Stage 2

- Add peer support
- Test whether outside support improves follow-through

### Stage 3

- Add pattern-based insights
- Test long-term value and retention

## 19. Conclusion

Momentum is built around a simple idea: many students do not need more abstract reflection. They need help recognizing their current state, understanding what is blocking them, and taking one small action that feels possible now.

The three-stage MVP plan supports that logic:

- V1 validates the personal loop
- V2 tests whether peer support improves follow-through
- V3 tests whether patterns and insights create long-term value

