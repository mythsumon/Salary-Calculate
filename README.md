# Salary Calculator - Singapore

A responsive web application for calculating salary based on attendance, overtime, bonuses, and deductions. Built for Singapore job pay periods.

## Features

- 📊 **Dashboard**: Summary cards showing total days, attendance, OT hours, and calculated pay
- 📝 **Period Editor**: Day-by-day attendance and overtime tracking
- 💰 **Bonuses & Deductions**: Manage perfect attendance bonus, meal deductions, and custom items
- 📜 **History**: Save and view past pay periods
- 💾 **LocalStorage**: All data persists locally in the browser
- 📱 **Mobile-First**: Responsive design with sticky bottom bar on mobile
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📄 **PDF Export**: Export calculation reports as PDF

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Hook Form + Zod validation
- LocalStorage for persistence

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## Default Settings

- Work hours per normal day: 8 hours
- Normal daily pay: 23 SGD
- OT rate: 4.32 SGD per OT hour
- Pay period length: 20 days
- Meal deduction per period: 140 SGD
- Perfect attendance bonus: 50 SGD

All settings are editable and persist in LocalStorage.

## Usage

1. **Calculator Tab**: View summary and results, use "Load Sample Data" for quick testing
2. **Period Editor Tab**: Configure pay period settings and mark daily attendance/OT
3. **Bonuses & Deductions Tab**: Set up bonuses and deductions
4. **History Tab**: View and manage saved pay periods

## Calculation Logic

- **Base Pay** = Attended Days × Normal Daily Pay
- **OT Pay** = Total OT Hours × OT Rate
- **Gross Pay** = Base Pay + OT Pay
- **Perfect Attendance Bonus** = Applied if all days are attended (if enabled)
- **Net Pay** = Gross Pay + Bonuses - Deductions

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.
