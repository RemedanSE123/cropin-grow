# Cropin Grow System Dashboard

A Next.js web application dashboard for managing Development Agents (DA) and Woreda Representatives.

## Features

- **Login System**: Woreda Representatives login using phone number with fixed password "123"
- **Dashboard Overview**: View all DA users connected to the logged-in Woreda Representative
- **Editable Fields**: Woreda Reps can edit only their DA users' total data collected and status
- **KPI Cards**: Display key performance indicators
- **Global View**: View all DA data from all reps with filters by region, zone, and woreda
- **Support/Report**: Link to Google Form for support and reporting issues
- **Responsive Design**: Works on desktop and mobile devices
- **Charts**: Visual representation of data collection

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **Charts**: Recharts

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```
   DATABASE_URL=postgresql://Ethiopian%20Map%20System_owner:npg_wLSNX7Qg6hDi@ep-autumn-frost-a8zg2v20-pooler.eastus2.azure.neon.tech/cropin?sslmode=require&channel_binding=require
   ```
   
   Note: The database URL is already configured in `lib/db.ts` as a fallback, but it's recommended to use environment variables in production.

3. **Database Schema**
   Ensure your PostgreSQL database has the following tables:
   
   - `woreda_reps`: Contains Woreda Representative information
     - `id` (primary key)
     - `name`
     - `phone_number`
   
   - `da_users`: Contains Development Agent information
     - `id` (primary key)
     - `name`
     - `region`
     - `zone`
     - `woreda`
     - `kebele`
     - `contactnumber`
     - `reporting_manager_name`
     - `reporting_manager_mobile` (links to `woreda_reps.phone_number`)
     - `language`
     - `total_collected_data` (integer, default 0)
     - `status` (text, e.g., 'Active', 'Inactive', 'Pending')

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   Navigate to `http://localhost:3000`

## Usage

1. **Login**: Use a Woreda Representative phone number and password "123"
2. **Dashboard**: View your DA users, KPIs, and charts
3. **Edit Data**: Click on "Total Data" or "Status" columns to edit (only for your DA users)
4. **Global View**: Switch to the Global View tab to see all DA users with filters
5. **Support**: Click the "Support / Report" button to access the Google Form

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── login/          # Login API
│   │   ├── da-users/           # DA users CRUD API
│   │   ├── kpis/               # KPI data API
│   │   └── filters/            # Filter options API
│   ├── dashboard/              # Dashboard page
│   ├── login/                  # Login page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page (redirects)
│   └── globals.css             # Global styles
├── components/
│   ├── DashboardContent.tsx    # Main dashboard component
│   ├── KPICards.tsx            # KPI cards component
│   ├── DATable.tsx             # DA users table component
│   └── GlobalView.tsx          # Global view component
├── lib/
│   └── db.ts                   # Database connection
└── package.json
```

## Notes

- The password is fixed as "123" for all users (as per requirements)
- Only Woreda Representatives can edit their own DA users' data
- The relationship between DA users and Woreda Reps is based on `reporting_manager_mobile` matching `phone_number`
- The application uses client-side authentication with localStorage (for production, consider using secure HTTP-only cookies)

## Build for Production

```bash
npm run build
npm start
```

