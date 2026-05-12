# Reflection

## Q1 — What was the hardest bug you fixed?

the hardest bug was definitely in the auditengine file where when i had multiple entried it would bug out and wont know how to sum them up also some frontend bugs are well like when cursor which is the default which i selected when removed the dropdown for adding more ai tools would bug out, the other bug was supabase for some reason they changed the .env variable names and a mismatch was happening (annon_key and publishable_key) these two were clashing i had to The root cause was two things stacked on top of each other firstly the project was using the new Supabase publishable key format publishable_key but the server client code was looking for anaon_key which did not exist Second factor was the next cache was holding a snapshot of the env which was being used had to clear the cache so the error would go away.

---

## Q2 — What decision did you reverse and why?

At first the handleSubmit function existed outside the component as an async function by itself The rationale was that it made the component code look simpler and allowed to divide different things from each other It failed right away as handleSubmit was not able to get hold of any state variables of the component such as entries teamSize useCase or router that were required for its proper functioning
Reversal number one is bringing the handleSubmit inside the component as that is the way it should be done in React after all Otherwise you would have to pass every dependency through as a parameter to the function while making the code even more lengthy than the alternative of putting handleSubmit in the component in the first place
Reversal number two is related to how handleSubmit was called inside the form component To begin with it was handleSubmit that did e.preventDefault() It led to an unnecessary repetition when onSubmit tried to execute this function on its own The solution was letting onSubmit handle the prevention of the default event action before calling handleSubmit without arguments

---

## Q3 — How did you use AI tools during this project?

AI tools were heavily used in the process of making this to solve basic errors for typescript and for quick prototyping frontend which i changed later on
AI was also used to give a basic structural idea of the project
AI was used to solve some errors in the code as well
AI was also used for architecture documentation in this project.

---

## Q4 — How would you rate your own submission and why?

**8/10**

Everything from form input to the audit engine to Supabase persistence to output with AI summary to a shareable URL to lead capture works seamlessly and effectively with basic abuse protection The design of the UI is polished and professional The code itself is structured enough for a project built in a single week
The assumptions made for pricing and rate limiting are realistic The pricing rules of the audit engine identify cases of overspending but lack logic regarding how users spend money usage patterns or the distribution of roles within teams which are necessary for a more sophisticated implementation The rate limiting implementation uses in memory counting and resets upon deployment which is sufficient for a demo but not a production implementation There are currently no automated tests beyond those documented in TESTSmd The AI summary is merely cosmetic since it repeats what is present on the results page without adding any extra context
Shareable URLs work fine however there are no OG images associated with pages to make link previews on social media sites Twitter LinkedIn functional It was known going into this assignment that time constraints would not allow for this implementation Furthermore while the landing page is functional

---

## Q5 — What would you do differently with more time?

**Enhanced audit engine** – the current system takes the binary approach (either you are overpaying or you arent) A better design would model how intensely users use services if a person uses Claude Max for $100/month, he may benefit fully from this if he utilizes the service intensively in other cases he can waste his money since he barely uses the tool integration of the usage data via the API would make it possible to build much better recommendations

**Actual rate limits** – replace in-memory Map with the Upstash Redis storage to make it work reliably in terms of persistence across server restarts and multi-Vercel serverless deployment it will take about one hour and will be a production correctness improvement

**Open graph image generation** – employ @vercel/og package to dynamically create an Open Graph image per audit based on the amount of savings discovered this will give some purpose to sharing functionality which is the main viral factor the tool is relying upon

**Email Confirmation** – send out the email with audit data in PDF format after lead capturing is done. This way, it becomes possible to deliver something valuable for the user once he shares his email address

**User Accounts** - adding user accounts
