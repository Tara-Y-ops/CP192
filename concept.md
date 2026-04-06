Project Concept
From Reflection to Action: A Self-Awareness App for University Students

Introduction and Problem Statement
University students often spend a lot of time thinking about identity, purpose, personal growth, and the future. The issue is not that they never reflect. The issue is that reflection often stays internal and abstract. Someone may understand what matters to them, or even know what they should do next, but still feel unable to begin. At that point, reflection stops being useful and starts turning into hesitation, pressure, or overthinking.

That is the gap this project is trying to address. Many existing tools support journaling, note-taking, or task management, but fewer help users move from emotional awareness to one concrete next step. Momentum is built around the idea that students often do not need a bigger plan first. They need a way to name what is going on, choose a small action that feels possible now, and learn something from trying it.

Target Users
The main users are university students, especially undergraduates, who care about personal growth but often get stuck between reflection and action. These are people who think about career direction, interests, relationships, habits, or values, but find it hard to turn those thoughts into movement.

In early research, many students described a similar pattern: they reflect often, but do not always know what to do next. Some feel anxious or tired before starting. Some know the task but avoid it because it feels too big. Others want a tool that feels supportive without being overly demanding. Momentum is meant for that kind of user: someone who wants help getting into motion, not another system that adds pressure.

Proposed Solution
Momentum is a web app that helps users move through a short loop: reflection, action, and review.

Instead of asking for a long journal entry, the app uses a structured reflection form. Users describe their current state through a few focused questions, such as what they are feeling, what feels blocked, how much energy they have, and what kind of next step feels realistic. Based on that, the app offers a few small action options. These can be AI-generated or replaced with a custom action written by the user.

The point is not to generate a perfect answer. The point is to reduce friction around starting.

After the user tries the action, they return for a short review. They record what happened, how they felt, whether they feel more stable, and whether they want to continue. Over time, this creates a personal history that can help the user see progress more clearly.

In the current MVP1, this is a solo experience. Peer support may still be a useful future direction, but it is not part of the current product scope.

Current MVP1 Flow
The current version of Momentum is a local demo MVP built around the following flow:

`landing -> demo login -> onboarding -> reflection -> action selection -> complete -> review -> dashboard/history`

What MVP1 currently includes:

- a landing page
- a lightweight demo login
- onboarding with display name and one focus area
- a structured reflection form
- AI action suggestions with a deterministic local fallback
- custom action creation
- action completion
- a post-action review form
- a dashboard showing the current cycle and latest review
- a history page

This MVP is intentionally narrow. It is meant to test whether the core loop works before adding broader features.

Core Feedback Loop
The heart of the project is a reflection-to-action loop that helps users learn by doing.

First, the user reflects in a structured way. Instead of writing broadly about life, they answer a short set of questions that captures their current emotional state, source of resistance, and what kind of next step feels manageable.

Second, the user chooses one small action. The system generates a few options designed to be low-risk and specific, and the user can either select one or write their own. The action is not meant to solve everything. It is meant to be small enough that the user can actually begin.

Third, after trying the action, the user comes back and reviews what happened. This step matters because it turns action into learning. The app asks what happened, whether anything changed emotionally, and whether the user feels more ready to continue.

Finally, the cycle becomes part of the user’s history. In MVP1, this history is still simple. It shows what happened and preserves continuity across cycles. In later versions, that history could become the basis for pattern recognition and stronger insight features.

Experiment and Research Support
To test whether this direction meets a real need, I surveyed 53 students, most of them undergraduates. The results supported the core idea behind the project.

First, 69% of respondents said they often think about their future or personal growth. That suggests reflection is already common among the target audience.

At the same time, more than 60% said repeated reflection could make them feel less clear or less likely to act. This supports the idea that reflection alone is not always enough.

The survey also showed strong support for learning through action. More than 85% agreed that taking small actions helped them understand themselves better. That is important because Momentum is built around the belief that self-understanding often becomes clearer after a real experience, not before it.

Some responses also suggested that accountability or peer support could be useful. That remains interesting, but based on the current product direction, it makes more sense as a later-stage roadmap item rather than something MVP1 should try to solve immediately.

Bias and Limitations
This research was still limited in a few ways. The survey relied on self-reporting, which means participants may have overstated how often they reflect or how helpful small actions would be. The sample may also have included more introspective students than average, which could make the reflection-action gap appear more common than it is across the entire student population.

Another limitation is that survey responses capture what users say they want, not necessarily what they will do. Someone may say they value small action steps, but still not follow through in practice. That is one reason MVP1 matters: it gives us a real product to test against actual behavior instead of just stated preference.

Feasibility
The current MVP1 is much more feasible than a broader first version would have been because the scope is focused. The app already covers the core loop with:

- structured reflection
- suggested or custom actions
- review after action
- dashboard and history
- local persistence for demo use

By keeping the first version centered on solo use, we avoid the added complexity of peer systems, notifications, advanced analytics, and production-scale infrastructure. That makes it realistic to deliver and evaluate within a semester-sized project window.

If the core loop proves useful, the next stage can build outward carefully rather than trying to solve everything at once.

Roadmap After MVP1
If Momentum continues beyond MVP1, the next steps should build from the current loop instead of replacing it.

The first likely direction is to strengthen the solo experience: better polish, better persistence, cleaner edge-case handling, and more confidence that the current flow is genuinely useful.

After that, one possible roadmap branch is light peer accountability. Not social networking, but a low-pressure way for one other person to see or support an action. This could help test whether gentle accountability improves follow-through.

Another possible direction is insight generation. Once enough cycle history exists, the product could help users notice patterns, such as common blockers, emotional states, or action types that seem to work best for them.

A later infrastructure-focused stage could add real authentication, cloud storage, and stronger privacy and analytics foundations if the product moves beyond local demo use.

Conclusion
Momentum is based on a simple belief: students often do not need more abstract reflection. They need help turning reflection into one manageable action and one useful review.

The current MVP1 is built to test that idea in the smallest useful form. It is not trying to be a full platform yet. If the core loop proves valuable, then future versions can expand into accountability, insights, and more robust infrastructure while keeping the same central purpose: helping people move from stuckness to action without adding more pressure.


References
Impm. (2023, September 7). 5 Mindsets that could Transform you and your Organization - International Masters Program for Managers. International  Masters Program for Managers. https://impm.org/5-mindsets-that-could-transform-you-and-your-organization
Clarke, J. (2023, November 27). What is analysis paralysis? How overthinking affects your decision making. Verywell Mind. https://www.verywellmind.com/what-is-analysis-paralysis-5223790
Oliver-Gans, A. (2024, December 4). How to journal for mental health: Benefits and tips. Alex Oliver-Gans Psychotherapy. https://www.therapywithalex.com/blog/how-to-journal-for-mental-health
Appendix A: Survey Results (Google Sheet)
Google Sheet Link:
https://docs.google.com/forms/d/1tvQeIQTIzHs5PKa2YjWSJoT3UhMx_NiWmdiQInnZr8M/edit#responses
