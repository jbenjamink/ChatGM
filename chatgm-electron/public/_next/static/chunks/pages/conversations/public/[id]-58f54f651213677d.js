(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[563],{6928:function(e,t,s){(window.__NEXT_P=window.__NEXT_P||[]).push(["/conversations/public/[id]",function(){return s(8499)}])},2910:function(e,t,s){"use strict";s.d(t,{Z:function(){return g}});var n=s(5893),a=s(7294),r=s(4926),o=s(2490),l=s(5146),i=s(9773),c=s(6485),u=s.n(c),d=s(9599),m=s(4117);s(6606);var p=s(1268);let f={channel:null};new Promise((e,t)=>{p.Z.connection.bind("connected",async()=>{s()}),p.Z.connection.bind("error",e=>{console.log("Pusher subscription failed:",e)});let s=async()=>{f.channel&&f.channel.unsubscribe(),f.channel=p.Z.subscribe("private-chatgoodmorning-bot"),e(f)}});var h=s(8941),g=function(e){let{index:t,message:s,avatarSource:c,sender:p,updateState:g,setConversation:x,referencedMessage:b,onClick:v,userInfo:j}=e,[w,N]=(0,a.useState)(s),[k,y]=(0,a.useState)(!1),[C,S]=(0,a.useState)(!1),[_,P]=(0,a.useState)(!1),E=(0,a.useRef)(null),Z=(0,a.useRef)(null);(0,a.useEffect)(()=>{N(s)},[s]),(0,a.useEffect)(()=>{if(!_)return;let e=Z.current;e.selectionStart=e.selectionEnd=e.value.length},[_]);let M=i.S.messages.update.useMutation(),T=i.S.users.addStarredMessage.useMutation();new Date().toLocaleString("en-US",{timeZone:"America/New_York",hour:"numeric",minute:"2-digit",hour12:!0});let I=async()=>{let e={...w,starred:!w.starred};M.mutate(e),T.mutate({messageId:e.id}),N(e),g(t,e)},A=e=>{E.current=window.getSelection().getRangeAt(0).startOffset},R=p.username?p.username:s.role;return(0,n.jsx)("div",{className:"w-full box cursor-pointer",onMouseEnter:()=>S("user"==s.role),onMouseLeave:()=>S("user"==s.role&&!1),onClick:v,children:(0,n.jsxs)("div",{className:"message p-4 pt-4 relative ".concat(s.id==(null==b?void 0:b.id)?"active":""),children:[(0,n.jsx)("img",{src:p.avatarSource||c,alt:"Avatar",className:"w-9 h-9 rounded-full absolute left-4 top-2"}),(0,n.jsxs)("div",{className:"pl-16 pt-0",children:[(0,n.jsx)("span",{className:"text-sm mb-1 inline-block name",children:R})," ",(0,n.jsx)("br",{}),(0,n.jsxs)("span",{className:"text-xs inline-block absolute top-3 right-4 timestamp",children:[(0,n.jsxs)("span",{className:"message-direction",children:["ChatGPT-3.5"==p?"Received":s.inProgress?"Typing...":"Sent",(0,n.jsx)("i",{className:"fa-regular ".concat("ChatGPT-3.5"==p?"fa-arrow-down-left":"fa-arrow-up-right"," fa-lg ml-1 mr-3 mt-2")})]})," ",function(e){let t=e?new Date(e):new Date,s=(0,d.Z)(t,"America/New_York"),n=(0,m.Z)(s,"h:mm a");return n}(s.createdAt),(0,n.jsx)("i",{className:"fa-stars ".concat(w.starred?"fa-solid":"fa-regular"," ml-2 text-yellow cursor-pointer"),onClick:I}),k?(0,n.jsx)("i",{className:"fa-solid fa-check text-green w-5 h-5 ml-3"}):(0,n.jsx)("i",{className:"fa-light fa-copy w-5 h-5 ml-3 cursor-pointer",onClick:()=>{!function(e){u()(e).then(()=>{console.log("Copied to clipboard:",e),y(!0),setTimeout(()=>y(!1),2e3)}).catch(e=>console.error("Failed to copy:",e))}(w.content)}}),j.enableChatGMBot&&j.telegramUserId&&(0,n.jsx)("i",{className:"fa fa-telegram text-lightblue w-5 h-5 ml-3",onClick:async e=>{var t;e.stopPropagation();let s=await h.L.openai.queryPrompt.query(w);null===(t=f.channel)||void 0===t||t.trigger("client-message",{message:s,userId:j.telegramUserId})}}),C&&(0,n.jsx)("div",{className:"absolute top-9 right-0 mb-2 mr-0 cursor-pointer",onClick:()=>{P(!0)},children:(0,n.jsx)("i",{className:"fa-sharp fa-regular fa-pen-to-square w-5 h-5 ml-3 cursor-pointer",onClick:()=>{P(!0)}})})]}),_?(0,n.jsxs)("form",{children:[(0,n.jsx)("textarea",{value:w.content,ref:Z,className:"p-0 m-0 mt-5 h-auto w-full border-none focus:outline-none",rows:"1",autoFocus:!0,spellCheck:"false",onInput:e=>{N({...w,content:e.target.value})},onBlur:A}),(0,n.jsx)("div",{className:"py-5 flex justify-center",children:(0,n.jsxs)("div",{className:"flex items-center",children:[(0,n.jsx)("span",{className:" p-0 !important",children:(0,n.jsx)("button",{type:"button",onClick:()=>{console.log("localMessage",w),M.mutate(w),P(!1),g(t,w,!0)},className:"editing-message-save px-6 py-2 text-xs font-semibold uppercase tracking-wide transition-colors duration-200 border rounded border-transparent text-white btn-gray bg-transparent",children:"Save & Submit"})}),(0,n.jsx)("div",{className:"h-4 w-px mx-3"}),(0,n.jsx)("span",{className:"button-container ml-auto",children:(0,n.jsx)("button",{type:"button",onClick:()=>{P(!1),N({...w,content:s.content})},className:"font-semibold text-xs uppercase p-1 editing-message-cancel bg-transparent",children:"Cancel"})})]})})]}):(0,n.jsx)(r.D,{remarkPlugins:[o.Z],rehypePlugins:[l.Z],children:s.content,components:{p:e=>{let{children:t}=e;return(0,n.jsx)(n.Fragment,{children:t&&t.map(e=>{if("string"==typeof e){let t=e.split("\n");return t.map((e,t)=>(0,n.jsxs)(a.Fragment,{children:[t>0&&(0,n.jsx)("br",{}),e]},t))}return e})})}}})]})]})})}},1268:function(e,t,s){"use strict";var n=s(6606),a=s.n(n);let r=new(a())("227d14e2b7408912423b",{cluster:"us2",authEndpoint:"/api/auth/pusher"});t.Z=r},8499:function(e,t,s){"use strict";s.r(t),s.d(t,{default:function(){return o}});var n=s(5893);s(7294);var a=s(1163);next;var r=s(2910),o=function(e){let{conversation:t}=e,s=(0,a.useRouter)(),{id:o}=s.query;return(console.log("CONVERSATION:",t),t)?(0,n.jsx)("div",{className:"mx-auto max-w-[760px]",children:(0,n.jsx)("div",{className:"p-4 overflow-y-auto",id:"messages-box",children:t.messages.map((e,s)=>(0,n.jsx)(r.Z,{index:s,message:e,avatarSource:"/"+e.avatarSource,sender:"user"==e.role?e.sender:"ChatGPT-3.5",received:!0,updateState:void 0,setConversation:void 0,referencedMessage:void 0,onClick:()=>{},userInfo:{}},t.id+s))})}):(0,n.jsx)(n.Fragment,{})}}},function(e){e.O(0,[662,837,774,888,179],function(){return e(e.s=6928)}),_N_E=e.O()}]);