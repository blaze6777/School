const GAME_VERSION="8.1";
const GAME_BUILD="2026-09-02 14:32 ET";

const GRADES=["K","1","2","3","4","5","6"];
const TARGETS={K:20,1:22,2:22,3:24,4:24,5:24,6:24};
const SAVE_KEY="lincolnElementarySimulatorLivingWorldV85";
const V84_SAVE_KEY="lincolnElementarySimulatorSchoolDayV84";
const V83_SAVE_KEY="lincolnElementarySimulatorLivingBuildingV83";
const V82_SAVE_KEY="lincolnElementarySimulatorStudentsV82";
const V81_SAVE_KEY="lincolnElementarySimulatorPeopleV81";
const V7_SAVE_KEY="lincolnElementarySimulatorPlayableV7";
const V6_SAVE_KEY="lincolnElementarySimulatorDistrictV6";
const V5_SAVE_KEY="lincolnElementarySimulatorLivingV5";
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
 ensureV5State();let marks=[390,450,490,515,570,640,690,750,810,860,875,920,1020,1080];let next=marks.find(x=>x>state.simMinutes)||1080;let delta=next-state.simMinutes;state.simMinutes=next;generateLivingEvents(delta);render();
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



/* =========================================================
   LINCOLN ELEMENTARY V6.0 — DISTRICT + WHO'S WHERE
   ========================================================= */
