# **App Name**: ShiftSync Pro

## Core Features:

- User Authentication: Secure user authentication with role-based access control (Doctor/Clinical Coordinator). Doctors log in via a dropdown of names, while Coordinators log in via a hardcoded PIN.
- Weekly Schedule Display: Display a table showing all shifts for the week, broken down into Morning, Afternoon, and Night shifts.
- Shift Sign-Up/Withdrawal: Allow doctors to sign up for available shifts or withdraw from shifts they are already assigned to.
- Real-time Roster Updates: Utilize Firestore's real-time capabilities to reflect changes to the roster instantly across all users' screens.
- Admin Panel: A protected admin panel allows the clinical coordinator to add/remove doctors and reset the schedule. Use generative AI to analyze and suggest shifts for doctors who are currently under-scheduled. Use an AI tool to find patterns of low shift sign ups to flag potential schedule shortages
- Data Initialization: If the roster or doctor list doesn't exist upon deployment, they're seeded with default values to allow the application to be quickly deployable
- PIN Confirmation: Allow protected access to Admin Functions to authorized personel only, which will be tracked in firestore.

## Style Guidelines:

- Primary color: Muted blue (#6699CC) for a professional and calm feel, appropriate for a healthcare setting.
- Background color: Very light grey (#F0F0F0) for a clean and modern look.
- Accent color: Soft green (#99CC66) to highlight interactive elements and important information, analogous to the blue and creating a sense of growth and health.
- Body and headline font: 'PT Sans', a modern and warm sans-serif font for readability.
- Use simple, clear icons for shift types (e.g., sun for day, moon for night) and admin functions.
- Maintain a clean and organized layout with clear visual hierarchy. Use cards for login and admin sections.
- Subtle transitions and animations for signing up/withdrawing from shifts to provide visual feedback.