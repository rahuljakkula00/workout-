const STORAGE_KEY = "fitguide_profile_v1";
const LOG_KEY = "fitguide_logs_v1";

const exercises = [
  {name:"Bodyweight Squat",muscle:"Legs",sets:"3 × 8–12",tip:"Keep feet stable, brace your core, and move under control.",query:"bodyweight squat proper form beginner"},
  {name:"Push-Up",muscle:"Chest / arms",sets:"3 × 6–12",tip:"Use a wall or bench if a floor push-up is too difficult.",query:"beginner push up proper form"},
  {name:"Lat Pulldown",muscle:"Back",sets:"3 × 8–12",tip:"Pull toward the upper chest without swinging your body.",query:"lat pulldown proper form beginner"},
  {name:"Dumbbell Row",muscle:"Back / arms",sets:"3 × 8–12",tip:"Keep your back neutral and pull the elbow toward your hip.",query:"one arm dumbbell row proper form"},
  {name:"Dumbbell Shoulder Press",muscle:"Shoulders",sets:"2–3 × 8–12",tip:"Start light and avoid locking or forcing the shoulders.",query:"dumbbell shoulder press proper form beginner"},
  {name:"Glute Bridge",muscle:"Glutes",sets:"3 × 10–15",tip:"Squeeze the glutes at the top without over-arching your lower back.",query:"glute bridge proper form beginner"},
  {name:"Plank",muscle:"Core",sets:"3 × 20–40 sec",tip:"Keep ribs down and body in a straight line.",query:"plank proper form beginner"},
  {name:"Walking / Treadmill",muscle:"Cardio",sets:"15–30 min",tip:"Use a pace that raises breathing but still lets you speak short sentences.",query:"beginner treadmill walking workout"},
  {name:"Stationary Bike",muscle:"Cardio",sets:"15–25 min",tip:"Start easy and gradually increase resistance.",query:"beginner stationary bike workout"},
];

const defaultProfile = {name:"",age:20,sex:"male",height:170,weight:70,goal:"lose",activity:1.55,days:4,gymFee:1000,foodBudget:6000,otherCost:500};

