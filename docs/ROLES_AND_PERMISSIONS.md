# TH77 Prime - Roles & Permissions

## Overview

TH77 Prime uses a 4-level hierarchical role system with Role-Based Access Control (RBAC).

---

## Roles

### 1. Admin

**Level:** Highest (System Administrator)

**Description:** Full system control. Manages all users, lotteries, rounds, credit, settings, and has visibility across the entire platform.

**Permissions:**
- Manage users (create, edit, deactivate all roles)
- Manage lottery types and rounds
- View all bets across all agents and members
- Manage credit for any user
- View all reports and dashboards
- Manage system settings
- Resolve credit alerts
- Access audit logs

---

### 2. Master

**Level:** Second (Master Agent)

**Description:** Oversees sub-agents. Manages credit distribution, monitors agent activity, and views bets placed under their hierarchy.

**Permissions:**
- Manage agents (create, edit, deactivate agents under their hierarchy)
- Manage credit for sub-agents
- View bets from agents and members under their hierarchy
- Create betting links
- View reports for their hierarchy
- Resolve credit alerts for sub-agents

---

### 3. Agent

**Level:** Third (Agent)

**Description:** Manages members, places bets on behalf of members, distributes credit, and creates betting links for customers.

**Permissions:**
- Manage members (create, edit under their hierarchy)
- Manage own credit allocation to members
- Place bets for self and members
- Create betting links for customers
- View own bets and member bets
- View own dashboard and reports

---

### 4. Member

**Level:** Lowest (End-User / Customer)

**Description:** End-user who places bets via betting links shared by agents. Limited to viewing their own activity.

**Permissions:**
- Place bets via betting links only
- View own bet history
- No direct API access (must use link-based betting)

---

## Hierarchy Diagram

```
Admin
  └── Master
        └── Agent
              └── Member
```

Each parent role can manage and view data for all roles below them in the hierarchy.
