const GAME_VERSION="5.0";
const GAME_BUILD="2026-09-02 09:32 ET";

const GRADES=["K","1","2","3","4","5","6"];
const TARGETS={K:20,1:22,2:22,3:24,4:24,5:24,6:24};
const SAVE_KEY="lincolnElementarySimulatorLivingV5";
const V3_SAVE_KEY="lincolnElementarySimulatorRealismV3";
const LEGACY_KEY="lincolnElementarySimulatorSaveV2";
const $=id=>document.getElementById(id);
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[rnd(0,a.length-1)];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const money=n=>"$"+Math.round(Number(n||0)).toLocaleString();
const pct=n=>`${Math.round(n)}%`;
const iso=d=>d.toISOString().slice(0,10);
const fmtDate=s=>new Date(`${s}T12:00:00`).toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric",year:"numeric"});
const firstNames=["Ava","Liam","Olivia","Noah","Emma","Elijah","Sophia","James","Isabella","Lucas","Mia","Henry","Amelia","Benjamin","Harper","Theodore","Evelyn","Mateo","Charlotte","Jack","Luna","Levi","Sofia","Alexander","Camila","Daniel","Aria","Michael","Scarlett","Mason","Ella","Ethan","Avery","Logan","Mila","Owen","Gianna","Samuel","Layla","Sebastian","Nora","Aiden","Hazel","John","Lily","Joseph","Ellie","Wyatt","Violet","David","Claire","Grace","Caleb","Isaac","Lucy","Chloe","Julian","Nolan","Sadie","Ruby"];
const lastNames=["Smith","Johnson","Brown","Taylor","Anderson","Thomas","Jackson","White","Harris","Martin","Thompson","Garcia","Martinez","Robinson","Clark","Rodriguez","Lewis","Lee","Walker","Hall","Allen","Young","King","Wright","Scott","Green","Baker","Adams","Nelson","Carter","Mitchell","Perez","Roberts","Turner","Campbell","Parker","Evans","Edwards","Collins","Stewart"];
const staffNames=["Alicia Carter","Miguel Lopez","Rachel Bennett","Dana Adams","Chris Thompson","Jenna Wilson","Marcus Reed","Tara Collins","Steven Harris","Natalie Morgan","Paula Taylor","Eric Evans","Monica Parker","Aaron Lewis","Jordan Miller","Casey Grant","Morgan Price","Taylor Bryant","Riley Ward","Cameron Brooks","Andrea Flores","Brandon Young","Heather King","Megan Rivera","Kyle Foster","Emily Chen"];
const salaryLanes={
 BA:[48000,49750,51500,53250,55000,56750,58500,60250,62000,63750,65500,67250,69000,70750,72500,74250,76000,77750,79500,81250,83000,84750,86500,88250,90000,91750,93500,95250,97000,98750,100500],
 MA:[51500,53250,55000,56750,58500,60250,62000,63750,65500,67250,69000,70750,72500,74250,76000,77750,79500,81250,83000,84750,86500,88250,90000,91750,93500,95250,97000,98750,100500,102250,104000],
 MA30:[54500,56250,58000,59750,61500,63250,65000,66750,68500,70250,72000,73750,75500,77250,79000,80750,82500,84250,86000,87750,89500,91250,93000,94750,96500,98250,100000,101750,103500,105250,107000]
};
function teacherSalary(degree,exp){let lane=degree==="MA+30"?"MA30":degree==="MA"?"MA":"BA";return salaryLanes[lane][Math.min(exp,30)];}
function uid(prefix){return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;}

const ROOM_LAYOUT=[
["101","K-1","classroom",1,1,1,1],["102","K-2","classroom",2,1,1,1],
["MUSIC","Music","special",4,1,1,1],["ART","Art","special",5,1,1,1],
["201","4-1","classroom",7,1,1,1],["202","4-2","classroom",8,1,1,1],
["103","K-3","classroom",1,2,1,1],["104","1-1","classroom",2,2,1,1],
["CAF","Cafeteria","facility",4,2,2,2],["203","4-3","classroom",7,2,1,1],["204","5-1","classroom",8,2,1,1],
["105","1-2","classroom",1,3,1,1],["106","1-3","classroom",2,3,1,1],
["205","5-2","classroom",7,3,1,1],["206","5-3","classroom",8,3,1,1],
["HALL1","Primary Hall","circulation",3,1,1,4],["HALL2","Upper Hall","circulation",6,1,1,4],
["LIB","Media Center","special",3,5,2,2],["GYM","Gymnasium","special",5,5,2,2],
["107","2-1","classroom",1,5,1,1],["108","2-2","classroom",2,5,1,1],
["207","6-1","classroom",7,5,1,1],["208","6-2","classroom",8,5,1,1],
["109","2-3","classroom",1,6,1,1],["110","3-1","classroom",2,6,1,1],
["209","6-3","classroom",7,6,1,1],["SPED","Special Education","support",8,6,1,1],
["111","3-2","classroom",1,7,1,1],["112","3-3","classroom",2,7,1,1],
["OFFICE","Main Office","admin",4,7,1,1],["NURSE","Health Office","support",5,7,1,1],
["COUNSEL","Counseling","support",6,7,1,1],["TECH","Technology","support",7,7,1,1],["CUST","Custodial","facility",8,7,1,1],
["ENTRY","Main Entrance","circulation",4,8,2,1],["KITCHEN","Kitchen / Receiving","facility",6,8,2,1]
];
const classroomGradeByRoom={
 "101":"K","102":"K","103":"K","104":"1","105":"1","106":"1",
 "107":"2","108":"2","109":"2","110":"3","111":"3","112":"3",
 "201":"4","202":"4","203":"4","204":"5","205":"5","206":"5",
 "207":"6","208":"6","209":"6"
};

function makeEmployee(name,category,position,assignment,room,exp=8,degree="BA",license="N/A",fte=1,schedule="7:30 AM–3:15 PM",salary=null){
 return {id:uid("emp"),name,category,position,assignment,room,experience:exp,yearsInDistrict:Math.max(1,exp-rnd(0,3)),age:23+exp+rnd(0,15),degree,license,fte,schedule,salary:salary??(category==="Teacher"?teacherSalary(degree,exp):42000+exp*1150),contract:category==="Teacher"?(exp<3?"Probationary":"Professional"):"Classified",status:"Active",absence:null,leave:null,morale:rnd(78,95),performance:rnd(78,94),history:[`2026: Assigned as ${position}`],equipment:["ID badge","Building key"]};
}
function makeTeacher(name,g,room,exp,degree="BA"){return makeEmployee(name,"Teacher",`Grade ${g} Teacher`,`Grade ${g}`,room,exp,degree,"Elementary K-6",1,"7:30 AM–3:15 PM",teacherSalary(degree,exp));}

function initialEmployees(){
 return [
  makeTeacher("Mrs. Johnson","K","101",8,"MA"),makeTeacher("Mrs. Moore","K","102",15,"MA"),makeTeacher("Mrs. Davis","K","103",4,"BA"),
  makeTeacher("Mrs. King","1","104",21,"MA+30"),makeTeacher("Mrs. Foster","1","105",10,"MA"),makeTeacher("Mrs. White","1","106",6,"BA"),
  makeTeacher("Mr. Chen","2","107",11,"MA"),makeTeacher("Mrs. Evans","2","108",20,"MA+30"),makeTeacher("Mrs. Hall","2","109",7,"BA"),
  makeTeacher("Mr. Clark","3","110",22,"MA"),makeTeacher("Mrs. Green","3","111",9,"MA"),makeTeacher("Mrs. Martinez","3","112",6,"BA"),
  makeTeacher("Mr. Wright","4","201",28,"MA+30"),makeTeacher("Mrs. Young","4","202",13,"MA"),
  makeTeacher("Mrs. Thompson","5","204",17,"MA"),makeTeacher("Mr. Parker","5","205",5,"BA"),
  makeTeacher("Mr. Mitchell","6","207",19,"MA"),makeTeacher("Mrs. Campbell","6","208",14,"MA"),
  makeEmployee("Mr. Williams","Administration","Principal","Main Office","OFFICE",24,"MA+30","Building Administrator",1,"7:00 AM–4:00 PM",98000),
  makeEmployee("Ms. Grant","Administration","Assistant Principal","Main Office","OFFICE",15,"MA","Building Administrator",1,"7:15 AM–4:00 PM",82000),
  makeEmployee("Mrs. Anderson","Office","School Secretary","Main Office","OFFICE",30,"BA","N/A",1,"7:15 AM–3:45 PM",47500),
  makeEmployee("Nurse Taylor","Student Services","School Nurse","Health Office","NURSE",16,"BA","RN",1,"7:30 AM–3:15 PM",65000),
  makeEmployee("Ms. Brown","Student Services","School Counselor","Counseling","COUNSEL",12,"MA","School Counselor",1,"7:30 AM–3:30 PM",67000),
  makeEmployee("Dr. Lee","Student Services","School Psychologist","Psychology","COUNSEL",18,"MA+30","School Psychologist",.6,"8:00 AM–3:00 PM",79000),
  makeEmployee("Ms. Rivera","Specials","Library / Media Teacher","Library","LIB",12,"MA","School Library",1,"7:30 AM–3:15 PM",teacherSalary("MA",12)),
  makeEmployee("Mr. Davis","Specials","PE Teacher","Physical Education","GYM",18,"MA","Physical Education",1,"7:30 AM–3:15 PM",teacherSalary("MA",18)),
  makeEmployee("Ms. Lewis","Specials","Music Teacher","Music","MUSIC",7,"BA","Music Education",1,"7:30 AM–3:15 PM",teacherSalary("BA",7)),
  makeEmployee("Mrs. Grant","Specials","Art Teacher","Art","ART",23,"MA","Visual Arts",1,"7:30 AM–3:15 PM",teacherSalary("MA",23)),
  makeEmployee("Ms. Flores","Special Education","Special Education Teacher","Resource Room","SPED",10,"MA","Mild Intervention K-6",1,"7:30 AM–3:15 PM",64000),
  makeEmployee("Mr. Bryant","Special Education","Special Education Teacher","Resource Room","SPED",5,"BA","Mild Intervention K-6",1,"7:30 AM–3:15 PM",54500),
  makeEmployee("Mrs. Webb","Instructional Support","Instructional Assistant","Kindergarten","101",18,"HS","Paraeducator",1,"7:30 AM–3:00 PM",32500),
  makeEmployee("Ms. Diaz","Instructional Support","Special Education Para","Resource Room","SPED",4,"AA","Paraeducator",1,"7:30 AM–3:00 PM",33800),
  makeEmployee("Mr. Nelson","Operations","Head Custodian","Building Operations","CUST",22,"HS","N/A",1,"6:00 AM–2:30 PM",46500),
  makeEmployee("Ms. Price","Operations","Custodian","Building Operations","CUST",10,"HS","N/A",1,"2:30 PM–11:00 PM",39200),
  makeEmployee("Mrs. Baker","Cafeteria","Cafeteria Manager","Cafeteria","CAF",17,"HS","Food Safety",1,"6:30 AM–2:00 PM",42000),
  makeEmployee("Mr. Scott","Cafeteria","Cafeteria Assistant","Cafeteria","CAF",8,"HS","Food Safety",.8,"7:00 AM–1:30 PM",31500),
  makeEmployee("Ms. Kim","Technology","School Technology Specialist","Technology","TECH",9,"BA","CompTIA A+",1,"7:30 AM–4:00 PM",61000)
 ];
}
function initialRooms(){
 return ROOM_LAYOUT.filter(x=>x[2]!=="circulation").map(([id,name,type])=>({
  id,name,type,grade:classroomGradeByRoom[id]||null,capacity:classroomGradeByRoom[id]?(classroomGradeByRoom[id]==="K"?20:["1","2"].includes(classroomGradeByRoom[id])?22:24):null,
  condition:rnd(80,98),cleanliness:rnd(84,99),temp:rnd(69,74),workOrders:[],equipment:type==="classroom"?["Interactive display","Teacher laptop","Student desks"]:[],status:"Open"
 }));
}
function generateFamiliesAndStudents(state,counts={K:53,1:62,2:61,3:63,4:43,5:49,6:47}){
 state.families=[]; state.students=[];
 let seq=1;
 for(const g of GRADES){
  for(let i=0;i<counts[g];i++){
   let family;
   if(state.families.length && Math.random()<.22) family=pick(state.families);
   else{
    let ln=pick(lastNames);
    family={id:uid("fam"),name:`${ln} Family`,lastName:ln,engagement:pick(["High","Typical","Typical","Typical","Low"]),addressZone:pick(["Oakwood","River Bend","Lincoln Heights","Willow Creek","Rural North"]),phone:`555-${rnd(200,999)}-${rnd(1000,9999)}`,history:["Enrolled at Lincoln"]};
    state.families.push(family);
   }
   let s={id:`S${1000+seq++}`,first:pick(firstNames),last:family.lastName,grade:g,room:null,familyId:family.id,transport:pick(["Bus","Bus","Bus","Car rider","Walker","Daycare"]),iep:Math.random()<.12,plan504:Math.random()<.06,ell:Math.random()<.05,attendance:rnd(91,100),reading:rnd(55,96),math:rnd(55,96),status:"Active",history:[`2026: Enrolled in Grade ${g}`]};
   state.students.push(s);
  }
 }
 assignStudents(state);
}
function assignStudents(state){
 for(const g of GRADES){
  const teachers=state.employees.filter(e=>e.category==="Teacher"&&e.assignment===`Grade ${g}`&&e.status!=="Resigned"&&e.room);
  const rooms=teachers.map(t=>t.room);
  const kids=state.students.filter(s=>s.status==="Active"&&s.grade===g);
  kids.sort((a,b)=>(Number(b.iep)+Number(b.plan504)+Number(b.ell))-(Number(a.iep)+Number(a.plan504)+Number(a.ell)));
  kids.forEach((s,i)=>s.room=rooms.length?rooms[i%rooms.length]:null);
 }
}
function initialPositions(){
 return [
  ...GRADES.map(g=>({id:`T${g}`,role:`Grade ${g} Teacher`,category:"Teacher",authorized:3,filled:g==="4"||g==="5"||g==="6"?2:3,fte:1})),
  {id:"SPEDT",role:"Special Education Teacher",category:"Special Education",authorized:2,filled:2,fte:1},
  {id:"PARA",role:"Special Education Para",category:"Instructional Support",authorized:2,filled:1,fte:1},
  {id:"CUST",role:"Custodian",category:"Operations",authorized:3,filled:2,fte:1},
  {id:"CAF",role:"Cafeteria Assistant",category:"Cafeteria",authorized:2,filled:1,fte:.8},
  {id:"COUNSEL",role:"School Counselor",category:"Student Services",authorized:1,filled:1,fte:1},
  {id:"TECH",role:"Technology Specialist",category:"Technology",authorized:1,filled:1,fte:1}
 ];
}
function initialState(){
 let state={version:3,schoolYear:"2026–27",date:"2026-08-13",instructionalDay:1,maxInstructionalDays:180,lastDayRan:false,
  employees:initialEmployees(),rooms:initialRooms(),families:[],students:[],positions:initialPositions(),vacancies:[],applications:[],substitutes:[
   {id:"SUB1",name:"Linda Harper",qualified:"Elementary K-6",reliability:92,status:"Available"},
   {id:"SUB2",name:"James Reed",qualified:"Elementary K-6",reliability:84,status:"Available"},
   {id:"SUB3",name:"Karen Miles",qualified:"Elementary K-6",reliability:76,status:"Available"},
   {id:"SUB4",name:"Todd Baker",qualified:"Classified / Para",reliability:88,status:"Available"}
  ],absences:[],coverage:[],inbox:[],activity:[],schedule:[],purchaseOrders:[],boardIssues:[],boardHistory:[],workOrders:[],
  finance:{operatingBudget:4250000,stateRevenue:4025000,localRevenue:525000,grants:125000,otherRevenue:45000,spentOps:0,capitalBudget:620000},
  metrics:{parentSatisfaction:84,staffMorale:87,safety:94,academics:78,attendance:95.6,building:90,reputation:82},
  neighborhoods:[
   {name:"Oakwood",students:102,growth:1.2},{name:"River Bend",students:74,growth:.4},{name:"Lincoln Heights",students:138,growth:-.2},{name:"Willow Creek",students:38,growth:6.8},{name:"Rural North",students:62,growth:.5}
  ],fiscalHistory:[],selectedRoom:null,selectedMessage:null,weather:{condition:"Clear",temp:72,roads:"Dry"},settings:{showTeachers:true,showCounts:true,showTemps:false,showCleaning:false,showOrders:true}
 };
 generateFamiliesAndStudents(state);
 seedInbox(state); seedSchedule(state); seedWorkOrders(state);
 return state;
}
function seedInbox(s){
 s.inbox=[
  msg("Superintendent Office","Welcome to the 2026–27 school year","Please submit your opening-week staffing and enrollment report by Friday.","low",["Acknowledge"]),
  msg("HR","Position authorization reminder","Any position above approved FTE requires district authorization before posting.","medium",["Open HR"]),
  msg("Facilities","Summer project closeout","All summer projects are complete except final punch-list work in the cafeteria receiving area.","low",["Create Work Order"]),
  msg("Parent — Garcia Family","Class placement question","Our child was placed in Grade 2 Room 108. Could someone explain the placement process?","medium",["Reply","Forward to AP"])
 ];
}
function seedSchedule(s){
 s.schedule=[
  {time:"7:15 AM",item:"Morning leadership check-in"},
  {time:"8:10 AM",item:"Arrival supervision / bus & car line"},
  {time:"9:30 AM",item:"Grade 1 classroom walkthrough"},
  {time:"11:00 AM",item:"IEP case conference"},
  {time:"1:15 PM",item:"Interview block / HR hold"},
  {time:"2:35 PM",item:"Dismissal supervision"},
  {time:"3:20 PM",item:"Staff follow-up / parent calls"}
 ];
}
function seedWorkOrders(s){
 let r=s.rooms.find(x=>x.id==="CAF"); if(r){let w=workOrder("CAF","Receiving door closer not latching reliably","Medium");s.workOrders.push(w);r.workOrders.push(w.id);}
}
function msg(from,subject,body,priority="low",actions=[]){return{id:uid("msg"),from,subject,body,priority,actions,read:false,status:"Open",date:new Date().toISOString()};}
function workOrder(roomId,issue,priority="Medium"){return{id:uid("wo"),roomId,issue,priority,status:"Open",age:0,assigned:priority==="High"?"District Maintenance":"Head Custodian",created:"2026-08-13"};}

