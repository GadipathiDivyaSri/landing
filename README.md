# WrindhaOS - Personal Operating System & Clarity Platform

> **Plan your studies, manage goals, build habits, focus better, and organize your life with WrindhaOS.**

WrindhaOS is an all-in-one personal operating system built to replace scattered tools with a single, cohesive ecosystem. Designed for students, exam aspirants, creators, and ambitious builders who value clarity and focused execution over app sprawl.

---

## 🌟 Key Features & Modules

- **Central Dashboard**: Daily agenda, quick stats, active priority overview, and focus metrics.
- **Smart Academic Planner**: Syllabus breakdown, unit/topic tracking, and study session history.
- **Habits Tracker & Priority Matrix**: Eisenhower 4-quadrant prioritization and habit streak tracking.
- **Focus Centre**: Built-in Pomodoro timer with ambient sounds and focus session analytics.
- **Goal Architecture**: Long-term vision mapping with actionable milestones and progress bars.
- **Career Roadmap**: Skill trees, certifications, and career progression planning.
- **Financial Awareness**: Daily expense tracking and monthly budget allocation.
- **Encrypted Private Journal**: Safe space for daily reflections, gratitude, and mood tracking.
- **Self-Assessment Tool**: Interactive 2-minute diagnostic to identify productivity bottlenecks.

---

## 📄 Pages & Structure

- `index.html` - Homepage with interactive module previews, pricing comparison, fit criteria, and FAQ.
- `about.html` - Founder's Story (*Why I Built WrindhaOS*), Team's Story, vision, values, and origin.
- `quiz.html` - Interactive 2-minute self-assessment diagnostic quiz with custom score scoring and recommendations.
- `join.html` - Early access waitlist registration portal with role-based onboarding.
- `contact.html` - Direct contact and user support form.
- `privacy.html` - Privacy Policy (compliant with DPDP Act, 2023 & Google Play Data Safety).
- `terms.html` - Terms of Service & acceptable use conditions.
- `subscription.html` - Subscription Policy & billing guidelines.
- `refund.html` - Refund and cancellation policy.
- `account.html` - Google Play-compliant account deletion portal and data retention policy.
- `cookie.html` - Cookie & tracking technologies disclosure.
- `data.html` - Third-Party Processors & Services Register.
- `disclaimer.html` - General and academic disclaimers.

---

## 🚀 Getting Started & Local Development

### Prerequisites

- Node.js (v18 or higher)
- npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/wrindhaos.git

# Navigate to project directory
cd wrindhaos

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be running on `http://localhost:3000`.

---

## 📦 Deployment Options

### 1. Cloud Run / Docker
WrindhaOS is production-ready with the included Express static server (`server.js`) listening on port 3000.

```bash
npm start
```

### 2. Static Hosting (Vercel, Netlify, GitHub Pages)
All HTML, CSS, and JS assets are self-contained and can be served directly from any static CDN or hosting platform.

---

## 🗄️ Supabase Database Integration

WrindhaOS includes native full-stack Supabase integration for early-access waitlist submissions with automatic server-side validation and graceful fallback.

### Database Table Schema (`join_details`)

Run the following SQL query in your [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql):

```sql
create table if not exists join_details (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table join_details enable row level security;

-- Allow anonymous submissions for the waitlist
create policy "Allow waitlist inserts" 
  on join_details 
  for insert 
  with check (true);
```

### Environment Configuration

Configure the environment variables in `.env` (refer to `.env.example`):

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## 🛡️ Privacy & Security

- Zero third-party ad networks or data broker integrations.
- Local-first architecture with optional secure cloud sync via Supabase.
- Full compliance with Google Play Developer Policies and India's DPDP Act, 2023.

---

## 📬 Contact & Support

- **Founder**: Kalyan Gongidi
- **Email**: wrindhaos@gmail.com
- **Website**: [wrindhaos.in](https://wrindhaos.in)
- **Location**: Chittoor, Andhra Pradesh, India

© 2026 WrindhaOS. All rights reserved.
