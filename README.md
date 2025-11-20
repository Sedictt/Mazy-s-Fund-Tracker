<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Mazy Fund Tracker

A comprehensive fund tracking application with role-based access for administrators and members.

## Features

- **Admin Dashboard**: Full management capabilities for contributions, members, and fund tracking
- **Member View**: Summary view showing total contributions and balances
- **Role-Based Access**: Different interfaces for administrators and members
- **Profile Management**: Upload and manage profile pictures
- **Member Self-Service**: Members can update their own profile, credentials, and profile picture
- **Persistent Sessions**: "Stay logged in" feature for convenient access
- **Data Import/Export**: Import contribution data via CSV
- **Real-time Tracking**: Daily contribution tracking with balance calculations

## Login Credentials

### Admin Access
- **Username**: `mazy`
- **Password**: `mazy123`
- **Permissions**: Full access to dashboard, data table, member management, and all features

### Member Access
Members have read-only access to view their contributions and fund summary, plus the ability to manage their own profile and login credentials.

| Username | Password     | Display Name |
|----------|--------------|--------------|
| bryan    | bryan123     | Bryan        |
| deign    | deign123     | Deign        |
| jv       | jv123        | Jv           |
| lorraine | lorraine123  | Lorraine     |
| margaux  | margaux123   | Margaux      |
| raineer  | raineer123   | Raineer      |
| sean     | sean123      | Sean         |
| mark     | mark123      | Mark         |

**Member Permissions**: 
- View-only access to summary page showing contributions and balances
- Edit their own display name and profile picture
- Update their own username and password
- Cannot manage other members or modify contribution data

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