let state=initialState();

function activeEmployees(){return state.employees.filter(e=>!["Resigned","Retired","Terminated"].includes(e.status));}
function enrollment(){return state.students.filter(s=>s.status==="Active").length;}
function payroll(){return activeEmployees().reduce((a,e)=>a+e.salary*e.fte,0);}
function benefits(){return Math.round(payroll()*.29);}
function committedPO(){return state.purchaseOrders.filter(p=>p.status!=="Closed").reduce((a,p)=>a+p.amount,0);}
function availableOperating(){return state.finance.operatingBudget-payroll()-benefits()-state.finance.spentOps-committedPO();}
function roomById(id){return state.rooms.find(r=>r.id===id);}
function teacherForRoom(id){return activeEmployees().find(e=>e.category==="Teacher"&&e.room===id);}
function studentsInRoom(id){return state.students.filter(s=>s.status==="Active"&&s.room===id);}
function avg(a){return a.length?a.reduce((x,y)=>x+y,0)/a.length:0;}
function buildingScore(){return Math.round(avg(state.rooms.map(r=>(r.condition+r.cleanliness)/2)));}

function toast(t){let e=$("toast");e.textContent=t;e.classList.remove("hidden");clearTimeout(window.__toast);window.__toast=setTimeout(()=>e.classList.add("hidden"),2600);}
function log(t){state.activity.unshift(`${fmtDate(state.date)} — ${t}`);state.activity=state.activity.slice(0,30);}
function openModal(title,html){$("modalTitle").textContent=title;$("modalBody").innerHTML=html;$("modal").classList.remove("hidden");}
function closeModal(){$("modal").classList.add("hidden");}

function updatePositionFill(){
 state.positions.forEach(p=>{
  if(p.category==="Teacher"){
   let g=p.role.match(/Grade (.+) Teacher/)?.[1];
   p.filled=activeEmployees().filter(e=>e.category==="Teacher"&&e.assignment===`Grade ${g}`).length;
  }else p.filled=activeEmployees().filter(e=>e.position===p.role || (p.role==="Custodian"&&e.category==="Operations"&&e.position.includes("Custodian")) || (p.role==="Cafeteria Assistant"&&e.position==="Cafeteria Assistant") || (p.role==="Special Education Para"&&e.position==="Special Education Para") || (p.role==="Technology Specialist"&&e.category==="Technology")).reduce((a,e)=>a+e.fte,0);
 });
}
function teacherNeed(g){let n=state.students.filter(s=>s.status==="Active"&&s.grade===g).length;return Math.min(3,Math.max(1,Math.ceil(n/TARGETS[g])));}
function roomSeverity(r){
 if(r.status==="Out of Service")return "out";
 if(r.condition<70||r.cleanliness<72||r.temp<65||r.temp>79||r.workOrders.some(id=>state.workOrders.find(w=>w.id===id&&w.status==="Open"&&w.priority==="High")))return "needs";
 if(r.grade&&!teacherForRoom(r.id))return "vacant";
 return "";
}

function reportSectionError(name,err){
 console.error(`[Lincoln ${name}]`,err);
 const view=document.getElementById(`view-${name}`);
 if(view && !view.querySelector('.section-error')){
   const box=document.createElement('div');box.className='section-error';
   box.innerHTML=`<strong>${name[0].toUpperCase()+name.slice(1)} section had a loading problem.</strong><br><span>${String(err?.message||err)}</span>`;
   view.prepend(box);
 }
}
function safeSection(name,fn){try{fn()}catch(err){reportSectionError(name,err)}}
function render(){
 try{updatePositionFill();}catch(err){console.error(err)}
 const setText=(id,val)=>{const el=$(id);if(el)el.textContent=val};
 setText("statusDate",`Day ${state.instructionalDay}/${state.maxInstructionalDays} • ${fmtDate(state.date)}`);
 setText("statusEnrollment",`${enrollment()} students`);
 let present=activeEmployees().filter(e=>e.status!=="Absent"&&!e.leave).length;
 setText("statusStaff",`${present}/${activeEmployees().length}`);
 setText("statusAttendance",pct(state.metrics.attendance));
 setText("statusBudget",money(availableOperating()));
 setText("statusBuilding",`${buildingScore()}%`);
 setText("unreadBadge",state.inbox.filter(m=>!m.read).length||"");
 safeSection('command',renderCommand);
 safeSection('building',renderBuilding);
 safeSection('students',renderStudents);
 safeSection('staff',renderStaff);
 safeSection('hr',renderHR);
 safeSection('operations',renderOperations);
 safeSection('finance',renderFinance);
 safeSection('board',renderBoard);
 safeSection('inbox',renderInbox);
 safeSection('reports',renderReports);
}
function renderCommand(){
 $("briefingSub").textContent=`${state.weather.condition}, ${state.weather.temp}°F • Roads: ${state.weather.roads}`;
 let absent=activeEmployees().filter(e=>e.status==="Absent").length, uncovered=state.coverage.filter(c=>c.status==="Uncovered").length;
 let openWO=state.workOrders.filter(w=>w.status==="Open").length, apps=state.applications.filter(a=>!["Hired","Rejected","Withdrawn"].includes(a.status)).length;
 $("briefingCards").innerHTML=[
  ["Enrollment",enrollment(),`${state.students.filter(s=>s.attendance<90).length} attendance concerns`,""],
  ["Staff Call-offs",absent,uncovered?`${uncovered} uncovered`:"Coverage stable",uncovered?"danger":absent?"warn":""],
  ["Open Work Orders",openWO,state.workOrders.filter(w=>w.priority==="High"&&w.status==="Open").length+" high priority",openWO?"warn":""],
  ["Active Applicants",apps,`${state.vacancies.filter(v=>v.status==="Open").length} posted vacancies`,""]
 ].map(x=>`<div class="brief-card ${x[3]}"><span class="muted">${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small></div>`).join("");
 $("todaySchedule").innerHTML=state.schedule.map(x=>`<div class="time-row"><strong>${x.time}</strong><span>${x.item}</span></div>`).join("");
 let alerts=[];
 GRADES.forEach(g=>{let need=teacherNeed(g),filled=activeEmployees().filter(e=>e.category==="Teacher"&&e.assignment===`Grade ${g}`).length;if(filled<need)alerts.push({t:`Grade ${g} is below projected classroom staffing (${filled}/${need}).`,c:"danger"});});
 if(uncovered)alerts.push({t:`${uncovered} staff absence${uncovered>1?"s are":" is"} currently uncovered.`,c:"danger"});
 state.workOrders.filter(w=>w.status==="Open"&&w.priority==="High").forEach(w=>alerts.push({t:`High-priority work order: ${w.issue} (${w.roomId}).`,c:"danger"}));
 state.positions.filter(p=>p.filled<p.authorized).slice(0,4).forEach(p=>alerts.push({t:`Authorized vacancy: ${p.role} (${p.filled}/${p.authorized} FTE filled).`,c:"warn"}));
 if(!alerts.length)alerts=[{t:"No immediate operational issues. Continue normal school operations.",c:"good"}];
 $("attentionList").innerHTML=alerts.slice(0,7).map(a=>`<div class="alert ${a.c}">${a.t}</div>`).join("");
 $("snapshot").innerHTML=`<div class="inspector-grid">
 <div class="inspector-stat"><span>Academics</span><strong>${state.metrics.academics}</strong></div><div class="inspector-stat"><span>Parent Sat.</span><strong>${state.metrics.parentSatisfaction}</strong></div>
 <div class="inspector-stat"><span>Staff Morale</span><strong>${state.metrics.staffMorale}</strong></div><div class="inspector-stat"><span>Safety</span><strong>${state.metrics.safety}</strong></div>
 </div><div class="compact-item"><strong>School Year:</strong> ${state.schoolYear}<br><strong>Capacity:</strong> 480<br><strong>Enrollment:</strong> ${enrollment()} (${Math.round(enrollment()/480*100)}%)</div>`;
 $("recentActivity").innerHTML=(state.activity.length?state.activity:["School year opened."]).slice(0,8).map(x=>`<div class="compact-item">${x}</div>`).join("");
}

