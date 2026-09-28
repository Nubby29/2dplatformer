// Phase 5 — pixel-art sprite sheets integrated with the Troy platformer.
import { LEVELS } from "./levels.js";
import { CONFIG,createPlayer,rectsOverlap,groundY,moveAndCollide } from "./engine.js";
import { createStory,currentStoryLine,advanceStory } from "./story.js";
import { ASSETS,loadAssets,drawSprite } from "./assets.js";

const canvas=document.querySelector("#game"),ctx=canvas.getContext("2d");
ctx.imageSmoothingEnabled=false;
const titleScreen=document.querySelector("#title-screen"),gameScreen=document.querySelector("#game-screen"),completeScreen=document.querySelector("#complete-screen");
const message=document.querySelector("#message"),healthText=document.querySelector("#health"),levelName=document.querySelector("#level-name");
const storyBox=document.querySelector("#story-box"),storySpeaker=document.querySelector("#story-speaker"),storyText=document.querySelector("#story-text");
const keys=new Set();let animationId=0,game=null,last=performance.now(),jumpWasDown=false,attackWasDown=false,storyAdvanceWasDown=false;

window.addEventListener("keydown",e=>{
  const k=e.key.toLowerCase();keys.add(k);
  if([" ","arrowleft","arrowright","arrowup","arrowdown"].includes(k))e.preventDefault();
  if(k==="r"&&game&&!game.story.active)resetLevel();
});
window.addEventListener("keyup",e=>keys.delete(e.key.toLowerCase()));
document.querySelector("#start-button").onclick=startGame;
document.querySelector("#replay-button").onclick=startGame;

