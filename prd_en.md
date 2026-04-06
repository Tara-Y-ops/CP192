# Momentum PRD

## 1. What This Document Is For

This PRD is meant to do two things:

1. describe what Momentum MVP1 is today
2. give a realistic roadmap for what could come next

So this is not a pure vision document, and it is not just a technical spec either. It should help someone quickly understand the product we have already built, what problem it is trying to solve, what is intentionally out of scope for MVP1, and where the product could go after this version.

## 2. Product Summary

Momentum is a small web app for students who feel stuck between reflection and action.

The core idea is simple: instead of asking people to think more, Momentum helps them pause, name what is going on, choose one very small next step, and then come back to review what happened.

In the current MVP1, the experience is built around a solo loop:

`landing -> demo login -> onboarding -> reflection -> action selection -> complete -> review -> dashboard/history`

This version is intentionally narrow. It is a local demo product designed to test whether this loop is useful and usable before we add anything more ambitious.

## 3. Why This Product Exists

Many students do reflect. The problem is that reflection often stays abstract.

Someone might know they care about their future, career, relationships, habits, or values. They may even know what they "should" do. But when it is time to begin, they get stuck. Sometimes the blocker is anxiety. Sometimes it is low energy. Sometimes the task feels too big, too loaded, or too unclear.

There are already products that support journaling, and there are already products that support execution. But there is still a gap between:

- "I understand what I am feeling"
- and
- "I know what small step I can actually take today"

Momentum is trying to sit in that gap.

The product is not trying to solve someone's whole life. It is trying to make the next step feel possible.

## 4. Who MVP1 Is For

The primary user for MVP1 is a university student who:

- thinks a lot about personal growth, direction, or important decisions
- often feels blocked before starting
- responds better to a low-pressure tool than to a productivity-heavy tool
- does not necessarily need a big plan, but does need a smaller entry point

Typical situations include:

- "I know what I need to do, but I still cannot begin."
- "The task feels too big, and I need help finding a smaller starting point."
- "I do not want another app that makes me feel judged or behind."

## 5. Product Goals for MVP1

MVP1 is here to validate the personal core loop.

The main questions behind this version are:

- Can a user move from reflection to action without getting lost?
- Do the action suggestions actually help, or do they just add noise?
- Will users complete the review after trying the action?
- Does the dashboard/history make the loop feel coherent over time, even in a basic form?

At this stage, the product goal is not scale, retention optimization, or social engagement. The goal is to prove that the loop itself is worth continuing.

## 6. What MVP1 Includes

Momentum MVP1 currently includes:

- a landing page that introduces the product
- a lightweight demo login
- onboarding with a display name and a single current focus area
- a structured reflection form
- AI-generated action suggestions with a local fallback path
- the ability to write a custom action instead
- an action completion step
- a post-action review form
- a dashboard that shows the active cycle and latest review
- a history page that shows past cycles
- local persistence through `.data/momentum-demo.json`

The important thing about this list is that it reflects the product that exists now, not an imagined future state.

## 7. What MVP1 Does Not Include

Just as important, MVP1 does not include:

- production authentication
- passwords, email verification, or account recovery
- peer support or accountability features
- a settings page
- an insights page
- reminders or notifications
- advanced analytics
- real production database infrastructure as the default runtime path
- therapy or mental health intervention features

That is deliberate. This version is supposed to stay focused.

## 8. The Core Experience

The user journey in MVP1 looks like this:

### 8.1 Landing

The landing page introduces the product in a lightweight way and points the user either to the dashboard or to the login flow.

### 8.2 Demo Login

The user enters an email and display name. This is not meant to be production auth. It is just enough session structure to support a local demo experience.

### 8.3 Onboarding

The user chooses a current focus area. This gives the dashboard and later flows a little context without making onboarding heavy.

### 8.4 Reflection

The reflection form asks the user to describe their current state in a structured way:

