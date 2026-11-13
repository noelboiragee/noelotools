const samples=[
"The quick brown fox jumps over the lazy dog while the morning sun rises above the quiet village.",
"Clear writing helps people understand ideas, make decisions and communicate with confidence.",
"Technology works best when useful features remain simple, reliable and accessible to everyone.",
"A good routine is built through small actions repeated consistently over a long period of time.",
"Learning a new skill takes patience, practice and a willingness to correct mistakes along the way.",
"European cities connect history, modern transport, public spaces and a wide range of cultures.",
"Measure twice, plan carefully and complete each task with attention to the important details.",
"Digital tools can save time when they solve a real problem without creating unnecessary complexity.",
"Reading every day improves vocabulary, comprehension and the ability to explain difficult concepts.",
"Accurate information is valuable because good decisions depend on facts rather than assumptions.",
"People work together more effectively when expectations are clear and feedback is constructive.",
"The library was quiet, the afternoon was bright and a gentle breeze moved through the trees.",
"Strong passwords should be unique, difficult to guess and stored in a trusted password manager.",
"Public transport can make city journeys easier while reducing congestion on busy roads.",
"Careful planning helps a project stay organised, measurable and focused on its main objective.",
"Numbers describe patterns, but context is needed to understand what those patterns really mean.",
"Good design makes important information easier to find, read and use on a small screen.",
"Practice builds confidence because each attempt reveals something useful to improve next time.",
"A reliable website should load quickly, explain its purpose and work with different devices.",
"Fresh ingredients, simple recipes and thoughtful preparation can make everyday meals enjoyable.",
"Time zones are based on regional rules that may change when daylight saving time begins or ends.",
"Scientific thinking starts with a clear question, a testable idea and careful observation.",
"An effective calculator should explain its inputs and present results in a clear format.",
"Small improvements can create meaningful progress when they are measured and maintained.",
"Respectful communication helps people exchange ideas even when they have different opinions.",
"Maps help travellers understand distance, direction and the places connected by a route.",
"Energy efficiency can reduce waste while helping homes and businesses manage their resources.",
"Every useful tool should validate inputs and explain how to correct a problem.",
"Learning from reliable sources makes research more accurate and easier to verify.",
"The best solution is often the one that is understandable, maintainable and fit for purpose."
];
const $=s=>document.querySelector(s);let target="",started=false,finished=false,startAt=0,endAt=0,timer=null;
function sample(){target=samples[Math.floor(Math.random()*samples.length)];render();reset();}
function render(){const typed=$("#typing-input").value;$("#passage").replaceChildren();[...target].forEach((ch,i)=>{const span=document.createElement("span");span.textContent=ch;span.className=i<typed.length?(typed[i]===ch?"correct":"incorrect"):(i===typed.length?"current":"");$("#passage").append(span);});}
function stats(){const typed=$("#typing-input").value;let correct=0;for(let i=0;i<typed.length;i++)if(typed[i]===target[i])correct++;const elapsed=Math.max(1,(Date.now()-startAt)/60000);$("#wpm").textContent=String(Math.round(correct/5/elapsed));$("#accuracy").textContent=(typed.length?Math.round(correct/typed.length*100):100)+"%";$("#typing-status").textContent="Errors: "+(typed.length-correct);}
function stop(){clearInterval(timer);finished=true;$("#typing-input").disabled=true;$("#start").disabled=true;$("#typing-status").textContent+=" · Test complete.";}
function reset(){clearInterval(timer);started=false;finished=false;$("#typing-input").value="";$("#typing-input").disabled=true;$("#start").disabled=false;$("#start").textContent="Start";$("#time-left").textContent=$("#duration").value+"s";$("#wpm").textContent="0";$("#accuracy").textContent="100%";$("#typing-status").textContent="Press Start to begin.";render();}
function begin(){if(started||finished)return;started=true;startAt=Date.now();endAt=startAt+Number($("#duration").value)*1000;$("#typing-input").disabled=false;$("#typing-input").focus();$("#start").textContent="Running";timer=setInterval(()=>{const left=Math.max(0,Math.ceil((endAt-Date.now())/1000));$("#time-left").textContent=left+"s";stats();if(!left)stop();},200);}
$("#start").addEventListener("click",begin);$("#restart").addEventListener("click",()=>{reset();begin();});$("#new-sample").addEventListener("click",sample);$("#duration").addEventListener("change",()=>{reset();});$("#typing-input").addEventListener("input",()=>{if(!started&&!finished)begin();render();stats();if($("#typing-input").value.length>=target.length)stop();});sample();