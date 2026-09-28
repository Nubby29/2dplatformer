// Phase 1 — canonical saga/song structure for progression.
export const SAGAS=[
{id:"troy",name:"Troy Saga",songs:["The Horse and the Infant","Just a Man","Full Speed Ahead","Open Arms","Warrior of the Mind"]},
{id:"cyclops",name:"Cyclops Saga",songs:["Polyphemus","Survive","Remember Them","My Goodbye"]},
{id:"ocean",name:"Ocean Saga",songs:["Storm","Luck Runs Out","Keep Your Friends Close","Ruthlessness"]},
{id:"circe",name:"Circe Saga",songs:["Puppeteer","Wouldn’t You Like","Done For","There Are Other Ways"]},
{id:"underworld",name:"Underworld Saga",songs:["The Underworld","No Longer You","Monster"]},
{id:"thunder",name:"Thunder Saga",songs:["Suffering","Different Beast","Scylla","Mutiny","Thunder Bringer"]},
{id:"wisdom",name:"Wisdom Saga",songs:["Legendary","Little Wolf","We’ll Be Fine","Love in Paradise","God Games"]},
{id:"vengeance",name:"Vengeance Saga",songs:["Not Sorry for Loving You","Dangerous","Charybdis","Get in the Water","Six Hundred Strike"]},
{id:"ithaca",name:"Ithaca Saga",songs:["The Challenge","Hold Them Down","Odysseus","I Can’t Help But Wonder","Would You Fall in Love with Me Again"]}
];
export const TOTAL_SONGS=SAGAS.reduce((sum,saga)=>sum+saga.songs.length,0);