(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{111:function(e,n,t){e.exports=t(156)},116:function(e,n,t){},122:function(e,n){},124:function(e,n){},138:function(e,n,t){},139:function(e,n,t){},140:function(e,n,t){},141:function(e,n,t){},142:function(e,n,t){},143:function(e,n,t){},146:function(e,n,t){},147:function(e,n,t){},156:function(e,n,t){"use strict";t.r(n);var a=t(0),r=t.n(a),l=t(13),o=t.n(l),i=t(35),u=t(25),c=t(16),s=t(102),d=t(45),m=t(10),p=t(3),f=t(42),v=(t(116),t(39)),b=t(29),g=t(74),y=t.n(g),h=t(91),E=t(6),O=t(27),I=t(31),w=t(32);function N(){var e=Object(I.a)(["\n  mutation removePlayer($gameId: ID!, $playerId: ID!) {\n    removePlayer(gameId: $gameId, playerId: $playerId)\n  }\n"]);return N=function(){return e},e}function j(){var e=Object(I.a)(["\n  mutation addGuess($input: GuessInput!) {\n    addGuess(input: $input)\n  }\n"]);return j=function(){return e},e}function R(){var e=Object(I.a)(["\n  mutation placeBet($input: BetInput!) {\n    placeBet(input: $input)\n  }\n"]);return R=function(){return e},e}function k(){var e=Object(I.a)(["\n  mutation startGame($gameId: ID!) {\n    startGame(gameId: $gameId)\n  }\n"]);return k=function(){return e},e}function S(){var e=Object(I.a)(["\n  mutation addPlayer($input: PlayerInput!) {\n    addPlayer(input: $input) {\n      id\n      money\n      name\n    }\n  }\n"]);return S=function(){return e},e}function C(){var e=Object(I.a)(["\n  subscription GameUpdated($gameId: ID!, $hash: String!) {\n    gameUpdated(gameId: $gameId, hash: $hash) {\n      id\n      questionRounds {\n        question {\n          id\n          hints\n          answer {\n            numerical\n            geo {\n              latitude\n              longitude\n            }\n          }\n          question\n          explanation\n          type\n        }\n        foldedPlayerIds\n        bettingRounds {\n          currentPlayer {\n            id\n          }\n          bets {\n            amount\n            playerId\n          }\n        }\n        guesses {\n          guess {\n            numerical\n            geo {\n              latitude\n              longitude\n            }\n          }\n          playerId\n        }\n        results {\n          playerId\n          changeInMoney\n        }\n        isOver\n        isShowdown\n      }\n      players {\n        id\n        money\n        name\n        isDead\n      }\n      dealerId\n      questions {\n        id\n      }\n      isOver\n    }\n  }\n"]);return C=function(){return e},e}function q(){var e=Object(I.a)(["\n  query findGame($gameId: ID!) {\n    game(gameId: $gameId) {\n      id\n      questionRounds {\n        question {\n          id\n          hints\n          answer {\n            numerical\n            geo {\n              latitude\n              longitude\n            }\n          }\n          question\n          explanation\n          type\n        }\n        foldedPlayerIds\n        bettingRounds {\n          currentPlayer {\n            id\n          }\n          bets {\n            amount\n            playerId\n          }\n        }\n        guesses {\n          guess {\n            numerical\n            geo {\n              latitude\n              longitude\n            }\n          }\n          playerId\n        }\n        results {\n          playerId\n          changeInMoney\n        }\n        isOver\n        isShowdown\n      }\n      players {\n        id\n        money\n        name\n        isDead\n      }\n      dealerId\n      questions {\n        id\n      }\n      isOver\n    }\n  }\n"]);return q=function(){return e},e}function x(){var e=Object(I.a)(["\n  query sets($setName: String) {\n    sets(setName: $setName) {\n      setName\n      numberOfQuestions\n    }\n  }\n"]);return x=function(){return e},e}function P(){var e=Object(I.a)(["\n  mutation uploadQuestions(\n    $questions: [QuestionInput!]!\n    $setName: String!\n    $isPrivate: Boolean!\n  ) {\n    uploadQuestions(\n      questions: $questions\n      setName: $setName\n      isPrivate: $isPrivate\n    )\n  }\n"]);return P=function(){return e},e}function D(){var e=Object(I.a)(["\n  mutation createGame($setNames: [String!]!) {\n    createGame(setNames: $setNames) {\n      id\n    }\n  }\n"]);return D=function(){return e},e}var Q,B=Object(w.a)(D()),$=Object(w.a)(P()),F=Object(w.a)(x()),M=Object(w.a)(q()),A=Object(w.a)(C()),G=Object(w.a)(S()),U=Object(w.a)(k()),T=Object(w.a)(R()),H=Object(w.a)(j()),L=Object(w.a)(N()),_=function(e){console.error(e.message)},z=t(162),Y=t(159),K=t(95);!function(e){e.GEO="GEO",e.NUMERICAL="NUMERICAL",e.MULTIPLE_CHOICE="MULTIPLE_CHOICE",e.DATE="DATE"}(Q||(Q={}));var W=function(e,n){return e.bets.reduce((function(e,t){return e+(t.playerId===n?t.amount:0)}),0)},J=function(e){var n;return null===e||void 0===e?void 0:e.questionRounds[(null===e||void 0===e||null===(n=e.questionRounds)||void 0===n?void 0:n.length)-1]},V=function(e){var n;return null===e||void 0===e?void 0:e.bettingRounds[(null===e||void 0===e||null===(n=e.bettingRounds)||void 0===n?void 0:n.length)-1]},Z=function(e,n){var t=n.filter((function(e){return!e.isDead}));return e.guesses.length>=t.length},X=function(e,n){if(!e.bets.length)return 0;var t=W(e,n),a=e.bets.reduce((function(e,n){return e[n.playerId]=(e[n.playerId]||0)+n.amount,e}),{});return Math.max.apply(Math,Object(b.a)(Object.values(a)))-t},ee=function(e,n){return null===e||void 0===e?void 0:e.foldedPlayerIds.includes(n)},ne=function(e){return e.isOver||e.question.hints.length+1<e.bettingRounds.length},te=function(e,n){var t,a;if(e)switch(n){case Q.NUMERICAL:return e.numerical;case Q.GEO:return"[".concat(null===(t=e.geo)||void 0===t?void 0:t.latitude,", ").concat(null===(a=e.geo)||void 0===a?void 0:a.longitude,"]");default:throw new Error("Invalid question type")}},ae=function(e,n,t,a){var r,l,o=J(t),i=V(o);if(o&&(null===i||void 0===i?void 0:i.currentPlayer.id)===a){if(X(i,a)>e)throw new Error("Amount to call is greater than raised amount.");var u=null!==(r=null===(l=t.players.find((function(e){return e.id===a})))||void 0===l?void 0:l.money)&&void 0!==r?r:0;n({variables:{input:{gameId:t.id,playerId:a,amount:Math.min(e,u)}}})}},re=function(e,n,t,a){e({variables:{input:{gameId:n.id,playerId:a,guess:t}}})},le={card:{maxHeight:"95vh"}};var oe=function(e){var n=e.open,t=e.handleClose,l=e.fetchSets,o=e.setSelectedSets,i=Object(v.f)(),u=Object(a.useState)(!0),c=Object(E.a)(u,2),s=c[0],d=c[1],m=Object(a.useState)(),p=Object(E.a)(m,2),f=p[0],b=p[1],g=Object(a.useState)(""),y=Object(E.a)(g,2),h=y[0],I=y[1],w=Object(a.useState)(0),N=Object(E.a)(w,2),j=N[0],R=N[1],k=Object(O.b)($,{variables:{setName:h,questions:f,isPrivate:!!j},onCompleted:function(){j?i.push("/questions/".concat(h)):l(),o([h]),t(),I(""),b(void 0),d(!0)},onError:_}),S=Object(E.a)(k,2),C=S[0],q=S[1].error,x=s?r.a.createElement(r.a.Fragment,null,r.a.createElement("p",null,"An example of the file format can be found"," ",r.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://docs.google.com/spreadsheets/d/1_cUrvCc3R2qTL_ME-A9wc9HmyH-zoAQkRnBs80dOPb8/edit?usp=sharing"},"here"),"."),r.a.createElement(K.a,{onDrop:function(e){d(!1),b(e.map((function(e){var n=e.data,t=n.question,a=n.type,r=n.answer,l=n.latitude,o=n.longitude,i=n.hint1,u=n.hint2,c=n.explanation,s=[i,u].filter(Boolean),d={};return r||0===r?d.numerical=r:!l&&0!==l||!o&&0!==o||(d.geo={latitude:l,longitude:o}),{question:t,type:a,answer:d,hints:s,explanation:c}})))},onError:function(e,n,t,a){console.error(e)},config:{header:!0},addRemoveButton:!0,removeButtonColor:"#659cef"},r.a.createElement("span",null,"Drop CSV file here or click to upload."))):r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"input-group mb-3"},r.a.createElement("input",{value:h,onChange:function(e){I(e.target.value)},type:"text",className:"form-control form-control-lg",placeholder:"Name for the question set","aria-label":"Name for the question set",required:!0,autoFocus:!0})),r.a.createElement("h3",null,"Review your upload:"),r.a.createElement("hr",null),(f||[]).map((function(e){var n;return r.a.createElement("div",{key:e.question,className:"small"},r.a.createElement("p",null,"Question: ",r.a.createElement("b",null,e.question)),r.a.createElement("p",null,"Answer: ",r.a.createElement("b",null,te(e.answer,e.type))),(null===(n=e.hints)||void 0===n?void 0:n.length)&&r.a.createElement("p",null,"Hints:"," ",e.hints.map((function(e){return r.a.createElement(r.a.Fragment,null,r.a.createElement("br",null),r.a.createElement("span",{key:e},r.a.createElement("b",null,e)))}))),e.explanation&&r.a.createElement("p",null,"Explanation: ",r.a.createElement("b",null,e.explanation)),r.a.createElement("hr",null))})),r.a.createElement("div",{className:"form-check"},r.a.createElement("input",{type:"checkbox",className:"form-check-input mt-2",id:"isPrivateCheckbox",value:j,onChange:function(){R(j?0:1)}}),r.a.createElement("label",{className:"form-check-label",htmlFor:"isPrivateCheckbox"},"Questions are private",r.a.createElement("br",null),r.a.createElement("span",null,"If checked, this set of questions will not appear in the list on the start screen."))),r.a.createElement("button",{className:"btn btn-primary",disabled:!h,onClick:function(){C()}},"Submit"),r.a.createElement("button",{className:"btn btn-outline-dark ml-3",onClick:function(){d(!0)}},"Upload new file"));return r.a.createElement(z.a,{disablePortal:!0,disableEnforceFocus:!0,disableAutoFocus:!0,open:n,className:"d-flex justify-content-center align-items-center p-5",onClose:t,closeAfterTransition:!0,BackdropComponent:Y.a,BackdropProps:{timeout:500}},r.a.createElement("div",{className:"card",style:le.card},r.a.createElement("div",{className:"card-body text-dark overflow-auto"},r.a.createElement("h3",null,"Upload a CSV file with custom questions"),x,q&&r.a.createElement("div",{className:"alert alert-danger"},q.message))))};t(138);var ie,ue=function(){var e=Object(v.h)().setName,n=Object(v.f)(),t=Object(v.g)(),l=Object(a.useState)(e?[e]:[]),o=Object(E.a)(l,2),u=o[0],c=o[1],s=Object(a.useState)(!1),d=Object(E.a)(s,2),m=d[0],p=d[1],f=Object(O.b)(B,{variables:{setNames:u},onCompleted:function(e){var t=e.createGame;n.push("/".concat(t.id))},onError:_}),g=Object(E.a)(f,2),I=g[0],w=g[1].loading,N=Object(O.a)(F,{fetchPolicy:"no-cache",onError:_,variables:{setName:e}}),j=Object(E.a)(N,2),R=j[0],k=j[1].data;Object(a.useEffect)((function(){R()}),[R,e]);var S=function(){var e=Object(h.a)(y.a.mark((function e(){return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:u.length&&I();case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return r.a.createElement(r.a.Fragment,null,e?r.a.createElement("p",null,"You can only start a game with these questions from this link"," ",r.a.createElement(i.b,{to:t.pathname,style:{color:"#dfae06"}},"".concat(window.location.host).concat(t.pathname)),".",r.a.createElement("br",null),"Make sure to ",r.a.createElement("b",null,"save this link")," if you want to start a game with the uploaded questions later.",r.a.createElement("br",null),"The questions will be available for 90 days."):r.a.createElement("p",{className:"mt-3"},"Start by selecting one or more sets of trivia questions or upload your own"," ",r.a.createElement("button",{className:"btn btn-link p-0",onClick:function(){p(!0)}},"here \u2934"),"."),r.a.createElement("div",{className:"set-container my-4"},null===k||void 0===k?void 0:k.sets.map((function(n){return r.a.createElement("span",{key:n.setName,className:"set badge border-light ".concat((null===u||void 0===u?void 0:u.includes(n.setName))?"badge-light":""," ").concat(e?"mr-auto":""),style:{gridColumn:"span ".concat(Math.round(Math.pow(n.setName.length,.35)))},onClick:function(t){e||(t.metaKey?(null===u||void 0===u?void 0:u.includes(n.setName))?c(u.filter((function(e){return n.setName!==e}))):c([n.setName].concat(Object(b.a)(u))):c([n.setName]))}},n.setName," (",n.numberOfQuestions,")")}))),r.a.createElement("button",{className:"btn btn-lg btn-primary mt-auto mb-3 mx-5",onClick:S,disabled:!u.length},w?"Loading...":"Create Game"),r.a.createElement(oe,{open:m,handleClose:function(){p(!1)},fetchSets:R,setSelectedSets:c}))},ce=function(e){var n=Math.random().toString(36).substring(2);return localStorage.setItem("".concat("fingerprint","_").concat(e),n),n},se=function(e){return localStorage.getItem("".concat("fingerprint","_").concat(e))},de=t(64),me=t(36);t(139);!function(e){e.lg="lg",e.md="md"}(ie||(ie={}));var pe=function(e){var n=e.id,t=e.name,a=e.currentBettingRound,l=e.isDead,o=e.isFolded,i=e.gameIsOver,u=e.size,c=e.isDealer,s=!e.showPreviousQuestionRoundResults&&!i&&(null===a||void 0===a?void 0:a.currentPlayer.id)===n;return r.a.createElement("div",{className:"avatar ".concat(u," ").concat(l||o?"dead":"")},r.a.createElement("span",{className:s&&u===ie.lg?"tada":""},t),s&&r.a.createElement("span",{className:"turn"},">"),c&&r.a.createElement("span",{className:"dealer"},"D"))},fe=(t(140),function(e){var n,t,a=e.players,l=e.playerId,o=e.currentBettingRound,i=e.usedQuestionRound,u=e.game,c=e.isSpectator;if(!a.length)return null;u.isOver&&a.sort((function(e,n){return n.money-e.money})).forEach((function(e,n){e.rank=n+1})),l&&(a=function(e,n){var t=Object(b.a)(e),a=t.splice(t.findIndex((function(e){return e.id===n})),t.length);return[].concat(Object(b.a)(a),Object(b.a)(t))}(a,l)),i&&(n=null===i||void 0===i?void 0:i.guesses.reduce((function(e,n){return Object(me.a)({},e,Object(de.a)({},n.playerId,n.guess))}),{})),u.isOver&&(t=a.reduce((function(e,n,t){return 0===t?e:e[0].money<n.money?[n]:e[0].money===n.money?[].concat(Object(b.a)(e),[n]):e}),[a[0]]).map((function(e){return e.id})));var s=null===i||void 0===i?void 0:i.question.type;return r.a.createElement(r.a.Fragment,null,a.map((function(e,a){var d,m,p,f=e.id,v=e.money,b=e.name,g=e.rank,y=e.isDead,h=i&&ee(i,f),E=null===i||void 0===i||null===(d=i.results)||void 0===d||null===(m=d.find((function(e){var n=e.playerId;return f===n})))||void 0===m?void 0:m.changeInMoney,O=o?W(o,f):0,I=c||!!(null===i||void 0===i?void 0:i.isOver)&&(null===i||void 0===i?void 0:i.isShowdown)&&!h,w=n&&te(n[f],s);return r.a.createElement("div",{key:f,className:"d-flex align-items-center pb-4 ml-4"},u.isOver&&r.a.createElement("span",{className:"rank"},g,"."),r.a.createElement(pe,{id:f,name:b,currentBettingRound:o,isDead:y,isFolded:h,gameIsOver:u.isOver,isDealer:(null===u||void 0===u?void 0:u.dealerId)===f,size:0===a&&l?ie.lg:ie.md,showPreviousQuestionRoundResults:!!(null===i||void 0===i?void 0:i.isOver)}),r.a.createElement("div",{className:"money ".concat(f===l?"":"md"," ").concat(!y&&!h||(null===i||void 0===i?void 0:i.isOver)?"":"dead")},s===Q.NUMERICAL&&(I?r.a.createElement("span",{role:"img","aria-label":"answer"},"\ud83d\udca1 ",w):n&&r.a.createElement("span",{role:"img","aria-label":"answer"},"\ud83d\udca1"," ",r.a.createElement("span",{className:f===l?"":"obfuscate"},w||0===w?f===l?w:432:null))),r.a.createElement("div",{className:"d-flex"},r.a.createElement("span",{role:"img","aria-label":"money"},"\ud83d\udcb0",v+((null===i||void 0===i?void 0:i.isOver)&&!u.isOver?O:0)),!(null===i||void 0===i?void 0:i.isOver)&&!!O&&r.a.createElement("span",{className:"ml-4"},-1*O),(null===i||void 0===i?void 0:i.isOver)&&E&&r.a.createElement("span",{className:"ml-2 ".concat(E>0?"text-success":"text-danger")},E))),(null===(p=t)||void 0===p?void 0:p.includes(f))&&r.a.createElement("span",{className:"trophy",role:"img","aria-label":"trophy"},"\ud83c\udfc6"),y&&!u.isOver&&r.a.createElement("span",{className:"skull",role:"img","aria-label":"skull"},"\ud83d\udc80"))})))}),ve={title:{fontSize:"0.7em",borderTop:"1px solid #ebebeb",marginTop:"0.3em",paddingTop:"1em"},currentHint:{fontSize:"1.4em"},oldHint:{fontSize:"0.7em"}},be=function(e){var n=e.usedQuestionRound,t=n.question.hints,a=n.isOver?t.length:Math.min(n.bettingRounds.length-1,t.length);return a<1?null:(null===t||void 0===t?void 0:t.length)?r.a.createElement("div",{className:"d-flex flex-column"},r.a.createElement("span",{style:ve.title},"Hint",a>1&&"s"," (",a,"/",t.length,"):"),r.a.createElement("ol",null,n.question.hints.slice(0,a).map((function(e,t){return r.a.createElement("li",{key:e,style:a!==t+1||ne(n)?ve.oldHint:ve.currentHint},e)})))):null},ge={question:{fontSize:"1.6em"},answer:{fontSize:"1.6em"}},ye=function(e){var n=e.game,t=e.usedQuestionRound,a=t.bettingRounds.length<=1&&!t.isOver,l=n.questionRounds.length+n.questions.length;return r.a.createElement("div",{className:"mb-4"},r.a.createElement("p",{className:"mb-0",style:!a&&{fontSize:"0.7em"}||{}},"Question (",n.questionRounds.length,"/",l,"):"),r.a.createElement("p",{style:a&&ge.question||{}},t.question.question),r.a.createElement(be,{usedQuestionRound:t}),t.question.type!==Q.GEO&&ne(t)&&r.a.createElement(r.a.Fragment,null,r.a.createElement("p",{style:ge.answer},"Answer:"," ",r.a.createElement("b",null,te(t.question.answer,t.question.type))),t.question.explanation&&r.a.createElement("p",null,t.question.explanation)))},he=t(38),Ee=t(193),Oe=(t(141),function(e){var n=e.children,t=e.title,a=e.onClose,l=Object(he.a)(e,["children","title","onClose"]);return r.a.createElement(Ee.a,Object(me.a)({className:"drawer"},l),r.a.createElement("div",{className:"d-flex align-items-center flex-column"},r.a.createElement("div",{className:"d-flex justify-content-center",id:"drawer-title"},r.a.createElement("span",{className:a?"ml-auto":""},t),a&&r.a.createElement("span",{id:"drawer-close",className:"ml-auto mr-3",onClick:a},"\u2573")),r.a.createElement("div",{className:"container px-5 pt-4 pb-5 d-flex flex-column"},n)))}),Ie=function(e){var n=e.handleSubmit,t=Object(a.useState)(""),l=Object(E.a)(t,2),o=l[0],i=l[1];return r.a.createElement("div",{className:"input-group mb-3"},r.a.createElement("input",{value:o,onChange:function(e){var n=parseFloat(e.target.value);i(0===n?0:n||e.target.value)},onKeyUp:function(e){13===e.which&&(n(o),i(""))},type:"number",className:"form-control form-control-lg",placeholder:"Your answer","aria-label":"Your answer","aria-describedby":"basic-addon2",autoFocus:!0}),r.a.createElement("div",{className:"input-group-append"},r.a.createElement("button",{type:"submit",className:"btn btn-primary",disabled:"string"===typeof o||!o&&0!==o,onClick:function(){n(o),i("")}},"\u2b91")))},we=t(187),Ne=t(188),je=t(189),Re=t(194),ke=t(190);t(142);function Se(e){var n=e.handleUpdate,t=Object(a.useState)(null),l=Object(E.a)(t,2),o=l[0],i=l[1];return Object(we.a)({click:function(e){i(e.latlng),n({latitude:e.latlng.lat,longitude:e.latlng.lng})}}),null===o?null:r.a.createElement(Ne.a,{position:o})}var Ce=function(e){var n=e.markers,t=e.handleOnClick;return r.a.createElement(je.a,{center:[0,0],zoom:1,scrollWheelZoom:!0,className:"mb-5"},r.a.createElement(Re.a,{attribution:'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> \u2014 Map data \xa9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',url:"https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.svg"}),t&&r.a.createElement(Se,{handleUpdate:t}),(null===n||void 0===n?void 0:n.length)&&n.map((function(e){var n=e.position,t=e.label;return r.a.createElement(Ne.a,{position:[n.latitude,n.longitude]},t&&r.a.createElement(ke.a,{direction:"bottom",offset:[-15,20],permanent:!0},t))})))},qe=function(e){var n=e.handleSubmit,t=Object(a.useState)(),l=Object(E.a)(t,2),o=l[0],i=l[1];return r.a.createElement(r.a.Fragment,null,r.a.createElement(Ce,{handleOnClick:function(e){i(e)}}),r.a.createElement("button",{className:"btn btn-primary ml-auto",onClick:function(){o&&n(o)},disabled:!(null===o||void 0===o?void 0:o.latitude)||!o.longitude},"Submit"))},xe=function(e){var n=e.currentQuestionRound,t=e.playerId,a=e.addGuessMutation,l=e.game,o=e.showNewQuestionRound,i=e.setShowNewQuestionRound,u=l.players.find((function(e){return e.id===t}));if(null===u||void 0===u?void 0:u.isDead)return null;var c=!n.guesses.find((function(e){return e.playerId===t})),s=function(e){!e&&0!==e||"number"!==typeof e||(re(a,l,{numerical:e},t),i(!1))},d=function(e){re(a,l,{geo:e},t),i(!1)};return r.a.createElement(Oe,{title:"New Question",onClose:function(){i(!1)},anchor:"bottom",open:c&&o&&!(null===n||void 0===n?void 0:n.guesses.find((function(e){return e.playerId===t}))),variant:"persistent"},r.a.createElement(r.a.Fragment,null,r.a.createElement("p",null,n.question.question),function(){switch(n.question.type){case Q.NUMERICAL:return r.a.createElement(Ie,{handleSubmit:s});case Q.GEO:return r.a.createElement(qe,{handleSubmit:d});default:throw new Error("Unknow Question Type")}}()))},Pe=/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g,De=function(e){var n=e.createPlayer,t=e.gameId,l=e.playerId,o=Object(a.useState)(""),i=Object(E.a)(o,2),u=i[0],c=i[1],s=function(){n({variables:{input:{gameId:t,playerName:u}}})};return r.a.createElement(Oe,{title:"Your avatar",anchor:"bottom",open:!l,variant:"persistent",className:"drawer"},r.a.createElement(r.a.Fragment,null,r.a.createElement("p",null,"Use an emoji or your initials as your avatar"),r.a.createElement("div",{className:"input-group mb-3"},r.a.createElement("input",{value:u,onChange:function(e){var n=e.target.value,t=n.match(Pe);c(t?n:n.substring(0,2))},onKeyUp:function(e){13===e.which&&s()},type:"text",className:"form-control form-control-lg",placeholder:"Type an emoji or letter","aria-label":"Your answer","aria-describedby":"basic-addon2",autoFocus:!0}),r.a.createElement("div",{className:"input-group-append"},r.a.createElement("button",{type:"submit",disabled:!u.length,className:"btn btn-primary",onClick:s},"\u2b91")))))},Qe=function(e){var n=e.text,t=e.handleOnClick,a=e.isDisabled;return r.a.createElement("button",{className:"btn btn-primary mx-1",onClick:t,disabled:a},n)},Be=function(e){var n,t=e.currentBettingRound,l=e.game,o=e.handleRaise,i=e.placeBet,u=e.playerId,c=e.showRaiseDrawer,s=e.setShowRaiseDrawer,d=X(t,u),m=null===(n=l.players.find((function(e){return e.id===u})))||void 0===n?void 0:n.money,p=Object(a.useState)(d),f=Object(E.a)(p,2),v=f[0],b=f[1],g=function(){o(v,i,l,u),s(!1)};return r.a.createElement(Oe,{title:"Raise",anchor:"bottom",open:c,onClose:function(){s(!1)},variant:"temporary",className:"drawer"},r.a.createElement(r.a.Fragment,null,r.a.createElement("p",null,"Raise by how much?"),r.a.createElement("div",{className:"input-group mb-3"},r.a.createElement("input",{value:v,onChange:function(e){b(Math.round(parseFloat(e.target.value)))},onKeyUp:function(e){13===e.which&&g()},type:"number",pattern:"[0-9]",min:d,max:m,className:"form-control form-control-lg",placeholder:"Amount to raise","aria-label":"Amount to raise","aria-describedby":"basic-addon2",autoFocus:!0}),r.a.createElement("div",{className:"input-group-append"},r.a.createElement("button",{disabled:!!m&&(v<d||v>m),className:"btn btn-primary",onClick:g},"\u2b91"))),m&&r.a.createElement("span",{style:{cursor:"pointer"},onClick:function(){return b(m)},className:"badge badge-pill badge-primary mr-auto px-4"},"All in")))},$e=function(e){var n=e.game,t=e.currentQuestionRound,l=e.currentBettingRound,o=e.playerId,i=e.placeBet;if(!t||!l)return null;var u=Object(a.useState)(!1),c=Object(E.a)(u,2),s=c[0],d=c[1],m=n.players.find((function(e){return e.id===o}));return r.a.createElement("div",{className:"d-flex flex-row w-100 justify-content-between"},[{text:"Check",handleOnClick:function(){!function(e,n,t){var a=J(n),r=V(a);a&&(null===r||void 0===r?void 0:r.currentPlayer.id)===t&&(X(r,t)>0||e({variables:{input:{gameId:n.id,playerId:t,amount:0}}}))}(i,n,o)},isDisabled:X(l,o)>0},{text:"Call",handleOnClick:function(){!function(e,n,t){var a,r,l=J(n),o=V(l);if(l&&(null===o||void 0===o?void 0:o.currentPlayer.id)===t){var i=X(o,t),u=null!==(a=null===(r=n.players.find((function(e){return e.id===t})))||void 0===r?void 0:r.money)&&void 0!==a?a:0;e({variables:{input:{gameId:n.id,playerId:t,amount:Math.min(i,u)}}})}}(i,n,o)},isDisabled:X(l,o)<=0},{text:"Raise",handleOnClick:function(){d(!0)},isDisabled:(null===m||void 0===m?void 0:m.money)&&X(l,o)>=(null===m||void 0===m?void 0:m.money)},{text:"Fold",handleOnClick:function(){!function(e,n,t){var a=J(n),r=V(a);a&&(null===r||void 0===r?void 0:r.currentPlayer.id)===t&&e({variables:{input:{gameId:n.id,playerId:t,amount:-1}}})}(i,n,o)}}].map((function(e){return r.a.createElement(Qe,Object.assign({key:e.text},e,{isDisabled:e.isDisabled||(null===l||void 0===l?void 0:l.currentPlayer.id)!==o||!Z(t,n.players)}))})),r.a.createElement(Be,{game:n,placeBet:i,playerId:o,currentBettingRound:l,handleRaise:ae,showRaiseDrawer:s,setShowRaiseDrawer:d}))},Fe={fontSize:"0.9em"},Me=function(e){var n=e.currentQuestionRound,t=e.currentBettingRound,a=e.playerId,l=e.revealPreviousAnswers,o=l?[0,0]:n.bettingRounds.reduce((function(e,n){var t=Object(E.a)(e,2),r=t[0],l=t[1];return n.bets.forEach((function(e){r+=e.amount,e.playerId===a&&(l+=e.amount)})),[r,l]}),[0,0]),i=Object(E.a)(o,2),u=i[0],c=i[1],s=l?0:X(t,a);return r.a.createElement("div",{className:"d-flex w-100 flex-row  justify-content-between pb-3 px-1",style:Fe},r.a.createElement("span",null,"Pot (total/you):"," ",r.a.createElement("span",{role:"img","aria-label":"money"},"\ud83d\udcb0"),u,"/",c),r.a.createElement("span",null,"To call:"," ",r.a.createElement("span",{role:"img","aria-label":"money"},"\ud83d\udcb0"),s))},Ae=(t(143),function(e){var n=e.game,t=e.currentQuestionRound,a=e.currentBettingRound,l=e.playerId,o=e.placeBet,i=e.startGame,u=(null===n||void 0===n?void 0:n.isOver)||n&&n.questionRounds.length>1&&!(null===t||void 0===t?void 0:t.guesses.find((function(e){return e.playerId===l})));return r.a.createElement("div",{className:"footer"},r.a.createElement("div",{className:"footer-content"},!n.questionRounds.length&&r.a.createElement("button",{className:"btn btn-lg btn-primary mt-auto mx-5",disabled:n.players.length<=1,onClick:function(){i({variables:{gameId:n.id}})}},"Start Game"),t&&a&&l&&r.a.createElement(r.a.Fragment,null,r.a.createElement(Me,{playerId:l,currentQuestionRound:t,currentBettingRound:a,revealPreviousAnswers:u}),r.a.createElement($e,{game:n,currentQuestionRound:t,currentBettingRound:a,placeBet:o,playerId:l}))))}),Ge=t(191),Ue=t(192),Te=t(195),He=t(101),Le=t.n(He),_e=function(e){var n=e.gameId,t=e.playerId,a=e.gameHasStarted,l=e.setPlayerId,o=r.a.useState(!1),i=Object(E.a)(o,2),u=i[0],c=i[1],s=Object(O.b)(L,{onError:_,onCompleted:function(){n&&(!function(e){localStorage.removeItem("".concat("player_id","_").concat(e))}(n),l(void 0))}}),d=Object(E.a)(s,1)[0];if(!n||!t)return null;var m=function(){c(!1)};return r.a.createElement(r.a.Fragment,null,r.a.createElement("button",{id:"leave-game",className:"btn btn-link btn-lg",onClick:function(){c(!0)}},r.a.createElement(Le.a,null)),r.a.createElement(Ge.a,{open:u,onClose:m},r.a.createElement("div",{className:"px-4 py-2"},r.a.createElement(Te.a,null,"Are you sure?",a&&r.a.createElement("p",null,"If you leave the game, you cannot join again later.")),r.a.createElement(Ue.a,null,r.a.createElement("button",{className:"btn btn-outline-dark",onClick:m},"Cancel"),r.a.createElement("button",{className:"btn btn-primary",onClick:function(){d({variables:{playerId:t,gameId:n}}),c(!1)}},"Leave Game")))))},ze=function(e){var n,t=e.usedQuestionRound,a=e.isSpectator,l=e.playerId,o=e.players,i=null===t||void 0===t?void 0:t.question.type;if(!t||i!==Q.GEO)return null;var u=null===t||void 0===t||null===(n=t.guesses.find((function(e){return e.playerId===l})))||void 0===n?void 0:n.guess.geo,c=u?[{position:u,label:"You"}]:[];return(a||(null===t||void 0===t?void 0:t.isOver)&&(null===t||void 0===t?void 0:t.isShowdown))&&c.push.apply(c,Object(b.a)(null===t||void 0===t?void 0:t.guesses.reduce((function(e,n){var r=n.guess,i=n.playerId;if(r.geo&&l!==i&&(a||!ee(t,i))){var u,c=(null===(u=o.find((function(e){return e.id===i})))||void 0===u?void 0:u.name)||"";e.push({position:r.geo,label:c})}return e}),[]))),ne(t)&&t.question.answer.geo&&c.push({position:t.question.answer.geo,label:"Correct Answer"}),r.a.createElement(Ce,{markers:c})};t(146);var Ye=function(){var e=Object(a.useState)(void 0),n=Object(E.a)(e,2),t=n[0],l=n[1],o=Object(a.useState)(void 0),i=Object(E.a)(o,2),u=i[0],c=i[1],s=J(u),d=V(s),m=Object(a.useState)(!0),p=Object(E.a)(m,2),f=p[0],b=p[1],g=Object(v.h)().gameId,y=Object(a.useState)(),h=Object(E.a)(y,2),I=h[0],w=h[1],N=function(e){_(e),w(e)},j=Object(O.a)(M,{fetchPolicy:"cache-and-network",onError:N,onCompleted:function(e){var n=e.game;c(n)}}),R=Object(E.a)(j,1)[0],k=Object(O.b)(G,{onError:N}),S=Object(E.a)(k,2),C=S[0],q=S[1].data,x=Object(O.b)(U,{onError:N}),P=Object(E.a)(x,1)[0],D=Object(O.b)(T,{onError:N}),Q=Object(E.a)(D,1)[0],B=Object(O.b)(H,{onError:N}),$=Object(E.a)(B,1)[0],F=Object(O.c)(A,{variables:{gameId:g,hash:se(g)||ce(g)},onSubscriptionData:function(e){var n,t=e.subscriptionData;c(null===(n=t.data)||void 0===n?void 0:n.gameUpdated)}}).error;if(Object(a.useEffect)((function(){F&&N(F)}),[F]),Object(a.useEffect)((function(){R({variables:{gameId:g}})}),[R,g]),Object(a.useEffect)((function(){if(g){var e,n=function(e){return localStorage.getItem("".concat("player_id","_").concat(e))}(g),t=null===q||void 0===q||null===(e=q.addPlayer)||void 0===e?void 0:e.id;n&&l(n),t&&(!function(e,n){localStorage.setItem("".concat("player_id","_").concat(e),n)}(g,t),l(t))}}),[g,q]),!u)return r.a.createElement("h3",null,"Loading...");if(I)return r.a.createElement("p",null,"A technical error occurred. Try to refresh the page");var L=u.players.find((function(e){return e.id===t})),z=null===s||void 0===s?void 0:s.guesses.find((function(e){return e.playerId===t})),Y=!!u.questionRounds.length,K=Y&&(!L||L.isDead),W=!!z,X=function(e){var n;return null===e||void 0===e?void 0:e.questionRounds[(null===e||void 0===e||null===(n=e.questionRounds)||void 0===n?void 0:n.length)-(e.isOver?1:2)]}(u),ee=!!X&&(u.isOver||!W&&!K||K&&!!s&&!Z(s,u.players))?X:s;return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"grid mt-3",style:{fontWeight:300,paddingBottom:"130px"}},r.a.createElement("div",null,ee&&r.a.createElement(ye,{game:u,usedQuestionRound:ee,playerId:t}),r.a.createElement(ze,{usedQuestionRound:ee,isSpectator:K,playerId:t,players:u.players})),r.a.createElement("div",{className:"d-flex flex-column"},r.a.createElement(fe,{players:null===u||void 0===u?void 0:u.players,playerId:t,usedQuestionRound:ee,currentBettingRound:d,isSpectator:K,game:u})),!f&&!W&&!K&&r.a.createElement("button",{className:"new-question-button btn btn-primary mx-auto mt-5",onClick:function(){b(!0)}},"Answer New Question")),s&&t&&r.a.createElement(xe,{game:u,addGuessMutation:$,currentQuestionRound:s,playerId:t,showNewQuestionRound:f,setShowNewQuestionRound:b}),!u.isOver&&!K&&r.a.createElement(Ae,{game:u,currentQuestionRound:s,currentBettingRound:d,placeBet:Q,playerId:t,startGame:P}),!Y&&r.a.createElement(De,{gameId:g,createPlayer:C,playerId:t}),r.a.createElement(_e,{gameId:g,playerId:t,gameHasStarted:Y,setPlayerId:l}))};t(147);function Ke(){return r.a.createElement("p",null,"Page not found.")}var We=function(){return r.a.createElement("div",{id:"app",className:"container-sm py-2"},r.a.createElement("a",{href:"/",id:"title",className:"unstyled-link"},"Certainty Poker"),r.a.createElement(v.c,null,r.a.createElement(v.a,{path:"/",component:ue,exact:!0}),r.a.createElement(v.a,{path:"/:gameId",component:Ye,exact:!0}),r.a.createElement(v.a,{path:"/questions/:setName",component:ue,exact:!0}),r.a.createElement(v.a,{component:Ke})))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var Je="s://certainty-poker.herokuapp.com",Ve=new d.a({uri:"http".concat(Je,"/query")}),Ze=new s.a({uri:"ws".concat(Je,"/query"),options:{reconnect:!0}}),Xe=Object(m.d)((function(e){var n=e.query,t=Object(p.l)(n),a=t.kind,r=t.operation;return"OperationDefinition"===a&&"subscription"===r}),Ze,Ve),en=new u.c({link:Xe,cache:new f.a});o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(c.a,{client:en},r.a.createElement(i.a,null,r.a.createElement(We,null)))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[111,1,2]]]);
//# sourceMappingURL=main.e0646eea.chunk.js.map