async function startGame(){
 titleScreen.classList.add("hidden");completeScreen.classList.add("hidden");gameScreen.classList.remove("hidden");
 await loadAssets();
 resetLevel();cancelAnimationFrame(animationId);last=performance.now();loop(performance.now());
}
function resetLevel(){
 const level=LEVELS["troy-01"];
 game={time:0,cameraX:0,cameraShake:0,won:false,checkpointReached:false,level,
 player:createPlayer(level.spawn),checkpoint:{...level.spawn},
 enemies:level.enemies.map(e=>({...e,w:10,h:e.type==="archer"?16:17,vx:0,alive:true,shotCooldown:1.2,attackCooldown:0,deathTimer:0})),
 movingPlatforms:level.movingPlatforms.map(p=>({...p})),barriers:level.barriers.map(b=>({...b})),horseSequence:{...level.horseSequence,active:false},
 particles:[],projectiles:[],debris:level.debris.map(d=>({...d,falling:false,vy:0,active:true})),
 story:createStory(),section:"Burning Battlefield"};
 levelName.textContent="Troy Saga • The Horse and the Infant";healthText.textContent="♥♥♥";
 storyAdvanceWasDown=false;storyBox.classList.remove("hidden");renderStory();
 showMessage("TROY — survive the ruins and reach the eastern gate.");
}
function respawn(){
 const p=game.player,cp=game.checkpoint;
 p.x=cp.x;p.y=cp.y;p.vx=0;p.vy=0;p.health=p.maxHealth;p.invuln=.9;
 game.projectiles=[];healthText.textContent="♥♥♥";showMessage(game.checkpointReached?"Checkpoint reached — continue the journey.":"Try again.");
}
function showMessage(text){
 message.textContent=text;message.classList.remove("hidden");
 clearTimeout(showMessage.timer);showMessage.timer=setTimeout(()=>message.classList.add("hidden"),2200);
}
function renderStory(){
 const line=currentStoryLine(game.story);
 if(!line){storyBox.classList.add("hidden");return}
 storySpeaker.textContent=line.speaker;storyText.textContent=line.text;
}
function updateStory(dt){
 if(!game.story.active)return;
 game.story.timer+=dt;
 const advance=keys.has(" ")||keys.has("enter");
 if(advance&&!storyAdvanceWasDown&&game.story.timer>.15){advanceStory(game.story);renderStory()}
 storyAdvanceWasDown=advance;
}
function update(dt){
 if(!game||game.won)return;
 game.time+=dt;game.cameraShake=Math.max(0,game.cameraShake-dt*18);
 if(game.story.active){updateStory(dt);return}
 const p=game.player;p.invuln=Math.max(0,p.invuln-dt);p.attack=Math.max(0,p.attack-dt);
 const left=keys.has("a")||keys.has("arrowleft"),right=keys.has("d")||keys.has("arrowright");
 const jump=keys.has(" ")||keys.has("w")||keys.has("arrowup"),attack=keys.has("j")||keys.has("k");
 p.vx=left?-CONFIG.moveSpeed:right?CONFIG.moveSpeed:0;
 if(p.vx!==0)p.face=Math.sign(p.vx);
 if(jump&&!jumpWasDown&&p.onGround){p.vy=CONFIG.jumpVelocity;p.onGround=false}
 if(attack&&!attackWasDown&&p.attack<=0)p.attack=.24;
 jumpWasDown=jump;attackWasDown=attack;
 p.vy+=CONFIG.gravity;moveAndCollide(p,[...game.level.platforms,...game.movingPlatforms]);
 updateMovingPlatforms();updateHazards(dt);updateDebris();updateProjectiles(dt);updateBarriers(dt);
 for(const e of game.enemies)updateEnemy(e,dt);
 if(p.y>190){respawn();return}
 if(!game.checkpointReached&&p.x>=game.level.checkpoint.x){
   game.checkpointReached=true;game.checkpoint={x:game.level.checkpoint.x,y:game.level.checkpoint.y};
   showMessage("CHECKPOINT — the eastern wall is ahead.");
 }
 updateSection();
 if(p.x+p.w>=game.level.goal.x){game.won=true;completeScreen.classList.remove("hidden");gameScreen.classList.add("hidden");return}
 game.cameraX=Math.max(0,Math.min(game.level.width-320,p.x-90));
 for(const part of game.particles){part.x+=part.vx;part.y+=part.vy;part.vy+=.03;part.life-=dt}
 game.particles=game.particles.filter(p=>p.life>0);
}
function updateMovingPlatforms(){
 for(const p of game.movingPlatforms){p.phase+=p.speed*.025;p.x=p.startX+Math.sin(p.phase)*p.range;p.y=p.startY+Math.sin(p.phase*1.7)*8}
}
function updateBarriers(dt){
 const p=game.player;
 for(const b of game.barriers){if(!b.alive)continue;
   if(rectsOverlap(p,b)&&p.attack>0){b.hp--;p.vx=(p.x<b.x?-1:1)*.6;burst(b.x+5,b.y+8);if(b.hp<=0){b.alive=false;showMessage("BARRIER BROKEN")}}
   else if(rectsOverlap(p,b)){p.x=p.x<b.x?b.x-p.w:b.x+b.w}
 }
}
function updateSection(){
 let next=game.level.sections[0].name;
 for(const s of game.level.sections)if(game.player.x>=s.x)next=s.name;
 if(next!==game.section){game.section=next;showMessage(next.toUpperCase())}
}
function damagePlayer(knockX=-1){
 const p=game.player;if(p.invuln>0)return;
 p.health--;p.invuln=.8;p.vx=knockX*2.4;p.vy=-3;
 healthText.textContent="♥".repeat(Math.max(0,p.health))+"♡".repeat(p.maxHealth-p.health);
 if(p.health<=0)respawn();
}
function updateHazards(dt){
 const p=game.player;
 for(const h of game.level.hazards){
   const box={x:h.x,y:h.y-5,w:h.w,h:11};
   if(rectsOverlap(p,box)){damagePlayer(p.x<h.x?-1:1);burst(p.x+5,p.y+8)}
   if(Math.random()<dt*5)game.particles.push({x:h.x+Math.random()*h.w,y:h.y,vx:(Math.random()-.5)*.3,vy:-Math.random()*.8,life:.35})
 }
}
function updateDebris(){
 for(const d of game.debris){
   if(!d.active)continue;
   if(!d.falling&&game.player.x>d.x-35)d.falling=true;
   if(d.falling){
     d.vy+=.22;d.y+=d.vy;
     if(d.y>145){d.active=false;burst(d.x+5,150)}
     else if(rectsOverlap(game.player,d)){damagePlayer(game.player.x<d.x?-1:1);d.active=false;burst(d.x+5,d.y+5)}
   }
 }
}
function updateProjectiles(dt){
 for(const b of game.projectiles){
   b.x+=b.vx;b.life-=dt;
   if(rectsOverlap(game.player,{x:b.x,y:b.y,w:4,h:2})){damagePlayer(b.vx>0?-1:1);b.life=0}
 }
 game.projectiles=game.projectiles.filter(b=>b.life>0&&b.x>-20&&b.x<game.level.width+20);
}
function updateEnemy(e,dt){
 if(!e.alive)return;
 const p=game.player,dx=p.x-e.x;
 if(e.type==="archer"){
   if(Math.abs(dx)<150&&e.shotCooldown<=0){
     game.projectiles.push({x:e.x+(dx>0?10:-4),y:e.y+6,vx:dx>0?2.2:-2.2,life:2});e.shotCooldown=1.7
   }
   e.shotCooldown-=dt;
 }else{
   e.vx=Math.abs(dx)<60?Math.sign(dx)*.38:0;e.x+=e.vx;
   e.y=groundY(game.level.platforms,e.x,e.w,e.h);
 }
 if(p.attack>0&&Math.abs((p.x+p.w/2)-(e.x+e.w/2))<22&&Math.abs(p.y-e.y)<20){
   e.alive=false;burst(e.x+5,e.y+8);return
 }
 if(rectsOverlap(p,e))damagePlayer(e.x<p.x?1:-1);
}
function burst(x,y){game.cameraShake=Math.max(game.cameraShake,2.5);for(let i=0;i<10;i++)game.particles.push({x,y,vx:(Math.random()-.5)*2.4,vy:(Math.random()-1.2)*2,life:.5,size:2,kind:"hit"})}
function draw(){
 const cam=game.cameraX;ctx.clearRect(0,0,320,180);
 ctx.fillStyle="#18243a";ctx.fillRect(0,0,320,180);
 if(game&&game.cameraShake>0){ctx.save();ctx.translate((Math.random()-.5)*game.cameraShake,(Math.random()-.5)*game.cameraShake)}
 drawSky();drawRuins(cam);
 ctx.fillStyle="#31425a";ctx.fillRect(0,148,320,32);
 for(const pl of game.level.platforms)drawPlatform(pl,cam);
 drawHazards(cam);drawCheckpoint(cam);drawGoal(cam);drawMovingPlatforms(cam);drawBarriers(cam);drawHorseSequence(cam);
 for(const d of game.debris)if(d.active)drawDebris(d,cam);
 for(const e of game.enemies)drawEnemy(e,cam);
 for(const b of game.projectiles){ctx.fillStyle="#e0ad62";ctx.fillRect(Math.floor(b.x-cam),Math.floor(b.y),4,2)}
 drawPlayer(cam);
 for(const part of game.particles){ctx.fillStyle=part.kind==="hit"?"#f1dfad":"#e0ad62";ctx.fillRect(Math.floor(part.x-cam),Math.floor(part.y),part.size||2,part.size||2)}
 if(game.cameraShake>0){ctx.restore()}
 ctx.fillStyle="#f6e8c8";ctx.font="6px monospace";ctx.fillText("TROY",8,12);ctx.fillText(game.section.toUpperCase(),90,12);
}
function drawPlatform(pl,cam){
 const x=Math.floor(pl.x-cam);
 if(ASSETS.troyTiles&&pl.h>=16){
   for(let tx=0;tx<pl.w;tx+=16){
     const w=Math.min(16,pl.w-tx);
     ctx.drawImage(ASSETS.troyTiles,0,0,w,16,x+tx,pl.y,w,16);
   }
 }else{
   ctx.fillStyle="#60452f";ctx.fillRect(x,pl.y,pl.w,pl.h);
   ctx.fillStyle="#8b6a42";ctx.fillRect(x,pl.y,pl.w,3);
 }
}
function drawSky(){ctx.fillStyle="#29324a";ctx.fillRect(0,0,320,148);ctx.fillStyle="#4a4050";ctx.fillRect(0,52,320,18);ctx.fillStyle="#6a4540";ctx.fillRect(0,70,320,8)}
function drawRuins(cam){
 for(let x=-((cam*.18)%72);x<320;x+=72){ctx.fillStyle="#3b3440";ctx.fillRect(x,102,42,46);ctx.fillRect(x+8,90,27,12);ctx.fillStyle="#60443b";ctx.fillRect(x+13,114,9,34);ctx.fillStyle="#72524a";ctx.fillRect(x+2,98,5,18)}
}
function drawHazards(cam){
 for(const h of game.level.hazards){const x=Math.floor(h.x-cam);ctx.fillStyle="#5b2630";ctx.fillRect(x,h.y,h.w,h.h);ctx.fillStyle="#e07a3f";ctx.fillRect(x+2,h.y-3,h.w-4,4);ctx.fillStyle="#f0c05a";ctx.fillRect(x+5,h.y-6,3,4)}
}
function drawCheckpoint(cam){const cp=game.level.checkpoint.x-cam;ctx.fillStyle=game.checkpointReached?"#e0ad62":"#76644b";ctx.fillRect(cp,132,2,32);ctx.fillStyle="#c94d4d";ctx.fillRect(cp+2,132,12,7)}
function drawGoal(cam){const gx=game.level.goal.x-cam;ctx.fillStyle="#d8c39b";ctx.fillRect(gx,game.level.goal.y,2,44);ctx.fillStyle="#c94d4d";ctx.fillRect(gx+2,game.level.goal.y,15,8)}
function drawDebris(d,cam){const x=Math.floor(d.x-cam);ctx.fillStyle="#665047";ctx.fillRect(x,d.y,d.w,d.h);ctx.fillStyle="#9b715b";ctx.fillRect(x+2,d.y+2,5,4)}
function drawEnemy(e,cam){
 const x=Math.floor(e.x-cam),frame=Math.floor(game.time*8)%2;
 const sprite=ASSETS[e.type==="archer"?"archer":"soldier"];
 ctx.save();if(!e.alive)ctx.globalAlpha=Math.max(0,e.deathTimer/.35);
 if(!drawSprite(ctx,sprite,frame,x,e.y,16,17,e.vx<0)) {
   ctx.fillStyle="#161a25";ctx.fillRect(x+2,e.y+5,7,12);
   ctx.fillStyle=e.type==="archer"?"#526b54":"#a96c54";ctx.fillRect(x+2,e.y-frame,7,7);
   ctx.fillStyle="#d6c29c";ctx.fillRect(x+3,e.y+1-frame,5,2);
 }
 if(!e.alive){ctx.restore();return}\n if(e.type==="archer"){ctx.strokeStyle="#e0ad62";ctx.beginPath();ctx.moveTo(x+8,e.y+6);ctx.lineTo(x+5,e.y+9);ctx.stroke()}
}
function drawPlayer(cam){
 const p=game.player,px=Math.floor(p.x-cam);
 const walking=p.onGround&&Math.abs(p.vx)>.1;
 const frame=p.attack>0?2:(walking?Math.floor(game.time*10)%2:0);
 ctx.save();if(p.invuln>0&&Math.floor(game.time*18)%2===0)ctx.globalAlpha=.35;
 if(!drawSprite(ctx,ASSETS.player,frame,px,p.y,16,16,p.face<0)){
   ctx.fillStyle="#172033";ctx.fillRect(px+2,p.y+7,7,9);
   ctx.fillStyle="#b47b5e";ctx.fillRect(px+2,p.y,7,8);
   ctx.fillStyle="#c5a46d";ctx.fillRect(px+1,p.y+1,9,3);
 }
 ctx.restore();
}
function loop(now){const dt=Math.min(.033,(now-last)/1000);last=now;update(dt);draw();animationId=requestAnimationFrame(loop)}
