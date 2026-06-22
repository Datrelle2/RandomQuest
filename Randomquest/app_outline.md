# APP OUTLINE

---

### IDENTIFYING THE APP
1. **What problem does this app solve?**
   This app is used for fun and generates random challenges for users to accomplish. These challenges can be anything from tasks around the house, physical activity, gaming, creativity, brain and learning, cooking, outdoor activities, and more.

2. **Why would someone use this app?**
   Someone would use this app when they are bored and want something fun, productive, or creative to do.

3. **What pain points exist today?**
   People have a lot of free time to spare and often don't know how to fill it. This app gives them random, personalized things to do whenever they have nothing going on.

---

### WHO IS THE USER
1. **Who will use this app?**
   Anyone and everyone. After the initial registration the user will select categories they are interested in so that their challenges will be tailored to things they enjoy.

2. **What information does the user need to provide?**
   - **New users:** Full name, email, password, and category preferences
   - **Returning users:** Registered email and password only

---

### TECH STACK
- **Frontend:** Vite + React
- **HTTP Client:** Axios
- **Backend/Auth/Database:** Supabase
- **Challenge Source:** Bored API
- **AI Integration:** Claude (tailors and generates challenges based on user preferences)

---

### INFORMATION NEEDED

1. **What can users view?**

   **Unauthenticated users:**
   - Login page
   - Register page

   **Authenticated users:**
   - Dashboard/Home — their current generated challenge
   - Saved Challenges — challenges they have bookmarked
   - Challenge History — past challenges they have received
   - Category Settings — update their preferences anytime
   - Profile — view and update name, email, and password

2. **Top 3 reasons for visit:**
   - To receive a newly generated challenge
   - To accomplish a generated challenge
   - To view or revisit challenges they have saved

---

### CRUD OPERATIONS

**CREATE**
- User registers an account
- User selects their category preferences
- User receives a new challenge (logged to history)
- User saves a challenge they like
- User marks a challenge as complete

**READ**
- User views their current generated challenge
- User views their saved challenges
- User views their challenge history
- User views their current category preferences
- User views their profile and total points

**UPDATE**
- User updates their category preferences
- User updates their profile (name, email, password)
- Challenge status updated from incomplete → complete
- User's point total increases when a challenge is marked complete

**DELETE**
- User deletes their account
- User removes a category preference
- User removes a challenge from their saved list

---

### POINTS SYSTEM
Each completed challenge awards the user a set number of points. Points are displayed on the user's profile and accumulate over time to reflect their overall activity. This is purely personal progress with no comparison to other users.

- Each completed challenge = 10 points
- Points are visible on the user's profile page
- Points are stored in Supabase and updated each time a challenge is marked complete

---

### USER JOURNEY

**New User:**
1. User visits the website and is met with a login/register form
2. User selects that they do not have an account and fills out the registration form with their full name, email, and password
3. User confirms their email and password before the account is created
4. User is redirected to the login page where they sign in with their new credentials
5. After successful login the user is taken to the category selection page where they choose from the available categories and subcategories
6. After selecting their categories the user is taken to a welcome page with the following introductory message:

   > *"Hey, welcome! 👋 We're so glad you're here. Based on the categories you picked, we've already lined up your first challenge — and trust us, it's a good one. Complete it, mark it done, and start racking up those points. This is going to be fun! ✨"*

7. User is then directed to their dashboard where their first challenge is displayed

**Returning User:**
1. User visits the website and is met with the login form
2. User enters their registered email and password
3. After successful login the user is taken directly to their dashboard
4. Dashboard displays a freshly generated challenge based on their saved category preferences
5. User can mark challenges complete, save challenges, view history, adjust preferences, or update their profile at any time

---

### SAVED CHALLENGES
Users can save challenges they enjoy so they can revisit and complete them later.

- A save button appears on every challenge card
- Saved challenges are stored in Supabase under the user's account
- Users can view all saved challenges from their dashboard
- Users can remove a challenge from their saved list at any time