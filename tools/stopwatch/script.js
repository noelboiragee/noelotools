// বাংলা: performance.now() দিয়ে elapsed time গণনা করা হয়, তাই background tab-এও সময় ঠিক থাকে।
const display=document.querySelector("#stopwatch-display"),state=document.querySelector("#stopwatch-state");
const startBtn=document.querySelector("#start"),pauseBtn=document.querySelector("#pause"),lapBtn=document.querySelector("#lap"),resetBtn=document.querySelector("#reset"),laps=document.querySelector("#laps");
let startedAt=null,elapsed=0,frame=0,lapNumber=0;
function elapsedNow(){return elapsed+(startedAt===null?0:performance.now()-startedAt)}
function format(ms){const cs=Math.floor(ms/10)%100,total=Math.floor(ms/1000),s=total%60,m=Math.floor(total/60)%60,h=Math.floor(total/3600);return [h,m,s].map(v=>String(v).padStart(2,"0")).join(":")+"."+String(cs).padStart(2,"0")}
function render(){display.textContent=format(elapsedNow());if(startedAt!==null)frame=requestAnimationFrame(render)}
function start(){if(startedAt!==null)return;startedAt=performance.now();state.textContent="Running";startBtn.disabled=true;pauseBtn.disabled=false;lapBtn.disabled=false;cancelAnimationFrame(frame);render()}
function pause(){if(startedAt===null)return;elapsed=elapsedNow();startedAt=null;cancelAnimationFrame(frame);display.textContent=format(elapsed);state.textContent="Paused";startBtn.disabled=false;pauseBtn.disabled=true;lapBtn.disabled=true}
startBtn.addEventListener("click",start);pauseBtn.addEventListener("click",pause);
lapBtn.addEventListener("click",()=>{if(startedAt===null)return;lapNumber++;const li=document.createElement("li");li.textContent="Lap "+lapNumber+" — "+format(elapsedNow());if(lapNumber===1)laps.replaceChildren();laps.prepend(li)});
resetBtn.addEventListener("click",()=>{cancelAnimationFrame(frame);startedAt=null;elapsed=0;lapNumber=0;display.textContent=format(0);laps.innerHTML="<li>No laps recorded.</li>";state.textContent="Ready";startBtn.disabled=false;pauseBtn.disabled=true;lapBtn.disabled=true});