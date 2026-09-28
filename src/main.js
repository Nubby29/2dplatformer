// Phase 2 — reusable level flow, checkpoint, animation state and improved combat.
import { SAGAS } from "../data/sagas.js";
import { LEVELS } from "./levels.js";
import { CONFIG,createPlayer,rectsOverlap,groundY,moveAndCollide } from "./engine.js";

const canvas=document.querySelector("#game"),ctx=canvas.getContext("2d");
ctx.imageSmoothingEnabled=false;
const titleScreen=document.querySelector("#title-screen"),gameScreen=document.querySelector("#game-screen"),completeScreen=document.querySelector("#complete-screen");
const message=document.querySelector("#message"),healthText=document.querySelector("#health"),levelName=document.querySelector("#level-name");
const keys=new Set();let animationId=0,game=null,last=performance.now(),jumpWasDown=false,attackWasDown=false;

window.addEventListener("keydown",e=>{
  const k=e.key.toLowerCase();keys.add(k);
  if([" ","arrowleft","arrowright","arrowup","arrowdown"].includes(k))e.preventDefault();
  if(k==="r"&&game)resetLevel();
});
window.addEventListener("keyup",e=>keys.delete(e.key.toLowerCase()));
document.querySelector("#start-button").onclick=startGame;
document.querySelector("#replay-button").onclick=startGame;