function renderBuilding(){
 const map=$("schoolMap"); map.innerHTML="";
 for(const [id,name,type,col,row,w,h] of ROOM_LAYOUT){
  let b=document.createElement(type==="circulation"?"div":"button");
  b.className=`room-map ${type}`; b.style.gridColumn=`${col}/span ${w}`;b.style.gridRow=`${row}/span ${h}`;
  if(type==="circulation"){b.innerHTML=`<span class="rname">${name}</span>`;map.appendChild(b);continue;}
  const r=roomById(id); if(!r)continue; let sev=roomSeverity(r);if(sev)b.classList.add(sev);
  let count=r.grade?studentsInRoom(id).length:null;
  let meta=[];
  if(r.grade&&state.settings.showCounts)meta.push(`${count}/${r.capacity} students`);
  if(state.settings.showTemps)meta.push(`${r.temp}°F`);
  if(state.settings.showCleaning)meta.push(`Clean ${r.cleanliness}%`);
  let openW=r.workOrders.filter(x=>state.workOrders.find(w=>w.id===x&&w.status==="Open")).length;
  b.innerHTML=`<span class="rid">${id}</span><span class="rname">${r.grade?`Grade ${r.grade}`:name}</span><span class="rmeta">${meta.join(" • ")||name}</span>${state.settings.showOrders&&openW?`<span class="work-badge">🔧 ${openW}</span>`:""}`;
  b.addEventListener("click",()=>{state.selectedRoom=id;renderBuilding();});
  map.appendChild(b);
 }
 $("capacityChip").textContent=`Enrollment ${enrollment()} / 480 • ${Math.round(enrollment()/480*100)}% utilized`;
 renderRoomInspector();
}
function renderRoomInspector(){
 let box=$("roomInspector"),id=state.selectedRoom;if(!id){box.innerHTML='<span class="muted">Select a room on the map.</span>';return;}
 let r=roomById(id);if(!r){box.textContent="Room unavailable.";return;}let t=teacherForRoom(id),kids=studentsInRoom(id),orders=r.workOrders.map(x=>state.workOrders.find(w=>w.id===x)).filter(Boolean);
 box.innerHTML=`<h3>${id} — ${r.name}${r.grade?` / Grade ${r.grade}`:""}</h3>
 <div class="inspector-grid"><div class="inspector-stat"><span>Condition</span><strong>${r.condition}%</strong></div><div class="inspector-stat"><span>Cleanliness</span><strong>${r.cleanliness}%</strong></div><div class="inspector-stat"><span>Temperature</span><strong>${r.temp}°F</strong></div><div class="inspector-stat"><span>Status</span><strong>${r.status}</strong></div></div>
 ${r.grade?`<div class="compact-item"><strong>${t?t.name:"Vacant classroom"}</strong><br>${kids.length}/${r.capacity} students${t?` • ${t.experience} yrs experience`:""}</div>`:""}
 ${orders.length?orders.map(o=>`<div class="compact-item"><strong>${o.priority}:</strong> ${o.issue}<br>${o.status} • ${o.assigned}</div>`).join(""):"<p class='muted'>No room work orders.</p>"}
 <div class="inspector-actions"><button class="secondary" id="inspectWO">Create Work Order</button>${r.grade?`<button class="secondary" id="inspectRoster">View Roster</button>`:""}</div>`;
 $("inspectWO").onclick=()=>openWorkOrderModal(id);if($("inspectRoster"))$("inspectRoster").onclick=()=>openRoster(id);
}

function renderStudents(){
 let gf=$("studentGradeFilter");let cur=gf.value||"all";gf.innerHTML='<option value="all">All Grades</option>'+GRADES.map(g=>`<option value="${g}">Grade ${g}</option>`).join("");gf.value=GRADES.includes(cur)?cur:"all";
 let grade=gf.value,need=$("studentNeedFilter").value,q=$("studentSearch").value.toLowerCase();
 let list=state.students.filter(s=>s.status==="Active"&&(grade==="all"||s.grade===grade)&&(!q||`${s.first} ${s.last}`.toLowerCase().includes(q)||state.families.find(f=>f.id===s.familyId)?.name.toLowerCase().includes(q)));
 if(need==="IEP")list=list.filter(s=>s.iep);if(need==="504")list=list.filter(s=>s.plan504);if(need==="ELL")list=list.filter(s=>s.ell);if(need==="Attendance")list=list.filter(s=>s.attendance<90);
 $("studentTableBody").innerHTML=list.map(s=>{let f=state.families.find(x=>x.id===s.familyId),t=teacherForRoom(s.room),sup=[s.iep?"IEP":"",s.plan504?"504":"",s.ell?"ELL":""].filter(Boolean).join(", ")||"—";return`<tr><td><button class="link-btn" data-student="${s.id}">${s.first} ${s.last}</button></td><td>${s.grade}</td><td>${s.room||"—"}</td><td>${t?t.name:"—"}</td><td>${f?f.name:"—"}</td><td>${s.transport}</td><td>${sup}</td><td>${s.attendance}%</td><td>${s.reading}</td><td>${s.math}</td></tr>`}).join("");
 document.querySelectorAll("[data-student]").forEach(b=>b.onclick=()=>openStudent(b.dataset.student));
}
function renderStaff(){
 let cats=[...new Set(activeEmployees().map(e=>e.category))].sort(),cf=$("staffCategoryFilter"),cur=cf.value||"all";cf.innerHTML='<option value="all">All Categories</option>'+cats.map(c=>`<option>${c}</option>`).join("");cf.value=cats.includes(cur)?cur:"all";
 let q=$("staffSearch").value.toLowerCase(),status=$("staffStatusFilter").value,cat=cf.value;
 let list=activeEmployees().filter(e=>(cat==="all"||e.category===cat)&&(!q||e.name.toLowerCase().includes(q)||e.position.toLowerCase().includes(q)));
 if(status==="Absent")list=list.filter(e=>e.status==="Absent");if(status==="Leave")list=list.filter(e=>e.leave);if(status==="Active")list=list.filter(e=>e.status==="Active"&&!e.leave);
 $("staffTableBody").innerHTML=list.map(e=>`<tr><td><button class="link-btn" data-emp="${e.id}">${e.name}</button></td><td>${e.position}</td><td>${e.fte.toFixed(1)}</td><td>${e.assignment}</td><td>${e.schedule}</td><td>${e.experience} yrs</td><td>${e.degree}</td><td>${e.license}</td><td>${money(e.salary*e.fte)}</td><td>${e.leave?'<span class="badge warn">Leave</span>':e.status==="Absent"?'<span class="badge danger">Absent</span>':'<span class="badge good">Active</span>'}</td></tr>`).join("");
 document.querySelectorAll("[data-emp]").forEach(b=>b.onclick=()=>openEmployee(b.dataset.emp));
}
function renderHR(){
 $("positionControl").innerHTML=state.positions.map(p=>`<div class="position-row"><div><strong>${p.role}</strong><br><span class="muted">${p.category} • ${p.fte.toFixed(1)} FTE each</span></div><div><strong>${Number(p.filled).toFixed(1)} / ${p.authorized.toFixed(1)}</strong><br><span class="${p.filled<p.authorized?"badge warn":"badge good"}">${p.filled<p.authorized?"Vacancy":"Filled"}</span></div></div>`).join("");
 $("vacancyBoard").innerHTML=state.vacancies.length?state.vacancies.map(v=>{let apps=state.applications.filter(a=>a.vacancyId===v.id);return`<div class="vacancy-card"><div class="vacancy-head"><div><strong>${v.title}</strong><br><span class="muted">${v.fte.toFixed(1)} FTE • Posted ${v.posted}</span></div><span class="badge ${v.status==="Open"?"info":"good"}">${v.status}</span></div><div class="actions">${v.status==="Open"?`<button class="secondary" data-vac="${v.id}" data-act="closeVac">Close Posting</button>`:""}<button class="secondary" data-vac="${v.id}" data-act="viewVac">View ${apps.length} Application${apps.length===1?"":"s"}</button></div>${apps.slice(0,4).map(a=>`<div class="applicant-mini"><button class="link-btn" data-app="${a.id}">${a.name}</button> • ${a.status} • ${a.experience} yrs</div>`).join("")}</div>`}).join(""):"<p class='muted'>No vacancies posted.</p>";
 document.querySelectorAll("[data-app]").forEach(b=>b.onclick=()=>openApplication(b.dataset.app));
 document.querySelectorAll("[data-vac]").forEach(b=>b.onclick=()=>b.dataset.act==="viewVac"?openVacancy(b.dataset.vac):closeVacancy(b.dataset.vac));
 let leaves=activeEmployees().filter(e=>e.leave),licenseIssues=activeEmployees().filter(e=>e.category==="Teacher"&&!String(e.license).includes("Elementary"));
 $("hrCompliance").innerHTML=`<div class="stat-grid"><div class="stat-box"><span>Employees on Leave</span><strong>${leaves.length}</strong></div><div class="stat-box"><span>License Alerts</span><strong>${licenseIssues.length}</strong></div><div class="stat-box"><span>Probationary Teachers</span><strong>${activeEmployees().filter(e=>e.contract==="Probationary").length}</strong></div><div class="stat-box"><span>Open Vacancies</span><strong>${state.vacancies.filter(v=>v.status==="Open").length}</strong></div></div>${leaves.map(e=>`<div class="compact-item"><strong>${e.name}</strong> — ${e.leave.type}, returns ${e.leave.returnDate}</div>`).join("")}`;
 $("subPool").innerHTML=state.substitutes.map(s=>`<div class="position-row"><div><strong>${s.name}</strong><br><span class="muted">${s.qualified}</span></div><div>${s.reliability}% reliability<br><span class="badge ${s.status==="Available"?"good":"warn"}">${s.status}</span></div></div>`).join("");
}
function renderOperations(){
 $("coverageBoard").innerHTML=state.absences.length?state.absences.map(a=>{let e=state.employees.find(x=>x.id===a.employeeId),c=state.coverage.find(x=>x.absenceId===a.id);return`<div class="order-card"><div class="order-head"><div><strong>${e?.name||"Employee"}</strong><br><span class="muted">${e?.position||""} • ${a.reason}</span></div><span class="badge ${c?.status==="Covered"?"good":"danger"}">${c?.status||"Uncovered"}</span></div>${c?.subName?`<div class="muted">Covered by ${c.subName}</div>`:""}${c?.status!=="Covered"?`<div class="actions"><button class="secondary" data-cover="${a.id}">Find Substitute</button></div>`:""}</div>`}).join(""):"<p class='muted'>No staff absences today.</p>";
 document.querySelectorAll("[data-cover]").forEach(b=>b.onclick=()=>findSubForAbsence(b.dataset.cover));
 $("workOrderBoard").innerHTML=state.workOrders.length?state.workOrders.slice().sort((a,b)=>(a.status===b.status?0:a.status==="Open"?-1:1)).map(w=>`<div class="order-card"><div class="order-head"><div><strong>${w.roomId} — ${w.issue}</strong><br><span class="muted">${w.assigned} • ${w.age} day(s) open</span></div><span class="badge ${w.priority==="High"?"danger":w.priority==="Medium"?"warn":"info"}">${w.priority}</span></div><div class="actions">${w.status==="Open"?`<button class="secondary" data-wo="${w.id}" data-woact="complete">Complete</button><button class="secondary" data-wo="${w.id}" data-woact="escalate">Escalate</button>`:`<span class="badge good">Completed</span>`}</div></div>`).join(""):"<p class='muted'>No work orders.</p>";
 document.querySelectorAll("[data-wo]").forEach(b=>b.onclick=()=>manageWO(b.dataset.wo,b.dataset.woact));
 let ieps=state.students.filter(s=>s.status==="Active"&&s.iep).length,ell=state.students.filter(s=>s.status==="Active"&&s.ell).length,att=state.students.filter(s=>s.status==="Active"&&s.attendance<90).length;
 $("servicesBoard").innerHTML=`<div class="service-row"><strong>Special Education</strong><span>${ieps} students • ${(ieps/Math.max(1,activeEmployees().filter(e=>e.position==="Special Education Teacher").length)).toFixed(1)} per teacher</span></div><div class="service-row"><strong>School Counselor</strong><span>${att} attendance concerns</span></div><div class="service-row"><strong>ELL</strong><span>${ell} identified students</span></div><div class="service-row"><strong>Nurse</strong><span>${rnd(5,14)} average daily visits</span></div>`;
 $("calendarBoard").innerHTML=`<div class="compact-item"><strong>${fmtDate(state.date)}</strong> — Instructional Day ${state.instructionalDay}</div><div class="compact-item">Sep 7 — Labor Day / No School</div><div class="compact-item">Oct 15–16 — Fall Break</div><div class="compact-item">Nov 24–26 — Thanksgiving Break</div><div class="compact-item">Dec 21–Jan 1 — Winter Break</div><div class="compact-item">Mar 29–Apr 2 — Spring Break</div>`;
}
function renderFinance(){
 let p=payroll(),b=benefits(),rev=state.finance.stateRevenue+state.finance.localRevenue+state.finance.grants+state.finance.otherRevenue,avail=availableOperating();
 $("financeKpis").innerHTML=[["Operating Budget",state.finance.operatingBudget],["Payroll",p],["Benefits",b],["Available",avail]].map(x=>`<div class="stat-box"><span>${x[0]}</span><strong>${money(x[1])}</strong></div>`).join("");
 let items=[["Payroll",p],["Benefits",b],["Operations Spent",state.finance.spentOps],["Open POs",committedPO()]];
 $("financeBars").innerHTML=items.map(([l,v])=>`<div class="bar-row"><div class="bar-label"><span>${l}</span><strong>${money(v)}</strong></div><div class="bar-track"><div class="bar-fill" style="width:${Math.min(100,v/state.finance.operatingBudget*100)}%"></div></div></div>`).join("");
 let cats={};activeEmployees().forEach(e=>cats[e.category]=(cats[e.category]||0)+e.salary*e.fte);
 $("payrollCategories").innerHTML=Object.entries(cats).sort((a,b)=>b[1]-a[1]).map(([c,v])=>`<div class="category-row"><span>${c}</span><strong>${money(v)}</strong></div>`).join("");
 $("purchaseOrders").innerHTML=state.purchaseOrders.length?state.purchaseOrders.map(p=>`<div class="po-card"><strong>${p.vendor}</strong> — ${p.description}<br><span class="muted">${money(p.amount)} • ${p.account} • ${p.status}</span>${p.status!=="Closed"?`<div class="actions"><button class="secondary" data-po="${p.id}">Receive & Close</button></div>`:""}</div>`).join(""):"<p class='muted'>No purchase orders.</p>";
 document.querySelectorAll("[data-po]").forEach(b=>b.onclick=()=>closePO(b.dataset.po));
 let current=enrollment();$("forecastBoard").innerHTML=[1,2,3,4,5].map(y=>{let growth=state.neighborhoods.reduce((a,n)=>a+n.growth,0)/state.neighborhoods.length/100;let val=Math.round(current*Math.pow(1+growth,y));return`<div class="forecast-row"><span>${2026+y}–${String(27+y).slice(-2)}</span><strong>${val} students</strong><span>${val>480?"⚠️ Over capacity":val>450?"Near capacity":"Within capacity"}</span></div>`}).join("");
}
function renderBoard(){
 if(!state.boardMembers)state.boardMembers=[
  {name:"Karen Mitchell",priority:"Fiscal Responsibility",support:74},{name:"David Ross",priority:"Safety & Facilities",support:82},{name:"Monica Hayes",priority:"Employees & Retention",support:86},{name:"Eric Palmer",priority:"Families & Community",support:78},{name:"Susan Bennett",priority:"Growth & Planning",support:80}
 ];
 $("boardIssues").innerHTML=state.boardIssues.length?state.boardIssues.map(i=>`<div class="board-issue"><h3>${i.title}</h3><p>${i.description}</p><p><strong>Estimated impact:</strong> ${money(i.cost)}</p><div class="actions">${i.status==="Pending"?`<button class="secondary" data-board="${i.id}" data-rec="approve">Recommend Approval</button><button class="secondary" data-board="${i.id}" data-rec="deny">Recommend Denial</button>`:`<span class="badge ${i.status==="Approved"?"good":"danger"}">${i.status}</span>`}</div></div>`).join(""):"<p class='muted'>No pending agenda items.</p>";
 document.querySelectorAll("[data-board]").forEach(b=>b.onclick=()=>voteBoard(b.dataset.board,b.dataset.rec));
 $("boardMembers").innerHTML=state.boardMembers.map(m=>`<div class="board-member"><strong>${m.name}</strong><span>${m.priority}</span><span>${m.support}%</span></div>`).join("");
 $("boardHistory").innerHTML=(state.boardHistory.length?state.boardHistory:["No votes yet."]).slice(0,10).map(x=>`<div class="compact-item">${x}</div>`).join("");
}
function renderInbox(){
 let list=state.inbox.slice().sort((a,b)=>(a.read===b.read?0:a.read?1:-1));
 $("inboxList").innerHTML=list.map(m=>`<div class="message-row ${m.read?"":"unread"}" data-msg="${m.id}"><div class="message-head"><span><i class="priority-dot ${m.priority}"></i><strong>${m.from}</strong></span><span class="muted">${m.read?"Read":"New"}</span></div><div class="subject">${m.subject}</div><div class="muted">${m.body.slice(0,95)}${m.body.length>95?"…":""}</div></div>`).join("");
 document.querySelectorAll("[data-msg]").forEach(b=>b.onclick=()=>{state.selectedMessage=b.dataset.msg;let m=state.inbox.find(x=>x.id===state.selectedMessage);if(m)m.read=true;renderInbox();});
 let m=state.inbox.find(x=>x.id===state.selectedMessage);$("messageDetail").innerHTML=m?`<h3>${m.subject}</h3><p><strong>From:</strong> ${m.from}</p><p>${m.body}</p><div class="actions">${(m.actions||[]).map(a=>`<button class="secondary" data-msgact="${a}">${a}</button>`).join("")}<button class="secondary" data-msgact="Archive">Archive</button></div>`:"<span class='muted'>Select a message.</span>";
 document.querySelectorAll("[data-msgact]").forEach(b=>b.onclick=()=>handleMessageAction(b.dataset.msgact));
 $("unreadBadge").textContent=state.inbox.filter(x=>!x.read).length||"";
}
function renderReports(){
 let byGrade=GRADES.map(g=>[g,state.students.filter(s=>s.status==="Active"&&s.grade===g).length]);
 let avgClass=avg(state.rooms.filter(r=>r.grade&&teacherForRoom(r.id)).map(r=>studentsInRoom(r.id).length)).toFixed(1);
 $("reportGrid").innerHTML=[
  ["Enrollment Report",byGrade.map(([g,n])=>`<div class="report-line"><span>Grade ${g}</span><strong>${n}</strong></div>`).join("")],
  ["Class Size Report",`<div class="report-line"><span>Average</span><strong>${avgClass}</strong></div>${state.rooms.filter(r=>r.grade&&teacherForRoom(r.id)).map(r=>`<div class="report-line"><span>${r.id} / Grade ${r.grade}</span><strong>${studentsInRoom(r.id).length}/${r.capacity}</strong></div>`).join("")}`],
  ["Staffing Report",`<div class="report-line"><span>Active Employees</span><strong>${activeEmployees().length}</strong></div><div class="report-line"><span>Absences Today</span><strong>${state.absences.length}</strong></div><div class="report-line"><span>Open Vacancies</span><strong>${state.vacancies.filter(v=>v.status==="Open").length}</strong></div>`],
  ["Facilities Report",`<div class="report-line"><span>Building Score</span><strong>${buildingScore()}%</strong></div><div class="report-line"><span>Open Work Orders</span><strong>${state.workOrders.filter(w=>w.status==="Open").length}</strong></div><div class="report-line"><span>High Priority</span><strong>${state.workOrders.filter(w=>w.status==="Open"&&w.priority==="High").length}</strong></div>`],
  ["Attendance Report",`<div class="report-line"><span>School Attendance</span><strong>${pct(state.metrics.attendance)}</strong></div><div class="report-line"><span>Chronic Concerns</span><strong>${state.students.filter(s=>s.attendance<90).length}</strong></div>`],
  ["Budget Report",`<div class="report-line"><span>Payroll</span><strong>${money(payroll())}</strong></div><div class="report-line"><span>Benefits</span><strong>${money(benefits())}</strong></div><div class="report-line"><span>Committed POs</span><strong>${money(committedPO())}</strong></div><div class="report-line"><span>Available</span><strong>${money(availableOperating())}</strong></div>`]
 ].map(([h,c])=>`<div class="report-card"><h3>${h}</h3>${c}</div>`).join("");
}

