const GRADES = ["K","1","2","3","4","5","6"];
const TARGETS = {K:20,1:22,2:22,3:24,4:24,5:26,6:26};
const SAVE_KEY = "lincolnElementarySimulatorSaveV2";

const salarySchedule = {
  BA: [48000,49500,51000,52500,54000,55500,57000,58500,60000,61500,63000,64500,66000,67500,69000,70500,72000,73500,75000,76500,78000,79500,81000,82500,84000,85500,87000,88500,90000,91500,93000],
  MA: [51500,53000,54500,56000,57500,59000,60500,62000,63500,65000,66500,68000,69500,71000,72500,74000,75500,77000,78500,80000,81500,83000,84500,86000,87500,89000,90500,92000,93500,95000,96500],
  MA30:[54500,56000,57500,59000,60500,62000,63500,65000,66500,68000,69500,71000,72500,74000,75500,77000,78500,80000,81500,83000,84500,86000,87500,89000,90500,92000,93500,95000,96500,98000,99500]
};

const firstNames = ["Ava","Liam","Olivia","Noah","Emma","Elijah","Sophia","James","Isabella","Lucas","Mia","Henry","Amelia","Benjamin","Harper","Theodore","Evelyn","Mateo","Charlotte","Jack","Luna","Levi","Sofia","Alexander","Camila","Daniel","Aria","Michael","Scarlett","Mason","Ella","Ethan","Avery","Logan","Mila","Owen","Gianna","Samuel","Layla","Sebastian","Nora","Aiden","Hazel","John","Lily","Joseph","Ellie","Wyatt","Violet","David"];
const lastNames = ["Smith","Johnson","Brown","Taylor","Anderson","Thomas","Jackson","White","Harris","Martin","Thompson","Garcia","Martinez","Robinson","Clark","Rodriguez","Lewis","Lee","Walker","Hall","Allen","Young","King","Wright","Scott","Green","Baker","Adams","Nelson","Carter","Mitchell","Perez","Roberts","Turner"];
const employeeNames = ["Alicia Carter","Miguel Lopez","Rachel Bennett","Dana Adams","Chris Thompson","Jenna Wilson","Marcus Reed","Tara Collins","Steven Harris","Natalie Morgan","Paula Taylor","Eric Evans","Monica Parker","Aaron Lewis"];

function teacher(id,name,grade,room,age,exp,degree,license,contract,skill=82,morale=88){
  const lane = degree === "MA+30" ? "MA30" : degree === "MA" ? "MA" : "BA";
  return {id,name,category:"Teacher",position:`Grade ${grade} Teacher`,assignment:`Grade ${grade}`,grade,room,age,experience:exp,degree,license,contract,salary:salaryFor(lane,exp),skill,morale,status:"Active",leave:null,evaluation:null,history:[`Hired as Grade ${grade} Teacher`],yearsInDistrict:Math.min(exp, Math.max(1, exp-1))};
}
function staff(id,name,category,position,assignment,age,exp,degree,license,contract,salary,room=null){
  return {id,name,category,position,assignment,grade:null,room,age,experience:exp,degree,license,contract,salary,skill:80+((id*3)%12),morale:82+((id*2)%12),status:"Active",leave:null,evaluation:null,history:[`Hired as ${position}`],yearsInDistrict:Math.min(exp,Math.max(1,exp-1))};
}
function salaryFor(lane,exp){const s=salarySchedule[lane]||salarySchedule.BA;return s[Math.min(exp,s.length-1)];}

