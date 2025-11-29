# CEBU EASTERN COLLEGE - STUDENT POLICY AGREEMENT FORM

## Overview

A professional, responsive static website for the Cebu Eastern College, Inc. College of Information Technology Student Policy Agreement Form. This form allows students to read and digitally acknowledge the college's policies regarding computer laboratory use, classroom conduct, and academic integrity.

### Key Features

✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices  
✅ **Professional Layout** - Clean, institutional-grade appearance with clear visual hierarchy  
✅ **9 Policy Sections** - All sections from the official policy agreement  
✅ **Checkbox Verification** - Students must check each section before submission  
✅ **Form Validation** - Ensures all required information is provided  
✅ **Auto-save** - Form data automatically saved to browser's local storage  
✅ **Google Sheets Integration** - Submissions stored in Google Sheets via Apps Script  
✅ **Unique Reference IDs** - Each submission gets a unique ID for tracking  
✅ **Mobile Optimized** - Touch-friendly interface for all devices  
✅ **Bootstrap 5 Framework** - Built-in responsive grid system and components  

---

## Project Structure

```
policy-agreement/
├── index.html              # Main HTML form
├── styles.css              # CSS styling (Bootstrap + Custom)
├── app.js                  # JavaScript form logic (compiled)
├── app.ts                  # TypeScript source (optional)
├── AppsScript.gs           # Google Apps Script backend
├── README.md               # This file
└── setup-guide.md          # Detailed setup instructions
```

---

## Quick Start

### 1. Download and Open

```bash
# Clone or download the repository
cd policy-agreement
```

### 2. Open in Browser

Simply open `index.html` in any modern web browser. The form works immediately for testing and local submissions.

### 3. Optional: Set Up Google Sheets Backend

To store submissions in Google Sheets, follow the **Google Apps Script Setup** section below.

---

## Google Apps Script Setup (Backend)

This section explains how to connect the form to Google Sheets for persistent data storage.

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "Policy Agreement Submissions"
3. Copy the **Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit
   ```

### Step 2: Set Up Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Copy the entire contents of `AppsScript.gs` into the editor
4. Replace `YOUR_SHEET_ID_HERE` with your actual Sheet ID from Step 1
5. Save the project

### Step 3: Deploy the Apps Script

1. Click **"Deploy"** in the top-right corner
2. Select **"New Deployment"**
3. Choose **Type: "Web app"**
4. Fill in the fields:
   - **Execute as**: Select your account
   - **Who has access**: "Anyone"
5. Click **"Deploy"**
6. You'll see a deployment URL like:
   ```
   https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercallback
   ```
7. Copy this URL

### Step 4: Update the Form

1. Open `app.js` in a text editor
2. Find this line (around line 116):
   ```javascript
   const APPS_SCRIPT_URL = "https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercallback";
   ```
3. Replace `{DEPLOYMENT_ID}` with your actual deployment ID
4. Save the file

### Step 5: Verify Google Sheet Columns

The Google Sheet should automatically create a header row with these columns:

| A | B | C | D | E | F | G | H-P |
|---|---|---|---|---|---|---|-----|
| Timestamp | Student Name | Course/Year | Student ID | Contact # | Email | All Sections Agreed | Section 1-9 Checkboxes |

---

## Form Features

### Policy Sections

The form includes all 9 sections:

1. **General Conduct Policy** - Basic behavior expectations
2. **Computer Laboratory Rules** - Equipment use and restrictions
3. **Classroom Policies** - Attendance and academic honesty
4. **Data Management Policy** - File storage and backup
5. **Attendance, Tardiness & Exams** - Participation requirements
6. **Sanctions for Violations** - Disciplinary measures
7. **Liability for Laboratory Damages** - Financial responsibility
8. **Technology Ethics & Cyber Policy** - System usage rules
9. **Agreement & Acknowledgement** - Final commitment

### Student Information Collection

Each submission captures:
- Full Name
- Course and Year Level
- Student ID Number
- Contact Number
- Email Address
- Checkbox status for each policy section
- Submission timestamp

### Local Storage

Form data is automatically saved to the browser's local storage, allowing users to:
- Resume filling out the form if they close the browser
- See previously entered data when returning
- Have a backup even if Google Sheets connection fails

---

## Styling & Responsiveness

### Design Principles

- **Color Scheme**: Blue and professional institutional colors
- **Typography**: Clear, readable sans-serif fonts
- **Spacing**: Generous padding for easy reading on all devices
- **Accessibility**: High contrast ratios, keyboard navigation support

### Breakpoints

- **Desktop** (≥768px): Full layout with side-by-side buttons
- **Tablet** (600-767px): Optimized layout with stacked elements
- **Mobile** (<600px): Single-column layout, touch-friendly elements

### CSS Features

- Bootstrap 5 grid system
- Custom CSS animations (slide-in effects)
- Print-friendly styles
- Dark mode consideration (uses system preferences)

---

## Browser Support

✅ Chrome/Chromium (latest)  
✅ Firefox (latest)  
✅ Safari (latest)  
✅ Edge (latest)  
✅ Mobile Safari (iOS 14+)  
✅ Chrome Android (latest)  

---

## Form Validation

### Client-Side Validation

1. **Checkbox Validation**: All 9 policy sections must be checked
2. **Text Field Validation**:
   - Student Name: Required
   - Student ID: Required
   - Contact Number: Required format
   - Email: Valid email format
3. **Error Feedback**: Clear, user-friendly error messages
4. **Visual Indicators**: Red borders on invalid fields

### Server-Side Validation

The Google Apps Script validates:
- Required fields are present
- Data types are correct
- No SQL injection or malicious content

---

## File Descriptions

### index.html
Main HTML file containing:
- Semantic HTML structure
- Bootstrap 5 CSS framework CDN
- Font Awesome icons
- All 9 policy sections
- Student information form
- Success/error modals
- Links to external assets

### styles.css
Comprehensive styling with:
- CSS variables for theming
- Global styles and resets
- Component-specific styles (header, sections, form, etc.)
- Responsive breakpoints for all screen sizes
- Print styles
- Animations and transitions
- Accessibility features (focus states)

### app.js / app.ts
JavaScript/TypeScript application logic:
- Form validation
- Event listeners (change, submit, reset)
- Data collection and formatting
- Google Sheets API integration
- Local storage management
- Success/error handling
- Reference ID generation
- Modal management

### AppsScript.gs
Google Apps Script backend:
- POST handler for form submissions
- Data writing to Google Sheets
- Header row creation and formatting
- Error handling and logging
- Optional: Email notifications
- Optional: Analytics functions
- Test function for verification

### README.md (this file)
- Project overview
- Setup instructions
- Feature documentation
- API reference
- Troubleshooting guide

---

## Troubleshooting

### Form submissions appear in browser but not in Google Sheets

1. **Check deployment URL**:
   - Verify the URL in `app.js` matches your deployment
   - Re-deploy the Apps Script if needed

2. **Check Google Sheet**:
   - Confirm the sheet exists and is accessible
   - Verify the SHEET_ID in AppsScript.gs is correct

3. **Check browser console**:
   - Open Developer Tools (F12)
   - Check Console tab for error messages
   - Look for network requests to the Apps Script URL

### Form data not persisting after browser close

- Local storage might be disabled
- Private/Incognito browsing may not support local storage
- Browser storage limit may be exceeded (unlikely for this form)

### Email validation errors

- Ensure email format is correct: `user@domain.com`
- The form won't submit without valid email

### Modal not showing after submission

- Check that Bootstrap 5 JS bundle is loading (network tab in Dev Tools)
- Verify no JavaScript errors in console

### Mobile display issues

- Force browser refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser zoom level (should be 100%)
- Ensure viewport meta tag is present in HTML

---

## Deployment to GitHub Pages

To host this form on GitHub Pages:

1. **Create GitHub Repository**:
   ```bash
   # Initialize git
   git init
   git add .
   git commit -m "Initial commit: Policy Agreement Form"
   ```

2. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/policy-agreement.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/root" folder
   - Save

4. **Access your form**:
   ```
   https://YOUR_USERNAME.github.io/policy-agreement/
   ```

---

## Customization

### Change Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --primary-color: #0056b3;        /* Change to your color */
    --success-color: #28a745;        /* Change to your color */
    --danger-color: #dc3545;         /* Change to your color */
    /* ... other variables ... */
}
```

