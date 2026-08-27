const grades = ["K", "1", "2", "3", "4", "5", "6"];
const targets = { K: 20, 1: 22, 2: 22, 3: 24, 4: 24, 5: 26, 6: 26 };

const classroomTeacherSeed = [
  ["Mrs. Johnson","K","101",32,8,51200],
  ["Mrs. Moore","K","102",39,15,57700],
  ["Mrs. Davis","K","103",27,4,49300],
  ["Mrs. King","1","104",45,21,63100],
  ["Mrs. Foster","1","105",34,10,54800],
  ["Mrs. White","1","106",29,6,50500],
  ["Mr. Chen","2","107",35,11,56800],
  ["Mrs. Evans","2","108",44,20,60900],
  ["Mrs. Hall","2","109",31,7,53200],
  ["Mr. Clark","3","110",46,22,62500],
  ["Mrs. Green","3","111",33,9,55200],
  ["Mrs. Martinez","3","112",30,6,52100],
  ["Mr. Wright","4","113",52,28,64300],
  ["Mrs. Young","4","114",37,13,57500],
  ["Mrs. Thompson","5","116",41,17,59600],
  ["Mr. Parker","5","117",28,5,50100],
  ["Mr. Mitchell","6","119",43,19,61200],
  ["Mrs. Campbell","6","120",38,14,58300]
];

const specialsSeed = [
  ["Ms. Rivera","Library","LIB",36,12,56500],
  ["Mr. Davis","PE","GYM",42,18,60200],
  ["Ms. Lewis","Music","MUSIC",31,7,53800],
  ["Mrs. Grant","Art","ART",47,23,62400]
];

const state = {
  year: 2026,
  budget: 2412850,
  selectedRoom: null,
  selectedTeacher: null,
  nextId: 50,
  enrollment: { K: 53, 1: 62, 2: 61, 3: 63, 4: 43, 5: 49, 6: 47 },
  projected: {},
  teachers: [],
  rooms: []
};

classroomTeacherSeed.forEach((x, i) => {
  state.teachers.push({
    id: i + 1,
    name: x[0],
    type: "classroom",
    grade: x[1],
    room: x[2],
    age: x[3],
    experience: x[4],
    salary: x[5],
    skill: 78 + ((i * 3) % 14),
    morale: 84 + ((i * 2) % 10),
    evaluation: null
  });
});

specialsSeed.forEach((x, i) => {
  state.teachers.push({
    id: classroomTeacherSeed.length + i + 1,
    name: x[0],
    type: "special",
    grade: x[1],
    room: x[2],
    age: x[3],
    experience: x[4],
    salary: x[5],
    skill: 82 + i * 2,
    morale: 88,
    evaluation: null
  });
});

// Three permanent classrooms per grade.
let roomNumber = 101;
grades.forEach((grade) => {
  for (let i = 0; i < 3; i++) {
    state.rooms.push({
      id: String(roomNumber++),
      grade,
      capacity:
        grade === "K" ? 20 :
        ["1","2"].includes(grade) ? 22 :
        ["3","4"].includes(grade) ? 24 : 26
    });
  }
});

const supportRooms = [
  ["NURSE","Nurse","Nurse Taylor","🩺"],
  ["COUNSEL","Counselor","Ms. Brown","👥"],
  ["PSYCH","Psychologist","Dr. Lee","🧠"],
  ["OFFICE","Main Office","Mrs. Anderson","💻"],
  ["PRIN","Principal","Mr. Williams","⭐"],
  ["CONF","Conference Room","","👥"]
];

const specialRooms = ["LIB","GYM","MUSIC","ART"];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function classTeachers() {
  return state.teachers.filter(t => t.type === "classroom");
}

function need(grade) {
  return Math.ceil(state.enrollment[grade] / targets[grade]);
}

function assigned(grade) {
  return classTeachers().filter(t => t.grade === grade).length;
}