function initialState(){
  const employees = [
    teacher(1,"Mrs. Johnson","K","101",32,8,"MA","Elementary K-6","Professional",84,91),
    teacher(2,"Mrs. Moore","K","102",39,15,"MA","Elementary K-6","Professional",87,88),
    teacher(3,"Mrs. Davis","K","103",27,4,"BA","Elementary K-6","Probationary",77,93),
    teacher(4,"Mrs. King","1","104",45,21,"MA+30","Elementary K-6","Professional",90,84),
    teacher(5,"Mrs. Foster","1","105",34,10,"MA","Elementary K-6","Professional",83,90),
    teacher(6,"Mrs. White","1","106",29,6,"BA","Elementary K-6","Professional",80,87),
    teacher(7,"Mr. Chen","2","107",35,11,"MA","Elementary K-6","Professional",91,92),
    teacher(8,"Mrs. Evans","2","108",44,20,"MA+30","Elementary K-6","Professional",86,85),
    teacher(9,"Mrs. Hall","2","109",31,7,"BA","Elementary K-6","Professional",81,89),
    teacher(10,"Mr. Clark","3","110",46,22,"MA","Elementary K-6","Professional",89,81),
    teacher(11,"Mrs. Green","3","111",33,9,"MA","Elementary K-6","Professional",84,88),
    teacher(12,"Mrs. Martinez","3","112",30,6,"BA","Elementary K-6","Professional",82,93),
    teacher(13,"Mr. Wright","4","113",52,28,"MA+30","Elementary K-6","Professional",88,79),
    teacher(14,"Mrs. Young","4","114",37,13,"MA","Elementary K-6","Professional",85,88),
    teacher(15,"Mrs. Thompson","5","116",41,17,"MA","Elementary K-6","Professional",86,86),
    teacher(16,"Mr. Parker","5","117",28,5,"BA","Elementary K-6","Probationary",79,94),
    teacher(17,"Mr. Mitchell","6","119",43,19,"MA","Elementary K-6","Professional",86,84),
    teacher(18,"Mrs. Campbell","6","120",38,14,"MA","Elementary K-6","Professional",85,89),
    staff(19,"Mr. Williams","Administration","Principal","Main Office",48,24,"MA+30","Building Administrator","Administrative",98000,"PRIN"),
    staff(20,"Ms. Grant","Administration","Assistant Principal","Main Office",39,15,"MA","Building Administrator","Administrative",82000,"OFFICE"),
    staff(21,"Mrs. Anderson","Office","School Secretary","Main Office",56,30,"BA","N/A","Classified",47500,"OFFICE"),
    staff(22,"Nurse Taylor","Student Services","School Nurse","Health Office",42,16,"BA","RN","Professional",65000,"NURSE"),
    staff(23,"Ms. Brown","Student Services","School Counselor","Counseling",37,12,"MA","School Counselor","Professional",67000,"COUNSEL"),
    staff(24,"Dr. Lee","Student Services","School Psychologist","Psychology",45,18,"MA+30","School Psychologist","Professional",79000,"PSYCH"),
    staff(25,"Ms. Rivera","Specials","Library / Media Teacher","Library",36,12,"MA","School Library","Professional",salaryFor("MA",12),"LIB"),
    staff(26,"Mr. Davis","Specials","PE Teacher","Physical Education",42,18,"MA","Physical Education","Professional",salaryFor("MA",18),"GYM"),
    staff(27,"Ms. Lewis","Specials","Music Teacher","Music",31,7,"BA","Music Education","Professional",salaryFor("BA",7),"MUSIC"),
    staff(28,"Mrs. Grant","Specials","Art Teacher","Art",47,23,"MA","Visual Arts","Professional",salaryFor("MA",23),"ART"),
    staff(29,"Ms. Flores","Special Education","Special Education Teacher","Resource Room",35,10,"MA","Mild Intervention K-6","Professional",64000,"SPED"),
    staff(30,"Mr. Bryant","Special Education","Special Education Teacher","Resource Room",29,5,"BA","Mild Intervention K-6","Probationary",54500,"SPED"),
    staff(31,"Mrs. Webb","Instructional Support","Instructional Assistant","Kindergarten",52,18,"HS","N/A","Classified",32500,"101"),
    staff(32,"Ms. Diaz","Instructional Support","Special Education Para","Resource Room",26,4,"AA","Paraeducator","Classified",33800,"SPED"),
    staff(33,"Mr. Nelson","Operations","Head Custodian","Building Operations",50,22,"HS","N/A","Classified",46500,"CUST"),
    staff(34,"Ms. Price","Operations","Custodian","Building Operations",38,10,"HS","N/A","Classified",39200,"CUST"),
    staff(35,"Mrs. Baker","Cafeteria","Cafeteria Manager","Cafeteria",46,17,"HS","Food Safety","Classified",42000,"CAF"),
    staff(36,"Mr. Scott","Cafeteria","Cafeteria Assistant","Cafeteria",34,8,"HS","Food Safety","Classified",31500,"CAF"),
    staff(37,"Ms. Kim","Technology","School Technology Specialist","Technology",33,9,"BA","CompTIA A+","Professional",61000,"TECH")
  ];

  const rooms=[]; let num=101;
  GRADES.forEach(g=>{for(let i=0;i<3;i++){rooms.push({id:String(num++),grade:g,capacity:g==="K"?20:["1","2"].includes(g)?22:["3","4"].includes(g)?24:26});}});
  const state={year:2026,budget:4250000,selectedRoom:null,selectedEmployee:null,nextEmployeeId:100,nextStudentId:1000,enrollment:{K:53,1:62,2:61,3:63,4:43,5:49,6:47},projected:{},employees,rooms,students:[],boardRelationship:72,boardIssues:[],boardHistory:[],hrEvents:["New school year staffing plan opened."],events:["Aug 12 — Teacher Work Day","Aug 13 — First Student Day","Sep 7 — No School"],districtRaise:0,lastSaved:null};
  generateStudentsForState(state);
  projectNext(state);
  generateBoardIssue(state,true);
  return state;
}

let state = initialState();

function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
function money(v){return "$"+Math.round(v).toLocaleString();}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function activeEmployees(){return state.employees.filter(e=>e.status!=="Resigned"&&e.status!=="Retired"&&e.status!=="Terminated");}
function classroomTeachers(){return activeEmployees().filter(e=>e.category==="Teacher");}
function teacherNeed(g){return Math.ceil(state.enrollment[g]/TARGETS[g]);}
function teachersAssigned(g){return classroomTeachers().filter(e=>e.grade===g && !e.leave).length;}
function payroll(){return activeEmployees().reduce((s,e)=>s+e.salary,0);}
function totalEnrollment(){return state.students.filter(s=>s.status==="Active").length;}
function projectedTotal(){return GRADES.reduce((s,g)=>s+state.projected[g],0);}
function currentTeacherInRoom(room){return classroomTeachers().find(e=>e.room===room.id && !e.leave);}
function roomRoster(roomId){return state.students.filter(s=>s.status==="Active"&&s.room===roomId);}
function classLoad(room){return roomRoster(room.id).length;}
function setMessage(html){document.getElementById("messageBar").innerHTML=html;}
function logHr(text){state.hrEvents.unshift(`${state.year}: ${text}`);state.hrEvents=state.hrEvents.slice(0,20);}

function projectNext(s=state){s.projected={K:rand(45,75),1:s.enrollment.K,2:s.enrollment["1"],3:s.enrollment["2"],4:s.enrollment["3"],5:s.enrollment["4"],6:s.enrollment["5"]};}

function generateStudentsForState(s){
  s.students=[];
  GRADES.forEach(g=>{
    for(let i=0;i<s.enrollment[g];i++) s.students.push(makeStudent(s,g));
  });
  assignStudentsToRooms(s);
}
function makeStudent(s,grade){
  const id=s.nextStudentId++;
  return {id,name:`${firstNames[rand(0,firstNames.length-1)]} ${lastNames[rand(0,lastNames.length-1)]}`,grade,room:null,iep:rand(1,100)<=12,plan504:rand(1,100)<=6,attendance:rand(91,100),status:"Active",history:[`${s.year}: Enrolled in Grade ${grade}`]};
}
function assignStudentsToRooms(s=state){
  GRADES.forEach(g=>{
    const teachers=s.employees.filter(e=>e.category==="Teacher"&&e.grade===g&&e.status==="Active"&&!e.leave&&e.room);
    const rooms=teachers.map(t=>t.room);
    const kids=s.students.filter(st=>st.status==="Active"&&st.grade===g);
    kids.forEach((kid,i)=>kid.room=rooms.length?rooms[i%rooms.length]:null);
  });
}
function syncEnrollmentFromStudents(){GRADES.forEach(g=>state.enrollment[g]=state.students.filter(s=>s.status==="Active"&&s.grade===g).length);}