function simulateCalloffs(){
 activeEmployees().forEach(e=>{if(e.status==="Absent")e.status="Active";});state.absences=[];state.coverage=[];state.substitutes.forEach(s=>s.status="Available");
 let eligible=activeEmployees().filter(e=>!e.leave&&e.category!=="Administration");
 let count=Math.random()<.25?rnd(2,5):rnd(0,2);
 eligible.sort(()=>Math.random()-.5).slice(0,count).forEach(e=>{e.status="Absent";let a={id:uid("abs"),employeeId:e.id,reason:pick(["Illness","Family illness","Personal day","Medical appointment","Emergency"]),date:state.date};state.absences.push(a);state.coverage.push({absenceId:a.id,status:"Uncovered",subName:null});});
 state.absences.forEach(a=>autoCover(a.id));
 log(`Morning call-off process completed: ${state.absences.length} absence(s).`);
 render();
}
function autoCover(absId){
 let a=state.absences.find(x=>x.id===absId),e=state.employees.find(x=>x.id===a?.employeeId),c=state.coverage.find(x=>x.absenceId===absId);if(!a||!e||!c)return;
 let candidates=state.substitutes.filter(s=>s.status==="Available"&&(e.category==="Teacher"?s.qualified.includes("Elementary"):true)).sort((x,y)=>y.reliability-x.reliability);
 if(candidates.length&&Math.random()<.82){let s=candidates[0];s.status="Assigned";c.status="Covered";c.subName=s.name;}
}
function findSubForAbsence(id){autoCover(id);render();let c=state.coverage.find(x=>x.absenceId===id);toast(c?.status==="Covered"?`Coverage found: ${c.subName}`:"No substitute accepted the assignment.");}

