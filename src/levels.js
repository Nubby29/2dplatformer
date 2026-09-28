// Phase 2 — reusable song-level definitions.
export const LEVELS={
  "troy-01":{
    saga:"Troy Saga",song:"The Horse and the Infant",width:760,
    spawn:{x:28,y:120},goal:{x:724,y:120,w:10,h:44},
    platforms:[
      {x:0,y:164,w:180,h:16},{x:208,y:164,w:170,h:16},{x:402,y:164,w:174,h:16},{x:600,y:164,w:160,h:16},
      {x:76,y:136,w:48,h:8},{x:152,y:118,w:48,h:8},{x:238,y:136,w:48,h:8},{x:300,y:108,w:48,h:8},
      {x:420,y:132,w:52,h:8},{x:500,y:110,w:48,h:8},{x:610,y:136,w:48,h:8},{x:674,y:106,w:40,h:8}
    ],
    enemies:[
      {x:112,y:119,type:"soldier"},{x:270,y:119,type:"soldier"},{x:438,y:115,type:"soldier"},{x:630,y:119,type:"soldier"}
    ],
    checkpoint:{x:380,y:146}
  }
};