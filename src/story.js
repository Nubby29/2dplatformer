// Phase 3 — original story/cutscene controller for the Troy opening.
export const TROY_INTRO=[
  {speaker:"NARRATOR",text:"Troy has fallen. The army turns toward the sea, but victory is not the end of the journey."},
  {speaker:"ODYSSEUS",text:"The men need a path forward. We leave the ruins behind and face whatever waits beyond them."},
  {speaker:"NARRATOR",text:"Cross the battlefield, survive the chaos, and reach the eastern gate."}
];

export function createStory(){return {active:true,index:0,timer:0}}
export function currentStoryLine(story){return TROY_INTRO[story.index]||null}
export function advanceStory(story){
  if(!story.active)return false;
  if(story.index<TROY_INTRO.length-1){story.index++;story.timer=0;return true}
  story.active=false;return true
}