function advanceDay(){
 runRecruitingPipeline();
 progressWorkOrders();
 state.students.forEach(s=>{if(Math.random()<.04)s.attendance=clamp(s.attendance-rnd(0,1),70,100);});
 maybeMidyearEnrollment();
 let d=new Date(`${state.date}T12:00:00`);do{d.setDate(d.getDate()+1)}while(d.getDay()===0||d.getDay()===6);
 state.date=iso(d);state.instructionalDay++;activeEmployees().forEach(e=>{if(e.leave&&e.leave.returnDate<=state.date){e.history.unshift(`${state.date}: Returned from ${e.leave.type}`);e.leave=null;}});
 state.metrics.attendance=clamp(94.2+Math.random()*2.8,90,99);
 state.rooms.forEach(r=>{r.cleanliness=clamp(r.cleanliness-rnd(0,2),60,100);if(Math.random()<.1)r.temp=clamp(r.temp+rnd(-2,2),64,82);});
 if(Math.random()<.25)simulateRandomWorkOrder();
 if(Math.random()<.18)generateInboxEvent();
 state.absences=[];state.coverage=[];activeEmployees().forEach(e=>{if(e.status==="Absent")e.status="Active";});state.substitutes.forEach(s=>s.status="Available");
 simulateCalloffs();
 if(state.instructionalDay>state.maxInstructionalDays)endSchoolYear();
 save(true);render();
}
function runSchoolDay(){
 let absent=state.absences.length,uncovered=state.coverage.filter(c=>c.status==="Uncovered").length;
 let incidents=rnd(0,3),nurse=rnd(4,14),caf=enrollment()-rnd(35,90);
 state.finance.spentOps+=rnd(900,1800);
 state.rooms.forEach(r=>{if(r.type!=="facility")r.cleanliness=clamp(r.cleanliness-rnd(0,1),60,100)});
 state.metrics.staffMorale=clamp(state.metrics.staffMorale-(uncovered?1:0)+(.2),55,100);
 log(`School day completed: ${absent} staff absence(s), ${incidents} office referral(s), ${nurse} nurse visit(s), ${caf} lunches served.`);
 state.inbox.unshift(msg("Daily Operations","End-of-day summary",`${incidents} office referrals, ${nurse} nurse visits, ${caf} lunches served, and ${uncovered} uncovered staff assignment(s) were recorded today.`,"low",["Acknowledge"]));
 toast("School day completed. End-of-day report added to Inbox.");render();
}
function runRecruitingPipeline(){
 state.vacancies.filter(v=>v.status==="Open").forEach(v=>{
  if(Math.random()<.55 && state.applications.filter(a=>a.vacancyId===v.id).length<9)state.applications.push(generateApplication(v));
 });
 state.applications.forEach(a=>{
  if(a.status==="Offer Pending"){a.offerDays=(a.offerDays||0)+1;if(a.offerDays>=1){let accept=Math.random()<.78;a.status=accept?"Offer Accepted":"Offer Declined";state.inbox.unshift(msg("HR",`${a.name} ${accept?"accepted":"declined"} offer`,`${a.name} has ${accept?"accepted":"declined"} the offer for ${a.position}.`,"medium",accept?["Begin Onboarding"]:["Reopen Search"]));}}
  else if(a.status==="Onboarding"){a.onboardingDays=(a.onboardingDays||0)+1;if(a.onboardingDays>=3)finalizeHire(a);}
 });
}
function generateApplication(v){
 let exp=rnd(0,22),degree=pick(["BA","BA","MA","MA","MA+30"]),teacher=v.category==="Teacher",license=teacher?(Math.random()<.9?"Elementary K-6":"Emergency Permit / Pending"):(v.title.includes("Para")?"Paraeducator":v.title.includes("Custodian")?"N/A":v.title.includes("Cafeteria")?"Food Safety":"Applicable");
 return{id:uid("app"),vacancyId:v.id,name:pick(staffNames.filter(n=>!state.employees.some(e=>e.name===n))),position:v.title,experience:exp,degree,license,currentEmployer:pick(["Jefferson Elementary","Maple Ridge Schools","Lakeside Community Schools","New Graduate","Private School","Out of District"]),references:[`${pick(firstNames)} ${pick(lastNames)} — Supervisor`,`${pick(firstNames)} ${pick(lastNames)} — Colleague`],answers:{why:"I am seeking a school community where collaboration, student growth, and strong family relationships are priorities.",challenge:"I use clear routines, data, and communication to address problems early and adjust support when needed.",team:"I value shared planning, honest feedback, and following through on commitments."},status:"Applied",interviewScore:null,referenceScore:null,offerDays:0,onboardingDays:0,applied:state.date};
}
function postVacancyModal(){
 updatePositionFill();let available=state.positions.filter(p=>p.filled<p.authorized);
 openModal("Post Authorized Vacancy",`<form id="vacancyForm"><div class="form-grid"><label class="full">Authorized Position<select id="vacancyPosition" required>${available.length?available.map(p=>`<option value="${p.id}">${p.role} — ${p.filled}/${p.authorized} filled</option>`).join(""):'<option value="">No authorized vacancies</option>'}</select></label><label>Posting Length<select id="postingDays"><option value="5">5 school days</option><option value="10">10 school days</option><option value="15">15 school days</option></select></label><label>Internal applicants<select id="allowInternal"><option>Allowed</option><option>External only</option></select></label></div><div class="actions"><button class="primary" type="submit" ${available.length?"":"disabled"}>Post Vacancy</button></div></form>`);
 if(available.length)$("vacancyForm").onsubmit=e=>{e.preventDefault();let p=state.positions.find(x=>x.id===$("vacancyPosition").value);let v={id:uid("vac"),positionId:p.id,title:p.role,category:p.category,fte:p.fte,posted:state.date,status:"Open",postingDays:+$("postingDays").value,internal:$("allowInternal").value};state.vacancies.push(v);for(let i=0;i<rnd(1,3);i++)state.applications.push(generateApplication(v));state.inbox.unshift(msg("HR","Vacancy posted",`${v.title} has been posted. Applications will arrive over the next several school days.`,"low",["Open HR"]));log(`Posted vacancy: ${v.title}.`);closeModal();render();};
}
function openVacancy(id){let v=state.vacancies.find(x=>x.id===id),apps=state.applications.filter(a=>a.vacancyId===id);openModal(v.title,`<p><strong>Status:</strong> ${v.status} • <strong>Posted:</strong> ${v.posted}</p><h3>Applications (${apps.length})</h3>${apps.length?apps.map(a=>`<div class="position-row"><div><button class="link-btn" data-modalapp="${a.id}">${a.name}</button><br><span class="muted">${a.degree} • ${a.license} • ${a.experience} yrs</span></div><span class="badge info">${a.status}</span></div>`).join(""):"<p class='muted'>No applications yet.</p>"}`);document.querySelectorAll("[data-modalapp]").forEach(b=>b.onclick=()=>openApplication(b.dataset.modalapp));}
function openApplication(id){
 let a=state.applications.find(x=>x.id===id);if(!a)return;
 openModal(`Application — ${a.name}`,`<div class="app-sheet"><h3>${a.name}</h3><div>${a.position} • Applied ${a.applied}</div><div class="app-section"><strong>Education & Qualifications</strong><p>${a.degree} • ${a.license}<br>${a.experience} years experience<br>Current: ${a.currentEmployer}</p></div><div class="app-section"><strong>Application Questions</strong><p><b>Why Lincoln?</b><br>${a.answers.why}</p><p><b>Handling challenges</b><br>${a.answers.challenge}</p><p><b>Teamwork</b><br>${a.answers.team}</p></div><div class="app-section"><strong>References</strong><p>${a.references.join("<br>")}</p></div><div class="app-section"><strong>Current Stage</strong><p>${a.status}${a.interviewScore!=null?` • Interview ${a.interviewScore}/100`:""}${a.referenceScore!=null?` • References ${a.referenceScore}/100`:""}</p></div></div><div class="actions">${a.status==="Applied"?`<button class="primary" data-appaction="interview">Interview</button>`:""}${a.status==="Interviewed"?`<button class="secondary" data-appaction="refs">Check References</button>`:""}${a.status==="References Complete"?`<button class="primary" data-appaction="offer">Make Offer</button>`:""}${a.status==="Offer Accepted"?`<button class="primary" data-appaction="onboard">Begin Onboarding</button>`:""}${!["Hired","Rejected","Withdrawn"].includes(a.status)?`<button class="secondary" data-appaction="reject">Reject</button>`:""}</div>`);
 document.querySelectorAll("[data-appaction]").forEach(b=>b.onclick=()=>applicationAction(a,b.dataset.appaction));
}
function applicationAction(a,act){
 if(act==="interview"){a.interviewScore=rnd(68,98);a.status="Interviewed";log(`Interviewed ${a.name} for ${a.position}.`);}
 if(act==="refs"){a.referenceScore=rnd(70,99);a.status="References Complete";log(`Completed reference checks for ${a.name}.`);}
 if(act==="offer"){a.status="Offer Pending";a.offerDays=0;state.inbox.unshift(msg("HR","Offer sent",`An employment offer has been sent to ${a.name} for ${a.position}.`,"medium",["Acknowledge"]));}
 if(act==="onboard"){a.status="Onboarding";a.onboardingDays=0;}
 if(act==="reject"){a.status="Rejected";}
 closeModal();render();
}
function finalizeHire(a){
 if(a.status==="Hired")return;let v=state.vacancies.find(x=>x.id===a.vacancyId);if(!v)return;
 let p=state.positions.find(x=>x.id===v.positionId),employee;
 if(v.category==="Teacher"){let g=v.title.match(/Grade (.+) Teacher/)?.[1]||"3";let room=Object.entries(classroomGradeByRoom).find(([rid,rg])=>rg===g&&!teacherForRoom(rid))?.[0]||null;employee=makeTeacher(a.name,g,room,a.experience,a.degree);}
 else{let room=v.title.includes("Custodian")?"CUST":v.title.includes("Cafeteria")?"CAF":v.title.includes("Para")?"SPED":v.title.includes("Technology")?"TECH":null;employee=makeEmployee(a.name,p.category,v.title,p.category,room,a.experience,a.degree,a.license,p.fte,"7:30 AM–3:15 PM",v.title.includes("Para")?34000:v.title.includes("Custodian")?39500:v.title.includes("Cafeteria")?31500:52000);}
 employee.history.unshift(`${state.schoolYear}: Hired from application ${a.id}`);state.employees.push(employee);a.status="Hired";v.status="Filled";assignStudents(state);updatePositionFill();state.inbox.unshift(msg("HR","Onboarding complete",`${a.name} is now active as ${v.title}.`,"low",["Acknowledge"]));log(`${a.name} completed onboarding and started as ${v.title}.`);
}
function closeVacancy(id){let v=state.vacancies.find(x=>x.id===id);if(v)v.status="Closed";render();}

function openEmployee(id){let e=state.employees.find(x=>x.id===id);if(!e)return;openModal(e.name,`<div class="app-sheet"><h3>${e.position}</h3><p>${e.assignment} • ${e.fte.toFixed(1)} FTE • ${e.schedule}</p><div class="app-section"><strong>Personnel Profile</strong><p>Age ${e.age} • ${e.experience} yrs experience • ${e.yearsInDistrict} yrs in district<br>${e.degree} • ${e.license}<br>${e.contract} contract • ${money(e.salary*e.fte)}</p></div><div class="app-section"><strong>Performance & Morale</strong><p>Performance ${e.performance}/100 • Morale ${e.morale}/100</p></div><div class="app-section"><strong>Personnel History</strong>${e.history.map(h=>`<div>${h}</div>`).join("")}</div><div class="app-section"><strong>Assigned Property</strong><p>${e.equipment.join(", ")}</p></div></div><div class="actions"><button class="secondary" data-eact="eval">Record Walkthrough/Evaluation</button><button class="secondary" data-eact="leave">Add Leave</button><button class="secondary" data-eact="transfer">Transfer Assignment</button></div>`);document.querySelectorAll("[data-eact]").forEach(b=>b.onclick=()=>employeeAction(e,b.dataset.eact));}
function employeeAction(e,act){
 if(act==="eval"){let score=rnd(72,98);e.performance=Math.round((e.performance+score)/2);e.history.unshift(`${state.date}: Evaluation recorded — ${score}/100`);toast(`Evaluation recorded: ${score}/100`);}
 if(act==="leave"){openModal(`Leave — ${e.name}`,`<form id="leaveForm"><div class="form-grid"><label>Leave Type<select id="leaveType"><option>FMLA</option><option>Maternity/Paternity</option><option>Medical</option><option>Military</option><option>Long-term Leave</option></select></label><label>Return Date<input id="returnDate" type="date" value="${state.date}"></label></div><div class="actions"><button class="primary">Approve Leave</button></div></form>`);$("leaveForm").onsubmit=x=>{x.preventDefault();e.leave={type:$("leaveType").value,returnDate:$("returnDate").value};e.history.unshift(`${state.date}: ${e.leave.type} began`);closeModal();render();};return;}
 if(act==="transfer"&&e.category==="Teacher"){let rooms=Object.entries(classroomGradeByRoom).filter(([rid,g])=>!teacherForRoom(rid)||rid===e.room);openModal(`Transfer — ${e.name}`,`<form id="transferForm"><label>New classroom<select id="newRoom">${rooms.map(([rid,g])=>`<option value="${rid}">${rid} — Grade ${g}</option>`).join("")}</select></label><div class="actions"><button class="primary">Transfer</button></div></form>`);$("transferForm").onsubmit=x=>{x.preventDefault();let rid=$("newRoom").value,g=classroomGradeByRoom[rid];e.room=rid;e.assignment=`Grade ${g}`;e.position=`Grade ${g} Teacher`;e.history.unshift(`${state.date}: Transferred to Grade ${g}, Room ${rid}`);assignStudents(state);closeModal();render();};return;}
 closeModal();render();
}
function openStudent(id){let s=state.students.find(x=>x.id===id),f=state.families.find(x=>x.id===s?.familyId);if(!s)return;openModal(`${s.first} ${s.last}`,`<div class="app-sheet"><h3>Student Record</h3><p>Grade ${s.grade} • Room ${s.room||"Unassigned"} • ${s.transport}</p><div class="app-section"><strong>Family</strong><p>${f?.name||"—"} • ${f?.addressZone||"—"}<br>Engagement: ${f?.engagement||"—"}</p></div><div class="app-section"><strong>Supports</strong><p>${[s.iep?"IEP":"",s.plan504?"504 Plan":"",s.ell?"ELL":""].filter(Boolean).join(", ")||"None listed"}</p></div><div class="app-section"><strong>Current Indicators</strong><p>Attendance ${s.attendance}% • Reading ${s.reading} • Math ${s.math}</p></div><div class="app-section"><strong>History</strong>${s.history.map(h=>`<div>${h}</div>`).join("")}</div></div>`);}
function openRoster(roomId){let r=roomById(roomId),kids=studentsInRoom(roomId);openModal(`Roster — Room ${roomId}`,`<p>${teacherForRoom(roomId)?.name||"Vacant"} • ${kids.length}/${r?.capacity||"—"} students</p><div class="table-wrap"><table class="data-table"><thead><tr><th>Student</th><th>Supports</th><th>Attendance</th><th>Reading</th><th>Math</th></tr></thead><tbody>${kids.map(s=>`<tr><td>${s.first} ${s.last}</td><td>${[s.iep?"IEP":"",s.plan504?"504":"",s.ell?"ELL":""].filter(Boolean).join(", ")||"—"}</td><td>${s.attendance}%</td><td>${s.reading}</td><td>${s.math}</td></tr>`).join("")}</tbody></table></div>`);}

function openEnrollFamily(){
 openModal("Enroll New Family",`<form id="enrollForm"><div class="form-grid"><label>Family Last Name<input id="familyLast" value="${pick(lastNames)}" required></label><label>Neighborhood<select id="familyZone">${state.neighborhoods.map(n=>`<option>${n.name}</option>`).join("")}</select></label><label>Student First Name<input id="studentFirst" value="${pick(firstNames)}" required></label><label>Grade<select id="studentGrade">${GRADES.map(g=>`<option>${g}</option>`).join("")}</select></label><label>Transportation<select id="studentTransport"><option>Bus</option><option>Car rider</option><option>Walker</option><option>Daycare</option></select></label><label>Supports<select id="studentSupport"><option>None</option><option>IEP</option><option>504</option><option>ELL</option></select></label></div><div class="actions"><button class="primary">Complete Enrollment</button></div></form>`);
 $("enrollForm").onsubmit=e=>{e.preventDefault();let ln=$("familyLast").value.trim(),f={id:uid("fam"),name:`${ln} Family`,lastName:ln,engagement:"Typical",addressZone:$("familyZone").value,phone:`555-${rnd(200,999)}-${rnd(1000,9999)}`,history:[`${state.date}: Enrolled at Lincoln`]};state.families.push(f);let sup=$("studentSupport").value,s={id:uid("stu"),first:$("studentFirst").value.trim(),last:ln,grade:$("studentGrade").value,room:null,familyId:f.id,transport:$("studentTransport").value,iep:sup==="IEP",plan504:sup==="504",ell:sup==="ELL",attendance:100,reading:rnd(55,90),math:rnd(55,90),status:"Active",history:[`${state.date}: Enrolled in Grade ${$("studentGrade").value}`]};state.students.push(s);assignStudents(state);state.inbox.unshift(msg("Office","New enrollment completed",`${s.first} ${s.last} enrolled in Grade ${s.grade}. Classroom placement has been updated.`,"low",["Acknowledge"]));log(`New family enrolled: ${f.name}.`);closeModal();render();};
}
function maybeMidyearEnrollment(){if(Math.random()<.12){let g=pick(GRADES),ln=pick(lastNames),f={id:uid("fam"),name:`${ln} Family`,lastName:ln,engagement:pick(["High","Typical","Low"]),addressZone:pick(state.neighborhoods).name,phone:"555-555-0101",history:[`${state.date}: Moved into district`]};state.families.push(f);let s={id:uid("stu"),first:pick(firstNames),last:ln,grade:g,room:null,familyId:f.id,transport:pick(["Bus","Car rider","Walker"]),iep:Math.random()<.14,plan504:Math.random()<.06,ell:Math.random()<.06,attendance:rnd(92,100),reading:rnd(50,92),math:rnd(50,92),status:"Active",history:[`${state.date}: Midyear enrollment in Grade ${g}`]};state.students.push(s);assignStudents(state);state.inbox.unshift(msg("Office","Midyear enrollment",`${s.first} ${s.last} enrolled in Grade ${g} from ${f.addressZone}.`,"medium",["Review Placement"]));}}

