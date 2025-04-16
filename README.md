# Baby Land Employee Attendance System

This system consists of two separate applications:

1. **Employee Portal**: Where employees log in and check in using a passcode
2. **Passcode Generator**: A display-only application that shows the current valid passcode

## Important Deployment Instructions

### Employee Portal
- Deploy this application publicly so employees can access it from anywhere
- Employees will need to create an account or log in to access the check-in system
- After logging in, employees must enter the current passcode to check in

### Passcode Generator
- **IMPORTANT**: This application should ONLY be deployed on a device physically located at your workplace
- Set up the Passcode Generator on a tablet, computer, or display that is visible to employees at the workplace
- The passcode refreshes every 20 seconds
- Employees must be physically present at the workplace to see the current passcode

This setup ensures that employees can only check in when they are physically present at the workplace, as they need to see the current passcode displayed on the Passcode Generator.

## How to Run the System

1. **Start the Employee Portal:**
   \`\`\`
   cd baby-land-attendance-portal
   npm install
   npm run dev
   \`\`\`

2. **Start the Passcode Generator (on a device at your workplace):**
   \`\`\`
   cd passcode-generator
   npm install
   npm run dev -- -p 3001
   \`\`\`

3. Access the Employee Portal at http://localhost:3000
4. Display the Passcode Generator at http://localhost:3001 on a screen at your workplace

## How It Works

1. Employees create an account or log in through the Employee Portal
2. They must be physically present at the workplace to see the current passcode on the Passcode Generator display
3. They enter the passcode in the Employee Portal
4. If valid, they can check in and their attendance is recorded

The passcode is generated every 20 seconds and is validated through an API call between the two websites.
