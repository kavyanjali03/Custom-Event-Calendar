# Custom-Event-Calendar


### **Features Implemented:**

1. **Monthly View Calendar:**
    - Display a traditional monthly calendar view.
    - Highlight the current day.
    - Allow users to navigate between months.
2. **Event Management:**
    - **Add Event:**
        - Users should be able to add events by clicking on a specific day.
        - The event form should include the following fields:
            - Event Title
            - Date and Time (with time picker)
            - Description
            - Recurrence options (e.g., Daily, Weekly, Monthly, Custom)
            - Event color or category (optional)
    - **Edit Event:**
        - Users should be able to click on an event to open the edit form.
        - Allow users to update any of the event details.
    - **Delete Event:**
        - Provide an option to delete events, either from the calendar view or from the event details form.
3. **Recurring Events:**
    - Implement support for recurring events with the following recurrence options:
        - **Daily**: Repeat every day.
        - **Weekly**: Repeat on selected days of the week.
        - **Monthly**: Repeat on a specific day each month (e.g., the 15th).
        - **Custom**: Allow users to set a custom recurrence pattern (e.g., every 2 weeks).
    - Ensure that recurring events are displayed correctly across all relevant days.
4. **Drag-and-Drop Rescheduling:**
    - Implement a drag-and-drop interface that allows users to reschedule events by dragging them to a different day on the calendar.
    - Handle edge cases such as dragging an event to a day that already has another event or conflicts with a recurring event.
5. **Event Conflict Management:**
    - Implement logic to handle event conflicts (e.g., overlapping events on the same day at the same time).
    - Display warnings or prevent users from creating conflicting events.
6. **Event Filtering and Searching (Optional):**
    - Allow users to filter events by category or search for events by title or description.
    - Implement a search bar that dynamically filters events as the user types.
7. **Event Persistence:**
    - Implement data persistence using local storage or a mock backend (e.g., using an in-browser database like IndexedDB).
    - Ensure that events remain saved even after the user refreshes the page or navigates away and returns later.
8. **Responsive Design (Optional):**
    - Ensure the calendar is responsive and works well on different screen sizes, including mobile devices.
    - Adapt the calendar layout to fit smaller screens, possibly switching to a weekly or daily view.

9. **Additional:** :  ** Additional features like event filtering, a weekly view.** 


##  ** How to setup and Run** 
- clone the repo in your VS code or any other.
- In the terminal run these commands

npm install  ( for node modules)

** For tailwind**
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

npm install react react-dom
npm install --save-dev @vitejs/plugin-react  (package installation for vite react)
npm install --save-dev typescript @types/react @types/react-dom ( for typescript)

to run,
npm run dev