function openWorkOrderModal(roomId=null){
 openModal("Create Work Order",`<form id="woForm"><div class="form-grid"><label>Room<select id="woRoom">${state.rooms.map(r=>`<option value="${r.id}" ${r.id===roomId?"selected":""}>${r.id} — ${r.name}</option>`).join("")}</select></label><label>Priority<select id="woPriority"><option>Low</option><option selected>Medium</option><option>High</option></select></label><label class="full">Issue<textarea id="woIssue" rows="3" required placeholder="Describe the problem..."></textarea></label></div><div class="actions"><button class="primary">Submit Work Order</button></div></form>`);
 $("woForm").onsubmit=e=>{e.preventDefault();let w=workOrder($("woRoom").value,$("woIssue").value.trim(),$("woPriority").value,state.date);state.workOrders.push(w);roomById(w.roomId)?.workOrders.push(w.id);log(`Work order opened for ${w.roomId}: ${w.issue}`);closeModal();render();};
}
function simulateRandomWorkOrder(){let r=pick(state.rooms),issues=["HVAC not maintaining setpoint","Ceiling tile stained after rain","Interactive display not powering on","Door hardware loose","Sink/faucet leaking","Flooring transition lifting","Outlet not working","Light fixture out"];let w=workOrder(r.id,pick(issues),Math.random()<.12?"High":Math.random()<.5?"Medium":"Low",state.date);state.workOrders.push(w);r.workOrders.push(w.id);state.inbox.unshift(msg("Facilities",`${w.priority}-priority work order — ${r.id}`,w.issue,w.priority==="High"?"high":"medium",["Open Operations"]));}
function progressWorkOrders(){state.workOrders.forEach(w=>{if(w.status==="Open"){w.age++;if(w.priority==="Low"&&Math.random()<.28||w.priority==="Medium"&&Math.random()<.18){w.status="Completed";let r=roomById(w.roomId);if(r){r.condition=clamp(r.condition+rnd(1,4),0,100);r.cleanliness=clamp(r.cleanliness+rnd(0,3),0,100);}}}});}
function manageWO(id,act){let w=state.workOrders.find(x=>x.id===id);if(!w)return;if(act==="complete"){w.status="Completed";let r=roomById(w.roomId);if(r){r.condition=clamp(r.condition+5,0,100);r.cleanliness=clamp(r.cleanliness+4,0,100);}log(`Work order completed: ${w.issue}.`);}if(act==="escalate"){w.priority="High";w.assigned="District Maintenance";}render();}

function createPO(){
 openModal("Create Purchase Order",`<form id="poForm"><div class="form-grid"><label>Vendor<input id="poVendor" value="School Supply Co." required></label><label>Account<select id="poAccount"><option>Instruction</option><option>Technology</option><option>Facilities</option><option>Office</option><option>Professional Development</option></select></label><label class="full">Description<input id="poDesc" required placeholder="Items / services"></label><label>Amount<input id="poAmount" type="number" min="1" value="2500" required></label></div><div class="actions"><button class="primary">Create PO</button></div></form>`);
 $("poForm").onsubmit=e=>{e.preventDefault();let amt=+$("poAmount").value;if(amt>availableOperating())return alert("Insufficient available operating funds.");state.purchaseOrders.push({id:uid("po"),vendor:$("poVendor").value,description:$("poDesc").value,account:$("poAccount").value,amount:amt,status:"Open",date:state.date});log(`Purchase order created for ${money(amt)}.`);closeModal();render();};
}
function closePO(id){let p=state.purchaseOrders.find(x=>x.id===id);if(p&&p.status!=="Closed"){p.status="Closed";state.finance.spentOps+=p.amount;log(`PO received and closed: ${p.vendor} ${money(p.amount)}.`);}render();}

function requestFTE(){
 openModal("Request Additional FTE",`<form id="fteForm"><div class="form-grid"><label>Position<select id="ftePos">${state.positions.map(p=>`<option value="${p.id}">${p.role}</option>`).join("")}</select></label><label>Additional FTE<input id="fteAmt" type="number" min=".2" max="2" step=".2" value="1"></label><label class="full">Justification<textarea id="fteWhy" rows="3">Enrollment, caseload, workload, and service demands support the requested staffing level.</textarea></label></div><div class="actions"><button class="primary">Send to Board/District</button></div></form>`);
 $("fteForm").onsubmit=e=>{e.preventDefault();let p=state.positions.find(x=>x.id===$("ftePos").value),amt=+$("fteAmt").value;state.boardIssues.push({id:uid("board"),title:`Authorize ${amt.toFixed(1)} FTE — ${p.role}`,description:$("fteWhy").value,cost:Math.round((p.category==="Teacher"?60000:40000)*amt),status:"Pending",effect:{type:"fte",positionId:p.id,amount:amt}});closeModal();render();};
}
function addBoardIssue(){
 openModal("Add Board Agenda Item",`<form id="boardForm"><div class="form-grid"><label>Request Type<select id="boardType"><option>Salary Increase</option><option>Capital Project</option><option>Program Expansion</option></select></label><label>Estimated Cost<input id="boardCost" type="number" value="75000"></label><label class="full">Title<input id="boardTitle" value="School Improvement Request"></label><label class="full">Description<textarea id="boardDesc" rows="3">Request approval based on student, staffing, and operational needs.</textarea></label></div><div class="actions"><button class="primary">Add to Agenda</button></div></form>`);
 $("boardForm").onsubmit=e=>{e.preventDefault();state.boardIssues.push({id:uid("board"),title:$("boardTitle").value,description:$("boardDesc").value,cost:+$("boardCost").value,status:"Pending",effect:{type:$("boardType").value}});closeModal();render();};
}
function voteBoard(id,rec){
 let i=state.boardIssues.find(x=>x.id===id);if(!i)return;let support=avg(state.boardMembers.map(m=>m.support));let chance=rec==="approve"?support:100-support;if(i.cost>150000)chance-=10;let approved=Math.random()*100<clamp(chance,15,95);i.status=approved?"Approved":"Denied";if(approved&&i.effect?.type==="fte"){let p=state.positions.find(x=>x.id===i.effect.positionId);if(p)p.authorized+=i.effect.amount;}state.boardHistory.unshift(`${fmtDate(state.date)} — ${i.title}: ${i.status}`);state.inbox.unshift(msg("School Board",`Board action: ${i.title}`,`The board ${i.status.toLowerCase()} the agenda item.`,"medium",["Acknowledge"]));render();
}

function generateInboxEvent(){let ev=pick([
 ()=>msg("Parent","Class-size concern",`A parent is concerned about a class with more than ${pick([22,24,25])} students and requests a review.`,"medium",["Reply","Review Placement"]),
 ()=>msg("Teacher","Supply request","A classroom teacher requests additional instructional materials before the next unit begins.","low",["Create PO","Reply"]),
 ()=>msg("District Office","Enrollment projection update","District planning shared a revised enrollment projection due to continued housing growth in Willow Creek.","medium",["Acknowledge","Open Reports"]),
 ()=>msg("Nurse","Health office workload","The nurse reports a heavier-than-normal week and asks for office backup during lunch coverage.","medium",["Assign Coverage","Acknowledge"]),
 ()=>msg("Technology","Device repair backlog","Technology reports a growing backlog of student device repairs.","low",["Open Operations","Acknowledge"])
 ]);state.inbox.unshift(ev());}
function handleMessageAction(act){let m=state.inbox.find(x=>x.id===state.selectedMessage);if(!m)return;if(act==="Archive"){m.status="Archived";state.inbox=state.inbox.filter(x=>x.id!==m.id);state.selectedMessage=null;}else{m.status="Completed";if(act==="Begin Onboarding"){let a=state.applications.find(x=>x.status==="Offer Accepted"&&(m.subject.includes(x.name)||m.body.includes(x.name)));if(a){a.status="Onboarding";a.onboardingDays=0;}}log(`Inbox action completed: ${act} — ${m.subject}.`);if(act.includes("HR"))showView("hr");if(act.includes("Operations"))showView("operations");if(act.includes("Reports"))showView("reports");if(act==="Create PO")createPO();if(act==="Create Work Order")openWorkOrderModal();}render();}

function weatherDecision(){
 openModal("Weather Decision",`<div class="app-sheet"><h3>Morning Conditions</h3><p>Forecast: ${state.weather.condition}<br>Temperature: ${state.weather.temp}°F<br>Roads: ${state.weather.roads}</p></div><div class="actions"><button class="secondary" data-weather="Normal">Normal Schedule</button><button class="secondary" data-weather="2-hour Delay">2-hour Delay</button><button class="secondary" data-weather="Closed">Close School</button></div>`);
 document.querySelectorAll("[data-weather]").forEach(b=>b.onclick=()=>{let d=b.dataset.weather;log(`Weather decision: ${d}.`);state.inbox.unshift(msg("District Communications","Weather decision recorded",`${d} selected for ${fmtDate(state.date)}.`,"low",["Acknowledge"]));closeModal();render();});
}
function fieldTrip(){
 openModal("Field Trip Request",`<form id="tripForm"><div class="form-grid"><label>Grade<select id="tripGrade">${GRADES.map(g=>`<option>${g}</option>`).join("")}</select></label><label>Destination<input id="tripDest" value="Science Museum"></label><label>Estimated Cost<input id="tripCost" type="number" value="1450"></label></div><div class="actions"><button class="primary">Approve Trip</button></div></form>`);
 $("tripForm").onsubmit=e=>{e.preventDefault();let g=$("tripGrade").value,d=$("tripDest").value,c=+$("tripCost").value;if(c>availableOperating())return alert("Insufficient funds.");state.finance.spentOps+=c;state.schedule.push({time:"TBD",item:`Grade ${g} field trip — ${d}`});state.inbox.unshift(msg("Transportation",`Field trip transportation request — Grade ${g}`,`Transportation request created for ${d}. This is ready for future bus-game integration.`,"low",["Acknowledge"]));log(`Approved Grade ${g} field trip to ${d}.`);closeModal();render();};
}
function addMeeting(){openModal("Add Principal Calendar Item",`<form id="meetingForm"><div class="form-grid"><label>Time<input id="meetingTime" value="10:00 AM"></label><label class="full">Meeting / Activity<input id="meetingItem" value="Parent conference"></label></div><div class="actions"><button class="primary">Add</button></div></form>`);$("meetingForm").onsubmit=e=>{e.preventDefault();state.schedule.push({time:$("meetingTime").value,item:$("meetingItem").value});closeModal();render();};}

function endSchoolYear(){
 let oldYear=state.schoolYear;state.students.filter(s=>s.status==="Active").forEach(s=>{if(s.grade==="6"){s.status="Promoted Out";s.history.unshift(`${oldYear}: Completed Grade 6`);}else{let i=GRADES.indexOf(s.grade);s.grade=GRADES[i+1];s.history.unshift(`${oldYear}: Promoted to Grade ${s.grade}`);}});
 let k=rnd(48,72);for(let i=0;i<k;i++){let ln=pick(lastNames),f=state.families.find(x=>x.lastName===ln&&Math.random()<.25);if(!f){f={id:uid("fam"),name:`${ln} Family`,lastName:ln,engagement:"Typical",addressZone:pick(state.neighborhoods).name,phone:"555-555-0101",history:["New kindergarten family"]};state.families.push(f);}state.students.push({id:uid("stu"),first:pick(firstNames),last:ln,grade:"K",room:null,familyId:f.id,transport:pick(["Bus","Bus","Car rider","Walker"]),iep:Math.random()<.1,plan504:Math.random()<.04,ell:Math.random()<.05,attendance:100,reading:rnd(45,75),math:rnd(45,75),status:"Active",history:[`2027: Entered Kindergarten`]});}
 activeEmployees().forEach(e=>{e.age++;e.experience++;e.yearsInDistrict++;if(e.category==="Teacher")e.salary=teacherSalary(e.degree,e.experience);if(e.leave&&e.leave.returnDate<=state.date)e.leave=null;});
 let startYear=parseInt(oldYear,10)||2026,nextYear=startYear+1;state.schoolYear=`${nextYear}–${String(nextYear+1).slice(-2)}`;state.date=`${nextYear}-08-12`;state.instructionalDay=1;state.fiscalHistory.push({year:oldYear,enrollment:enrollment(),payroll:payroll(),building:buildingScore()});assignStudents(state);state.inbox.unshift(msg("District Office","New school year opened",`${state.schoolYear} has started. Review staffing, enrollment, and classroom assignments.`,"high",["Open HR","Open Reports"]));log(`Started new school year ${state.schoolYear}.`);simulateCalloffs();
}