function totalEnrollment() {
  return grades.reduce((sum, grade) => sum + state.enrollment[grade], 0);
}

function projectedTotal() {
  return grades.reduce((sum, grade) => sum + state.projected[grade], 0);
}

function payroll() {
  return state.teachers.reduce((sum, t) => sum + t.salary, 0);
}

function setMessage(html) {
  document.getElementById("message").innerHTML = html;
}

function projectNextYear() {
  state.projected = {
    K: rand(45, 75),
    1: state.enrollment.K,
    2: state.enrollment["1"],
    3: state.enrollment["2"],
    4: state.enrollment["3"],
    5: state.enrollment["4"],
    6: state.enrollment["5"]
  };
}

projectNextYear();

function classLoad(room) {
  const teachers = classTeachers().filter(t => t.grade === room.grade && t.room);
  const index = teachers.findIndex(t => t.room === room.id);

  if (index < 0) return 0;

  const base = Math.floor(state.enrollment[room.grade] / teachers.length);
  const remainder = state.enrollment[room.grade] % teachers.length;
  return base + (index < remainder ? 1 : 0);
}

function roomClass(grade) {
  return grade === "K" ? "k" : `g${grade}`;
}

function createRoomButton(room) {
  const teacher = state.teachers.find(t => t.room === room.id);
  const load = classLoad(room);

  let status = "⚪";
  if (teacher) {
    if (load > room.capacity) status = "🔴";
    else if (assigned(room.grade) < need(room.grade)) status = "🟠";
    else status = "🟢";
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = `room ${roomClass(room.grade)} ${state.selectedRoom === room.id ? "selected" : ""}`;

  button.innerHTML = `
    <strong>Room ${room.id}</strong>
    <span>Grade ${room.grade}</span>
    <span>${teacher ? teacher.name : "Vacant"}</span>
    <strong>${load} / ${room.capacity}</strong>
    <span>${status}</span>
  `;

  button.addEventListener("click", () => assignOrSelectClassroom(room));
  return button;
}

function renderRooms() {
  grades.forEach(grade => {
    const container = document.getElementById(`wing${grade}`);
    container.innerHTML = "";
    state.rooms
      .filter(r => r.grade === grade)
      .forEach(room => container.appendChild(createRoomButton(room)));
  });

  const supportGrid = document.getElementById("supportGrid");
  supportGrid.innerHTML = "";

  supportRooms.forEach(s => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "room support";
    button.innerHTML = `<strong>${s[1]}</strong><span>${s[2]}</span><div class="icon">${s[3]}</div>`;
    button.addEventListener("click", () => {
      state.selectedRoom = s[0];
      renderRoomPanel();
    });
    supportGrid.appendChild(button);
  });

  [
    ["libTeacher","LIB"],
    ["gymTeacher","GYM"],
    ["musicTeacher","MUSIC"],
    ["artTeacher","ART"]
  ].forEach(([elementId, roomId]) => {
    const teacher = state.teachers.find(t => t.room === roomId);
    document.getElementById(elementId).textContent = teacher ? teacher.name : "Vacant";
  });

  document.querySelectorAll("[data-room]").forEach(button => {
    button.addEventListener("click", () => assignSpecialOrSelect(button.dataset.room));
  });
}

function assignOrSelectClassroom(room) {
  const teacher = state.teachers.find(t => t.id === state.selectedTeacher);

  if (teacher) {
    if (teacher.type !== "classroom") {
      setMessage(`<strong>Invalid assignment:</strong> ${teacher.name} is a specials teacher.`);
      return;
    }

    const occupant = state.teachers.find(t => t.room === room.id);
    if (occupant && occupant.id !== teacher.id) {
      setMessage(`<strong>Room occupied:</strong> Room ${room.id} already has ${occupant.name}.`);
      return;
    }

    const oldGrade = teacher.grade;
    teacher.grade = room.grade;
    teacher.room = room.id;
    teacher.morale = clamp(teacher.morale - 2, 0, 100);
    state.selectedRoom = room.id;

    setMessage(`<strong>Teacher moved:</strong> ${teacher.name} moved from Grade ${oldGrade} to Grade ${room.grade}, Room ${room.id}.`);
    renderAll();
    return;
  }

  state.selectedRoom = room.id;
  renderAll();
}

