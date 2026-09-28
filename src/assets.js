// Phase 5 — reusable pixel-art asset loader and sprite-sheet helpers.
const SOURCES={
  player:"assets/player.svg",
  soldier:"assets/soldier.svg",
  archer:"assets/archer.svg",
  troyTiles:"assets/troy-tiles.svg"
};

export const ASSETS={};

export function loadAssets(){
  return Promise.all(Object.entries(SOURCES).map(([name,src])=>new Promise(resolve=>{
    const img=new Image();
    img.onload=()=>{ASSETS[name]=img;resolve(img)};
    img.onerror=()=>resolve(null);
    img.src=src;
  })));
}

export function drawSprite(ctx,img,frame,x,y,frameW,frameH,flip=false){
  if(!img)return false;
  ctx.save();
  if(flip){ctx.translate(x+frameW,y);ctx.scale(-1,1);x=0}
  ctx.drawImage(img,frame*frameW,0,frameW,frameH,Math.floor(x),Math.floor(y),frameW,frameH);
  ctx.restore();
  return true;
}