function renderAll(){renderMetrics();renderFloor();renderRoomDetails();renderAssignSelect();renderSummaries();renderEvents();renderStaffView();renderStudentsView();renderHrView();renderBudgetView();renderBoardView();}

function renderMetrics(){
  const needed=GRADES.reduce((s,g)=>s+teacherNeed(g),0);
  const alerts=GRADES.filter(g=>teachersAssigned(g)!==teacherNeed(g)).length + activeEmployees().filter(e=>e.leave).length + state.employees.filter(e=>e.status==="Resigned").length;
  document.getElementById("metricYear").textContent=`${state.year}–${state.year+1}`;
  document.getElementById("metricEnrollment").textContent=`${totalEnrollment()} Students`;
  document.getElementById("metricEnrollmentNext").textContent=`Projected ${projectedTotal()}`;
  document.getElementById("metricStaff").textContent=`${activeEmployees().length}`;
  document.getElementById("metricOpenings").textContent=`${Math.max(0,needed-classroomTeachers().filter(e=>!e.leave).length)} teacher openings`;
  document.getElementById("metricBudget").textContent=money(state.budget);
  document.getElementById("metricPayroll").textContent=`Payroll ${money(payroll())}`;
  document.getElementById("metricClassSize").textContent=(totalEnrollment()/Math.max(1,classroomTeachers().filter(e=>!e.leave).length)).toFixed(1);
  document.getElementById("metricRooms").textContent=state.rooms.filter(r=>!currentTeacherInRoom(r)).length;
  document.getElementById("metricAlerts").textContent=alerts;
}
function roomClass(g){return g==="K"?"k":`g${g}`;}
function renderFloor(){
  GRADES.forEach(g=>{
    const box=document.getElementById(`wing${g}`);box.innerHTML="";
    state.rooms.filter(r=>r.grade===g).forEach(r=>{
      const t=currentTeacherInRoom(r), load=classLoad(r); const btn=document.createElement("button");btn.type="button";btn.className=`room ${roomClass(g)} ${state.selectedRoom===r.id?"selected":""}`;
      const status=!t?"⚪":load>r.capacity?"🔴":teachersAssigned(g)<teacherNeed(g)?"🟠":"🟢";
      btn.innerHTML=`<strong>Room ${r.id}</strong><span>Grade ${g}</span><span>${t?t.name:"Vacant"}</span><strong>${load} / ${r.capacity}</strong><span>${status}</span>`;
      btn.addEventListener("click",()=>assignOrSelectClassroom(r));box.appendChild(btn);
    });
  });
  const support=[
    ["NURSE","Nurse","🩺"],["COUNSEL","Counselor","👥"],["PSYCH","Psychologist","🧠"],["OFFICE","Main Office","💻"],["PRIN","Principal","⭐"],["SPED","Special Education","🧩"],["CUST","Custodial","🧹"],["TECH","Technology","💻"]
  ];
  const sg=document.getElementById("supportRooms");sg.innerHTML="";
  support.forEach(([id,label,icon])=>{const btn=document.createElement("button");btn.type="button";btn.className="room support";const assigned=activeEmployees().filter(e=>e.room===id).map(e=>e.name).slice(0,2).join(", ")||"Vacant";btn.innerHTML=`<strong>${label}</strong><span>${assigned}</span><div class="icon">${icon}</div>`;btn.addEventListener("click",()=>assignOrSelectSupport(id,label));sg.appendChild(btn);});
  [["LIB","Library"],["GYM","PE"],["MUSIC","Music"],["ART","Art"],["CAF","Cafeteria"]].forEach(([id])=>{const el=document.getElementById(`label-${id}`);if(el){const names=activeEmployees().filter(e=>e.room===id).map(e=>e.name).join(", ");el.textContent=names||"Vacant";}});
}
function assignOrSelectClassroom(room){
  const emp=activeEmployees().find(e=>e.id===state.selectedEmployee);
  if(emp){
    if(emp.category!=="Teacher" && emp.category!=="Instructional Support"){setMessage(`<strong>Invalid assignment:</strong> ${emp.position} cannot be assigned as a classroom teacher.`);return;}
    if(emp.category==="Teacher"){
      const occ=currentTeacherInRoom(room); if(occ&&occ.id!==emp.id){setMessage(`<strong>Room occupied:</strong> ${occ.name} already has Room ${room.id}.`);return;}
      const old=emp.assignment; emp.grade=room.grade; emp.assignment=`Grade ${room.grade}`; emp.room=room.id; emp.morale=clamp(emp.morale-2,0,100);emp.history.push(`${state.year}: Transferred from ${old} to Grade ${room.grade}, Room ${room.id}`);logHr(`${emp.name} transferred to Grade ${room.grade}, Room ${room.id}.`);
    } else {emp.assignment=`Grade ${room.grade} Support`;emp.room=room.id;emp.history.push(`${state.year}: Assigned to Room ${room.id}`);}
    state.selectedRoom=room.id;assignStudentsToRooms();renderAll();setMessage(`<strong>Assignment updated:</strong> ${emp.name} → Room ${room.id}.`);return;
  }
  state.selectedRoom=room.id;renderFloor();renderRoomDetails();
}
function assignOrSelectSupport(roomId,label){
  const emp=activeEmployees().find(e=>e.id===state.selectedEmployee);
  if(emp){emp.room=roomId;emp.assignment=label;emp.history.push(`${state.year}: Assigned to ${label}`);logHr(`${emp.name} reassigned to ${label}.`);state.selectedRoom=roomId;renderAll();setMessage(`<strong>Assignment updated:</strong> ${emp.name} → ${label}.`);return;}
  state.selectedRoom=roomId;renderRoomDetails();
}
function handleSpecialClick(roomId){
  const label={LIB:"Library",GYM:"Physical Education",MUSIC:"Music",ART:"Art",CAF:"Cafeteria"}[roomId];
  assignOrSelectSupport(roomId,label);
}