function runSystemCheck(){
 let checks=[
  ["Students assigned",state.students.filter(s=>s.status==="Active"&&!s.room).length===0],
  ["Position control loaded",state.positions.length>0],
  ["Room map loaded",state.rooms.length>=30],
  ["Save system available",typeof localStorage!=="undefined"],
  ["Budget finite",Number.isFinite(availableOperating())],
  ["HR application pipeline",Array.isArray(state.applications)],
  ["Inbox",Array.isArray(state.inbox)],
  ["Work orders",Array.isArray(state.workOrders)]
 ];openModal("System Check",`<div class="app-sheet">${checks.map(([n,ok])=>`<div class="position-row"><span>${ok?"✅":"❌"} ${n}</span><strong>${ok?"Pass":"Needs Attention"}</strong></div>`).join("")}</div>`);
}
function importLegacySave(old){
 let fresh=initialState();
 if(old.year){let y=Number(old.year)||2026;fresh.schoolYear=`${y}–${String(y+1).slice(-2)}`;fresh.date=`${y}-08-13`;}
 if(Number(old.budget)>0)fresh.finance.operatingBudget=Number(old.budget);
 if(Number(old.boardRelationship)>=0)fresh.boardMembers?.forEach(m=>m.support=clamp(Math.round(Number(old.boardRelationship)+rnd(-6,6)),45,95));
 if(Array.isArray(old.employees)&&old.employees.length){
   fresh.employees=old.employees.filter(e=>!["Resigned","Retired","Terminated"].includes(e.status)).map((e,i)=>({
     id:`LEGEMP_${e.id||i}`,name:e.name||`Employee ${i+1}`,category:e.category||"Staff",position:e.position||"Staff",assignment:e.assignment||"Lincoln Elementary",room:e.room||null,experience:Number(e.experience||0),yearsInDistrict:Number(e.yearsInDistrict||Math.max(1,e.experience||1)),age:Number(e.age||30),degree:e.degree||"N/A",license:e.license||"N/A",fte:1,schedule:e.category==="Operations"?"2:30 PM–11:00 PM":e.category==="Cafeteria"?"6:30 AM–2:00 PM":e.category==="Administration"?"7:00 AM–4:00 PM":"7:30 AM–3:15 PM",salary:Number(e.salary||42000),contract:e.contract||"Professional",status:e.status==="Active"?"Active":"Active",absence:null,leave:e.leave||null,morale:Number(e.morale||85),performance:Number(e.skill||e.performance||84),history:Array.isArray(e.history)?e.history:["Imported from previous Lincoln save"],equipment:["ID badge","Building key"]
   }));
   GRADES.forEach(g=>{let rooms=Object.entries(classroomGradeByRoom).filter(([,rg])=>rg===g).map(([rid])=>rid);let ts=fresh.employees.filter(e=>e.category==="Teacher"&&(e.grade===g||e.assignment===`Grade ${g}`||String(e.position).includes(`Grade ${g}`)));ts.forEach((e,i)=>{e.assignment=`Grade ${g}`;e.position=`Grade ${g} Teacher`;e.room=rooms[i]||null;});});
   const supportMap={"Principal":"OFFICE","Assistant Principal":"OFFICE","School Secretary":"OFFICE","School Nurse":"NURSE","School Counselor":"COUNSEL","School Psychologist":"COUNSEL","Library / Media Teacher":"LIB","PE Teacher":"GYM","Music Teacher":"MUSIC","Art Teacher":"ART","Special Education Teacher":"SPED","Special Education Para":"SPED","Head Custodian":"CUST","Custodian":"CUST","Cafeteria Manager":"CAF","Cafeteria Assistant":"CAF","School Technology Specialist":"TECH"};
   fresh.employees.forEach(e=>{if(e.category!=="Teacher"&&supportMap[e.position])e.room=supportMap[e.position];});
 }
 if(Array.isArray(old.students)&&old.students.length){
   fresh.students=[];fresh.families=[];let famByLast={};
   old.students.filter(s=>s.status!=="Withdrawn").forEach((s,i)=>{let parts=String(s.name||`Student ${i+1}`).trim().split(/\s+/),last=parts.pop()||"Family",first=parts.join(" ")||"Student";let f=famByLast[last];if(!f){f={id:uid("fam"),name:`${last} Family`,lastName:last,engagement:"Typical",addressZone:pick(fresh.neighborhoods).name,phone:"555-555-0101",history:["Imported from previous Lincoln save"]};fresh.families.push(f);famByLast[last]=f;}fresh.students.push({id:`LEGSTU_${s.id||i}`,first,last,grade:String(s.grade),room:null,familyId:f.id,transport:pick(["Bus","Bus","Car rider","Walker"]),iep:!!s.iep,plan504:!!s.plan504,ell:false,attendance:Number(s.attendance||95),reading:rnd(55,92),math:rnd(55,92),status:"Active",history:Array.isArray(s.history)?s.history:["Imported from previous Lincoln save"]});});
   assignStudents(fresh);
 }
 fresh.activity.unshift("Imported staff, students, school year, and budget from the previous Lincoln simulator save.");
 return fresh;
}

function save(silent=false){localStorage.setItem(SAVE_KEY,JSON.stringify(state));if(!silent)toast("Game saved in this browser.");}
function load(){
 let raw=localStorage.getItem(SAVE_KEY);if(raw){try{state=JSON.parse(raw);toast("Saved game loaded.");render();return;}catch{}}
 let legacy=localStorage.getItem(LEGACY_KEY);if(legacy){try{let old=JSON.parse(legacy);state=importLegacySave(old);toast("Previous Lincoln save imported into the realism build.");render();return;}catch(err){console.error(err);}}
 toast("No saved realism game found.");
}
function showView(v){
 document.querySelectorAll(".view").forEach(x=>x.classList.remove("active-view"));
 document.querySelectorAll(".nav-btn").forEach(x=>x.classList.toggle("active",x.dataset.view===v));
 const target=$("view-"+v);if(target)target.classList.add("active-view");
 if(v==='building')safeSection('building',renderBuilding);
}


/* =========================================================
   LINCOLN ELEMENTARY V5.0 — LIVING SCHOOL SYSTEMS
   ========================================================= */
function ensureV5State(){
 state.settings=state.settings||{};
 if(state.settings.showTeachers===undefined)state.settings.showTeachers=true;
 state.simMinutes=Number.isFinite(state.simMinutes)?state.simMinutes:360;
 state.dailyCounters=state.dailyCounters||{late:0,earlyDismissal:0,nurse:0,officeReferrals:0,visitors:0,parentCalls:0,lunches:0};
 state.liveActivity=state.liveActivity||[];
 state.officeQueue=state.officeQueue||[];
 state.nurseLog=state.nurseLog||[];
 state.disciplineLog=state.disciplineLog||[];
 state.schoolHistory=state.schoolHistory||[
  {date:'2026-08-13',text:'Lincoln Elementary opened the 2026–27 school year.'}
 ];
 state.pto=state.pto||{balance:12850,volunteers:34,events:[{name:'Back-to-School Night',date:'2026-08-27',status:'Planned'},{name:'Fall Family Night',date:'2026-10-08',status:'Planned'}]};
 state.summerReadiness=state.summerReadiness||{classroomsReady:21,workOrdersRemaining:state.workOrders.filter(w=>w.status==='Open').length,devicesReady:94,positionsFilled:Math.round(activeEmployees().length/(activeEmployees().length+state.positions.filter(p=>p.filled<p.authorized).length)*100),transportationReady:92};
 state.inbox=state.inbox||[];
 state.inbox.forEach(m=>{
   m.thread=m.thread||[{id:uid('mail'),sender:m.from,body:m.body,date:m.date||state.date,direction:'in'}];
   m.subject=m.subject||'(No subject)';m.read=!!m.read;m.status=m.status||'Open';
 });
}
function mins12(m){let h=Math.floor(m/60)%24,mm=m%60,ap=h>=12?'PM':'AM';let hh=h%12||12;return `${hh}:${String(mm).padStart(2,'0')} ${ap}`;}
function schoolPhase(m=state.simMinutes){
 if(m<390)return 'Early building operations';
 if(m<450)return 'Staff arrival / breakfast preparation';
 if(m<490)return 'Teacher arrival & morning preparation';
 if(m<515)return 'Student arrival';
 if(m<690)return 'Morning instruction';
 if(m<810)return 'Lunch / recess / midday services';
 if(m<875)return 'Afternoon instruction';
 if(m<920)return 'Dismissal & family pickup';
 if(m<1020)return 'After-school / teacher work time';
 return 'Evening custodial operations';
}
function classroomActivity(room){
 if(!room?.grade)return room?.name||'';
 let m=state.simMinutes,g=room.grade;
 if(m<450)return 'Room preparation';
 if(m<490)return 'Teacher planning';
 if(m<515)return 'Student arrival';
 if(m<570)return g==='K'?'Morning meeting / literacy':'Morning meeting / ELA';
 if(m<640)return 'ELA / literacy block';
 if(m<690)return Number(g||0)%2===0?'Math':'Specials / planning';
 if(m<750)return ['K','1','2'].includes(g)?'Lunch / recess':'Math / intervention';
 if(m<810)return ['K','1','2'].includes(g)?'Math / centers':'Lunch / recess';
 if(m<860)return 'Science / social studies';
 if(m<875)return 'Pack-up / closing circle';
 if(m<920)return 'Dismissal';
 return 'Classroom closed';
}
function liveEvent(text,type='info'){state.liveActivity.unshift({time:mins12(state.simMinutes),text,type});state.liveActivity=state.liveActivity.slice(0,14);}
function resetLivingDay(){state.simMinutes=360;state.dailyCounters={late:0,earlyDismissal:0,nurse:0,officeReferrals:0,visitors:0,parentCalls:0,lunches:0};state.liveActivity=[];state.officeQueue=[];state.nurseLog=[];state.disciplineLog=[];liveEvent('Head custodian opened the building.');}
function generateLivingEvents(step=30){
 let m=state.simMinutes,c=state.dailyCounters;
 if(m>=450&&m<540&&Math.random()<.6){let n=rnd(1,4);c.late+=n;liveEvent(`${n} student${n>1?'s':''} checked in late at the front office.`,'office');}
 if(m>=500&&m<900&&Math.random()<.55){let student=pick(state.students.filter(s=>s.status==='Active'));let reasons=['headache','stomach ache','minor playground scrape','scheduled medication','not feeling well'];let reason=pick(reasons);c.nurse++;state.nurseLog.unshift({time:mins12(m),student:`${student.first} ${student.last}`,reason});liveEvent(`${student.first} ${student.last} visited the nurse: ${reason}.`,'nurse');}
 if(m>=520&&m<880&&Math.random()<.3){let student=pick(state.students.filter(s=>s.status==='Active'));let reason=pick(['classroom disruption','repeated redirection','peer conflict','unsafe hallway behavior']);c.officeReferrals++;state.disciplineLog.unshift({time:mins12(m),student:`${student.first} ${student.last}`,reason});state.officeQueue.unshift(`${student.first} ${student.last} — ${reason}`);liveEvent(`Office referral: ${student.first} ${student.last} — ${reason}.`,'office');}
 if(m>=540&&m<900&&Math.random()<.28){c.parentCalls++;let fam=pick(state.families);state.officeQueue.unshift(`Parent call — ${fam.name}`);liveEvent(`Front office received a parent call from the ${fam.name}.`,'office');}
 if(m>=650&&m<820){c.lunches=Math.max(c.lunches,Math.round(enrollment()*(.72+Math.random()*.12)));}
 if(m>=700&&m<900&&Math.random()<.18){c.earlyDismissal++;let student=pick(state.students.filter(s=>s.status==='Active'));liveEvent(`${student.first} ${student.last} signed out for early dismissal.`,'office');}
 if(Math.random()<.12){let room=pick(state.rooms.filter(r=>r.type==='classroom'));liveEvent(`${room.id}: ${pick(['teacher requested tech support','student support team checked in','principal walkthrough completed','small-group intervention underway'])}.`,'room');}
}
function advanceMinutes(amount=30){
 ensureV5State();if(state.simMinutes>=1080)return toast('The school day is complete. Advance Day to begin the next date.');
 state.simMinutes=Math.min(1080,state.simMinutes+amount);generateLivingEvents(amount);render();
}
function nextScheduledEvent(){
 ensureV5State();let marks=[390,450,490,515,570,640,690,750,810,860,875,920,1020,1080];let next=marks.find(x=>x>state.simMinutes)||1080;state.simMinutes=next;generateLivingEvents(next-state.simMinutes);render();
}
function finishLivingDay(){
 ensureV5State();while(state.simMinutes<1080){state.simMinutes=Math.min(1080,state.simMinutes+60);generateLivingEvents(60);}liveEvent('Evening custodial operations completed. Building secured.');
 state.schoolHistory.unshift({date:state.date,text:`Completed instructional day ${state.instructionalDay}: ${state.dailyCounters.nurse} nurse visits, ${state.dailyCounters.officeReferrals} office referrals, ${state.absences.length} staff absences.`});render();
}