function assignSpecialOrSelect(roomId) {
  const teacher = state.teachers.find(t => t.id === state.selectedTeacher);

  if (teacher) {
    if (teacher.type !== "special") {
      if (roomId !== "CAF") {
        setMessage(`<strong>Invalid assignment:</strong> Classroom teachers cannot be assigned to specials rooms.`);
      }
      return;
    }

    if (roomId === "CAF") {
      setMessage(`<strong>Not a teaching assignment:</strong> Cafeteria does not use a specials teacher.`);
      return;
    }

    const occupant = state.teachers.find(t => t.room === roomId);
    if (occupant && occupant.id !== teacher.id) {
      setMessage(`<strong>Room occupied:</strong> ${occupant.name} is already assigned there.`);
      return;
    }

    teacher.room = roomId;
    teacher.grade =
      roomId === "LIB" ? "Library" :
      roomId === "GYM" ? "PE" :
      roomId === "MUSIC" ? "Music" : "Art";

    state.selectedRoom = roomId;
    setMessage(`<strong>Specials assignment changed:</strong> ${teacher.name} is now assigned to ${teacher.grade}.`);
    renderAll();
    return;
  }

  state.selectedRoom = roomId;
  renderRoomPanel();
}

function renderRoomPanel() {
  const panel = document.getElementById("roomPanel");
  const room = state.rooms.find(r => r.id === state.selectedRoom);

  if (room) {
    const teacher = state.teachers.find(t => t.room === room.id);
    const load = classLoad(room);

    panel.innerHTML = `
      <h3>Room ${room.id} — Grade ${room.grade}</h3>
      <p>Teacher: <strong>${teacher ? teacher.name : "Vacant"}</strong></p>
      <p>Students: <strong>${load} / ${room.capacity}</strong></p>
      <p>Capacity: ${room.capacity}</p>
      ${
        teacher
          ? `<hr>
             <p><strong>Age:</strong> ${teacher.age}</p>
             <p><strong>Experience:</strong> ${teacher.experience} years</p>
             <p><strong>Salary:</strong> $${teacher.salary.toLocaleString()}</p>
             <p><strong>Performance:</strong> ${teacher.skill}%</p>
             <p><strong>Morale:</strong> ${teacher.morale}%</p>`
          : `<p><em>This classroom is held open for future enrollment growth.</em></p>`
      }
    `;
    return;
  }

  const support = supportRooms.find(s => s[0] === state.selectedRoom);
  if (support) {
    panel.innerHTML = `
      <h3>${support[1]}</h3>
      <p>Assigned: <strong>${support[2] || "Unassigned"}</strong></p>
      <div class="icon">${support[3]}</div>
    `;
    return;
  }

  const roomNames = {
    LIB: "Library / Media Center",
    GYM: "Gymnasium",
    MUSIC: "Music Room",
    ART: "Art Room",
    CAF: "Cafeteria"
  };

  if (roomNames[state.selectedRoom]) {
    const teacher = state.teachers.find(t => t.room === state.selectedRoom);
    panel.innerHTML = `
      <h3>${roomNames[state.selectedRoom]}</h3>
      <p>Teacher: <strong>${teacher ? teacher.name : "Vacant"}</strong></p>
      ${
        teacher
          ? `<p><strong>Age:</strong> ${teacher.age}</p>
             <p><strong>Experience:</strong> ${teacher.experience} years</p>
             <p><strong>Salary:</strong> $${teacher.salary.toLocaleString()}</p>`
          : ""
      }
    `;
    return;
  }

  panel.textContent = "Click a room on the floor plan.";
}