function renderRoomDetails(){
  const box=document.getElementById("roomDetails"), r=state.rooms.find(x=>x.id===state.selectedRoom);
  if(r){const t=currentTeacherInRoom(r), roster=roomRoster(r.id);box.innerHTML=`<h3>Room ${r.id} — Grade ${r.grade}</h3><p>Teacher: <strong>${t?t.name:"Vacant"}</strong></p><p>Students: <strong>${roster.length} / ${r.capacity}</strong></p>${t?employeeMini(t):"<p><em>Held open for future enrollment growth.</em></p>"}<button class="secondary full" id="roomRosterBtn">View ${roster.length} Students</button>`;document.getElementById("roomRosterBtn").addEventListener("click",()=>openRoster(r.id));return;}
  const roomId=state.selectedRoom;if(roomId){const staffHere=activeEmployees().filter(e=>e.room===roomId);box.innerHTML=`<h3>${roomName(roomId)}</h3>${staffHere.length?staffHere.map(employeeMini).join("<hr>"):"<p>Vacant / no assigned staff.</p>"}`;return;}
  box.textContent="Click a classroom or special area.";
}
function employeeMini(e){return `<div class="compact-item"><strong>${e.name}</strong><br>${e.position}<br>Age ${e.age} · ${e.experience} yrs experience<br>${e.degree} · ${e.license}<br>${e.contract} · ${money(e.salary)}${e.leave?`<br><span class="badge warn">On ${e.leave.type}</span>`:""}</div>`;}
function roomName(id){return {LIB:"Library / Media",GYM:"Gym / PE",MUSIC:"Music",ART:"Art",CAF:"Cafeteria",NURSE:"Nurse",COUNSEL:"Counseling",PSYCH:"Psychology",OFFICE:"Main Office",PRIN:"Principal Office",SPED:"Special Education",CUST:"Custodial",TECH:"Technology"}[id]||id;}
function renderAssignSelect(){const sel=document.getElementById("assignStaffSelect");sel.innerHTML='<option value="">-- Select Employee --</option>';activeEmployees().forEach(e=>{const o=document.createElement("option");o.value=e.id;o.textContent=`${e.name} — ${e.position} · Age ${e.age} · ${e.experience} yrs`;sel.appendChild(o);});sel.value=state.selectedEmployee||"";}
function renderSummaries(){
  const ss=document.getElementById("staffingSummary");ss.innerHTML="";GRADES.forEach(g=>{const d=document.createElement("div");d.innerHTML=`<strong>${g}</strong><span>${teachersAssigned(g)===teacherNeed(g)?"🟢":teachersAssigned(g)<teacherNeed(g)?"🟠":"🔵"}</span><strong>${teachersAssigned(g)}/${teacherNeed(g)}</strong>`;ss.appendChild(d);});
  const cs=document.getElementById("censusSummary");cs.innerHTML="";GRADES.forEach(g=>{const d=document.createElement("div"),diff=state.projected[g]-state.enrollment[g];d.innerHTML=`<strong>${g}</strong><span>${state.projected[g]}</span><strong>${diff>=0?"+":""}${diff}</strong>`;cs.appendChild(d);});
  const ls=document.getElementById("leaveSummary");const leaves=activeEmployees().filter(e=>e.leave);ls.innerHTML=leaves.length?leaves.map(e=>`<div class="compact-item"><strong>${e.name}</strong> — ${e.leave.type}<br>Returns ${e.leave.returnYear}</div>`).join(""):"<span class='muted'>No active leaves.</span>";
}
function renderEvents(){document.getElementById("eventList").innerHTML=state.events.map(x=>`<div class="compact-item">${x}</div>`).join("");}

function renderStaffView(){
  const categories=[...new Set(activeEmployees().map(e=>e.category))].sort();const f=document.getElementById("staffCategoryFilter");const current=f.value||"all";f.innerHTML='<option value="all">All Categories</option>'+categories.map(c=>`<option>${c}</option>`).join("");f.value=categories.includes(current)?current:"all";
  const q=document.getElementById("staffSearch").value.toLowerCase(), cat=f.value;const list=activeEmployees().filter(e=>(cat==="all"||e.category===cat)&&(!q||e.name.toLowerCase().includes(q)||e.position.toLowerCase().includes(q)));
  document.getElementById("staffTableBody").innerHTML=list.map(e=>`<tr data-employee="${e.id}"><td><button class="link-btn" data-open-employee="${e.id}">${e.name}</button></td><td>${e.position}</td><td>${e.assignment}</td><td>${e.age}</td><td>${e.experience} yrs</td><td>${e.degree}</td><td>${e.license}</td><td>${e.contract}</td><td>${money(e.salary)}</td><td>${employeeStatusBadge(e)}</td></tr>`).join("");
  document.querySelectorAll("[data-open-employee]").forEach(b=>b.addEventListener("click",()=>openEmployee(Number(b.dataset.openEmployee))));
}
function employeeStatusBadge(e){if(e.leave)return `<span class="badge warn">${e.leave.type}</span>`;return `<span class="badge good">${e.status}</span>`;}

function renderStudentsView(){
  const gf=document.getElementById("studentGradeFilter");if(gf.options.length===1)GRADES.forEach(g=>gf.add(new Option(`Grade ${g}`,g)));const rf=document.getElementById("studentRoomFilter");const old=rf.value;rf.innerHTML='<option value="all">All Rooms</option>'+state.rooms.map(r=>`<option value="${r.id}">Room ${r.id}</option>`).join("");rf.value=[...rf.options].some(o=>o.value===old)?old:"all";
  const grade=gf.value,room=rf.value,q=document.getElementById("studentSearch").value.toLowerCase();const list=state.students.filter(s=>s.status==="Active"&&(grade==="all"||s.grade===grade)&&(room==="all"||s.room===room)&&(!q||s.name.toLowerCase().includes(q)));
  document.getElementById("studentTableBody").innerHTML=list.slice(0,500).map(s=>{const t=activeEmployees().find(e=>e.room===s.room&&e.category==="Teacher");return `<tr><td>${s.name}</td><td>${s.grade}</td><td>${s.room||"Unassigned"}</td><td>${t?t.name:"—"}</td><td>${s.iep?"Yes":""}</td><td>${s.plan504?"Yes":""}</td><td>${s.attendance}%</td></tr>`;}).join("");
}