function startGame(){
 titleScreen.classList.add("hidden");completeScreen.classList.add("hidden");gameScreen.classList.remove("hidden");
 resetLevel();cancelAnimationFrame(animationId);last=performance.now();loop(performance.now());
}
function resetLevel(){
 const level=LEVELS["troy-01"];
 game={time:0,cameraX:0,won:false,checkpointReached:false,level,
 player:createPlayer(level.spawn),checkpoint:{...level.spawn},enemies:level.enemies.map(e=>({...e,w:10,h:17,vx:0,alive:true,attackCooldown:0})),particles:[],banner:0};
 levelName.textContent="Troy Saga • The Horse and the Infant";healthText.textContent="♥♥♥";
 showMessage("TROY — reach the gate. Checkpoints save your progress.");
}
function respawn(){
 const p=game.player,cp=game.checkpoint;
 p.x=cp.x;p.y=cp.y;p.vx=0;p.vy=0;p.health=p.maxHealth;p.invuln=.8;
 healthText.textContent="♥♥♥";showMessage(game.checkpointReached?"Checkpoint reached — continue the journey.":"Try again.");
}
function showMessage(text){
 message.textContent=text;message.classList.remove("hidden");
 clearTimeout(showMessage.timer);showMessage.timer=setTimeout(()=>message.classList.add("hidden"),2400);
}
function update(dt){
 if(!game||game.won)return;
 game.time+=dt;const p=game.player;
 p.invuln=Math.max(0,p.invuln-dt);p.attack=Math.max(0,p.attack-dt);
 const left=keys.has("a")||keys.has("arrowleft"),right=keys.has("d")||keys.has("arrowright");
 const jump=keys.has(" ")||keys.has("w")||keys.has("arrowup"),attack=keys.has("j")||keys.has("k");
 p.vx=left?-CONFIG.moveSpeed:right?CONFIG.moveSpeed:0;
 if(p.vx!==0)p.face=Math.sign(p.vx);
 if(jump&&!jumpWasDown&&p.onGround){p.vy=CONFIG.jumpVelocity;p.onGround=false}
 if(attack&&!attackWasDown&&p.attack<=0)p.attack=.24;
 jumpWasDown=jump;attackWasDown=attack;
 p.vy+=CONFIG.gravity;moveAndCollide(p,game.level.platforms);
 for(const e of game.enemies)updateEnemy(e,dt);
 if(p.y>190){respawn();return}
 if(!game.checkpointReached&&p.x>=game.level.checkpoint.x){
   game.checkpointReached=true;game.checkpoint={x:game.level.checkpoint.x,y:game.level.checkpoint.y};showMessage("CHECKPOINT — the road continues.");
 }
 if(p.x+p.w>=game.level.goal.x){
   game.won=true;completeScreen.classList.remove("hidden");gameScreen.classList.add("hidden");return;
 }
 game.cameraX=Math.max(0,Math.min(game.level.width-320,p.x-90));
 for(const part of game.particles){part.x+=part.vx;part.y+=part.vy;part.vy+=.03;part.life-=dt}
 game.particles=game.particles.filter(p=>p.life>0);
}
function updateEnemy(e,dt){
 if(!e.alive)return;
 const p=game.player,dx=p.x-e.x;
 e.attackCooldown=Math.max(0,e.attackCooldown-dt);
 e.vx=Math.abs(dx)<52?Math.sign(dx)*.35:0;e.x+=e.vx;
 e.y=groundY(game.level.platforms,e.x,e.w,e.h);
 if(p.attack>0&&Math.abs((p.x+p.w/2)-(e.x+e.w/2))<20&&Math.abs(p.y-e.y)<18){
   e.alive=false;burst(e.x+5,e.y+8);return;
 }
 if(rectsOverlap(p,e)&&p.invuln<=0){
   p.health--;p.invuln=.8;p.vx=-Math.sign(e.x-p.x)*2.4;p.vy=-3;
   healthText.textContent="♥".repeat(p.health)+"♡".repeat(p.maxHealth-p.health);
   if(p.health<=0)respawn();
 }
}
function burst(x,y){for(let i=0;i<10;i++)game.particles.push({x,y,vx:(Math.random()-.5)*2.4,vy:(Math.random()-1.2)*2,life:.5})}
function draw(){
 const cam=game.cameraX;ctx.clearRect(0,0,320,180);
 ctx.fillStyle="#18243a";ctx.fillRect(0,0,320,180);
 ctx.fillStyle="#22344c";
 for(let x=-((cam*.15)%48);x<320;x+=48){ctx.fillRect(x,92,32,72);ctx.fillRect(x+7,82,18,10);ctx.fillRect(x+12,72,8,10)}
 ctx.fillStyle="#31425a";ctx.fillRect(0,148,320,32);
 for(const pl of game.level.platforms){const x=Math.floor(pl.x-cam);ctx.fillStyle="#60452f";ctx.fillRect(x,pl.y,pl.w,pl.h);ctx.fillStyle="#8b6a42";ctx.fillRect(x,pl.y,pl.w,3)}
 const cp=game.level.checkpoint.x-cam;ctx.fillStyle=game.checkpointReached?"#e0ad62":"#76644b";ctx.fillRect(cp,143,2,21);
 const gx=game.level.goal.x-cam;ctx.fillStyle="#d8c39b";ctx.fillRect(gx,game.level.goal.y,2,44);ctx.fillStyle="#c94d4d";ctx.fillRect(gx+2,game.level.goal.y,15,8);
 for(const e of game.enemies)if(e.alive)drawEnemy(e,cam);
 drawPlayer(cam);
 for(const part of game.particles){ctx.fillStyle="#e0ad62";ctx.fillRect(Math.floor(part.x-cam),Math.floor(part.y),2,2)}
 ctx.fillStyle="#f6e8c8";ctx.font="6px monospace";ctx.fillText("TROY",8,12);ctx.fillText("Reach the gate",248,12);
}
function drawEnemy(e,cam){
 const x=Math.floor(e.x-cam),frame=Math.floor(game.time*8)%2;
 ctx.fillStyle="#161a25";ctx.fillRect(x+2,e.y+5,7,12);
 ctx.fillStyle="#a96c54";ctx.fillRect(x+2,e.y-frame,7,7);
 ctx.fillStyle="#d6c29c";ctx.fillRect(x+3,e.y+1-frame,5,2);
 ctx.fillStyle="#5c2630";ctx.fillRect(x,e.y+7,10,2);
}
function drawPlayer(cam){
 const p=game.player,px=Math.floor(p.x-cam),frame=p.onGround&&Math.abs(p.vx)>.1?Math.floor(game.time*10)%2:0;
 ctx.save();if(p.invuln>0&&Math.floor(game.time*18)%2===0)ctx.globalAlpha=.35;
 ctx.fillStyle="#172033";ctx.fillRect(px+2,p.y+7,7,9);
 ctx.fillStyle="#b47b5e";ctx.fillRect(px+2,p.y-frame,7,8);
 ctx.fillStyle="#c5a46d";ctx.fillRect(px+1,p.y+1-frame,9,3);
 ctx.fillStyle="#5e382c";ctx.fillRect(px+1,p.y+7,9,2);
 ctx.fillStyle="#d8c39b";ctx.fillRect(px+2,p.y+15,3,2+frame);ctx.fillRect(px+7,p.y+15,3,2+(1-frame));
 if(p.attack>0){ctx.fillStyle="#f1dfad";const ax=p.face>0?px+10:px-8;ctx.fillRect(ax,p.y+6,8,2);ctx.fillRect(ax+(p.face>0?6:-2),p.y+4,2,6)}
 ctx.restore();
}
function loop(now){const dt=Math.min(.033,(now-last)/1000);last=now;update(dt);draw();animationId=requestAnimationFrame(loop)}
