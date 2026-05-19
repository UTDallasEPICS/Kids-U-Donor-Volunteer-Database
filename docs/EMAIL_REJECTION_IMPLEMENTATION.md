# Email Rejection Implementation Guide

## Overview
Email rejection functionality has been implemented for volunteer applications in the admin account system. When admins approve or reject applications, the applicants automatically receive professional notification emails.

## Features Implemented

### 1. **Approval Email**
When an admin **accepts** a volunteer application:
- Applicant receives a professional "Welcome" email
- Email includes congratulations message
- Provides next steps for the volunteer
- Includes link to volunteer dashboard
- Professional styling with Kids-U branding

### 2. **Rejection Email**
When an admin **rejects** a volunteer application:
- Applicant receives a professional rejection email
- Admin can provide an optional rejection reason
- Email includes reason (if provided)
- Offers encouragement for future applications
- Option to reapply in the future
- Professional styling with Kids-U branding

### 3. **Admin UI Improvements**
- **Modal Dialog** for rejection reason input
- **Optional rejection reason** field - admins can explain why the application was rejected
- **User feedback** - confirmation alerts when emails are sent
- **Better UX** - reason modal appears when clicking reject button

## Files Modified

### 1. `/app/utils/email.ts`
**New Functions Added:**
- `sendApplicationRejectionEmail(to, firstName, rejectionReason?)`
- `sendApplicationApprovalEmail(to, firstName)`

**Purpose:** Handle professional email templating for approvals and rejections

### 2. `/app/api/admin/volunteer/application/[id]/patch/route.ts`
**Changes:**
- Imports email utility
- Fetches applicant details before updating
- Sends approval email upon application approval
- Extracts first name from legal name
- Includes error handling for email failures (doesn't break the application process)
- Returns success message confirming email was sent

### 3. `/app/api/admin/volunteer/application/[id]/delete/route.ts`
**Changes:**
- Imports email utility
- Accepts optional rejection reason from request body
- Sends rejection email with optional reason
- Includes error handling for email failures
- Returns success message confirming email was sent

### 4. `/app/(pages)/admin/volunteer/application/page.tsx`
**Changes:**
- Added state management for rejection modal
- `showRejectModal` - controls modal visibility
- `rejectingId` - tracks which application is being rejected
- `rejectionReason` - stores the admin's rejection reason
- `openRejectModal(id)` - opens the reason entry modal
- `confirmReject()` - submits rejection with reason
- Added rejection reason modal component with textarea
- Added success alerts after approval/rejection
- Improved button styling with hover effects

## How to Use (Admin)

### Approving an Application
1. Navigate to **Admin > Volunteer Applications**
2. Find the pending application
3. Click the **"Accept"** button
4. Application status changes to **APPROVED**
5. ✅ Approval email is automatically sent to applicant
6. Success message confirms email was sent

### Rejecting an Application
1. Navigate to **Admin > Volunteer Applications**
2. Find the pending application
3. Click the **"Reject"** button
4. A modal dialog appears asking for rejection reason
5. **(Optional)** Enter a reason in the text area
   - Examples: "Doesn't meet requirements", "Background check concerns", "No availability match", etc.
6. Click **"Confirm Rejection"**
7. Application status changes to **REJECTED**
8. ✅ Rejection email is automatically sent to applicant with your reason
9. Success message confirms email was sent

## Email Configuration

The email system uses your existing SMTP configuration from environment variables:

```
SMTP_HOST=your-smtp-host
SMTP_PORT=your-smtp-port
SMTP_SECURE=true/false
SMTP_USER=your-email
SMTP_PASS=your-password
SMTP_FROM_NAME=Kids-U
SMTP_FROM_EMAIL=your-from-email
NEXT_PUBLIC_APP_URL=http://localhost:3001  (or your production URL)
```

Make sure these are properly configured in your `.env` file.

## API Details

### Approval Endpoint
- **Path:** `/api/admin/volunteer/application/[id]/patch`
- **Method:** PATCH
- **Request Body:** 
  ```json
  {
    "data": {
      "accepted": true
    }
  }
  ```
- **Response:**
  ```json
  {
    "message": "Updated registration... Approval email sent.",
    "data": { /* application data */ },
    "emailSent": true
  }
  ```

### Rejection Endpoint
- **Path:** `/api/admin/volunteer/application/[id]/delete`
- **Method:** PATCH
- **Request Body:**
  ```json
  {
    "rejectionReason": "Optional reason text here"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Volunteer application with ID [id] rejected successfully. Rejection email sent.",
    "data": { /* application data */ },
    "emailSent": true
  }
  ```

## Error Handling

- **Email failures don't block application processing** - If an email fails to send, the application is still updated (approved/rejected) and the admin is still notified of success
- **Errors are logged** - Any email errors are logged to console for debugging
- **Graceful degradation** - The system continues to work even if email service is temporarily down

## Security Considerations

1. **No sensitive data in emails** - Emails don't include passwords or sensitive information
2. **Proper from address** - Uses configured SMTP from address
3. **HTML sanitization** - Template content is properly escaped
4. **Optional rejection reason** - Admins control what information to share

## Testing Recommendations

1. **Test with approval:**
   - Approve an application
   - Verify applicant receives welcome email
   - Check email formatting and links

2. **Test with rejection (no reason):**
   - Reject an application without providing reason
   - Verify applicant receives rejection email
   - Check email is professional

3. **Test with rejection (with reason):**
   - Reject an application with detailed reason
   - Verify reason appears in applicant's email
   - Check formatting of reason text

4. **Test with invalid emails:**
   - Try with invalid applicant email
   - Verify system handles error gracefully

## Future Enhancements

Potential improvements to consider:
- [ ] Email templates customizable in admin panel
- [ ] Email preview before sending
- [ ] Resend email option for sent applications
- [ ] Email history/log for audit trail
- [ ] Template variables (application date, etc.)
- [ ] Multiple rejection reason presets
- [ ] CC admin/manager on emails
- [ ] Batch approval/rejection with individual reasons
- [ ] Scheduled batch emails

## Troubleshooting

### Emails not sending
- Check SMTP configuration in `.env`
- Verify email credentials are correct
- Check firewall/network allows SMTP connection
- Look for errors in console logs

### Applicant not receiving email
- Check email address in application is correct
- Verify email isn't going to spam folder
- Check SMTP provider's email delivery logs

### Wrong "From" address
- Update `SMTP_FROM_EMAIL` and `SMTP_FROM_NAME` in `.env`
- Restart application
- Test again

## Related Documentation

- [Email Utility Documentation](./EMAIL_SETUP.md)
- [Admin Account Features](./ADMIN_FEATURES.md)
- [Volunteer Application Workflow](./VOLUNTEER_WORKFLOW.md)