function renderHrView(){
  document.getElementById("salaryScheduleBody").innerHTML=[0,5,10,15,20,25,30].map(step=>`<tr><td>${step}</td><td>${money(salarySchedule.BA[step])}</td><td>${money(salarySchedule.MA[step])}</td><td>${money(salarySchedule.MA30[step])}</td></tr>`).join("");
  const probs=activeEmployees().filter(e=>e.contract==="Probationary").length,pro=activeEmployees().filter(e=>e.contract==="Professional").length,classified=activeEmployees().filter(e=>e.contract==="Classified").length;
  document.getElementById("contractSummary").innerHTML=statBox("Probationary",probs)+statBox("Professional",pro)+statBox("Classified",classified);
  const licenseIssues=activeEmployees().filter(e=>e.category==="Teacher"&&!e.license.includes("Elementary"));document.getElementById("licenseAlerts").innerHTML=licenseIssues.length?licenseIssues.map(e=>`<div class="compact-item danger">${e.name}: license mismatch</div>`).join(""):"<span class='muted'>No classroom licensure alerts.</span>";
  const leaves=activeEmployees().filter(e=>e.leave);document.getElementById("leaveTable").innerHTML=leaves.length?leaves.map(e=>`<div class="compact-item"><strong>${e.name}</strong> — ${e.leave.type}<br>${e.leave.reason} · return ${e.leave.returnYear}</div>`).join(""):"<span class='muted'>No employees currently on leave.</span>";
  document.getElementById("hrEvents").innerHTML=state.hrEvents.map(e=>`<div class="compact-item">${e}</div>`).join("");
}
function statBox(label,value){return `<div class="stat-box"><span>${label}</span><strong>${value}</strong></div>`;}

function renderBudgetView(){
  const p=payroll(), benefits=Math.round(p*.28), remaining=state.budget-p-benefits;document.getElementById("budgetCards").innerHTML=statBox("Budget",money(state.budget))+statBox("Payroll",money(p))+statBox("Benefits",money(benefits))+statBox("Other Available",money(Math.max(0,remaining)));
  document.getElementById("barPayroll").style.width=`${Math.min(75,Math.round(p/state.budget*100))}%`;
  const cats={};activeEmployees().forEach(e=>cats[e.category]=(cats[e.category]||0)+e.salary);document.getElementById("payrollByCategory").innerHTML=Object.entries(cats).sort((a,b)=>b[1]-a[1]).map(([c,v])=>`<div class="category-row"><span>${c}</span><strong>${money(v)}</strong></div>`).join("");
}

function renderBoardView(){
  document.getElementById("boardRelationship").innerHTML=`<div class="stat-box"><span>Board Support</span><strong>${state.boardRelationship}%</strong></div><p class="muted">Higher support improves the odds of approving your recommendations.</p>`;
  const area=document.getElementById("boardIssues");area.innerHTML=state.boardIssues.length?state.boardIssues.map(issue=>`<div class="board-issue"><h3>${issue.title}</h3><p>${issue.description}</p><p><strong>Financial impact:</strong> ${issue.cost>=0?money(issue.cost):"Saves "+money(Math.abs(issue.cost))}</p><div class="board-actions"><button class="secondary" data-board="recommend" data-id="${issue.id}">Recommend Approval</button><button class="secondary" data-board="oppose" data-id="${issue.id}">Recommend Denial</button></div></div>`).join(""):"<p class='muted'>No pending board issues.</p>";
  document.querySelectorAll("[data-board]").forEach(b=>b.addEventListener("click",()=>voteBoard(Number(b.dataset.id),b.dataset.board)));
  document.getElementById("boardHistory").innerHTML=state.boardHistory.length?state.boardHistory.slice(0,10).map(x=>`<div class="compact-item">${x}</div>`).join(""):"<span class='muted'>No board votes yet.</span>";
}
function generateBoardIssue(s=state,initial=false){
  const options=[
    {title:"Add a Special Education Para",description:"Approve one additional special education para to support increasing IEP needs.",cost:35500,effect:"para"},
    {title:"Technology Refresh",description:"Replace aging classroom laptops and interactive displays.",cost:85000,effect:"tech"},
    {title:"Add Assistant Custodian",description:"Increase evening custodial staffing and reduce deferred cleaning.",cost:41000,effect:"custodian"},
    {title:"Cut One Classroom Position",description:"Reduce payroll by eliminating one vacant or excess teaching position.",cost:-56000,effect:"cutTeacher"},
    {title:"2.5% Salary Increase",description:"Approve a district-wide 2.5% salary increase for all school employees.",cost:Math.round(s.employees.filter(e=>e.status!=="Resigned"&&e.status!=="Retired"&&e.status!=="Terminated").reduce((sum,e)=>sum+e.salary,0)*.025),effect:"raise",percent:2.5}
  ];
  const x={...options[rand(0,options.length-1)],id:Date.now()+rand(1,9999)};s.boardIssues.push(x);if(!initial)setMessage(`<strong>New board issue:</strong> ${x.title}`);
}
function voteBoard(id,recommendation){
  const issue=state.boardIssues.find(i=>i.id===id);
  if(!issue)return;
  let approvalChance = recommendation === "recommend" ? state.boardRelationship + 8 : 100 - state.boardRelationship - 5;
  if(issue.cost > 100000) approvalChance -= 8;
  const approved = rand(1,100) <= clamp(approvalChance,15,95);
  if(approved) applyBoardEffect(issue);
  const matchedYourAdvice = (recommendation === "recommend" && approved) || (recommendation === "oppose" && !approved);
  state.boardRelationship = clamp(state.boardRelationship + (matchedYourAdvice ? 3 : -4),25,95);
  state.boardHistory.unshift(`${state.year}: Board ${approved?"approved":"rejected"} ${issue.title}.`);
  state.boardIssues=state.boardIssues.filter(i=>i.id!==id);
  renderAll();
  setMessage(`<strong>Board vote:</strong> ${issue.title} was ${approved?"APPROVED":"REJECTED"}.`);
}
function applyBoardEffect(issue){
  if(issue.cost>0)state.budget-=issue.cost;else state.budget+=Math.abs(issue.cost);
  if(issue.effect==="raise")applyRaise(issue.percent||2.5);
  if(issue.effect==="para")hireGeneratedStaff("Instructional Support","Special Education Para","Special Education","AA","Paraeducator","Classified",35500,"SPED");
  if(issue.effect==="custodian")hireGeneratedStaff("Operations","Custodian","Building Operations","HS","N/A","Classified",41000,"CUST");
}
function applyRaise(percent){state.employees.forEach(e=>{if(e.status==="Active")e.salary=Math.round(e.salary*(1+percent/100));});state.districtRaise+=percent;logHr(`Board approved ${percent}% salary increase.`);}