function $(id){return document.getElementById(id)}
function loadProfile(){try{return {...defaultProfile,...JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}")}}catch{return {...defaultProfile}}}
function saveProfile(p){localStorage.setItem(STORAGE_KEY,JSON.stringify(p))}
function loadLogs(){try{return JSON.parse(localStorage.getItem(LOG_KEY)||"[]")}catch{return []}}
function saveLogs(x){localStorage.setItem(LOG_KEY,JSON.stringify(x))}

function calculate(p){
  const bmi = p.weight / ((p.height/100)**2);
  const bmr = 10*p.weight + 6.25*p.height - 5*p.age + (p.sex==="male"?5:-161);
  const tdee = bmr * Number(p.activity);
  let target = tdee;
  if(p.goal==="lose") target -= 400;
  if(p.goal==="gain") target += 250;
  target = Math.max(1200,Math.round(target/50)*50);
  // Conservative beginner exercise-burn planning; actual burn varies with intensity/body size.
  const burnTarget = p.days ? Math.round(180 * Number(p.days) / 7) : 150;
  return {bmi,bmr,tdee,target,burnTarget};
}
function money(n){return "₹"+Math.round(Number(n)||0).toLocaleString("en-IN")}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function renderProfile(){
  const p=loadProfile();
  ["name","age","sex","height","weight","goal","activity","days","gymFee","foodBudget","otherCost"].forEach(k=>{if($(k)) $(k).value=p[k]});
  const d=calculate(p);
  $("heroWeight").textContent=p.weight||"—";
  $("heroTarget").textContent=d.target||"—";
  $("heroBurn").textContent=d.burnTarget||"—";
  $("bmi").textContent=d.bmi.toFixed(1);
  $("bmiLabel").textContent=d.bmi<18.5?"Below common adult BMI range":d.bmi<25?"Common adult BMI range":d.bmi<30?"Above common adult BMI range":"High BMI range";
  $("tdee").textContent=Math.round(d.tdee).toLocaleString();
  $("targetCalories").textContent=d.target.toLocaleString();
  $("burnTarget").textContent=d.burnTarget.toLocaleString();
  $("monthlyCost").textContent=money(Number(p.gymFee)+Number(p.foodBudget)+Number(p.otherCost));
  $("expenseGym").textContent=money(p.gymFee); $("expenseFood").textContent=money(p.foodBudget); $("expenseOther").textContent=money(p.otherCost);
  $("expenseTotal").textContent=money(Number(p.gymFee)+Number(p.foodBudget)+Number(p.otherCost));
  $("workoutSummary").textContent=`${p.days} training days/week · goal: ${p.goal==="lose"?"fat loss":p.goal==="gain"?"muscle/weight gain":"maintenance"}`;
  renderWorkout(p); renderDiet(p); renderLogs();
}

function renderWorkout(p){
  const n=Number(p.days)||4;
  const plans = [
    ["Day 1","Full Body A",["Squat","Push-Up","Lat Pulldown","Plank"]],
    ["Day 2","Cardio + Core",["Walking / Treadmill","Glute Bridge","Plank"]],
    ["Day 3","Rest / recovery",["Easy walk","Mobility"]],
    ["Day 4","Full Body B",["Dumbbell Row","Dumbbell Shoulder Press","Glute Bridge","Squat"]],
    ["Day 5","Cardio",["Walking / Treadmill","Stationary Bike"]],
    ["Day 6","Optional easy activity",["Walking / Treadmill","Mobility"]],
  ];
  $("workoutPlan").innerHTML=plans.slice(0,n+1).map(x=>`<article class="workout-card"><p>${x[0]}</p><h3>${x[1]}</h3><p>${x[2].join(" · ")}</p><small>Warm up 5–10 min · Rest 60–120 sec between sets · Stop if you feel sharp pain or feel unwell.</small></article>`).join("");
  $("exerciseLibrary").innerHTML=exercises.map(e=>`<article class="exercise card"><span class="tag">${e.muscle}</span><h3>${e.name}</h3><strong>${e.sets}</strong><p>${e.tip}</p><a class="btn secondary video-btn" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(e.query)}">▶ Video guide</a></article>`).join("");
}

function renderDiet(p){
  const d=calculate(p), c=d.target;
  const meals = [
    ["Breakfast",Math.round(c*.25),p.goal==="gain"?"Oats + milk + banana + eggs/paneer":"Oats + curd/milk + fruit + eggs/paneer"],
    ["Lunch",Math.round(c*.30),"Rice/roti + dal + vegetables + curd + a protein source"],
    ["Snack",Math.round(c*.10),"Fruit + curd/milk OR roasted chana/nuts"],
    ["Dinner",Math.round(c*.25),"Roti/rice + vegetables + dal/chicken/fish/paneer/tofu"],
  ];
  $("dietPlan").innerHTML=meals.map(m=>`<article class="meal card"><p class="eyebrow">${m[0]}</p><h3>~${m[1]} kcal</h3><p>${m[2]}</p></article>`).join("");
}

function renderLogs(){
  const logs=loadLogs().sort((a,b)=>b.date.localeCompare(a.date));
  $("daysLogged").textContent=logs.length;
  $("totalMinutes").textContent=logs.reduce((s,x)=>s+Number(x.exerciseMinutes||0),0);
  $("totalBurned").textContent=Math.round(logs.reduce((s,x)=>s+Number(x.caloriesBurned||0),0)).toLocaleString();
  $("latestWeight").textContent=logs.length?logs[0].weight+" kg":"—";
  $("logTable").innerHTML=logs.length?logs.slice(0,30).map(x=>`<tr><td>${esc(x.date)}</td><td>${esc(x.weight)} kg</td><td>${esc(x.exerciseMinutes)} min</td><td>${esc(x.caloriesBurned)} kcal</td><td>${esc(x.caloriesEaten||"—")}</td><td>${x.workoutDone?"✓":"—"}</td></tr>`).join(""):`<tr><td colspan="6">No logs yet. Save your first day above.</td></tr>`;
}

function assistantAnswer(q){
  const x=q.toLowerCase();
  if(x.includes("squat")) return "For a beginner squat: feet about shoulder-width, brace your core, sit down and back, keep your knees tracking in line with your toes, then stand. Start with bodyweight and use a stable support if needed.";
  if(x.includes("push")) return "Start with wall or incline push-ups if floor push-ups are hard. Keep your body straight, lower under control, and stop before form breaks.";
  if(x.includes("diet")||x.includes("food")) return "A simple plate is vegetables + a protein source + a carbohydrate source. Protein options include dal, beans, eggs, milk/curd, paneer, tofu, chicken or fish. Your calorie target is only an estimate.";
  if(x.includes("calorie")||x.includes("burn")) return "Calorie burn depends on body weight, exercise type, duration and intensity. Treat tracker values as estimates. Consistency matters more than trying to burn a very large number each day.";
  if(x.includes("beginner")||x.includes("start")) return "Start with 3–4 training days, manageable weights, 5–10 minutes of warm-up and 1–2 rest days. Learn technique before increasing weight.";
  if(x.includes("protein")) return "Protein can come from dal, beans, dairy, eggs, fish, chicken, paneer or tofu. Spread protein across meals rather than relying on one large meal.";
  if(x.includes("pain")) return "Sharp pain, chest pain, fainting, severe dizziness or unusual shortness of breath are reasons to stop and seek appropriate medical help. Normal muscle effort is different from sharp pain.";
  return "I can help with beginner exercise form, workout structure, calories, diet basics and tracking. Try asking: “How do I do a squat?” or “How should a beginner start?” For broader AI conversation, use the Meta AI button.";
}

document.addEventListener("DOMContentLoaded",()=>{
  const today=new Date().toISOString().slice(0,10);
  $("logDate").value=today;
  renderProfile();

  $("profileForm").addEventListener("submit",e=>{
    e.preventDefault();
    const p={name:$("name").value.trim(),age:Number($("age").value),sex:$("sex").value,height:Number($("height").value),weight:Number($("weight").value),goal:$("goal").value,activity:Number($("activity").value),days:Number($("days").value),gymFee:Number($("gymFee").value),foodBudget:Number($("foodBudget").value),otherCost:Number($("otherCost").value)};
    saveProfile(p); renderProfile(); $("formMessage").textContent="Plan updated ✓"; setTimeout(()=>$("formMessage").textContent="",2500);
  });

  $("logForm").addEventListener("submit",e=>{
    e.preventDefault();
    const logs=loadLogs();
    logs.push({date:$("logDate").value,weight:Number($("logWeight").value),exerciseMinutes:Number($("exerciseMinutes").value),caloriesBurned:Number($("caloriesBurned").value),caloriesEaten:Number($("caloriesEaten").value),water:Number($("water").value),workoutDone:$("workoutDone").checked});
    saveLogs(logs); renderLogs();
  });

  $("chatForm").addEventListener("submit",e=>{
    e.preventDefault(); const input=$("chatText"), q=input.value.trim(); if(!q)return;
    $("chatMessages").insertAdjacentHTML("beforeend",`<div class="message user">${esc(q)}</div><div class="message bot">${esc(assistantAnswer(q))}</div>`);
    input.value=""; $("chatMessages").scrollTop=$("chatMessages").scrollHeight;
  });

  $("resetBtn").addEventListener("click",()=>{
    if(confirm("Delete this browser's FitGuide profile and logs?")){localStorage.removeItem(STORAGE_KEY);localStorage.removeItem(LOG_KEY);location.reload();}
  });
});