function renderMetrics() {
  const totalNeeded = grades.reduce((sum, g) => sum + need(g), 0);
  const alerts = grades.filter(g => assigned(g) !== need(g)).length;

  document.getElementById("mYear").textContent = `${state.year}–${state.year + 1}`;
  document.getElementById("mEnroll").textContent = `${totalEnrollment()} Students`;
  document.getElementById("mProjected").textContent = `Next year: ${projectedTotal()}`;
  document.getElementById("mTeachers").textContent = `${classTeachers().length} Teachers`;
  document.getElementById("mNeeded").textContent = `Needed: ${totalNeeded}`;
  document.getElementById("mBudget").textContent = `$${state.budget.toLocaleString()}`;
  document.getElementById("mRemaining").textContent = `Payroll: $${payroll().toLocaleString()}`;
  document.getElementById("mClass").textContent = (totalEnrollment() / Math.max(classTeachers().length, 1)).toFixed(1);
  document.getElementById("mOpen").textContent = state.rooms.filter(r => !state.teachers.some(t => t.room === r.id)).length;
  document.getElementById("mAlerts").textContent = alerts;

  const salaryPct = Math.min(78, Math.round((payroll() / state.budget) * 100));
  document.getElementById("salaryBar").style.width = `${salaryPct}%`;
  document.getElementById("salaryPct").textContent = `${salaryPct}%`;
}

function renderSummaries() {
  const staff = document.getElementById("staffSummary");
  const projection = document.getElementById("projectionSummary");
  staff.innerHTML = "";
  projection.innerHTML = "";

  grades.forEach(g => {
    const staffingBox = document.createElement("div");
    staffingBox.innerHTML = `
      <strong>${g}</strong>
      <div>${assigned(g) === need(g) ? "🟢" : assigned(g) < need(g) ? "🟠" : "🔵"}</div>
      <strong>${assigned(g)} / ${need(g)}</strong>
    `;
    staff.appendChild(staffingBox);

    const diff = state.projected[g] - state.enrollment[g];
    const projectionBox = document.createElement("div");
    projectionBox.innerHTML = `
      <strong>${g}</strong>
      <div>${state.projected[g]}</div>
      <span>${diff >= 0 ? "+" : ""}${diff}</span>
    `;
    projection.appendChild(projectionBox);
  });
}

function renderTeacherSelect() {
  const select = document.getElementById("teacherSelect");
  select.innerHTML = `<option value="">-- Select a Teacher --</option>`;

  state.teachers.forEach(t => {
    const option = document.createElement("option");
    option.value = t.id;
    option.textContent = `${t.name} — ${t.type === "classroom" ? `Grade ${t.grade}` : t.grade} · Age ${t.age} · ${t.experience} yrs exp.`;
    select.appendChild(option);
  });

  select.value = state.selectedTeacher || "";
}