function openEmployee(id){
  const e=state.employees.find(x=>x.id===id);if(!e)return;showModal(e.name,`<div class="stat-grid">${statBox("Age",e.age)}${statBox("Experience",e.experience+" yrs")}${statBox("Salary",money(e.salary))}</div><p><strong>${e.position}</strong> — ${e.assignment}</p><p>${e.degree} · ${e.license} · ${e.contract}</p><p>Performance ${e.skill}% · Morale ${e.morale}%</p><h3>Career History</h3><div class="compact-list">${e.history.slice().reverse().map(h=>`<div class="compact-item">${h}</div>`).join("")}</div><div class="modal-actions"><button class="secondary" id="modalEval">Evaluate</button><button class="secondary" id="modalLeave">Place on Leave</button><button class="secondary" id="modalTransfer">Transfer</button><button class="secondary danger" id="modalResign">Process Resignation</button></div>`);
  document.getElementById("modalEval").onclick=()=>{state.selectedEmployee=id;closeModal();evaluateSelected();};
  document.getElementById("modalLeave").onclick=()=>{state.selectedEmployee=id;closeModal();openLeaveModal();};
  document.getElementById("modalTransfer").onclick=()=>{state.selectedEmployee=id;closeModal();openTransferModal();};
  document.getElementById("modalResign").onclick=()=>{processResignation(e);closeModal();};
}

function openHireModal(preferTeacher=false){
  showModal("Hire Employee",`<form id="hireForm"><div class="form-grid"><label>Category<select id="hireCategory"><option>Teacher</option><option>Administration</option><option>Specials</option><option>Special Education</option><option>Instructional Support</option><option>Student Services</option><option>Office</option><option>Operations</option><option>Cafeteria</option><option>Technology</option></select></label><label>Position<input id="hirePosition" value="Grade K Teacher"></label><label>Assignment<input id="hireAssignment" value="Grade K"></label><label>Degree<select id="hireDegree"><option>BA</option><option>MA</option><option>MA+30</option><option>AA</option><option>HS</option></select></label><label>License<input id="hireLicense" value="Elementary K-6"></label><label>Contract<select id="hireContract"><option>Probationary</option><option>Professional</option><option>Classified</option><option>Administrative</option></select></label><label>Age<input id="hireAge" type="number" min="21" max="70" value="28"></label><label>Experience<input id="hireExp" type="number" min="0" max="45" value="5"></label><label>Grade<select id="hireGrade"><option>K</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option value="">N/A</option></select></label><label>Room<select id="hireRoom"><option value="">Unassigned</option>${state.rooms.map(r=>`<option value="${r.id}">Room ${r.id} — Grade ${r.grade}</option>`).join("")}<option value="LIB">Library</option><option value="GYM">Gym</option><option value="MUSIC">Music</option><option value="ART">Art</option><option value="SPED">Special Education</option><option value="OFFICE">Office</option><option value="PRIN">Principal</option><option value="NURSE">Nurse</option><option value="COUNSEL">Counselor</option><option value="PSYCH">Psychologist</option><option value="CUST">Custodial</option><option value="CAF">Cafeteria</option><option value="TECH">Technology</option></select></label></div><div class="modal-actions"><button class="secondary" type="submit">Hire Applicant</button></div></form>`);
  const cat=document.getElementById("hireCategory");if(!preferTeacher)cat.value="Operations";document.getElementById("hireForm").onsubmit=e=>{e.preventDefault();const category=cat.value,age=+document.getElementById("hireAge").value,exp=+document.getElementById("hireExp").value,degree=document.getElementById("hireDegree").value,grade=document.getElementById("hireGrade").value,contract=document.getElementById("hireContract").value,license=document.getElementById("hireLicense").value,room=document.getElementById("hireRoom").value||null,position=document.getElementById("hirePosition").value,assignment=document.getElementById("hireAssignment").value,name=employeeNames[rand(0,employeeNames.length-1)],lane=degree==="MA+30"?"MA30":degree==="MA"?"MA":"BA",salary=category==="Teacher"||category==="Specials"||category==="Special Education"?salaryFor(lane,exp):Math.max(30000,Math.round((38000+exp*1300+(degree==="BA"?5000:degree==="MA"?10000:0))/100)*100);state.employees.push({id:state.nextEmployeeId++,name,category,position,assignment,grade:category==="Teacher"?grade:null,room,age,experience:exp,degree,license,contract,salary,skill:rand(72,92),morale:90,status:"Active",leave:null,evaluation:null,history:[`${state.year}: Hired as ${position}`],yearsInDistrict:0});state.budget-=Math.round(salary*.08);logHr(`${name} hired as ${position}.`);assignStudentsToRooms();closeModal();renderAll();setMessage(`<strong>Hired:</strong> ${name} — ${position}, ${money(salary)}.`);};
}
function hireGeneratedStaff(category,position,assignment,degree,license,contract,salary,room){const name=employeeNames[rand(0,employeeNames.length-1)];state.employees.push({id:state.nextEmployeeId++,name,category,position,assignment,grade:null,room,age:rand(24,50),experience:rand(2,18),degree,license,contract,salary,skill:rand(75,90),morale:90,status:"Active",leave:null,evaluation:null,history:[`${state.year}: Hired as ${position}`],yearsInDistrict:0});logHr(`${name} hired as ${position}.`);}