- theme
- emotion
- energy level
- blocker
- resistance reason
- effort level
- desired outcome
- open reflection text

The goal here is not journaling for journaling's sake. The goal is to create enough context to produce a realistic next step.

### 8.5 Action Selection

Once the reflection is saved, the user lands on the action selection page.

If there are no suggestions yet, the app generates them automatically. The user can:

- pick one of the AI-generated actions
- regenerate suggestions
- ignore all of them and write a custom action

Every action is supposed to feel small, concrete, and low-pressure.

### 8.6 Completion

After choosing an action, the cycle becomes active on the dashboard. Once the user has done the action, they mark it complete and move to review.

### 8.7 Review

The user records what happened, how they felt, whether they feel more stable, and whether they want to continue. This is the part that turns the action into learning instead of just another unfinished intention.

### 8.8 Dashboard and History

The dashboard is the home base for the current cycle. It shows:

- the next step
- the user's focus area
- the active cycle
- the latest reviewed cycle

The history page is simpler. It is there to preserve continuity and help the user see that each cycle is part of a larger pattern, even though MVP1 does not yet generate formal insights.

## 9. Current Product Rules

There are a few important product rules in MVP1:

### 9.1 One Active Cycle at a Time

Momentum currently allows only one active cycle per user. A cycle stays active until it is reviewed.

This keeps the product simple. It also reduces the chance that a user will create multiple thoughtful reflections and then act on none of them.

### 9.2 Clear Status Flow

Each cycle moves through four states:

- `reflecting`
- `pending`
- `completed`
- `reviewed`

This is the backbone of the product. The UI, dashboard logic, and API routes all follow this state model.

### 9.3 AI Is Support, Not the Product

AI suggestions are useful when they help the user get unstuck. But Momentum should still work when AI is unavailable.

That is why MVP1 includes a deterministic fallback path. If OpenAI is not configured, or if the request fails, the user should still get usable next-step options.

## 10. Functional Scope

This section is less about engineering detail and more about what the product needs to be able to do.

### 10.1 Session and Access

- The app should let a user start a demo session with email and display name.
- The session should persist through an HTTP-only cookie.
- Protected pages should redirect unauthenticated users to login.
- The user should be able to log out easily.

### 10.2 Onboarding

- The user should set a display name and choose a focus area.
- If the user already has a focus area saved, the app should not force them through onboarding again.
- The focus area should remain editable later.

### 10.3 Reflection

- The reflection flow should be short and structured.
- It should collect enough information to generate realistic action suggestions.
- It should prevent incomplete submissions.

### 10.4 Action Suggestions

- The product should generate three usable suggestions in the normal case.
- Each suggestion should include a title, description, estimated time, and rationale.
- The user should be able to regenerate suggestions or ignore them.
- The user should always be allowed to write their own action.

### 10.5 Action Completion and Review

- The user should be able to mark an action as complete.
- Only a completed action should move into review.
- The review should feel short enough to finish, but meaningful enough to be useful later.

### 10.6 Dashboard and History

- The dashboard should clearly tell the user what to do next.
- The dashboard should not try to do too much in MVP1.
- History should show past cycles in a simple, readable way.

## 11. Pages in the Current MVP1

The current app includes these pages:

- `/` landing
- `/auth` demo login
- `/onboarding` onboarding
- `/dashboard` dashboard
- `/cycle/new` reflection form
- `/cycle/[id]/action` action selection
- `/cycle/[id]/review` review page
- `/history` cycle history

Older product drafts mentioned things like peer pages, settings, and insights. Those are not in the current product and should be treated as future ideas, not present functionality.

## 12. Data Model in MVP1

For the local demo, Momentum stores data in four basic groups:

- profiles
- cycles
- action options
- reviews

At a product level, that means:

- a user has a profile and one current focus area
- a cycle stores the reflection state and status
- an action option stores either an AI-generated or custom next step
- a review stores what happened after the action

