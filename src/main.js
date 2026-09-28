// Phase 1 — playable prototype for Troy Saga: The Horse and the Infant.
import { SAGAS } from "../data/sagas.js";

const canvas=document.querySelector("#game"),ctx=canvas.getContext("2d");
ctx.imageSmoothingEnabled=false;
const titleScreen=document.querySelector("#title-screen"),gameScreen=document.querySelector("#game-screen"),completeScreen=document.querySelector("#complete-screen");
const message=document.querySelector("#message"),healthText=document.querySelector("#health");
const keys=new Set(); let animationId=0,game=null,last=performance.now();

window.addEventListener("keydown",e=>{
  keys.add(e.key.toLowerCase());
  if([" ","arrowleft","arrowright","arrowup","arrowdown"].includes(e.key.toLowerCase()))e.preventDefault();
  if(e.key.toLowerCase()==="r"&&game)resetLevel();
});
window.addEventListener("keyup",e=>keys.delete(e.key.toLowerCase()));
document.querySelector("#start-button").onclick=startGame;
document.querySelector("#replay-button").onclick=startGame;

function startGame(){
  titleScreen.classList.add("hidden");completeScreen.classList.add("hidden");gameScreen.classList.remove("hidden");
  resetLevel();cancelAnimationFrame(animationId);last=performance.now();loop(performance.now());
}
function resetLevel(){
  game={time:0,cameraX:0,won:false,
    player:{x:28,y:120,w:10,h:16,vx:0,vy:0,onGround:false,face:1,health:3,attack:0,invuln:0},
    platforms:[
      {x:0,y:164,w:520,h:16},{x:72,y:136,w:42,h:8},{x:150,y:116,w:46,h:8},
      {x:225,y:142,w:54,h:8},{x:315,y:122,w:52,h:8},{x:400,y:98,w:44,h:8},{x:468,y:136,w:52,h:8}
    ],
    enemies:[{x:104,y:119,w:10,h:17,vx:0,alive:true,cool:0},{x:247,y:125,w:10,h:17,vx:0,alive:true,cool:0},{x:350,y:105,w:10,h:17,vx:0,alive:true,cool:0}],
    goal:{x:505,y:120,w:8,h:44},particles:[]
  };
  healthText.textContent="♥♥♥";showMessage("TROY — The Horse and the Infant");
}
function showMessage(text){
  message.textContent=text;message.classList.remove("hidden");
  setTimeout(()=>message.classList.add("hidden"),2200);
}
function update(dt){
  if(!game||game.won)return;
  game.time+=dt;const p=game.player;
  p.invuln=Math.max(0,p.invuln-dt);p.attack=Math.max(0,p.attack-dt);
  const left=keys.has("a")||keys.has("arrowleft"),right=keys.has("d")||keys.has("arrowright");
  const jump=keys.has(" ")||keys.has("w")||keys.has("arrowup");
  p.vx=0;if(left){p.vx=-1.7;p.face=-1}if(right){p.vx=1.7;p.face=1}
  if(jump&&p.onGround){p.vy=-5.2;p.onGround=false}
  if(keys.has("j")&&p.attack<=0)p.attack=.22;
  p.vy+=.28;moveAndCollide(p);
  for(const e of game.enemies){
    if(!e.alive)continue;e.cool=Math.max(0,e.cool-dt);
    const dx=p.x-e.x;e.vx=Math.abs(dx)<46?Math.sign(dx)*.35:0;e.x+=e.vx;e.y=groundY(e.x,e.w,e.h);
    if(p.attack>0&&Math.abs((p.x+p.w/2)-(e.x+e.w/2))<20&&Math.abs(p.y-e.y)<18){e.alive=false;burst(e.x+5,e.y+8)}
    if(e.alive&&rectsOverlap(p,e)&&p.invuln<=0){
      p.health--;p.invuln=.8;p.vx=-Math.sign(e.x-p.x)*2.4;p.vy=-3;
      healthText.textContent="♥".repeat(p.health)+"♡".repeat(3-p.health);
      if(p.health<=0){resetLevel();return}
    }
  }
  if(p.y>190){resetLevel();return}
  if(p.x+p.w>=game.goal.x){
    game.won=true;completeScreen.classList.remove("hidden");gameScreen.classList.add("hidden");return;
  }
  game.cameraX=Math.max(0,Math.min(220,p.x-90));
  for(const part of game.particles){part.x+=part.vx;part.y+=part.vy;part.life-=dt}
  game.particles=game.particles.filter(x=>x.life>0);
}
function moveAndCollide(p){
  p.x+=p.vx;
  for(const plat of game.platforms)if(rectsOverlap(p,plat)){if(p.vx>0)p.x=plat.x-p.w;if(p.vx<0)p.x=plat.x+plat.w}
  p.y+=p.vy;p.onGround=false;
  for(const plat of game.platforms)if(rectsOverlap(p,plat)){
    if(p.vy>0){p.y=plat.y-p.h;p.vy=0;p.onGround=true}else if(p.vy<0){p.y=plat.y+plat.h;p.vy=0}
  }
}
function groundY(x,w,h){
  let y=148;for(const plat of game.platforms)if(x+w>plat.x&&x<plat.x+plat.w&&plat.y<y+h)y=Math.min(y,plat.y-h);return y;
}
function rectsOverlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
function burst(x,y){for(let i=0;i<8;i++)game.particles.push({x,y,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,life:.45})}
function draw(){
  const cam=game.cameraX;ctx.clearRect(0,0,320,180);
  ctx.fillStyle="#18243a";ctx.fillRect(0,0,320,180);
  ctx.fillStyle="#22344c";
  for(let x=-((cam*.15)%48);x<320;x+=48){ctx.fillRect(x,92,32,72);ctx.fillRect(x+7,82,18,10);ctx.fillRect(x+12,72,8,10)}
  ctx.fillStyle="#31425a";ctx.fillRect(0,148,320,32);
  for(const pl of game.platforms){const x=Math.floor(pl.x-cam);ctx.fillStyle="#60452f";ctx.fillRect(x,pl.y,pl.w,pl.h);ctx.fillStyle="#8b6a42";ctx.fillRect(x,pl.y,pl.w,3)}
  const gx=game.goal.x-cam;ctx.fillStyle="#d8c39b";ctx.fillRect(gx,game.goal.y,2,44);ctx.fillStyle="#c94d4d";ctx.fillRect(gx+2,game.goal.y,15,8);
  for(const e of game.enemies)if(e.alive){const x=e.x-cam;ctx.fillStyle="#161a25";ctx.fillRect(x+2,e.y+5,7,12);ctx.fillStyle="#a96c54";ctx.fillRect(x+2,e.y,7,7);ctx.fillStyle="#d6c29c";ctx.fillRect(x+3,e.y+1,5,2);ctx.fillStyle="#5c2630";ctx.fillRect(x,e.y+7,10,2)}
  const p=game.player,px=Math.floor(p.x-cam);ctx.save();
  if(p.invuln>0&&Math.floor(game.time*18)%2===0)ctx.globalAlpha=.35;
  ctx.fillStyle="#172033";ctx.fillRect(px+2,p.y+7,7,9);ctx.fillStyle="#b47b5e";ctx.fillRect(px+2,p.y,7,8);
  ctx.fillStyle="#c5a46d";ctx.fillRect(px+1,p.y+1,9,3);ctx.fillStyle="#5e382c";ctx.fillRect(px+1,p.y+7,9,2);
  ctx.fillStyle="#d8c39b";ctx.fillRect(px+2,p.y+15,3,2);ctx.fillRect(px+7,p.y+15,3,2);
  if(p.attack>0){ctx.fillStyle="#f1dfad";const ax=p.face>0?px+10:px-8;ctx.fillRect(ax,p.y+6,8,2)}ctx.restore();
  for(const part of game.particles){ctx.fillStyle="#e0ad62";ctx.fillRect(Math.floor(part.x-cam),Math.floor(part.y),2,2)}
  ctx.fillStyle="#f6e8c8";ctx.font="6px monospace";ctx.fillText("TROY",8,12);ctx.fillText("Reach the gate",248,12);
}
function loop(now){
  const dt=Math.min(.033,(now-last)/1000);last=now;update(dt);draw();animationId=requestAnimationFrame(loop);
}
