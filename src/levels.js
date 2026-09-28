// Phase 3 — authored Troy sections, hazards and enemy variety.
export const LEVELS={
  "troy-01":{
    saga:"Troy Saga",song:"The Horse and the Infant",width:980,
    spawn:{x:28,y:120},goal:{x:944,y:120,w:10,h:44},
    sections:[
      {x:0,name:"Burning Battlefield"},{x:250,name:"Ruined Streets"},
      {x:520,name:"The Eastern Wall"},{x:760,name:"Road to the Gate"}
    ],
    platforms:[
      {x:0,y:164,w:170,h:16},{x:194,y:164,w:168,h:16},{x:390,y:164,w:112,h:16},
      {x:532,y:164,w:166,h:16},{x:730,y:164,w:118,h:16},{x:878,y:164,w:102,h:16},
      {x:72,y:136,w:48,h:8},{x:142,y:112,w:46,h:8},{x:222,y:136,w:54,h:8},
      {x:300,y:108,w:50,h:8},{x:420,y:126,w:48,h:8},{x:476,y:96,w:42,h:8},
      {x:558,y:132,w:50,h:8},{x:640,y:106,w:48,h:8},{x:754,y:132,w:46,h:8},
      {x:812,y:104,w:44,h:8},{x:894,y:132,w:44,h:8}
    ],
    hazards:[
      {x:170,y:158,w:24,h:6,type:"fire"},{x:362,y:158,w:28,h:6,type:"fire"},
      {x:502,y:158,w:30,h:6,type:"fire"},{x:698,y:158,w:32,h:6,type:"fire"},
      {x:848,y:158,w:30,h:6,type:"fire"}
    ],
    debris:[
      {x:276,y:70,w:10,h:10},{x:690,y:58,w:10,h:10},{x:842,y:66,w:10,h:10}
    ],
    enemies:[
      {x:104,y:119,type:"soldier"},{x:250,y:119,type:"soldier"},{x:326,y:91,type:"archer"},
      {x:438,y:109,type:"soldier"},{x:574,y:115,type:"archer"},{x:660,y:89,type:"soldier"},
      {x:780,y:115,type:"soldier"},{x:914,y:115,type:"archer"}
    ],
    checkpoint:{x:520,y:146},
    movingPlatforms:[
      {x:650,y:78,w:38,h:8,startX:650,startY:78,range:34,speed:1.2,phase:0},
      {x:860,y:84,w:38,h:8,startX:860,startY:84,range:26,speed:1.5,phase:1.4}
    ],
    barriers:[
      {x:604,y:140,w:10,h:24,hp:2,alive:true},
      {x:826,y:140,w:10,h:24,hp:2,alive:true}
    ],
    horseSequence:{x:900,y:116,w:26,h:28},
    ambushes:[{x:285,trigger:260},{x:700,trigger:675},{x:890,trigger:865}]
  }
};
