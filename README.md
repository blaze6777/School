# Lincoln Elementary School Simulator

A GitHub Pages-ready K–6 school management simulator built with plain HTML, CSS, and JavaScript.

## Included systems

- Clickable K–6 school floor plan
- Three permanent classrooms per grade, even when a room is vacant
- Student census cohorts that move up one grade every school year
- Sixth graders exit to middle school and a new kindergarten census enters
- Individual generated students and classroom rosters
- IEP / 504 indicators and attendance rates
- Teacher age and years of experience
- Teacher degrees and licensure
- Teacher probationary/professional contracts
- Teacher salary schedule with BA, MA, and MA+30 lanes and experience steps
- District-wide salary increase proposals
- Principal and assistant principal staffing
- Office and student-services staff
- Special education teachers and paras
- Instructional assistants
- Library, PE, music, and art teachers
- Custodial staff
- Cafeteria staff
- Technology staff
- Staff evaluations
- Staff transfers and room reassignments
- Maternity/paternity, FMLA, medical, military, and long-term leave
- Employee resignations and retirements
- Career history for employees
- School board agenda, votes, support level, and financial decisions
- Operating budget and payroll by employee category
- Save/load game progress in browser localStorage
- Automatic save when advancing the school year

## Run locally

Open `index.html` directly, or use VS Code + Live Server.

## Publish with GitHub Pages

1. Create a GitHub repository.
2. Upload `index.html`, `styles.css`, and `app.js` to the repository root.
3. Commit the files.
4. Go to **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select `main` and `/ (root)`.
7. Save.

The simulator uses no external libraries or server. Saved games are stored in the browser that is playing the game.

## Important save note

Because this version uses browser `localStorage`, progress stays on the same browser/device. Clearing browser site data will erase the local save. A future version could add downloadable save files or a cloud/database login.
