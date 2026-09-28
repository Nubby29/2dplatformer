// Phase 2 — reusable platformer simulation.
export const CONFIG={gravity:.28,maxFall:6,moveSpeed:1.7,jumpVelocity:-5.2};

export function createPlayer(spawn){
  return {x:spawn.x,y:spawn.y,w:10,h:16,vx:0,vy:0,onGround:false,face:1,health:3,maxHealth:3,attack:0,invuln:0};
}
export function rectsOverlap(a,b){
  return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
}
export function groundY(platforms,x,w,h){
  let y=148;
  for(const p of platforms)if(x+w>p.x&&x<p.x+p.w&&p.y<y+h)y=Math.min(y,p.y-h);
  return y;
}
export function moveAndCollide(player,platforms){
  player.x+=player.vx;
  for(const p of platforms)if(rectsOverlap(player,p)){
    if(player.vx>0)player.x=p.x-player.w;
    if(player.vx<0)player.x=p.x+p.w;
  }
  player.y+=player.vy;player.onGround=false;
  for(const p of platforms)if(rectsOverlap(player,p)){
    if(player.vy>0){player.y=p.y-player.h;player.vy=0;player.onGround=true}
    else if(player.vy<0){player.y=p.y+p.h;player.vy=0}
  }
  if(player.vy>CONFIG.maxFall)player.vy=CONFIG.maxFall;
}