const renderV32=render;
render=function(){ensureV5State();renderV32();safeSection('v5extras',renderV5Extras);};
const renderCommandV32=renderCommand;
renderCommand=function(){ensureV5State();renderCommandV32();renderLivingDay();};
function renderLivingDay(){
 const t=$('statusTime');if(t)t.textContent=mins12(state.simMinutes);
 if($('liveClock'))$('liveClock').textContent=mins12(state.simMinutes);
 if($('dayPhase'))$('dayPhase').innerHTML=`<strong>${schoolPhase()}</strong><span> • ${fmtDate(state.date)}</span>`;
 if($('liveDayKpis'))$('liveDayKpis').innerHTML=[['Late arrivals',state.dailyCounters.late],['Nurse visits',state.dailyCounters.nurse],['Office referrals',state.dailyCounters.officeReferrals],['Early dismissals',state.dailyCounters.earlyDismissal]].map(x=>`<div class="stat-box"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join('');
 if($('liveActivity'))$('liveActivity').innerHTML=(state.liveActivity.length?state.liveActivity:[{time:mins12(state.simMinutes),text:'No live events yet.'}]).map(x=>`<div class="live-event"><strong>${x.time}</strong><span>${x.text}</span></div>`).join('');
 if($('liveQueues'))$('liveQueues').innerHTML=`<div class="compact-item"><strong>Front Office Queue:</strong> ${state.officeQueue.length}</div><div class="compact-item"><strong>Nurse Log:</strong> ${state.nurseLog.length} visit(s)</div><div class="compact-item"><strong>Parent Calls:</strong> ${state.dailyCounters.parentCalls}</div><div class="compact-item"><strong>Lunch Count:</strong> ${state.dailyCounters.lunches||'Pending'}</div>`;
}

renderBuilding=function(){
 ensureV5State();const map=$('schoolMap');if(!map)return;map.innerHTML='';
 for(const [id,name,type,col,row,w,h] of ROOM_LAYOUT){
  let b=document.createElement(type==='circulation'?'div':'button');b.className=`room-map ${type}`;b.style.gridColumn=`${col}/span ${w}`;b.style.gridRow=`${row}/span ${h}`;
  if(type==='circulation'){b.innerHTML=`<span class="rname">${name}</span>`;map.appendChild(b);continue;}
  const r=roomById(id);if(!r)continue;let sev=roomSeverity(r);if(sev)b.classList.add(sev);
  let count=r.grade?studentsInRoom(id).length:null,t=r.grade?teacherForRoom(id):null,meta=[];
  if(r.grade&&state.settings.showTeachers)meta.push(t?t.name:'VACANT');
  if(r.grade&&state.settings.showCounts)meta.push(`${count}/${r.capacity} students`);
  if(state.settings.showTemps)meta.push(`${r.temp}°F`);if(state.settings.showCleaning)meta.push(`Clean ${r.cleanliness}%`);
  let openW=r.workOrders.filter(x=>state.workOrders.find(w=>w.id===x&&w.status==='Open')).length;
  let activity=r.grade?classroomActivity(r):name;
  b.innerHTML=`<span class="rid">${id}</span><span class="rname">${r.grade?`Grade ${r.grade}`:name}</span>${r.grade?`<span class="teacher-map ${t?'':'teacher-vacant'}">${state.settings.showTeachers?(t?t.name:'VACANT'):'&nbsp;'}</span>`:''}<span class="activity-map">${activity}</span><span class="rmeta">${meta.filter(x=>!state.settings.showTeachers||x!==(t?t.name:'VACANT')).join(' • ')}</span>${state.settings.showOrders&&openW?`<span class="work-badge">🔧 ${openW}</span>`:''}`;
  b.addEventListener('click',()=>{state.selectedRoom=id;renderBuilding();});map.appendChild(b);
 }
 if($('capacityChip'))$('capacityChip').textContent=`${mins12(state.simMinutes)} • Enrollment ${enrollment()} / 480 • ${Math.round(enrollment()/480*100)}% utilized`;renderRoomInspector();
};

renderInbox=function(){
 ensureV5State();let list=state.inbox.slice().sort((a,b)=>(a.read===b.read?0:a.read?1:-1));
 if($('inboxList'))$('inboxList').innerHTML=list.map(m=>`<div class="message-row ${m.read?'':'unread'}" data-msg="${m.id}"><div class="message-head"><span><i class="priority-dot ${m.priority}"></i><strong>${m.from}</strong></span><span class="muted">${m.read?'Read':'New'}</span></div><div class="subject">${m.subject}</div><div class="muted">${(m.thread?.at(-1)?.body||m.body).slice(0,95)}${(m.thread?.at(-1)?.body||m.body).length>95?'…':''}</div><div class="thread-count">${m.thread?.length||1} message${(m.thread?.length||1)===1?'':'s'}</div></div>`).join('');
 document.querySelectorAll('[data-msg]').forEach(b=>b.onclick=()=>{state.selectedMessage=b.dataset.msg;let m=state.inbox.find(x=>x.id===state.selectedMessage);if(m)m.read=true;renderInbox();});
 let m=state.inbox.find(x=>x.id===state.selectedMessage);
 if($('messageDetail'))$('messageDetail').innerHTML=m?`<div class="email-thread"><div class="email-thread-head"><h3>${m.subject}</h3><span class="badge ${m.status==='Completed'?'good':'info'}">${m.status}</span></div>${m.thread.map(t=>`<div class="email-bubble ${t.direction==='out'?'sent':'received'}"><div class="email-meta"><strong>${t.direction==='out'?'You — Principal':t.sender}</strong><span>${t.time||t.date||''}</span></div><div>${String(t.body).replace(/\n/g,'<br>')}</div></div>`).join('')}</div><div class="actions"><button class="primary" data-msgact="Reply">Reply</button>${(m.actions||[]).filter(a=>a!=='Reply').map(a=>`<button class="secondary" data-msgact="${a}">${a}</button>`).join('')}<button class="secondary" data-msgact="Archive">Archive</button></div>`:"<span class='muted'>Select a message.</span>";
 document.querySelectorAll('[data-msgact]').forEach(b=>b.onclick=()=>handleMessageAction(b.dataset.msgact));if($('unreadBadge'))$('unreadBadge').textContent=state.inbox.filter(x=>!x.read).length||'';
};
function openReplyComposer(m){
 openModal(`Reply — ${m.subject}`,`<div class="email-compose"><div class="compose-to"><strong>To:</strong> ${m.from}</div><div class="compose-to"><strong>Subject:</strong> Re: ${m.subject}</div><textarea id="emailReplyBody" rows="8" placeholder="Type your response..."></textarea><div class="compose-helper">Your reply will remain permanently attached to this conversation thread.</div><div class="actions"><button id="sendReplyBtn" class="primary">Send Reply</button><button id="cancelReplyBtn" class="secondary">Cancel</button></div></div>`);
 $('sendReplyBtn').onclick=()=>{let body=$('emailReplyBody').value.trim();if(!body)return toast('Type a reply before sending.');m.thread.push({id:uid('mail'),sender:'Principal',body,date:state.date,time:mins12(state.simMinutes),direction:'out'});m.status='Replied';log(`Replied to ${m.from}: ${m.subject}.`);closeModal();toast('Email reply sent and saved to the thread.');render();};$('cancelReplyBtn').onclick=closeModal;
}
function composeEmail(){
 openModal('Compose Email',`<form id="composeForm"><div class="form-grid"><label>To<select id="composeTo"><option>Superintendent Office</option><option>HR</option><option>Facilities</option><option>Technology</option><option>School Board Office</option><option>Transportation</option><option>All Staff</option></select></label><label>Priority<select id="composePriority"><option value="low">Normal</option><option value="medium">Important</option><option value="high">Urgent</option></select></label><label class="full">Subject<input id="composeSubject" required></label><label class="full">Message<textarea id="composeBody" rows="7" required></textarea></label></div><div class="actions"><button class="primary">Send Email</button></div></form>`);$('composeForm').onsubmit=e=>{e.preventDefault();let to=$('composeTo').value,sub=$('composeSubject').value.trim(),body=$('composeBody').value.trim();let m=msg(to,sub,body,$('composePriority').value,[]);m.read=true;m.status='Sent';m.thread=[{id:uid('mail'),sender:'Principal',body,date:state.date,time:mins12(state.simMinutes),direction:'out'}];state.inbox.unshift(m);state.selectedMessage=m.id;log(`Sent email to ${to}: ${sub}.`);closeModal();render();};
}
handleMessageAction=function(act){let m=state.inbox.find(x=>x.id===state.selectedMessage);if(!m)return;if(act==='Reply')return openReplyComposer(m);if(act==='Archive'){m.status='Archived';state.inbox=state.inbox.filter(x=>x.id!==m.id);state.selectedMessage=null;}else{m.status='Completed';if(act==='Begin Onboarding'){let a=state.applications.find(x=>x.status==='Offer Accepted'&&(m.subject.includes(x.name)||m.body.includes(x.name)));if(a){a.status='Onboarding';a.onboardingDays=0;}}log(`Inbox action completed: ${act} — ${m.subject}.`);if(act.includes('HR'))showView('hr');if(act.includes('Operations'))showView('operations');if(act.includes('Reports'))showView('reports');if(act==='Create PO')createPO();if(act==='Create Work Order')openWorkOrderModal();}render();};

function renderV5Extras(){
 if($('schoolHistoryBoard'))$('schoolHistoryBoard').innerHTML=(state.schoolHistory.length?state.schoolHistory:[{date:state.date,text:'No history yet.'}]).slice(0,12).map(h=>`<div class="history-item"><strong>${h.date}</strong><span>${h.text}</span></div>`).join('');
 if($('communityBoard'))$('communityBoard').innerHTML=`<div class="stat-grid two"><div class="stat-box"><span>PTO Balance</span><strong>${money(state.pto.balance)}</strong></div><div class="stat-box"><span>Approved Volunteers</span><strong>${state.pto.volunteers}</strong></div></div>${state.pto.events.map(e=>`<div class="position-row"><span><strong>${e.name}</strong><br><span class="muted">${e.date}</span></span><span class="badge info">${e.status}</span></div>`).join('')}`;
 state.summerReadiness.workOrdersRemaining=state.workOrders.filter(w=>w.status==='Open').length;state.summerReadiness.positionsFilled=Math.round(activeEmployees().length/(activeEmployees().length+Math.max(1,state.positions.filter(p=>p.filled<p.authorized).length))*100);
 if($('summerReadiness'))$('summerReadiness').innerHTML=Object.entries({'Classrooms Ready':`${state.summerReadiness.classroomsReady}/21`,'Positions Filled':`${state.summerReadiness.positionsFilled}%`,'Devices Ready':`${state.summerReadiness.devicesReady}%`,'Transportation Ready':`${state.summerReadiness.transportationReady}%`,'Open Work Orders':state.summerReadiness.workOrdersRemaining}).map(([k,v])=>`<div class="readiness-row"><span>${k}</span><strong>${v}</strong></div>`).join('');
}

const advanceDayV32=advanceDay;
advanceDay=function(){ensureV5State();let prior=state.instructionalDay;advanceDayV32();resetLivingDay();state.schoolHistory.unshift({date:state.date,text:`Opened instructional day ${state.instructionalDay}; prior day ${prior} closed.`});render();};
const runSchoolDayV32=runSchoolDay;
runSchoolDay=function(){ensureV5State();runSchoolDayV32();finishLivingDay();};

const loadV32=load;
load=function(){
 let raw=localStorage.getItem(SAVE_KEY);if(raw){try{state=JSON.parse(raw);ensureV5State();toast('V5 saved game loaded.');render();return;}catch(err){console.error(err)}}
 let v3=localStorage.getItem(V3_SAVE_KEY);if(v3){try{state=JSON.parse(v3);ensureV5State();state.schoolHistory.unshift({date:state.date,text:'Upgraded existing Lincoln save to Living School V5.0.'});toast('Your V3.2 game was upgraded to V5.0. Save now to create a V5 save.');render();return;}catch(err){console.error(err)}}
 return loadV32();
};

function bindUI(){
 document.querySelectorAll(".nav-btn").forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
 if($("modalClose"))$("modalClose").onclick=closeModal;
 if($("modal"))$("modal").addEventListener("click",e=>{if(e.target===$("modal"))closeModal();});
 const bind=(id,fn)=>{const el=$(id);if(el)el.addEventListener('click',fn)};
 bind("saveBtn",()=>save(false));bind("loadBtn",load);bind("advanceDayBtn",advanceDay);bind("runDayBtn",runSchoolDay);
 bind("postVacancyQuick",postVacancyModal);bind("postVacancyBtn",postVacancyModal);bind("enrollStudentQuick",openEnrollFamily);bind("enrollStudentBtn",openEnrollFamily);
 bind("newWorkOrderQuick",()=>openWorkOrderModal());bind("newWorkOrderBtn",()=>openWorkOrderModal());bind("weatherDecisionQuick",weatherDecision);bind("fieldTripQuick",fieldTrip);
 bind("boardRequestQuick",addBoardIssue);bind("newBoardIssueBtn",addBoardIssue);bind("requestFteBtn",requestFTE);bind("newPurchaseBtn",createPO);
 bind("refreshAbsencesBtn",simulateCalloffs);bind("addMeetingBtn",addMeeting);bind("markAllReadBtn",()=>{state.inbox.forEach(m=>m.read=true);render();});bind("systemCheckBtn",runSystemCheck);
 bind("advance30Btn",()=>advanceMinutes(30));bind("nextEventBtn",nextScheduledEvent);bind("finishDayBtn",finishLivingDay);bind("composeEmailBtn",composeEmail);
 ["studentGradeFilter","studentNeedFilter"].forEach(id=>{if($(id))$(id).onchange=renderStudents});if($("studentSearch"))$("studentSearch").oninput=renderStudents;
 ["staffCategoryFilter","staffStatusFilter"].forEach(id=>{if($(id))$(id).onchange=renderStaff});if($("staffSearch"))$("staffSearch").oninput=renderStaff;
 ["showTeachers","showCounts","showTemps","showCleaning","showOrders"].forEach(id=>{if($(id))$(id).onchange=e=>{state.settings[id]=e.target.checked;renderBuilding();}});
 document.querySelectorAll("[data-room-filter]").forEach(cb=>cb.onchange=()=>{document.querySelectorAll(`.room-map.${cb.dataset.roomFilter}`).forEach(x=>x.style.display=cb.checked?"":"none");});
}
function startupFailure(err){
 console.error('Lincoln startup failed',err);
 const app=document.getElementById('app');if(!app)return;
 const box=document.createElement('div');box.className='startup-error';box.innerHTML=`<strong>Lincoln recovered from a startup problem.</strong><br>${String(err?.message||err)}<br><small>Tabs remain available; use Reports → System Check if a section still has an issue.</small>`;app.prepend(box);
}
function initApp(){
 try{
   const vb=document.getElementById("versionBadge");
   if(vb)vb.textContent=`Version ${GAME_VERSION} • Build ${GAME_BUILD}`;
   bindUI();render();
 }catch(err){startupFailure(err);try{bindUI()}catch{}}
}
window.addEventListener('error',e=>startupFailure(e.error||e.message));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initApp,{once:true});else initApp();