function salaryTableHtml() {
  return `
    <h2>Teacher Salaries & Experience</h2>
    <div style="overflow-x:auto">
      <table class="data-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Assignment</th>
            <th>Room</th>
            <th>Age</th>
            <th>Experience</th>
            <th>Salary</th>
            <th>Performance</th>
          </tr>
        </thead>
        <tbody>
          ${state.teachers.map(t => `
            <tr>
              <td>${t.name}</td>
              <td>${t.type === "classroom" ? `Grade ${t.grade}` : t.grade}</td>
              <td>${t.room || "Unassigned"}</td>
              <td>${t.age}</td>
              <td>${t.experience} yrs</td>
              <td>$${t.salary.toLocaleString()}</td>
              <td>${t.skill}%</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function censusHtml() {
  return `
    <h2>Census Cohort Movement</h2>
    ${grades.map(g => `
      <div class="report-row">
        <strong>Grade ${g}</strong>
        <span>Current: ${state.enrollment[g]}</span>
        <span>Next Year: ${state.projected[g]}</span>
        <span>Teachers Needed: ${Math.ceil(state.projected[g] / targets[g])}</span>
        <span>${g === "K" ? "New kindergarten census" : g === "1" ? "Current K moves here" : `Current Grade ${Number(g)-1} moves here`}</span>
      </div>
    `).join("")}
  `;
}

function showSecondary(html) {
  document.getElementById("overviewTab").classList.add("hidden");
  document.getElementById("secondaryTab").classList.remove("hidden");
  document.getElementById("secondaryContent").innerHTML = html;
}

function showOverview() {
  document.getElementById("secondaryTab").classList.add("hidden");
  document.getElementById("overviewTab").classList.remove("hidden");
}

function hireClassroomTeacher() {
  const names = ["Ms. Carter","Mr. Lopez","Mrs. Bennett","Ms. Adams","Mr. Thompson","Ms. Wilson"];
  const grade = grades.find(g => assigned(g) < need(g)) || grades[rand(0, 6)];
  const openRoom = state.rooms.find(r => r.grade === grade && !state.teachers.some(t => t.room === r.id));

  const age = rand(23, 48);
  const experience = Math.max(1, age - rand(22, 25));
  const salary = rand(49, 66) * 1000;
  const name = names[rand(0, names.length - 1)];

  state.teachers.push({
    id: state.nextId++,
    name,
    type: "classroom",
    grade,
    room: openRoom ? openRoom.id : null,
    age,
    experience,
    salary,
    skill: rand(72, 92),
    morale: 90,
    evaluation: null
  });

  state.budget -= salary;
  setMessage(`<strong>Classroom teacher hired:</strong> ${name} for Grade ${grade}.`);
  renderAll();
}

function hireSpecialsTeacher() {
  const openings = specialRooms.filter(room => !state.teachers.some(t => t.room === room));

  if (!openings.length) {
    setMessage(`<strong>Specials fully staffed.</strong> Library, PE, Music, and Art all have teachers.`);
    return;
  }

  const room = openings[0];
  const role =
    room === "LIB" ? "Library" :
    room === "GYM" ? "PE" :
    room === "MUSIC" ? "Music" : "Art";

  const namePools = {
    Library: ["Ms. Collins","Mr. Harris"],
    PE: ["Coach Morgan","Mr. Lewis"],
    Music: ["Ms. Reed","Mrs. Taylor"],
    Art: ["Ms. Parker","Mr. Evans"]
  };

  const age = rand(24, 51);
  const experience = Math.max(1, age - rand(22, 25));
  const salary = rand(50, 64) * 1000;
  const name = namePools[role][rand(0, 1)];

  state.teachers.push({
    id: state.nextId++,
    name,
    type: "special",
    grade: role,
    room,
    age,
    experience,
    salary,
    skill: rand(74, 92),
    morale: 90,
    evaluation: null
  });

  state.budget -= salary;
  setMessage(`<strong>Specials teacher hired:</strong> ${name} — ${role}.`);
  renderAll();
}

function evaluateSelectedTeacher() {
  const teacher = state.teachers.find(t => t.id === state.selectedTeacher);

  if (!teacher) {
    setMessage(`<strong>Evaluation:</strong> Select a teacher first.`);
    return;
  }

  const score = clamp(
    Math.round(teacher.skill * .8 + teacher.morale * .2 + rand(-4, 4)),
    1,
    100
  );

  teacher.evaluation =
    score >= 90 ? "Highly Effective" :
    score >= 75 ? "Effective" :
    score >= 60 ? "Needs Improvement" : "Ineffective";

  setMessage(`<strong>Evaluation complete:</strong> ${teacher.name} scored ${score}% — ${teacher.evaluation}.`);
}

function advanceYear() {
  const old = { ...state.enrollment };
  const graduatingSixth = old["6"];

  state.year++;

  // Cohorts actually move forward one grade.
  state.enrollment = {
    K: state.projected.K,
    1: old.K,
    2: old["1"],
    3: old["2"],
    4: old["3"],
    5: old["4"],
    6: old["5"]
  };

  const retirements = [];

  state.teachers.forEach(t => {
    t.age++;
    t.experience++;
    t.salary = Math.round((t.salary * 1.025) / 100) * 100;
    t.morale = clamp(t.morale + rand(-3, 3), 45, 100);

    const retirementChance =
      t.age >= 67 ? 60 :
      t.age >= 63 ? 30 :
      t.age >= 60 ? 12 : 0;

    if (rand(1,100) <= retirementChance) {
      retirements.push(t);
    }
  });

  retirements.forEach(t => {
    state.teachers = state.teachers.filter(x => x.id !== t.id);
  });

  projectNextYear();
  state.budget += rand(180, 300) * 1000;
  state.selectedTeacher = null;
  state.selectedRoom = null;

  const shortages = grades.filter(g => assigned(g) < need(g));
  const excess = grades.filter(g => assigned(g) > need(g));

  let message = `<strong>New school year:</strong> ${graduatingSixth} sixth graders moved to middle school. Student cohorts advanced one grade and ${state.enrollment.K} new kindergarten students entered.`;

  if (retirements.length) {
    message += ` Retirements: ${retirements.map(t => `${t.name} (age ${t.age})`).join(", ")}.`;
  }
  if (shortages.length) {
    message += ` Shortages: Grade ${shortages.join(", ")}.`;
  }
  if (excess.length) {
    message += ` Excess staffing: Grade ${excess.join(", ")}.`;
  }

  setMessage(message);
  renderAll();
}

function renderAll() {
  renderMetrics();
  renderRooms();
  renderRoomPanel();
  renderSummaries();
  renderTeacherSelect();
}

document.getElementById("teacherSelect").addEventListener("change", e => {
  state.selectedTeacher = e.target.value ? Number(e.target.value) : null;

  const teacher = state.teachers.find(t => t.id === state.selectedTeacher);
  if (teacher) {
    setMessage(`<strong>${teacher.name} selected.</strong> Age ${teacher.age}, ${teacher.experience} years experience.`);
  }
});

document.getElementById("clearTeacher").addEventListener("click", () => {
  state.selectedTeacher = null;
  renderTeacherSelect();
  setMessage(`<strong>Teacher selection cleared.</strong>`);
});

document.getElementById("hireClassroom").addEventListener("click", hireClassroomTeacher);
document.getElementById("hireSpecial").addEventListener("click", hireSpecialsTeacher);
document.getElementById("doEval").addEventListener("click", evaluateSelectedTeacher);

document.getElementById("showSalary").addEventListener("click", () => {
  showSecondary(salaryTableHtml());
});

document.getElementById("showCensus").addEventListener("click", () => {
  showSecondary(censusHtml());
});

document.getElementById("backOverview").addEventListener("click", showOverview);

document.querySelectorAll(".tab").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
    button.classList.add("active");

    const tab = button.dataset.tab;

    if (tab === "overview") {
      showOverview();
    } else if (tab === "staff") {
      showSecondary(salaryTableHtml());
    } else if (tab === "budget") {
      showSecondary(`
        <h2>Budget</h2>
        <p>Total Budget: <strong>$${state.budget.toLocaleString()}</strong></p>
        <p>Total Payroll: <strong>$${payroll().toLocaleString()}</strong></p>
        <p>Remaining After Payroll: <strong>$${Math.max(0, state.budget - payroll()).toLocaleString()}</strong></p>
      `);
    } else if (tab === "reports") {
      showSecondary(censusHtml());
    }
  });
});

document.getElementById("advanceYearTop").addEventListener("click", advanceYear);

renderAll();