This is enough for MVP1 because the product is still centered on completing the loop, not on deep analysis.

## 13. API Surface

The current implementation already exposes a simple API for the full loop:

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/profile`
- `POST /api/cycles`
- `POST /api/cycles/:id/generate-actions`
- `POST /api/cycles/:id/select-action`
- `POST /api/cycles/:id/complete`
- `POST /api/cycles/:id/review`
- `GET /api/dashboard`
- `GET /api/history`

For MVP1, these routes mainly support the UI. They are not yet meant to be a public platform API.

## 14. Success Criteria for MVP1

We should consider MVP1 successful if:

- a new user can sign in, finish onboarding, and reach the dashboard
- a user can complete one full reflection -> action -> review cycle without help
- the AI path is useful when available
- the fallback path still works when AI is unavailable
- dashboard and history reflect the user's progress clearly

If we want to evaluate this more formally, the most useful metrics would be:

- reflection completion rate
- action selection rate
- review completion rate
- percentage of users who report feeling more stable after the action
- number of users who complete a full cycle in a test session

These are evaluation goals, not analytics features that already exist inside the product.

## 15. Risks and Tradeoffs

### 15.1 The Product Could Feel Too Much Like a Journal

That risk is real. If the reflection feels too open-ended, users may stop before action.

The response in MVP1 is to keep the reflection structured and to route directly into action selection.

### 15.2 AI Could Become a Crutch or a Failure Point

If the product only works when AI works, it is fragile.

That is why the product keeps AI in a supporting role and includes local fallback suggestions.

### 15.3 The Scope Could Expand Too Quickly

Momentum naturally invites ideas like peers, insights, reminders, and social accountability. But adding those too early would make it harder to tell whether the core loop itself is strong.

So MVP1 should stay small on purpose.

### 15.4 The Product Boundary Could Become Confusing

Momentum touches emotion and stuckness, which means the language matters. The product should support self-awareness and action, but it should not present itself as therapy, treatment, or crisis support.

## 16. Roadmap After MVP1

The roadmap should build outward from the core loop, not away from it.

### 16.1 Next Step: Make the Solo Loop More Solid

Before adding new product areas, the first follow-up work should probably improve the basics:

- better polish on the dashboard and history
- clearer copy around action size and expected outcomes
- better persistence beyond a local demo setup
- cleaner edge-case handling

This is less exciting than adding big new features, but it is probably the right next move if MVP1 shows promise.

### 16.2 Roadmap Direction A: Light Accountability

If the solo loop works, the next major expansion could be some form of low-pressure accountability.

The point would not be social networking. The point would be to test whether users are more likely to follow through when one other person can lightly see or support the action.

Possible V2 additions:

- invite one peer
- share a short action summary
- optional check-in after the action
- easy exit from peer mode

This only makes sense after the solo loop feels stable.

### 16.3 Roadmap Direction B: Pattern Recognition

Once users have enough history, the product could become more useful by helping them notice patterns.

Possible later additions:

- recurring blockers
- common emotional states
- which kinds of actions tend to work best
- lightweight insight summaries

The important thing here is sequencing. Insights are only valuable after there is enough real usage to support them.

### 16.4 Roadmap Direction C: Better Infrastructure

If Momentum moves beyond demo use, the product will eventually need:

- real auth
- persistent cloud storage
- stronger privacy and security foundations
- better analytics and instrumentation

These are important, but they are not what MVP1 is trying to prove.

## 17. Conclusion

Momentum MVP1 is a deliberately small product.

It is built around one belief: people often do not need more abstract reflection. They need a way to notice what is true right now, choose one manageable action, and learn from what happens next.

If MVP1 proves that this loop is useful, then the roadmap can expand carefully into accountability, insights, and stronger infrastructure. But the value of the product should still come from the same place: helping someone go from stuckness to motion without adding more pressure.