function evaluateSelected(){const e=activeEmployees().find(x=>x.id===state.selectedEmployee);if(!e){setMessage("<strong>Evaluation:</strong> Select an employee first.");return;}const score=clamp(Math.round(e.skill*.75+e.morale*.25+rand(-5,5)),1,100);const rating=score>=90?"Highly Effective":score>=75?"Effective":score>=60?"Needs Improvement":"Ineffective";e.evaluation={year:state.year,score,rating};e.history.push(`${state.year}: Evaluation — ${rating} (${score}%)`);e.skill=clamp(e.skill+(score>=75?1:-1),45,100);logHr(`${e.name} evaluated ${rating} (${score}%).`);renderAll();setMessage(`<strong>Evaluation:</strong> ${e.name} — ${rating}, ${score}%.`);}

function openLeaveModal(){const e=activeEmployees().find(x=>x.id===state.selectedEmployee);if(!e){setMessage("Select an employee first.");return;}showModal(`Leave — ${e.name}`,`<form id="leaveForm"><div class="form-grid"><label>Leave Type<select id="leaveType"><option>Maternity/Paternity Leave</option><option>FMLA</option><option>Medical Leave</option><option>Military Leave</option><option>Long-Term Leave</option></select></label><label>Return School Year<input id="leaveReturn" type="number" min="${state.year}" max="${state.year+3}" value="${state.year+1}"></label><label style="grid-column:1/-1">Reason<input id="leaveReason" value="Approved leave"></label></div><div class="modal-actions"><button class="secondary" type="submit">Approve Leave</button></div></form>`);document.getElementById("leaveForm").onsubmit=ev=>{ev.preventDefault();e.leave={type:document.getElementById("leaveType").value,returnYear:+document.getElementById("leaveReturn").value,reason:document.getElementById("leaveReason").value};e.status="On Leave";e.history.push(`${state.year}: Began ${e.leave.type}`);logHr(`${e.name} began ${e.leave.type}.`);assignStudentsToRooms();closeModal();renderAll();setMessage(`<strong>Leave approved:</strong> ${e.name} — ${e.leave.type}.`);};}

function openTransferModal(){const e=activeEmployees().find(x=>x.id===state.selectedEmployee);if(!e){setMessage("Select an employee first.");return;}showModal(`Transfer — ${e.name}`,`<form id="transferForm"><div class="form-grid"><label>New Assignment<input id="transferAssignment" value="${e.assignment}"></label><label>New Room<select id="transferRoom"><option value="">Unassigned</option>${state.rooms.map(r=>`<option value="${r.id}">Room ${r.id} — Grade ${r.grade}</option>`).join("")}<option value="LIB">Library</option><option value="GYM">Gym</option><option value="MUSIC">Music</option><option value="ART">Art</option><option value="SPED">Special Education</option><option value="OFFICE">Office</option><option value="PRIN">Principal</option><option value="CUST">Custodial</option><option value="CAF">Cafeteria</option><option value="TECH">Technology</option></select></label>${e.category==="Teacher"?`<label>New Grade<select id="transferGrade">${GRADES.map(g=>`<option ${g===e.grade?"selected":""}>${g}</option>`).join("")}</select></label>`:""}</div><div class="modal-actions"><button class="secondary" type="submit">Complete Transfer</button></div></form>`);document.getElementById("transferRoom").value=e.room||"";document.getElementById("transferForm").onsubmit=ev=>{ev.preventDefault();const old=e.assignment;e.assignment=document.getElementById("transferAssignment").value;e.room=document.getElementById("transferRoom").value||null;if(e.category==="Teacher")e.grade=document.getElementById("transferGrade").value;e.morale=clamp(e.morale-2,0,100);e.history.push(`${state.year}: Transferred from ${old} to ${e.assignment}`);logHr(`${e.name} transferred to ${e.assignment}.`);assignStudentsToRooms();closeModal();renderAll();setMessage(`<strong>Transfer complete:</strong> ${e.name} → ${e.assignment}.`);};}
function processResignation(e){e.status="Resigned";e.room=null;e.history.push(`${state.year}: Resigned`);logHr(`${e.name} resigned.`);assignStudentsToRooms();renderAll();setMessage(`<strong>Resignation processed:</strong> ${e.name}.`);}

function openRoster(roomId){const r=state.rooms.find(x=>x.id===roomId);const students=roomRoster(roomId);const t=currentTeacherInRoom(r);showModal(`Room ${roomId} Roster`,`<p><strong>Grade ${r.grade}</strong> · ${t?t.name:"Vacant"} · ${students.length} students</p><div class="table-wrap"><table class="data-table"><thead><tr><th>Student</th><th>IEP</th><th>504</th><th>Attendance</th></tr></thead><tbody>${students.map(s=>`<tr><td>${s.name}</td><td>${s.iep?"Yes":""}</td><td>${s.plan504?"Yes":""}</td><td>${s.attendance}%</td></tr>`).join("")}</tbody></table></div>`);}

function addStudent(){showModal("Enroll New Student",`<form id="studentForm"><div class="form-grid"><label>Grade<select id="newStudentGrade">${GRADES.map(g=>`<option>${g}</option>`).join("")}</select></label><label>IEP<select id="newStudentIep"><option value="no">No</option><option value="yes">Yes</option></select></label></div><div class="modal-actions"><button class="secondary" type="submit">Enroll Student</button></div></form>`);document.getElementById("studentForm").onsubmit=e=>{e.preventDefault();const g=document.getElementById("newStudentGrade").value,s=makeStudent(state,g);s.iep=document.getElementById("newStudentIep").value==="yes";state.students.push(s);syncEnrollmentFromStudents();assignStudentsToRooms();projectNext();closeModal();renderAll();setMessage(`<strong>New student enrolled:</strong> ${s.name}, Grade ${g}.`);};}

