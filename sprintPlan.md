# Apex System - Salesforce Migration Plan

## Objective

Migrate the React/Node application to a fully native Salesforce Experience Cloud application using:

- Experience Cloud
- Lightning Web Components
- Apex Service Layer
- Custom Objects
- Record Sharing
- Experience Cloud Authentication

The React project serves as the UI/UX reference only.

---

# Sprint 1 - Foundation ✅

- Experience Cloud
- Data Model
- Custom Objects
- Sharing
- Navigation
- Authentication

Status: Complete

---

# Sprint 2 - Landing Page ✅

- Hero
- Header
- Footer
- CTA
- Why Apex
- How It Works

Status: Complete

---

# Sprint 3 - Shared Components ✅

Reusable

- Cards
- Buttons
- Navigation
- Icons
- Responsive Layout

Status: Complete

---

# Sprint 4 - Dashboard Refactor

Objectives

Refactor existing Dashboard.

DO NOT replace components unless necessary.

Tasks

- Refactor dashboardPage
- Refactor dashboardHeader
- Refactor upcomingRides
- Refactor leaderboardPreview
- Refactor recentActivity

Add

- Welcome Card
- Dashboard Stats
- Quick Actions
- My Groups Widget
- Notification Widget

Create DashboardService.

---

# Sprint 5 - Groups

Improve

- groupList
- groupCard
- groupMembersModal

Create

- Group Details
- Search
- Filters
- Pagination

---

# Sprint 6 - Profile

Create

- Profile Page
- Statistics
- Ride History
- Membership History
- Badges

---

# Sprint 7 - Ride Module

Create

- Ride List
- Ride Details
- Participants
- Maps
- Timeline

---

# Sprint 8 - Leaderboard

Complete leaderboard.

Add

- Filters
- Rankings
- Statistics

---

# Sprint 9 - Notifications

Create Notification Framework

Notification__c

Notification Service

Notification Widget

---

# Sprint 10 - Admin

Admin Dashboard

Manage

Groups

Rides

Members

Reports

---

# Sprint 11

Performance

Caching

Security

Responsive

Accessibility

---

# Sprint 12

Testing

Deployment

Documentation



For each sprint I will:

* Compare the React implementation against the Salesforce implementation.
* Refactor existing LWCs instead of replacing them.
* Refactor existing Apex classes instead of introducing duplicate logic.
* Keep the component hierarchy consistent.
* Preserve your existing API contracts where possible.