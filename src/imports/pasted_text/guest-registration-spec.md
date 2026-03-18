If you want to **update your prompt to include a signature input**, here is a **clean improved version** of the specification with **signature capture added**.

---

# Guest Registration Mobile App (React Native)

## Overview

Create a **React Native mobile application** for **guest registration and visitor tracking**.

Visitors will register their information and sign digitally before submitting the form. The app should support **multiple visit purposes** and include an **Admin Panel** to manage those purposes.

For the first version, **all data will be stored locally using AsyncStorage** (no backend required yet).

---

# Features

## 1. Guest Registration Form

Visitors must fill out the following information:

**Fields**

* Name
* Email
* Phone Number
* Purpose of Visit
* Signature (digital signature input)

**Default Purpose Options**

* Inquiry
* Booking
* Check-in
* Ocular
* Meeting
* Official Business

**Validation**

* Name is required
* Email must be valid
* Phone number required
* Purpose required
* Signature required

After submission, the data should be **saved in local storage**.

---

# 2. Digital Signature Input

The registration screen should include a **signature pad** where visitors can sign using their finger.

Suggested library:

```bash
npm install react-native-signature-canvas
```

The signature should be saved as a **Base64 image**.

Example saved data:

```
signature: "data:image/png;base64,iVBORw0KGgoAAAANS..."
```

---

# 3. Visit Records List

Display all registered guests.

**Displayed Information**

* Name
* Email
* Phone
* Purpose
* Date & Time
* Signature (preview)

Optional features:

* Search guests
* Filter by purpose

---

# 4. Admin Panel

Admin can manage **visit purposes**.

Capabilities:

* Add new purpose
* Edit purpose
* Delete purpose
* View guest records

Example additional purposes:

* Delivery
* Interview
* Maintenance

All purposes should also be stored in **AsyncStorage**.

---

# 5. Local Storage Structure

### Guests

```
guests = [
  {
    id,
    name,
    email,
    phone,
    purpose,
    signature,
    date
  }
]
```

### Purposes

```
purposes = [
  "Inquiry",
  "Booking",
  "Check-in",
  "Ocular",
  "Meeting",
  "Official Business"
]
```

---

# 6. App Screens

### Home Screen

Options:

* Register Guest
* View Records
* Admin Panel

---

### Guest Registration Screen

Inputs:

* Name
* Email
* Phone
* Purpose (Dropdown)
* Signature Pad
* Submit Button

---

### Records Screen

List of all guest registrations.

Each record shows:

* Guest info
* Purpose
* Date
* Signature preview

---

### Admin Screen

Manage purposes:

* Add purpose
* Edit purpose
* Delete purpose

---

# Recommended Libraries

React Navigation

```
npm install @react-navigation/native
npm install @react-navigation/native-stack
```

Local Storage

```
npm install @react-native-async-storage/async-storage
```

Signature Capture

```
npm install react-native-signature-canvas
```

---

# Optional Future Features

* Guest photo capture
* QR visitor badge
* Check-in / Check-out tracking
* Export to Excel
* Firebase cloud storage
* Admin login authentication
* Analytics dashboard

---

✅ If you want, I can also help you build:

* **Full React Native project structure**
* **Working Guest Form with Signature**
* **AsyncStorage save/load logic**
* **Admin purpose manager**
* **Modern UI design**

Just say **“build the full React Native starter app”** and I’ll generate it for you.