### Add/Remove Policy Sections

1. Open `index.html`
2. Find the `<section class="policy-section">` tags
3. Add or remove sections as needed
4. Update the section numbering in headers
5. Update Google Apps Script columns if needed

### Change Institutional Information

Find and replace in `index.html`:
- "CEBU EASTERN COLLEGE, INC."
- "College of Information Technology"
- "(Computer Laboratory, Classroom Policies, Sanctions & Liability for Damages)"

### Modify Form Fields

1. Open `index.html`
2. Locate the "STUDENT INFORMATION" section
3. Add/remove form fields as needed
4. Update TypeScript/JavaScript to collect new fields

---

## Security Considerations

### Data Privacy

- Form submissions are sent to your Google Sheet
- Only users with access to your Google Sheet can view submissions
- Consider enabling Google Sheet access restrictions

### Input Validation

- All inputs are validated both client-side and server-side
- HTML sanitization prevents XSS attacks
- No SQL injection risk (Google Sheets API)

### HTTPS

- Ensure deployment URL uses HTTPS for security
- GitHub Pages automatically provides HTTPS
- Google Apps Script deployments include HTTPS

---

## Performance

### Page Load Time

- Minimal dependencies (Bootstrap CDN, Font Awesome CDN)
- CSS animations use GPU acceleration
- JavaScript is non-blocking (async loading)
- Typical load time: < 2 seconds

### Form Submission

- Data validation happens client-side first
- Submissions use fetch API (efficient)
- Backup local storage ensures no data loss

---

## Version History

### Version 1.0 (Current)
- Initial release
- 9 policy sections
- Full responsiveness
- Google Sheets integration
- Local storage auto-save

---

## Support & Contributions

For issues or suggestions:

1. Check the **Troubleshooting** section above
2. Review browser console for error messages
3. Verify all setup steps were followed correctly

---

## License

This project is created for Cebu Eastern College, Inc. College of Information Technology.

---

## Contact

For technical support or questions:
- Email: [Your IT Department Email]
- Phone: [Your IT Department Phone]

---

**Last Updated**: November 26, 2024  
**Version**: 1.0  
**Status**: Production Ready ✓
