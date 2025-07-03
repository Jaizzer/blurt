# Blurt

**Blurt** is a minimalist social media web app focused on learning real-world authentication and user management using Node.js, Express, PostgreSQL, Passport, and Amazon S3. The app was initially built to explore authentication flows but evolved into a full-stack prototype with user feeds, media uploads, and account verification.

> 🧠 **Purpose**: Originally created to learn authentication and session management, Blurt became a playground for building real-world backend systems, clean directory structures, and scalable service layers.

---

## 🚀 Features Implemented

-   ✅ Local, Google, and GitHub authentication using Passport.js
-   ✅ Email verification with expiring links (5-minute limit)
-   ✅ Form validation with express-validator
-   ✅ Post creation with image uploads via Amazon S3
-   ✅ Commenting and liking system for posts and comments
-   ✅ Profile picture upload and update
-   ✅ Session-based authentication with PostgreSQL session store
-   ✅ Authorization-based access control (authenticated routes only)
-   ✅ Thoughtful error handling and custom error pages
-   ✅ Modular MVC + Service Layer + Middleware structure
-   ✅ EJS templating for dynamic rendering
-   ✅ Environment config and cloud deployment–ready

---

## 🧊 Status: Feature-Frozen

Blurt's development is intentionally paused. It fulfilled its goal of helping the developer learn authentication and build a small but feature-rich web app.

While many core features are implemented, additional ones were scoped but intentionally deferred to avoid overcommitting and allow the developer to pursue broader backend technologies such as:

-   Prisma ORM
-   REST APIs and testing
-   React integration
-   Express router/controller testing

---

## 🚧 Unfinished Features (You Can Help!)

The following features are planned but currently unimplemented. Contributions or forks are welcome if you'd like to complete them or expand the app:

-   [ ] **Post Preview Grid** — Render 3-image preview with "+X" indicator
-   [ ] **User Profile Page** — Public-facing profile with user’s posts
-   [ ] **News Feed** — Paginated or infinite scroll feed
-   [ ] **Topbar Navigation** — Sticky topbar with notifications and links
-   [ ] **Notifications** — Notify on comment/like/tag events
-   [ ] **Search Feature** — Search for users or content
-   [ ] **Profile Sidebar** — Quick-access sidebar with profile summary
-   [ ] **Profile Modification Page** — Edit user details, picture, feeling
-   [ ] **Finishing Touches** — UI polish, responsiveness, UX tweaks

> Want to help out? Feel free to fork the project or submit a pull request. Contributions are always appreciated.

---

## 📁 Project Structure

```
.
├── app.js
├── config/                 # DB, Passport, Multer, Session
├── controllers/            # Route controllers (auth, posts, etc.)
├── middlewares/            # Auth and validation middlewares
├── models/                 # SQL model and data access logic
├── public/                 # Static JS and CSS
├── routes/                 # Express Routers
├── scripts/                # Database seed scripts
├── services/               # Business logic (email, storage, auth)
├── utils/                  # Utility functions
├── validators/             # express-validator schemas
├── views/                  # EJS templates
└── README.md
```

---

## 🛠️ Tech Stack

-   **Backend**: Node.js, Express
-   **Database**: PostgreSQL (with SQL scripts)
-   **Authentication**: Passport.js (Local, Google, GitHub)
-   **Email**: Nodemailer
-   **Storage**: Amazon S3
-   **Templating**: EJS
-   **Validation**: express-validator
-   **Session Management**: express-session + PostgreSQL store

---

## 📦 Installation

```bash
git clone https://github.com/your-username/blurt.git
cd blurt
npm install
cp .env.example .env
# Configure your DB and S3 credentials inside .env
npm start
```

---

## 🧪 Test It Locally

```bash
# Seed test data
node scripts/populateDb.js

# Start local server
node --watch app.js
```

---