function ensureV6State(){
  ensureV5State();
  state.version=6;
  state.district=state.district||{
    name:"Lincoln Community Schools",
    schools:[
      {id:"LIN",name:"Lincoln Elementary",level:"K–6",enrollment:enrollment(),capacity:480,rating:state.metrics.reputation,principal:"You"},
      {id:"PRA",name:"Prairie View Elementary",level:"K–6",enrollment:396,capacity:450,rating:79,principal:"Dr. Erin Cole"},
      {id:"RIV",name:"Riverside Elementary",level:"K–6",enrollment:421,capacity:470,rating:83,principal:"Marcus Hill"},
      {id:"LMS",name:"Lincoln Middle School",level:"7–8",enrollment:612,capacity:700,rating:81,principal:"Dana Brooks"},
      {id:"LHS",name:"Lincoln High School",level:"9–12",enrollment:1284,capacity:1450,rating:84,principal:"Angela Reed"}
    ],
    departments:["Superintendent Office","Human Resources","Curriculum & Instruction","Special Education","Facilities","Technology","Food Service","Transportation","Finance"],
    buses:24,driversAvailable:22,routes:21,onTime:94,
    career:{reputation:state.metrics.reputation,yearsAsPrincipal:1,nextRole:"District Director / larger building"}
  };
  state.transportation=state.transportation||{lateBuses:[],dailyChanges:0};
  state.students.forEach((s,i)=>{
    if(!s.amTransport)s.amTransport=(i%5===0?"Car Rider":i%11===0?"Walker":`Bus ${10+(i%12)}`);
    if(!s.pmTransport)s.pmTransport=(i%7===0?"Daycare":s.amTransport);
  });
}
function classroomHome(student){return student.room||student.classroom||student.roomId||"";}
function gradeSpecialRoom(g){
  const order=["GYM","MUSIC","ART","LIB"];
  const idx=(GRADES.indexOf(String(g))+Math.floor(state.instructionalDay/2))%order.length;
  return order[idx];
}
function currentStudentLocation(s){
  const m=state.simMinutes, home=classroomHome(s);
  if(m<490)return "Not on campus";
  if(m<515)return "ENTRY";
  if(m>=875&&m<920)return "ENTRY";
  if(m>=920)return "Off campus";
  const g=String(s.grade);
  if(m>=640&&m<690 && !["K","1","2"].includes(g)) return gradeSpecialRoom(g);
  if(m>=690&&m<750 && ["K","1","2"].includes(g)) return "CAF";
  if(m>=750&&m<810 && !["K","1","2"].includes(g)) return "CAF";
  return home;
}
function currentEmployeeLocation(e){
  const m=state.simMinutes;
  if(e.status==="Absent"||e.leave)return "Off campus";
  if(e.category==="Teacher"){
    if(m<450)return "Off campus";
    if(m>=640&&m<690 && !["K","1","2"].includes(String((e.assignment||"").replace("Grade ",""))))return e.room||"OFFICE";
    if(m>=875&&m<920)return "ENTRY";
    return e.room||"OFFICE";
  }
  if(e.position.includes("Principal")&&m>=490&&m<920)return m>=875?"ENTRY":"OFFICE";
  if(e.category==="Cafeteria")return "CAF";
  if(e.category==="Operations")return "CUST";
  return e.room||"OFFICE";
}
function locationLabel(id){
  if(!id||id==="Off campus"||id==="Not on campus")return id||"Unknown";
  const r=roomById(id); if(r)return `${id} — ${r.name}`;
  const layout=ROOM_LAYOUT.find(x=>x[0]===id);return layout?`${id} — ${layout[1]}`:id;
}
function roomOccupancy(id){
  return state.students.filter(s=>s.status==="Active"&&currentStudentLocation(s)===id).length;
}
function renderWhoWhere(){
  const box=$("whoWhereResults"),input=$("whoWhereSearch"); if(!box||!input)return;
  const q=input.value.trim().toLowerCase();
  if(!q){box.innerHTML=`<div class="compact-item"><strong>${mins12(state.simMinutes)}</strong><br>${schoolPhase()}</div><div class="muted small">Type a student or staff name.</div>`;return;}
  let people=[];
  state.students.filter(s=>`${s.first} ${s.last}`.toLowerCase().includes(q)).slice(0,5).forEach(s=>people.push({name:`${s.first} ${s.last}`,role:`Grade ${s.grade} student`,loc:currentStudentLocation(s),extra:`AM ${s.amTransport} • PM ${s.pmTransport}`}));
  activeEmployees().filter(e=>e.name.toLowerCase().includes(q)).slice(0,5).forEach(e=>people.push({name:e.name,role:e.position,loc:currentEmployeeLocation(e),extra:e.schedule}));
  box.innerHTML=people.length?people.slice(0,8).map(p=>`<button class="who-person" data-loc="${p.loc}"><strong>${p.name}</strong><span>${p.role}</span><span>📍 ${locationLabel(p.loc)}</span><small>${p.extra}</small></button>`).join(""):`<div class="muted small">No matching person found.</div>`;
  box.querySelectorAll("[data-loc]").forEach(b=>b.onclick=()=>{let loc=b.dataset.loc;if(roomById(loc)){state.selectedRoom=loc;renderBuilding();}});
}
function renderDistrict(){
  ensureV6State();
  state.district.schools[0].enrollment=enrollment();state.district.schools[0].rating=state.metrics.reputation;
  const total=state.district.schools.reduce((a,s)=>a+s.enrollment,0);
  if($("districtKpis"))$("districtKpis").innerHTML=[
    ["District Enrollment",total.toLocaleString()],["Schools",state.district.schools.length],["Buses",state.district.buses],["On-time Routes",`${state.district.onTime}%`]
  ].map(x=>`<div class="stat-box"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join("");
  if($("districtSchools"))$("districtSchools").innerHTML=state.district.schools.map(s=>`<div class="district-school ${s.id==="LIN"?"current-school":""}"><div><strong>${s.name}</strong><span>${s.level} • Principal: ${s.principal}</span></div><div class="school-numbers"><strong>${s.enrollment}</strong><span>of ${s.capacity}</span></div><div class="progress"><i style="width:${Math.min(100,s.enrollment/s.capacity*100)}%"></i></div><small>${Math.round(s.enrollment/s.capacity*100)}% utilized • Reputation ${s.rating}</small></div>`).join("");
  if($("districtDepartments"))$("districtDepartments").innerHTML=state.district.departments.map(d=>`<div class="compact-item">${d}</div>`).join("");
  if($("districtNeighborhoods"))$("districtNeighborhoods").innerHTML=state.neighborhoods.map(n=>`<div class="position-row"><span><strong>${n.name}</strong><br><span class="muted">${n.students} Lincoln students</span></span><span class="badge ${n.growth>2?"warn":"info"}">${n.growth>0?"+":""}${n.growth}% growth</span></div>`).join("");
  if($("transportSnapshot"))$("transportSnapshot").innerHTML=`<div class="inspector-grid"><div class="inspector-stat"><span>Routes</span><strong>${state.district.routes}</strong></div><div class="inspector-stat"><span>Drivers</span><strong>${state.district.driversAvailable}/${state.district.buses}</strong></div></div><div class="compact-item"><strong>${state.district.onTime}%</strong> of routes on time today.<br>${state.students.filter(s=>String(s.amTransport).startsWith("Bus")).length} Lincoln students assigned to AM buses.</div>`;
  if($("careerSnapshot"))$("careerSnapshot").innerHTML=`<div class="compact-item"><strong>Principal Reputation</strong><br>${state.metrics.reputation}/100</div><div class="compact-item"><strong>Years at Lincoln</strong><br>${state.district.career.yearsAsPrincipal}</div><div class="compact-item"><strong>Potential Next Step</strong><br>${state.district.career.nextRole}</div>`;
}

const renderBeforeV6=render;
render=function(){ensureV6State();renderBeforeV6();safeSection("district",renderDistrict);safeSection("whowhere",renderWhoWhere);};

const renderBuildingBeforeV6=renderBuilding;
renderBuilding=function(){
  ensureV6State();renderBuildingBeforeV6();
  document.querySelectorAll(".room-map").forEach(b=>{
    const id=b.querySelector(".rid")?.textContent;if(!id)return;
    const occ=roomOccupancy(id);
    const activity=b.querySelector(".activity-map");
    if(activity && roomById(id)?.grade){
      const home=studentsInRoom(id).length;
      if(occ!==home)activity.textContent=`${classroomActivity(roomById(id))} • ${occ} currently here`;
    }
  });
  renderWhoWhere();
};

const loadBeforeV6=load;
load=function(){
  let raw=localStorage.getItem(SAVE_KEY);
  if(raw){try{state=JSON.parse(raw);ensureV6State();toast("V6 saved game loaded.");render();return;}catch(err){console.error(err)}}
  let v5=localStorage.getItem(V5_SAVE_KEY);
  if(v5){try{state=JSON.parse(v5);ensureV6State();state.schoolHistory.unshift({date:state.date,text:"Upgraded Lincoln from Living School V5.0 to District Simulation V6.0."});toast("Your V5 game was upgraded to V6.0. Save now to create a V6 save.");render();return;}catch(err){console.error(err)}}
  return loadBeforeV6();
};

const bindUIBeforeV6=bindUI;
bindUI=function(){
  bindUIBeforeV6();
  const ww=$("whoWhereSearch");if(ww)ww.addEventListener("input",renderWhoWhere);
};




/* ========================================================= V7 PLAYABLE SCHOOL ========================================================= */
function ensureV7State(){ensureV6State();state.version=7;state.play=state.play||{running:false,speed:1,principalLoc:"OFFICE",principalBusyUntil:0};state.liveAlerts=state.liveAlerts||[];state.staffMessages=state.staffMessages||[];}
function addLiveAlert(icon,title,body,priority="Today",loc=""){ensureV7State();state.liveAlerts.unshift({id:uid("alert"),time:state.simMinutes,icon,title,body,priority,loc,date:state.date});state.liveAlerts=state.liveAlerts.slice(0,40);toast(`${icon} ${title}`);}
function playableEvent(){if(state.simMinutes<490||state.simMinutes>900||Math.random()>.23)return;let type=Math.floor(Math.random()*6);if(type===0){let r=pick(state.rooms.filter(x=>x.type==="Classroom"));if(r){r.temp=Math.min(84,(r.temp||72)+1);addLiveAlert("🌡️",`Warm room ${r.id}`,`${r.name} is ${r.temp}°F. The teacher has noticed the room warming up.`,"Today",r.id);}}else if(type===1){let s=pick(state.students);addLiveAlert("🩹","Nurse visit",`${s.first} ${s.last} was sent to the health office for a routine visit.`,"Info","HEALTH");}else if(type===2){let t=pick(activeEmployees().filter(e=>e.category==="Teacher"));if(t){state.staffMessages.unshift({id:uid("sm"),time:state.simMinutes,from:t.name,text:"Do you have a minute when you're free? I wanted to talk about something in my classroom.",loc:t.room||"OFFICE"});addLiveAlert("💬",`${t.name} wants to talk`,`A teacher has asked to speak with you when you are free.`,"Today",t.room||"OFFICE");}}else if(type===3){addLiveAlert("📞","Parent call waiting","The office has a parent asking to speak with administration about a classroom concern.","Today","OFFICE");}else if(type===4){addLiveAlert("🧹","Custodian responding","A spill was reported in the main hall. The head custodian is handling it automatically.","Info","HALL");}else{addLiveAlert("🚌","Transportation update","An afternoon route is expected to arrive about 8 minutes late.","Today","ENTRY");}}
function playableTick(minutes=5){ensureV7State();advanceMinutes(minutes);playableEvent();renderPlayControls();}
let playTimer=null;function startPlayLoop(){if(playTimer)clearInterval(playTimer);playTimer=setInterval(()=>{if(state&&state.play&&state.play.running)playableTick(5*state.play.speed);},1000);}
function togglePlay(){ensureV7State();state.play.running=!state.play.running;renderPlayControls();}
function cycleSpeed(){ensureV7State();state.play.speed=state.play.speed===1?2:state.play.speed===2?5:1;renderPlayControls();}
function renderPlayControls(){let p=$("playPauseBtn"),s=$("speedBtn");if(p)p.textContent=state.play.running?"⏸ Pause":"▶ Play";if(s)s.textContent=`${state.play.speed}×`;}
function currentPrincipalLocation(){return state.play.principalLoc||"OFFICE";}function principalCanAct(){return state.simMinutes>=(state.play.principalBusyUntil||0);}
function v7LocationLabel(id){if(id==="HALL")return "Main Hall";return locationLabel(id);}
function nearbyLocations(loc){const g={OFFICE:["ENTRY","HEALTH","HALL"],ENTRY:["OFFICE","HALL"],HEALTH:["OFFICE","HALL"],HALL:["OFFICE","ENTRY","CAF","GYM","LIB","101","104","110","201","204","207"],CAF:["HALL","KITCHEN"],KITCHEN:["CAF"],GYM:["HALL"],LIB:["HALL"],MUSIC:["HALL"],ART:["HALL"],"101":["HALL","102"],"102":["101","103"],"103":["102","HALL"],"104":["HALL","105"],"105":["104","106"],"106":["105","HALL"],"110":["HALL","111"],"111":["110","112"],"112":["111","HALL"],"201":["HALL","202"],"202":["201","203"],"203":["202","HALL"],"204":["HALL","205"],"205":["204","206"],"206":["205","HALL"],"207":["HALL","208"],"208":["207","209"],"209":["208","HALL"]};return g[loc]||["HALL"];}
function movePrincipal(loc){if(!principalCanAct())return toast(`You are busy until ${mins12(state.play.principalBusyUntil)}.`);state.play.principalLoc=loc;state.play.principalBusyUntil=state.simMinutes+5;renderWalkMode();}
function talkToPerson(kind,id){if(!principalCanAct())return toast(`You are busy until ${mins12(state.play.principalBusyUntil)}.`);state.play.principalBusyUntil=state.simMinutes+10;if(kind==="employee"){let e=state.employees.find(x=>x.id===id);if(e)addLiveAlert("💬",`Talked with ${e.name}`,pick([`${e.name} says things are going smoothly.`,`${e.name} asks about an upcoming schedule change.`,`${e.name} mentions a student who may need more support.`,`${e.name} thanks you for checking in.`]),"Info",currentEmployeeLocation(e));}else{let s=state.students.find(x=>x.id===id);if(s)addLiveAlert("🙂",`Checked in with ${s.first}`,pick([`${s.first} tells you about a class project.`,`${s.first} says lunch was good today.`,`${s.first} is excited about specials.`,`${s.first} says the day is going well.`]),"Info",currentStudentLocation(s));}renderWalkMode();}
function renderWalkMode(){ensureV7State();let modal=$("walkModal");if(!modal||modal.classList.contains("hidden"))return;let loc=currentPrincipalLocation();$("walkClock").textContent=`${mins12(state.simMinutes)} • ${schoolPhase()}`;$("walkLocation").innerHTML=`<div class="walk-location"><strong>📍 ${v7LocationLabel(loc)}</strong><span>${principalCanAct()?"Available":"Busy until "+mins12(state.play.principalBusyUntil)}</span></div>`;let es=activeEmployees().filter(e=>currentEmployeeLocation(e)===loc).slice(0,8),ss=state.students.filter(s=>currentStudentLocation(s)===loc).slice(0,8);$("walkPeople").innerHTML=`<h3>People Here</h3>`+(es.length||ss.length?[...es.map(e=>`<button class="person-chip" data-kind="employee" data-id="${e.id}">👩‍🏫 ${e.name}<small>${e.position}</small></button>`),...ss.map(s=>`<button class="person-chip" data-kind="student" data-id="${s.id}">🧒 ${s.first} ${s.last}<small>Grade ${s.grade}</small></button>`)].join(""):`<div class="muted">No one notable is here right now.</div>`);$("walkActions").innerHTML=`<h3>Go To</h3>`+nearbyLocations(loc).map(n=>`<button data-move="${n}">➡️ ${v7LocationLabel(n)}</button>`).join("");$("walkPeople").querySelectorAll("[data-kind]").forEach(b=>b.onclick=()=>talkToPerson(b.dataset.kind,b.dataset.id));$("walkActions").querySelectorAll("[data-move]").forEach(b=>b.onclick=()=>movePrincipal(b.dataset.move));}
function openWalk(){ensureV7State();$("walkModal").classList.remove("hidden");renderWalkMode();}function closeWalk(){$("walkModal").classList.add("hidden");}
function renderPhone(tab="alerts"){ensureV7State();let body=$("phoneBody");if(!body)return;if(tab==="alerts")body.innerHTML=state.liveAlerts.length?state.liveAlerts.slice(0,12).map(a=>`<div class="phone-item"><strong>${a.icon} ${a.title}</strong><span>${mins12(a.time)} • ${a.priority}</span><p>${a.body}</p></div>`).join(""):`<div class="muted">No live alerts yet.</div>`;else if(tab==="messages")body.innerHTML=state.staffMessages.length?state.staffMessages.slice(0,12).map(m=>`<div class="phone-item"><strong>${m.from}</strong><span>${mins12(m.time)}</span><p>${m.text}</p></div>`).join(""):`<div class="muted">No staff messages.</div>`;else body.innerHTML=(state.principalSchedule||[]).slice(0,10).map(i=>`<div class="phone-item"><strong>${i.time||""} ${i.title||i.activity||"Calendar item"}</strong><p>${i.location||""}</p></div>`).join("")||`<div class="muted">No calendar items.</div>`;}
function openPhone(){$("phonePanel").classList.remove("hidden");renderPhone("alerts");}function closePhone(){$("phonePanel").classList.add("hidden");}

const renderBeforeV7=render;render=function(){ensureV7State();renderBeforeV7();renderPlayControls();renderWalkMode();};
const loadBeforeV7=load;load=function(){let raw=localStorage.getItem(SAVE_KEY);if(raw){try{state=JSON.parse(raw);ensureV7State();toast("V7 saved game loaded.");render();return;}catch(err){console.error(err)}}let v6=localStorage.getItem(V6_SAVE_KEY);if(v6){try{state=JSON.parse(v6);ensureV7State();state.schoolHistory.unshift({date:state.date,text:"Upgraded Lincoln from District Simulation V6.0 to Playable School V7.0."});toast("Your V6 game was upgraded to V7.0. Save now to create a V7 save.");render();return;}catch(err){console.error(err)}}return loadBeforeV7();};
const bindUIBeforeV7=bindUI;bindUI=function(){bindUIBeforeV7();$("playPauseBtn")?.addEventListener("click",togglePlay);$("speedBtn")?.addEventListener("click",cycleSpeed);$("walkBtn")?.addEventListener("click",openWalk);$("walkCloseBtn")?.addEventListener("click",closeWalk);$("phoneBtn")?.addEventListener("click",openPhone);$("phoneCloseBtn")?.addEventListener("click",closePhone);document.querySelectorAll("[data-phone]").forEach(b=>b.addEventListener("click",()=>renderPhone(b.dataset.phone)));startPlayLoop();};




/* ========================================================= V8 REAL LIFE SCHOOL ========================================================= */
function ensureV8State(){
 ensureV7State();state.version=8;
 state.schoolCalendar=state.schoolCalendar||{instructionalRequired:180,makeupDays:0,closures:0,delays:0,events:[
  {date:'2026-09-07',type:'Holiday',name:'Labor Day'},{date:'2026-10-16',type:'No School',name:'Teacher Professional Development'},
  {date:'2026-11-25',type:'Break',name:'Thanksgiving Break Begins'},{date:'2026-12-21',type:'Break',name:'Winter Break Begins'},
  {date:'2027-01-04',type:'School',name:'Students Return'},{date:'2027-03-29',type:'Break',name:'Spring Break Begins'},
  {date:'2027-05-24',type:'Event',name:'Field Day'},{date:'2027-05-27',type:'Event',name:'Sixth Grade Celebration'}]};
 state.delegation=state.delegation||[
  {area:'Attendance & front office',role:'School Secretary',autonomy:84},{area:'Routine discipline & dismissal',role:'Assistant Principal',autonomy:78},
  {area:'Counseling & attendance interventions',role:'School Counselor',autonomy:86},{area:'Building & cleaning',role:'Head Custodian',autonomy:88},
  {area:'IEP compliance & caseloads',role:'Special Education Teacher',autonomy:82},{area:'Devices & classroom technology',role:'School Technology Specialist',autonomy:80}
 ];
 state.inventory=state.inventory||[
  {id:'PAPER',name:'Copy paper',qty:118,par:80,unit:'cases',account:'Office'},{id:'TONER',name:'Printer toner',qty:24,par:18,unit:'cartridges',account:'Technology'},
  {id:'CLEAN',name:'Cleaning chemical',qty:38,par:25,unit:'cases',account:'Facilities'},{id:'LINERS',name:'Trash liners',qty:64,par:40,unit:'cases',account:'Facilities'},
  {id:'GLOVES',name:'Nitrile gloves',qty:31,par:20,unit:'cases',account:'Health/Facilities'},{id:'CHROME',name:'Spare student devices',qty:17,par:12,unit:'devices',account:'Technology'},
  {id:'CAF',name:'Cafeteria dry goods',qty:72,par:55,unit:'cases',account:'Food Service'}
 ];
 state.maintenance=state.maintenance||[
  {id:'HVAC',asset:'HVAC filter rotation',area:'Building',interval:30,lastDay:1,nextDay:30,status:'Scheduled'},
  {id:'PLAY',asset:'Playground safety inspection',area:'Playground',interval:20,lastDay:1,nextDay:20,status:'Scheduled'},
  {id:'FIRE',asset:'Fire extinguisher / egress check',area:'Building',interval:30,lastDay:1,nextDay:30,status:'Scheduled'},
  {id:'KITCH',asset:'Kitchen equipment PM',area:'Kitchen',interval:45,lastDay:1,nextDay:45,status:'Scheduled'},
  {id:'ROOF',asset:'Roof / drain inspection',area:'Exterior',interval:60,lastDay:1,nextDay:60,status:'Scheduled'}
 ];
 state.custodialZones=state.custodialZones||[
  {id:'A',name:'K–2 Wing',rooms:['101','102','103','104','105','106'],score:94,assigned:null,status:'On Track'},
  {id:'B',name:'3–6 Wing',rooms:['110','111','112','201','202','203','204','205','206','207','208','209'],score:92,assigned:null,status:'On Track'},
  {id:'C',name:'Commons & Support',rooms:['CAF','GYM','LIB','MUSIC','ART','OFFICE','HEALTH','SPED','TECH'],score:91,assigned:null,status:'On Track'}
 ];
 let custodians=activeEmployees().filter(e=>e.category==='Operations'&&e.position.includes('Custodian'));
 state.custodialZones.forEach((z,i)=>{if(!z.assigned&&custodians[i])z.assigned=custodians[i].id;});
 state.capitalProjects=state.capitalProjects||[];
 state.yearArchives=state.yearArchives||[];
 state.achievements=state.achievements||{};
 state.techTickets=state.techTickets||[];
 state.cafeteria=state.cafeteria||{mealsToday:0,inspectionScore:96,equipmentCondition:91,menu:'Chicken sandwich • fruit • vegetable • milk'};
 state.transportOps=state.transportOps||{changesToday:0,lateRoutes:0,carLineMinutes:14,busOnTime:94};
 state.formerPeople=state.formerPeople||{employees:[],students:[]};
 state.hiringClearance=state.hiringClearance||{};
 activeEmployees().forEach((e,i)=>{
  e.pto=e.pto||{sick:Math.max(2,10-(i%5)),personal:Math.max(1,3-(i%2)),used:0};
  e.memories=e.memories||[{date:state.date,text:'Part of the Lincoln Elementary staff.'}];
  e.preferences=e.preferences||{assignment:e.assignment,career: e.category==='Teacher'?(e.experience>10?'Mentor / leadership':'Classroom growth'):'Role stability'};
  e.property=e.property||[...(e.equipment||[]), ...(e.category==='Teacher'?['Classroom key']:[])];
  e.contractStatus=e.contractStatus||'Active';e.renewal=e.renewal||'Pending spring review';e.attendancePattern=e.attendancePattern||'Typical';
  if(e.degree==='BA'&&e.experience>7&&i%4===0)e.educationGoal=e.educationGoal||'Working toward MA';
 });
 state.families.forEach((f,i)=>{f.memories=f.memories||[{date:state.date,text:'Family relationship established with Lincoln.'}];f.contacts=f.contacts||[{name:`${f.lastName} Parent/Guardian`,relationship:'Parent/Guardian',approvedPickup:true}];f.residency=f.residency||'Verified';f.recordsStatus=f.recordsStatus||'Complete';if(i%17===0)f.pickupNote=f.pickupNote||'Verify photo ID for alternate pickup.';});
 state.students.forEach((s,i)=>{
  s.memories=s.memories||[];s.behavior=s.behavior||{incidents:i%23===0?2:i%11===0?1:0,trend:i%23===0?'Needs support':'Typical'};
  s.mtss=s.mtss||((s.reading<65||s.math<65)?'Tier 2':(s.reading<55||s.math<55)?'Tier 3':'Tier 1');
  s.growth=s.growth||{reading:0,math:0};s.custodyFlag=s.custodyFlag||false;s.records=s.records||'Complete';
  s.medicalSchool=s.medicalSchool||((i%29===0)?'Health plan on file':'Routine');
 });
 state.substitutes.forEach((s,i)=>{s.preferredSchools=s.preferredSchools||['Lincoln Elementary'];s.availableDays=s.availableDays||5-(i%2);});
 state.applications.forEach(a=>{if(!state.hiringClearance[a.id])state.hiringClearance[a.id]={background:a.status==='Hired'?'Clear':'Pending',license:a.status==='Hired'?'Verified':'Pending',references:a.referenceScore?'Complete':'Pending',hr:a.status==='Hired'?'Cleared':'Pending'};});
}
function employeeByPosition(role){return activeEmployees().find(e=>e.position===role||e.assignment===role);}
function memoryAdd(person,text){person.memories=person.memories||[];person.memories.unshift({date:state.date,text});person.memories=person.memories.slice(0,12);}
function delegationScore(area){let d=state.delegation.find(x=>x.area===area);return d?d.autonomy:65;}
function routineHandled(area){return Math.random()*100<delegationScore(area);}
function v8DailyProgress(minutes=5){
 ensureV8State(); let fraction=minutes/420;
 // academic growth accumulates slowly and depends on teacher performance / attendance
 if(state.simMinutes>=515&&state.simMinutes<=875){state.students.filter(s=>s.status==='Active').forEach(s=>{let t=teacherForRoom(s.room),quality=t?t.performance:70,att=s.attendance/100;let rg=(quality/100)*att*fraction*.42,mg=(quality/100)*att*fraction*.38;s.growth.reading+=rg;s.growth.math+=mg;if(Math.random()<.0008*minutes){s.reading=Math.min(100,s.reading+1);s.math=Math.min(100,s.math+(Math.random()<.65?1:0));}});}
 // inventory consumption
 if(state.simMinutes>=515&&state.simMinutes<=920){let use=Math.max(.01,minutes/420);state.inventory.forEach(it=>{let rate=it.id==='PAPER'?.16:it.id==='CAF'?.32:it.id==='CLEAN'?.12:.05;it.qty=Math.max(0,it.qty-rate*use);});}
 // cafeteria and transport realism
 if(state.simMinutes>=690&&state.simMinutes<810)state.cafeteria.mealsToday=Math.min(enrollment(),Math.round(enrollment()*.88));
 if(state.simMinutes>=875&&state.simMinutes<920){state.transportOps.changesToday=Math.max(state.transportOps.changesToday,state.dailyCounters?.earlyDismissal||0);}
 // maintenance due status
 state.maintenance.forEach(m=>{m.status=state.instructionalDay>=m.nextDay?'Due':'Scheduled';});
 // delegated event filtering: some routine V7 alerts get solved automatically
 if(state.liveAlerts?.length){let a=state.liveAlerts[0];if(!a.v8Checked){a.v8Checked=true;let area=a.icon==='🧹'?'Building & cleaning':a.icon==='💻'?'Devices & classroom technology':a.icon==='📞'?'Attendance & front office':a.icon==='🚌'?'Routine discipline & dismissal':null;if(area&&routineHandled(area)){a.body+=` ${state.delegation.find(d=>d.area===area)?.role||'Staff'} handled the routine response without needing you.`;a.priority='Info';}}}
}
function renderV8Students(){
 let board=$('mtssBoard');if(board){let tiers=['Tier 1','Tier 2','Tier 3'].map(t=>[t,state.students.filter(s=>s.status==='Active'&&s.mtss===t).length]);let behavior=state.students.filter(s=>s.behavior?.incidents>0&&s.status==='Active').length;board.innerHTML=`<div class="stat-grid">${tiers.map(x=>`<div class="stat-box"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join('')}<div class="stat-box"><span>Behavior histories</span><strong>${behavior}</strong></div></div><div class="compact-list">${state.students.filter(s=>s.status==='Active'&&(s.mtss!=='Tier 1'||s.behavior?.incidents>1)).slice(0,8).map(s=>`<div class="compact-item"><strong>${s.first} ${s.last}</strong> • Grade ${s.grade}<br>${s.mtss} • Reading ${s.reading} • Math ${s.math} • ${s.behavior.trend}</div>`).join('')||'<div class="muted">No urgent intervention reviews.</div>'}</div>`;}
 let fam=$('familyRecordsBoard');if(fam){let incomplete=state.families.filter(f=>f.recordsStatus!=='Complete').length,flags=state.families.filter(f=>f.pickupNote).length;fam.innerHTML=`<div class="inspector-grid"><div class="inspector-stat"><span>Households</span><strong>${state.families.length}</strong></div><div class="inspector-stat"><span>Pickup notes</span><strong>${flags}</strong></div><div class="inspector-stat"><span>Incomplete records</span><strong>${incomplete}</strong></div></div><div class="compact-item"><strong>Records process</strong><br>Move-ins request prior records; residency and authorized pickup contacts stay with the household.</div>`;}
}
function renderV8Staff(){
 let c=$('careerMemoryBoard');if(c){let goals=activeEmployees().filter(e=>e.educationGoal).slice(0,6);let retire=activeEmployees().filter(e=>e.age>=60).slice(0,6);c.innerHTML=`<div class="inspector-grid"><div class="inspector-stat"><span>Spring renewals pending</span><strong>${activeEmployees().filter(e=>e.renewal==='Pending spring review').length}</strong></div><div class="inspector-stat"><span>Retirement-eligible signal</span><strong>${retire.length}</strong></div><div class="inspector-stat"><span>Education goals</span><strong>${goals.length}</strong></div></div>${goals.map(e=>`<div class="compact-item"><strong>${e.name}</strong><br>${e.educationGoal}</div>`).join('')}${retire.map(e=>`<div class="compact-item"><strong>${e.name}</strong><br>Veteran employee • ${e.yearsInDistrict} years in district</div>`).join('')}`;}
 let d=$('delegationBoard');if(d)d.innerHTML=state.delegation.map(x=>{let person=employeeByPosition(x.role);return`<div class="position-row"><span><strong>${x.area}</strong><br><span class="muted">${person?.name||x.role}</span></span><span class="badge ${x.autonomy>=82?'good':x.autonomy>=72?'info':'warn'}">${x.autonomy>=82?'Strong autonomy':x.autonomy>=72?'Typical':'Needs oversight'}</span></div>`}).join('');
}
function renderV8HR(){
 let p=$('ptoBoard');if(p){let low=activeEmployees().filter(e=>e.pto.sick<=3).length,used=activeEmployees().reduce((a,e)=>a+e.pto.used,0);p.innerHTML=`<div class="stat-grid"><div class="stat-box"><span>Low sick banks</span><strong>${low}</strong></div><div class="stat-box"><span>Days used YTD</span><strong>${used}</strong></div><div class="stat-box"><span>Subs available</span><strong>${state.substitutes.filter(s=>s.status==='Available').length}</strong></div></div>${activeEmployees().filter(e=>e.status==='Absent'||e.pto.sick<=3).slice(0,7).map(e=>`<div class="position-row"><span>${e.name}<br><span class="muted">Sick ${e.pto.sick.toFixed(1)} • Personal ${e.pto.personal.toFixed(1)}</span></span><span class="badge ${e.status==='Absent'?'danger':'warn'}">${e.status==='Absent'?'Absent':'Low balance'}</span></div>`).join('')}`;}
 let clr=$('clearanceBoard');if(clr){let apps=state.applications.filter(a=>!['Rejected','Hired'].includes(a.status)).slice(0,6);clr.innerHTML=apps.length?apps.map(a=>{let h=state.hiringClearance[a.id]||{};return`<div class="compact-item"><strong>${a.name}</strong> — ${a.status}<br>Background: ${h.background||'Pending'} • License: ${h.license||'Pending'} • References: ${h.references||'Pending'} • HR: ${h.hr||'Pending'}</div>`}).join(''):'<div class="muted">No candidates currently in clearance.</div>';}
}
function renderV8Operations(){
 let z=$('custodialZones');if(z)z.innerHTML=state.custodialZones.map(x=>{let e=state.employees.find(a=>a.id===x.assigned);return`<div class="position-row"><span><strong>Zone ${x.id} — ${x.name}</strong><br><span class="muted">${e?.name||'Unassigned'} • ${x.rooms.length} rooms</span></span><span class="badge ${x.score>=90?'good':x.score>=80?'warn':'danger'}">${Math.round(x.score)}%</span></div>`}).join('');
 let pm=$('pmBoard');if(pm)pm.innerHTML=state.maintenance.map(m=>`<div class="position-row"><span><strong>${m.asset}</strong><br><span class="muted">${m.area} • next due Day ${m.nextDay}</span></span><span class="badge ${m.status==='Due'?'warn':'good'}">${m.status}</span></div>`).join('');
 let inv=$('inventoryBoard');if(inv)inv.innerHTML=`<div class="inventory-grid">${state.inventory.map(i=>`<div class="inventory-item ${i.qty<i.par?'low-stock':''}"><strong>${i.name}</strong><span>${Math.floor(i.qty)} ${i.unit}</span><small>Par ${i.par} • ${i.account}</small></div>`).join('')}</div><h3>Technology tickets</h3>${state.techTickets.slice(0,5).map(t=>`<div class="compact-item">${t.status==='Open'?'🔧':'✅'} ${t.issue} — ${t.location}</div>`).join('')||'<div class="muted small">No open technology backlog.</div>'}`;
 let ops=$('dailyOpsBoard');if(ops)ops.innerHTML=`<div class="stat-grid"><div class="stat-box"><span>Meals today</span><strong>${state.cafeteria.mealsToday}</strong></div><div class="stat-box"><span>Kitchen condition</span><strong>${state.cafeteria.equipmentCondition}%</strong></div><div class="stat-box"><span>Bus on-time</span><strong>${state.transportOps.busOnTime}%</strong></div><div class="stat-box"><span>PM changes</span><strong>${state.transportOps.changesToday}</strong></div></div><div class="compact-item"><strong>Today's menu</strong><br>${state.cafeteria.menu}</div>`;
}
function renderV8Finance(){let b=$('capitalProjectsBoard');if(b)b.innerHTML=state.capitalProjects.length?state.capitalProjects.map(p=>`<div class="position-row"><span><strong>${p.name}</strong><br><span class="muted">${p.stage} • ${money(p.cost)} • ${p.progress}%</span></span><span class="badge ${p.stage==='Complete'?'good':'info'}">${p.stage}</span></div>`).join(''):'<div class="muted">No active capital projects. Major improvements now follow planning, approval, bid, construction and inspection.</div>';}
function renderV8District(){let d=$('districtStaffMarket');if(d){let open=state.district.schools.map((s,i)=>({school:s.name,openings:(i+state.instructionalDay)%4,pressure:i===0?'Your building':i%2?'Competitive':'Stable'}));d.innerHTML=open.map(x=>`<div class="position-row"><span><strong>${x.school}</strong><br><span class="muted">${x.openings} current/recent openings</span></span><span class="badge ${x.pressure==='Competitive'?'warn':'info'}">${x.pressure}</span></div>`).join('')+'<div class="compact-item">Candidates and employees can be influenced by openings elsewhere in the district; internal transfers become more likely during spring staffing.</div>';}}
function updateAchievements(){
 let a=state.achievements;a.fullyStaffed=a.fullyStaffed||state.positions.every(p=>p.filled>=p.authorized);a.perfectOpening=a.perfectOpening||(state.instructionalDay<=5&&state.workOrders.filter(w=>w.status==='Open'&&w.priority==='High').length===0&&state.positions.every(p=>p.filled>=p.authorized));a.growingPains=a.growingPains||(enrollment()/480>=.95);a.homegrown=a.homegrown||activeEmployees().some(e=>e.history?.some(h=>/para/i.test(h))&&e.category==='Teacher');a.veteran=a.veteran||activeEmployees().some(e=>e.yearsInDistrict>=20);a.snowDay=a.snowDay||state.schoolCalendar.closures>0;
}
function renderV8Reports(){updateAchievements();let y=$('yearbookBoard');if(y)y.innerHTML=`<div class="yearbook-card"><strong>${state.schoolYear} Lincoln Elementary</strong><span>${enrollment()} students • ${activeEmployees().length} employees • Day ${state.instructionalDay}/180</span><span>Major memories: ${state.schoolHistory.length} • Archived years: ${state.yearArchives.length}</span></div>`+state.yearArchives.slice(0,4).map(a=>`<div class="compact-item"><strong>${a.year}</strong> — ${a.enrollment} students • Building ${a.building}% • ${a.staff} staff</div>`).join('');let b=$('achievementBoard');if(b){let defs=[['fullyStaffed','Fully Staffed','Open the school year with every authorized position filled.'],['homegrown','Homegrown Teacher','A former para becomes a Lincoln teacher.'],['veteran','Twenty Years of Service','Retain an employee for 20 years.'],['growingPains','Growing Pains','Operate above 95% building capacity.'],['snowDay','Snow Day!','Close school due to winter weather.'],['perfectOpening','Perfect Opening','Open with full staffing and no critical work orders.']];b.innerHTML=defs.map(([k,n,d])=>`<div class="achievement ${state.achievements[k]?'unlocked':''}"><strong>${state.achievements[k]?'🏆':'🔒'} ${n}</strong><span>${d}</span></div>`).join('');}}
function renderV8(){ensureV8State();safeSection('v8students',renderV8Students);safeSection('v8staff',renderV8Staff);safeSection('v8hr',renderV8HR);safeSection('v8ops',renderV8Operations);safeSection('v8finance',renderV8Finance);safeSection('v8district',renderV8District);safeSection('v8reports',renderV8Reports);}
function runMtssReview(){ensureV8State();let changed=0;state.students.filter(s=>s.status==='Active').forEach(s=>{let old=s.mtss,newTier=(s.reading<55||s.math<55||s.behavior.incidents>=3)?'Tier 3':(s.reading<68||s.math<68||s.behavior.incidents>=1)?'Tier 2':'Tier 1';s.mtss=newTier;if(old!==newTier){changed++;memoryAdd(s,`MTSS review changed support from ${old} to ${newTier}.`);}});toast(`${changed} student support levels changed.`);render();}
function contractReview(){ensureV8State();let renewed=0;activeEmployees().forEach(e=>{if(e.contractStatus==='Active'){e.renewal=e.performance<70?'Administrative review':'Recommended for renewal';if(e.performance>=70)renewed++;memoryAdd(e,`Spring contract review: ${e.renewal}.`);}});toast(`${renewed} employees recommended for renewal.`);render();}
function autoCoveragePlan(){simulateCalloffs();state.absences.forEach(a=>{let e=state.employees.find(x=>x.id===a.employeeId);if(e?.pto){e.pto.sick=Math.max(0,e.pto.sick-1);e.pto.used+=1;memoryAdd(e,'Used one sick day.');}});toast('Coverage plan rebuilt using available substitutes.');render();}
function inspectCustodialZones(){state.custodialZones.forEach(z=>{let avgClean=avg(z.rooms.map(id=>roomById(id)?.cleanliness||90));z.score=Math.round(avgClean);z.status=z.score>=90?'On Track':z.score>=80?'Needs Detail':'Recovery Needed';});toast('Custodial zone inspection completed.');render();}
function completeDuePM(){let due=state.maintenance.filter(m=>m.status==='Due');if(!due.length)return toast('No preventive maintenance is due today.');due.forEach(m=>{m.lastDay=state.instructionalDay;m.nextDay=state.instructionalDay+m.interval;m.status='Scheduled';state.finance.spentOps+=350;});state.rooms.forEach(r=>r.condition=Math.min(100,r.condition+.4));toast(`${due.length} preventive-maintenance items completed.`);render();}
function orderLowStock(){let low=state.inventory.filter(i=>i.qty<i.par);if(!low.length)return toast('Inventory is currently above par levels.');let cost=0;low.forEach(i=>{let add=i.par*1.5-i.qty;i.qty+=add;cost+=Math.round(add*(i.id==='CHROME'?325:42));});state.finance.spentOps+=cost;toast(`Low-stock items replenished for ${money(cost)}.`);render();}
function newCapitalProject(){openModal('Plan Capital Project',`<form id="capitalForm"><div class="form-grid"><label>Project<input id="capitalName" value="Classroom renovation" required></label><label>Estimated Cost<input id="capitalCost" type="number" value="125000" min="1000"></label><label>Initial Stage<select id="capitalStage"><option>Planning</option><option>Board Review</option></select></label></div><div class="actions"><button class="primary">Create Project</button></div></form>`);$('capitalForm').onsubmit=e=>{e.preventDefault();state.capitalProjects.push({id:uid('cap'),name:$('capitalName').value,cost:+$('capitalCost').value,stage:$('capitalStage').value,progress:5,created:state.date});state.schoolHistory.unshift({date:state.date,text:`Capital project entered planning: ${$('capitalName').value}.`});closeModal();render();};}
function openYearbook(){let staff=activeEmployees().slice(0,16).map(e=>e.name).join(' • ');let events=state.schoolHistory.slice(0,8).map(x=>`<li>${x.text}</li>`).join('');openModal(`${state.schoolYear} Lincoln Yearbook`,`<div class="yearbook-modal"><h2>🏫 Lincoln Elementary</h2><h3>${state.schoolYear}</h3><p><strong>${enrollment()} students • ${activeEmployees().length} staff</strong></p><p>${staff}</p><h3>Year in Review</h3><ul>${events}</ul><p class="muted">This year becomes permanent when the school year closes.</p></div>`);}
function v8RandomRealLifeEvent(){
 ensureV8State();if(state.simMinutes<500||state.simMinutes>910)return;
 let r=Math.random();
 if(r<.20&&state.techTickets.length<8){let room=pick(state.rooms.filter(x=>x.type==='Classroom'));state.techTickets.unshift({id:uid('tech'),issue:pick(['Interactive display not connecting','Printer offline','Student device cracked','Teacher laptop dock not detecting display']),location:room.id,status:'Open',age:0});if(routineHandled('Devices & classroom technology'))setTimeout(()=>{},0);}
 else if(r<.38){let fam=pick(state.families);if(fam){memoryAdd(fam,pick(['Office resolved a transportation change.','Family contacted Lincoln about a classroom concern.','Family attended a school event.']));}}
 else if(r<.52){let e=pick(activeEmployees());if(e&&Math.random()<.25){e.morale=Math.max(45,e.morale-1);memoryAdd(e,'Experienced a demanding school day.');}}
 else if(r<.66){let s=pick(state.students.filter(x=>x.status==='Active'));if(s&&Math.random()<.35){s.behavior.incidents++;s.behavior.trend=s.behavior.incidents>=3?'Needs support':'Watch';memoryAdd(s,'Behavior incident documented and reviewed by staff.');}}
 else if(r<.80){let z=pick(state.custodialZones);z.score=Math.max(70,z.score-1);}
 else {let p=pick(state.capitalProjects);if(p&&p.stage!=='Complete'){p.progress=Math.min(100,p.progress+5);if(p.progress>=100)p.stage='Complete';else if(p.progress>=75)p.stage='Inspection / Closeout';else if(p.progress>=35)p.stage='Construction';else if(p.progress>=15)p.stage='Bid / Procurement';}}
}
const renderBeforeV8=render;render=function(){ensureV8State();renderBeforeV8();renderV8();};
const playableTickBeforeV8=playableTick;playableTick=function(minutes=5){playableTickBeforeV8(minutes);v8DailyProgress(minutes);if(Math.random()<.12)v8RandomRealLifeEvent();render();};
const openEmployeeBeforeV8=openEmployee;openEmployee=function(id){ensureV8State();let e=state.employees.find(x=>x.id===id);if(!e)return;openModal(e.name,`<div class="app-sheet"><h3>${e.position}</h3><p>${e.assignment} • ${e.fte.toFixed(1)} FTE • ${e.schedule}</p><div class="app-section"><strong>Personnel Profile</strong><p>Age ${e.age} • ${e.experience} yrs experience • ${e.yearsInDistrict} yrs in district<br>${e.degree} • ${e.license}<br>${e.contract} contract • ${money(e.salary*e.fte)}</p></div><div class="app-section"><strong>PTO / Contract</strong><p>Sick ${e.pto.sick.toFixed(1)} days • Personal ${e.pto.personal.toFixed(1)} days • Used ${e.pto.used}<br>Renewal: ${e.renewal}</p></div><div class="app-section"><strong>Performance & Morale</strong><p>Performance ${e.performance}/100 • Morale ${e.morale}/100 • Career: ${e.preferences.career}</p></div><div class="app-section"><strong>Recent Memory</strong>${e.memories.slice(0,6).map(m=>`<div>${m.date}: ${m.text}</div>`).join('')}</div><div class="app-section"><strong>Personnel History</strong>${e.history.map(h=>`<div>${h}</div>`).join('')}</div><div class="app-section"><strong>Assigned Property</strong><p>${e.property.join(', ')}</p></div></div><div class="actions"><button class="secondary" data-eact="eval">Record Walkthrough/Evaluation</button><button class="secondary" data-eact="leave">Add Leave</button><button class="secondary" data-eact="transfer">Transfer Assignment</button></div>`);document.querySelectorAll('[data-eact]').forEach(b=>b.onclick=()=>employeeAction(e,b.dataset.eact));};
const openStudentBeforeV8=openStudent;openStudent=function(id){ensureV8State();let s=state.students.find(x=>x.id===id),f=state.families.find(x=>x.id===s?.familyId);if(!s)return;openModal(`${s.first} ${s.last}`,`<div class="app-sheet"><h3>Student Record</h3><p>Grade ${s.grade} • Room ${s.room||'Unassigned'} • AM ${s.amTransport||s.transport} • PM ${s.pmTransport||s.transport}</p><div class="app-section"><strong>Family</strong><p>${f?.name||'—'} • ${f?.addressZone||'—'}<br>Residency: ${f?.residency||'—'} • Records: ${f?.recordsStatus||'—'}${f?.pickupNote?`<br>Pickup note: ${f.pickupNote}`:''}</p></div><div class="app-section"><strong>Supports & Services</strong><p>${[s.iep?'IEP':'',s.plan504?'504 Plan':'',s.ell?'ELL':''].filter(Boolean).join(', ')||'None listed'} • ${s.mtss}<br>School health: ${s.medicalSchool}</p></div><div class="app-section"><strong>Current Indicators</strong><p>Attendance ${s.attendance}% • Reading ${s.reading} • Math ${s.math}<br>Behavior incidents ${s.behavior.incidents} • Trend ${s.behavior.trend}</p></div><div class="app-section"><strong>Student Memory</strong>${s.memories.slice(0,6).map(m=>`<div>${m.date}: ${m.text}</div>`).join('')||'<div>No major memories recorded yet.</div>'}</div><div class="app-section"><strong>History</strong>${s.history.map(h=>`<div>${h}</div>`).join('')}</div></div>`);};
const endSchoolYearBeforeV8=endSchoolYear;endSchoolYear=function(){ensureV8State();let archive={year:state.schoolYear,enrollment:enrollment(),staff:activeEmployees().length,building:buildingScore(),budget:availableOperating(),events:state.schoolHistory.slice(0,12).map(x=>x.text)};state.yearArchives.unshift(archive);activeEmployees().forEach(e=>{memoryAdd(e,`Completed the ${state.schoolYear} school year at Lincoln.`);if(e.educationGoal&&Math.random()<.28){e.degree=e.degree==='BA'?'MA':e.degree;e.educationGoal=null;memoryAdd(e,'Completed an education milestone and updated degree status.');}});endSchoolYearBeforeV8();state.district.career.yearsAsPrincipal=(state.district.career.yearsAsPrincipal||1)+1;state.cafeteria.mealsToday=0;state.transportOps.changesToday=0;state.maintenance.forEach(m=>{m.lastDay=1;m.nextDay=m.interval;m.status='Scheduled'});render();};
const weatherDecisionBeforeV8=weatherDecision;weatherDecision=function(){weatherDecisionBeforeV8();setTimeout(()=>{document.querySelectorAll('[data-weather]').forEach(b=>{let prior=b.onclick;b.onclick=()=>{let d=b.dataset.weather;if(d==='Closed'){state.schoolCalendar.closures++;state.schoolCalendar.makeupDays++;}if(d==='2-hour Delay')state.schoolCalendar.delays++;if(prior)prior();};});},0);};
const bindUIBeforeV8=bindUI;bindUI=function(){bindUIBeforeV8();$('mtssReviewBtn')?.addEventListener('click',runMtssReview);$('contractReviewBtn')?.addEventListener('click',contractReview);$('coveragePlanBtn')?.addEventListener('click',autoCoveragePlan);$('inspectZonesBtn')?.addEventListener('click',inspectCustodialZones);$('runPmBtn')?.addEventListener('click',completeDuePM);$('orderSuppliesBtn')?.addEventListener('click',orderLowStock);$('newCapitalProjectBtn')?.addEventListener('click',newCapitalProject);$('yearbookBtn')?.addEventListener('click',openYearbook);};
const loadBeforeV8=load;load=function(){let raw=localStorage.getItem(SAVE_KEY);if(raw){try{state=JSON.parse(raw);ensureV8State();toast('V8 saved game loaded.');render();return;}catch(err){console.error(err)}}let v7=localStorage.getItem(V7_SAVE_KEY);if(v7){try{state=JSON.parse(v7);ensureV8State();state.schoolHistory.unshift({date:state.date,text:'Upgraded Lincoln from Playable School V7.0 to Real Life School V8.0.'});toast('Your V7 game was upgraded to V8.0. Save now to create a V8 save.');render();return;}catch(err){console.error(err)}}return loadBeforeV8();};


/* =========================================================
   LINCOLN ELEMENTARY V8.1 — PEOPLE & LEADERSHIP
   resumes, interviews, observations, meetings, careers
   ========================================================= */
const V8_SAVE_KEY="lincolnElementarySimulatorRealLifeV8";
function ensureV81State(){
 ensureV8State();state.version=8.1;
 state.meetings=state.meetings||[];state.observations=state.observations||[];state.staffRumors=state.staffRumors||[];state.studentTeachers=state.studentTeachers||[];
 state.formerPeople=state.formerPeople||{employees:[],students:[]};state.teamLeaders=state.teamLeaders||{};
 activeEmployees().forEach((e,i)=>{e.skills=e.skills||{instruction:rnd(70,94),management:rnd(68,95),families:rnd(70,96),collaboration:rnd(68,96),organization:rnd(68,95)};e.skillsKnown=e.skillsKnown??Math.min(100,25+e.yearsInDistrict*9);e.observations=e.observations||[];e.careerStatus=e.careerStatus||'Stable';e.retirementStage=e.retirementStage||((e.age>=62&&e.yearsInDistrict>=15)?'Eligible':'Not indicated');e.team=e.team||((e.category==='Teacher')?e.assignment:'Support Staff');e.mentorId=e.mentorId||null;e.leadershipInterest=e.leadershipInterest??(e.category==='Teacher'&&i%7===0);e.exitReason=e.exitReason||null;});
 state.substitutes.forEach((s,i)=>{s.daysAtLincoln=s.daysAtLincoln||rnd(3,58);s.preference=s.preference||pick(['K–2','3–6','Any elementary']);s.history=s.history||[`Substitute pool member; ${s.daysAtLincoln} Lincoln days completed.`];});
 state.applications.forEach((a,i)=>enrichCandidate(a,i));
}
function enrichCandidate(a,i=0){
 if(!a)return;a.email=a.email||`${a.name.toLowerCase().replace(/[^a-z]/g,'.').replace(/\.+/g,'.').replace(/^\.|\.$/g,'')}@examplemail.com`;
 a.phone=a.phone||`(260) 555-${String(1100+(i*137)%8800).padStart(4,'0')}`;a.summary=a.summary||pick(['Student-centered educator focused on strong routines, relationships, and measurable growth.','Collaborative educator with experience building inclusive classrooms and strong family partnerships.','Organized school professional seeking a long-term role in a supportive learning community.']);
 a.employment=a.employment||(()=>{let arr=[],yr=2026;let remain=a.experience||0;if(remain===0)return[{role:'Student Teacher',employer:pick(['Jefferson Elementary','Prairie View Elementary','Maple Ridge Elementary']),years:'Spring 2026'}];let n=Math.min(3,Math.max(1,Math.ceil(remain/4)));for(let x=0;x<n;x++){let len=x===n-1?Math.max(1,remain):Math.min(remain,rnd(2,5));arr.push({role:a.position,employer:x===0?a.currentEmployer:pick(['Oakwood Elementary','Jefferson Elementary','Riverside Schools','Maple Ridge Schools']),years:`${yr-len}–${x===0?'Present':yr}`});yr-=len;remain-=len;if(remain<=0)break;}return arr;})();
 a.certifications=a.certifications||[a.license, ...(a.position?.includes('Teacher')?[pick(['Reading Endorsement','CPR/AED','Google Certified Educator','Trauma-Informed Practices'])]:[])];a.interviewNotes=a.interviewNotes||[];a.referenceReports=a.referenceReports||[];a.demoLesson=a.demoLesson||null;a.committeeFeedback=a.committeeFeedback||[];a.rank=a.rank||'Unranked';a.internal=a.internal??false;a.withdrawRisk=a.withdrawRisk??rnd(4,24);a.trueFit=a.trueFit||rnd(65,97);
}
function candidateResume(a){enrichCandidate(a);return `<div class="resume-sheet"><div class="resume-head"><div><h2>${a.name}</h2><strong>${a.position}</strong></div><div>${a.email}<br>${a.phone}</div></div><div class="resume-section"><h3>Professional Summary</h3><p>${a.summary}</p></div><div class="resume-section"><h3>Experience</h3>${a.employment.map(x=>`<div class="resume-job"><strong>${x.role}</strong><span>${x.years}</span><div>${x.employer}</div></div>`).join('')}</div><div class="resume-section"><h3>Education & Credentials</h3><p><strong>${a.degree}</strong> • ${a.certifications.join(' • ')}</p></div><div class="resume-section"><h3>References</h3><p>${a.references.join('<br>')}</p></div>${a.internal?'<div class="badge good">INTERNAL APPLICANT</div>':''}</div>`;}
function openResume(id){let a=state.applications.find(x=>x.id===id);if(!a)return;openModal(`Résumé — ${a.name}`,candidateResume(a)+`<div class="actions"><button class="primary" id="resumeInterview">Interview Candidate</button><button class="secondary" id="resumeBack">Application File</button></div>`);$('resumeInterview').onclick=()=>conductInterview(a);$('resumeBack').onclick=()=>openApplication(a.id);}
function conductInterview(a){enrichCandidate(a);let qs=['How do you build classroom routines and relationships?','Describe how you respond when a student is not making academic progress.','How do you communicate a difficult concern to a family?','What would I see during a strong math lesson?','Tell us about a disagreement with a colleague and how you handled it.','How do you support students with IEPs and varied needs?'];let chosen=qs.slice().sort(()=>Math.random()-.5).slice(0,5);let answer=q=>{let base=a.trueFit;return base>86?pick(['I would start with clear expectations, collect evidence, collaborate with the team, and follow up with the student and family.','I try to make the goal visible to students, check understanding throughout the lesson, and adjust groups based on what I see.']):base>74?pick(['I value consistency, communication, and working with the team to solve concerns early.','I would review the data, try another strategy, and communicate with the family.']):pick(['I work hard to maintain expectations and would ask colleagues for ideas when something is not working.','I believe communication is important and I would try to address the issue as it comes up.']);};openModal(`Interview — ${a.name}`,`<p class="muted">Interview committee: Principal • Grade-level representative • Instructional leader</p>${chosen.map((q,i)=>`<div class="interview-q"><strong>${i+1}. ${q}</strong><p>${answer(q)}</p></div>`).join('')}<div class="form-grid"><label>Your rating<select id="intRating"><option value="90">Excellent</option><option value="82" selected>Strong</option><option value="74">Acceptable</option><option value="64">Concern</option></select></label><label>Committee impression<select id="committee"><option>Strong recommendation</option><option selected>Recommend</option><option>Mixed</option><option>Do not recommend</option></select></label><label class="full">Principal notes<textarea id="intNotes" rows="4" placeholder="What stood out?"></textarea></label></div><div class="actions"><button class="primary" id="saveInterview">Save Interview</button></div>`);$('saveInterview').onclick=()=>{a.interviewScore=Math.round((+ $('intRating').value+a.trueFit)/2);a.interviewNotes.unshift({date:state.date,note:$('intNotes').value||'Interview completed.',score:a.interviewScore});a.committeeFeedback.unshift({date:state.date,text:$('committee').value});a.status='Interviewed';log(`Interviewed ${a.name} for ${a.position}.`);closeModal();render();};}
function detailedReferences(a){enrichCandidate(a);let tone=a.trueFit>86?'glowing':a.trueFit>74?'positive':'careful';let comments=tone==='glowing'?['Outstanding employee; I would rehire without hesitation.','Dependable, reflective, and excellent with students and families.']:tone==='positive'?['Strong employee who responded well to coaching.','Reliable and student-centered; continued growth in leadership would help.']:['Eligible for rehire.','Worked hard; classroom consistency was an area we discussed.'];a.referenceReports=a.references.map((r,i)=>({reference:r,returned:Math.random()>.12,comment:comments[i%comments.length]}));a.referenceScore=Math.round((a.trueFit+rnd(72,94))/2);a.status='References Complete';openModal(`Reference Checks — ${a.name}`,a.referenceReports.map(r=>`<div class="compact-item"><strong>${r.reference}</strong><br>${r.returned?r.comment:'No response yet.'}</div>`).join('')+`<div class="actions"><button class="primary" id="refsDone">Return to Candidate</button></div>`);$('refsDone').onclick=()=>openApplication(a.id);}
function demoLesson(a){enrichCandidate(a);let score=Math.round((a.trueFit+rnd(68,98))/2);a.demoLesson={date:state.date,score,notes:score>=88?'Students were engaged; clear checks for understanding and smooth transitions.':score>=76?'Solid lesson with clear objective; some opportunities for stronger differentiation.':'Lesson showed potential, but pacing and student engagement were inconsistent.'};state.simMinutes=Math.min(1080,state.simMinutes+35);openModal(`Demonstration Lesson — ${a.name}`,`<div class="observation-card"><h3>Grade-Level Demonstration</h3><p>${a.demoLesson.notes}</p><div class="inspector-stat"><span>Committee Evidence</span><strong>${score}/100</strong></div></div><div class="actions"><button id="demoDone" class="primary">Save & Return</button></div>`);$('demoDone').onclick=()=>openApplication(a.id);}
const openApplicationV8=openApplication;openApplication=function(id){ensureV81State();let a=state.applications.find(x=>x.id===id);if(!a)return;enrichCandidate(a);let h=state.hiringClearance[a.id]||{};openModal(`Candidate File — ${a.name}`,`<div class="candidate-banner"><div><h3>${a.name}</h3><span>${a.position} • ${a.experience} years • ${a.degree}</span></div><span class="badge ${a.internal?'good':'info'}">${a.internal?'Internal':'External'}</span></div><div class="candidate-tabs"><button id="viewResume" class="secondary">📄 View Résumé</button><button id="runInterview" class="secondary">🎙️ Interview</button><button id="runDemo" class="secondary">🏫 Demo Lesson</button><button id="runRefs" class="secondary">☎️ References</button></div><div class="app-section"><strong>Current Stage</strong><p>${a.status}${a.interviewScore!=null?` • Interview evidence ${a.interviewScore}/100`:''}${a.demoLesson?` • Demo ${a.demoLesson.score}/100`:''}</p></div><div class="app-section"><strong>Committee Feedback</strong>${a.committeeFeedback.length?a.committeeFeedback.map(x=>`<div>${x.date}: ${x.text}</div>`).join(''):'<p class="muted">No committee feedback yet.</p>'}</div><div class="app-section"><strong>Clearance</strong><p>Background ${h.background||'Pending'} • License ${h.license||'Pending'} • References ${h.references||'Pending'} • HR ${h.hr||'Pending'}</p></div><div class="actions">${a.status==='References Complete'?'<button class="primary" data-v81app="offer">Make Offer</button>':''}${a.status==='Offer Accepted'?'<button class="primary" data-v81app="onboard">Begin Onboarding</button>':''}${!['Hired','Rejected','Withdrawn'].includes(a.status)?'<button class="secondary" data-v81app="reject">Reject</button>':''}</div>`);$('viewResume').onclick=()=>openResume(a.id);$('runInterview').onclick=()=>conductInterview(a);$('runDemo').onclick=()=>demoLesson(a);$('runRefs').onclick=()=>detailedReferences(a);document.querySelectorAll('[data-v81app]').forEach(b=>b.onclick=()=>applicationAction(a,b.dataset.v81app));};
function observationAvailable(e){return e&&e.category==='Teacher'&&e.room&&state.simMinutes>=500&&state.simMinutes<=900&&!e.absence&&!e.leave;}
function observeTeacher(e,formal=false){ensureV81State();let r=roomById(e.room),kids=studentsInRoom(e.room),mins=formal?45:12;if(!observationAvailable(e))return toast('That teacher is not available for a classroom observation right now.');let base=Math.round((e.skills.instruction+e.skills.management+e.skills.organization)/3),score=clamp(base+rnd(-7,7),55,99);let obs={id:uid('obs'),date:state.date,time:mins12(state.simMinutes),type:formal?'Formal Observation':'Quick Walkthrough',room:e.room,score,objective:pick(['Students will explain their reasoning using evidence.','Students will apply today’s skill independently and with a partner.','Students will demonstrate understanding through guided practice.']),strength:pick(['Clear routines and efficient transitions.','Strong questioning and student participation.','Positive classroom climate and clear expectations.','Frequent checks for understanding.']),growth:pick(['Increase differentiation during independent practice.','Build in more student-to-student academic discussion.','Tighten pacing during transitions.','Use exit evidence to plan the next small group.'])};e.observations.unshift(obs);state.observations.unshift({...obs,employeeId:e.id});e.skillsKnown=Math.min(100,e.skillsKnown+(formal?18:7));e.performance=Math.round((e.performance*3+score)/4);e.history.unshift(`${state.date}: ${obs.type} — ${score}/100`);memoryAdd(e,`${obs.type} completed with principal feedback.`);state.simMinutes=Math.min(1080,state.simMinutes+mins);openModal(`${obs.type} — ${e.name}`,`<div class="observation-card"><p><strong>${e.room} • ${r?.name||e.assignment} • ${kids.length} students</strong><br>${obs.time} • ${mins} minutes</p><h3>Lesson Objective</h3><p>${obs.objective}</p><h3>Evidence Observed</h3><p><strong>Strength:</strong> ${obs.strength}</p><p><strong>Growth:</strong> ${obs.growth}</p><div class="inspector-stat"><span>Observation Evidence</span><strong>${score}/100</strong></div><p class="muted">This evidence is now part of ${e.name}'s personnel history.</p></div><div class="actions"><button id="obsMeet" class="secondary">Meet With Teacher</button><button id="obsDone" class="primary">Save & Close</button></div>`);$('obsMeet').onclick=()=>scheduleOneOnOne(e);$('obsDone').onclick=()=>{closeModal();render();};}
function scheduleOneOnOne(e){state.meetings.unshift({id:uid('meet'),date:state.date,time:mins12(state.simMinutes+30),type:'Teacher Conference',team:e.assignment,attendees:[e.id],agenda:['Observation feedback'],status:'Scheduled',outcomes:[]});toast(`Meeting with ${e.name} added to leadership records.`);closeModal();render();}
const renderRoomInspectorV8=renderRoomInspector;renderRoomInspector=function(){renderRoomInspectorV8();ensureV81State();let id=state.selectedRoom,e=teacherForRoom(id),box=$('roomInspector');if(!box||!e)return;let wrap=document.createElement('div');wrap.className='v81-room-actions';wrap.innerHTML=`<h3>Teacher Leadership</h3><button class="primary" id="mapWalkthrough">👀 Quick Walkthrough</button><button class="secondary" id="mapFormal">📋 Formal Observation</button><button class="secondary" id="mapTeacherFile">📁 ${e.name}</button>`;box.appendChild(wrap);$('mapWalkthrough').onclick=()=>observeTeacher(e,false);$('mapFormal').onclick=()=>observeTeacher(e,true);$('mapTeacherFile').onclick=()=>openEmployee(e.id);};
function teamOptions(){let teams=[...new Set(activeEmployees().filter(e=>e.category==='Teacher').map(e=>e.assignment))];return [...teams,'Special Education','Leadership Team','Custodial Team','All Staff'];}
function openTeamMeeting(){ensureV81State();openModal('Hold / Schedule Team Meeting',`<form id="teamMeetingForm"><div class="form-grid"><label>Team<select id="meetingTeam">${teamOptions().map(x=>`<option>${x}</option>`).join('')}</select></label><label>Meeting Type<select id="meetingType"><option>Grade-Level Team</option><option>PLC</option><option>Leadership Team</option><option>Staff Meeting</option><option>Special Education</option><option>Custodial Meeting</option></select></label><label>When<select id="meetingWhen"><option value="now">Hold Now</option><option value="later">Schedule Later Today</option></select></label><label class="full">Principal agenda<textarea id="meetingAgenda" rows="3">Student progress\nUpcoming events</textarea></label></div><div class="actions"><button class="primary">Continue</button></div></form>`);$('teamMeetingForm').onsubmit=x=>{x.preventDefault();let team=$('meetingTeam').value,type=$('meetingType').value,agenda=$('meetingAgenda').value.split('\n').map(s=>s.trim()).filter(Boolean);if($('meetingWhen').value==='later'){state.meetings.unshift({id:uid('meet'),date:state.date,time:mins12(Math.min(1000,state.simMinutes+90)),type,team,agenda,status:'Scheduled',outcomes:[]});closeModal();toast('Team meeting scheduled.');render();}else runTeamMeeting(team,type,agenda);};}
function runTeamMeeting(team,type,agenda){let staff=team==='All Staff'?activeEmployees():team==='Leadership Team'?activeEmployees().filter(e=>['Administration','Office'].includes(e.category)):activeEmployees().filter(e=>e.assignment===team||e.team===team||e.position.includes(team));let teacher=pick(staff.filter(e=>e.category==='Teacher').length?staff.filter(e=>e.category==='Teacher'):staff);let student=pick(state.students.filter(s=>s.status==='Active'));let generated=[teacher?`${teacher.name} raised ${pick(['a student support concern','a scheduling concern','an upcoming family communication need','a request for shared planning time'])}.`:'Team reviewed current operations.',student?`Team reviewed ${student.first} ${student.last}'s ${pick(['reading progress','attendance pattern','classroom behavior','intervention plan'])}.`:'Student support data reviewed.',pick(['Team agreed on a follow-up before next week.','Principal will review the concern and report back.','Team leader will coordinate the next step.','Counselor will follow up with the family.'])];let outcomes=[...agenda.map(a=>`Discussed: ${a}`),...generated];let m={id:uid('meet'),date:state.date,time:mins12(state.simMinutes),type,team,agenda,status:'Completed',outcomes};state.meetings.unshift(m);state.simMinutes=Math.min(1080,state.simMinutes+35);staff.forEach(e=>{e.morale=clamp(e.morale+(Math.random()<.7?1:0),40,100);memoryAdd(e,`Participated in ${type}: ${team}.`);});openModal(`${team} — ${type}`,`<p><strong>${fmtDate(state.date)} • ${m.time}</strong></p><h3>Agenda</h3>${agenda.map(x=>`<div class="compact-item">${x}</div>`).join('')}<h3>Discussion & Outcomes</h3>${generated.map(x=>`<div class="compact-item">${x}</div>`).join('')}<div class="actions"><button id="meetingDone" class="primary">Save Minutes</button></div>`);$('meetingDone').onclick=()=>{closeModal();render();};}
function renderPeopleLeadership(){let board=$('peopleLeadershipBoard');if(board){let resign=activeEmployees().filter(e=>e.careerStatus==='Considering Leaving'||e.careerStatus==='Resignation Submitted'),retire=activeEmployees().filter(e=>e.retirementStage!=='Not indicated'&&e.retirementStage!=='Eligible'),obs=state.observations.slice(0,5);board.innerHTML=`<div class="stat-grid"><div class="stat-box"><span>Observations YTD</span><strong>${state.observations.length}</strong></div><div class="stat-box"><span>Meetings</span><strong>${state.meetings.length}</strong></div><div class="stat-box"><span>Possible departures</span><strong>${resign.length+retire.length}</strong></div></div><h3>Recent Leadership Activity</h3>${obs.map(o=>{let e=state.employees.find(x=>x.id===o.employeeId);return`<div class="compact-item"><strong>${e?.name||'Teacher'}</strong> — ${o.type}<br>${o.date} • ${o.score}/100</div>`}).join('')||'<p class="muted">No observations yet. Click a classroom on the map.</p>'}`;}
 let mb=$('meetingBoard');if(mb)mb.innerHTML=state.meetings.slice(0,7).map(m=>`<div class="compact-item"><strong>${m.team} — ${m.type}</strong><br>${m.date} ${m.time} • ${m.status}${m.outcomes?.length?`<br>${m.outcomes.slice(-2).join(' ')}`:''}</div>`).join('')||'<p class="muted">No team meetings recorded yet.</p>';
 let db=$('departureBoard');if(db){let list=activeEmployees().filter(e=>e.age>=58||e.careerStatus!=='Stable').sort((a,b)=>b.age-a.age).slice(0,8);db.innerHTML=list.map(e=>`<div class="position-row"><span><button class="link-btn" data-depart="${e.id}">${e.name}</button><br><span class="muted">Age ${e.age} • ${e.yearsInDistrict} district years</span></span><span class="badge ${e.careerStatus==='Stable'?'info':'warn'}">${e.retirementStage!=='Not indicated'?e.retirementStage:e.careerStatus}</span></div>`).join('')||'<p class="muted">No known departure signals.</p>';document.querySelectorAll('[data-depart]').forEach(b=>b.onclick=()=>openEmployee(b.dataset.depart));}
}
function peopleDaily(){ensureV81State();if(state.simMinutes<1000)return;activeEmployees().forEach(e=>{if(e.category==='Teacher'&&e.age>=60&&e.retirementStage==='Eligible'&&Math.random()<.0009){e.retirementStage='Considering Retirement';memoryAdd(e,'Requested information about retirement timing.');state.inbox.unshift(msg('HR',`${e.name} requested retirement information`,`${e.name} has begun asking HR about retirement eligibility. No formal notice has been submitted.`, 'medium',['Acknowledge']));}if(e.category==='Teacher'&&e.morale<67&&e.careerStatus==='Stable'&&Math.random()<.0012){e.careerStatus='Considering Leaving';memoryAdd(e,'Began considering other professional opportunities.');}});}
function processYearEndDepartures(){ensureV81State();let departed=[];activeEmployees().slice().forEach(e=>{let retire=e.age>=62&&e.yearsInDistrict>=18&&Math.random()<.10;let quit=!retire&&Math.random()<(e.morale<65?.08:.018);if(retire||quit){e.status=retire?'Retired':'Resigned';e.exitReason=retire?'Retirement':pick(['Promotion','Relocation','Another district','Career change','Preferred assignment']);e.history.unshift(`${state.date}: ${e.status} — ${e.exitReason}`);state.formerPeople.employees.unshift(JSON.parse(JSON.stringify(e)));departed.push(e);let p=state.positions.find(p=>p.role===e.position);if(p){updatePositionFill();let existing=state.vacancies.find(v=>v.positionId===p.id&&v.status==='Open');if(!existing)state.vacancies.push({id:uid('vac'),positionId:p.id,title:p.role,category:p.category,fte:p.fte,posted:state.date,status:'Open',postingDays:10,internal:'Allowed'});}state.schoolHistory.unshift({date:state.date,text:`${e.name} ${retire?'retired':'resigned'} from ${e.position} after ${e.yearsInDistrict} district years.`});}});return departed;}
const renderV81Base=render;render=function(){ensureV81State();renderV81Base();renderPeopleLeadership();};
const playableTickV81=playableTick;playableTick=function(minutes=5){playableTickV81(minutes);peopleDaily();};
const endSchoolYearV81=endSchoolYear;endSchoolYear=function(){processYearEndDepartures();endSchoolYearV81();};
const openEmployeeV81Base=openEmployee;openEmployee=function(id){ensureV81State();let e=state.employees.find(x=>x.id===id);if(!e)return;let known=e.skillsKnown>=75?`Instruction ${e.skills.instruction} • Management ${e.skills.management} • Families ${e.skills.families} • Collaboration ${e.skills.collaboration}`:e.skillsKnown>=45?'You have moderate evidence about this employee; more observations will clarify strengths.':'Abilities are still emerging; gather evidence through observations and team work.';openModal(e.name,`<div class="app-sheet"><h3>${e.position}</h3><p>${e.assignment} • ${e.fte.toFixed(1)} FTE • ${e.schedule}</p><div class="app-section"><strong>Career & Retention</strong><p>Age ${e.age} • ${e.yearsInDistrict} district years • ${e.careerStatus}<br>Retirement: ${e.retirementStage}</p></div><div class="app-section"><strong>Known Professional Evidence</strong><p>${known}</p></div><div class="app-section"><strong>Observations</strong>${e.observations.length?e.observations.slice(0,5).map(o=>`<div>${o.date}: ${o.type} — ${o.score}/100</div>`).join(''):'<p class="muted">No classroom observations recorded.</p>'}</div><div class="app-section"><strong>Recent Memory</strong>${e.memories.slice(0,6).map(m=>`<div>${m.date}: ${m.text}</div>`).join('')}</div><div class="app-section"><strong>Personnel History</strong>${e.history.slice(0,8).map(h=>`<div>${h}</div>`).join('')}</div></div><div class="actions">${e.category==='Teacher'?'<button class="primary" data-v81e="walk">👀 Quick Walkthrough</button><button class="secondary" data-v81e="formal">📋 Formal Observation</button>':''}<button class="secondary" data-v81e="meeting">💬 Meet With Employee</button></div>`);document.querySelectorAll('[data-v81e]').forEach(b=>b.onclick=()=>{if(b.dataset.v81e==='walk')observeTeacher(e,false);if(b.dataset.v81e==='formal')observeTeacher(e,true);if(b.dataset.v81e==='meeting')scheduleOneOnOne(e);});};
const bindUIV81Base=bindUI;bindUI=function(){bindUIV81Base();$('teamMeetingBtn')?.addEventListener('click',openTeamMeeting);$('teamMeetingQuickBtn')?.addEventListener('click',openTeamMeeting);};
const loadV81Base=load;load=function(){let raw=localStorage.getItem(SAVE_KEY);if(raw){try{state=JSON.parse(raw);ensureV81State();toast('V8.1 People & Leadership save loaded.');render();return;}catch(e){console.error(e)}}let v8=localStorage.getItem(V8_SAVE_KEY);if(v8){try{state=JSON.parse(v8);ensureV81State();state.schoolHistory.unshift({date:state.date,text:'Upgraded Lincoln to V8.1 People & Leadership.'});toast('Your V8.0 game was upgraded to V8.1. Save now to create a V8.1 save.');render();return;}catch(e){console.error(e)}}return loadV81Base();};




/* V8.2 STUDENTS, FAMILIES & SCHOOL LIFE */
function ensureV82State(){ensureV81State();state.version=8.2;state.studentMeetings=state.studentMeetings||[];state.schoolLifeEvents=state.schoolLifeEvents||[];state.alumni=state.alumni||[];state.registrationQueue=state.registrationQueue||[];state.placementPlans=state.placementPlans||[];state.pto=state.pto||{officers:[{role:'President',name:'Megan Carter'},{role:'Treasurer',name:'Luis Garcia'},{role:'Secretary',name:'Ashley Reed'}],funds:12840,volunteers:34,cleared:29};state.students.forEach((x,i)=>{x.behavior=x.behavior||{referrals:0,pattern:pick(['Typical','Typical','Needs occasional redirection','Strong self-management']),notes:[]};x.mtss=x.mtss||{tier:(x.reading<65||x.math<65?2:1),focus:x.reading<x.math?'Reading':'Math',reviews:[]};x.friendGroup=x.friendGroup||`Group ${1+(i%9)}`;x.parentRequest=x.parentRequest||null;x.activities=x.activities||[];x.reportCards=x.reportCards||[];x.pickupRestriction=x.pickupRestriction||false;x.gifted=x.gifted||((x.reading>91&&x.math>91)&&Math.random()<.45);});state.families.forEach(f=>{f.relationship=f.relationship||pick(['Strong','Positive','Positive','Typical','Typical','Watch']);f.residencyVerified=f.residencyVerified!==false;f.recordsComplete=f.recordsComplete!==false;f.volunteer=f.volunteer??(Math.random()<.18);f.memories=f.memories||[];f.youngerSibling=f.youngerSibling??(Math.random()<.12);});}
function famFor(s){return state.families.find(f=>f.id===s.familyId)}
function renderV82Students(){ensureV82State();let pb=$('placementBoard');if(pb)pb.innerHTML=GRADES.map(g=>{let k=state.students.filter(s=>s.status==='Active'&&s.grade===g);return`<div class="placement-row"><strong>Grade ${g}</strong><span>${k.length} students</span><span>${k.filter(s=>s.iep||s.plan504||s.ell||s.mtss.tier>1).length} supports</span><span>${k.filter(s=>s.parentRequest).length} requests</span></div>`}).join('')+(state.placementPlans[0]?`<p class="muted">Latest plan: ${state.placementPlans[0].summary}</p>`:'');let rb=$('registrationBoard');if(rb)rb.innerHTML=`<div class="stat-grid"><div class="stat-box"><span>Likely K siblings</span><strong>${state.families.filter(f=>f.youngerSibling).length}</strong></div><div class="stat-box"><span>Pending registrations</span><strong>${state.registrationQueue.length}</strong></div></div>${state.registrationQueue.slice(0,5).map(r=>`<div class="compact-item"><strong>${r.child}</strong> — ${r.status}<br>${r.zone} • ${r.records}</div>`).join('')||'<p class="muted">No pending registrations.</p>'}`;let sm=$('studentMeetingsBoard');if(sm)sm.innerHTML=state.studentMeetings.slice(0,6).map(m=>`<div class="compact-item"><strong>${m.type}: ${m.student}</strong><br>${m.date} • ${m.outcome}</div>`).join('')||'<p class="muted">No student-support meetings recorded.</p>';let sl=$('schoolLifeBoard');if(sl)sl.innerHTML=state.schoolLifeEvents.slice(0,7).map(e=>`<div class="compact-item"><strong>${e.type}</strong> — ${e.name}<br>${e.date} • ${e.status}</div>`).join('')||'<p class="muted">No school-life events planned yet.</p>';let fl=$('familyLifeBoard');if(fl)fl.innerHTML=`<div class="stat-grid"><div class="stat-box"><span>PTO Funds</span><strong>${money(state.pto.funds)}</strong></div><div class="stat-box"><span>Volunteers</span><strong>${state.pto.volunteers}</strong></div><div class="stat-box"><span>Cleared</span><strong>${state.pto.cleared}</strong></div></div><h3>PTO Officers</h3>${state.pto.officers.map(o=>`<div class="position-row"><span>${o.role}</span><strong>${o.name}</strong></div>`).join('')}<h3>Family Relationships</h3>${['Strong','Positive','Typical','Watch'].map(k=>`<span class="student-life-chip">${k}: ${state.families.filter(f=>f.relationship===k).length}</span>`).join('')}`;let ab=$('alumniBoard');if(ab)ab.innerHTML=`<div class="stat-grid"><div class="stat-box"><span>Former Lincoln Students</span><strong>${state.alumni.length}</strong></div><div class="stat-box"><span>Current Grade 6</span><strong>${state.students.filter(s=>s.status==='Active'&&s.grade==='6').length}</strong></div></div>${state.alumni.slice(0,5).map(a=>`<div class="compact-item"><strong>${a.name}</strong><br>Lincoln class of ${a.lincolnClass} • ${a.note}</div>`).join('')||'<p class="muted">Alumni history will grow as classes leave Lincoln.</p>'}`;}
function buildPlacementPlan(){ensureV82State();let summary=GRADES.map(g=>{let k=state.students.filter(s=>s.status==='Active'&&s.grade===g);return`G${g}: ${k.length}, ${k.filter(s=>s.mtss.tier>1).length} supports`}).join(' • ');state.placementPlans.unshift({date:state.date,summary});openModal('Next-Year Classroom Placement',`<p>The placement team reviewed academics, IEP/504/ELL needs, MTSS, behavior, family requests, peer groups and teacher strengths.</p>${GRADES.map(g=>{let k=state.students.filter(s=>s.status==='Active'&&s.grade===g);return`<div class="compact-item"><strong>Grade ${g}</strong> — ${k.length} students • ${k.filter(s=>s.mtss.tier>1).length} MTSS 2/3 • ${k.filter(s=>s.parentRequest).length} requests</div>`}).join('')}<div class="actions"><button id="savePlacement" class="primary">Save Tentative Plan</button></div>`);$('savePlacement').onclick=()=>{closeModal();toast('Tentative class placement plan saved.');render();};}
function kindergartenRoundup(){ensureV82State();let n=rnd(8,16),zones=state.neighborhoods.map(n=>n.name);for(let i=0;i<n;i++){let f=pick(state.families.filter(x=>x.youngerSibling));let ln=f?.lastName||pick(lastNames);state.registrationQueue.push({id:uid('reg'),child:`${pick(firstNames)} ${ln}`,zone:f?.addressZone||pick(zones),status:pick(['Pre-registered','Needs residency document','Records pending']),records:pick(['Birth/health records complete','Immunization record pending','Residency verification pending']),sibling:!!f});if(f)f.youngerSibling=false;}state.schoolLifeEvents.unshift({type:'Kindergarten Roundup',name:`${n} prospective kindergarteners identified`,date:state.date,status:'Completed'});toast(`${n} prospective kindergarteners identified.`);render();}
function holdStudentMeeting(){ensureV82State();let kids=state.students.filter(x=>x.status==='Active'),s=pick(kids);openModal('Student Support Meeting',`<form id="v82sm"><div class="form-grid"><label>Student<select id="v82student">${kids.map(x=>`<option value="${x.id}" ${x.id===s.id?'selected':''}>${x.first} ${x.last} — Grade ${x.grade}</option>`).join('')}</select></label><label>Meeting<select id="v82type"><option>MTSS Review</option><option>IEP Team Meeting</option><option>504 Meeting</option><option>Attendance Conference</option><option>Behavior Problem-Solving</option><option>Parent-Teacher Conference</option></select></label></div><div class="actions"><button class="primary">Hold Meeting</button></div></form>`);$('v82sm').onsubmit=e=>{e.preventDefault();let st=state.students.find(x=>x.id===$('v82student').value),type=$('v82type').value,outcome=pick(['Continue current supports and review in 6 weeks.','Increase targeted intervention and collect weekly data.','Family and school agreed on a communication plan.','Accommodations reviewed; no changes required.','Teacher will implement a new classroom support plan.']);state.studentMeetings.unshift({id:uid('stm'),studentId:st.id,student:`${st.first} ${st.last}`,type,date:state.date,outcome});st.history.unshift(`${state.date}: ${type} — ${outcome}`);st.mtss.reviews.unshift({date:state.date,outcome});state.simMinutes=Math.min(1080,state.simMinutes+35);closeModal();toast('Student meeting minutes saved.');render();};}
function planSchoolLifeEvent(){ensureV82State();openModal('Plan School Event',`<form id="v82event"><div class="form-grid"><label>Event Type<select id="v82etype"><option>Field Trip</option><option>Parent-Teacher Conferences</option><option>Assembly</option><option>Picture Day</option><option>Testing Window</option><option>Family Night</option><option>Book Fair</option><option>Concert</option><option>Field Day</option><option>Sixth-Grade Promotion</option></select></label><label>Date<input id="v82edate" type="date" value="${state.date}"></label><label class="full">Name<input id="v82ename" value="Lincoln Family Night"></label></div><div class="actions"><button class="primary">Schedule Event</button></div></form>`);$('v82event').onsubmit=e=>{e.preventDefault();state.schoolLifeEvents.unshift({id:uid('life'),type:$('v82etype').value,name:$('v82ename').value,date:$('v82edate').value,status:'Scheduled'});state.schedule.push({time:'TBD',item:`${$('v82etype').value}: ${$('v82ename').value}`});closeModal();toast('School event scheduled.');render();};}
function v82OpenStudent(id){ensureV82State();let s=state.students.find(x=>x.id===id),f=famFor(s),t=teacherForRoom(s?.room);if(!s)return;openModal(`${s.first} ${s.last}`,`<div class="app-sheet"><h3>Grade ${s.grade} • ${s.room||'Unassigned'} • ${t?.name||'No teacher assigned'}</h3><div class="app-section"><strong>Family & Transportation</strong><p>${f?.name||'—'} • ${f?.addressZone||'—'} • Relationship: ${f?.relationship||'—'}<br>AM/PM: ${s.transport} • Pickup restriction: ${s.pickupRestriction?'Yes':'No'} • Residency: ${f?.residencyVerified?'Verified':'Pending'}</p></div><div class="app-section"><strong>Academic & Support Profile</strong><p>Reading ${s.reading} • Math ${s.math} • Attendance ${s.attendance}% • MTSS Tier ${s.mtss.tier} (${s.mtss.focus})<br>${[s.iep?'IEP':'',s.plan504?'504':'',s.ell?'ELL':'',s.gifted?'High Ability':''].filter(Boolean).join(' • ')||'No formal services'}</p></div><div class="app-section"><strong>School Life</strong><p>Peer group: ${s.friendGroup} • Behavior: ${s.behavior.pattern} • Office referrals: ${s.behavior.referrals}<br>Activities: ${s.activities.join(', ')||'None yet'}</p></div><div class="app-section"><strong>History</strong>${s.history.slice(0,10).map(x=>`<div>${x}</div>`).join('')}</div></div><div class="actions"><button id="v82support" class="primary">Hold Support Meeting</button><button id="v82request" class="secondary">Add Family Placement Request</button></div>`);$('v82support').onclick=()=>{closeModal();holdStudentMeeting()};$('v82request').onclick=()=>{s.parentRequest=pick(['Requests current teacher style next year','Requests separation from a peer','Requests placement with sibling’s former teacher','Requests specific teacher if possible']);f.memories.unshift({date:state.date,text:`Submitted placement request for ${s.first}.`});toast('Family placement request recorded.');closeModal();render();};}
function studentLifeDaily(){ensureV82State();if(state.simMinutes<500||state.simMinutes>930)return;if(Math.random()<.025){let s=pick(state.students.filter(x=>x.status==='Active'));if(s){s.reading=clamp(s.reading+rnd(-1,2),35,100);s.math=clamp(s.math+rnd(-1,2),35,100);}}}
const renderV82Base=render;render=function(){ensureV82State();renderV82Base();renderV82Students();};
openStudent=function(id){v82OpenStudent(id);};
const playableTickV82=playableTick;playableTick=function(minutes=5){playableTickV82(minutes);studentLifeDaily();};
const endSchoolYearV82Base=endSchoolYear;endSchoolYear=function(){ensureV82State();let leaving=state.students.filter(s=>s.status==='Active'&&s.grade==='6').map(s=>({name:`${s.first} ${s.last}`,lincolnClass:(parseInt(state.schoolYear)||2026)+1,note:`Completed Lincoln with reading ${s.reading}, math ${s.math}.`}));state.alumni.unshift(...leaving);endSchoolYearV82Base();};
const bindUIV82Base=bindUI;bindUI=function(){bindUIV82Base();$('placementBtn')?.addEventListener('click',buildPlacementPlan);$('roundupBtn')?.addEventListener('click',kindergartenRoundup);$('studentMeetingBtn')?.addEventListener('click',holdStudentMeeting);$('schoolEventBtn')?.addEventListener('click',planSchoolLifeEvent);};
const loadV82Base=load;load=function(){let raw=localStorage.getItem(SAVE_KEY);if(raw){try{state=JSON.parse(raw);ensureV82State();toast('V8.2 Students & School Life save loaded.');render();return;}catch(e){console.error(e)}}let old=localStorage.getItem(V81_SAVE_KEY);if(old){try{state=JSON.parse(old);ensureV82State();state.schoolHistory.unshift({date:state.date,text:'Upgraded Lincoln to V8.2 Students, Families & School Life.'});toast('Your V8.1 game was upgraded to V8.2. Save now to create a V8.2 save.');render();return;}catch(e){console.error(e)}}return loadV82Base();};



/* ========================== V8.3 LIVING BUILDING ========================== */
function ensureV83State(){ensureV82State();state.version=8.3;state.principalLocation=state.principalLocation||'OFFICE';state.liveBuilding=state.liveBuilding||{movementLog:[],hallPasses:[],activeEvent:null};}
function liveActivityForRoom(r){let m=state.simMinutes;if(!r)return'';if(r.grade){if(m<515)return'Arrival / Morning Work';if(m<600)return'Reading & Literacy';if(m<640)return'Math';if(m<690&&!['K','1','2'].includes(String(r.grade)))return'Specials / Planning';if(m<750&&['K','1','2'].includes(String(r.grade)))return'Lunch / Recess';if(m<810&&!['K','1','2'].includes(String(r.grade)))return'Lunch / Recess';if(m<850)return'Science / Social Studies';if(m<875)return'Pack Up';if(m<920)return'Dismissal';return'Room Empty';}if(r.id==='CAF')return m>=680&&m<820?'Lunch Service':'Kitchen / Prep';if(r.id==='GYM'||r.id==='ART'||r.id==='MUSIC'||r.id==='LIB')return m>=600&&m<850?'Specials Classes':'Planning / Setup';if(r.id==='OFFICE')return m>=490&&m<920?'Front Office Open':'Office Closed';if(r.id==='NURSE')return m>=490&&m<920?'Student Health Visits':'Closed';if(r.id==='CUST')return m>=875?'Evening Cleaning':'Day Operations';return schoolPhase();}
function peopleAt(id){return{students:state.students.filter(x=>x.status==='Active'&&currentStudentLocation(x)===id),staff:activeEmployees().filter(x=>currentEmployeeLocation(x)===id)}}
function liveRoomSummary(id){let p=peopleAt(id);return`${p.students.length} students • ${p.staff.length} staff`;}
function v83RenderMap(){ensureV83State();let map=$('schoolMap');if(!map)return;map.innerHTML='';for(const [id,name,type,col,row,w,h] of ROOM_LAYOUT){let b=document.createElement(type==='circulation'?'div':'button');b.className=`room-map ${type}`;b.style.gridColumn=`${col}/span ${w}`;b.style.gridRow=`${row}/span ${h}`;if(type==='circulation'){b.innerHTML=`<span class="rname">${name}</span>`;map.appendChild(b);continue;}let r=roomById(id);if(!r)continue;let sev=roomSeverity(r);if(sev)b.classList.add(sev);let occ=peopleAt(id),t=teacherForRoom(id),activity=liveActivityForRoom(r);if(occ.students.length)b.classList.add('occupied-now');if(state.principalLocation===id)b.classList.add('principal-here');b.innerHTML=`<span class="rid">${id}</span><span class="rname">${r.grade?`Grade ${r.grade}`:name}</span>${r.grade?`<span class="teacher-map">${t?t.name:'VACANT'}</span>`:''}<span class="live-activity">${activity}</span><span class="live-count">👥 ${occ.students.length+occ.staff.length}${state.principalLocation===id?' • ⭐ YOU':''}</span>`;b.onclick=()=>{state.selectedRoom=id;renderBuilding();};map.appendChild(b);}if($('capacityChip'))$('capacityChip').textContent=`${mins12(state.simMinutes)} • ${schoolPhase()} • Enrollment ${enrollment()} / 480`;v83RoomInspector();}
function v83RoomInspector(){let box=$('roomInspector'),id=state.selectedRoom;if(!box)return;if(!id){box.innerHTML='<span class="muted">Select a room to see the live school.</span>';return;}let r=roomById(id);if(!r)return;let p=peopleAt(id),t=teacherForRoom(id);box.innerHTML=`<h3>${id} — ${r.name}${r.grade?` / Grade ${r.grade}`:''}</h3><div class="live-room-banner"><strong>${liveActivityForRoom(r)}</strong><span>${mins12(state.simMinutes)} • ${liveRoomSummary(id)}</span></div><div class="inspector-grid"><div class="inspector-stat"><span>Students Here</span><strong>${p.students.length}</strong></div><div class="inspector-stat"><span>Staff Here</span><strong>${p.staff.length}</strong></div><div class="inspector-stat"><span>Clean</span><strong>${r.cleanliness}%</strong></div><div class="inspector-stat"><span>Temp</span><strong>${r.temp}°F</strong></div></div>${r.grade?`<div class="compact-item"><strong>${t?t.name:'Vacant classroom'}</strong><br>${t?`${t.position} • ${t.experience} yrs experience`:'No teacher assigned'}</div>`:''}<div class="live-people-list"><strong>Currently here</strong>${p.staff.slice(0,6).map(x=>`<div>👩‍🏫 ${x.name} — ${x.position}</div>`).join('')}${p.students.slice(0,10).map(x=>`<div>🎒 ${x.first} ${x.last} — Grade ${x.grade}</div>`).join('')}${p.students.length>10?`<div class="muted">+ ${p.students.length-10} more students</div>`:''}</div><div class="inspector-actions"><button class="primary" id="v83walk">🚶 Walk Here</button>${r.grade&&t?`<button class="primary" id="v83observe">👀 Observe Class</button><button class="secondary" id="v83talk">💬 Talk to ${t.name.split(' ')[0]}</button>`:''}<button class="secondary" id="inspectWO">Create Work Order</button>${r.grade?`<button class="secondary" id="inspectRoster">View Roster</button>`:''}</div>`;$('v83walk').onclick=()=>walkPrincipalTo(id);if($('v83observe'))$('v83observe').onclick=()=>v83Observe(t,id);if($('v83talk'))$('v83talk').onclick=()=>{state.principalLocation=id;state.simMinutes=Math.min(1080,state.simMinutes+10);openConversation(t)};$('inspectWO').onclick=()=>openWorkOrderModal(id);if($('inspectRoster'))$('inspectRoster').onclick=()=>openRoster(id);}
function walkPrincipalTo(id){ensureV83State();let from=state.principalLocation;state.principalLocation=id;state.simMinutes=Math.min(1080,state.simMinutes+4);state.liveBuilding.movementLog.unshift({date:state.date,time:mins12(state.simMinutes),from,to:id});toast(`You walked to ${locationLabel(id)}.`);render();}
function v83Observe(t,id){let r=roomById(id),activity=liveActivityForRoom(r);if(!peopleAt(id).students.length){toast('The class is not currently in the room.');return;}state.principalLocation=id;state.simMinutes=Math.min(1080,state.simMinutes+20);if(typeof conductObservation==='function')return conductObservation(t.id,'Walkthrough');if(typeof startObservation==='function')return startObservation(t.id,'Walkthrough');openModal(`Classroom Walkthrough — ${t.name}`,`<p><strong>${activity}</strong> • ${id}</p><p>${pick(['Students were actively engaged in the lesson and classroom routines were evident.','The lesson objective was clear; several students needed additional redirection.','Teacher used questioning and checks for understanding throughout the lesson.','Small-group differentiation was visible and transitions were efficient.'])}</p><p class="muted">20 minutes added to the principal calendar.</p>`);}
const renderBuildingV83Old=renderBuilding;renderBuilding=function(){v83RenderMap();};
const renderV83Old=render;render=function(){ensureV83State();renderV83Old();if(document.querySelector('#view-building.active'))v83RenderMap();};
const loadV83Old=load;load=function(){let raw=localStorage.getItem(SAVE_KEY);if(raw){try{state=JSON.parse(raw);ensureV83State();toast('V8.3 Living Building save loaded.');render();return;}catch(e){console.error(e)}}let old=localStorage.getItem(V82_SAVE_KEY);if(old){try{state=JSON.parse(old);ensureV83State();state.schoolHistory.unshift({date:state.date,text:'Upgraded Lincoln to V8.3 Living Building.'});toast('Your V8.2 school was upgraded to V8.3.');render();return;}catch(e){console.error(e)}}return loadV83Old();};



/* ================= V8.4 SCHOOL DAY, AUTONOMY & STORYLINES ================= */
function ensureV84State(){ensureV83State();state.version=8.4;state.principalTasks=state.principalTasks||[];state.interruptions=state.interruptions||[];state.storylines=state.storylines||[];state.dailyBrief=state.dailyBrief||[];state.subPool=state.subPool||[{name:'Patricia Lewis',reliability:94,preferred:'K–2',days:18},{name:'Mark Evans',reliability:86,preferred:'3–6',days:11},{name:'Denise Hall',reliability:97,preferred:'Any',days:26},{name:'Jordan Clark',reliability:78,preferred:'PE / Any',days:7}];state.seasons=state.seasons||{traditions:['Fall Family Night','Winter Concert','Spring Field Day','Sixth-Grade Walk']};}
function addTask(text,due='Today',priority='Normal'){ensureV84State();if(!state.principalTasks.some(x=>!x.done&&x.text===text))state.principalTasks.unshift({id:uid('task'),text,due,priority,done:false,created:state.date});}
function v84MorningBrief(){ensureV84State();let abs=activeEmployees().filter(e=>e.status==='Absent'||e.leave).length,open=state.workOrders.filter(w=>w.status==='Open').length,vac=state.positions.filter(p=>p.filled<p.authorized).length;state.dailyBrief=[`${abs} staff absent / on leave`,`${open} open work orders`,`${vac} staffing vacancies`,`${state.principalTasks.filter(x=>!x.done).length} principal tasks`,`${state.storylines.filter(x=>x.status==='Open').length} active storylines`];if(abs)addTask('Review substitute and coverage plan','7:45 AM','High');if(open>2)addTask('Review priority facilities work orders','Today','Normal');}
function v84Render(){ensureV84State();let target=document.querySelector('#view-command .stack');if(!target)return;let box=$('v84SchoolDay');if(!box){box=document.createElement('section');box.id='v84SchoolDay';box.className='card padded';let attention=$('attentionList')?.closest('section');(attention?.parentNode||target).insertBefore(box,attention||null);}box.innerHTML=`<div class="section-head"><div><h2>Principal Workday</h2><p class="muted">Your school runs itself. Step in where leadership is needed.</p></div><button id="v84BriefBtn" class="secondary">Refresh Briefing</button></div><div class="v84-columns"><div><h3>Today’s Tasks</h3><div>${state.principalTasks.filter(x=>!x.done).slice(0,8).map(x=>`<button class="v84-task" data-task="${x.id}"><span>☐ ${x.text}</span><small>${x.due} • ${x.priority}</small></button>`).join('')||'<p class="muted">Nothing urgent. Walk the building or visit classrooms.</p>'}</div></div><div><h3>Active Storylines</h3>${state.storylines.filter(x=>x.status==='Open').slice(0,5).map(x=>`<div class="compact-item"><strong>${x.title}</strong><br>${x.stage}<br><span class="muted">${x.next}</span></div>`).join('')||'<p class="muted">No active multi-day issues.</p>'}</div></div>`;$('v84BriefBtn').onclick=()=>{v84MorningBrief();render()};box.querySelectorAll('[data-task]').forEach(b=>b.onclick=()=>{let t=state.principalTasks.find(x=>x.id===b.dataset.task);t.done=true;state.simMinutes=Math.min(1080,state.simMinutes+10);toast('Task completed.');render();});let bc=$('briefingCards');if(bc){v84MorningBrief();bc.innerHTML=state.dailyBrief.map(x=>`<div class="brief-card"><strong>${x}</strong></div>`).join('');}}
function maybeInterrupt(){ensureV84State();if(state.simMinutes<450||state.simMinutes>960||Math.random()>.045)return;let e=pick([{title:'Parent Waiting',text:'A parent arrived unexpectedly and is asking to speak with you.',choices:['See parent now','Ask AP to handle','Schedule meeting']},{title:'Office Call',text:'The secretary has a family on the phone asking specifically for the principal.',choices:['Take the call','Have secretary take a message','Delegate to AP']},{title:'Classroom Support',text:'A teacher is requesting brief administrative support with a recurring classroom concern.',choices:['Go to classroom','Send AP','Ask teacher to document and meet later']},{title:'Transportation Update',text:'A bus is running late. Transportation has already contacted the office.',choices:['No action needed','Check dismissal plan']},{title:'Facilities Alert',text:'Custodial staff found a room issue that may affect instruction.',choices:['Inspect it','Delegate to head custodian','Create follow-up task']}]);state.interruptions.unshift({id:uid('int'),date:state.date,time:mins12(state.simMinutes),...e});openModal(`📱 ${e.title}`,`<p>${e.text}</p><p class="muted">You are currently at ${locationLabel(state.principalLocation)}.</p><div class="actions">${e.choices.map((c,i)=>`<button class="${i===0?'primary':'secondary'} v84choice" data-c="${c}">${c}</button>`).join('')}</div>`);document.querySelectorAll('.v84choice').forEach(b=>b.onclick=()=>{let c=b.dataset.c;if(/now|call|classroom|inspect/i.test(c))state.simMinutes=Math.min(1080,state.simMinutes+20);if(/Schedule|follow-up|message/i.test(c))addTask(`${e.title}: ${e.text}`,'Today','Normal');state.schoolHistory.unshift({date:state.date,text:`${e.title}: ${c}.`});closeModal();render();});}
function maybeStoryline(){ensureV84State();if(state.storylines.filter(x=>x.status==='Open').length>=4||Math.random()>.018)return;let s=pick(state.students.filter(x=>x.status==='Active')),t=teacherForRoom(s?.room),f=s?famFor(s):null;let templates=[{title:`Reading concern — ${s?.first||'Student'} ${s?.last||''}`,stage:`${t?.name||'Teacher'} reports limited progress despite classroom support.`,next:'Collect intervention data and discuss at the next MTSS review.'},{title:`Family communication — ${f?.name||'Lincoln family'}`,stage:'A family has raised a recurring concern and wants clearer follow-up.',next:'Teacher and principal should coordinate a response this week.'},{title:'Staffing signal',stage:'A staff member has begun asking HR questions about next year.',next:'No formal resignation exists. Watch for transfer or retirement signals.'},{title:'Building concern',stage:'A recurring facilities issue has appeared in the same area twice.',next:'Head custodian should inspect and determine whether maintenance escalation is needed.'}];let q=pick(templates);state.storylines.unshift({id:uid('story'),...q,status:'Open',started:state.date,age:0});addTask(`Follow up: ${q.title}`,'This week','Normal');}
function advanceStories(){ensureV84State();state.storylines.filter(x=>x.status==='Open').forEach(x=>{x.age++;if(x.age===2)x.stage=`Follow-up: ${x.stage} Additional information is now available.`;if(x.age>=5&&Math.random()<.45){x.status='Resolved';state.schoolHistory.unshift({date:state.date,text:`Resolved storyline: ${x.title}.`});}});}
function overnightSchool(){ensureV84State();let calloffs=activeEmployees().filter(e=>e.status==='Active'&&Math.random()<.018);calloffs.forEach(e=>{e.status='Absent';let sub=pick(state.subPool.filter(s=>s.reliability>80));if(e.category==='Teacher'&&sub)addTask(`${e.name} absent — ${sub.name} tentatively accepted coverage`,'7:30 AM','High');});state.rooms.forEach(r=>{if(r.cleanliness<92)r.cleanliness=clamp(r.cleanliness+rnd(5,12),0,100)});advanceStories();v84MorningBrief();}
const playableTickV84Old=playableTick;playableTick=function(minutes=5){playableTickV84Old(minutes);maybeInterrupt();maybeStoryline();};
const finishDayV84Old=finishSchoolDay;finishSchoolDay=function(){finishDayV84Old();overnightSchool();};
const renderV84Old=render;render=function(){ensureV84State();renderV84Old();v84Render();};
const loadV84Old=load;load=function(){let raw=localStorage.getItem(SAVE_KEY);if(raw){try{state=JSON.parse(raw);ensureV84State();toast('V8.4 School Day save loaded.');render();return;}catch(e){console.error(e)}}let old=localStorage.getItem(V83_SAVE_KEY);if(old){try{state=JSON.parse(old);ensureV84State();state.schoolHistory.unshift({date:state.date,text:'Upgraded Lincoln to V8.4 School Day.'});v84MorningBrief();toast('Your V8.3 school was upgraded to V8.4.');render();return;}catch(e){console.error(e)}}return loadV84Old();};



/* ================= V8.5 LIVING WORLD / INSTITUTIONAL MEMORY ================= */
function ensureV85State(){ensureV84State();state.version=8.5;state.world=state.world||{};let W=state.world;W.year=parseInt(state.schoolYear)||2026;W.weather=W.weather||{season:'Fall',condition:'Clear',impact:'Normal'};W.districtLeaders=W.districtLeaders||[{role:'Superintendent',name:'Dr. Rebecca Lawson',years:6},{role:'HR Director',name:'Monica Hayes',years:4},{role:'Facilities Director',name:'Brian Keller',years:9},{role:'Transportation Director',name:'Anthony Price',years:7}];W.board=W.board||[{name:'Karen Wells',term:2028},{name:'David Ortiz',term:2028},{name:'Susan Grant',term:2030},{name:'Michael Chen',term:2030},{name:'Rachel King',term:2030}];W.capital=W.capital||[{asset:'Roof',installed:2016,life:25,condition:82},{asset:'HVAC',installed:2019,life:22,condition:86},{asset:'Playground',installed:2022,life:18,condition:91},{asset:'Classroom Furniture',installed:2018,life:20,condition:79}];W.neighborhoods=W.neighborhoods||[{name:'Willow Creek',homes:184,age:6,growth:'Growing'},{name:'Oak Ridge',homes:242,age:28,growth:'Stable'},{name:'Lincoln Heights',homes:316,age:47,growth:'Turnover'},{name:'Prairie View Apartments',homes:126,age:12,growth:'Stable'}];W.traditions=W.traditions||['Fall Family Night','Winter Concert','Spring Field Day','Sixth-Grade Walk'];W.lostFound=W.lostFound||rnd(8,24);W.visitors=W.visitors||[];W.deliveries=W.deliveries||[];W.grants=W.grants||[];W.schoolGoals=W.schoolGoals||[{goal:'Grade 3 Reading Growth',status:'On Track'},{goal:'Attendance',status:'Watch'},{goal:'Teacher Retention',status:'On Track'}];W.principal=W.principal||{salary:98000,contractEnd:W.year+2,years:1,evaluation:'Effective',reputation:'Developing',career:['Principal — Lincoln Elementary']};state.staffMemories=state.staffMemories||[];state.familyMemories=state.familyMemories||[];state.studentRecords=state.studentRecords||{};state.subCoverage=state.subCoverage||[];state.districtRequests=state.districtRequests||[];state.securityLog=state.securityLog||[];state.deliveries=state.deliveries||[];state.classroomChemistry=state.classroomChemistry||{};state.students.forEach(x=>{state.studentRecords[x.id]=state.studentRecords[x.id]||{teachers:[],contacts:[],interventions:[],attendance:[],behavior:[],transport:[],reportCards:[]};});activeEmployees().forEach(e=>{e.lifeEvents=e.lifeEvents||[];e.relationshipEvidence=e.relationshipEvidence||[];e.classroomStyle=e.classroomStyle||pick(['Structured','Collaborative','Warm and relational','Data-driven','Highly organized','Flexible']);e.arrival=e.arrival||rnd(430,475);});}
function rememberStaff(id,text){let e=state.employees.find(x=>x.id===id);if(!e)return;e.relationshipEvidence.unshift(`${state.date}: ${text}`);state.staffMemories.unshift({employeeId:id,date:state.date,text});}
function v85Season(){let m=parseInt(state.date.split('-')[1]||9);return m<=2||m===12?'Winter':m<=5?'Spring':m<=7?'Summer':'Fall'}
function v85Weather(){ensureV85State();let season=v85Season(),pool=season==='Winter'?['Clear','Cloudy','Light Snow','Snow','Cold']:season==='Spring'?['Clear','Rain','Thunderstorms','Cloudy']:season==='Summer'?['Clear','Hot','Thunderstorms']:['Clear','Rain','Cloudy','Fog'];state.world.weather={season,condition:pick(pool),impact:'Normal'};if(['Snow','Fog'].includes(state.world.weather.condition)&&Math.random()<.35)state.world.weather.impact='2-Hour Delay';}
function v85LittleLife(){ensureV85State();if(Math.random()<.06)state.world.lostFound=Math.min(80,state.world.lostFound+1);if(Math.random()<.025)state.deliveries.unshift({date:state.date,item:pick(['Classroom supplies','Toner shipment','Library books','Cafeteria dry goods','Technology equipment']),status:'Received by office'});if(Math.random()<.012){let e=pick(activeEmployees());let ev=pick(['Completed a graduate course','Requested a classroom move next year','Asked about a leadership opportunity','Updated emergency contact information','Mentioned a possible future relocation']);e.lifeEvents.unshift(`${state.date}: ${ev}`);if(/leadership|relocation/.test(ev))rememberStaff(e.id,ev);}}
function v85SubScramble(){ensureV85State();let absent=activeEmployees().filter(e=>e.status==='Absent'&&e.category==='Teacher'),subs=state.subPool.slice().sort((a,b)=>b.reliability-a.reliability);state.subCoverage=[];absent.forEach((e,i)=>{let sub=subs[i];state.subCoverage.push({teacher:e.name,coverage:sub?sub.name:pick(['AP internal coverage','Interventionist coverage','Principal coverage','UNFILLED']),status:sub?'Covered':'Internal plan'});});}
function v85AnnualAging(){ensureV85State();state.world.capital.forEach(a=>a.condition=clamp(a.condition-rnd(1,4),35,100));state.world.neighborhoods.forEach(n=>{n.age++;if(n.age>20&&Math.random()<.2)n.growth='Turnover';});if(Math.random()<.18){let leader=pick(state.world.districtLeaders);leader.years++;}activeEmployees().forEach(e=>{if(Math.random()<.035){let ev=pick(['Earned master’s degree','Became a parent / family leave planned','Relocating closer to family','Considering retirement','Interested in district leadership']);e.lifeEvents.unshift(`${state.date}: ${ev}`);}});}
function v85RenderWorld(){ensureV85State();let host=$('v84SchoolDay');if(!host)return;let old=$('v85World');if(!old){old=document.createElement('section');old.id='v85World';old.className='card padded';host.parentNode.insertBefore(old,host.nextSibling);}let W=state.world;old.innerHTML=`<div class="section-head"><div><h2>Lincoln Living World</h2><p class="muted">You see evidence, not hidden scores. The district remembers what happens.</p></div><button id="deskModeBtn" class="primary">🗂️ Principal Desk</button></div><div class="v85-grid"><div><h3>Today Around Lincoln</h3><div class="compact-item">🌤️ <strong>${W.weather.condition}</strong> • ${W.weather.season} • ${W.weather.impact}</div><div class="compact-item">🧥 Lost & Found: ${W.lostFound} items</div><div class="compact-item">📦 Recent delivery: ${state.deliveries[0]?.item||'None today'}</div><div class="compact-item">🚪 Visitors today: ${W.visitors.length}</div><h3>Substitute Coverage</h3>${state.subCoverage.map(x=>`<div class="compact-item"><strong>${x.teacher}</strong> → ${x.coverage}</div>`).join('')||'<p class="muted">No teacher coverage needed.</p>'}</div><div><h3>School Improvement</h3>${W.schoolGoals.map(g=>`<div class="position-row"><span>${g.goal}</span><strong>${g.status}</strong></div>`).join('')}<h3>Building Lifecycle</h3>${W.capital.map(a=>`<div class="position-row"><span>${a.asset} (${a.installed})</span><strong>${a.condition}%</strong></div>`).join('')}</div><div><h3>Community</h3>${W.neighborhoods.map(n=>`<div class="compact-item"><strong>${n.name}</strong><br>${n.homes} homes • ${n.growth}</div>`).join('')}</div><div><h3>District Leadership</h3>${W.districtLeaders.map(d=>`<div class="compact-item"><strong>${d.name}</strong><br>${d.role} • ${d.years} yrs in role</div>`).join('')}<h3>Traditions</h3>${W.traditions.map(t=>`<span class="student-life-chip">${t}</span>`).join('')}</div></div>`;$('deskModeBtn').onclick=v85Desk;}
function v85Desk(){ensureV85State();openModal('🗂️ Principal Desk',`<div class="desk-grid"><button id="deskCalendar">📅<strong>Calendar</strong><span>${state.schedule.length} items</span></button><button id="deskTasks">✅<strong>Task Folder</strong><span>${state.principalTasks.filter(x=>!x.done).length} open</span></button><button id="deskPeople">👩‍🏫<strong>Personnel</strong><span>${activeEmployees().length} employees</span></button><button id="deskStudents">🎒<strong>Student Files</strong><span>${state.students.filter(x=>x.status==='Active').length} active</span></button><button id="deskBoard">🏛️<strong>Board Packet</strong><span>${state.boardItems?.length||0} items</span></button><button id="deskBuilding">🏫<strong>Building Map</strong><span>${state.workOrders.filter(x=>x.status==='Open').length} work orders</span></button></div><h3>Recent institutional memory</h3>${state.schoolHistory.slice(0,8).map(x=>`<div class="compact-item"><strong>${x.date}</strong> — ${x.text}</div>`).join('')}`);let go=id=>{closeModal();document.querySelector(`[data-view="${id}"]`)?.click()};$('deskPeople').onclick=()=>go('staff');$('deskStudents').onclick=()=>go('students');$('deskBuilding').onclick=()=>go('building');$('deskBoard').onclick=()=>go('board');$('deskTasks').onclick=()=>{closeModal();document.querySelector('[data-view="command"]')?.click()};$('deskCalendar').onclick=$('deskTasks').onclick;}
function v85CommunityEvent(){ensureV85State();if(Math.random()>.012)return;let ev=pick(['A new phase of Willow Creek opened; enrollment projections increased.','A university requested student-teacher placements for next semester.','The PTO proposed funding new playground equipment.','District facilities announced a five-year capital planning review.','A community group requested evening use of the gym.','A neighboring elementary is competing for the same teacher applicant.']);state.schoolHistory.unshift({date:state.date,text:ev});addTask(ev,'This week','Normal');}
const tickV85Old=playableTick;playableTick=function(minutes=5){tickV85Old(minutes);v85LittleLife();v85CommunityEvent();};
const overnightV85Old=overnightSchool;overnightSchool=function(){overnightV85Old();v85Weather();v85SubScramble();};
const yearV85Old=endSchoolYear;endSchoolYear=function(){v85AnnualAging();yearV85Old();};
const renderV85Old=render;render=function(){ensureV85State();renderV85Old();v85SubScramble();v85RenderWorld();};
const loadV85Old=load;load=function(){let raw=localStorage.getItem(SAVE_KEY);if(raw){try{state=JSON.parse(raw);ensureV85State();toast('V8.5 Living World save loaded.');render();return;}catch(e){console.error(e)}}let old=localStorage.getItem(V84_SAVE_KEY);if(old){try{state=JSON.parse(old);ensureV85State();state.schoolHistory.unshift({date:state.date,text:'Upgraded Lincoln to V8.5 Living World.'});v85Weather();toast('Your V8.4 school was upgraded to V8.5.');render();return;}catch(e){console.error(e)}}return loadV85Old();};

window.addEventListener('error',e=>startupFailure(e.error||e.message));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initApp,{once:true});else initApp();
