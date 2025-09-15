# User Profile API Guide

This document explains how to view, update, and manage your user profile via the API.

## Endpoints

All endpoints below require authentication.

### 1. Get Profile

Retrieve your user profile information.

- **Endpoint:** `GET /api/profile`
- **Authentication:** Required

#### Response Example

```json
{
  "name": "Alice Crypto",
  "email": "alice@example.com"
}
```

---

### 2. Edit Profile

Update your profile information.

- **Endpoint:** `PATCH /api/profile`
- **Body fields:**
  - `name` (string, required) – Your full name.
  - `email` (string, required) – Your email address (must be valid).

#### Request Example

```json
{
  "name": "Alice Crypto",
  "email": "alice@newdomain.com"
}
```

- If you change your email, you’ll receive a new verification email.
- The `email` field is required.
- If the email is already used by another account, you’ll get an error.

#### Possible Responses

- `200 OK` — Profile updated.
- `400 Bad Request` — Missing required fields or duplicate email.
- `500 Internal Server Error` — Something went wrong.

---

### 3. Change Password

Change your account password.

- **Endpoint:** `PATCH /api/profile/password`
- **Body fields:**
  - `oldPassword` (string, required) – Your current password.
  - `newPassword` (string, required) – Your new password.

#### Password Requirements

- Minimum 8 characters.
- At least one uppercase letter, one lowercase letter, one number, and one special character.

#### Request Example

```json
{
  "oldPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

#### Possible Responses

- `200 OK` — Password changed.
- `400 Bad Request` — Passwords missing, same as old password, or new password doesn’t meet requirements.
- `500 Internal Server Error` — Something went wrong.

---

## Error Handling

Errors return a JSON body with an `error` or `message` field describing the problem.

#### Example

```json
{
  "error": "New password must be different"
}
```

---

## Notes

- **Email verification:** Changing your email will trigger a new verification email.
- **Authentication:** These endpoints require the user to be logged in and supply a valid token.

---

For more details on authentication, see the project’s [authentication guide](../auth.md) (if available).