function advanceYear(){
  const oldEnroll={...state.enrollment}, graduating=state.students.filter(s=>s.status==="Active"&&s.grade==="6");graduating.forEach(s=>{s.status="Promoted Out";s.history.push(`${state.year}: Promoted to middle school`);});
  const nextMap={K:"1",1:"2",2:"3",3:"4",4:"5",5:"6"};state.students.filter(s=>s.status==="Active").forEach(s=>{if(nextMap[s.grade]){s.grade=nextMap[s.grade];s.history.push(`${state.year+1}: Promoted to Grade ${s.grade}`);}});
  const newK=state.projected.K;for(let i=0;i<newK;i++)state.students.push(makeStudent(state,"K"));
  state.year++;
  const retirees=[],resignations=[];
  activeEmployees().forEach(e=>{
    e.age++;e.experience++;e.yearsInDistrict++;e.salary=Math.round(e.salary*1.02);e.morale=clamp(e.morale+rand(-4,3),40,100);
    if(e.leave && state.year>=e.leave.returnYear){e.history.push(`${state.year}: Returned from ${e.leave.type}`);logHr(`${e.name} returned from ${e.leave.type}.`);e.leave=null;e.status="Active";}
    const retireChance=e.age>=68?70:e.age>=65?40:e.age>=62?18:e.age>=60?7:0;if(rand(1,100)<=retireChance){e.status="Retired";e.room=null;e.history.push(`${state.year}: Retired`);retirees.push(e);return;}
    if(e.morale<55&&rand(1,100)<=18){e.status="Resigned";e.room=null;e.history.push(`${state.year}: Resigned`);resignations.push(e);}
  });
  syncEnrollmentFromStudents();assignStudentsToRooms();projectNext();state.budget+=Math.round(totalEnrollment()*3800);state.selectedEmployee=null;state.selectedRoom=null;
  if(rand(1,100)<=55)generateBoardIssue();
  const shortages=GRADES.filter(g=>teachersAssigned(g)<teacherNeed(g)),excess=GRADES.filter(g=>teachersAssigned(g)>teacherNeed(g));let text=`<strong>${state.year}–${state.year+1} begins:</strong> ${graduating.length} sixth graders moved to middle school and ${newK} kindergarten students entered.`;if(retirees.length)text+=` Retired: ${retirees.map(e=>e.name).join(", ")}.`;if(resignations.length)text+=` Resigned: ${resignations.map(e=>e.name).join(", ")}.`;if(shortages.length)text+=` Shortages in grades ${shortages.join(", ")}.`;if(excess.length)text+=` Excess staffing in grades ${excess.join(", ")}.`;setMessage(text);renderAll();saveGame(true);
}

function saveGame(silent=false){state.lastSaved=new Date().toISOString();localStorage.setItem(SAVE_KEY,JSON.stringify(state));if(!silent)setMessage(`<strong>Game saved.</strong> Progress is stored in this browser.`);}
function loadGame(){const raw=localStorage.getItem(SAVE_KEY);if(!raw){setMessage("<strong>No saved game found.</strong>");return;}try{state=JSON.parse(raw);renderAll();setMessage(`<strong>Game loaded.</strong> School year ${state.year}–${state.year+1}.`);}catch{setMessage("<strong>Save file could not be loaded.</strong>");}}

function showModal(title,html){document.getElementById("modalTitle").textContent=title;document.getElementById("modalBody").innerHTML=html;document.getElementById("modal").classList.remove("hidden");}
function closeModal(){document.getElementById("modal").classList.add("hidden");document.getElementById("modalBody").innerHTML="";}

// Event wiring
GRADES.forEach(g=>{});
document.querySelectorAll("[data-special-room]").forEach(b=>b.addEventListener("click",()=>handleSpecialClick(b.dataset.specialRoom)));
document.querySelectorAll(".nav-btn").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".nav-btn").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.querySelectorAll(".view").forEach(v=>v.classList.remove("active-view"));document.getElementById(`view-${b.dataset.view}`).classList.add("active-view");renderAll();}));
document.getElementById("assignStaffSelect").addEventListener("change",e=>{state.selectedEmployee=e.target.value?Number(e.target.value):null;const emp=activeEmployees().find(x=>x.id===state.selectedEmployee);if(emp)setMessage(`<strong>${emp.name} selected.</strong> ${emp.position} · age ${emp.age} · ${emp.experience} yrs experience.`);});
document.getElementById("clearSelectionBtn").onclick=()=>{state.selectedEmployee=null;renderAssignSelect();setMessage("Selection cleared.");};
document.getElementById("hireTeacherBtn").onclick=()=>openHireModal(true);document.getElementById("staffHireTeacherBtn").onclick=()=>openHireModal(true);document.getElementById("hireStaffBtn").onclick=()=>openHireModal(false);document.getElementById("staffHireOtherBtn").onclick=()=>openHireModal(false);document.getElementById("evaluateBtn").onclick=evaluateSelected;document.getElementById("leaveBtn").onclick=openLeaveModal;document.getElementById("transferBtn").onclick=openTransferModal;document.getElementById("rosterBtn").onclick=()=>{if(state.selectedRoom&&state.rooms.some(r=>r.id===state.selectedRoom))openRoster(state.selectedRoom);else setMessage("Select a classroom first.");};
document.getElementById("saveBtn").onclick=()=>saveGame(false);document.getElementById("loadBtn").onclick=loadGame;document.getElementById("advanceYearBtn").onclick=advanceYear;document.getElementById("modalClose").onclick=closeModal;document.getElementById("modal").addEventListener("click",e=>{if(e.target.id==="modal")closeModal();});
document.getElementById("staffCategoryFilter").onchange=renderStaffView;document.getElementById("staffSearch").oninput=renderStaffView;document.getElementById("studentGradeFilter").onchange=renderStudentsView;document.getElementById("studentRoomFilter").onchange=renderStudentsView;document.getElementById("studentSearch").oninput=renderStudentsView;document.getElementById("generateStudentBtn").onclick=addStudent;document.getElementById("newBoardIssueBtn").onclick=()=>{generateBoardIssue();renderBoardView();};document.getElementById("proposeRaiseBtn").onclick=()=>{const pct=clamp(Number(document.getElementById("raisePercent").value)||0,0,10);state.boardIssues.push({id:Date.now()+rand(1,9999),title:`${pct}% Salary Increase`,description:`Approve a ${pct}% salary increase for all active employees.`,cost:Math.round(payroll()*pct/100),effect:"raise",percent:pct});renderBoardView();setMessage(`<strong>Board agenda:</strong> ${pct}% salary increase proposal added.`);};

renderAll();
