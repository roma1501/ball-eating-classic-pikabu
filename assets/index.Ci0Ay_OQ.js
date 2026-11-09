const Gn="Score",Ol=typeof window!="undefined"&&!!window.__playgamaYandexShim;function kl(){return!Ol}function Lr(){return!!lt.authorized||Ol}const lt={ysdk:null,player:null,leaderboards:null,ready:!1,authorized:!1,lang:"ru",deviceType:"desktop",gameplayRunning:!1,lbError:null},zl=[];function Bh(i){zl.push(i)}function fc(i){zl.forEach(t=>{try{t(i)}catch{}})}function Pn(i,t){try{const e=i();return e&&typeof e.then=="function"&&e.catch(()=>{}),e}catch{return t}}async function Gh(){if(typeof window.YaGames=="undefined")return console.warn("[YSDK] SDK script not present — running in standalone mode."),null;try{return lt.ysdk=await window.YaGames.init(),window.ysdk=lt.ysdk,lt.lang=Pn(()=>lt.ysdk.environment.i18n.lang,"ru")||"ru",lt.deviceType=Pn(()=>lt.ysdk.deviceInfo.type,"desktop")||"desktop",Pn(()=>lt.ysdk.on("game_api_pause",()=>fc(!0))),Pn(()=>lt.ysdk.on("game_api_resume",()=>fc(!1))),await Bl(),await Wr(),lt.ysdk}catch(i){return console.warn("[YSDK] init failed:",i),lt.ysdk=null,null}}async function Bl(){if(lt.ysdk)try{lt.player=await lt.ysdk.getPlayer({scopes:!1,signed:!1}),lt.authorized=Pn(()=>lt.player.getMode()!=="lite",!1)}catch{lt.player=null,lt.authorized=!1}}function Ir(i){return i?typeof i=="string"?i:i.message||i.code||String(i):"unknown error"}function pc(i){return i?typeof i.setScore=="function"&&typeof i.getEntries=="function"?{flavour:"modern",setScore:(t,e)=>i.setScore(t,e),getEntries:(t,e)=>i.getEntries(t,e),getPlayerEntry:typeof i.getPlayerEntry=="function"?t=>i.getPlayerEntry(t):null}:typeof i.setLeaderboardScore=="function"&&typeof i.getLeaderboardEntries=="function"?{flavour:"legacy",setScore:(t,e)=>i.setLeaderboardScore(t,e),getEntries:(t,e)=>i.getLeaderboardEntries(t,e),getPlayerEntry:typeof i.getLeaderboardPlayerEntry=="function"?t=>i.getLeaderboardPlayerEntry(t):null}:null:null}async function Wr(){if(lt.ysdk){lt.lbError=null;try{lt.leaderboards=pc(lt.ysdk.leaderboards),!lt.leaderboards&&typeof lt.ysdk.getLeaderboards=="function"&&(lt.leaderboards=pc(await lt.ysdk.getLeaderboards()))}catch(i){lt.leaderboards=null,lt.lbError=Ir(i)}!lt.leaderboards&&!lt.lbError&&(lt.lbError="leaderboards API unavailable"),lt.lbError?console.warn("[LB] init failed:",lt.lbError):console.info("[LB] API ready:",lt.leaderboards.flavour)}}function Hh(){lt.ready||(lt.ready=!0,Pn(()=>lt.ysdk.features.LoadingAPI.ready()),console.info("[YSDK] LoadingAPI.ready() sent"))}function yr(){lt.gameplayRunning||(lt.gameplayRunning=!0,Pn(()=>lt.ysdk.features.GameplayAPI.start()))}function Ds(){lt.gameplayRunning&&(lt.gameplayRunning=!1,Pn(()=>lt.ysdk.features.GameplayAPI.stop()))}function Va(){return!!lt.authorized}function Vh(){return Pn(()=>lt.player.getUniqueID(),"")||""}async function Wh(){if(!kl()||!lt.ysdk||!lt.ysdk.auth)return!1;try{return await lt.ysdk.auth.openAuthDialog(),await Bl(),await Wr(),lt.authorized}catch{return!1}}async function Xh(){if(!lt.player||!lt.authorized)return null;try{const i=await lt.player.getData(["save"]);return i&&i.save?i.save:null}catch{return null}}async function qh(i){if(!lt.player||!lt.authorized)return!1;try{return await lt.player.setData({save:i},!1),!0}catch{return!1}}async function Sr(i){const t=Math.max(0,Math.floor(i));if(t<=0)return!1;if(!Lr())return console.info("[LB] not submitted — player is not signed in"),!1;if(lt.leaderboards||await Wr(),!lt.leaderboards)return console.warn("[LB] not submitted — leaderboards API unavailable:",lt.lbError),!1;try{return await lt.leaderboards.setScore(Gn,t),lt.lbError=null,console.info(`[LB] "${Gn}" <- ${t} OK`),!0}catch(e){return lt.lbError=Ir(e),console.warn(`[LB] setScore("${Gn}", ${t}) FAILED: ${lt.lbError}
     Check that a leaderboard with the technical name "${Gn}" exists in the console.`,e),!1}}function Yh(){return lt.lbError}function mc(i,t){const e=i.player||{};return{rank:i.rank,score:i.score,name:e.publicName||e.name||"",photo:typeof e.getAvatarSrc=="function"?Pn(()=>e.getAvatarSrc("small"),""):e.photo||"",isMe:!!(e.uniqueID&&t&&e.uniqueID===t)}}async function $h(){if(lt.leaderboards||await Wr(),!lt.leaderboards)return null;try{let i=null;try{i=await lt.leaderboards.getEntries(Gn,{quantityTop:12,includeUser:Lr(),quantityAround:4})}catch(n){console.warn(`[LB] entries with includeUser failed (${Ir(n)}) — retrying without it`),i=await lt.leaderboards.getEntries(Gn,{quantityTop:12,includeUser:!1})}lt.lbError=null;const t=Vh(),e=(i.entries||[]).map(n=>mc(n,t));if(Lr()&&!e.some(n=>n.isMe)&&lt.leaderboards.getPlayerEntry)try{const n=await lt.leaderboards.getPlayerEntry(Gn);if(n&&typeof n.score=="number"){const s=mc(n,t);s.isMe=!0,e.push(s),e.sort((r,a)=>r.rank-a.rank)}}catch{console.info("[LB] player has no record yet")}return{entries:e,userRank:i.userRank||0}}catch(i){return lt.lbError=Ir(i),console.warn(`[LB] getEntries("${Gn}") FAILED: ${lt.lbError}
     Check that a leaderboard with the technical name "${Gn}" exists in the console.`,i),null}}function Kh(){return lt.lang}function Gl(){if(lt.ysdk){const i=lt.deviceType;if(i==="mobile"||i==="tablet")return!0;if(i==="desktop"||i==="tv")return!1}return/android|iphone|ipad|ipod|iemobile|mobile|touch/i.test(navigator.userAgent)||navigator.maxTouchPoints>1&&!/windows nt/i.test(navigator.userAgent)}function gc(){return!!lt.ysdk}function _c(){return lt.ysdk?lt.ysdk.adv:null}const xc=6e4,jh=45e3,Ms={SPEED:{id:"speed",titleKey:"adSpeedTitle",subKey:"adSpeedSub",doneKey:"rewardSpeed"},SIZE:{id:"size",titleKey:"adSizeTitle",subKey:"adSizeSub",doneKey:"rewardSize"},REVIVE:{id:"revive",titleKey:"adReviveTitle",subKey:"adReviveSub",doneKey:"rewardRevive"},UPGRADE:{id:"upgrade",titleKey:"upAd",subKey:"upAd",doneKey:"rewardUpgrade"},ITEM:{id:"item",titleKey:"forAds",subKey:"forAds",doneKey:null}};class Zh{constructor(){this.enabled=!1,this.nextAllowedAt=0,this.adBusy=!1,this.rewardedBusy=!1,this.breakActive=!1,this.hooks={}}setHooks(t){this.hooks=Object.assign(this.hooks,t)}start(){this.enabled=!0,this.nextAllowedAt=Date.now()+jh}stop(){this.enabled=!1,this._endBreak("stopped")}get secondsLeft(){return Math.max(0,Math.ceil((this.nextAllowedAt-Date.now())/1e3))}get isDue(){return this.enabled&&!this.adBusy&&!this.rewardedBusy&&!this.breakActive&&Date.now()>=this.nextAllowedAt}_beginBreak(t){this.breakActive||(this.breakActive=!0,Ds(),this.hooks.onAdStart&&this.hooks.onAdStart(t))}_endBreak(t){this.breakActive&&(this.breakActive=!1,this.hooks.onAdEnd&&this.hooks.onAdEnd(t),yr())}async maybeShow(t){if(!this.isDue||typeof document!="undefined"&&document.hidden||this.hooks.canShow&&!this.hooks.canShow(t))return!1;this._beginBreak(t);try{await this.showInterstitial()}catch{this.adBusy=!1,this._endBreak(t)}return!0}showInterstitial(){const t=_c();return this.adBusy=!0,!gc()||!t||typeof t.showFullscreenAdv!="function"?new Promise(e=>{setTimeout(()=>{this.adBusy=!1,this.nextAllowedAt=Date.now()+xc,this._endBreak("interstitial"),e()},400)}):new Promise(e=>{let n=!1;const s=()=>{n||(n=!0,this.adBusy=!1,this.nextAllowedAt=Date.now()+xc,this._endBreak("interstitial"),e())};try{t.showFullscreenAdv({callbacks:{onOpen:()=>{},onClose:()=>s(),onError:r=>{console.warn("[ADV] interstitial error",r),s()},onOffline:()=>s()}}),setTimeout(s,45e3)}catch{s()}})}showRewarded(t){if(this.adBusy||this.rewardedBusy)return Promise.resolve(!1);const e=_c();return!gc()||!e||typeof e.showRewardedVideo!="function"?(this.rewardedBusy=!0,this._beginBreak("rewarded"),new Promise(n=>{setTimeout(()=>{this.rewardedBusy=!1,this._endBreak("rewarded"),n(!0)},600)})):(this.rewardedBusy=!0,this._beginBreak("rewarded"),new Promise(n=>{let s=!1,r=!1;const a=()=>{r||(r=!0,this.rewardedBusy=!1,this.nextAllowedAt=Math.max(this.nextAllowedAt,Date.now()+3e4),this._endBreak("rewarded"),n(s))};try{e.showRewardedVideo({callbacks:{onOpen:()=>{},onRewarded:()=>{s=!0},onClose:()=>a(),onError:o=>{console.warn("[ADV] rewarded error",o),a()}}}),setTimeout(a,12e4)}catch{a()}}))}}const Ws=new Zh,Hl="bec_save_v1",Vl={coins:0,best:0,nick:"",skin:"classic",owned:["classic"],sound:!0,music:!0,mouseCtl:!0,quality:"",lang:"",spinAt:0,spins:0,giftIndex:0,giftStart:0,dailyDay:0,dailyAt:0,plays:0,mode:"classic",ringBest:0,ringWins:0,blitzBest:0,up_speed:0,up_start:0,up_bite:0,up_growth:0,up_coins:0,up_shield:0,trail:"none",effect:"none",ownedTrails:["none"],ownedEffects:["none"],adViews:{}},vc={skins:"owned",trails:"ownedTrails",effects:"ownedEffects"};let Kt=Object.assign({},Vl),Qr=!1,Mc=0;function Jh(){try{const i=localStorage.getItem(Hl);return i?JSON.parse(i):null}catch{return null}}function wr(){try{localStorage.setItem(Hl,JSON.stringify(Kt))}catch{}}function yc(i){if(!(!i||typeof i!="object")){for(const t in Vl)i[t]!==void 0&&i[t]!==null&&(Kt[t]=i[t]);(!Array.isArray(Kt.owned)||!Kt.owned.length)&&(Kt.owned=["classic"]),Kt.owned.indexOf("classic")<0&&Kt.owned.push("classic");for(const t of["ownedTrails","ownedEffects"])Kt[t]=Array.isArray(Kt[t])?Kt[t].slice():["none"],Kt[t].indexOf("none")<0&&Kt[t].push("none");Kt.adViews=Object.assign({},Kt.adViews&&typeof Kt.adViews=="object"?Kt.adViews:{})}}const X={get data(){return Kt},async init(){if(yc(Jh()),Va()){const i=await Xh();i&&(i.best||0)+(i.coins||0)>=(Kt.best||0)+(Kt.coins||0)&&yc(i),wr()}return Kt},get(i){return Kt[i]},set(i,t){Kt[i]=t,this.markDirty()},patch(i){Object.assign(Kt,i),this.markDirty()},addCoins(i){return Kt.coins=Math.max(0,Math.floor(Kt.coins+i)),this.markDirty(),Kt.coins},spendCoins(i){return Kt.coins<i?!1:(Kt.coins-=i,this.markDirty(),!0)},ownsSkin(i){return Kt.owned.indexOf(i)>=0},owns(i,t){return(Kt[vc[i]]||[]).indexOf(t)>=0},unlock(i,t){const e=vc[i];this.owns(i,t)||(Kt[e]=[...Kt[e]||[],t]),this.markDirty()},adViewsOf(i,t){return Kt.adViews[i+":"+t]||0},addAdView(i,t){const e=i+":"+t;return Kt.adViews=Object.assign({},Kt.adViews,{[e]:(Kt.adViews[e]||0)+1}),this.markDirty(),Kt.adViews[e]},unlockSkin(i){this.ownsSkin(i)||Kt.owned.push(i),this.markDirty()},markDirty(){Qr=!0,wr(),clearTimeout(Mc),Mc=setTimeout(()=>this.flush(),4e3)},async flush(){Qr&&(Qr=!1,wr(),Va()&&await qh(Kt))}};window.addEventListener("pagehide",()=>{wr()});document.addEventListener("visibilitychange",()=>{document.hidden&&X.flush()});const Qh=""+new URL("happy-adventure.DYF0-phc.mp3",import.meta.url).href,Sc=.32;class td{constructor(){this.ctx=null,this.master=null,this.sfxGain=null,this.musicGain=null,this.soundOn=!0,this.musicOn=!0,this.paused=!1,this.started=!1,this._musicBuf=null,this._musicSrc=null,this._lastEat=0}init(){if(this.ctx)return;const t=window.AudioContext||window.webkitAudioContext;t&&(this.ctx=new t,this.master=this.ctx.createGain(),this.master.gain.value=.9,this.master.connect(this.ctx.destination),this.sfxGain=this.ctx.createGain(),this.sfxGain.gain.value=this.soundOn?.75:0,this.sfxGain.connect(this.master),this.musicGain=this.ctx.createGain(),this.musicGain.gain.value=this.musicOn?Sc:0,this.musicGain.connect(this.master))}unlock(){this.init(),this.ctx&&(this.ctx.state==="suspended"&&this.ctx.resume(),this.started||(this.started=!0,this._scheduleMusic()))}setSound(t){this.soundOn=t,this.sfxGain&&(this.sfxGain.gain.value=t?.75:0)}setMusic(t){this.musicOn=t,this.musicGain&&(this.musicGain.gain.value=t?Sc:0)}pause(){this.paused=!0,this.ctx&&this.ctx.state==="running"&&this.ctx.suspend()}resume(){this.paused=!1,this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume()}_tone({freq:t=440,type:e="sine",dur:n=.15,gain:s=.3,slideTo:r=0,delay:a=0,bus:o=null}){if(!this.ctx||this.paused)return;const c=this.ctx.currentTime+a,l=this.ctx.createOscillator(),h=this.ctx.createGain();l.type=e,l.frequency.setValueAtTime(t,c),r&&l.frequency.exponentialRampToValueAtTime(Math.max(20,r),c+n),h.gain.setValueAtTime(1e-4,c),h.gain.exponentialRampToValueAtTime(s,c+.012),h.gain.exponentialRampToValueAtTime(1e-4,c+n),l.connect(h),h.connect(o||this.sfxGain),l.start(c),l.stop(c+n+.03)}_noise({dur:t=.25,gain:e=.25,freq:n=900,delay:s=0}){if(!this.ctx||this.paused)return;const r=this.ctx.currentTime+s,a=Math.max(1,Math.floor(this.ctx.sampleRate*t)),o=this.ctx.createBuffer(1,a,this.ctx.sampleRate),c=o.getChannelData(0);for(let u=0;u<a;u++)c[u]=(Math.random()*2-1)*(1-u/a);const l=this.ctx.createBufferSource();l.buffer=o;const h=this.ctx.createBiquadFilter();h.type="bandpass",h.frequency.value=n;const d=this.ctx.createGain();d.gain.setValueAtTime(e,r),d.gain.exponentialRampToValueAtTime(1e-4,r+t),l.connect(h),h.connect(d),d.connect(this.sfxGain),l.start(r)}eat(t=0){if(!this.ctx)return;const e=this.ctx.currentTime;if(e-this._lastEat<.035)return;this._lastEat=e;const n=420+t*260;this._tone({freq:n,type:"square",dur:.075,gain:.13,slideTo:n*1.7})}coin(){this._tone({freq:990,type:"square",dur:.09,gain:.16}),this._tone({freq:1480,type:"square",dur:.14,gain:.13,delay:.07})}bigEat(){this._tone({freq:190,type:"sawtooth",dur:.3,gain:.22,slideTo:520}),this._noise({dur:.3,gain:.18,freq:500})}grow(){this._tone({freq:320,type:"triangle",dur:.22,gain:.18,slideTo:720})}crunch(){this._noise({dur:.22,gain:.22,freq:240}),this._noise({dur:.16,gain:.14,freq:900,delay:.05}),this._tone({freq:150,type:"square",dur:.16,gain:.12,slideTo:70})}death(){this._tone({freq:520,type:"sawtooth",dur:.9,gain:.25,slideTo:70}),this._noise({dur:.7,gain:.2,freq:320})}click(){this._tone({freq:700,type:"square",dur:.05,gain:.14})}reward(){[523,659,784,1046].forEach((t,e)=>this._tone({freq:t,type:"triangle",dur:.26,gain:.2,delay:e*.09}))}error(){this._tone({freq:220,type:"square",dur:.18,gain:.16,slideTo:130})}warn(){this._tone({freq:880,type:"triangle",dur:.18,gain:.2}),this._tone({freq:660,type:"triangle",dur:.22,gain:.18,delay:.2})}spinTick(){this._tone({freq:1200,type:"square",dur:.03,gain:.07})}async _scheduleMusic(){if(!(!this.ctx||this._musicSrc))try{if(!this._musicBuf){const n=await(await fetch(Qh)).arrayBuffer();this._musicBuf=await new Promise((s,r)=>this.ctx.decodeAudioData(n,s,r))}if(this._musicSrc)return;const t=this.ctx.createBufferSource();t.buffer=this._musicBuf,t.loop=!0,t.connect(this.musicGain),t.start(),this._musicSrc=t}catch(t){console.warn("[AUDIO] music unavailable",t)}}}const qt=new td,ta={ru:{loading:"Загрузка…",tips:["Ешь шарики и расти!","Ешь игроков меньше себя — но беги от больших!","За съеденных игроков дают монеты.","Открывай новые скины в магазине.","Крути колесо удачи каждые 3 минуты.","Забирай дары — они копятся, пока ты играешь.","В режиме «Кольцо» держись внутри круга.","В «Блице» золотой шар даёт 500 очков."],play:"ИГРАТЬ",settings:"Настройки",close:"ЗАКРЫТЬ",back:"Назад",nickPlaceholder:"Твой ник",nickLabel:"Твой ник",tagline:"Ешь. Расти. Правь ареной.",adWatch:"за просмотр рекламы",newRecord:"НОВЫЙ РЕКОРД",scoreWord:"ОЧКИ",bestWord:"Рекорд",skins:"Скины",gifts:"Дары",luckySpin:"Колесо",luckySpinFull:"ЛАКИ СПИН",dailyBonus:"Бонус",dailyBonusFull:"ЕЖЕДНЕВНЫЙ БОНУС",auto:"Авто",leaders:"Лидеры",leadersTitle:"ТАБЛИЦА ЛИДЕРОВ",sound:"Звук",music:"Музыка",quality:"Качество",qLow:"Низкое",qMed:"Среднее",qHigh:"Высокое",language:"Язык",mouseControl:"Управление мышью",controlsTitle:"Управление",controlsText:`Мышь: зажми ЛКМ — шарик едет к курсору
Клавиши: WASD или стрелки
Камера: зажми ПКМ и веди мышь
Зум: колесо мыши
На телефоне: джойстик слева`,hintMouse:"Зажми левую кнопку мыши, чтобы двигаться",getCoins:"КАК ПОЛУЧИТЬ МОНЕТЫ",waySpin:"Лаки спин",wayDaily:"Ежедневный бонус",wayGifts:"Дары",wayEat:"Ешь других игроков — за каждого дают монеты!",selected:"ВЫБРАНО",select:"ВЫБРАТЬ",buy:"КУПИТЬ",notEnoughCoins:"Не хватает монет!",skinBought:"Скин куплен!",nextSpin:"Следующее вращение",spinNow:"ВРАЩАТЬСЯ",spinForCoins:"КРУТИТЬ ЗА 25",spinReady:"Готово!",youWon:"ТЫ ВЫИГРАЛ!",giftReady:"ГОТОВО",claim:"ЗАБРАТЬ",day:"День",claimed:"ПОЛУЧЕНО",comeTomorrow:"Приходи завтра!",dailyStreak:"Серия",dailySub:"Заходи каждый день — награды растут!",dailyNext:"Следующий бонус через",dailyClaimNow:"Забери награду дня!",dailyBig:"СУПЕРПРИЗ",adSpeedTitle:"СМОТРИ РЕКЛАМУ И",adSpeedSub:"ПОЛУЧИ 2X СКОРОСТЬ",adSizeTitle:"СМОТРИ РЕКЛАМУ И",adSizeSub:"ПОЛУЧИ 2X РАЗМЕР",adReviveTitle:"СМОТРЕТЬ РЕКЛАМУ И",adReviveSub:"ВОЗРОДИТЬСЯ СО СЧЁТОМ",rewardSpeed:"Награда получена: 2X скорость на 60 сек!",rewardSize:"Награда получена: размер удвоен!",rewardRevive:"Награда получена: ты возродился!",adNotReady:"Реклама сейчас недоступна, попробуй позже",adNoReward:"Награда не получена — реклама не досмотрена",adWarnTitle:"РЕКЛАМНАЯ ПАУЗА",adWarnText:"Реклама начнётся через",paused:"ПАУЗА",pausedText:"Вернись в игру, чтобы продолжить",youDied:"ТЫ УМЕР!",eatenBy:"Тебя съел",restart:"ПЕРЕЗАПУСК",restartIn:"Игра перезапустится через",lbLoading:"Загрузка…",lbEmpty:"Пока нет результатов. Стань первым!",lbLogin:"ВОЙТИ",lbLoginHint:"Чтобы твой рекорд сохранился и попал в таблицу лидеров, нужно войти в аккаунт. Без входа результат виден только тебе.",lbError:"Таблица лидеров недоступна",lbRetry:"ОБНОВИТЬ",you:"Ты",hintMove:"Двигайся и ешь шарики!",hintMobile:"Веди джойстик, чтобы двигаться",ateSomeone:"Съеден игрок",coinsPlus:"монет",boostSpeed:"2X Скорость",boostSize:"2X Размер",boostShield:"Щит",boostMagnet:"Магнит",modeClassic:"Классика",modeRing:"Кольцо",modeBlitz:"Блиц",modeDesc_classic:"Бесконечная арена: ешь, расти, правь",modeDesc_ring:"Зона сужается. Останься последним!",modeDesc_blitz:"3 минуты. Ешь золотые шары и обгони всех!",ringHint:"Держись внутри круга — снаружи буря!",blitzHint:"Золотой шар — это сразу 500 очков!",timeWord:"Время",ringWait:"Сужение через",ringShrink:"Зона сужается",ringFinal:"Финал",aliveWord:"Живых",stormWarn:"Ты в буре! Вернись в круг!",stormKilled:"Тебя поглотила буря",blitzPenalty:"−50% очков",resWin:"ПОБЕДА!",resOut:"ТЫ ВЫБЫЛ",resTime:"ВРЕМЯ ВЫШЛО",placeWord:"МЕСТО",ofTotal:"из {n}",bestPlace:"Лучшее место",rewardWord:"НАГРАДА",playAgain:"ЕЩЁ РАЗ",toMenu:"МЕНЮ",exitToMenu:"ВЫЙТИ В МЕНЮ",shop:"Магазин",shopTitle:"МАГАЗИН",tabSkins:"Скины",tabTrails:"Трейлы",tabEffects:"Эффекты",forAds:"ЗА РЕКЛАМУ",itemBought:"Куплено!",itemUnlocked:"Открыто и надето!",adProgress:"Просмотров рекламы:",upgrades:"Прокачка",upgradesShort:"Прокачка",upgradesTitle:"ПРОКАЧКА",upAd:"РЕКЛАМА",upMax:"МАКСИМУМ",upDone:"Улучшено!",rewardUpgrade:"Награда получена: +1 уровень улучшения!",lvlShort:"Ур.",secShort:"с",up_speed:"Скорость",up_speed_d:"Быстрее катишься по арене",up_start:"Стартовый размер",up_start_d:"Каждый забег начинаешь крупнее",up_bite:"Хватка",up_bite_d:"Глотаешь шарики издалека",up_growth:"Рост",up_growth_d:"Больше очков за еду и добычу",up_coins:"Доход",up_coins_d:"Больше монет за всё",up_shield:"Щит",up_shield_d:"Дольше неуязвим после появления",trail_none:"Без трейла",trail_bubbles:"Пузыри",trail_smoke:"Дымок",trail_leaves:"Листва",trail_confetti:"Конфетти",trail_stars:"Звёзды",trail_fire:"Пламя",trail_ice:"Лёд",trail_neon:"Неон",trail_rainbow:"Радуга",trail_galaxy:"Галактика",effect_none:"Без эффекта",effect_glow:"Сияние",effect_orbit:"Орбита",effect_pulse:"Пульс",effect_sparkle:"Искры",effect_halo:"Нимб",effect_flames:"Огненный круг",effect_snow:"Метель",effect_zap:"Энергия",effect_prism:"Призма",effect_vortex:"Вихрь"},en:{loading:"Loading…",tips:["Eat the balls and grow!","Eat smaller players — but run from the big ones!","Eating players gives you coins.","Unlock new skins in the shop.","Spin the lucky wheel every 3 minutes.","Collect gifts — they pile up while you play.","In Ring mode, stay inside the circle.","In Blitz, a golden ball is worth 500 points."],play:"PLAY",settings:"Settings",close:"CLOSE",back:"Back",nickPlaceholder:"Your nickname",nickLabel:"Your nickname",tagline:"Eat. Grow. Rule the arena.",adWatch:"for watching an ad",newRecord:"NEW RECORD",scoreWord:"SCORE",bestWord:"Best",skins:"Skins",gifts:"Gifts",luckySpin:"Wheel",luckySpinFull:"LUCKY SPIN",dailyBonus:"Bonus",dailyBonusFull:"DAILY BONUS",auto:"Auto",leaders:"Leaders",leadersTitle:"LEADERBOARD",sound:"Sound",music:"Music",quality:"Quality",qLow:"Low",qMed:"Medium",qHigh:"High",language:"Language",mouseControl:"Mouse control",controlsTitle:"Controls",controlsText:`Mouse: hold the left button to drive to the cursor
Keys: WASD or arrow keys
Camera: hold right mouse button and drag
Zoom: mouse wheel
On phone: joystick on the left`,hintMouse:"Hold the left mouse button to move",getCoins:"HOW TO GET COINS",waySpin:"Lucky spin",wayDaily:"Daily bonus",wayGifts:"Gifts",wayEat:"Eat other players — every one of them drops coins!",selected:"SELECTED",select:"SELECT",buy:"BUY",notEnoughCoins:"Not enough coins!",skinBought:"Skin unlocked!",nextSpin:"Next spin",spinNow:"SPIN",spinForCoins:"SPIN FOR 25",spinReady:"Ready!",youWon:"YOU WON!",giftReady:"READY",claim:"CLAIM",day:"Day",claimed:"CLAIMED",comeTomorrow:"Come back tomorrow!",dailyStreak:"Streak",dailySub:"Come back every day — the rewards grow!",dailyNext:"Next bonus in",dailyClaimNow:"Claim today’s reward!",dailyBig:"MEGA PRIZE",adSpeedTitle:"WATCH AN AD AND",adSpeedSub:"GET 2X SPEED",adSizeTitle:"WATCH AN AD AND",adSizeSub:"GET 2X SIZE",adReviveTitle:"WATCH AN AD AND",adReviveSub:"REVIVE WITH YOUR SCORE",rewardSpeed:"Reward granted: 2X speed for 60 sec!",rewardSize:"Reward granted: size doubled!",rewardRevive:"Reward granted: you are back!",adNotReady:"Ads are unavailable right now, try later",adNoReward:"No reward — the ad was not watched to the end",adWarnTitle:"AD BREAK",adWarnText:"The ad starts in",paused:"PAUSED",pausedText:"Come back to the game to continue",youDied:"YOU DIED!",eatenBy:"You were eaten by",restart:"RESTART",restartIn:"Restarting in",lbLoading:"Loading…",lbEmpty:"No results yet. Be the first!",lbLogin:"SIGN IN",lbLoginHint:"Sign in so your record is saved and appears in the leaderboard. Without signing in, your result stays visible only to you.",lbError:"Leaderboard is unavailable",lbRetry:"RETRY",you:"You",hintMove:"Move around and eat the balls!",hintMobile:"Drag the joystick to move",ateSomeone:"Player eaten",coinsPlus:"coins",boostSpeed:"2X Speed",boostSize:"2X Size",boostShield:"Shield",boostMagnet:"Magnet",modeClassic:"Classic",modeRing:"Ring",modeBlitz:"Blitz",modeDesc_classic:"Endless arena: eat, grow, rule",modeDesc_ring:"The zone shrinks. Be the last one standing!",modeDesc_blitz:"3 minutes. Eat golden balls and beat everyone!",ringHint:"Stay inside the circle — the storm is outside!",blitzHint:"A golden ball is worth 500 points!",timeWord:"Time",ringWait:"Shrinks in",ringShrink:"Zone shrinking",ringFinal:"Final",aliveWord:"Alive",stormWarn:"You are in the storm! Get back in the circle!",stormKilled:"The storm swallowed you",blitzPenalty:"−50% score",resWin:"VICTORY!",resOut:"YOU ARE OUT",resTime:"TIME'S UP",placeWord:"PLACE",ofTotal:"of {n}",bestPlace:"Best place",rewardWord:"REWARD",playAgain:"PLAY AGAIN",toMenu:"MENU",exitToMenu:"EXIT TO MENU",shop:"Shop",shopTitle:"SHOP",tabSkins:"Skins",tabTrails:"Trails",tabEffects:"Effects",forAds:"FOR ADS",itemBought:"Purchased!",itemUnlocked:"Unlocked and equipped!",adProgress:"Ads watched:",upgrades:"Upgrades",upgradesShort:"Upgrade",upgradesTitle:"UPGRADES",upAd:"WATCH AD",upMax:"MAX",upDone:"Upgraded!",rewardUpgrade:"Reward received: +1 upgrade level!",lvlShort:"Lv.",secShort:"s",up_speed:"Speed",up_speed_d:"Roll faster across the arena",up_start:"Start size",up_start_d:"Start every run bigger",up_bite:"Reach",up_bite_d:"Grab balls from further away",up_growth:"Growth",up_growth_d:"More score from food and prey",up_coins:"Income",up_coins_d:"More coins from everything",up_shield:"Shield",up_shield_d:"Longer protection after spawning",trail_none:"No trail",trail_bubbles:"Bubbles",trail_smoke:"Smoke",trail_leaves:"Leaves",trail_confetti:"Confetti",trail_stars:"Stars",trail_fire:"Fire",trail_ice:"Ice",trail_neon:"Neon",trail_rainbow:"Rainbow",trail_galaxy:"Galaxy",effect_none:"No effect",effect_glow:"Glow",effect_orbit:"Orbit",effect_pulse:"Pulse",effect_sparkle:"Sparkle",effect_halo:"Halo",effect_flames:"Flame ring",effect_snow:"Blizzard",effect_zap:"Energy",effect_prism:"Prism",effect_vortex:"Vortex"},tr:{loading:"Yükleniyor…",tips:["Topları ye ve büyü!","Küçük oyuncuları ye — büyüklerden kaç!","Oyuncuları yemek sana altın kazandırır.","Mağazadan yeni kostümler aç.","Her 3 dakikada bir şans çarkını çevir.","Hediyeleri topla — sen oynarken birikirler.","Halka modunda çemberin içinde kal.","Blitz modunda altın top 500 puan verir."],play:"OYNA",settings:"Ayarlar",close:"KAPAT",back:"Geri",nickPlaceholder:"Takma adın",nickLabel:"Takma adın",tagline:"Ye. Büyü. Arenaya hükmet.",adWatch:"reklam izleyerek",newRecord:"YENİ REKOR",scoreWord:"PUAN",bestWord:"Rekor",skins:"Kostüm",gifts:"Hediye",luckySpin:"Çark",luckySpinFull:"ŞANS ÇARKI",dailyBonus:"Bonus",dailyBonusFull:"GÜNLÜK BONUS",auto:"Oto",leaders:"Liderler",leadersTitle:"LİDER TABLOSU",sound:"Ses",music:"Müzik",quality:"Kalite",qLow:"Düşük",qMed:"Orta",qHigh:"Yüksek",language:"Dil",mouseControl:"Fare kontrolü",controlsTitle:"Kontroller",controlsText:`Fare: sol tuşu basılı tut, top imlece gider
Tuşlar: WASD veya yön tuşları
Kamera: sağ tuşu basılı tutup sürükle
Yakınlaştırma: fare tekerleği
Telefonda: soldaki joystick`,hintMouse:"Hareket için sol fare tuşunu basılı tut",getCoins:"ALTIN NASIL KAZANILIR",waySpin:"Şans çarkı",wayDaily:"Günlük bonus",wayGifts:"Hediyeler",wayEat:"Diğer oyuncuları ye — her biri altın bırakır!",selected:"SEÇİLDİ",select:"SEÇ",buy:"SATIN AL",notEnoughCoins:"Yeterli altın yok!",skinBought:"Kostüm açıldı!",nextSpin:"Sonraki çevirme",spinNow:"ÇEVİR",spinForCoins:"25 ALTINA ÇEVİR",spinReady:"Hazır!",youWon:"KAZANDIN!",giftReady:"HAZIR",claim:"AL",day:"Gün",claimed:"ALINDI",comeTomorrow:"Yarın tekrar gel!",dailyStreak:"Seri",dailySub:"Her gün gel — ödüller büyüsün!",dailyNext:"Sonraki bonusa",dailyClaimNow:"Günün ödülünü al!",dailyBig:"SÜPER ÖDÜL",adSpeedTitle:"REKLAM İZLE VE",adSpeedSub:"2X HIZ KAZAN",adSizeTitle:"REKLAM İZLE VE",adSizeSub:"2X BOYUT KAZAN",adReviveTitle:"REKLAM İZLE VE",adReviveSub:"SKORUNLA DİRİL",rewardSpeed:"Ödül alındı: 60 saniye 2X hız!",rewardSize:"Ödül alındı: boyut iki katına çıktı!",rewardRevive:"Ödül alındı: geri döndün!",adNotReady:"Reklam şu anda kullanılamıyor, sonra dene",adNoReward:"Ödül yok — reklam sonuna kadar izlenmedi",adWarnTitle:"REKLAM ARASI",adWarnText:"Reklam başlıyor",paused:"DURAKLATILDI",pausedText:"Devam etmek için oyuna dön",youDied:"ÖLDÜN!",eatenBy:"Seni yiyen",restart:"YENİDEN BAŞLAT",restartIn:"Yeniden başlama",lbLoading:"Yükleniyor…",lbEmpty:"Henüz sonuç yok. İlk sen ol!",lbLogin:"GİRİŞ YAP",lbLoginHint:"Rekorunun kaydedilmesi ve lider tablosunda görünmesi için giriş yapman gerekir. Giriş yapmazsan sonucun yalnızca sana görünür.",lbError:"Lider tablosu kullanılamıyor",lbRetry:"YENİLE",you:"Sen",hintMove:"Hareket et ve topları ye!",hintMobile:"Hareket için joystick’i sürükle",ateSomeone:"Oyuncu yendi",coinsPlus:"altın",boostSpeed:"2X Hız",boostSize:"2X Boyut",boostShield:"Kalkan",boostMagnet:"Mıknatıs",modeClassic:"Klasik",modeRing:"Halka",modeBlitz:"Blitz",modeDesc_classic:"Sonsuz arena: ye, büyü, hükmet",modeDesc_ring:"Alan daralıyor. Ayakta kalan son ol!",modeDesc_blitz:"3 dakika. Altın topları ye, herkesi geç!",ringHint:"Çemberin içinde kal — dışarıda fırtına var!",blitzHint:"Altın top tam 500 puan verir!",timeWord:"Süre",ringWait:"Daralmaya kalan",ringShrink:"Alan daralıyor",ringFinal:"Final",aliveWord:"Hayatta",stormWarn:"Fırtınadasın! Çembere geri dön!",stormKilled:"Fırtına seni yuttu",blitzPenalty:"Puanın −%50",resWin:"ZAFER!",resOut:"ELENDİN",resTime:"SÜRE DOLDU",placeWord:"SIRA",ofTotal:"{n} oyuncu içinde",bestPlace:"En iyi sıra",rewardWord:"ÖDÜL",playAgain:"TEKRAR",toMenu:"MENÜ",exitToMenu:"MENÜYE DÖN",shop:"Mağaza",shopTitle:"MAĞAZA",tabSkins:"Kostümler",tabTrails:"İzler",tabEffects:"Efektler",forAds:"REKLAM İLE",itemBought:"Satın alındı!",itemUnlocked:"Açıldı ve kuşanıldı!",adProgress:"İzlenen reklam:",upgrades:"Geliştirme",upgradesShort:"Geliştir",upgradesTitle:"GELİŞTİRMELER",upAd:"REKLAM",upMax:"MAKS",upDone:"Geliştirildi!",rewardUpgrade:"Ödül alındı: +1 geliştirme seviyesi!",lvlShort:"Sv.",secShort:"sn",up_speed:"Hız",up_speed_d:"Arenada daha hızlı yuvarlan",up_start:"Başlangıç boyu",up_start_d:"Her oyuna daha büyük başla",up_bite:"Kapma",up_bite_d:"Topları daha uzaktan kap",up_growth:"Büyüme",up_growth_d:"Yemek ve avdan daha çok puan",up_coins:"Gelir",up_coins_d:"Her şeyden daha çok altın",up_shield:"Kalkan",up_shield_d:"Doğunca daha uzun koruma",trail_none:"İz yok",trail_bubbles:"Baloncuk",trail_smoke:"Duman",trail_leaves:"Yapraklar",trail_confetti:"Konfeti",trail_stars:"Yıldızlar",trail_fire:"Ateş",trail_ice:"Buz",trail_neon:"Neon",trail_rainbow:"Gökkuşağı",trail_galaxy:"Galaksi",effect_none:"Efekt yok",effect_glow:"Parıltı",effect_orbit:"Yörünge",effect_pulse:"Nabız",effect_sparkle:"Kıvılcım",effect_halo:"Hale",effect_flames:"Ateş halkası",effect_snow:"Kar fırtınası",effect_zap:"Enerji",effect_prism:"Prizma",effect_vortex:"Girdap"}},Dr="ru",ed=["ru","en","tr"];let ns=Dr;const Wa=new Set;function Wl(i,t=Dr){if(!i)return t;const e=String(i).toLowerCase().split(/[-_]/)[0];return ed.includes(e)?e:t}function ke(){return ns}function Xl(i){const t=Wl(i);if(t===ns){Xa();return}ns=t,document.documentElement.setAttribute("lang",ns),Xa(),Wa.forEach(e=>{try{e(ns)}catch{}})}function nd(i){return Wa.add(i),()=>Wa.delete(i)}function ct(i,t){let n=(ta[ns]||ta[Dr])[i];if(n===void 0&&(n=ta[Dr][i]),n===void 0)return i;if(Array.isArray(n))return n;if(t)for(const s in t)n=n.split("{"+s+"}").join(t[s]);return n}function Xa(i=document){i.querySelectorAll("[data-i18n]").forEach(t=>{const e=t.getAttribute("data-i18n"),n=ct(e);typeof n=="string"&&(t.textContent=n)}),i.querySelectorAll("[data-i18n-ph]").forEach(t=>{t.setAttribute("placeholder",ct(t.getAttribute("data-i18n-ph")))})}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ho="169",id=0,wc=1,sd=2,ql=1,Yl=2,Bn=3,ni=0,Ke=1,Ve=2,Qn=0,ss=1,qa=2,bc=3,Ec=4,rd=5,yi=100,ad=101,od=102,cd=103,ld=104,hd=200,dd=201,ud=202,fd=203,Ya=204,$a=205,pd=206,md=207,gd=208,_d=209,xd=210,vd=211,Md=212,yd=213,Sd=214,Ka=0,ja=1,Za=2,os=3,Ja=4,Qa=5,to=6,eo=7,Xr=0,wd=1,bd=2,ti=0,Ed=1,Ad=2,Td=3,Rd=4,Cd=5,Pd=6,Ld=7,$l=300,cs=301,ls=302,no=303,io=304,qr=306,hs=1e3,wi=1001,so=1002,en=1003,Id=1004,Xs=1005,Sn=1006,ea=1007,bi=1008,Wn=1009,Kl=1010,jl=1011,ks=1012,Vo=1013,Ai=1014,Ln=1015,Bs=1016,Wo=1017,Xo=1018,ds=1020,Zl=35902,Jl=1021,Ql=1022,wn=1023,th=1024,eh=1025,rs=1026,us=1027,qo=1028,Yo=1029,nh=1030,$o=1031,Ko=1033,br=33776,Er=33777,Ar=33778,Tr=33779,ro=35840,ao=35841,oo=35842,co=35843,lo=36196,ho=37492,uo=37496,fo=37808,po=37809,mo=37810,go=37811,_o=37812,xo=37813,vo=37814,Mo=37815,yo=37816,So=37817,wo=37818,bo=37819,Eo=37820,Ao=37821,Rr=36492,To=36494,Ro=36495,ih=36283,Co=36284,Po=36285,Lo=36286,Dd=3200,Ud=3201,jo=0,Nd=1,Jn="",De="srgb",ri="srgb-linear",Zo="display-p3",Yr="display-p3-linear",Ur="linear",Me="srgb",Nr="rec709",Fr="p3",Di=7680,Ac=519,Fd=512,Od=513,kd=514,sh=515,zd=516,Bd=517,Gd=518,Hd=519,Io=35044,zs=35048,Tc="300 es",Hn=2e3,Or=2001;class gs{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const Ge=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],na=Math.PI/180,Do=180/Math.PI;function ei(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ge[i&255]+Ge[i>>8&255]+Ge[i>>16&255]+Ge[i>>24&255]+"-"+Ge[t&255]+Ge[t>>8&255]+"-"+Ge[t>>16&15|64]+Ge[t>>24&255]+"-"+Ge[e&63|128]+Ge[e>>8&255]+"-"+Ge[e>>16&255]+Ge[e>>24&255]+Ge[n&255]+Ge[n>>8&255]+Ge[n>>16&255]+Ge[n>>24&255]).toLowerCase()}function tn(i,t,e){return Math.max(t,Math.min(e,i))}function Vd(i,t){return(i%t+t)%t}function ia(i,t,e){return(1-e)*i+e*t}function Cn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ge(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class Bt{constructor(t=0,e=0){Bt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(tn(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Yt{constructor(t,e,n,s,r,a,o,c,l){Yt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,l)}set(t,e,n,s,r,a,o,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],d=n[7],u=n[2],f=n[5],g=n[8],_=s[0],m=s[3],p=s[6],M=s[1],x=s[4],S=s[7],C=s[2],y=s[5],A=s[8];return r[0]=a*_+o*M+c*C,r[3]=a*m+o*x+c*y,r[6]=a*p+o*S+c*A,r[1]=l*_+h*M+d*C,r[4]=l*m+h*x+d*y,r[7]=l*p+h*S+d*A,r[2]=u*_+f*M+g*C,r[5]=u*m+f*x+g*y,r[8]=u*p+f*S+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*o*l-n*r*h+n*o*c+s*r*l-s*a*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],d=h*a-o*l,u=o*c-h*r,f=l*r-a*c,g=e*d+n*u+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=d*_,t[1]=(s*l-h*n)*_,t[2]=(o*n-s*a)*_,t[3]=u*_,t[4]=(h*e-s*c)*_,t[5]=(s*r-o*e)*_,t[6]=f*_,t[7]=(n*c-l*e)*_,t[8]=(a*e-n*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+t,-s*l,s*c,-s*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(sa.makeScale(t,e)),this}rotate(t){return this.premultiply(sa.makeRotation(-t)),this}translate(t,e){return this.premultiply(sa.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const sa=new Yt;function rh(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function kr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Wd(){const i=kr("canvas");return i.style.display="block",i}const Rc={};function Cr(i){i in Rc||(Rc[i]=!0,console.warn(i))}function Xd(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function qd(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Yd(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Cc=new Yt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Pc=new Yt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),ys={[ri]:{transfer:Ur,primaries:Nr,luminanceCoefficients:[.2126,.7152,.0722],toReference:i=>i,fromReference:i=>i},[De]:{transfer:Me,primaries:Nr,luminanceCoefficients:[.2126,.7152,.0722],toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Yr]:{transfer:Ur,primaries:Fr,luminanceCoefficients:[.2289,.6917,.0793],toReference:i=>i.applyMatrix3(Pc),fromReference:i=>i.applyMatrix3(Cc)},[Zo]:{transfer:Me,primaries:Fr,luminanceCoefficients:[.2289,.6917,.0793],toReference:i=>i.convertSRGBToLinear().applyMatrix3(Pc),fromReference:i=>i.applyMatrix3(Cc).convertLinearToSRGB()}},$d=new Set([ri,Yr]),de={enabled:!0,_workingColorSpace:ri,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!$d.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;const n=ys[t].toReference,s=ys[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return ys[i].primaries},getTransfer:function(i){return i===Jn?Ur:ys[i].transfer},getLuminanceCoefficients:function(i,t=this._workingColorSpace){return i.fromArray(ys[t].luminanceCoefficients)}};function as(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ra(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Ui;class Kd{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement=="undefined")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Ui===void 0&&(Ui=kr("canvas")),Ui.width=t.width,Ui.height=t.height;const n=Ui.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Ui}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement!="undefined"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&t instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&t instanceof ImageBitmap){const e=kr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=as(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(as(e[n]/255)*255):e[n]=as(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let jd=0;class ah{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:jd++}),this.uuid=ei(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(aa(s[a].image)):r.push(aa(s[a]))}else r=aa(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function aa(i){return typeof HTMLImageElement!="undefined"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&i instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&i instanceof ImageBitmap?Kd.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Zd=0;class We extends gs{constructor(t=We.DEFAULT_IMAGE,e=We.DEFAULT_MAPPING,n=wi,s=wi,r=Sn,a=bi,o=wn,c=Wn,l=We.DEFAULT_ANISOTROPY,h=Jn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Zd++}),this.uuid=ei(),this.name="",this.source=new ah(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Bt(0,0),this.repeat=new Bt(1,1),this.center=new Bt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Yt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==$l)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case hs:t.x=t.x-Math.floor(t.x);break;case wi:t.x=t.x<0?0:1;break;case so:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case hs:t.y=t.y-Math.floor(t.y);break;case wi:t.y=t.y<0?0:1;break;case so:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}We.DEFAULT_IMAGE=null;We.DEFAULT_MAPPING=$l;We.DEFAULT_ANISOTROPY=1;class Re{constructor(t=0,e=0,n=0,s=1){Re.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,l=c[0],h=c[4],d=c[8],u=c[1],f=c[5],g=c[9],_=c[2],m=c[6],p=c[10];if(Math.abs(h-u)<.01&&Math.abs(d-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(l+1)/2,S=(f+1)/2,C=(p+1)/2,y=(h+u)/4,A=(d+_)/4,R=(g+m)/4;return x>S&&x>C?x<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(x),s=y/n,r=A/n):S>C?S<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(S),n=y/s,r=R/s):C<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(C),n=A/r,s=R/r),this.set(n,s,r,e),this}let M=Math.sqrt((m-g)*(m-g)+(d-_)*(d-_)+(u-h)*(u-h));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(d-_)/M,this.z=(u-h)/M,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Jd extends gs{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Re(0,0,t,e),this.scissorTest=!1,this.viewport=new Re(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Sn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new We(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new ah(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ti extends Jd{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class oh extends We{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=en,this.minFilter=en,this.wrapR=wi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Qd extends We{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=en,this.minFilter=en,this.wrapR=wi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Gs{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let c=n[s+0],l=n[s+1],h=n[s+2],d=n[s+3];const u=r[a+0],f=r[a+1],g=r[a+2],_=r[a+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=d;return}if(o===1){t[e+0]=u,t[e+1]=f,t[e+2]=g,t[e+3]=_;return}if(d!==_||c!==u||l!==f||h!==g){let m=1-o;const p=c*u+l*f+h*g+d*_,M=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const C=Math.sqrt(x),y=Math.atan2(C,p*M);m=Math.sin(m*y)/C,o=Math.sin(o*y)/C}const S=o*M;if(c=c*m+u*S,l=l*m+f*S,h=h*m+g*S,d=d*m+_*S,m===1-o){const C=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=C,l*=C,h*=C,d*=C}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],c=n[s+1],l=n[s+2],h=n[s+3],d=r[a],u=r[a+1],f=r[a+2],g=r[a+3];return t[e]=o*g+h*d+c*f-l*u,t[e+1]=c*g+h*u+l*d-o*f,t[e+2]=l*g+h*f+o*u-c*d,t[e+3]=h*g-o*d-c*u-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(s/2),d=o(r/2),u=c(n/2),f=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=u*h*d+l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d-u*f*g;break;case"YXZ":this._x=u*h*d+l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d+u*f*g;break;case"ZXY":this._x=u*h*d-l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d-u*f*g;break;case"ZYX":this._x=u*h*d-l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d+u*f*g;break;case"YZX":this._x=u*h*d+l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d-u*f*g;break;case"XZY":this._x=u*h*d-l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d+u*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],c=e[9],l=e[2],h=e[6],d=e[10],u=n+o+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(a-s)*f}else if(n>o&&n>d){const f=2*Math.sqrt(1+n-o-d);this._w=(h-c)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+l)/f}else if(o>d){const f=2*Math.sqrt(1+o-n-d);this._w=(r-l)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+d-n-o);this._w=(a-s)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(tn(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+a*o+s*l-r*c,this._y=s*h+a*c+r*o-n*l,this._z=r*h+a*l+n*c-s*o,this._w=a*h-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const c=1-o*o;if(c<=Number.EPSILON){const f=1-e;return this._w=f*a+e*this._w,this._x=f*n+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),d=Math.sin((1-e)*h)/l,u=Math.sin(e*h)/l;return this._w=a*d+this._w*u,this._x=n*d+this._x*u,this._y=s*d+this._y*u,this._z=r*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class U{constructor(t=0,e=0,n=0){U.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Lc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Lc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*s-o*n),h=2*(o*e-r*s),d=2*(r*n-a*e);return this.x=e+c*l+a*d-o*h,this.y=n+c*h+o*l-r*d,this.z=s+c*d+r*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return oa.copy(this).projectOnVector(t),this.sub(oa)}reflect(t){return this.sub(oa.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(tn(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const oa=new U,Lc=new Gs;class Pi{constructor(t=new U(1/0,1/0,1/0),e=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(mn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(mn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=mn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,mn):mn.fromBufferAttribute(r,a),mn.applyMatrix4(t.matrixWorld),this.expandByPoint(mn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),qs.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),qs.copy(n.boundingBox)),qs.applyMatrix4(t.matrixWorld),this.union(qs)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,mn),mn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ss),Ys.subVectors(this.max,Ss),Ni.subVectors(t.a,Ss),Fi.subVectors(t.b,Ss),Oi.subVectors(t.c,Ss),qn.subVectors(Fi,Ni),Yn.subVectors(Oi,Fi),li.subVectors(Ni,Oi);let e=[0,-qn.z,qn.y,0,-Yn.z,Yn.y,0,-li.z,li.y,qn.z,0,-qn.x,Yn.z,0,-Yn.x,li.z,0,-li.x,-qn.y,qn.x,0,-Yn.y,Yn.x,0,-li.y,li.x,0];return!ca(e,Ni,Fi,Oi,Ys)||(e=[1,0,0,0,1,0,0,0,1],!ca(e,Ni,Fi,Oi,Ys))?!1:($s.crossVectors(qn,Yn),e=[$s.x,$s.y,$s.z],ca(e,Ni,Fi,Oi,Ys))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,mn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(mn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Dn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Dn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Dn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Dn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Dn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Dn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Dn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Dn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Dn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Dn=[new U,new U,new U,new U,new U,new U,new U,new U],mn=new U,qs=new Pi,Ni=new U,Fi=new U,Oi=new U,qn=new U,Yn=new U,li=new U,Ss=new U,Ys=new U,$s=new U,hi=new U;function ca(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){hi.fromArray(i,r);const o=s.x*Math.abs(hi.x)+s.y*Math.abs(hi.y)+s.z*Math.abs(hi.z),c=t.dot(hi),l=e.dot(hi),h=n.dot(hi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const tu=new Pi,ws=new U,la=new U;class _s{constructor(t=new U,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):tu.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ws.subVectors(t,this.center);const e=ws.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(ws,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(la.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ws.copy(t.center).add(la)),this.expandByPoint(ws.copy(t.center).sub(la))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Un=new U,ha=new U,Ks=new U,$n=new U,da=new U,js=new U,ua=new U;class ch{constructor(t=new U,e=new U(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Un)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Un.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Un.copy(this.origin).addScaledVector(this.direction,e),Un.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){ha.copy(t).add(e).multiplyScalar(.5),Ks.copy(e).sub(t).normalize(),$n.copy(this.origin).sub(ha);const r=t.distanceTo(e)*.5,a=-this.direction.dot(Ks),o=$n.dot(this.direction),c=-$n.dot(Ks),l=$n.lengthSq(),h=Math.abs(1-a*a);let d,u,f,g;if(h>0)if(d=a*c-o,u=a*o-c,g=r*h,d>=0)if(u>=-g)if(u<=g){const _=1/h;d*=_,u*=_,f=d*(d+a*u+2*o)+u*(a*d+u+2*c)+l}else u=r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;else u=-r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;else u<=-g?(d=Math.max(0,-(-a*r+o)),u=d>0?-r:Math.min(Math.max(-r,-c),r),f=-d*d+u*(u+2*c)+l):u<=g?(d=0,u=Math.min(Math.max(-r,-c),r),f=u*(u+2*c)+l):(d=Math.max(0,-(a*r+o)),u=d>0?r:Math.min(Math.max(-r,-c),r),f=-d*d+u*(u+2*c)+l);else u=a>0?-r:r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(ha).addScaledVector(Ks,u),f}intersectSphere(t,e){Un.subVectors(t.center,this.origin);const n=Un.dot(this.direction),s=Un.dot(Un)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return l>=0?(n=(t.min.x-u.x)*l,s=(t.max.x-u.x)*l):(n=(t.max.x-u.x)*l,s=(t.min.x-u.x)*l),h>=0?(r=(t.min.y-u.y)*h,a=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,a=(t.min.y-u.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(t.min.z-u.z)*d,c=(t.max.z-u.z)*d):(o=(t.max.z-u.z)*d,c=(t.min.z-u.z)*d),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Un)!==null}intersectTriangle(t,e,n,s,r){da.subVectors(e,t),js.subVectors(n,t),ua.crossVectors(da,js);let a=this.direction.dot(ua),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;$n.subVectors(this.origin,t);const c=o*this.direction.dot(js.crossVectors($n,js));if(c<0)return null;const l=o*this.direction.dot(da.cross($n));if(l<0||c+l>a)return null;const h=-o*$n.dot(ua);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ie{constructor(t,e,n,s,r,a,o,c,l,h,d,u,f,g,_,m){ie.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,l,h,d,u,f,g,_,m)}set(t,e,n,s,r,a,o,c,l,h,d,u,f,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=d,p[14]=u,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ie().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/ki.setFromMatrixColumn(t,0).length(),r=1/ki.setFromMatrixColumn(t,1).length(),a=1/ki.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){const u=a*h,f=a*d,g=o*h,_=o*d;e[0]=c*h,e[4]=-c*d,e[8]=l,e[1]=f+g*l,e[5]=u-_*l,e[9]=-o*c,e[2]=_-u*l,e[6]=g+f*l,e[10]=a*c}else if(t.order==="YXZ"){const u=c*h,f=c*d,g=l*h,_=l*d;e[0]=u+_*o,e[4]=g*o-f,e[8]=a*l,e[1]=a*d,e[5]=a*h,e[9]=-o,e[2]=f*o-g,e[6]=_+u*o,e[10]=a*c}else if(t.order==="ZXY"){const u=c*h,f=c*d,g=l*h,_=l*d;e[0]=u-_*o,e[4]=-a*d,e[8]=g+f*o,e[1]=f+g*o,e[5]=a*h,e[9]=_-u*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const u=a*h,f=a*d,g=o*h,_=o*d;e[0]=c*h,e[4]=g*l-f,e[8]=u*l+_,e[1]=c*d,e[5]=_*l+u,e[9]=f*l-g,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const u=a*c,f=a*l,g=o*c,_=o*l;e[0]=c*h,e[4]=_-u*d,e[8]=g*d+f,e[1]=d,e[5]=a*h,e[9]=-o*h,e[2]=-l*h,e[6]=f*d+g,e[10]=u-_*d}else if(t.order==="XZY"){const u=a*c,f=a*l,g=o*c,_=o*l;e[0]=c*h,e[4]=-d,e[8]=l*h,e[1]=u*d+_,e[5]=a*h,e[9]=f*d-g,e[2]=g*d-f,e[6]=o*h,e[10]=_*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(eu,t,nu)}lookAt(t,e,n){const s=this.elements;return an.subVectors(t,e),an.lengthSq()===0&&(an.z=1),an.normalize(),Kn.crossVectors(n,an),Kn.lengthSq()===0&&(Math.abs(n.z)===1?an.x+=1e-4:an.z+=1e-4,an.normalize(),Kn.crossVectors(n,an)),Kn.normalize(),Zs.crossVectors(an,Kn),s[0]=Kn.x,s[4]=Zs.x,s[8]=an.x,s[1]=Kn.y,s[5]=Zs.y,s[9]=an.y,s[2]=Kn.z,s[6]=Zs.z,s[10]=an.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],d=n[5],u=n[9],f=n[13],g=n[2],_=n[6],m=n[10],p=n[14],M=n[3],x=n[7],S=n[11],C=n[15],y=s[0],A=s[4],R=s[8],N=s[12],v=s[1],b=s[5],F=s[9],z=s[13],H=s[2],tt=s[6],G=s[10],rt=s[14],W=s[3],_t=s[7],xt=s[11],Tt=s[15];return r[0]=a*y+o*v+c*H+l*W,r[4]=a*A+o*b+c*tt+l*_t,r[8]=a*R+o*F+c*G+l*xt,r[12]=a*N+o*z+c*rt+l*Tt,r[1]=h*y+d*v+u*H+f*W,r[5]=h*A+d*b+u*tt+f*_t,r[9]=h*R+d*F+u*G+f*xt,r[13]=h*N+d*z+u*rt+f*Tt,r[2]=g*y+_*v+m*H+p*W,r[6]=g*A+_*b+m*tt+p*_t,r[10]=g*R+_*F+m*G+p*xt,r[14]=g*N+_*z+m*rt+p*Tt,r[3]=M*y+x*v+S*H+C*W,r[7]=M*A+x*b+S*tt+C*_t,r[11]=M*R+x*F+S*G+C*xt,r[15]=M*N+x*z+S*rt+C*Tt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],c=t[9],l=t[13],h=t[2],d=t[6],u=t[10],f=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+r*c*d-s*l*d-r*o*u+n*l*u+s*o*f-n*c*f)+_*(+e*c*f-e*l*u+r*a*u-s*a*f+s*l*h-r*c*h)+m*(+e*l*d-e*o*f-r*a*d+n*a*f+r*o*h-n*l*h)+p*(-s*o*h-e*c*d+e*o*u+s*a*d-n*a*u+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],d=t[9],u=t[10],f=t[11],g=t[12],_=t[13],m=t[14],p=t[15],M=d*m*l-_*u*l+_*c*f-o*m*f-d*c*p+o*u*p,x=g*u*l-h*m*l-g*c*f+a*m*f+h*c*p-a*u*p,S=h*_*l-g*d*l+g*o*f-a*_*f-h*o*p+a*d*p,C=g*d*c-h*_*c-g*o*u+a*_*u+h*o*m-a*d*m,y=e*M+n*x+s*S+r*C;if(y===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/y;return t[0]=M*A,t[1]=(_*u*r-d*m*r-_*s*f+n*m*f+d*s*p-n*u*p)*A,t[2]=(o*m*r-_*c*r+_*s*l-n*m*l-o*s*p+n*c*p)*A,t[3]=(d*c*r-o*u*r-d*s*l+n*u*l+o*s*f-n*c*f)*A,t[4]=x*A,t[5]=(h*m*r-g*u*r+g*s*f-e*m*f-h*s*p+e*u*p)*A,t[6]=(g*c*r-a*m*r-g*s*l+e*m*l+a*s*p-e*c*p)*A,t[7]=(a*u*r-h*c*r+h*s*l-e*u*l-a*s*f+e*c*f)*A,t[8]=S*A,t[9]=(g*d*r-h*_*r-g*n*f+e*_*f+h*n*p-e*d*p)*A,t[10]=(a*_*r-g*o*r+g*n*l-e*_*l-a*n*p+e*o*p)*A,t[11]=(h*o*r-a*d*r-h*n*l+e*d*l+a*n*f-e*o*f)*A,t[12]=C*A,t[13]=(h*_*s-g*d*s+g*n*u-e*_*u-h*n*m+e*d*m)*A,t[14]=(g*o*s-a*_*s-g*n*c+e*_*c+a*n*m-e*o*m)*A,t[15]=(a*d*s-h*o*s+h*n*c-e*d*c-a*n*u+e*o*u)*A,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,c=t.z,l=r*a,h=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+n,h*c-s*a,0,l*c-s*o,h*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,l=r+r,h=a+a,d=o+o,u=r*l,f=r*h,g=r*d,_=a*h,m=a*d,p=o*d,M=c*l,x=c*h,S=c*d,C=n.x,y=n.y,A=n.z;return s[0]=(1-(_+p))*C,s[1]=(f+S)*C,s[2]=(g-x)*C,s[3]=0,s[4]=(f-S)*y,s[5]=(1-(u+p))*y,s[6]=(m+M)*y,s[7]=0,s[8]=(g+x)*A,s[9]=(m-M)*A,s[10]=(1-(u+_))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=ki.set(s[0],s[1],s[2]).length();const a=ki.set(s[4],s[5],s[6]).length(),o=ki.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],gn.copy(this);const l=1/r,h=1/a,d=1/o;return gn.elements[0]*=l,gn.elements[1]*=l,gn.elements[2]*=l,gn.elements[4]*=h,gn.elements[5]*=h,gn.elements[6]*=h,gn.elements[8]*=d,gn.elements[9]*=d,gn.elements[10]*=d,e.setFromRotationMatrix(gn),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=Hn){const c=this.elements,l=2*r/(e-t),h=2*r/(n-s),d=(e+t)/(e-t),u=(n+s)/(n-s);let f,g;if(o===Hn)f=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===Or)f=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=u,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=Hn){const c=this.elements,l=1/(e-t),h=1/(n-s),d=1/(a-r),u=(e+t)*l,f=(n+s)*h;let g,_;if(o===Hn)g=(a+r)*d,_=-2*d;else if(o===Or)g=r*d,_=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-u,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const ki=new U,gn=new ie,eu=new U(0,0,0),nu=new U(1,1,1),Kn=new U,Zs=new U,an=new U,Ic=new ie,Dc=new Gs;class bn{constructor(t=0,e=0,n=0,s=bn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],h=s[9],d=s[2],u=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(tn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-tn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(tn(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-tn(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(tn(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-tn(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Ic.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ic,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Dc.setFromEuler(this),this.setFromQuaternion(Dc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}bn.DEFAULT_ORDER="XYZ";class lh{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let iu=0;const Uc=new U,zi=new Gs,Nn=new ie,Js=new U,bs=new U,su=new U,ru=new Gs,Nc=new U(1,0,0),Fc=new U(0,1,0),Oc=new U(0,0,1),kc={type:"added"},au={type:"removed"},Bi={type:"childadded",child:null},fa={type:"childremoved",child:null};class jt extends gs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:iu++}),this.uuid=ei(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=jt.DEFAULT_UP.clone();const t=new U,e=new bn,n=new Gs,s=new U(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ie},normalMatrix:{value:new Yt}}),this.matrix=new ie,this.matrixWorld=new ie,this.matrixAutoUpdate=jt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=jt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new lh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return zi.setFromAxisAngle(t,e),this.quaternion.multiply(zi),this}rotateOnWorldAxis(t,e){return zi.setFromAxisAngle(t,e),this.quaternion.premultiply(zi),this}rotateX(t){return this.rotateOnAxis(Nc,t)}rotateY(t){return this.rotateOnAxis(Fc,t)}rotateZ(t){return this.rotateOnAxis(Oc,t)}translateOnAxis(t,e){return Uc.copy(t).applyQuaternion(this.quaternion),this.position.add(Uc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Nc,t)}translateY(t){return this.translateOnAxis(Fc,t)}translateZ(t){return this.translateOnAxis(Oc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Nn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Js.copy(t):Js.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),bs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Nn.lookAt(bs,Js,this.up):Nn.lookAt(Js,bs,this.up),this.quaternion.setFromRotationMatrix(Nn),s&&(Nn.extractRotation(s.matrixWorld),zi.setFromRotationMatrix(Nn),this.quaternion.premultiply(zi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(kc),Bi.child=t,this.dispatchEvent(Bi),Bi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(au),fa.child=t,this.dispatchEvent(fa),fa.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Nn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Nn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Nn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(kc),Bi.child=t,this.dispatchEvent(Bi),Bi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(bs,t,su),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(bs,ru,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const d=c[l];r(t.shapes,d)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(t.materials,this.material[c]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),d=a(t.shapes),u=a(t.skeletons),f=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}jt.DEFAULT_UP=new U(0,1,0);jt.DEFAULT_MATRIX_AUTO_UPDATE=!0;jt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const _n=new U,Fn=new U,pa=new U,On=new U,Gi=new U,Hi=new U,zc=new U,ma=new U,ga=new U,_a=new U,xa=new Re,va=new Re,Ma=new Re;class un{constructor(t=new U,e=new U,n=new U){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),_n.subVectors(t,e),s.cross(_n);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){_n.subVectors(s,e),Fn.subVectors(n,e),pa.subVectors(t,e);const a=_n.dot(_n),o=_n.dot(Fn),c=_n.dot(pa),l=Fn.dot(Fn),h=Fn.dot(pa),d=a*l-o*o;if(d===0)return r.set(0,0,0),null;const u=1/d,f=(l*c-o*h)*u,g=(a*h-o*c)*u;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,On)===null?!1:On.x>=0&&On.y>=0&&On.x+On.y<=1}static getInterpolation(t,e,n,s,r,a,o,c){return this.getBarycoord(t,e,n,s,On)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,On.x),c.addScaledVector(a,On.y),c.addScaledVector(o,On.z),c)}static getInterpolatedAttribute(t,e,n,s,r,a){return xa.setScalar(0),va.setScalar(0),Ma.setScalar(0),xa.fromBufferAttribute(t,e),va.fromBufferAttribute(t,n),Ma.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(xa,r.x),a.addScaledVector(va,r.y),a.addScaledVector(Ma,r.z),a}static isFrontFacing(t,e,n,s){return _n.subVectors(n,e),Fn.subVectors(t,e),_n.cross(Fn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return _n.subVectors(this.c,this.b),Fn.subVectors(this.a,this.b),_n.cross(Fn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return un.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return un.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return un.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return un.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return un.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;Gi.subVectors(s,n),Hi.subVectors(r,n),ma.subVectors(t,n);const c=Gi.dot(ma),l=Hi.dot(ma);if(c<=0&&l<=0)return e.copy(n);ga.subVectors(t,s);const h=Gi.dot(ga),d=Hi.dot(ga);if(h>=0&&d<=h)return e.copy(s);const u=c*d-h*l;if(u<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(n).addScaledVector(Gi,a);_a.subVectors(t,r);const f=Gi.dot(_a),g=Hi.dot(_a);if(g>=0&&f<=g)return e.copy(r);const _=f*l-c*g;if(_<=0&&l>=0&&g<=0)return o=l/(l-g),e.copy(n).addScaledVector(Hi,o);const m=h*g-f*d;if(m<=0&&d-h>=0&&f-g>=0)return zc.subVectors(r,s),o=(d-h)/(d-h+(f-g)),e.copy(s).addScaledVector(zc,o);const p=1/(m+_+u);return a=_*p,o=u*p,e.copy(n).addScaledVector(Gi,a).addScaledVector(Hi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const hh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},jn={h:0,s:0,l:0},Qs={h:0,s:0,l:0};function ya(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class yt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=De){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,de.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=de.workingColorSpace){return this.r=t,this.g=e,this.b=n,de.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=de.workingColorSpace){if(t=Vd(t,1),e=tn(e,0,1),n=tn(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=ya(a,r,t+1/3),this.g=ya(a,r,t),this.b=ya(a,r,t-1/3)}return de.toWorkingColorSpace(this,s),this}setStyle(t,e=De){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=De){const n=hh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=as(t.r),this.g=as(t.g),this.b=as(t.b),this}copyLinearToSRGB(t){return this.r=ra(t.r),this.g=ra(t.g),this.b=ra(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=De){return de.fromWorkingColorSpace(He.copy(this),t),Math.round(tn(He.r*255,0,255))*65536+Math.round(tn(He.g*255,0,255))*256+Math.round(tn(He.b*255,0,255))}getHexString(t=De){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=de.workingColorSpace){de.fromWorkingColorSpace(He.copy(this),e);const n=He.r,s=He.g,r=He.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const d=a-o;switch(l=h<=.5?d/(a+o):d/(2-a-o),a){case n:c=(s-r)/d+(s<r?6:0);break;case s:c=(r-n)/d+2;break;case r:c=(n-s)/d+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=de.workingColorSpace){return de.fromWorkingColorSpace(He.copy(this),e),t.r=He.r,t.g=He.g,t.b=He.b,t}getStyle(t=De){de.fromWorkingColorSpace(He.copy(this),t);const e=He.r,n=He.g,s=He.b;return t!==De?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(jn),this.setHSL(jn.h+t,jn.s+e,jn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(jn),t.getHSL(Qs);const n=ia(jn.h,Qs.h,e),s=ia(jn.s,Qs.s,e),r=ia(jn.l,Qs.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const He=new yt;yt.NAMES=hh;let ou=0;class ai extends gs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ou++}),this.uuid=ei(),this.name="",this.type="Material",this.blending=ss,this.side=ni,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ya,this.blendDst=$a,this.blendEquation=yi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new yt(0,0,0),this.blendAlpha=0,this.depthFunc=os,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ac,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Di,this.stencilZFail=Di,this.stencilZPass=Di,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ss&&(n.blending=this.blending),this.side!==ni&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ya&&(n.blendSrc=this.blendSrc),this.blendDst!==$a&&(n.blendDst=this.blendDst),this.blendEquation!==yi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==os&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ac&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Di&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Di&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Di&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class fn extends ai{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new yt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bn,this.combine=Xr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ie=new U,tr=new Bt;class Xe{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Io,this.updateRanges=[],this.gpuType=Ln,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)tr.fromBufferAttribute(this,e),tr.applyMatrix3(t),this.setXY(e,tr.x,tr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ie.fromBufferAttribute(this,e),Ie.applyMatrix3(t),this.setXYZ(e,Ie.x,Ie.y,Ie.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ie.fromBufferAttribute(this,e),Ie.applyMatrix4(t),this.setXYZ(e,Ie.x,Ie.y,Ie.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ie.fromBufferAttribute(this,e),Ie.applyNormalMatrix(t),this.setXYZ(e,Ie.x,Ie.y,Ie.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ie.fromBufferAttribute(this,e),Ie.transformDirection(t),this.setXYZ(e,Ie.x,Ie.y,Ie.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Cn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ge(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Cn(e,this.array)),e}setX(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Cn(e,this.array)),e}setY(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Cn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Cn(e,this.array)),e}setW(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array),s=ge(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array),s=ge(s,this.array),r=ge(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Io&&(t.usage=this.usage),t}}class dh extends Xe{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class uh extends Xe{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Se extends Xe{constructor(t,e,n){super(new Float32Array(t),e,n)}}let cu=0;const dn=new ie,Sa=new jt,Vi=new U,on=new Pi,Es=new Pi,Fe=new U;class Be extends gs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:cu++}),this.uuid=ei(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(rh(t)?uh:dh)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Yt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return dn.makeRotationFromQuaternion(t),this.applyMatrix4(dn),this}rotateX(t){return dn.makeRotationX(t),this.applyMatrix4(dn),this}rotateY(t){return dn.makeRotationY(t),this.applyMatrix4(dn),this}rotateZ(t){return dn.makeRotationZ(t),this.applyMatrix4(dn),this}translate(t,e,n){return dn.makeTranslation(t,e,n),this.applyMatrix4(dn),this}scale(t,e,n){return dn.makeScale(t,e,n),this.applyMatrix4(dn),this}lookAt(t){return Sa.lookAt(t),Sa.updateMatrix(),this.applyMatrix4(Sa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Vi).negate(),this.translate(Vi.x,Vi.y,Vi.z),this}setFromPoints(t){const e=[];for(let n=0,s=t.length;n<s;n++){const r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new Se(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Pi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];on.setFromBufferAttribute(r),this.morphTargetsRelative?(Fe.addVectors(this.boundingBox.min,on.min),this.boundingBox.expandByPoint(Fe),Fe.addVectors(this.boundingBox.max,on.max),this.boundingBox.expandByPoint(Fe)):(this.boundingBox.expandByPoint(on.min),this.boundingBox.expandByPoint(on.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new _s);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(t){const n=this.boundingSphere.center;if(on.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];Es.setFromBufferAttribute(o),this.morphTargetsRelative?(Fe.addVectors(on.min,Es.min),on.expandByPoint(Fe),Fe.addVectors(on.max,Es.max),on.expandByPoint(Fe)):(on.expandByPoint(Es.min),on.expandByPoint(Es.max))}on.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Fe.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Fe));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Fe.fromBufferAttribute(o,l),c&&(Vi.fromBufferAttribute(t,l),Fe.add(Vi)),s=Math.max(s,n.distanceToSquared(Fe))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Xe(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let R=0;R<n.count;R++)o[R]=new U,c[R]=new U;const l=new U,h=new U,d=new U,u=new Bt,f=new Bt,g=new Bt,_=new U,m=new U;function p(R,N,v){l.fromBufferAttribute(n,R),h.fromBufferAttribute(n,N),d.fromBufferAttribute(n,v),u.fromBufferAttribute(r,R),f.fromBufferAttribute(r,N),g.fromBufferAttribute(r,v),h.sub(l),d.sub(l),f.sub(u),g.sub(u);const b=1/(f.x*g.y-g.x*f.y);isFinite(b)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(b),m.copy(d).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(b),o[R].add(_),o[N].add(_),o[v].add(_),c[R].add(m),c[N].add(m),c[v].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:t.count}]);for(let R=0,N=M.length;R<N;++R){const v=M[R],b=v.start,F=v.count;for(let z=b,H=b+F;z<H;z+=3)p(t.getX(z+0),t.getX(z+1),t.getX(z+2))}const x=new U,S=new U,C=new U,y=new U;function A(R){C.fromBufferAttribute(s,R),y.copy(C);const N=o[R];x.copy(N),x.sub(C.multiplyScalar(C.dot(N))).normalize(),S.crossVectors(y,N);const b=S.dot(c[R])<0?-1:1;a.setXYZW(R,x.x,x.y,x.z,b)}for(let R=0,N=M.length;R<N;++R){const v=M[R],b=v.start,F=v.count;for(let z=b,H=b+F;z<H;z+=3)A(t.getX(z+0)),A(t.getX(z+1)),A(t.getX(z+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Xe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);const s=new U,r=new U,a=new U,o=new U,c=new U,l=new U,h=new U,d=new U;if(t)for(let u=0,f=t.count;u<f;u+=3){const g=t.getX(u+0),_=t.getX(u+1),m=t.getX(u+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),a.fromBufferAttribute(e,m),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),o.add(h),c.add(h),l.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let u=0,f=e.count;u<f;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),a.fromBufferAttribute(e,u+2),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Fe.fromBufferAttribute(t,e),Fe.normalize(),t.setXYZ(e,Fe.x,Fe.y,Fe.z)}toNonIndexed(){function t(o,c){const l=o.array,h=o.itemSize,d=o.normalized,u=new l.constructor(c.length*h);let f=0,g=0;for(let _=0,m=c.length;_<m;_++){o.isInterleavedBufferAttribute?f=c[_]*o.data.stride+o.offset:f=c[_]*h;for(let p=0;p<h;p++)u[g++]=l[f++]}return new Xe(u,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Be,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=t(c,n);e.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let h=0,d=l.length;h<d;h++){const u=l[h],f=t(u,n);c.push(f)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let d=0,u=l.length;d<u;d++){const f=l[d];h.push(f.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const r=t.morphAttributes;for(const l in r){const h=[],d=r[l];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const d=a[l];this.addGroup(d.start,d.count,d.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Bc=new ie,di=new ch,er=new _s,Gc=new U,nr=new U,ir=new U,sr=new U,wa=new U,rr=new U,Hc=new U,ar=new U;class K extends jt{constructor(t=new Be,e=new fn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){rr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=o[c],d=r[c];h!==0&&(wa.fromBufferAttribute(d,t),a?rr.addScaledVector(wa,h):rr.addScaledVector(wa.sub(e),h))}e.add(rr)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),er.copy(n.boundingSphere),er.applyMatrix4(r),di.copy(t.ray).recast(t.near),!(er.containsPoint(di.origin)===!1&&(di.intersectSphere(er,Gc)===null||di.origin.distanceToSquared(Gc)>(t.far-t.near)**2))&&(Bc.copy(r).invert(),di.copy(t.ray).applyMatrix4(Bc),!(n.boundingBox!==null&&di.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,di)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=u.length;g<_;g++){const m=u[g],p=a[m.materialIndex],M=Math.max(m.start,f.start),x=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let S=M,C=x;S<C;S+=3){const y=o.getX(S),A=o.getX(S+1),R=o.getX(S+2);s=or(this,p,t,n,l,h,d,y,A,R),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const M=o.getX(m),x=o.getX(m+1),S=o.getX(m+2);s=or(this,a,t,n,l,h,d,M,x,S),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,_=u.length;g<_;g++){const m=u[g],p=a[m.materialIndex],M=Math.max(m.start,f.start),x=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let S=M,C=x;S<C;S+=3){const y=S,A=S+1,R=S+2;s=or(this,p,t,n,l,h,d,y,A,R),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(c.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const M=m,x=m+1,S=m+2;s=or(this,a,t,n,l,h,d,M,x,S),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function lu(i,t,e,n,s,r,a,o){let c;if(t.side===Ke?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,t.side===ni,o),c===null)return null;ar.copy(o),ar.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(ar);return l<e.near||l>e.far?null:{distance:l,point:ar.clone(),object:i}}function or(i,t,e,n,s,r,a,o,c,l){i.getVertexPosition(o,nr),i.getVertexPosition(c,ir),i.getVertexPosition(l,sr);const h=lu(i,t,e,n,nr,ir,sr,Hc);if(h){const d=new U;un.getBarycoord(Hc,nr,ir,sr,d),s&&(h.uv=un.getInterpolatedAttribute(s,o,c,l,d,new Bt)),r&&(h.uv1=un.getInterpolatedAttribute(r,o,c,l,d,new Bt)),a&&(h.normal=un.getInterpolatedAttribute(a,o,c,l,d,new U),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:c,c:l,normal:new U,materialIndex:0};un.getNormal(nr,ir,sr,u.normal),h.face=u,h.barycoord=d}return h}class Wt extends Be{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],h=[],d=[];let u=0,f=0;g("z","y","x",-1,-1,n,e,t,a,r,0),g("z","y","x",1,-1,n,e,-t,a,r,1),g("x","z","y",1,1,t,n,e,s,a,2),g("x","z","y",1,-1,t,n,-e,s,a,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new Se(l,3)),this.setAttribute("normal",new Se(h,3)),this.setAttribute("uv",new Se(d,2));function g(_,m,p,M,x,S,C,y,A,R,N){const v=S/A,b=C/R,F=S/2,z=C/2,H=y/2,tt=A+1,G=R+1;let rt=0,W=0;const _t=new U;for(let xt=0;xt<G;xt++){const Tt=xt*b-z;for(let ae=0;ae<tt;ae++){const ue=ae*v-F;_t[_]=ue*M,_t[m]=Tt*x,_t[p]=H,l.push(_t.x,_t.y,_t.z),_t[_]=0,_t[m]=0,_t[p]=y>0?1:-1,h.push(_t.x,_t.y,_t.z),d.push(ae/A),d.push(1-xt/R),rt+=1}}for(let xt=0;xt<R;xt++)for(let Tt=0;Tt<A;Tt++){const ae=u+Tt+tt*xt,ue=u+Tt+tt*(xt+1),q=u+(Tt+1)+tt*(xt+1),it=u+(Tt+1)+tt*xt;c.push(ae,ue,it),c.push(ue,q,it),W+=6}o.addGroup(f,W,N),f+=W,u+=rt}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Wt(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function fs(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ye(i){const t={};for(let e=0;e<i.length;e++){const n=fs(i[e]);for(const s in n)t[s]=n[s]}return t}function hu(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function fh(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:de.workingColorSpace}const du={clone:fs,merge:Ye};var uu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,fu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ii extends ai{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=uu,this.fragmentShader=fu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=fs(t.uniforms),this.uniformsGroups=hu(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class ph extends jt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ie,this.projectionMatrix=new ie,this.projectionMatrixInverse=new ie,this.coordinateSystem=Hn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Zn=new U,Vc=new Bt,Wc=new Bt;class ln extends ph{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Do*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(na*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Do*2*Math.atan(Math.tan(na*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Zn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Zn.x,Zn.y).multiplyScalar(-t/Zn.z),Zn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Zn.x,Zn.y).multiplyScalar(-t/Zn.z)}getViewSize(t,e){return this.getViewBounds(t,Vc,Wc),e.subVectors(Wc,Vc)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(na*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Wi=-90,Xi=1;class pu extends jt{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new ln(Wi,Xi,t,e);s.layers=this.layers,this.add(s);const r=new ln(Wi,Xi,t,e);r.layers=this.layers,this.add(r);const a=new ln(Wi,Xi,t,e);a.layers=this.layers,this.add(a);const o=new ln(Wi,Xi,t,e);o.layers=this.layers,this.add(o);const c=new ln(Wi,Xi,t,e);c.layers=this.layers,this.add(c);const l=new ln(Wi,Xi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,c]=e;for(const l of e)this.remove(l);if(t===Hn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Or)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(d,u,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class mh extends We{constructor(t,e,n,s,r,a,o,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:cs,super(t,e,n,s,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class mu extends Ti{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new mh(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Sn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Wt(5,5,5),r=new ii({name:"CubemapFromEquirect",uniforms:fs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ke,blending:Qn});r.uniforms.tEquirect.value=e;const a=new K(s,r),o=e.minFilter;return e.minFilter===bi&&(e.minFilter=Sn),new pu(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}const ba=new U,gu=new U,_u=new Yt;class vi{constructor(t=new U(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=ba.subVectors(n,e).cross(gu.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(ba),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||_u.getNormalMatrix(t),s=this.coplanarPoint(ba).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ui=new _s,cr=new U;class Jo{constructor(t=new vi,e=new vi,n=new vi,s=new vi,r=new vi,a=new vi){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Hn){const n=this.planes,s=t.elements,r=s[0],a=s[1],o=s[2],c=s[3],l=s[4],h=s[5],d=s[6],u=s[7],f=s[8],g=s[9],_=s[10],m=s[11],p=s[12],M=s[13],x=s[14],S=s[15];if(n[0].setComponents(c-r,u-l,m-f,S-p).normalize(),n[1].setComponents(c+r,u+l,m+f,S+p).normalize(),n[2].setComponents(c+a,u+h,m+g,S+M).normalize(),n[3].setComponents(c-a,u-h,m-g,S-M).normalize(),n[4].setComponents(c-o,u-d,m-_,S-x).normalize(),e===Hn)n[5].setComponents(c+o,u+d,m+_,S+x).normalize();else if(e===Or)n[5].setComponents(o,d,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ui.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ui.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ui)}intersectsSprite(t){return ui.center.set(0,0,0),ui.radius=.7071067811865476,ui.applyMatrix4(t.matrixWorld),this.intersectsSphere(ui)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(cr.x=s.normal.x>0?t.max.x:t.min.x,cr.y=s.normal.y>0?t.max.y:t.min.y,cr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(cr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function gh(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function xu(i){const t=new WeakMap;function e(o,c){const l=o.array,h=o.usage,d=l.byteLength,u=i.createBuffer();i.bindBuffer(c,u),i.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,c,l){const h=c.array,d=c.updateRanges;if(i.bindBuffer(l,o),d.length===0)i.bufferSubData(l,0,h);else{d.sort((f,g)=>f.start-g.start);let u=0;for(let f=1;f<d.length;f++){const g=d[u],_=d[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++u,d[u]=_)}d.length=u+1;for(let f=0,g=d.length;f<g;f++){const _=d[f];i.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(i.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}class Vn extends Be{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),c=Math.floor(s),l=o+1,h=c+1,d=t/o,u=e/c,f=[],g=[],_=[],m=[];for(let p=0;p<h;p++){const M=p*u-a;for(let x=0;x<l;x++){const S=x*d-r;g.push(S,-M,0),_.push(0,0,1),m.push(x/o),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let M=0;M<o;M++){const x=M+l*p,S=M+l*(p+1),C=M+1+l*(p+1),y=M+1+l*p;f.push(x,S,y),f.push(S,C,y)}this.setIndex(f),this.setAttribute("position",new Se(g,3)),this.setAttribute("normal",new Se(_,3)),this.setAttribute("uv",new Se(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Vn(t.width,t.height,t.widthSegments,t.heightSegments)}}var vu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Mu=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,yu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Su=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,wu=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,bu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Eu=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Au=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Tu=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Ru=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Cu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Pu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Lu=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Iu=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Du=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Uu=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Nu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Fu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ou=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ku=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,zu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Bu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Gu=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Hu=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Vu=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Wu=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Xu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,qu=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Yu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,$u=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ku="gl_FragColor = linearToOutputTexel( gl_FragColor );",ju=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Zu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Ju=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Qu=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,tf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ef=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,nf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,sf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,rf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,af=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,of=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,cf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,hf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,df=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,uf=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,ff=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,pf=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,mf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,gf=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,_f=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,xf=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,vf=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Mf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,yf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Sf=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,wf=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,bf=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ef=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Af=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Tf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Rf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Cf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Pf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Lf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,If=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Df=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Uf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Nf=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Ff=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Of=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,kf=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,zf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Bf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Gf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Hf=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Vf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Wf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Xf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,qf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Yf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,$f=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Kf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,jf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Zf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Jf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Qf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,tp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ep=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,np=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,ip=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,sp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,rp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ap=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,op=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,cp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,lp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,hp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,dp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,up=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,fp=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,pp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,mp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,gp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,_p=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,xp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const vp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Mp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Sp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,bp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ep=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Ap=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Tp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Rp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Cp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Pp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Lp=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Ip=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Dp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Up=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Np=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Fp=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Op=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,kp=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zp=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Bp=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Gp=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Hp=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Vp=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Wp=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Xp=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,qp=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Yp=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,$p=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Kp=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,jp=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Zp=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Jp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Xt={alphahash_fragment:vu,alphahash_pars_fragment:Mu,alphamap_fragment:yu,alphamap_pars_fragment:Su,alphatest_fragment:wu,alphatest_pars_fragment:bu,aomap_fragment:Eu,aomap_pars_fragment:Au,batching_pars_vertex:Tu,batching_vertex:Ru,begin_vertex:Cu,beginnormal_vertex:Pu,bsdfs:Lu,iridescence_fragment:Iu,bumpmap_pars_fragment:Du,clipping_planes_fragment:Uu,clipping_planes_pars_fragment:Nu,clipping_planes_pars_vertex:Fu,clipping_planes_vertex:Ou,color_fragment:ku,color_pars_fragment:zu,color_pars_vertex:Bu,color_vertex:Gu,common:Hu,cube_uv_reflection_fragment:Vu,defaultnormal_vertex:Wu,displacementmap_pars_vertex:Xu,displacementmap_vertex:qu,emissivemap_fragment:Yu,emissivemap_pars_fragment:$u,colorspace_fragment:Ku,colorspace_pars_fragment:ju,envmap_fragment:Zu,envmap_common_pars_fragment:Ju,envmap_pars_fragment:Qu,envmap_pars_vertex:tf,envmap_physical_pars_fragment:uf,envmap_vertex:ef,fog_vertex:nf,fog_pars_vertex:sf,fog_fragment:rf,fog_pars_fragment:af,gradientmap_pars_fragment:of,lightmap_pars_fragment:cf,lights_lambert_fragment:lf,lights_lambert_pars_fragment:hf,lights_pars_begin:df,lights_toon_fragment:ff,lights_toon_pars_fragment:pf,lights_phong_fragment:mf,lights_phong_pars_fragment:gf,lights_physical_fragment:_f,lights_physical_pars_fragment:xf,lights_fragment_begin:vf,lights_fragment_maps:Mf,lights_fragment_end:yf,logdepthbuf_fragment:Sf,logdepthbuf_pars_fragment:wf,logdepthbuf_pars_vertex:bf,logdepthbuf_vertex:Ef,map_fragment:Af,map_pars_fragment:Tf,map_particle_fragment:Rf,map_particle_pars_fragment:Cf,metalnessmap_fragment:Pf,metalnessmap_pars_fragment:Lf,morphinstance_vertex:If,morphcolor_vertex:Df,morphnormal_vertex:Uf,morphtarget_pars_vertex:Nf,morphtarget_vertex:Ff,normal_fragment_begin:Of,normal_fragment_maps:kf,normal_pars_fragment:zf,normal_pars_vertex:Bf,normal_vertex:Gf,normalmap_pars_fragment:Hf,clearcoat_normal_fragment_begin:Vf,clearcoat_normal_fragment_maps:Wf,clearcoat_pars_fragment:Xf,iridescence_pars_fragment:qf,opaque_fragment:Yf,packing:$f,premultiplied_alpha_fragment:Kf,project_vertex:jf,dithering_fragment:Zf,dithering_pars_fragment:Jf,roughnessmap_fragment:Qf,roughnessmap_pars_fragment:tp,shadowmap_pars_fragment:ep,shadowmap_pars_vertex:np,shadowmap_vertex:ip,shadowmask_pars_fragment:sp,skinbase_vertex:rp,skinning_pars_vertex:ap,skinning_vertex:op,skinnormal_vertex:cp,specularmap_fragment:lp,specularmap_pars_fragment:hp,tonemapping_fragment:dp,tonemapping_pars_fragment:up,transmission_fragment:fp,transmission_pars_fragment:pp,uv_pars_fragment:mp,uv_pars_vertex:gp,uv_vertex:_p,worldpos_vertex:xp,background_vert:vp,background_frag:Mp,backgroundCube_vert:yp,backgroundCube_frag:Sp,cube_vert:wp,cube_frag:bp,depth_vert:Ep,depth_frag:Ap,distanceRGBA_vert:Tp,distanceRGBA_frag:Rp,equirect_vert:Cp,equirect_frag:Pp,linedashed_vert:Lp,linedashed_frag:Ip,meshbasic_vert:Dp,meshbasic_frag:Up,meshlambert_vert:Np,meshlambert_frag:Fp,meshmatcap_vert:Op,meshmatcap_frag:kp,meshnormal_vert:zp,meshnormal_frag:Bp,meshphong_vert:Gp,meshphong_frag:Hp,meshphysical_vert:Vp,meshphysical_frag:Wp,meshtoon_vert:Xp,meshtoon_frag:qp,points_vert:Yp,points_frag:$p,shadow_vert:Kp,shadow_frag:jp,sprite_vert:Zp,sprite_frag:Jp},ht={common:{diffuse:{value:new yt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Yt}},envmap:{envMap:{value:null},envMapRotation:{value:new Yt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Yt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Yt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Yt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Yt},normalScale:{value:new Bt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Yt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Yt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Yt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Yt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new yt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new yt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0},uvTransform:{value:new Yt}},sprite:{diffuse:{value:new yt(16777215)},opacity:{value:1},center:{value:new Bt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}}},Rn={basic:{uniforms:Ye([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.fog]),vertexShader:Xt.meshbasic_vert,fragmentShader:Xt.meshbasic_frag},lambert:{uniforms:Ye([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,ht.lights,{emissive:{value:new yt(0)}}]),vertexShader:Xt.meshlambert_vert,fragmentShader:Xt.meshlambert_frag},phong:{uniforms:Ye([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,ht.lights,{emissive:{value:new yt(0)},specular:{value:new yt(1118481)},shininess:{value:30}}]),vertexShader:Xt.meshphong_vert,fragmentShader:Xt.meshphong_frag},standard:{uniforms:Ye([ht.common,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.roughnessmap,ht.metalnessmap,ht.fog,ht.lights,{emissive:{value:new yt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag},toon:{uniforms:Ye([ht.common,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.gradientmap,ht.fog,ht.lights,{emissive:{value:new yt(0)}}]),vertexShader:Xt.meshtoon_vert,fragmentShader:Xt.meshtoon_frag},matcap:{uniforms:Ye([ht.common,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,{matcap:{value:null}}]),vertexShader:Xt.meshmatcap_vert,fragmentShader:Xt.meshmatcap_frag},points:{uniforms:Ye([ht.points,ht.fog]),vertexShader:Xt.points_vert,fragmentShader:Xt.points_frag},dashed:{uniforms:Ye([ht.common,ht.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xt.linedashed_vert,fragmentShader:Xt.linedashed_frag},depth:{uniforms:Ye([ht.common,ht.displacementmap]),vertexShader:Xt.depth_vert,fragmentShader:Xt.depth_frag},normal:{uniforms:Ye([ht.common,ht.bumpmap,ht.normalmap,ht.displacementmap,{opacity:{value:1}}]),vertexShader:Xt.meshnormal_vert,fragmentShader:Xt.meshnormal_frag},sprite:{uniforms:Ye([ht.sprite,ht.fog]),vertexShader:Xt.sprite_vert,fragmentShader:Xt.sprite_frag},background:{uniforms:{uvTransform:{value:new Yt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xt.background_vert,fragmentShader:Xt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Yt}},vertexShader:Xt.backgroundCube_vert,fragmentShader:Xt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xt.cube_vert,fragmentShader:Xt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xt.equirect_vert,fragmentShader:Xt.equirect_frag},distanceRGBA:{uniforms:Ye([ht.common,ht.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xt.distanceRGBA_vert,fragmentShader:Xt.distanceRGBA_frag},shadow:{uniforms:Ye([ht.lights,ht.fog,{color:{value:new yt(0)},opacity:{value:1}}]),vertexShader:Xt.shadow_vert,fragmentShader:Xt.shadow_frag}};Rn.physical={uniforms:Ye([Rn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Yt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Yt},clearcoatNormalScale:{value:new Bt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Yt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Yt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Yt},sheen:{value:0},sheenColor:{value:new yt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Yt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Yt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Yt},transmissionSamplerSize:{value:new Bt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Yt},attenuationDistance:{value:0},attenuationColor:{value:new yt(0)},specularColor:{value:new yt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Yt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Yt},anisotropyVector:{value:new Bt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Yt}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag};const lr={r:0,b:0,g:0},fi=new bn,Qp=new ie;function tm(i,t,e,n,s,r,a){const o=new yt(0);let c=r===!0?0:1,l,h,d=null,u=0,f=null;function g(M){let x=M.isScene===!0?M.background:null;return x&&x.isTexture&&(x=(M.backgroundBlurriness>0?e:t).get(x)),x}function _(M){let x=!1;const S=g(M);S===null?p(o,c):S&&S.isColor&&(p(S,1),x=!0);const C=i.xr.getEnvironmentBlendMode();C==="additive"?n.buffers.color.setClear(0,0,0,1,a):C==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(M,x){const S=g(x);S&&(S.isCubeTexture||S.mapping===qr)?(h===void 0&&(h=new K(new Wt(1,1,1),new ii({name:"BackgroundCubeMaterial",uniforms:fs(Rn.backgroundCube.uniforms),vertexShader:Rn.backgroundCube.vertexShader,fragmentShader:Rn.backgroundCube.fragmentShader,side:Ke,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(C,y,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),fi.copy(x.backgroundRotation),fi.x*=-1,fi.y*=-1,fi.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(fi.y*=-1,fi.z*=-1),h.material.uniforms.envMap.value=S,h.material.uniforms.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Qp.makeRotationFromEuler(fi)),h.material.toneMapped=de.getTransfer(S.colorSpace)!==Me,(d!==S||u!==S.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,d=S,u=S.version,f=i.toneMapping),h.layers.enableAll(),M.unshift(h,h.geometry,h.material,0,0,null)):S&&S.isTexture&&(l===void 0&&(l=new K(new Vn(2,2),new ii({name:"BackgroundMaterial",uniforms:fs(Rn.background.uniforms),vertexShader:Rn.background.vertexShader,fragmentShader:Rn.background.fragmentShader,side:ni,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=S,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=de.getTransfer(S.colorSpace)!==Me,S.matrixAutoUpdate===!0&&S.updateMatrix(),l.material.uniforms.uvTransform.value.copy(S.matrix),(d!==S||u!==S.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,d=S,u=S.version,f=i.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function p(M,x){M.getRGB(lr,fh(i)),n.buffers.color.setClear(lr.r,lr.g,lr.b,x,a)}return{getClearColor:function(){return o},setClearColor:function(M,x=1){o.set(M),c=x,p(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(M){c=M,p(o,c)},render:_,addToRenderList:m}}function em(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null);let r=s,a=!1;function o(v,b,F,z,H){let tt=!1;const G=d(z,F,b);r!==G&&(r=G,l(r.object)),tt=f(v,z,F,H),tt&&g(v,z,F,H),H!==null&&t.update(H,i.ELEMENT_ARRAY_BUFFER),(tt||a)&&(a=!1,S(v,b,F,z),H!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(H).buffer))}function c(){return i.createVertexArray()}function l(v){return i.bindVertexArray(v)}function h(v){return i.deleteVertexArray(v)}function d(v,b,F){const z=F.wireframe===!0;let H=n[v.id];H===void 0&&(H={},n[v.id]=H);let tt=H[b.id];tt===void 0&&(tt={},H[b.id]=tt);let G=tt[z];return G===void 0&&(G=u(c()),tt[z]=G),G}function u(v){const b=[],F=[],z=[];for(let H=0;H<e;H++)b[H]=0,F[H]=0,z[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:b,enabledAttributes:F,attributeDivisors:z,object:v,attributes:{},index:null}}function f(v,b,F,z){const H=r.attributes,tt=b.attributes;let G=0;const rt=F.getAttributes();for(const W in rt)if(rt[W].location>=0){const xt=H[W];let Tt=tt[W];if(Tt===void 0&&(W==="instanceMatrix"&&v.instanceMatrix&&(Tt=v.instanceMatrix),W==="instanceColor"&&v.instanceColor&&(Tt=v.instanceColor)),xt===void 0||xt.attribute!==Tt||Tt&&xt.data!==Tt.data)return!0;G++}return r.attributesNum!==G||r.index!==z}function g(v,b,F,z){const H={},tt=b.attributes;let G=0;const rt=F.getAttributes();for(const W in rt)if(rt[W].location>=0){let xt=tt[W];xt===void 0&&(W==="instanceMatrix"&&v.instanceMatrix&&(xt=v.instanceMatrix),W==="instanceColor"&&v.instanceColor&&(xt=v.instanceColor));const Tt={};Tt.attribute=xt,xt&&xt.data&&(Tt.data=xt.data),H[W]=Tt,G++}r.attributes=H,r.attributesNum=G,r.index=z}function _(){const v=r.newAttributes;for(let b=0,F=v.length;b<F;b++)v[b]=0}function m(v){p(v,0)}function p(v,b){const F=r.newAttributes,z=r.enabledAttributes,H=r.attributeDivisors;F[v]=1,z[v]===0&&(i.enableVertexAttribArray(v),z[v]=1),H[v]!==b&&(i.vertexAttribDivisor(v,b),H[v]=b)}function M(){const v=r.newAttributes,b=r.enabledAttributes;for(let F=0,z=b.length;F<z;F++)b[F]!==v[F]&&(i.disableVertexAttribArray(F),b[F]=0)}function x(v,b,F,z,H,tt,G){G===!0?i.vertexAttribIPointer(v,b,F,H,tt):i.vertexAttribPointer(v,b,F,z,H,tt)}function S(v,b,F,z){_();const H=z.attributes,tt=F.getAttributes(),G=b.defaultAttributeValues;for(const rt in tt){const W=tt[rt];if(W.location>=0){let _t=H[rt];if(_t===void 0&&(rt==="instanceMatrix"&&v.instanceMatrix&&(_t=v.instanceMatrix),rt==="instanceColor"&&v.instanceColor&&(_t=v.instanceColor)),_t!==void 0){const xt=_t.normalized,Tt=_t.itemSize,ae=t.get(_t);if(ae===void 0)continue;const ue=ae.buffer,q=ae.type,it=ae.bytesPerElement,Et=q===i.INT||q===i.UNSIGNED_INT||_t.gpuType===Vo;if(_t.isInterleavedBufferAttribute){const vt=_t.data,Ht=vt.stride,Dt=_t.offset;if(vt.isInstancedInterleavedBuffer){for(let te=0;te<W.locationSize;te++)p(W.location+te,vt.meshPerAttribute);v.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=vt.meshPerAttribute*vt.count)}else for(let te=0;te<W.locationSize;te++)m(W.location+te);i.bindBuffer(i.ARRAY_BUFFER,ue);for(let te=0;te<W.locationSize;te++)x(W.location+te,Tt/W.locationSize,q,xt,Ht*it,(Dt+Tt/W.locationSize*te)*it,Et)}else{if(_t.isInstancedBufferAttribute){for(let vt=0;vt<W.locationSize;vt++)p(W.location+vt,_t.meshPerAttribute);v.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=_t.meshPerAttribute*_t.count)}else for(let vt=0;vt<W.locationSize;vt++)m(W.location+vt);i.bindBuffer(i.ARRAY_BUFFER,ue);for(let vt=0;vt<W.locationSize;vt++)x(W.location+vt,Tt/W.locationSize,q,xt,Tt*it,Tt/W.locationSize*vt*it,Et)}}else if(G!==void 0){const xt=G[rt];if(xt!==void 0)switch(xt.length){case 2:i.vertexAttrib2fv(W.location,xt);break;case 3:i.vertexAttrib3fv(W.location,xt);break;case 4:i.vertexAttrib4fv(W.location,xt);break;default:i.vertexAttrib1fv(W.location,xt)}}}}M()}function C(){R();for(const v in n){const b=n[v];for(const F in b){const z=b[F];for(const H in z)h(z[H].object),delete z[H];delete b[F]}delete n[v]}}function y(v){if(n[v.id]===void 0)return;const b=n[v.id];for(const F in b){const z=b[F];for(const H in z)h(z[H].object),delete z[H];delete b[F]}delete n[v.id]}function A(v){for(const b in n){const F=n[b];if(F[v.id]===void 0)continue;const z=F[v.id];for(const H in z)h(z[H].object),delete z[H];delete F[v.id]}}function R(){N(),a=!0,r!==s&&(r=s,l(r.object))}function N(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:R,resetDefaultState:N,dispose:C,releaseStatesOfGeometry:y,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:m,disableUnusedAttributes:M}}function nm(i,t,e){let n;function s(l){n=l}function r(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function a(l,h,d){d!==0&&(i.drawArraysInstanced(n,l,h,d),e.update(h,n,d))}function o(l,h,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,d);let f=0;for(let g=0;g<d;g++)f+=h[g];e.update(f,n,1)}function c(l,h,d,u){if(d===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<l.length;g++)a(l[g],h[g],u[g]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,h,0,u,0,d);let g=0;for(let _=0;_<d;_++)g+=h[_];for(let _=0;_<u.length;_++)e.update(g,n,u[_])}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function im(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(A){return!(A!==wn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const R=A===Bs&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Wn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Ln&&!R)}function c(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const d=e.logarithmicDepthBuffer===!0,u=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control");if(u===!0){const A=t.get("EXT_clip_control");A.clipControlEXT(A.LOWER_LEFT_EXT,A.ZERO_TO_ONE_EXT)}const f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),M=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),x=i.getParameter(i.MAX_VARYING_VECTORS),S=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),C=g>0,y=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:d,reverseDepthBuffer:u,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:M,maxVaryings:x,maxFragmentUniforms:S,vertexTextures:C,maxSamples:y}}function sm(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new vi,o=new Yt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||n!==0||s;return s=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,f){const g=d.clippingPlanes,_=d.clipIntersection,m=d.clipShadows,p=i.get(d);if(!s||g===null||g.length===0||r&&!m)r?h(null):l();else{const M=r?0:n,x=M*4;let S=p.clippingState||null;c.value=S,S=h(g,u,x,f);for(let C=0;C!==x;++C)S[C]=e[C];p.clippingState=S,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=M}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,f,g){const _=d!==null?d.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const p=f+_*4,M=u.matrixWorldInverse;o.getNormalMatrix(M),(m===null||m.length<p)&&(m=new Float32Array(p));for(let x=0,S=f;x!==_;++x,S+=4)a.copy(d[x]).applyMatrix4(M,o),a.normal.toArray(m,S),m[S+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function rm(i){let t=new WeakMap;function e(a,o){return o===no?a.mapping=cs:o===io&&(a.mapping=ls),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===no||o===io)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new mu(c.height);return l.fromEquirectangularTexture(i,a),t.set(a,l),a.addEventListener("dispose",s),e(l.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class _h extends ph{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const is=4,Xc=[.125,.215,.35,.446,.526,.582],Si=20,Ea=new _h,qc=new yt;let Aa=null,Ta=0,Ra=0,Ca=!1;const Mi=(1+Math.sqrt(5))/2,qi=1/Mi,Yc=[new U(-Mi,qi,0),new U(Mi,qi,0),new U(-qi,0,Mi),new U(qi,0,Mi),new U(0,Mi,-qi),new U(0,Mi,qi),new U(-1,1,-1),new U(1,1,-1),new U(-1,1,1),new U(1,1,1)];class $c{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Aa=this._renderer.getRenderTarget(),Ta=this._renderer.getActiveCubeFace(),Ra=this._renderer.getActiveMipmapLevel(),Ca=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Zc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=jc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Aa,Ta,Ra),this._renderer.xr.enabled=Ca,t.scissorTest=!1,hr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===cs||t.mapping===ls?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Aa=this._renderer.getRenderTarget(),Ta=this._renderer.getActiveCubeFace(),Ra=this._renderer.getActiveMipmapLevel(),Ca=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Sn,minFilter:Sn,generateMipmaps:!1,type:Bs,format:wn,colorSpace:ri,depthBuffer:!1},s=Kc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Kc(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=am(r)),this._blurMaterial=om(r,t,e)}return s}_compileMaterial(t){const e=new K(this._lodPlanes[0],t);this._renderer.compile(e,Ea)}_sceneToCubeUV(t,e,n,s){const o=new ln(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,u=h.toneMapping;h.getClearColor(qc),h.toneMapping=ti,h.autoClear=!1;const f=new fn({name:"PMREM.Background",side:Ke,depthWrite:!1,depthTest:!1}),g=new K(new Wt,f);let _=!1;const m=t.background;m?m.isColor&&(f.color.copy(m),t.background=null,_=!0):(f.color.copy(qc),_=!0);for(let p=0;p<6;p++){const M=p%3;M===0?(o.up.set(0,c[p],0),o.lookAt(l[p],0,0)):M===1?(o.up.set(0,0,c[p]),o.lookAt(0,l[p],0)):(o.up.set(0,c[p],0),o.lookAt(0,0,l[p]));const x=this._cubeSize;hr(s,M*x,p>2?x:0,x,x),h.setRenderTarget(s),_&&h.render(g,o),h.render(t,o)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=u,h.autoClear=d,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===cs||t.mapping===ls;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Zc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=jc());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new K(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const c=this._cubeSize;hr(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,Ea)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Yc[(s-r-1)%Yc.length];this._blur(t,r-1,r,a,o)}e.autoClear=n}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new K(this._lodPlanes[s],l),u=l.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Si-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):Si;m>Si&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Si}`);const p=[];let M=0;for(let A=0;A<Si;++A){const R=A/_,N=Math.exp(-R*R/2);p.push(N),A===0?M+=N:A<m&&(M+=2*N)}for(let A=0;A<p.length;A++)p[A]=p[A]/M;u.envMap.value=t.texture,u.samples.value=m,u.weights.value=p,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:x}=this;u.dTheta.value=g,u.mipInt.value=x-n;const S=this._sizeLods[s],C=3*S*(s>x-is?s-x+is:0),y=4*(this._cubeSize-S);hr(e,C,y,3*S,2*S),c.setRenderTarget(e),c.render(d,Ea)}}function am(i){const t=[],e=[],n=[];let s=i;const r=i-is+1+Xc.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let c=1/o;a>i-is?c=Xc[a-i+is-1]:a===0&&(c=0),n.push(c);const l=1/(o-2),h=-l,d=1+l,u=[h,h,d,h,d,d,h,h,d,d,h,d],f=6,g=6,_=3,m=2,p=1,M=new Float32Array(_*g*f),x=new Float32Array(m*g*f),S=new Float32Array(p*g*f);for(let y=0;y<f;y++){const A=y%3*2/3-1,R=y>2?0:-1,N=[A,R,0,A+2/3,R,0,A+2/3,R+1,0,A,R,0,A+2/3,R+1,0,A,R+1,0];M.set(N,_*g*y),x.set(u,m*g*y);const v=[y,y,y,y,y,y];S.set(v,p*g*y)}const C=new Be;C.setAttribute("position",new Xe(M,_)),C.setAttribute("uv",new Xe(x,m)),C.setAttribute("faceIndex",new Xe(S,p)),t.push(C),s>is&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Kc(i,t,e){const n=new Ti(i,t,e);return n.texture.mapping=qr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function hr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function om(i,t,e){const n=new Float32Array(Si),s=new U(0,1,0);return new ii({name:"SphericalGaussianBlur",defines:{n:Si,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Qo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Qn,depthTest:!1,depthWrite:!1})}function jc(){return new ii({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Qo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Qn,depthTest:!1,depthWrite:!1})}function Zc(){return new ii({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Qo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Qn,depthTest:!1,depthWrite:!1})}function Qo(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function cm(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===no||c===io,h=c===cs||c===ls;if(l||h){let d=t.get(o);const u=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==u)return e===null&&(e=new $c(i)),d=l?e.fromEquirectangular(o,d):e.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,t.set(o,d),d.texture;if(d!==void 0)return d.texture;{const f=o.image;return l&&f&&f.height>0||h&&f&&s(f)?(e===null&&(e=new $c(i)),d=l?e.fromEquirectangular(o):e.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,t.set(o,d),o.addEventListener("dispose",r),d.texture):null}}}return o}function s(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function lm(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Cr("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function hm(i,t,e,n){const s={},r=new WeakMap;function a(d){const u=d.target;u.index!==null&&t.remove(u.index);for(const g in u.attributes)t.remove(u.attributes[g]);for(const g in u.morphAttributes){const _=u.morphAttributes[g];for(let m=0,p=_.length;m<p;m++)t.remove(_[m])}u.removeEventListener("dispose",a),delete s[u.id];const f=r.get(u);f&&(t.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function o(d,u){return s[u.id]===!0||(u.addEventListener("dispose",a),s[u.id]=!0,e.memory.geometries++),u}function c(d){const u=d.attributes;for(const g in u)t.update(u[g],i.ARRAY_BUFFER);const f=d.morphAttributes;for(const g in f){const _=f[g];for(let m=0,p=_.length;m<p;m++)t.update(_[m],i.ARRAY_BUFFER)}}function l(d){const u=[],f=d.index,g=d.attributes.position;let _=0;if(f!==null){const M=f.array;_=f.version;for(let x=0,S=M.length;x<S;x+=3){const C=M[x+0],y=M[x+1],A=M[x+2];u.push(C,y,y,A,A,C)}}else if(g!==void 0){const M=g.array;_=g.version;for(let x=0,S=M.length/3-1;x<S;x+=3){const C=x+0,y=x+1,A=x+2;u.push(C,y,y,A,A,C)}}else return;const m=new(rh(u)?uh:dh)(u,1);m.version=_;const p=r.get(d);p&&t.remove(p),r.set(d,m)}function h(d){const u=r.get(d);if(u){const f=d.index;f!==null&&u.version<f.version&&l(d)}else l(d);return r.get(d)}return{get:o,update:c,getWireframeAttribute:h}}function dm(i,t,e){let n;function s(u){n=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function c(u,f){i.drawElements(n,f,r,u*a),e.update(f,n,1)}function l(u,f,g){g!==0&&(i.drawElementsInstanced(n,f,r,u*a,g),e.update(f,n,g))}function h(u,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,u,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];e.update(m,n,1)}function d(u,f,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<u.length;p++)l(u[p]/a,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,u,0,_,0,g);let p=0;for(let M=0;M<g;M++)p+=f[M];for(let M=0;M<_.length;M++)e.update(p,n,_[M])}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function um(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function fm(i,t,e){const n=new WeakMap,s=new Re;function r(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(o);if(u===void 0||u.count!==d){let N=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",N)};u!==void 0&&u.texture.dispose();const f=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],M=o.morphAttributes.color||[];let x=0;f===!0&&(x=1),g===!0&&(x=2),_===!0&&(x=3);let S=o.attributes.position.count*x,C=1;S>t.maxTextureSize&&(C=Math.ceil(S/t.maxTextureSize),S=t.maxTextureSize);const y=new Float32Array(S*C*4*d),A=new oh(y,S,C,d);A.type=Ln,A.needsUpdate=!0;const R=x*4;for(let v=0;v<d;v++){const b=m[v],F=p[v],z=M[v],H=S*C*4*v;for(let tt=0;tt<b.count;tt++){const G=tt*R;f===!0&&(s.fromBufferAttribute(b,tt),y[H+G+0]=s.x,y[H+G+1]=s.y,y[H+G+2]=s.z,y[H+G+3]=0),g===!0&&(s.fromBufferAttribute(F,tt),y[H+G+4]=s.x,y[H+G+5]=s.y,y[H+G+6]=s.z,y[H+G+7]=0),_===!0&&(s.fromBufferAttribute(z,tt),y[H+G+8]=s.x,y[H+G+9]=s.y,y[H+G+10]=s.z,y[H+G+11]=z.itemSize===4?s.w:1)}}u={count:d,texture:A,size:new Bt(S,C)},n.set(o,u),o.addEventListener("dispose",N)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let f=0;for(let _=0;_<l.length;_++)f+=l[_];const g=o.morphTargetsRelative?1:1-f;c.getUniforms().setValue(i,"morphTargetBaseInfluence",g),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function pm(i,t,e,n){let s=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,d=t.get(c,h);if(s.get(d)!==l&&(t.update(d),s.set(d,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const u=c.skeleton;s.get(u)!==l&&(u.update(),s.set(u,l))}return d}function a(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:a}}class xh extends We{constructor(t,e,n,s,r,a,o,c,l,h=rs){if(h!==rs&&h!==us)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===rs&&(n=Ai),n===void 0&&h===us&&(n=ds),super(null,s,r,a,o,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:en,this.minFilter=c!==void 0?c:en,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const vh=new We,Jc=new xh(1,1),Mh=new oh,yh=new Qd,Sh=new mh,Qc=[],tl=[],el=new Float32Array(16),nl=new Float32Array(9),il=new Float32Array(4);function xs(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Qc[s];if(r===void 0&&(r=new Float32Array(s),Qc[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function Ue(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ne(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function $r(i,t){let e=tl[t];e===void 0&&(e=new Int32Array(t),tl[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function mm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function gm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ue(e,t))return;i.uniform2fv(this.addr,t),Ne(e,t)}}function _m(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ue(e,t))return;i.uniform3fv(this.addr,t),Ne(e,t)}}function xm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ue(e,t))return;i.uniform4fv(this.addr,t),Ne(e,t)}}function vm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ue(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ne(e,t)}else{if(Ue(e,n))return;il.set(n),i.uniformMatrix2fv(this.addr,!1,il),Ne(e,n)}}function Mm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ue(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ne(e,t)}else{if(Ue(e,n))return;nl.set(n),i.uniformMatrix3fv(this.addr,!1,nl),Ne(e,n)}}function ym(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ue(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ne(e,t)}else{if(Ue(e,n))return;el.set(n),i.uniformMatrix4fv(this.addr,!1,el),Ne(e,n)}}function Sm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function wm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ue(e,t))return;i.uniform2iv(this.addr,t),Ne(e,t)}}function bm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ue(e,t))return;i.uniform3iv(this.addr,t),Ne(e,t)}}function Em(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ue(e,t))return;i.uniform4iv(this.addr,t),Ne(e,t)}}function Am(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Tm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ue(e,t))return;i.uniform2uiv(this.addr,t),Ne(e,t)}}function Rm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ue(e,t))return;i.uniform3uiv(this.addr,t),Ne(e,t)}}function Cm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ue(e,t))return;i.uniform4uiv(this.addr,t),Ne(e,t)}}function Pm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Jc.compareFunction=sh,r=Jc):r=vh,e.setTexture2D(t||r,s)}function Lm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||yh,s)}function Im(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Sh,s)}function Dm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Mh,s)}function Um(i){switch(i){case 5126:return mm;case 35664:return gm;case 35665:return _m;case 35666:return xm;case 35674:return vm;case 35675:return Mm;case 35676:return ym;case 5124:case 35670:return Sm;case 35667:case 35671:return wm;case 35668:case 35672:return bm;case 35669:case 35673:return Em;case 5125:return Am;case 36294:return Tm;case 36295:return Rm;case 36296:return Cm;case 35678:case 36198:case 36298:case 36306:case 35682:return Pm;case 35679:case 36299:case 36307:return Lm;case 35680:case 36300:case 36308:case 36293:return Im;case 36289:case 36303:case 36311:case 36292:return Dm}}function Nm(i,t){i.uniform1fv(this.addr,t)}function Fm(i,t){const e=xs(t,this.size,2);i.uniform2fv(this.addr,e)}function Om(i,t){const e=xs(t,this.size,3);i.uniform3fv(this.addr,e)}function km(i,t){const e=xs(t,this.size,4);i.uniform4fv(this.addr,e)}function zm(i,t){const e=xs(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Bm(i,t){const e=xs(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Gm(i,t){const e=xs(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Hm(i,t){i.uniform1iv(this.addr,t)}function Vm(i,t){i.uniform2iv(this.addr,t)}function Wm(i,t){i.uniform3iv(this.addr,t)}function Xm(i,t){i.uniform4iv(this.addr,t)}function qm(i,t){i.uniform1uiv(this.addr,t)}function Ym(i,t){i.uniform2uiv(this.addr,t)}function $m(i,t){i.uniform3uiv(this.addr,t)}function Km(i,t){i.uniform4uiv(this.addr,t)}function jm(i,t,e){const n=this.cache,s=t.length,r=$r(e,s);Ue(n,r)||(i.uniform1iv(this.addr,r),Ne(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||vh,r[a])}function Zm(i,t,e){const n=this.cache,s=t.length,r=$r(e,s);Ue(n,r)||(i.uniform1iv(this.addr,r),Ne(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||yh,r[a])}function Jm(i,t,e){const n=this.cache,s=t.length,r=$r(e,s);Ue(n,r)||(i.uniform1iv(this.addr,r),Ne(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Sh,r[a])}function Qm(i,t,e){const n=this.cache,s=t.length,r=$r(e,s);Ue(n,r)||(i.uniform1iv(this.addr,r),Ne(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Mh,r[a])}function t0(i){switch(i){case 5126:return Nm;case 35664:return Fm;case 35665:return Om;case 35666:return km;case 35674:return zm;case 35675:return Bm;case 35676:return Gm;case 5124:case 35670:return Hm;case 35667:case 35671:return Vm;case 35668:case 35672:return Wm;case 35669:case 35673:return Xm;case 5125:return qm;case 36294:return Ym;case 36295:return $m;case 36296:return Km;case 35678:case 36198:case 36298:case 36306:case 35682:return jm;case 35679:case 36299:case 36307:return Zm;case 35680:case 36300:case 36308:case 36293:return Jm;case 36289:case 36303:case 36311:case 36292:return Qm}}class e0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Um(e.type)}}class n0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=t0(e.type)}}class i0{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const Pa=/(\w+)(\])?(\[|\.)?/g;function sl(i,t){i.seq.push(t),i.map[t.id]=t}function s0(i,t,e){const n=i.name,s=n.length;for(Pa.lastIndex=0;;){const r=Pa.exec(n),a=Pa.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){sl(e,l===void 0?new e0(o,i,t):new n0(o,i,t));break}else{let d=e.map[o];d===void 0&&(d=new i0(o),sl(e,d)),e=d}}}class Pr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);s0(r,a,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function rl(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const r0=37297;let a0=0;function o0(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}function c0(i){const t=de.getPrimaries(de.workingColorSpace),e=de.getPrimaries(i);let n;switch(t===e?n="":t===Fr&&e===Nr?n="LinearDisplayP3ToLinearSRGB":t===Nr&&e===Fr&&(n="LinearSRGBToLinearDisplayP3"),i){case ri:case Yr:return[n,"LinearTransferOETF"];case De:case Zo:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function al(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+o0(i.getShaderSource(t),a)}else return s}function l0(i,t){const e=c0(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function h0(i,t){let e;switch(t){case Ed:e="Linear";break;case Ad:e="Reinhard";break;case Td:e="Cineon";break;case Rd:e="ACESFilmic";break;case Pd:e="AgX";break;case Ld:e="Neutral";break;case Cd:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const dr=new U;function d0(){de.getLuminanceCoefficients(dr);const i=dr.x.toFixed(4),t=dr.y.toFixed(4),e=dr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function u0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Us).join(`
`)}function f0(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function p0(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Us(i){return i!==""}function ol(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function cl(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const m0=/^[ \t]*#include +<([\w\d./]+)>/gm;function Uo(i){return i.replace(m0,_0)}const g0=new Map;function _0(i,t){let e=Xt[t];if(e===void 0){const n=g0.get(t);if(n!==void 0)e=Xt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Uo(e)}const x0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ll(i){return i.replace(x0,v0)}function v0(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function hl(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function M0(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===ql?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Yl?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Bn&&(t="SHADOWMAP_TYPE_VSM"),t}function y0(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case cs:case ls:t="ENVMAP_TYPE_CUBE";break;case qr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function S0(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case ls:t="ENVMAP_MODE_REFRACTION";break}return t}function w0(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Xr:t="ENVMAP_BLENDING_MULTIPLY";break;case wd:t="ENVMAP_BLENDING_MIX";break;case bd:t="ENVMAP_BLENDING_ADD";break}return t}function b0(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function E0(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=M0(e),l=y0(e),h=S0(e),d=w0(e),u=b0(e),f=u0(e),g=f0(r),_=s.createProgram();let m,p,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Us).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Us).join(`
`),p.length>0&&(p+=`
`)):(m=[hl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Us).join(`
`),p=[hl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ti?"#define TONE_MAPPING":"",e.toneMapping!==ti?Xt.tonemapping_pars_fragment:"",e.toneMapping!==ti?h0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Xt.colorspace_pars_fragment,l0("linearToOutputTexel",e.outputColorSpace),d0(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Us).join(`
`)),a=Uo(a),a=ol(a,e),a=cl(a,e),o=Uo(o),o=ol(o,e),o=cl(o,e),a=ll(a),o=ll(o),e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===Tc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Tc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=M+m+a,S=M+p+o,C=rl(s,s.VERTEX_SHADER,x),y=rl(s,s.FRAGMENT_SHADER,S);s.attachShader(_,C),s.attachShader(_,y),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function A(b){if(i.debug.checkShaderErrors){const F=s.getProgramInfoLog(_).trim(),z=s.getShaderInfoLog(C).trim(),H=s.getShaderInfoLog(y).trim();let tt=!0,G=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(tt=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,C,y);else{const rt=al(s,C,"vertex"),W=al(s,y,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+b.name+`
Material Type: `+b.type+`

Program Info Log: `+F+`
`+rt+`
`+W)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(z===""||H==="")&&(G=!1);G&&(b.diagnostics={runnable:tt,programLog:F,vertexShader:{log:z,prefix:m},fragmentShader:{log:H,prefix:p}})}s.deleteShader(C),s.deleteShader(y),R=new Pr(s,_),N=p0(s,_)}let R;this.getUniforms=function(){return R===void 0&&A(this),R};let N;this.getAttributes=function(){return N===void 0&&A(this),N};let v=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=s.getProgramParameter(_,r0)),v},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=a0++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=C,this.fragmentShader=y,this}let A0=0;class T0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new R0(t),e.set(t,n)),n}}class R0{constructor(t){this.id=A0++,this.code=t,this.usedTimes=0}}function C0(i,t,e,n,s,r,a){const o=new lh,c=new T0,l=new Set,h=[],d=s.logarithmicDepthBuffer,u=s.reverseDepthBuffer,f=s.vertexTextures;let g=s.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(v){return l.add(v),v===0?"uv":`uv${v}`}function p(v,b,F,z,H){const tt=z.fog,G=H.geometry,rt=v.isMeshStandardMaterial?z.environment:null,W=(v.isMeshStandardMaterial?e:t).get(v.envMap||rt),_t=W&&W.mapping===qr?W.image.height:null,xt=_[v.type];v.precision!==null&&(g=s.getMaxPrecision(v.precision),g!==v.precision&&console.warn("THREE.WebGLProgram.getParameters:",v.precision,"not supported, using",g,"instead."));const Tt=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,ae=Tt!==void 0?Tt.length:0;let ue=0;G.morphAttributes.position!==void 0&&(ue=1),G.morphAttributes.normal!==void 0&&(ue=2),G.morphAttributes.color!==void 0&&(ue=3);let q,it,Et,vt;if(xt){const Ze=Rn[xt];q=Ze.vertexShader,it=Ze.fragmentShader}else q=v.vertexShader,it=v.fragmentShader,c.update(v),Et=c.getVertexShaderID(v),vt=c.getFragmentShaderID(v);const Ht=i.getRenderTarget(),Dt=H.isInstancedMesh===!0,te=H.isBatchedMesh===!0,me=!!v.map,ee=!!v.matcap,P=!!W,nn=!!v.aoMap,Zt=!!v.lightMap,se=!!v.bumpMap,Nt=!!v.normalMap,xe=!!v.displacementMap,kt=!!v.emissiveMap,T=!!v.metalnessMap,w=!!v.roughnessMap,O=v.anisotropy>0,$=v.clearcoat>0,et=v.dispersion>0,Y=v.iridescence>0,Rt=v.sheen>0,dt=v.transmission>0,Mt=O&&!!v.anisotropyMap,re=$&&!!v.clearcoatMap,st=$&&!!v.clearcoatNormalMap,St=$&&!!v.clearcoatRoughnessMap,Ft=Y&&!!v.iridescenceMap,Ot=Y&&!!v.iridescenceThicknessMap,wt=Rt&&!!v.sheenColorMap,Jt=Rt&&!!v.sheenRoughnessMap,Vt=!!v.specularMap,_e=!!v.specularColorMap,L=!!v.specularIntensityMap,mt=dt&&!!v.transmissionMap,V=dt&&!!v.thicknessMap,j=!!v.gradientMap,ft=!!v.alphaMap,gt=v.alphaTest>0,ne=!!v.alphaHash,Le=!!v.extensions;let je=ti;v.toneMapped&&(Ht===null||Ht.isXRRenderTarget===!0)&&(je=i.toneMapping);const oe={shaderID:xt,shaderType:v.type,shaderName:v.name,vertexShader:q,fragmentShader:it,defines:v.defines,customVertexShaderID:Et,customFragmentShaderID:vt,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:g,batching:te,batchingColor:te&&H._colorsTexture!==null,instancing:Dt,instancingColor:Dt&&H.instanceColor!==null,instancingMorph:Dt&&H.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:Ht===null?i.outputColorSpace:Ht.isXRRenderTarget===!0?Ht.texture.colorSpace:ri,alphaToCoverage:!!v.alphaToCoverage,map:me,matcap:ee,envMap:P,envMapMode:P&&W.mapping,envMapCubeUVHeight:_t,aoMap:nn,lightMap:Zt,bumpMap:se,normalMap:Nt,displacementMap:f&&xe,emissiveMap:kt,normalMapObjectSpace:Nt&&v.normalMapType===Nd,normalMapTangentSpace:Nt&&v.normalMapType===jo,metalnessMap:T,roughnessMap:w,anisotropy:O,anisotropyMap:Mt,clearcoat:$,clearcoatMap:re,clearcoatNormalMap:st,clearcoatRoughnessMap:St,dispersion:et,iridescence:Y,iridescenceMap:Ft,iridescenceThicknessMap:Ot,sheen:Rt,sheenColorMap:wt,sheenRoughnessMap:Jt,specularMap:Vt,specularColorMap:_e,specularIntensityMap:L,transmission:dt,transmissionMap:mt,thicknessMap:V,gradientMap:j,opaque:v.transparent===!1&&v.blending===ss&&v.alphaToCoverage===!1,alphaMap:ft,alphaTest:gt,alphaHash:ne,combine:v.combine,mapUv:me&&m(v.map.channel),aoMapUv:nn&&m(v.aoMap.channel),lightMapUv:Zt&&m(v.lightMap.channel),bumpMapUv:se&&m(v.bumpMap.channel),normalMapUv:Nt&&m(v.normalMap.channel),displacementMapUv:xe&&m(v.displacementMap.channel),emissiveMapUv:kt&&m(v.emissiveMap.channel),metalnessMapUv:T&&m(v.metalnessMap.channel),roughnessMapUv:w&&m(v.roughnessMap.channel),anisotropyMapUv:Mt&&m(v.anisotropyMap.channel),clearcoatMapUv:re&&m(v.clearcoatMap.channel),clearcoatNormalMapUv:st&&m(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:St&&m(v.clearcoatRoughnessMap.channel),iridescenceMapUv:Ft&&m(v.iridescenceMap.channel),iridescenceThicknessMapUv:Ot&&m(v.iridescenceThicknessMap.channel),sheenColorMapUv:wt&&m(v.sheenColorMap.channel),sheenRoughnessMapUv:Jt&&m(v.sheenRoughnessMap.channel),specularMapUv:Vt&&m(v.specularMap.channel),specularColorMapUv:_e&&m(v.specularColorMap.channel),specularIntensityMapUv:L&&m(v.specularIntensityMap.channel),transmissionMapUv:mt&&m(v.transmissionMap.channel),thicknessMapUv:V&&m(v.thicknessMap.channel),alphaMapUv:ft&&m(v.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(Nt||O),vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:H.isPoints===!0&&!!G.attributes.uv&&(me||ft),fog:!!tt,useFog:v.fog===!0,fogExp2:!!tt&&tt.isFogExp2,flatShading:v.flatShading===!0,sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:u,skinning:H.isSkinnedMesh===!0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:ae,morphTextureStride:ue,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&F.length>0,shadowMapType:i.shadowMap.type,toneMapping:je,decodeVideoTexture:me&&v.map.isVideoTexture===!0&&de.getTransfer(v.map.colorSpace)===Me,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Ve,flipSided:v.side===Ke,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:Le&&v.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Le&&v.extensions.multiDraw===!0||te)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return oe.vertexUv1s=l.has(1),oe.vertexUv2s=l.has(2),oe.vertexUv3s=l.has(3),l.clear(),oe}function M(v){const b=[];if(v.shaderID?b.push(v.shaderID):(b.push(v.customVertexShaderID),b.push(v.customFragmentShaderID)),v.defines!==void 0)for(const F in v.defines)b.push(F),b.push(v.defines[F]);return v.isRawShaderMaterial===!1&&(x(b,v),S(b,v),b.push(i.outputColorSpace)),b.push(v.customProgramCacheKey),b.join()}function x(v,b){v.push(b.precision),v.push(b.outputColorSpace),v.push(b.envMapMode),v.push(b.envMapCubeUVHeight),v.push(b.mapUv),v.push(b.alphaMapUv),v.push(b.lightMapUv),v.push(b.aoMapUv),v.push(b.bumpMapUv),v.push(b.normalMapUv),v.push(b.displacementMapUv),v.push(b.emissiveMapUv),v.push(b.metalnessMapUv),v.push(b.roughnessMapUv),v.push(b.anisotropyMapUv),v.push(b.clearcoatMapUv),v.push(b.clearcoatNormalMapUv),v.push(b.clearcoatRoughnessMapUv),v.push(b.iridescenceMapUv),v.push(b.iridescenceThicknessMapUv),v.push(b.sheenColorMapUv),v.push(b.sheenRoughnessMapUv),v.push(b.specularMapUv),v.push(b.specularColorMapUv),v.push(b.specularIntensityMapUv),v.push(b.transmissionMapUv),v.push(b.thicknessMapUv),v.push(b.combine),v.push(b.fogExp2),v.push(b.sizeAttenuation),v.push(b.morphTargetsCount),v.push(b.morphAttributeCount),v.push(b.numDirLights),v.push(b.numPointLights),v.push(b.numSpotLights),v.push(b.numSpotLightMaps),v.push(b.numHemiLights),v.push(b.numRectAreaLights),v.push(b.numDirLightShadows),v.push(b.numPointLightShadows),v.push(b.numSpotLightShadows),v.push(b.numSpotLightShadowsWithMaps),v.push(b.numLightProbes),v.push(b.shadowMapType),v.push(b.toneMapping),v.push(b.numClippingPlanes),v.push(b.numClipIntersection),v.push(b.depthPacking)}function S(v,b){o.disableAll(),b.supportsVertexTextures&&o.enable(0),b.instancing&&o.enable(1),b.instancingColor&&o.enable(2),b.instancingMorph&&o.enable(3),b.matcap&&o.enable(4),b.envMap&&o.enable(5),b.normalMapObjectSpace&&o.enable(6),b.normalMapTangentSpace&&o.enable(7),b.clearcoat&&o.enable(8),b.iridescence&&o.enable(9),b.alphaTest&&o.enable(10),b.vertexColors&&o.enable(11),b.vertexAlphas&&o.enable(12),b.vertexUv1s&&o.enable(13),b.vertexUv2s&&o.enable(14),b.vertexUv3s&&o.enable(15),b.vertexTangents&&o.enable(16),b.anisotropy&&o.enable(17),b.alphaHash&&o.enable(18),b.batching&&o.enable(19),b.dispersion&&o.enable(20),b.batchingColor&&o.enable(21),v.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reverseDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.alphaToCoverage&&o.enable(20),v.push(o.mask)}function C(v){const b=_[v.type];let F;if(b){const z=Rn[b];F=du.clone(z.uniforms)}else F=v.uniforms;return F}function y(v,b){let F;for(let z=0,H=h.length;z<H;z++){const tt=h[z];if(tt.cacheKey===b){F=tt,++F.usedTimes;break}}return F===void 0&&(F=new E0(i,b,v,r),h.push(F)),F}function A(v){if(--v.usedTimes===0){const b=h.indexOf(v);h[b]=h[h.length-1],h.pop(),v.destroy()}}function R(v){c.remove(v)}function N(){c.dispose()}return{getParameters:p,getProgramCacheKey:M,getUniforms:C,acquireProgram:y,releaseProgram:A,releaseShaderCache:R,programs:h,dispose:N}}function P0(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function L0(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function dl(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function ul(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(d,u,f,g,_,m){let p=i[t];return p===void 0?(p={id:d.id,object:d,geometry:u,material:f,groupOrder:g,renderOrder:d.renderOrder,z:_,group:m},i[t]=p):(p.id=d.id,p.object=d,p.geometry=u,p.material=f,p.groupOrder=g,p.renderOrder=d.renderOrder,p.z=_,p.group=m),t++,p}function o(d,u,f,g,_,m){const p=a(d,u,f,g,_,m);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):e.push(p)}function c(d,u,f,g,_,m){const p=a(d,u,f,g,_,m);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):e.unshift(p)}function l(d,u){e.length>1&&e.sort(d||L0),n.length>1&&n.sort(u||dl),s.length>1&&s.sort(u||dl)}function h(){for(let d=t,u=i.length;d<u;d++){const f=i[d];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:h,sort:l}}function I0(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new ul,i.set(n,[a])):s>=r.length?(a=new ul,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function D0(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new U,color:new yt};break;case"SpotLight":e={position:new U,direction:new U,color:new yt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new U,color:new yt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new U,skyColor:new yt,groundColor:new yt};break;case"RectAreaLight":e={color:new yt,position:new U,halfWidth:new U,halfHeight:new U};break}return i[t.id]=e,e}}}function U0(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Bt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Bt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Bt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let N0=0;function F0(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function O0(i){const t=new D0,e=U0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new U);const s=new U,r=new ie,a=new ie;function o(l){let h=0,d=0,u=0;for(let N=0;N<9;N++)n.probe[N].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,M=0,x=0,S=0,C=0,y=0,A=0;l.sort(F0);for(let N=0,v=l.length;N<v;N++){const b=l[N],F=b.color,z=b.intensity,H=b.distance,tt=b.shadow&&b.shadow.map?b.shadow.map.texture:null;if(b.isAmbientLight)h+=F.r*z,d+=F.g*z,u+=F.b*z;else if(b.isLightProbe){for(let G=0;G<9;G++)n.probe[G].addScaledVector(b.sh.coefficients[G],z);A++}else if(b.isDirectionalLight){const G=t.get(b);if(G.color.copy(b.color).multiplyScalar(b.intensity),b.castShadow){const rt=b.shadow,W=e.get(b);W.shadowIntensity=rt.intensity,W.shadowBias=rt.bias,W.shadowNormalBias=rt.normalBias,W.shadowRadius=rt.radius,W.shadowMapSize=rt.mapSize,n.directionalShadow[f]=W,n.directionalShadowMap[f]=tt,n.directionalShadowMatrix[f]=b.shadow.matrix,M++}n.directional[f]=G,f++}else if(b.isSpotLight){const G=t.get(b);G.position.setFromMatrixPosition(b.matrixWorld),G.color.copy(F).multiplyScalar(z),G.distance=H,G.coneCos=Math.cos(b.angle),G.penumbraCos=Math.cos(b.angle*(1-b.penumbra)),G.decay=b.decay,n.spot[_]=G;const rt=b.shadow;if(b.map&&(n.spotLightMap[C]=b.map,C++,rt.updateMatrices(b),b.castShadow&&y++),n.spotLightMatrix[_]=rt.matrix,b.castShadow){const W=e.get(b);W.shadowIntensity=rt.intensity,W.shadowBias=rt.bias,W.shadowNormalBias=rt.normalBias,W.shadowRadius=rt.radius,W.shadowMapSize=rt.mapSize,n.spotShadow[_]=W,n.spotShadowMap[_]=tt,S++}_++}else if(b.isRectAreaLight){const G=t.get(b);G.color.copy(F).multiplyScalar(z),G.halfWidth.set(b.width*.5,0,0),G.halfHeight.set(0,b.height*.5,0),n.rectArea[m]=G,m++}else if(b.isPointLight){const G=t.get(b);if(G.color.copy(b.color).multiplyScalar(b.intensity),G.distance=b.distance,G.decay=b.decay,b.castShadow){const rt=b.shadow,W=e.get(b);W.shadowIntensity=rt.intensity,W.shadowBias=rt.bias,W.shadowNormalBias=rt.normalBias,W.shadowRadius=rt.radius,W.shadowMapSize=rt.mapSize,W.shadowCameraNear=rt.camera.near,W.shadowCameraFar=rt.camera.far,n.pointShadow[g]=W,n.pointShadowMap[g]=tt,n.pointShadowMatrix[g]=b.shadow.matrix,x++}n.point[g]=G,g++}else if(b.isHemisphereLight){const G=t.get(b);G.skyColor.copy(b.color).multiplyScalar(z),G.groundColor.copy(b.groundColor).multiplyScalar(z),n.hemi[p]=G,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ht.LTC_FLOAT_1,n.rectAreaLTC2=ht.LTC_FLOAT_2):(n.rectAreaLTC1=ht.LTC_HALF_1,n.rectAreaLTC2=ht.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const R=n.hash;(R.directionalLength!==f||R.pointLength!==g||R.spotLength!==_||R.rectAreaLength!==m||R.hemiLength!==p||R.numDirectionalShadows!==M||R.numPointShadows!==x||R.numSpotShadows!==S||R.numSpotMaps!==C||R.numLightProbes!==A)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=x,n.pointShadowMap.length=x,n.spotShadow.length=S,n.spotShadowMap.length=S,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=x,n.spotLightMatrix.length=S+C-y,n.spotLightMap.length=C,n.numSpotLightShadowsWithMaps=y,n.numLightProbes=A,R.directionalLength=f,R.pointLength=g,R.spotLength=_,R.rectAreaLength=m,R.hemiLength=p,R.numDirectionalShadows=M,R.numPointShadows=x,R.numSpotShadows=S,R.numSpotMaps=C,R.numLightProbes=A,n.version=N0++)}function c(l,h){let d=0,u=0,f=0,g=0,_=0;const m=h.matrixWorldInverse;for(let p=0,M=l.length;p<M;p++){const x=l[p];if(x.isDirectionalLight){const S=n.directional[d];S.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(m),d++}else if(x.isSpotLight){const S=n.spot[f];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(m),S.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(m),f++}else if(x.isRectAreaLight){const S=n.rectArea[g];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(m),a.identity(),r.copy(x.matrixWorld),r.premultiply(m),a.extractRotation(r),S.halfWidth.set(x.width*.5,0,0),S.halfHeight.set(0,x.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),g++}else if(x.isPointLight){const S=n.point[u];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(m),u++}else if(x.isHemisphereLight){const S=n.hemi[_];S.direction.setFromMatrixPosition(x.matrixWorld),S.direction.transformDirection(m),_++}}}return{setup:o,setupView:c,state:n}}function fl(i){const t=new O0(i),e=[],n=[];function s(h){l.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function k0(i){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new fl(i),t.set(s,[o])):r>=a.length?(o=new fl(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}class z0 extends ai{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Dd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class B0 extends ai{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const G0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,H0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function V0(i,t,e){let n=new Jo;const s=new Bt,r=new Bt,a=new Re,o=new z0({depthPacking:Ud}),c=new B0,l={},h=e.maxTextureSize,d={[ni]:Ke,[Ke]:ni,[Ve]:Ve},u=new ii({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Bt},radius:{value:4}},vertexShader:G0,fragmentShader:H0}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const g=new Be;g.setAttribute("position",new Xe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new K(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ql;let p=this.type;this.render=function(y,A,R){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||y.length===0)return;const N=i.getRenderTarget(),v=i.getActiveCubeFace(),b=i.getActiveMipmapLevel(),F=i.state;F.setBlending(Qn),F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const z=p!==Bn&&this.type===Bn,H=p===Bn&&this.type!==Bn;for(let tt=0,G=y.length;tt<G;tt++){const rt=y[tt],W=rt.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",rt,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;s.copy(W.mapSize);const _t=W.getFrameExtents();if(s.multiply(_t),r.copy(W.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/_t.x),s.x=r.x*_t.x,W.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/_t.y),s.y=r.y*_t.y,W.mapSize.y=r.y)),W.map===null||z===!0||H===!0){const Tt=this.type!==Bn?{minFilter:en,magFilter:en}:{};W.map!==null&&W.map.dispose(),W.map=new Ti(s.x,s.y,Tt),W.map.texture.name=rt.name+".shadowMap",W.camera.updateProjectionMatrix()}i.setRenderTarget(W.map),i.clear();const xt=W.getViewportCount();for(let Tt=0;Tt<xt;Tt++){const ae=W.getViewport(Tt);a.set(r.x*ae.x,r.y*ae.y,r.x*ae.z,r.y*ae.w),F.viewport(a),W.updateMatrices(rt,Tt),n=W.getFrustum(),S(A,R,W.camera,rt,this.type)}W.isPointLightShadow!==!0&&this.type===Bn&&M(W,R),W.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(N,v,b)};function M(y,A){const R=t.update(_);u.defines.VSM_SAMPLES!==y.blurSamples&&(u.defines.VSM_SAMPLES=y.blurSamples,f.defines.VSM_SAMPLES=y.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),y.mapPass===null&&(y.mapPass=new Ti(s.x,s.y)),u.uniforms.shadow_pass.value=y.map.texture,u.uniforms.resolution.value=y.mapSize,u.uniforms.radius.value=y.radius,i.setRenderTarget(y.mapPass),i.clear(),i.renderBufferDirect(A,null,R,u,_,null),f.uniforms.shadow_pass.value=y.mapPass.texture,f.uniforms.resolution.value=y.mapSize,f.uniforms.radius.value=y.radius,i.setRenderTarget(y.map),i.clear(),i.renderBufferDirect(A,null,R,f,_,null)}function x(y,A,R,N){let v=null;const b=R.isPointLight===!0?y.customDistanceMaterial:y.customDepthMaterial;if(b!==void 0)v=b;else if(v=R.isPointLight===!0?c:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const F=v.uuid,z=A.uuid;let H=l[F];H===void 0&&(H={},l[F]=H);let tt=H[z];tt===void 0&&(tt=v.clone(),H[z]=tt,A.addEventListener("dispose",C)),v=tt}if(v.visible=A.visible,v.wireframe=A.wireframe,N===Bn?v.side=A.shadowSide!==null?A.shadowSide:A.side:v.side=A.shadowSide!==null?A.shadowSide:d[A.side],v.alphaMap=A.alphaMap,v.alphaTest=A.alphaTest,v.map=A.map,v.clipShadows=A.clipShadows,v.clippingPlanes=A.clippingPlanes,v.clipIntersection=A.clipIntersection,v.displacementMap=A.displacementMap,v.displacementScale=A.displacementScale,v.displacementBias=A.displacementBias,v.wireframeLinewidth=A.wireframeLinewidth,v.linewidth=A.linewidth,R.isPointLight===!0&&v.isMeshDistanceMaterial===!0){const F=i.properties.get(v);F.light=R}return v}function S(y,A,R,N,v){if(y.visible===!1)return;if(y.layers.test(A.layers)&&(y.isMesh||y.isLine||y.isPoints)&&(y.castShadow||y.receiveShadow&&v===Bn)&&(!y.frustumCulled||n.intersectsObject(y))){y.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,y.matrixWorld);const z=t.update(y),H=y.material;if(Array.isArray(H)){const tt=z.groups;for(let G=0,rt=tt.length;G<rt;G++){const W=tt[G],_t=H[W.materialIndex];if(_t&&_t.visible){const xt=x(y,_t,N,v);y.onBeforeShadow(i,y,A,R,z,xt,W),i.renderBufferDirect(R,null,z,xt,y,W),y.onAfterShadow(i,y,A,R,z,xt,W)}}}else if(H.visible){const tt=x(y,H,N,v);y.onBeforeShadow(i,y,A,R,z,tt,null),i.renderBufferDirect(R,null,z,tt,y,null),y.onAfterShadow(i,y,A,R,z,tt,null)}}const F=y.children;for(let z=0,H=F.length;z<H;z++)S(F[z],A,R,N,v)}function C(y){y.target.removeEventListener("dispose",C);for(const R in l){const N=l[R],v=y.target.uuid;v in N&&(N[v].dispose(),delete N[v])}}}const W0={[Ka]:ja,[Za]:to,[Ja]:eo,[os]:Qa,[ja]:Ka,[to]:Za,[eo]:Ja,[Qa]:os};function X0(i){function t(){let L=!1;const mt=new Re;let V=null;const j=new Re(0,0,0,0);return{setMask:function(ft){V!==ft&&!L&&(i.colorMask(ft,ft,ft,ft),V=ft)},setLocked:function(ft){L=ft},setClear:function(ft,gt,ne,Le,je){je===!0&&(ft*=Le,gt*=Le,ne*=Le),mt.set(ft,gt,ne,Le),j.equals(mt)===!1&&(i.clearColor(ft,gt,ne,Le),j.copy(mt))},reset:function(){L=!1,V=null,j.set(-1,0,0,0)}}}function e(){let L=!1,mt=!1,V=null,j=null,ft=null;return{setReversed:function(gt){mt=gt},setTest:function(gt){gt?Et(i.DEPTH_TEST):vt(i.DEPTH_TEST)},setMask:function(gt){V!==gt&&!L&&(i.depthMask(gt),V=gt)},setFunc:function(gt){if(mt&&(gt=W0[gt]),j!==gt){switch(gt){case Ka:i.depthFunc(i.NEVER);break;case ja:i.depthFunc(i.ALWAYS);break;case Za:i.depthFunc(i.LESS);break;case os:i.depthFunc(i.LEQUAL);break;case Ja:i.depthFunc(i.EQUAL);break;case Qa:i.depthFunc(i.GEQUAL);break;case to:i.depthFunc(i.GREATER);break;case eo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}j=gt}},setLocked:function(gt){L=gt},setClear:function(gt){ft!==gt&&(i.clearDepth(gt),ft=gt)},reset:function(){L=!1,V=null,j=null,ft=null}}}function n(){let L=!1,mt=null,V=null,j=null,ft=null,gt=null,ne=null,Le=null,je=null;return{setTest:function(oe){L||(oe?Et(i.STENCIL_TEST):vt(i.STENCIL_TEST))},setMask:function(oe){mt!==oe&&!L&&(i.stencilMask(oe),mt=oe)},setFunc:function(oe,Ze,In){(V!==oe||j!==Ze||ft!==In)&&(i.stencilFunc(oe,Ze,In),V=oe,j=Ze,ft=In)},setOp:function(oe,Ze,In){(gt!==oe||ne!==Ze||Le!==In)&&(i.stencilOp(oe,Ze,In),gt=oe,ne=Ze,Le=In)},setLocked:function(oe){L=oe},setClear:function(oe){je!==oe&&(i.clearStencil(oe),je=oe)},reset:function(){L=!1,mt=null,V=null,j=null,ft=null,gt=null,ne=null,Le=null,je=null}}}const s=new t,r=new e,a=new n,o=new WeakMap,c=new WeakMap;let l={},h={},d=new WeakMap,u=[],f=null,g=!1,_=null,m=null,p=null,M=null,x=null,S=null,C=null,y=new yt(0,0,0),A=0,R=!1,N=null,v=null,b=null,F=null,z=null;const H=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let tt=!1,G=0;const rt=i.getParameter(i.VERSION);rt.indexOf("WebGL")!==-1?(G=parseFloat(/^WebGL (\d)/.exec(rt)[1]),tt=G>=1):rt.indexOf("OpenGL ES")!==-1&&(G=parseFloat(/^OpenGL ES (\d)/.exec(rt)[1]),tt=G>=2);let W=null,_t={};const xt=i.getParameter(i.SCISSOR_BOX),Tt=i.getParameter(i.VIEWPORT),ae=new Re().fromArray(xt),ue=new Re().fromArray(Tt);function q(L,mt,V,j){const ft=new Uint8Array(4),gt=i.createTexture();i.bindTexture(L,gt),i.texParameteri(L,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(L,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ne=0;ne<V;ne++)L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY?i.texImage3D(mt,0,i.RGBA,1,1,j,0,i.RGBA,i.UNSIGNED_BYTE,ft):i.texImage2D(mt+ne,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ft);return gt}const it={};it[i.TEXTURE_2D]=q(i.TEXTURE_2D,i.TEXTURE_2D,1),it[i.TEXTURE_CUBE_MAP]=q(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),it[i.TEXTURE_2D_ARRAY]=q(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),it[i.TEXTURE_3D]=q(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),r.setClear(1),a.setClear(0),Et(i.DEPTH_TEST),r.setFunc(os),Zt(!1),se(wc),Et(i.CULL_FACE),P(Qn);function Et(L){l[L]!==!0&&(i.enable(L),l[L]=!0)}function vt(L){l[L]!==!1&&(i.disable(L),l[L]=!1)}function Ht(L,mt){return h[L]!==mt?(i.bindFramebuffer(L,mt),h[L]=mt,L===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=mt),L===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=mt),!0):!1}function Dt(L,mt){let V=u,j=!1;if(L){V=d.get(mt),V===void 0&&(V=[],d.set(mt,V));const ft=L.textures;if(V.length!==ft.length||V[0]!==i.COLOR_ATTACHMENT0){for(let gt=0,ne=ft.length;gt<ne;gt++)V[gt]=i.COLOR_ATTACHMENT0+gt;V.length=ft.length,j=!0}}else V[0]!==i.BACK&&(V[0]=i.BACK,j=!0);j&&i.drawBuffers(V)}function te(L){return f!==L?(i.useProgram(L),f=L,!0):!1}const me={[yi]:i.FUNC_ADD,[ad]:i.FUNC_SUBTRACT,[od]:i.FUNC_REVERSE_SUBTRACT};me[cd]=i.MIN,me[ld]=i.MAX;const ee={[hd]:i.ZERO,[dd]:i.ONE,[ud]:i.SRC_COLOR,[Ya]:i.SRC_ALPHA,[xd]:i.SRC_ALPHA_SATURATE,[gd]:i.DST_COLOR,[pd]:i.DST_ALPHA,[fd]:i.ONE_MINUS_SRC_COLOR,[$a]:i.ONE_MINUS_SRC_ALPHA,[_d]:i.ONE_MINUS_DST_COLOR,[md]:i.ONE_MINUS_DST_ALPHA,[vd]:i.CONSTANT_COLOR,[Md]:i.ONE_MINUS_CONSTANT_COLOR,[yd]:i.CONSTANT_ALPHA,[Sd]:i.ONE_MINUS_CONSTANT_ALPHA};function P(L,mt,V,j,ft,gt,ne,Le,je,oe){if(L===Qn){g===!0&&(vt(i.BLEND),g=!1);return}if(g===!1&&(Et(i.BLEND),g=!0),L!==rd){if(L!==_||oe!==R){if((m!==yi||x!==yi)&&(i.blendEquation(i.FUNC_ADD),m=yi,x=yi),oe)switch(L){case ss:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case qa:i.blendFunc(i.ONE,i.ONE);break;case bc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ec:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case ss:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case qa:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case bc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ec:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}p=null,M=null,S=null,C=null,y.set(0,0,0),A=0,_=L,R=oe}return}ft=ft||mt,gt=gt||V,ne=ne||j,(mt!==m||ft!==x)&&(i.blendEquationSeparate(me[mt],me[ft]),m=mt,x=ft),(V!==p||j!==M||gt!==S||ne!==C)&&(i.blendFuncSeparate(ee[V],ee[j],ee[gt],ee[ne]),p=V,M=j,S=gt,C=ne),(Le.equals(y)===!1||je!==A)&&(i.blendColor(Le.r,Le.g,Le.b,je),y.copy(Le),A=je),_=L,R=!1}function nn(L,mt){L.side===Ve?vt(i.CULL_FACE):Et(i.CULL_FACE);let V=L.side===Ke;mt&&(V=!V),Zt(V),L.blending===ss&&L.transparent===!1?P(Qn):P(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),r.setFunc(L.depthFunc),r.setTest(L.depthTest),r.setMask(L.depthWrite),s.setMask(L.colorWrite);const j=L.stencilWrite;a.setTest(j),j&&(a.setMask(L.stencilWriteMask),a.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),a.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),xe(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?Et(i.SAMPLE_ALPHA_TO_COVERAGE):vt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Zt(L){N!==L&&(L?i.frontFace(i.CW):i.frontFace(i.CCW),N=L)}function se(L){L!==id?(Et(i.CULL_FACE),L!==v&&(L===wc?i.cullFace(i.BACK):L===sd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):vt(i.CULL_FACE),v=L}function Nt(L){L!==b&&(tt&&i.lineWidth(L),b=L)}function xe(L,mt,V){L?(Et(i.POLYGON_OFFSET_FILL),(F!==mt||z!==V)&&(i.polygonOffset(mt,V),F=mt,z=V)):vt(i.POLYGON_OFFSET_FILL)}function kt(L){L?Et(i.SCISSOR_TEST):vt(i.SCISSOR_TEST)}function T(L){L===void 0&&(L=i.TEXTURE0+H-1),W!==L&&(i.activeTexture(L),W=L)}function w(L,mt,V){V===void 0&&(W===null?V=i.TEXTURE0+H-1:V=W);let j=_t[V];j===void 0&&(j={type:void 0,texture:void 0},_t[V]=j),(j.type!==L||j.texture!==mt)&&(W!==V&&(i.activeTexture(V),W=V),i.bindTexture(L,mt||it[L]),j.type=L,j.texture=mt)}function O(){const L=_t[W];L!==void 0&&L.type!==void 0&&(i.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function $(){try{i.compressedTexImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function et(){try{i.compressedTexImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Y(){try{i.texSubImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Rt(){try{i.texSubImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function dt(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Mt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function re(){try{i.texStorage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function st(){try{i.texStorage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function St(){try{i.texImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Ft(){try{i.texImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Ot(L){ae.equals(L)===!1&&(i.scissor(L.x,L.y,L.z,L.w),ae.copy(L))}function wt(L){ue.equals(L)===!1&&(i.viewport(L.x,L.y,L.z,L.w),ue.copy(L))}function Jt(L,mt){let V=c.get(mt);V===void 0&&(V=new WeakMap,c.set(mt,V));let j=V.get(L);j===void 0&&(j=i.getUniformBlockIndex(mt,L.name),V.set(L,j))}function Vt(L,mt){const j=c.get(mt).get(L);o.get(mt)!==j&&(i.uniformBlockBinding(mt,j,L.__bindingPointIndex),o.set(mt,j))}function _e(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),l={},W=null,_t={},h={},d=new WeakMap,u=[],f=null,g=!1,_=null,m=null,p=null,M=null,x=null,S=null,C=null,y=new yt(0,0,0),A=0,R=!1,N=null,v=null,b=null,F=null,z=null,ae.set(0,0,i.canvas.width,i.canvas.height),ue.set(0,0,i.canvas.width,i.canvas.height),s.reset(),r.reset(),a.reset()}return{buffers:{color:s,depth:r,stencil:a},enable:Et,disable:vt,bindFramebuffer:Ht,drawBuffers:Dt,useProgram:te,setBlending:P,setMaterial:nn,setFlipSided:Zt,setCullFace:se,setLineWidth:Nt,setPolygonOffset:xe,setScissorTest:kt,activeTexture:T,bindTexture:w,unbindTexture:O,compressedTexImage2D:$,compressedTexImage3D:et,texImage2D:St,texImage3D:Ft,updateUBOMapping:Jt,uniformBlockBinding:Vt,texStorage2D:re,texStorage3D:st,texSubImage2D:Y,texSubImage3D:Rt,compressedTexSubImage2D:dt,compressedTexSubImage3D:Mt,scissor:Ot,viewport:wt,reset:_e}}function pl(i,t,e,n){const s=q0(n);switch(e){case Jl:return i*t;case th:return i*t;case eh:return i*t*2;case qo:return i*t/s.components*s.byteLength;case Yo:return i*t/s.components*s.byteLength;case nh:return i*t*2/s.components*s.byteLength;case $o:return i*t*2/s.components*s.byteLength;case Ql:return i*t*3/s.components*s.byteLength;case wn:return i*t*4/s.components*s.byteLength;case Ko:return i*t*4/s.components*s.byteLength;case br:case Er:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ar:case Tr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ao:case co:return Math.max(i,16)*Math.max(t,8)/4;case ro:case oo:return Math.max(i,8)*Math.max(t,8)/2;case lo:case ho:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case uo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case fo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case po:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case mo:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case go:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case _o:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case xo:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case vo:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Mo:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case yo:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case So:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case wo:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case bo:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Eo:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Ao:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Rr:case To:case Ro:return Math.ceil(i/4)*Math.ceil(t/4)*16;case ih:case Co:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Po:case Lo:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function q0(i){switch(i){case Wn:case Kl:return{byteLength:1,components:1};case ks:case jl:case Bs:return{byteLength:2,components:1};case Wo:case Xo:return{byteLength:2,components:4};case Ai:case Vo:case Ln:return{byteLength:4,components:1};case Zl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function Y0(i,t,e,n,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Bt,h=new WeakMap;let d;const u=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(T,w){return f?new OffscreenCanvas(T,w):kr("canvas")}function _(T,w,O){let $=1;const et=kt(T);if((et.width>O||et.height>O)&&($=O/Math.max(et.width,et.height)),$<1)if(typeof HTMLImageElement!="undefined"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&T instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&T instanceof ImageBitmap||typeof VideoFrame!="undefined"&&T instanceof VideoFrame){const Y=Math.floor($*et.width),Rt=Math.floor($*et.height);d===void 0&&(d=g(Y,Rt));const dt=w?g(Y,Rt):d;return dt.width=Y,dt.height=Rt,dt.getContext("2d").drawImage(T,0,0,Y,Rt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+et.width+"x"+et.height+") to ("+Y+"x"+Rt+")."),dt}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+et.width+"x"+et.height+")."),T;return T}function m(T){return T.generateMipmaps&&T.minFilter!==en&&T.minFilter!==Sn}function p(T){i.generateMipmap(T)}function M(T,w,O,$,et=!1){if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let Y=w;if(w===i.RED&&(O===i.FLOAT&&(Y=i.R32F),O===i.HALF_FLOAT&&(Y=i.R16F),O===i.UNSIGNED_BYTE&&(Y=i.R8)),w===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(Y=i.R8UI),O===i.UNSIGNED_SHORT&&(Y=i.R16UI),O===i.UNSIGNED_INT&&(Y=i.R32UI),O===i.BYTE&&(Y=i.R8I),O===i.SHORT&&(Y=i.R16I),O===i.INT&&(Y=i.R32I)),w===i.RG&&(O===i.FLOAT&&(Y=i.RG32F),O===i.HALF_FLOAT&&(Y=i.RG16F),O===i.UNSIGNED_BYTE&&(Y=i.RG8)),w===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&(Y=i.RG8UI),O===i.UNSIGNED_SHORT&&(Y=i.RG16UI),O===i.UNSIGNED_INT&&(Y=i.RG32UI),O===i.BYTE&&(Y=i.RG8I),O===i.SHORT&&(Y=i.RG16I),O===i.INT&&(Y=i.RG32I)),w===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&(Y=i.RGB8UI),O===i.UNSIGNED_SHORT&&(Y=i.RGB16UI),O===i.UNSIGNED_INT&&(Y=i.RGB32UI),O===i.BYTE&&(Y=i.RGB8I),O===i.SHORT&&(Y=i.RGB16I),O===i.INT&&(Y=i.RGB32I)),w===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&(Y=i.RGBA8UI),O===i.UNSIGNED_SHORT&&(Y=i.RGBA16UI),O===i.UNSIGNED_INT&&(Y=i.RGBA32UI),O===i.BYTE&&(Y=i.RGBA8I),O===i.SHORT&&(Y=i.RGBA16I),O===i.INT&&(Y=i.RGBA32I)),w===i.RGB&&O===i.UNSIGNED_INT_5_9_9_9_REV&&(Y=i.RGB9_E5),w===i.RGBA){const Rt=et?Ur:de.getTransfer($);O===i.FLOAT&&(Y=i.RGBA32F),O===i.HALF_FLOAT&&(Y=i.RGBA16F),O===i.UNSIGNED_BYTE&&(Y=Rt===Me?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT_4_4_4_4&&(Y=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(Y=i.RGB5_A1)}return(Y===i.R16F||Y===i.R32F||Y===i.RG16F||Y===i.RG32F||Y===i.RGBA16F||Y===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Y}function x(T,w){let O;return T?w===null||w===Ai||w===ds?O=i.DEPTH24_STENCIL8:w===Ln?O=i.DEPTH32F_STENCIL8:w===ks&&(O=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===Ai||w===ds?O=i.DEPTH_COMPONENT24:w===Ln?O=i.DEPTH_COMPONENT32F:w===ks&&(O=i.DEPTH_COMPONENT16),O}function S(T,w){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==en&&T.minFilter!==Sn?Math.log2(Math.max(w.width,w.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?w.mipmaps.length:1}function C(T){const w=T.target;w.removeEventListener("dispose",C),A(w),w.isVideoTexture&&h.delete(w)}function y(T){const w=T.target;w.removeEventListener("dispose",y),N(w)}function A(T){const w=n.get(T);if(w.__webglInit===void 0)return;const O=T.source,$=u.get(O);if($){const et=$[w.__cacheKey];et.usedTimes--,et.usedTimes===0&&R(T),Object.keys($).length===0&&u.delete(O)}n.remove(T)}function R(T){const w=n.get(T);i.deleteTexture(w.__webglTexture);const O=T.source,$=u.get(O);delete $[w.__cacheKey],a.memory.textures--}function N(T){const w=n.get(T);if(T.depthTexture&&T.depthTexture.dispose(),T.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(w.__webglFramebuffer[$]))for(let et=0;et<w.__webglFramebuffer[$].length;et++)i.deleteFramebuffer(w.__webglFramebuffer[$][et]);else i.deleteFramebuffer(w.__webglFramebuffer[$]);w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer[$])}else{if(Array.isArray(w.__webglFramebuffer))for(let $=0;$<w.__webglFramebuffer.length;$++)i.deleteFramebuffer(w.__webglFramebuffer[$]);else i.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&i.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let $=0;$<w.__webglColorRenderbuffer.length;$++)w.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(w.__webglColorRenderbuffer[$]);w.__webglDepthRenderbuffer&&i.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const O=T.textures;for(let $=0,et=O.length;$<et;$++){const Y=n.get(O[$]);Y.__webglTexture&&(i.deleteTexture(Y.__webglTexture),a.memory.textures--),n.remove(O[$])}n.remove(T)}let v=0;function b(){v=0}function F(){const T=v;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),v+=1,T}function z(T){const w=[];return w.push(T.wrapS),w.push(T.wrapT),w.push(T.wrapR||0),w.push(T.magFilter),w.push(T.minFilter),w.push(T.anisotropy),w.push(T.internalFormat),w.push(T.format),w.push(T.type),w.push(T.generateMipmaps),w.push(T.premultiplyAlpha),w.push(T.flipY),w.push(T.unpackAlignment),w.push(T.colorSpace),w.join()}function H(T,w){const O=n.get(T);if(T.isVideoTexture&&Nt(T),T.isRenderTargetTexture===!1&&T.version>0&&O.__version!==T.version){const $=T.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ue(O,T,w);return}}e.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+w)}function tt(T,w){const O=n.get(T);if(T.version>0&&O.__version!==T.version){ue(O,T,w);return}e.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+w)}function G(T,w){const O=n.get(T);if(T.version>0&&O.__version!==T.version){ue(O,T,w);return}e.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+w)}function rt(T,w){const O=n.get(T);if(T.version>0&&O.__version!==T.version){q(O,T,w);return}e.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+w)}const W={[hs]:i.REPEAT,[wi]:i.CLAMP_TO_EDGE,[so]:i.MIRRORED_REPEAT},_t={[en]:i.NEAREST,[Id]:i.NEAREST_MIPMAP_NEAREST,[Xs]:i.NEAREST_MIPMAP_LINEAR,[Sn]:i.LINEAR,[ea]:i.LINEAR_MIPMAP_NEAREST,[bi]:i.LINEAR_MIPMAP_LINEAR},xt={[Fd]:i.NEVER,[Hd]:i.ALWAYS,[Od]:i.LESS,[sh]:i.LEQUAL,[kd]:i.EQUAL,[Gd]:i.GEQUAL,[zd]:i.GREATER,[Bd]:i.NOTEQUAL};function Tt(T,w){if(w.type===Ln&&t.has("OES_texture_float_linear")===!1&&(w.magFilter===Sn||w.magFilter===ea||w.magFilter===Xs||w.magFilter===bi||w.minFilter===Sn||w.minFilter===ea||w.minFilter===Xs||w.minFilter===bi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,W[w.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,W[w.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,W[w.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,_t[w.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,_t[w.minFilter]),w.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,xt[w.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===en||w.minFilter!==Xs&&w.minFilter!==bi||w.type===Ln&&t.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||n.get(w).__currentAnisotropy){const O=t.get("EXT_texture_filter_anisotropic");i.texParameterf(T,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,s.getMaxAnisotropy())),n.get(w).__currentAnisotropy=w.anisotropy}}}function ae(T,w){let O=!1;T.__webglInit===void 0&&(T.__webglInit=!0,w.addEventListener("dispose",C));const $=w.source;let et=u.get($);et===void 0&&(et={},u.set($,et));const Y=z(w);if(Y!==T.__cacheKey){et[Y]===void 0&&(et[Y]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,O=!0),et[Y].usedTimes++;const Rt=et[T.__cacheKey];Rt!==void 0&&(et[T.__cacheKey].usedTimes--,Rt.usedTimes===0&&R(w)),T.__cacheKey=Y,T.__webglTexture=et[Y].texture}return O}function ue(T,w,O){let $=i.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&($=i.TEXTURE_2D_ARRAY),w.isData3DTexture&&($=i.TEXTURE_3D);const et=ae(T,w),Y=w.source;e.bindTexture($,T.__webglTexture,i.TEXTURE0+O);const Rt=n.get(Y);if(Y.version!==Rt.__version||et===!0){e.activeTexture(i.TEXTURE0+O);const dt=de.getPrimaries(de.workingColorSpace),Mt=w.colorSpace===Jn?null:de.getPrimaries(w.colorSpace),re=w.colorSpace===Jn||dt===Mt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,re);let st=_(w.image,!1,s.maxTextureSize);st=xe(w,st);const St=r.convert(w.format,w.colorSpace),Ft=r.convert(w.type);let Ot=M(w.internalFormat,St,Ft,w.colorSpace,w.isVideoTexture);Tt($,w);let wt;const Jt=w.mipmaps,Vt=w.isVideoTexture!==!0,_e=Rt.__version===void 0||et===!0,L=Y.dataReady,mt=S(w,st);if(w.isDepthTexture)Ot=x(w.format===us,w.type),_e&&(Vt?e.texStorage2D(i.TEXTURE_2D,1,Ot,st.width,st.height):e.texImage2D(i.TEXTURE_2D,0,Ot,st.width,st.height,0,St,Ft,null));else if(w.isDataTexture)if(Jt.length>0){Vt&&_e&&e.texStorage2D(i.TEXTURE_2D,mt,Ot,Jt[0].width,Jt[0].height);for(let V=0,j=Jt.length;V<j;V++)wt=Jt[V],Vt?L&&e.texSubImage2D(i.TEXTURE_2D,V,0,0,wt.width,wt.height,St,Ft,wt.data):e.texImage2D(i.TEXTURE_2D,V,Ot,wt.width,wt.height,0,St,Ft,wt.data);w.generateMipmaps=!1}else Vt?(_e&&e.texStorage2D(i.TEXTURE_2D,mt,Ot,st.width,st.height),L&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,st.width,st.height,St,Ft,st.data)):e.texImage2D(i.TEXTURE_2D,0,Ot,st.width,st.height,0,St,Ft,st.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){Vt&&_e&&e.texStorage3D(i.TEXTURE_2D_ARRAY,mt,Ot,Jt[0].width,Jt[0].height,st.depth);for(let V=0,j=Jt.length;V<j;V++)if(wt=Jt[V],w.format!==wn)if(St!==null)if(Vt){if(L)if(w.layerUpdates.size>0){const ft=pl(wt.width,wt.height,w.format,w.type);for(const gt of w.layerUpdates){const ne=wt.data.subarray(gt*ft/wt.data.BYTES_PER_ELEMENT,(gt+1)*ft/wt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,V,0,0,gt,wt.width,wt.height,1,St,ne,0,0)}w.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,V,0,0,0,wt.width,wt.height,st.depth,St,wt.data,0,0)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,V,Ot,wt.width,wt.height,st.depth,0,wt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Vt?L&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,V,0,0,0,wt.width,wt.height,st.depth,St,Ft,wt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,V,Ot,wt.width,wt.height,st.depth,0,St,Ft,wt.data)}else{Vt&&_e&&e.texStorage2D(i.TEXTURE_2D,mt,Ot,Jt[0].width,Jt[0].height);for(let V=0,j=Jt.length;V<j;V++)wt=Jt[V],w.format!==wn?St!==null?Vt?L&&e.compressedTexSubImage2D(i.TEXTURE_2D,V,0,0,wt.width,wt.height,St,wt.data):e.compressedTexImage2D(i.TEXTURE_2D,V,Ot,wt.width,wt.height,0,wt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Vt?L&&e.texSubImage2D(i.TEXTURE_2D,V,0,0,wt.width,wt.height,St,Ft,wt.data):e.texImage2D(i.TEXTURE_2D,V,Ot,wt.width,wt.height,0,St,Ft,wt.data)}else if(w.isDataArrayTexture)if(Vt){if(_e&&e.texStorage3D(i.TEXTURE_2D_ARRAY,mt,Ot,st.width,st.height,st.depth),L)if(w.layerUpdates.size>0){const V=pl(st.width,st.height,w.format,w.type);for(const j of w.layerUpdates){const ft=st.data.subarray(j*V/st.data.BYTES_PER_ELEMENT,(j+1)*V/st.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,j,st.width,st.height,1,St,Ft,ft)}w.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,st.width,st.height,st.depth,St,Ft,st.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ot,st.width,st.height,st.depth,0,St,Ft,st.data);else if(w.isData3DTexture)Vt?(_e&&e.texStorage3D(i.TEXTURE_3D,mt,Ot,st.width,st.height,st.depth),L&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,st.width,st.height,st.depth,St,Ft,st.data)):e.texImage3D(i.TEXTURE_3D,0,Ot,st.width,st.height,st.depth,0,St,Ft,st.data);else if(w.isFramebufferTexture){if(_e)if(Vt)e.texStorage2D(i.TEXTURE_2D,mt,Ot,st.width,st.height);else{let V=st.width,j=st.height;for(let ft=0;ft<mt;ft++)e.texImage2D(i.TEXTURE_2D,ft,Ot,V,j,0,St,Ft,null),V>>=1,j>>=1}}else if(Jt.length>0){if(Vt&&_e){const V=kt(Jt[0]);e.texStorage2D(i.TEXTURE_2D,mt,Ot,V.width,V.height)}for(let V=0,j=Jt.length;V<j;V++)wt=Jt[V],Vt?L&&e.texSubImage2D(i.TEXTURE_2D,V,0,0,St,Ft,wt):e.texImage2D(i.TEXTURE_2D,V,Ot,St,Ft,wt);w.generateMipmaps=!1}else if(Vt){if(_e){const V=kt(st);e.texStorage2D(i.TEXTURE_2D,mt,Ot,V.width,V.height)}L&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,St,Ft,st)}else e.texImage2D(i.TEXTURE_2D,0,Ot,St,Ft,st);m(w)&&p($),Rt.__version=Y.version,w.onUpdate&&w.onUpdate(w)}T.__version=w.version}function q(T,w,O){if(w.image.length!==6)return;const $=ae(T,w),et=w.source;e.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+O);const Y=n.get(et);if(et.version!==Y.__version||$===!0){e.activeTexture(i.TEXTURE0+O);const Rt=de.getPrimaries(de.workingColorSpace),dt=w.colorSpace===Jn?null:de.getPrimaries(w.colorSpace),Mt=w.colorSpace===Jn||Rt===dt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Mt);const re=w.isCompressedTexture||w.image[0].isCompressedTexture,st=w.image[0]&&w.image[0].isDataTexture,St=[];for(let j=0;j<6;j++)!re&&!st?St[j]=_(w.image[j],!0,s.maxCubemapSize):St[j]=st?w.image[j].image:w.image[j],St[j]=xe(w,St[j]);const Ft=St[0],Ot=r.convert(w.format,w.colorSpace),wt=r.convert(w.type),Jt=M(w.internalFormat,Ot,wt,w.colorSpace),Vt=w.isVideoTexture!==!0,_e=Y.__version===void 0||$===!0,L=et.dataReady;let mt=S(w,Ft);Tt(i.TEXTURE_CUBE_MAP,w);let V;if(re){Vt&&_e&&e.texStorage2D(i.TEXTURE_CUBE_MAP,mt,Jt,Ft.width,Ft.height);for(let j=0;j<6;j++){V=St[j].mipmaps;for(let ft=0;ft<V.length;ft++){const gt=V[ft];w.format!==wn?Ot!==null?Vt?L&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ft,0,0,gt.width,gt.height,Ot,gt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ft,Jt,gt.width,gt.height,0,gt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Vt?L&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ft,0,0,gt.width,gt.height,Ot,wt,gt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ft,Jt,gt.width,gt.height,0,Ot,wt,gt.data)}}}else{if(V=w.mipmaps,Vt&&_e){V.length>0&&mt++;const j=kt(St[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,mt,Jt,j.width,j.height)}for(let j=0;j<6;j++)if(st){Vt?L&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,St[j].width,St[j].height,Ot,wt,St[j].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Jt,St[j].width,St[j].height,0,Ot,wt,St[j].data);for(let ft=0;ft<V.length;ft++){const ne=V[ft].image[j].image;Vt?L&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ft+1,0,0,ne.width,ne.height,Ot,wt,ne.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ft+1,Jt,ne.width,ne.height,0,Ot,wt,ne.data)}}else{Vt?L&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,Ot,wt,St[j]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Jt,Ot,wt,St[j]);for(let ft=0;ft<V.length;ft++){const gt=V[ft];Vt?L&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ft+1,0,0,Ot,wt,gt.image[j]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ft+1,Jt,Ot,wt,gt.image[j])}}}m(w)&&p(i.TEXTURE_CUBE_MAP),Y.__version=et.version,w.onUpdate&&w.onUpdate(w)}T.__version=w.version}function it(T,w,O,$,et,Y){const Rt=r.convert(O.format,O.colorSpace),dt=r.convert(O.type),Mt=M(O.internalFormat,Rt,dt,O.colorSpace);if(!n.get(w).__hasExternalTextures){const st=Math.max(1,w.width>>Y),St=Math.max(1,w.height>>Y);et===i.TEXTURE_3D||et===i.TEXTURE_2D_ARRAY?e.texImage3D(et,Y,Mt,st,St,w.depth,0,Rt,dt,null):e.texImage2D(et,Y,Mt,st,St,0,Rt,dt,null)}e.bindFramebuffer(i.FRAMEBUFFER,T),se(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,et,n.get(O).__webglTexture,0,Zt(w)):(et===i.TEXTURE_2D||et>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&et<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,$,et,n.get(O).__webglTexture,Y),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Et(T,w,O){if(i.bindRenderbuffer(i.RENDERBUFFER,T),w.depthBuffer){const $=w.depthTexture,et=$&&$.isDepthTexture?$.type:null,Y=x(w.stencilBuffer,et),Rt=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,dt=Zt(w);se(w)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,dt,Y,w.width,w.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,dt,Y,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,Y,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Rt,i.RENDERBUFFER,T)}else{const $=w.textures;for(let et=0;et<$.length;et++){const Y=$[et],Rt=r.convert(Y.format,Y.colorSpace),dt=r.convert(Y.type),Mt=M(Y.internalFormat,Rt,dt,Y.colorSpace),re=Zt(w);O&&se(w)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,re,Mt,w.width,w.height):se(w)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,re,Mt,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,Mt,w.width,w.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function vt(T,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,T),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(w.depthTexture).__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),H(w.depthTexture,0);const $=n.get(w.depthTexture).__webglTexture,et=Zt(w);if(w.depthTexture.format===rs)se(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,$,0,et):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,$,0);else if(w.depthTexture.format===us)se(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,$,0,et):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,$,0);else throw new Error("Unknown depthTexture format")}function Ht(T){const w=n.get(T),O=T.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==T.depthTexture){const $=T.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),$){const et=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,$.removeEventListener("dispose",et)};$.addEventListener("dispose",et),w.__depthDisposeCallback=et}w.__boundDepthTexture=$}if(T.depthTexture&&!w.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");vt(w.__webglFramebuffer,T)}else if(O){w.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(e.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[$]),w.__webglDepthbuffer[$]===void 0)w.__webglDepthbuffer[$]=i.createRenderbuffer(),Et(w.__webglDepthbuffer[$],T,!1);else{const et=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Y=w.__webglDepthbuffer[$];i.bindRenderbuffer(i.RENDERBUFFER,Y),i.framebufferRenderbuffer(i.FRAMEBUFFER,et,i.RENDERBUFFER,Y)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=i.createRenderbuffer(),Et(w.__webglDepthbuffer,T,!1);else{const $=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,et=w.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,et),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,et)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Dt(T,w,O){const $=n.get(T);w!==void 0&&it($.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&Ht(T)}function te(T){const w=T.texture,O=n.get(T),$=n.get(w);T.addEventListener("dispose",y);const et=T.textures,Y=T.isWebGLCubeRenderTarget===!0,Rt=et.length>1;if(Rt||($.__webglTexture===void 0&&($.__webglTexture=i.createTexture()),$.__version=w.version,a.memory.textures++),Y){O.__webglFramebuffer=[];for(let dt=0;dt<6;dt++)if(w.mipmaps&&w.mipmaps.length>0){O.__webglFramebuffer[dt]=[];for(let Mt=0;Mt<w.mipmaps.length;Mt++)O.__webglFramebuffer[dt][Mt]=i.createFramebuffer()}else O.__webglFramebuffer[dt]=i.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){O.__webglFramebuffer=[];for(let dt=0;dt<w.mipmaps.length;dt++)O.__webglFramebuffer[dt]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(Rt)for(let dt=0,Mt=et.length;dt<Mt;dt++){const re=n.get(et[dt]);re.__webglTexture===void 0&&(re.__webglTexture=i.createTexture(),a.memory.textures++)}if(T.samples>0&&se(T)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let dt=0;dt<et.length;dt++){const Mt=et[dt];O.__webglColorRenderbuffer[dt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[dt]);const re=r.convert(Mt.format,Mt.colorSpace),st=r.convert(Mt.type),St=M(Mt.internalFormat,re,st,Mt.colorSpace,T.isXRRenderTarget===!0),Ft=Zt(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ft,St,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+dt,i.RENDERBUFFER,O.__webglColorRenderbuffer[dt])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),Et(O.__webglDepthRenderbuffer,T,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Y){e.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),Tt(i.TEXTURE_CUBE_MAP,w);for(let dt=0;dt<6;dt++)if(w.mipmaps&&w.mipmaps.length>0)for(let Mt=0;Mt<w.mipmaps.length;Mt++)it(O.__webglFramebuffer[dt][Mt],T,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Mt);else it(O.__webglFramebuffer[dt],T,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0);m(w)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Rt){for(let dt=0,Mt=et.length;dt<Mt;dt++){const re=et[dt],st=n.get(re);e.bindTexture(i.TEXTURE_2D,st.__webglTexture),Tt(i.TEXTURE_2D,re),it(O.__webglFramebuffer,T,re,i.COLOR_ATTACHMENT0+dt,i.TEXTURE_2D,0),m(re)&&p(i.TEXTURE_2D)}e.unbindTexture()}else{let dt=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(dt=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(dt,$.__webglTexture),Tt(dt,w),w.mipmaps&&w.mipmaps.length>0)for(let Mt=0;Mt<w.mipmaps.length;Mt++)it(O.__webglFramebuffer[Mt],T,w,i.COLOR_ATTACHMENT0,dt,Mt);else it(O.__webglFramebuffer,T,w,i.COLOR_ATTACHMENT0,dt,0);m(w)&&p(dt),e.unbindTexture()}T.depthBuffer&&Ht(T)}function me(T){const w=T.textures;for(let O=0,$=w.length;O<$;O++){const et=w[O];if(m(et)){const Y=T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,Rt=n.get(et).__webglTexture;e.bindTexture(Y,Rt),p(Y),e.unbindTexture()}}}const ee=[],P=[];function nn(T){if(T.samples>0){if(se(T)===!1){const w=T.textures,O=T.width,$=T.height;let et=i.COLOR_BUFFER_BIT;const Y=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Rt=n.get(T),dt=w.length>1;if(dt)for(let Mt=0;Mt<w.length;Mt++)e.bindFramebuffer(i.FRAMEBUFFER,Rt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Mt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Rt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Mt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Rt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Rt.__webglFramebuffer);for(let Mt=0;Mt<w.length;Mt++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(et|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(et|=i.STENCIL_BUFFER_BIT)),dt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Rt.__webglColorRenderbuffer[Mt]);const re=n.get(w[Mt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,re,0)}i.blitFramebuffer(0,0,O,$,0,0,O,$,et,i.NEAREST),c===!0&&(ee.length=0,P.length=0,ee.push(i.COLOR_ATTACHMENT0+Mt),T.depthBuffer&&T.resolveDepthBuffer===!1&&(ee.push(Y),P.push(Y),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,P)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ee))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),dt)for(let Mt=0;Mt<w.length;Mt++){e.bindFramebuffer(i.FRAMEBUFFER,Rt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Mt,i.RENDERBUFFER,Rt.__webglColorRenderbuffer[Mt]);const re=n.get(w[Mt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Rt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Mt,i.TEXTURE_2D,re,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Rt.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&c){const w=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[w])}}}function Zt(T){return Math.min(s.maxSamples,T.samples)}function se(T){const w=n.get(T);return T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function Nt(T){const w=a.render.frame;h.get(T)!==w&&(h.set(T,w),T.update())}function xe(T,w){const O=T.colorSpace,$=T.format,et=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||O!==ri&&O!==Jn&&(de.getTransfer(O)===Me?($!==wn||et!==Wn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),w}function kt(T){return typeof HTMLImageElement!="undefined"&&T instanceof HTMLImageElement?(l.width=T.naturalWidth||T.width,l.height=T.naturalHeight||T.height):typeof VideoFrame!="undefined"&&T instanceof VideoFrame?(l.width=T.displayWidth,l.height=T.displayHeight):(l.width=T.width,l.height=T.height),l}this.allocateTextureUnit=F,this.resetTextureUnits=b,this.setTexture2D=H,this.setTexture2DArray=tt,this.setTexture3D=G,this.setTextureCube=rt,this.rebindTextures=Dt,this.setupRenderTarget=te,this.updateRenderTargetMipmap=me,this.updateMultisampleRenderTarget=nn,this.setupDepthRenderbuffer=Ht,this.setupFrameBufferTexture=it,this.useMultisampledRTT=se}function $0(i,t){function e(n,s=Jn){let r;const a=de.getTransfer(s);if(n===Wn)return i.UNSIGNED_BYTE;if(n===Wo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Xo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Zl)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Kl)return i.BYTE;if(n===jl)return i.SHORT;if(n===ks)return i.UNSIGNED_SHORT;if(n===Vo)return i.INT;if(n===Ai)return i.UNSIGNED_INT;if(n===Ln)return i.FLOAT;if(n===Bs)return i.HALF_FLOAT;if(n===Jl)return i.ALPHA;if(n===Ql)return i.RGB;if(n===wn)return i.RGBA;if(n===th)return i.LUMINANCE;if(n===eh)return i.LUMINANCE_ALPHA;if(n===rs)return i.DEPTH_COMPONENT;if(n===us)return i.DEPTH_STENCIL;if(n===qo)return i.RED;if(n===Yo)return i.RED_INTEGER;if(n===nh)return i.RG;if(n===$o)return i.RG_INTEGER;if(n===Ko)return i.RGBA_INTEGER;if(n===br||n===Er||n===Ar||n===Tr)if(a===Me)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===br)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Er)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ar)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Tr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===br)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Er)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ar)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Tr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ro||n===ao||n===oo||n===co)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ro)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ao)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===oo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===co)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===lo||n===ho||n===uo)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===lo||n===ho)return a===Me?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===uo)return a===Me?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===fo||n===po||n===mo||n===go||n===_o||n===xo||n===vo||n===Mo||n===yo||n===So||n===wo||n===bo||n===Eo||n===Ao)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===fo)return a===Me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===po)return a===Me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===mo)return a===Me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===go)return a===Me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===_o)return a===Me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===xo)return a===Me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===vo)return a===Me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Mo)return a===Me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===yo)return a===Me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===So)return a===Me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===wo)return a===Me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===bo)return a===Me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Eo)return a===Me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ao)return a===Me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Rr||n===To||n===Ro)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Rr)return a===Me?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===To)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ro)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ih||n===Co||n===Po||n===Lo)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Rr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Co)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Po)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Lo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ds?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class K0 extends ln{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class ut extends jt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const j0={type:"move"};class La{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ut,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ut,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ut,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),p=this._getHandJoint(l,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,g=.005;l.inputState.pinching&&u>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&u<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(j0)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new ut;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Z0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,J0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Q0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new We,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new ii({vertexShader:Z0,fragmentShader:J0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new K(new Vn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class tg extends gs{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,d=null,u=null,f=null,g=null;const _=new Q0,m=e.getContextAttributes();let p=null,M=null;const x=[],S=[],C=new Bt;let y=null;const A=new ln;A.layers.enable(1),A.viewport=new Re;const R=new ln;R.layers.enable(2),R.viewport=new Re;const N=[A,R],v=new K0;v.layers.enable(1),v.layers.enable(2);let b=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let it=x[q];return it===void 0&&(it=new La,x[q]=it),it.getTargetRaySpace()},this.getControllerGrip=function(q){let it=x[q];return it===void 0&&(it=new La,x[q]=it),it.getGripSpace()},this.getHand=function(q){let it=x[q];return it===void 0&&(it=new La,x[q]=it),it.getHandSpace()};function z(q){const it=S.indexOf(q.inputSource);if(it===-1)return;const Et=x[it];Et!==void 0&&(Et.update(q.inputSource,q.frame,l||a),Et.dispatchEvent({type:q.type,data:q.inputSource}))}function H(){s.removeEventListener("select",z),s.removeEventListener("selectstart",z),s.removeEventListener("selectend",z),s.removeEventListener("squeeze",z),s.removeEventListener("squeezestart",z),s.removeEventListener("squeezeend",z),s.removeEventListener("end",H),s.removeEventListener("inputsourceschange",tt);for(let q=0;q<x.length;q++){const it=S[q];it!==null&&(S[q]=null,x[q].disconnect(it))}b=null,F=null,_.reset(),t.setRenderTarget(p),f=null,u=null,d=null,s=null,M=null,ue.stop(),n.isPresenting=!1,t.setPixelRatio(y),t.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){r=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){o=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(q){l=q},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(q){if(s=q,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",z),s.addEventListener("selectstart",z),s.addEventListener("selectend",z),s.addEventListener("squeeze",z),s.addEventListener("squeezestart",z),s.addEventListener("squeezeend",z),s.addEventListener("end",H),s.addEventListener("inputsourceschange",tt),m.xrCompatible!==!0&&await e.makeXRCompatible(),y=t.getPixelRatio(),t.getSize(C),s.renderState.layers===void 0){const it={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,it),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new Ti(f.framebufferWidth,f.framebufferHeight,{format:wn,type:Wn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let it=null,Et=null,vt=null;m.depth&&(vt=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,it=m.stencil?us:rs,Et=m.stencil?ds:Ai);const Ht={colorFormat:e.RGBA8,depthFormat:vt,scaleFactor:r};d=new XRWebGLBinding(s,e),u=d.createProjectionLayer(Ht),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),M=new Ti(u.textureWidth,u.textureHeight,{format:wn,type:Wn,depthTexture:new xh(u.textureWidth,u.textureHeight,Et,void 0,void 0,void 0,void 0,void 0,void 0,it),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),ue.setContext(s),ue.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function tt(q){for(let it=0;it<q.removed.length;it++){const Et=q.removed[it],vt=S.indexOf(Et);vt>=0&&(S[vt]=null,x[vt].disconnect(Et))}for(let it=0;it<q.added.length;it++){const Et=q.added[it];let vt=S.indexOf(Et);if(vt===-1){for(let Dt=0;Dt<x.length;Dt++)if(Dt>=S.length){S.push(Et),vt=Dt;break}else if(S[Dt]===null){S[Dt]=Et,vt=Dt;break}if(vt===-1)break}const Ht=x[vt];Ht&&Ht.connect(Et)}}const G=new U,rt=new U;function W(q,it,Et){G.setFromMatrixPosition(it.matrixWorld),rt.setFromMatrixPosition(Et.matrixWorld);const vt=G.distanceTo(rt),Ht=it.projectionMatrix.elements,Dt=Et.projectionMatrix.elements,te=Ht[14]/(Ht[10]-1),me=Ht[14]/(Ht[10]+1),ee=(Ht[9]+1)/Ht[5],P=(Ht[9]-1)/Ht[5],nn=(Ht[8]-1)/Ht[0],Zt=(Dt[8]+1)/Dt[0],se=te*nn,Nt=te*Zt,xe=vt/(-nn+Zt),kt=xe*-nn;if(it.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(kt),q.translateZ(xe),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),Ht[10]===-1)q.projectionMatrix.copy(it.projectionMatrix),q.projectionMatrixInverse.copy(it.projectionMatrixInverse);else{const T=te+xe,w=me+xe,O=se-kt,$=Nt+(vt-kt),et=ee*me/w*T,Y=P*me/w*T;q.projectionMatrix.makePerspective(O,$,et,Y,T,w),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function _t(q,it){it===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(it.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(s===null)return;let it=q.near,Et=q.far;_.texture!==null&&(_.depthNear>0&&(it=_.depthNear),_.depthFar>0&&(Et=_.depthFar)),v.near=R.near=A.near=it,v.far=R.far=A.far=Et,(b!==v.near||F!==v.far)&&(s.updateRenderState({depthNear:v.near,depthFar:v.far}),b=v.near,F=v.far);const vt=q.parent,Ht=v.cameras;_t(v,vt);for(let Dt=0;Dt<Ht.length;Dt++)_t(Ht[Dt],vt);Ht.length===2?W(v,A,R):v.projectionMatrix.copy(A.projectionMatrix),xt(q,v,vt)};function xt(q,it,Et){Et===null?q.matrix.copy(it.matrixWorld):(q.matrix.copy(Et.matrixWorld),q.matrix.invert(),q.matrix.multiply(it.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(it.projectionMatrix),q.projectionMatrixInverse.copy(it.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=Do*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return v},this.getFoveation=function(){if(!(u===null&&f===null))return c},this.setFoveation=function(q){c=q,u!==null&&(u.fixedFoveation=q),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=q)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(v)};let Tt=null;function ae(q,it){if(h=it.getViewerPose(l||a),g=it,h!==null){const Et=h.views;f!==null&&(t.setRenderTargetFramebuffer(M,f.framebuffer),t.setRenderTarget(M));let vt=!1;Et.length!==v.cameras.length&&(v.cameras.length=0,vt=!0);for(let Dt=0;Dt<Et.length;Dt++){const te=Et[Dt];let me=null;if(f!==null)me=f.getViewport(te);else{const P=d.getViewSubImage(u,te);me=P.viewport,Dt===0&&(t.setRenderTargetTextures(M,P.colorTexture,u.ignoreDepthValues?void 0:P.depthStencilTexture),t.setRenderTarget(M))}let ee=N[Dt];ee===void 0&&(ee=new ln,ee.layers.enable(Dt),ee.viewport=new Re,N[Dt]=ee),ee.matrix.fromArray(te.transform.matrix),ee.matrix.decompose(ee.position,ee.quaternion,ee.scale),ee.projectionMatrix.fromArray(te.projectionMatrix),ee.projectionMatrixInverse.copy(ee.projectionMatrix).invert(),ee.viewport.set(me.x,me.y,me.width,me.height),Dt===0&&(v.matrix.copy(ee.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale)),vt===!0&&v.cameras.push(ee)}const Ht=s.enabledFeatures;if(Ht&&Ht.includes("depth-sensing")){const Dt=d.getDepthInformation(Et[0]);Dt&&Dt.isValid&&Dt.texture&&_.init(t,Dt,s.renderState)}}for(let Et=0;Et<x.length;Et++){const vt=S[Et],Ht=x[Et];vt!==null&&Ht!==void 0&&Ht.update(vt,it,l||a)}Tt&&Tt(q,it),it.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:it}),g=null}const ue=new gh;ue.setAnimationLoop(ae),this.setAnimationLoop=function(q){Tt=q},this.dispose=function(){}}}const pi=new bn,eg=new ie;function ng(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,fh(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,M,x,S){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),d(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),u(m,p),p.isMeshPhysicalMaterial&&f(m,p,S)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?c(m,p,M,x):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Ke&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Ke&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const M=t.get(p),x=M.envMap,S=M.envMapRotation;x&&(m.envMap.value=x,pi.copy(S),pi.x*=-1,pi.y*=-1,pi.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(pi.y*=-1,pi.z*=-1),m.envMapRotation.value.setFromMatrix4(eg.makeRotationFromEuler(pi)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,M,x){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*M,m.scale.value=x*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function u(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,M){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ke&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const M=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function ig(i,t,e,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(M,x){const S=x.program;n.uniformBlockBinding(M,S)}function l(M,x){let S=s[M.id];S===void 0&&(g(M),S=h(M),s[M.id]=S,M.addEventListener("dispose",m));const C=x.program;n.updateUBOMapping(M,C);const y=t.render.frame;r[M.id]!==y&&(u(M),r[M.id]=y)}function h(M){const x=d();M.__bindingPointIndex=x;const S=i.createBuffer(),C=M.__size,y=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,C,y),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,S),S}function d(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(M){const x=s[M.id],S=M.uniforms,C=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let y=0,A=S.length;y<A;y++){const R=Array.isArray(S[y])?S[y]:[S[y]];for(let N=0,v=R.length;N<v;N++){const b=R[N];if(f(b,y,N,C)===!0){const F=b.__offset,z=Array.isArray(b.value)?b.value:[b.value];let H=0;for(let tt=0;tt<z.length;tt++){const G=z[tt],rt=_(G);typeof G=="number"||typeof G=="boolean"?(b.__data[0]=G,i.bufferSubData(i.UNIFORM_BUFFER,F+H,b.__data)):G.isMatrix3?(b.__data[0]=G.elements[0],b.__data[1]=G.elements[1],b.__data[2]=G.elements[2],b.__data[3]=0,b.__data[4]=G.elements[3],b.__data[5]=G.elements[4],b.__data[6]=G.elements[5],b.__data[7]=0,b.__data[8]=G.elements[6],b.__data[9]=G.elements[7],b.__data[10]=G.elements[8],b.__data[11]=0):(G.toArray(b.__data,H),H+=rt.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,F,b.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(M,x,S,C){const y=M.value,A=x+"_"+S;if(C[A]===void 0)return typeof y=="number"||typeof y=="boolean"?C[A]=y:C[A]=y.clone(),!0;{const R=C[A];if(typeof y=="number"||typeof y=="boolean"){if(R!==y)return C[A]=y,!0}else if(R.equals(y)===!1)return R.copy(y),!0}return!1}function g(M){const x=M.uniforms;let S=0;const C=16;for(let A=0,R=x.length;A<R;A++){const N=Array.isArray(x[A])?x[A]:[x[A]];for(let v=0,b=N.length;v<b;v++){const F=N[v],z=Array.isArray(F.value)?F.value:[F.value];for(let H=0,tt=z.length;H<tt;H++){const G=z[H],rt=_(G),W=S%C,_t=W%rt.boundary,xt=W+_t;S+=_t,xt!==0&&C-xt<rt.storage&&(S+=C-xt),F.__data=new Float32Array(rt.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=S,S+=rt.storage}}}const y=S%C;return y>0&&(S+=C-y),M.__size=S,M.__cache={},this}function _(M){const x={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(x.boundary=4,x.storage=4):M.isVector2?(x.boundary=8,x.storage=8):M.isVector3||M.isColor?(x.boundary=16,x.storage=12):M.isVector4?(x.boundary=16,x.storage=16):M.isMatrix3?(x.boundary=48,x.storage=48):M.isMatrix4?(x.boundary=64,x.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),x}function m(M){const x=M.target;x.removeEventListener("dispose",m);const S=a.indexOf(x.__bindingPointIndex);a.splice(S,1),i.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function p(){for(const M in s)i.deleteBuffer(s[M]);a=[],s={},r={}}return{bind:c,update:l,dispose:p}}class wh{constructor(t={}){const{canvas:e=Wd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1}=t;this.isWebGLRenderer=!0;let u;if(n!==null){if(typeof WebGLRenderingContext!="undefined"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=n.getContextAttributes().alpha}else u=a;const f=new Uint32Array(4),g=new Int32Array(4);let _=null,m=null;const p=[],M=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=De,this.toneMapping=ti,this.toneMappingExposure=1;const x=this;let S=!1,C=0,y=0,A=null,R=-1,N=null;const v=new Re,b=new Re;let F=null;const z=new yt(0);let H=0,tt=e.width,G=e.height,rt=1,W=null,_t=null;const xt=new Re(0,0,tt,G),Tt=new Re(0,0,tt,G);let ae=!1;const ue=new Jo;let q=!1,it=!1;const Et=new ie,vt=new ie,Ht=new U,Dt=new Re,te={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let me=!1;function ee(){return A===null?rt:1}let P=n;function nn(E,I){return e.getContext(E,I)}try{const E={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ho}`),e.addEventListener("webglcontextlost",j,!1),e.addEventListener("webglcontextrestored",ft,!1),e.addEventListener("webglcontextcreationerror",gt,!1),P===null){const I="webgl2";if(P=nn(I,E),P===null)throw nn(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Zt,se,Nt,xe,kt,T,w,O,$,et,Y,Rt,dt,Mt,re,st,St,Ft,Ot,wt,Jt,Vt,_e,L;function mt(){Zt=new lm(P),Zt.init(),Vt=new $0(P,Zt),se=new im(P,Zt,t,Vt),Nt=new X0(P),se.reverseDepthBuffer&&Nt.buffers.depth.setReversed(!0),xe=new um(P),kt=new P0,T=new Y0(P,Zt,Nt,kt,se,Vt,xe),w=new rm(x),O=new cm(x),$=new xu(P),_e=new em(P,$),et=new hm(P,$,xe,_e),Y=new pm(P,et,$,xe),Ot=new fm(P,se,T),st=new sm(kt),Rt=new C0(x,w,O,Zt,se,_e,st),dt=new ng(x,kt),Mt=new I0,re=new k0(Zt),Ft=new tm(x,w,O,Nt,Y,u,c),St=new V0(x,Y,se),L=new ig(P,xe,se,Nt),wt=new nm(P,Zt,xe),Jt=new dm(P,Zt,xe),xe.programs=Rt.programs,x.capabilities=se,x.extensions=Zt,x.properties=kt,x.renderLists=Mt,x.shadowMap=St,x.state=Nt,x.info=xe}mt();const V=new tg(x,P);this.xr=V,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const E=Zt.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Zt.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return rt},this.setPixelRatio=function(E){E!==void 0&&(rt=E,this.setSize(tt,G,!1))},this.getSize=function(E){return E.set(tt,G)},this.setSize=function(E,I,k=!0){if(V.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}tt=E,G=I,e.width=Math.floor(E*rt),e.height=Math.floor(I*rt),k===!0&&(e.style.width=E+"px",e.style.height=I+"px"),this.setViewport(0,0,E,I)},this.getDrawingBufferSize=function(E){return E.set(tt*rt,G*rt).floor()},this.setDrawingBufferSize=function(E,I,k){tt=E,G=I,rt=k,e.width=Math.floor(E*k),e.height=Math.floor(I*k),this.setViewport(0,0,E,I)},this.getCurrentViewport=function(E){return E.copy(v)},this.getViewport=function(E){return E.copy(xt)},this.setViewport=function(E,I,k,B){E.isVector4?xt.set(E.x,E.y,E.z,E.w):xt.set(E,I,k,B),Nt.viewport(v.copy(xt).multiplyScalar(rt).round())},this.getScissor=function(E){return E.copy(Tt)},this.setScissor=function(E,I,k,B){E.isVector4?Tt.set(E.x,E.y,E.z,E.w):Tt.set(E,I,k,B),Nt.scissor(b.copy(Tt).multiplyScalar(rt).round())},this.getScissorTest=function(){return ae},this.setScissorTest=function(E){Nt.setScissorTest(ae=E)},this.setOpaqueSort=function(E){W=E},this.setTransparentSort=function(E){_t=E},this.getClearColor=function(E){return E.copy(Ft.getClearColor())},this.setClearColor=function(){Ft.setClearColor.apply(Ft,arguments)},this.getClearAlpha=function(){return Ft.getClearAlpha()},this.setClearAlpha=function(){Ft.setClearAlpha.apply(Ft,arguments)},this.clear=function(E=!0,I=!0,k=!0){let B=0;if(E){let D=!1;if(A!==null){const at=A.texture.format;D=at===Ko||at===$o||at===Yo}if(D){const at=A.texture.type,pt=at===Wn||at===Ai||at===ks||at===ds||at===Wo||at===Xo,bt=Ft.getClearColor(),At=Ft.getClearAlpha(),It=bt.r,Ut=bt.g,Ct=bt.b;pt?(f[0]=It,f[1]=Ut,f[2]=Ct,f[3]=At,P.clearBufferuiv(P.COLOR,0,f)):(g[0]=It,g[1]=Ut,g[2]=Ct,g[3]=At,P.clearBufferiv(P.COLOR,0,g))}else B|=P.COLOR_BUFFER_BIT}I&&(B|=P.DEPTH_BUFFER_BIT,P.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),k&&(B|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",j,!1),e.removeEventListener("webglcontextrestored",ft,!1),e.removeEventListener("webglcontextcreationerror",gt,!1),Mt.dispose(),re.dispose(),kt.dispose(),w.dispose(),O.dispose(),Y.dispose(),_e.dispose(),L.dispose(),Rt.dispose(),V.dispose(),V.removeEventListener("sessionstart",rc),V.removeEventListener("sessionend",ac),ci.stop()};function j(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),S=!0}function ft(){console.log("THREE.WebGLRenderer: Context Restored."),S=!1;const E=xe.autoReset,I=St.enabled,k=St.autoUpdate,B=St.needsUpdate,D=St.type;mt(),xe.autoReset=E,St.enabled=I,St.autoUpdate=k,St.needsUpdate=B,St.type=D}function gt(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function ne(E){const I=E.target;I.removeEventListener("dispose",ne),Le(I)}function Le(E){je(E),kt.remove(E)}function je(E){const I=kt.get(E).programs;I!==void 0&&(I.forEach(function(k){Rt.releaseProgram(k)}),E.isShaderMaterial&&Rt.releaseShaderCache(E))}this.renderBufferDirect=function(E,I,k,B,D,at){I===null&&(I=te);const pt=D.isMesh&&D.matrixWorld.determinant()<0,bt=Fh(E,I,k,B,D);Nt.setMaterial(B,pt);let At=k.index,It=1;if(B.wireframe===!0){if(At=et.getWireframeAttribute(k),At===void 0)return;It=2}const Ut=k.drawRange,Ct=k.attributes.position;let fe=Ut.start*It,ve=(Ut.start+Ut.count)*It;at!==null&&(fe=Math.max(fe,at.start*It),ve=Math.min(ve,(at.start+at.count)*It)),At!==null?(fe=Math.max(fe,0),ve=Math.min(ve,At.count)):Ct!=null&&(fe=Math.max(fe,0),ve=Math.min(ve,Ct.count));const Ae=ve-fe;if(Ae<0||Ae===1/0)return;_e.setup(D,B,bt,k,At);let sn,le=wt;if(At!==null&&(sn=$.get(At),le=Jt,le.setIndex(sn)),D.isMesh)B.wireframe===!0?(Nt.setLineWidth(B.wireframeLinewidth*ee()),le.setMode(P.LINES)):le.setMode(P.TRIANGLES);else if(D.isLine){let Pt=B.linewidth;Pt===void 0&&(Pt=1),Nt.setLineWidth(Pt*ee()),D.isLineSegments?le.setMode(P.LINES):D.isLineLoop?le.setMode(P.LINE_LOOP):le.setMode(P.LINE_STRIP)}else D.isPoints?le.setMode(P.POINTS):D.isSprite&&le.setMode(P.TRIANGLES);if(D.isBatchedMesh)if(D._multiDrawInstances!==null)le.renderMultiDrawInstances(D._multiDrawStarts,D._multiDrawCounts,D._multiDrawCount,D._multiDrawInstances);else if(Zt.get("WEBGL_multi_draw"))le.renderMultiDraw(D._multiDrawStarts,D._multiDrawCounts,D._multiDrawCount);else{const Pt=D._multiDrawStarts,Oe=D._multiDrawCounts,he=D._multiDrawCount,pn=At?$.get(At).bytesPerElement:1,Ii=kt.get(B).currentProgram.getUniforms();for(let rn=0;rn<he;rn++)Ii.setValue(P,"_gl_DrawID",rn),le.render(Pt[rn]/pn,Oe[rn])}else if(D.isInstancedMesh)le.renderInstances(fe,Ae,D.count);else if(k.isInstancedBufferGeometry){const Pt=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,Oe=Math.min(k.instanceCount,Pt);le.renderInstances(fe,Ae,Oe)}else le.render(fe,Ae)};function oe(E,I,k){E.transparent===!0&&E.side===Ve&&E.forceSinglePass===!1?(E.side=Ke,E.needsUpdate=!0,Vs(E,I,k),E.side=ni,E.needsUpdate=!0,Vs(E,I,k),E.side=Ve):Vs(E,I,k)}this.compile=function(E,I,k=null){k===null&&(k=E),m=re.get(k),m.init(I),M.push(m),k.traverseVisible(function(D){D.isLight&&D.layers.test(I.layers)&&(m.pushLight(D),D.castShadow&&m.pushShadow(D))}),E!==k&&E.traverseVisible(function(D){D.isLight&&D.layers.test(I.layers)&&(m.pushLight(D),D.castShadow&&m.pushShadow(D))}),m.setupLights();const B=new Set;return E.traverse(function(D){if(!(D.isMesh||D.isPoints||D.isLine||D.isSprite))return;const at=D.material;if(at)if(Array.isArray(at))for(let pt=0;pt<at.length;pt++){const bt=at[pt];oe(bt,k,D),B.add(bt)}else oe(at,k,D),B.add(at)}),M.pop(),m=null,B},this.compileAsync=function(E,I,k=null){const B=this.compile(E,I,k);return new Promise(D=>{function at(){if(B.forEach(function(pt){kt.get(pt).currentProgram.isReady()&&B.delete(pt)}),B.size===0){D(E);return}setTimeout(at,10)}Zt.get("KHR_parallel_shader_compile")!==null?at():setTimeout(at,10)})};let Ze=null;function In(E){Ze&&Ze(E)}function rc(){ci.stop()}function ac(){ci.start()}const ci=new gh;ci.setAnimationLoop(In),typeof self!="undefined"&&ci.setContext(self),this.setAnimationLoop=function(E){Ze=E,V.setAnimationLoop(E),E===null?ci.stop():ci.start()},V.addEventListener("sessionstart",rc),V.addEventListener("sessionend",ac),this.render=function(E,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(S===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),V.enabled===!0&&V.isPresenting===!0&&(V.cameraAutoUpdate===!0&&V.updateCamera(I),I=V.getCamera()),E.isScene===!0&&E.onBeforeRender(x,E,I,A),m=re.get(E,M.length),m.init(I),M.push(m),vt.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),ue.setFromProjectionMatrix(vt),it=this.localClippingEnabled,q=st.init(this.clippingPlanes,it),_=Mt.get(E,p.length),_.init(),p.push(_),V.enabled===!0&&V.isPresenting===!0){const at=x.xr.getDepthSensingMesh();at!==null&&Kr(at,I,-1/0,x.sortObjects)}Kr(E,I,0,x.sortObjects),_.finish(),x.sortObjects===!0&&_.sort(W,_t),me=V.enabled===!1||V.isPresenting===!1||V.hasDepthSensing()===!1,me&&Ft.addToRenderList(_,E),this.info.render.frame++,q===!0&&st.beginShadows();const k=m.state.shadowsArray;St.render(k,E,I),q===!0&&st.endShadows(),this.info.autoReset===!0&&this.info.reset();const B=_.opaque,D=_.transmissive;if(m.setupLights(),I.isArrayCamera){const at=I.cameras;if(D.length>0)for(let pt=0,bt=at.length;pt<bt;pt++){const At=at[pt];cc(B,D,E,At)}me&&Ft.render(E);for(let pt=0,bt=at.length;pt<bt;pt++){const At=at[pt];oc(_,E,At,At.viewport)}}else D.length>0&&cc(B,D,E,I),me&&Ft.render(E),oc(_,E,I);A!==null&&(T.updateMultisampleRenderTarget(A),T.updateRenderTargetMipmap(A)),E.isScene===!0&&E.onAfterRender(x,E,I),_e.resetDefaultState(),R=-1,N=null,M.pop(),M.length>0?(m=M[M.length-1],q===!0&&st.setGlobalState(x.clippingPlanes,m.state.camera)):m=null,p.pop(),p.length>0?_=p[p.length-1]:_=null};function Kr(E,I,k,B){if(E.visible===!1)return;if(E.layers.test(I.layers)){if(E.isGroup)k=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(I);else if(E.isLight)m.pushLight(E),E.castShadow&&m.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||ue.intersectsSprite(E)){B&&Dt.setFromMatrixPosition(E.matrixWorld).applyMatrix4(vt);const pt=Y.update(E),bt=E.material;bt.visible&&_.push(E,pt,bt,k,Dt.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||ue.intersectsObject(E))){const pt=Y.update(E),bt=E.material;if(B&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Dt.copy(E.boundingSphere.center)):(pt.boundingSphere===null&&pt.computeBoundingSphere(),Dt.copy(pt.boundingSphere.center)),Dt.applyMatrix4(E.matrixWorld).applyMatrix4(vt)),Array.isArray(bt)){const At=pt.groups;for(let It=0,Ut=At.length;It<Ut;It++){const Ct=At[It],fe=bt[Ct.materialIndex];fe&&fe.visible&&_.push(E,pt,fe,k,Dt.z,Ct)}}else bt.visible&&_.push(E,pt,bt,k,Dt.z,null)}}const at=E.children;for(let pt=0,bt=at.length;pt<bt;pt++)Kr(at[pt],I,k,B)}function oc(E,I,k,B){const D=E.opaque,at=E.transmissive,pt=E.transparent;m.setupLightsView(k),q===!0&&st.setGlobalState(x.clippingPlanes,k),B&&Nt.viewport(v.copy(B)),D.length>0&&Hs(D,I,k),at.length>0&&Hs(at,I,k),pt.length>0&&Hs(pt,I,k),Nt.buffers.depth.setTest(!0),Nt.buffers.depth.setMask(!0),Nt.buffers.color.setMask(!0),Nt.setPolygonOffset(!1)}function cc(E,I,k,B){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[B.id]===void 0&&(m.state.transmissionRenderTarget[B.id]=new Ti(1,1,{generateMipmaps:!0,type:Zt.has("EXT_color_buffer_half_float")||Zt.has("EXT_color_buffer_float")?Bs:Wn,minFilter:bi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:de.workingColorSpace}));const at=m.state.transmissionRenderTarget[B.id],pt=B.viewport||v;at.setSize(pt.z,pt.w);const bt=x.getRenderTarget();x.setRenderTarget(at),x.getClearColor(z),H=x.getClearAlpha(),H<1&&x.setClearColor(16777215,.5),x.clear(),me&&Ft.render(k);const At=x.toneMapping;x.toneMapping=ti;const It=B.viewport;if(B.viewport!==void 0&&(B.viewport=void 0),m.setupLightsView(B),q===!0&&st.setGlobalState(x.clippingPlanes,B),Hs(E,k,B),T.updateMultisampleRenderTarget(at),T.updateRenderTargetMipmap(at),Zt.has("WEBGL_multisampled_render_to_texture")===!1){let Ut=!1;for(let Ct=0,fe=I.length;Ct<fe;Ct++){const ve=I[Ct],Ae=ve.object,sn=ve.geometry,le=ve.material,Pt=ve.group;if(le.side===Ve&&Ae.layers.test(B.layers)){const Oe=le.side;le.side=Ke,le.needsUpdate=!0,lc(Ae,k,B,sn,le,Pt),le.side=Oe,le.needsUpdate=!0,Ut=!0}}Ut===!0&&(T.updateMultisampleRenderTarget(at),T.updateRenderTargetMipmap(at))}x.setRenderTarget(bt),x.setClearColor(z,H),It!==void 0&&(B.viewport=It),x.toneMapping=At}function Hs(E,I,k){const B=I.isScene===!0?I.overrideMaterial:null;for(let D=0,at=E.length;D<at;D++){const pt=E[D],bt=pt.object,At=pt.geometry,It=B===null?pt.material:B,Ut=pt.group;bt.layers.test(k.layers)&&lc(bt,I,k,At,It,Ut)}}function lc(E,I,k,B,D,at){E.onBeforeRender(x,I,k,B,D,at),E.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),D.onBeforeRender(x,I,k,B,E,at),D.transparent===!0&&D.side===Ve&&D.forceSinglePass===!1?(D.side=Ke,D.needsUpdate=!0,x.renderBufferDirect(k,I,B,D,E,at),D.side=ni,D.needsUpdate=!0,x.renderBufferDirect(k,I,B,D,E,at),D.side=Ve):x.renderBufferDirect(k,I,B,D,E,at),E.onAfterRender(x,I,k,B,D,at)}function Vs(E,I,k){I.isScene!==!0&&(I=te);const B=kt.get(E),D=m.state.lights,at=m.state.shadowsArray,pt=D.state.version,bt=Rt.getParameters(E,D.state,at,I,k),At=Rt.getProgramCacheKey(bt);let It=B.programs;B.environment=E.isMeshStandardMaterial?I.environment:null,B.fog=I.fog,B.envMap=(E.isMeshStandardMaterial?O:w).get(E.envMap||B.environment),B.envMapRotation=B.environment!==null&&E.envMap===null?I.environmentRotation:E.envMapRotation,It===void 0&&(E.addEventListener("dispose",ne),It=new Map,B.programs=It);let Ut=It.get(At);if(Ut!==void 0){if(B.currentProgram===Ut&&B.lightsStateVersion===pt)return dc(E,bt),Ut}else bt.uniforms=Rt.getUniforms(E),E.onBeforeCompile(bt,x),Ut=Rt.acquireProgram(bt,At),It.set(At,Ut),B.uniforms=bt.uniforms;const Ct=B.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ct.clippingPlanes=st.uniform),dc(E,bt),B.needsLights=kh(E),B.lightsStateVersion=pt,B.needsLights&&(Ct.ambientLightColor.value=D.state.ambient,Ct.lightProbe.value=D.state.probe,Ct.directionalLights.value=D.state.directional,Ct.directionalLightShadows.value=D.state.directionalShadow,Ct.spotLights.value=D.state.spot,Ct.spotLightShadows.value=D.state.spotShadow,Ct.rectAreaLights.value=D.state.rectArea,Ct.ltc_1.value=D.state.rectAreaLTC1,Ct.ltc_2.value=D.state.rectAreaLTC2,Ct.pointLights.value=D.state.point,Ct.pointLightShadows.value=D.state.pointShadow,Ct.hemisphereLights.value=D.state.hemi,Ct.directionalShadowMap.value=D.state.directionalShadowMap,Ct.directionalShadowMatrix.value=D.state.directionalShadowMatrix,Ct.spotShadowMap.value=D.state.spotShadowMap,Ct.spotLightMatrix.value=D.state.spotLightMatrix,Ct.spotLightMap.value=D.state.spotLightMap,Ct.pointShadowMap.value=D.state.pointShadowMap,Ct.pointShadowMatrix.value=D.state.pointShadowMatrix),B.currentProgram=Ut,B.uniformsList=null,Ut}function hc(E){if(E.uniformsList===null){const I=E.currentProgram.getUniforms();E.uniformsList=Pr.seqWithValue(I.seq,E.uniforms)}return E.uniformsList}function dc(E,I){const k=kt.get(E);k.outputColorSpace=I.outputColorSpace,k.batching=I.batching,k.batchingColor=I.batchingColor,k.instancing=I.instancing,k.instancingColor=I.instancingColor,k.instancingMorph=I.instancingMorph,k.skinning=I.skinning,k.morphTargets=I.morphTargets,k.morphNormals=I.morphNormals,k.morphColors=I.morphColors,k.morphTargetsCount=I.morphTargetsCount,k.numClippingPlanes=I.numClippingPlanes,k.numIntersection=I.numClipIntersection,k.vertexAlphas=I.vertexAlphas,k.vertexTangents=I.vertexTangents,k.toneMapping=I.toneMapping}function Fh(E,I,k,B,D){I.isScene!==!0&&(I=te),T.resetTextureUnits();const at=I.fog,pt=B.isMeshStandardMaterial?I.environment:null,bt=A===null?x.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:ri,At=(B.isMeshStandardMaterial?O:w).get(B.envMap||pt),It=B.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Ut=!!k.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),Ct=!!k.morphAttributes.position,fe=!!k.morphAttributes.normal,ve=!!k.morphAttributes.color;let Ae=ti;B.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(Ae=x.toneMapping);const sn=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,le=sn!==void 0?sn.length:0,Pt=kt.get(B),Oe=m.state.lights;if(q===!0&&(it===!0||E!==N)){const hn=E===N&&B.id===R;st.setState(B,E,hn)}let he=!1;B.version===Pt.__version?(Pt.needsLights&&Pt.lightsStateVersion!==Oe.state.version||Pt.outputColorSpace!==bt||D.isBatchedMesh&&Pt.batching===!1||!D.isBatchedMesh&&Pt.batching===!0||D.isBatchedMesh&&Pt.batchingColor===!0&&D.colorTexture===null||D.isBatchedMesh&&Pt.batchingColor===!1&&D.colorTexture!==null||D.isInstancedMesh&&Pt.instancing===!1||!D.isInstancedMesh&&Pt.instancing===!0||D.isSkinnedMesh&&Pt.skinning===!1||!D.isSkinnedMesh&&Pt.skinning===!0||D.isInstancedMesh&&Pt.instancingColor===!0&&D.instanceColor===null||D.isInstancedMesh&&Pt.instancingColor===!1&&D.instanceColor!==null||D.isInstancedMesh&&Pt.instancingMorph===!0&&D.morphTexture===null||D.isInstancedMesh&&Pt.instancingMorph===!1&&D.morphTexture!==null||Pt.envMap!==At||B.fog===!0&&Pt.fog!==at||Pt.numClippingPlanes!==void 0&&(Pt.numClippingPlanes!==st.numPlanes||Pt.numIntersection!==st.numIntersection)||Pt.vertexAlphas!==It||Pt.vertexTangents!==Ut||Pt.morphTargets!==Ct||Pt.morphNormals!==fe||Pt.morphColors!==ve||Pt.toneMapping!==Ae||Pt.morphTargetsCount!==le)&&(he=!0):(he=!0,Pt.__version=B.version);let pn=Pt.currentProgram;he===!0&&(pn=Vs(B,I,D));let Ii=!1,rn=!1,jr=!1;const Ce=pn.getUniforms(),Xn=Pt.uniforms;if(Nt.useProgram(pn.program)&&(Ii=!0,rn=!0,jr=!0),B.id!==R&&(R=B.id,rn=!0),Ii||N!==E){se.reverseDepthBuffer?(Et.copy(E.projectionMatrix),qd(Et),Yd(Et),Ce.setValue(P,"projectionMatrix",Et)):Ce.setValue(P,"projectionMatrix",E.projectionMatrix),Ce.setValue(P,"viewMatrix",E.matrixWorldInverse);const hn=Ce.map.cameraPosition;hn!==void 0&&hn.setValue(P,Ht.setFromMatrixPosition(E.matrixWorld)),se.logarithmicDepthBuffer&&Ce.setValue(P,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&Ce.setValue(P,"isOrthographic",E.isOrthographicCamera===!0),N!==E&&(N=E,rn=!0,jr=!0)}if(D.isSkinnedMesh){Ce.setOptional(P,D,"bindMatrix"),Ce.setOptional(P,D,"bindMatrixInverse");const hn=D.skeleton;hn&&(hn.boneTexture===null&&hn.computeBoneTexture(),Ce.setValue(P,"boneTexture",hn.boneTexture,T))}D.isBatchedMesh&&(Ce.setOptional(P,D,"batchingTexture"),Ce.setValue(P,"batchingTexture",D._matricesTexture,T),Ce.setOptional(P,D,"batchingIdTexture"),Ce.setValue(P,"batchingIdTexture",D._indirectTexture,T),Ce.setOptional(P,D,"batchingColorTexture"),D._colorsTexture!==null&&Ce.setValue(P,"batchingColorTexture",D._colorsTexture,T));const Zr=k.morphAttributes;if((Zr.position!==void 0||Zr.normal!==void 0||Zr.color!==void 0)&&Ot.update(D,k,pn),(rn||Pt.receiveShadow!==D.receiveShadow)&&(Pt.receiveShadow=D.receiveShadow,Ce.setValue(P,"receiveShadow",D.receiveShadow)),B.isMeshGouraudMaterial&&B.envMap!==null&&(Xn.envMap.value=At,Xn.flipEnvMap.value=At.isCubeTexture&&At.isRenderTargetTexture===!1?-1:1),B.isMeshStandardMaterial&&B.envMap===null&&I.environment!==null&&(Xn.envMapIntensity.value=I.environmentIntensity),rn&&(Ce.setValue(P,"toneMappingExposure",x.toneMappingExposure),Pt.needsLights&&Oh(Xn,jr),at&&B.fog===!0&&dt.refreshFogUniforms(Xn,at),dt.refreshMaterialUniforms(Xn,B,rt,G,m.state.transmissionRenderTarget[E.id]),Pr.upload(P,hc(Pt),Xn,T)),B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(Pr.upload(P,hc(Pt),Xn,T),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&Ce.setValue(P,"center",D.center),Ce.setValue(P,"modelViewMatrix",D.modelViewMatrix),Ce.setValue(P,"normalMatrix",D.normalMatrix),Ce.setValue(P,"modelMatrix",D.matrixWorld),B.isShaderMaterial||B.isRawShaderMaterial){const hn=B.uniformsGroups;for(let Jr=0,zh=hn.length;Jr<zh;Jr++){const uc=hn[Jr];L.update(uc,pn),L.bind(uc,pn)}}return pn}function Oh(E,I){E.ambientLightColor.needsUpdate=I,E.lightProbe.needsUpdate=I,E.directionalLights.needsUpdate=I,E.directionalLightShadows.needsUpdate=I,E.pointLights.needsUpdate=I,E.pointLightShadows.needsUpdate=I,E.spotLights.needsUpdate=I,E.spotLightShadows.needsUpdate=I,E.rectAreaLights.needsUpdate=I,E.hemisphereLights.needsUpdate=I}function kh(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return y},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(E,I,k){kt.get(E.texture).__webglTexture=I,kt.get(E.depthTexture).__webglTexture=k;const B=kt.get(E);B.__hasExternalTextures=!0,B.__autoAllocateDepthBuffer=k===void 0,B.__autoAllocateDepthBuffer||Zt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),B.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,I){const k=kt.get(E);k.__webglFramebuffer=I,k.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(E,I=0,k=0){A=E,C=I,y=k;let B=!0,D=null,at=!1,pt=!1;if(E){const At=kt.get(E);if(At.__useDefaultFramebuffer!==void 0)Nt.bindFramebuffer(P.FRAMEBUFFER,null),B=!1;else if(At.__webglFramebuffer===void 0)T.setupRenderTarget(E);else if(At.__hasExternalTextures)T.rebindTextures(E,kt.get(E.texture).__webglTexture,kt.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Ct=E.depthTexture;if(At.__boundDepthTexture!==Ct){if(Ct!==null&&kt.has(Ct)&&(E.width!==Ct.image.width||E.height!==Ct.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");T.setupDepthRenderbuffer(E)}}const It=E.texture;(It.isData3DTexture||It.isDataArrayTexture||It.isCompressedArrayTexture)&&(pt=!0);const Ut=kt.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Ut[I])?D=Ut[I][k]:D=Ut[I],at=!0):E.samples>0&&T.useMultisampledRTT(E)===!1?D=kt.get(E).__webglMultisampledFramebuffer:Array.isArray(Ut)?D=Ut[k]:D=Ut,v.copy(E.viewport),b.copy(E.scissor),F=E.scissorTest}else v.copy(xt).multiplyScalar(rt).floor(),b.copy(Tt).multiplyScalar(rt).floor(),F=ae;if(Nt.bindFramebuffer(P.FRAMEBUFFER,D)&&B&&Nt.drawBuffers(E,D),Nt.viewport(v),Nt.scissor(b),Nt.setScissorTest(F),at){const At=kt.get(E.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+I,At.__webglTexture,k)}else if(pt){const At=kt.get(E.texture),It=I||0;P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,At.__webglTexture,k||0,It)}R=-1},this.readRenderTargetPixels=function(E,I,k,B,D,at,pt){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let bt=kt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&pt!==void 0&&(bt=bt[pt]),bt){Nt.bindFramebuffer(P.FRAMEBUFFER,bt);try{const At=E.texture,It=At.format,Ut=At.type;if(!se.textureFormatReadable(It)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!se.textureTypeReadable(Ut)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=E.width-B&&k>=0&&k<=E.height-D&&P.readPixels(I,k,B,D,Vt.convert(It),Vt.convert(Ut),at)}finally{const At=A!==null?kt.get(A).__webglFramebuffer:null;Nt.bindFramebuffer(P.FRAMEBUFFER,At)}}},this.readRenderTargetPixelsAsync=async function(E,I,k,B,D,at,pt){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let bt=kt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&pt!==void 0&&(bt=bt[pt]),bt){const At=E.texture,It=At.format,Ut=At.type;if(!se.textureFormatReadable(It))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!se.textureTypeReadable(Ut))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(I>=0&&I<=E.width-B&&k>=0&&k<=E.height-D){Nt.bindFramebuffer(P.FRAMEBUFFER,bt);const Ct=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,Ct),P.bufferData(P.PIXEL_PACK_BUFFER,at.byteLength,P.STREAM_READ),P.readPixels(I,k,B,D,Vt.convert(It),Vt.convert(Ut),0);const fe=A!==null?kt.get(A).__webglFramebuffer:null;Nt.bindFramebuffer(P.FRAMEBUFFER,fe);const ve=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await Xd(P,ve,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,Ct),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,at),P.deleteBuffer(Ct),P.deleteSync(ve),at}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,I=null,k=0){E.isTexture!==!0&&(Cr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),I=arguments[0]||null,E=arguments[1]);const B=Math.pow(2,-k),D=Math.floor(E.image.width*B),at=Math.floor(E.image.height*B),pt=I!==null?I.x:0,bt=I!==null?I.y:0;T.setTexture2D(E,0),P.copyTexSubImage2D(P.TEXTURE_2D,k,0,0,pt,bt,D,at),Nt.unbindTexture()},this.copyTextureToTexture=function(E,I,k=null,B=null,D=0){E.isTexture!==!0&&(Cr("WebGLRenderer: copyTextureToTexture function signature has changed."),B=arguments[0]||null,E=arguments[1],I=arguments[2],D=arguments[3]||0,k=null);let at,pt,bt,At,It,Ut;k!==null?(at=k.max.x-k.min.x,pt=k.max.y-k.min.y,bt=k.min.x,At=k.min.y):(at=E.image.width,pt=E.image.height,bt=0,At=0),B!==null?(It=B.x,Ut=B.y):(It=0,Ut=0);const Ct=Vt.convert(I.format),fe=Vt.convert(I.type);T.setTexture2D(I,0),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,I.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,I.unpackAlignment);const ve=P.getParameter(P.UNPACK_ROW_LENGTH),Ae=P.getParameter(P.UNPACK_IMAGE_HEIGHT),sn=P.getParameter(P.UNPACK_SKIP_PIXELS),le=P.getParameter(P.UNPACK_SKIP_ROWS),Pt=P.getParameter(P.UNPACK_SKIP_IMAGES),Oe=E.isCompressedTexture?E.mipmaps[D]:E.image;P.pixelStorei(P.UNPACK_ROW_LENGTH,Oe.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Oe.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,bt),P.pixelStorei(P.UNPACK_SKIP_ROWS,At),E.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,D,It,Ut,at,pt,Ct,fe,Oe.data):E.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,D,It,Ut,Oe.width,Oe.height,Ct,Oe.data):P.texSubImage2D(P.TEXTURE_2D,D,It,Ut,at,pt,Ct,fe,Oe),P.pixelStorei(P.UNPACK_ROW_LENGTH,ve),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Ae),P.pixelStorei(P.UNPACK_SKIP_PIXELS,sn),P.pixelStorei(P.UNPACK_SKIP_ROWS,le),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Pt),D===0&&I.generateMipmaps&&P.generateMipmap(P.TEXTURE_2D),Nt.unbindTexture()},this.copyTextureToTexture3D=function(E,I,k=null,B=null,D=0){E.isTexture!==!0&&(Cr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),k=arguments[0]||null,B=arguments[1]||null,E=arguments[2],I=arguments[3],D=arguments[4]||0);let at,pt,bt,At,It,Ut,Ct,fe,ve;const Ae=E.isCompressedTexture?E.mipmaps[D]:E.image;k!==null?(at=k.max.x-k.min.x,pt=k.max.y-k.min.y,bt=k.max.z-k.min.z,At=k.min.x,It=k.min.y,Ut=k.min.z):(at=Ae.width,pt=Ae.height,bt=Ae.depth,At=0,It=0,Ut=0),B!==null?(Ct=B.x,fe=B.y,ve=B.z):(Ct=0,fe=0,ve=0);const sn=Vt.convert(I.format),le=Vt.convert(I.type);let Pt;if(I.isData3DTexture)T.setTexture3D(I,0),Pt=P.TEXTURE_3D;else if(I.isDataArrayTexture||I.isCompressedArrayTexture)T.setTexture2DArray(I,0),Pt=P.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,I.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,I.unpackAlignment);const Oe=P.getParameter(P.UNPACK_ROW_LENGTH),he=P.getParameter(P.UNPACK_IMAGE_HEIGHT),pn=P.getParameter(P.UNPACK_SKIP_PIXELS),Ii=P.getParameter(P.UNPACK_SKIP_ROWS),rn=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,Ae.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Ae.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,At),P.pixelStorei(P.UNPACK_SKIP_ROWS,It),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Ut),E.isDataTexture||E.isData3DTexture?P.texSubImage3D(Pt,D,Ct,fe,ve,at,pt,bt,sn,le,Ae.data):I.isCompressedArrayTexture?P.compressedTexSubImage3D(Pt,D,Ct,fe,ve,at,pt,bt,sn,Ae.data):P.texSubImage3D(Pt,D,Ct,fe,ve,at,pt,bt,sn,le,Ae),P.pixelStorei(P.UNPACK_ROW_LENGTH,Oe),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,he),P.pixelStorei(P.UNPACK_SKIP_PIXELS,pn),P.pixelStorei(P.UNPACK_SKIP_ROWS,Ii),P.pixelStorei(P.UNPACK_SKIP_IMAGES,rn),D===0&&I.generateMipmaps&&P.generateMipmap(Pt),Nt.unbindTexture()},this.initRenderTarget=function(E){kt.get(E).__webglFramebuffer===void 0&&T.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?T.setTextureCube(E,0):E.isData3DTexture?T.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?T.setTexture2DArray(E,0):T.setTexture2D(E,0),Nt.unbindTexture()},this.resetState=function(){C=0,y=0,A=null,Nt.reset(),_e.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Hn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Zo?"display-p3":"srgb",e.unpackColorSpace=de.workingColorSpace===Yr?"display-p3":"srgb"}}class tc{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new yt(t),this.near=e,this.far=n}clone(){return new tc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class bh extends jt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new bn,this.environmentIntensity=1,this.environmentRotation=new bn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class sg{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Io,this.updateRanges=[],this.version=0,this.uuid=ei()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ei()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ei()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const qe=new U;class zr{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)qe.fromBufferAttribute(this,e),qe.applyMatrix4(t),this.setXYZ(e,qe.x,qe.y,qe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)qe.fromBufferAttribute(this,e),qe.applyNormalMatrix(t),this.setXYZ(e,qe.x,qe.y,qe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)qe.fromBufferAttribute(this,e),qe.transformDirection(t),this.setXYZ(e,qe.x,qe.y,qe.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=Cn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ge(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Cn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Cn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Cn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Cn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array),s=ge(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array),s=ge(s,this.array),r=ge(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Xe(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new zr(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class ec extends ai{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new yt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Yi;const As=new U,$i=new U,Ki=new U,ji=new Bt,Ts=new Bt,Eh=new ie,ur=new U,Rs=new U,fr=new U,ml=new Bt,Ia=new Bt,gl=new Bt;class Ah extends jt{constructor(t=new ec){if(super(),this.isSprite=!0,this.type="Sprite",Yi===void 0){Yi=new Be;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new sg(e,5);Yi.setIndex([0,1,2,0,2,3]),Yi.setAttribute("position",new zr(n,3,0,!1)),Yi.setAttribute("uv",new zr(n,2,3,!1))}this.geometry=Yi,this.material=t,this.center=new Bt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),$i.setFromMatrixScale(this.matrixWorld),Eh.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Ki.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&$i.multiplyScalar(-Ki.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;pr(ur.set(-.5,-.5,0),Ki,a,$i,s,r),pr(Rs.set(.5,-.5,0),Ki,a,$i,s,r),pr(fr.set(.5,.5,0),Ki,a,$i,s,r),ml.set(0,0),Ia.set(1,0),gl.set(1,1);let o=t.ray.intersectTriangle(ur,Rs,fr,!1,As);if(o===null&&(pr(Rs.set(-.5,.5,0),Ki,a,$i,s,r),Ia.set(0,1),o=t.ray.intersectTriangle(ur,fr,Rs,!1,As),o===null))return;const c=t.ray.origin.distanceTo(As);c<t.near||c>t.far||e.push({distance:c,point:As.clone(),uv:un.getInterpolation(As,ur,Rs,fr,ml,Ia,gl,new Bt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function pr(i,t,e,n,s,r){ji.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(Ts.x=r*ji.x-s*ji.y,Ts.y=s*ji.x+r*ji.y):Ts.copy(ji),i.copy(t),i.x+=Ts.x,i.y+=Ts.y,i.applyMatrix4(Eh)}class rg extends We{constructor(t=null,e=1,n=1,s,r,a,o,c,l=en,h=en,d,u){super(null,a,o,c,l,h,s,r,d,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class _l extends Xe{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Zi=new ie,xl=new ie,mr=[],vl=new Pi,ag=new ie,Cs=new K,Ps=new _s;class $t extends K{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new _l(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,ag)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Pi),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Zi),vl.copy(t.boundingBox).applyMatrix4(Zi),this.boundingBox.union(vl)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new _s),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Zi),Ps.copy(t.boundingSphere).applyMatrix4(Zi),this.boundingSphere.union(Ps)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(Cs.geometry=this.geometry,Cs.material=this.material,Cs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ps.copy(this.boundingSphere),Ps.applyMatrix4(n),t.ray.intersectsSphere(Ps)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Zi),xl.multiplyMatrices(n,Zi),Cs.matrixWorld=xl,Cs.raycast(t,mr);for(let a=0,o=mr.length;a<o;a++){const c=mr[a];c.instanceId=r,c.object=this,e.push(c)}mr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new _l(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new rg(new Float32Array(s*this.count),s,this.count,qo,Ln));const r=this.morphTexture.source.data.data;let a=0;for(let l=0;l<n.length;l++)a+=n[l];const o=this.geometry.morphTargetsRelative?1:1-a,c=s*t;r[c]=o,r.set(n,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Th extends ai{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new yt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Ml=new ie,No=new ch,gr=new _s,_r=new U;class og extends jt{constructor(t=new Be,e=new Th){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),gr.copy(n.boundingSphere),gr.applyMatrix4(s),gr.radius+=r,t.ray.intersectsSphere(gr)===!1)return;Ml.copy(s).invert(),No.copy(t.ray).applyMatrix4(Ml);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,d=n.attributes.position;if(l!==null){const u=Math.max(0,a.start),f=Math.min(l.count,a.start+a.count);for(let g=u,_=f;g<_;g++){const m=l.getX(g);_r.fromBufferAttribute(d,m),yl(_r,m,c,s,t,e,this)}}else{const u=Math.max(0,a.start),f=Math.min(d.count,a.start+a.count);for(let g=u,_=f;g<_;g++)_r.fromBufferAttribute(d,g),yl(_r,g,c,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function yl(i,t,e,n,s,r,a){const o=No.distanceSqToPoint(i);if(o<e){const c=new U;No.closestPointToPoint(i,c),c.applyMatrix4(n);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class oi extends We{constructor(t,e,n,s,r,a,o,c,l){super(t,e,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class ps extends Be{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],a=[],o=[],c=[],l=new U,h=new Bt;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let d=0,u=3;d<=e;d++,u+=3){const f=n+d/e*s;l.x=t*Math.cos(f),l.y=t*Math.sin(f),a.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(a[u]/t+1)/2,h.y=(a[u+1]/t+1)/2,c.push(h.x,h.y)}for(let d=1;d<=e;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new Se(a,3)),this.setAttribute("normal",new Se(o,3)),this.setAttribute("uv",new Se(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ps(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Lt extends Be{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const h=[],d=[],u=[],f=[];let g=0;const _=[],m=n/2;let p=0;M(),a===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new Se(d,3)),this.setAttribute("normal",new Se(u,3)),this.setAttribute("uv",new Se(f,2));function M(){const S=new U,C=new U;let y=0;const A=(e-t)/n;for(let R=0;R<=r;R++){const N=[],v=R/r,b=v*(e-t)+t;for(let F=0;F<=s;F++){const z=F/s,H=z*c+o,tt=Math.sin(H),G=Math.cos(H);C.x=b*tt,C.y=-v*n+m,C.z=b*G,d.push(C.x,C.y,C.z),S.set(tt,A,G).normalize(),u.push(S.x,S.y,S.z),f.push(z,1-v),N.push(g++)}_.push(N)}for(let R=0;R<s;R++)for(let N=0;N<r;N++){const v=_[N][R],b=_[N+1][R],F=_[N+1][R+1],z=_[N][R+1];t>0&&(h.push(v,b,z),y+=3),e>0&&(h.push(b,F,z),y+=3)}l.addGroup(p,y,0),p+=y}function x(S){const C=g,y=new Bt,A=new U;let R=0;const N=S===!0?t:e,v=S===!0?1:-1;for(let F=1;F<=s;F++)d.push(0,m*v,0),u.push(0,v,0),f.push(.5,.5),g++;const b=g;for(let F=0;F<=s;F++){const H=F/s*c+o,tt=Math.cos(H),G=Math.sin(H);A.x=N*G,A.y=m*v,A.z=N*tt,d.push(A.x,A.y,A.z),u.push(0,v,0),y.x=tt*.5+.5,y.y=G*.5*v+.5,f.push(y.x,y.y),g++}for(let F=0;F<s;F++){const z=C+F,H=b+F;S===!0?h.push(H,H+1,z):h.push(H+1,H,z),R+=3}l.addGroup(p,R,S===!0?1:2),p+=R}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Lt(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class be extends Lt{constructor(t=1,e=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new be(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class vs extends Be{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],a=[];o(s),l(n),h(),this.setAttribute("position",new Se(r,3)),this.setAttribute("normal",new Se(r.slice(),3)),this.setAttribute("uv",new Se(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(M){const x=new U,S=new U,C=new U;for(let y=0;y<e.length;y+=3)f(e[y+0],x),f(e[y+1],S),f(e[y+2],C),c(x,S,C,M)}function c(M,x,S,C){const y=C+1,A=[];for(let R=0;R<=y;R++){A[R]=[];const N=M.clone().lerp(S,R/y),v=x.clone().lerp(S,R/y),b=y-R;for(let F=0;F<=b;F++)F===0&&R===y?A[R][F]=N:A[R][F]=N.clone().lerp(v,F/b)}for(let R=0;R<y;R++)for(let N=0;N<2*(y-R)-1;N++){const v=Math.floor(N/2);N%2===0?(u(A[R][v+1]),u(A[R+1][v]),u(A[R][v])):(u(A[R][v+1]),u(A[R+1][v+1]),u(A[R+1][v]))}}function l(M){const x=new U;for(let S=0;S<r.length;S+=3)x.x=r[S+0],x.y=r[S+1],x.z=r[S+2],x.normalize().multiplyScalar(M),r[S+0]=x.x,r[S+1]=x.y,r[S+2]=x.z}function h(){const M=new U;for(let x=0;x<r.length;x+=3){M.x=r[x+0],M.y=r[x+1],M.z=r[x+2];const S=m(M)/2/Math.PI+.5,C=p(M)/Math.PI+.5;a.push(S,1-C)}g(),d()}function d(){for(let M=0;M<a.length;M+=6){const x=a[M+0],S=a[M+2],C=a[M+4],y=Math.max(x,S,C),A=Math.min(x,S,C);y>.9&&A<.1&&(x<.2&&(a[M+0]+=1),S<.2&&(a[M+2]+=1),C<.2&&(a[M+4]+=1))}}function u(M){r.push(M.x,M.y,M.z)}function f(M,x){const S=M*3;x.x=t[S+0],x.y=t[S+1],x.z=t[S+2]}function g(){const M=new U,x=new U,S=new U,C=new U,y=new Bt,A=new Bt,R=new Bt;for(let N=0,v=0;N<r.length;N+=9,v+=6){M.set(r[N+0],r[N+1],r[N+2]),x.set(r[N+3],r[N+4],r[N+5]),S.set(r[N+6],r[N+7],r[N+8]),y.set(a[v+0],a[v+1]),A.set(a[v+2],a[v+3]),R.set(a[v+4],a[v+5]),C.copy(M).add(x).add(S).divideScalar(3);const b=m(C);_(y,v+0,M,b),_(A,v+2,x,b),_(R,v+4,S,b)}}function _(M,x,S,C){C<0&&M.x===1&&(a[x]=M.x-1),S.x===0&&S.z===0&&(a[x]=C/2/Math.PI+.5)}function m(M){return Math.atan2(M.z,-M.x)}function p(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new vs(t.vertices,t.indices,t.radius,t.details)}}class nc extends vs{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new nc(t.radius,t.detail)}}class ic extends vs{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ic(t.radius,t.detail)}}class si extends vs{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new si(t.radius,t.detail)}}class Ei extends Be{constructor(t=.5,e=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);const o=[],c=[],l=[],h=[];let d=t;const u=(e-t)/s,f=new U,g=new Bt;for(let _=0;_<=s;_++){for(let m=0;m<=n;m++){const p=r+m/n*a;f.x=d*Math.cos(p),f.y=d*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),g.x=(f.x/e+1)/2,g.y=(f.y/e+1)/2,h.push(g.x,g.y)}d+=u}for(let _=0;_<s;_++){const m=_*(n+1);for(let p=0;p<n;p++){const M=p+m,x=M,S=M+n+1,C=M+n+2,y=M+1;o.push(x,S,y),o.push(S,C,y)}}this.setIndex(o),this.setAttribute("position",new Se(c,3)),this.setAttribute("normal",new Se(l,3)),this.setAttribute("uv",new Se(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ei(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class ce extends Be{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const h=[],d=new U,u=new U,f=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){const M=[],x=p/n;let S=0;p===0&&a===0?S=.5/e:p===n&&c===Math.PI&&(S=-.5/e);for(let C=0;C<=e;C++){const y=C/e;d.x=-t*Math.cos(s+y*r)*Math.sin(a+x*o),d.y=t*Math.cos(a+x*o),d.z=t*Math.sin(s+y*r)*Math.sin(a+x*o),g.push(d.x,d.y,d.z),u.copy(d).normalize(),_.push(u.x,u.y,u.z),m.push(y+S,1-x),M.push(l++)}h.push(M)}for(let p=0;p<n;p++)for(let M=0;M<e;M++){const x=h[p][M+1],S=h[p][M],C=h[p+1][M],y=h[p+1][M+1];(p!==0||a>0)&&f.push(x,S,y),(p!==n-1||c<Math.PI)&&f.push(S,C,y)}this.setIndex(f),this.setAttribute("position",new Se(g,3)),this.setAttribute("normal",new Se(_,3)),this.setAttribute("uv",new Se(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ce(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class sc extends vs{constructor(t=1,e=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],s=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,s,t,e),this.type="TetrahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new sc(t.radius,t.detail)}}class Ri extends Be{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],c=[],l=[],h=new U,d=new U,u=new U;for(let f=0;f<=n;f++)for(let g=0;g<=s;g++){const _=g/s*r,m=f/n*Math.PI*2;d.x=(t+e*Math.cos(m))*Math.cos(_),d.y=(t+e*Math.cos(m))*Math.sin(_),d.z=e*Math.sin(m),o.push(d.x,d.y,d.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),u.subVectors(d,h).normalize(),c.push(u.x,u.y,u.z),l.push(g/s),l.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=s;g++){const _=(s+1)*f+g-1,m=(s+1)*(f-1)+g-1,p=(s+1)*(f-1)+g,M=(s+1)*f+g;a.push(_,m,M),a.push(m,p,M)}this.setIndex(a),this.setAttribute("position",new Se(o,3)),this.setAttribute("normal",new Se(c,3)),this.setAttribute("uv",new Se(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ri(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class cg extends ai{constructor(t){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new yt(16777215),this.specular=new yt(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new yt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=jo,this.normalScale=new Bt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bn,this.combine=Xr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.specular.copy(t.specular),this.shininess=t.shininess,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Ee extends ai{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new yt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new yt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=jo,this.normalScale=new Bt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bn,this.combine=Xr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Rh extends jt{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new yt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class Ch extends Rh{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(jt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new yt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Da=new ie,Sl=new U,wl=new U;class lg{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Bt(512,512),this.map=null,this.mapPass=null,this.matrix=new ie,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Jo,this._frameExtents=new Bt(1,1),this._viewportCount=1,this._viewports=[new Re(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Sl.setFromMatrixPosition(t.matrixWorld),e.position.copy(Sl),wl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(wl),e.updateMatrixWorld(),Da.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Da),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Da)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class hg extends lg{constructor(){super(new _h(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Ph extends Rh{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(jt.DEFAULT_UP),this.updateMatrix(),this.target=new jt,this.shadow=new hg}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ho}}));typeof window!="undefined"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ho);function An(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,c=new Be;let l=0;for(let h=0;h<i.length;++h){const d=i[h];let u=0;if(e!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in d.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(d.attributes[f]),u++}if(u!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in d.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[f]===void 0&&(a[f]=[]),a[f].push(d.morphAttributes[f])}if(t){let f;if(e)f=d.index.count;else if(d.attributes.position!==void 0)f=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,h),l+=f}}if(e){let h=0;const d=[];for(let u=0;u<i.length;++u){const f=i[u].index;for(let g=0;g<f.count;++g)d.push(f.getX(g)+h);h+=i[u].attributes.position.count}c.setIndex(d)}for(const h in r){const d=bl(r[h]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,d)}for(const h in a){const d=a[h][0].length;if(d===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let u=0;u<d;++u){const f=[];for(let _=0;_<a[h].length;++_)f.push(a[h][_][u]);const g=bl(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(g)}}return c}function bl(i){let t,e,n,s=-1,r=0;for(let l=0;l<i.length;++l){const h=i[l];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}const a=new t(r),o=new Xe(a,e,n);let c=0;for(let l=0;l<i.length;++l){const h=i[l];if(h.isInterleavedBufferAttribute){const d=c/e;for(let u=0,f=h.count;u<f;u++)for(let g=0;g<e;g++){const _=h.getComponent(u,g);o.setComponent(u+d,g,_)}}else a.set(h.array,c);c+=h.count*e}return s!==void 0&&(o.gpuType=s),o}const ze=(i,t,e)=>i<t?t:i>e?e:i,ye=(i,t)=>i+Math.random()*(t-i),ot=Math.PI*2,Fo=(i,t)=>1-Math.exp(-t*i);function Je(i=1337){let t=i>>>0;return function(){return t^=t<<13,t>>>=0,t^=t>>17,t^=t<<5,t>>>=0,t/4294967296}}function $e(i,t="ru"){i=Math.floor(i);const e=t==="ru"||t==="tr"?",":".",n=(s,r)=>(Math.floor(s*10)/10).toFixed(1).replace(".",e)+r;return i>=1e9?n(i/1e9,"B"):i>=1e6?n(i/1e6,"M"):i>=1e3?n(i/1e3,"K"):String(i)}function Ji(i){i=Math.max(0,Math.ceil(i));const t=Math.floor(i/3600),e=Math.floor(i%3600/60),n=i%60,s=r=>String(r).padStart(2,"0");return t>0?`${t}:${s(e)}:${s(n)}`:`${e}:${s(n)}`}function dg(i){i=Math.max(0,Math.ceil(i));const t=Math.floor(i/3600),e=Math.floor(i%3600/60),n=i%60,s=r=>String(r).padStart(2,"0");return`${s(t)}:${s(e)}:${s(n)}`}function ug(i="#7ede4a",t="#64cc3a",e=64){const n=document.createElement("canvas");n.width=n.height=e*2;const s=n.getContext("2d");s.fillStyle=i,s.fillRect(0,0,e,e),s.fillRect(e,e,e,e),s.fillStyle=t,s.fillRect(e,0,e,e),s.fillRect(0,e,e,e);const r=new oi(n);return r.wrapS=r.wrapT=hs,r.colorSpace=De,r.anisotropy=4,r}function fg(i=128){const t=document.createElement("canvas");t.width=t.height=i;const e=t.getContext("2d"),n=e.createRadialGradient(i/2,i/2,0,i/2,i/2,i/2);n.addColorStop(0,"rgba(0,0,0,0.55)"),n.addColorStop(.55,"rgba(0,0,0,0.28)"),n.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=n,e.fillRect(0,0,i,i);const s=new oi(t);return s.colorSpace=De,s}function pg(i=64){const t=document.createElement("canvas");t.width=t.height=i;const e=t.getContext("2d"),n=e.createRadialGradient(i/2,i/2,0,i/2,i/2,i/2);n.addColorStop(0,"rgba(255,255,255,1)"),n.addColorStop(.35,"rgba(255,255,255,0.85)"),n.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=n,e.fillRect(0,0,i,i);const s=new oi(t);return s.colorSpace=De,s}function mg(i=256){const t=document.createElement("canvas");t.width=t.height=i;const e=t.getContext("2d");e.fillStyle="#2f9fe0",e.fillRect(0,0,i,i),e.strokeStyle="rgba(255,255,255,0.22)",e.lineWidth=3;for(let s=0;s<14;s++){e.beginPath();const r=s/14*i;for(let a=0;a<=i;a+=8){const o=r+Math.sin(a/i*Math.PI*4+s)*5;a===0?e.moveTo(a,o):e.lineTo(a,o)}e.stroke()}const n=new oi(t);return n.wrapS=n.wrapT=hs,n.colorSpace=De,n}function gg(){const i=document.createElement("canvas");i.width=8,i.height=256;const t=i.getContext("2d"),e=t.createLinearGradient(0,0,0,256);e.addColorStop(0,"#2f7fd8"),e.addColorStop(.35,"#63b8f2"),e.addColorStop(.68,"#a9e2ff"),e.addColorStop(1,"#dff4ff"),t.fillStyle=e,t.fillRect(0,0,8,256);const n=new oi(i);return n.colorSpace=De,n}const mi=512,Ua=168;class _g{constructor(){this.canvas=document.createElement("canvas"),this.canvas.width=mi,this.canvas.height=Ua,this.ctx=this.canvas.getContext("2d"),this.texture=new oi(this.canvas),this.texture.colorSpace=De,this.material=new ec({map:this.texture,transparent:!0,depthTest:!1,depthWrite:!1}),this.sprite=new Ah(this.material),this.sprite.renderOrder=900,this.sprite.center.set(.5,0),this._key=""}set(t,e,n="#ffffff"){const s=t+"|"+e+"|"+n;if(s===this._key)return;this._key=s;const r=this.ctx;r.clearRect(0,0,mi,Ua),r.textAlign="center",r.lineJoin="round",r.miterLimit=2,r.font='900 76px "Nunito", "Arial Black", "Segoe UI Black", Impact, sans-serif',r.lineWidth=14,r.strokeStyle="rgba(0,0,0,0.92)",r.strokeText(e,mi/2,70),r.fillStyle="#FFB021",r.fillText(e,mi/2,70),r.font='900 56px "Nunito", "Arial Black", "Segoe UI Black", Impact, sans-serif',r.lineWidth=11,r.strokeStyle="rgba(0,0,0,0.92)",r.strokeText(t,mi/2,138),r.fillStyle=n,r.fillText(t,mi/2,138),this.texture.needsUpdate=!0}setScale(t){this.sprite.scale.set(t,t*(Ua/mi),1)}dispose(){this.texture.dispose(),this.material.dispose()}}const zt=300,Te=292,Ls=[{name:"ruins",x:0,z:242,r:34},{name:"ferris",x:242,z:0,r:34},{name:"camp",x:0,z:-242,r:34},{name:"mushrooms",x:-242,z:0,r:38}],xr=[{name:"plaza",x:0,z:0,r:88,color:9100892},{name:"forest",x:165,z:160,r:128,color:5221941},{name:"canyon",x:-172,z:158,r:128,color:12889210},{name:"lake",x:-158,z:-152,r:140,color:14997148},{name:"farm",x:162,z:-164,r:128,color:10404938},{name:"ruins",x:0,z:242,r:52,color:11846796},{name:"ferris",x:242,z:0,r:50,color:10215536},{name:"camp",x:0,z:-242,r:46,color:13218428},{name:"mushrooms",x:-242,z:0,r:56,color:6272138}],Gt={x:-158,z:-152,r:64},Ns=64,Lh=[[[45,45],[150,146]],[[-45,45],[-150,146]],[[-45,-45],[-79,-148]],[[45,-45],[150,-152]],[[0,62],[0,214]],[[62,0],[212,0]],[[0,-62],[0,-214]],[[-62,0],[-208,0]]],Na=5.5,cn={x:165,z:160,r:22};function El(i,t,e){const n=Math.min(1,Math.max(0,(e-i)/(t-i)));return n*n*(3-2*n)}function Al(i,t){let e=1/0;for(const n of Lh)for(let s=0;s<n.length-1;s++){const[r,a]=n[s],[o,c]=n[s+1],l=o-r,h=c-a,d=Math.min(1,Math.max(0,((i-r)*l+(t-a)*h)/(l*l+h*h))),u=Math.hypot(i-(r+l*d),t-(a+h*d));u<e&&(e=u)}return e}const Oo=24,Qi=Math.ceil(zt*2/Oo),nt=(i,t=!0)=>new Ee({color:i,flatShading:t});class xg{constructor(t,e="high"){this.scene=t,this.quality=e,this.rng=Je(20260725),this.windmills=[],this.balloons=[],this.clouds=[],this.birds=[],this.water=null,this.time=0,this.ferris=null,this.flames=[],this.spinners=[],this.floaters=[],this.obstacles=[],this.obsCells=null,this._obsQuery=[],this.props=[],this._eatenProps=[],this._zeroMatrix=new ie().makeScale(0,0,0),this._build(),this._buildObstacleGrid()}_makeProp(t){const e={visual:t,alive:!0,respawn:0};return this.props.push(e),e}_obs(t,e,n,s,r){Math.abs(t)>zt+10||Math.abs(e)>zt+10||this.obstacles.push({x:t,z:e,r:n,h:s,prop:r||null})}_obsInst(t,e,n,s,r,a,o){this._obs(t,e,n,s,this._makeProp({meshes:[{mesh:r,index:a,matrix:o.clone()}]}))}_obsObj(t,e,n,s,r){this._obs(t,e,n,s,this._makeProp({object:r}))}_setPropVisible(t,e){const n=t.visual;if(n){if(n.object){n.object.visible=e;return}if(n.meshes)for(const s of n.meshes)s.mesh.setMatrixAt(s.index,e?s.matrix:this._zeroMatrix),s.mesh.instanceMatrix.needsUpdate=!0}}eatObstacle(t){const e=t.prop;return!e||!e.alive?!1:(e.alive=!1,e.respawn=22+Math.random()*16,this._setPropVisible(e,!1),this._eatenProps.push(e),!0)}_buildObstacleGrid(){this.obsCells=new Array(Qi*Qi);for(let e=0;e<this.obsCells.length;e++)this.obsCells[e]=[];const t=e=>Math.min(Qi-1,Math.max(0,Math.floor((e+zt)/Oo)));for(const e of this.obstacles){const n=t(e.x-e.r),s=t(e.x+e.r),r=t(e.z-e.r),a=t(e.z+e.r);for(let o=r;o<=a;o++)for(let c=n;c<=s;c++)this.obsCells[c+o*Qi].push(e)}}queryObstacles(t,e,n,s){if(s=s||[],s.length=0,!this.obsCells)return s;const r=h=>Math.min(Qi-1,Math.max(0,Math.floor((h+zt)/Oo))),a=r(t-n),o=r(t+n),c=r(e-n),l=r(e+n);for(let h=c;h<=l;h++)for(let d=a;d<=o;d++){const u=this.obsCells[d+h*Qi];for(let f=0;f<u.length;f++){const g=u[f];g.prop&&!g.prop.alive||s.indexOf(g)<0&&s.push(g)}}return s}isInsideObstacle(t,e,n=0){const s=this.queryObstacles(t,e,n+1,this._obsQuery);for(let r=0;r<s.length;r++){const a=s[r],o=t-a.x,c=e-a.z,l=a.r+n;if(o*o+c*c<l*l)return!0}return!1}isBlocked(t,e,n){if(e<2.5||Math.abs(t)>zt-4||Math.abs(n)>zt-4)return!0;const s=this.queryObstacles(t,n,3,this._obsQuery);for(let r=0;r<s.length;r++){const a=s[r];if(e>a.h+1.5)continue;const o=t-a.x,c=n-a.z,l=a.r+1.8;if(o*o+c*c<l*l)return!0}return!1}get densityScale(){return this.quality==="low"?.42:this.quality==="medium"?.7:1}_onRoad(t,e,n=0){return Al(t,e)<Na+n}_isOpenGround(t,e,n=0){if(Math.hypot(t-Gt.x,e-Gt.z)<Gt.r+3+n||Math.hypot(t,e)<Ns+2+n||this._onRoad(t,e,1.5+n))return!1;for(const s of Ls)if(Math.hypot(t-s.x,e-s.z)<s.r+n)return!1;return Math.hypot(t-cn.x,e-cn.z)>=cn.r+n}_build(){this._sky(),this._ground(),this._fence(),this._outerLand(),this._cliffRing(),this._mountains(),this._plaza(),this._forest(),this._canyon(),this._lake(),this._farm(),this._ruins(),this._ferrisWheel(),this._campsite(),this._giantMushrooms(),this._scatter(),this._clouds(),this._balloons()}_sky(){const t=new ce(1400,24,16),e=new fn({map:gg(),side:Ke,fog:!1,depthWrite:!1}),n=new K(t,e);n.renderOrder=-1e3,this.scene.add(n);const s=new K(new ce(46,18,14),new fn({color:16774857,fog:!1}));s.position.set(-420,620,-900),this.scene.add(s)}_ground(){const t=this.quality==="low"?64:120,e=new Vn(zt*2,zt*2,t,t);e.rotateX(-Math.PI/2);const n=e.attributes.position,s=new Float32Array(n.count*3),r=new yt(7655498),a=new yt,o=xr.map(g=>({...g,col:new yt(g.color)})),c=new yt(14071678),l=new yt(14538179),h=new yt(12168597);for(let g=0;g<n.count;g++){const _=n.getX(g),m=n.getZ(g);a.copy(r);for(const C of o){const y=Math.hypot(_-C.x,m-C.z)/C.r;if(y<1.4){const A=Math.max(0,Math.min(1,1-y));a.lerp(C.col,A*A*(3-2*A))}}const p=1-El(Na-2,Na+2.5,Al(_,m));p>0&&a.lerp(c,p);const M=Math.hypot(_,m),x=1-El(Ns-2,Ns+1.5,M);if(x>0){const C=M>23&&M<31||M>Ns-5;a.lerp(C?h:l,x)}const S=.96+.08*Math.sin(_*.037)*Math.cos(m*.041);s[g*3]=a.r*S,s[g*3+1]=a.g*S,s[g*3+2]=a.b*S}e.setAttribute("color",new Xe(s,3));const d=ug("#ffffff","#dcdcdc",32);d.repeat.set(60,60);const u=new Ee({map:d,vertexColors:!0}),f=new K(e,u);f.receiveShadow=!0,f.position.y=0,this.scene.add(f),this.ground=f}_outerLand(){const t=new Vn(3e3,3e3);t.rotateX(-Math.PI/2);const e=new K(t,nt(6075193,!1));e.position.y=-1.2,this.scene.add(e)}_fence(){const e=Math.floor(zt*2/6),n=[],s=[];for(let d=0;d<4;d++)for(let u=0;u<=e;u++){const f=-zt+u*6;let g,_,m;d===0?(g=f,_=-zt,m=0):d===1?(g=f,_=zt,m=0):d===2?(g=-zt,_=f,m=Math.PI/2):(g=zt,_=f,m=Math.PI/2),n.push({x:g,z:_,rot:m}),u<e&&s.push({x:g,z:_,rot:m,off:6/2})}const r=new Wt(1.1,5.2,1.1),a=new $t(r,nt(11104572),n.length);a.castShadow=!0;const o=new jt;n.forEach((d,u)=>{o.position.set(d.x,2.6,d.z),o.rotation.set(0,d.rot,0),o.scale.set(1,1,1),o.updateMatrix(),a.setMatrixAt(u,o.matrix)}),a.instanceMatrix.needsUpdate=!0,this.scene.add(a);const c=new Wt(6,.7,.5),l=new $t(c,nt(13208395),s.length*2);let h=0;s.forEach(d=>{for(const u of[1.6,3.6]){const f=d.rot===0?d.off:0,g=d.rot===0?0:d.off;o.position.set(d.x+f,u,d.z+g),o.rotation.set(0,d.rot,0),o.scale.set(1,1,1),o.updateMatrix(),l.setMatrixAt(h++,o.matrix)}}),l.instanceMatrix.needsUpdate=!0,this.scene.add(l)}_cliffRing(){const t=this.rng,e=Math.floor(150*this.densityScale)+40,n=new Lt(1,1.35,1,6,1),s=new $t(n,nt(8292244),e),r=new jt,a=new yt;for(let d=0;d<e;d++){const u=d/e*ot+t()*.1,f=345+t()*190,g=26+t()*70;r.position.set(Math.cos(u)*f,g/2-3,Math.sin(u)*f),r.rotation.set(0,t()*ot,(t()-.5)*.08),r.scale.set(16+t()*26,g,16+t()*26),r.updateMatrix(),s.setMatrixAt(d,r.matrix);const _=.72+t()*.26;a.setRGB(_*.82,_*.86,_*.92),s.setColorAt(d,a)}s.instanceMatrix.needsUpdate=!0,s.instanceColor&&(s.instanceColor.needsUpdate=!0),this.scene.add(s);const o=Math.floor(e*.55),c=new Lt(1,1.02,1,6,1),l=new $t(c,nt(6537788),o),h=Je(777);for(let d=0;d<o;d++){const u=d/o*ot+h()*.1,f=348+h()*150,g=28+h()*55;r.position.set(Math.cos(u)*f,g-2,Math.sin(u)*f),r.rotation.set(0,h()*ot,0),r.scale.set(15+h()*22,4,15+h()*22),r.updateMatrix(),l.setMatrixAt(d,r.matrix)}l.instanceMatrix.needsUpdate=!0,this.scene.add(l)}_mountains(){const t=Je(4242),e=34,n=new be(1,1,5,1),s=new $t(n,nt(10135478),e),r=new jt,a=new yt;for(let o=0;o<e;o++){const c=o/e*ot+t()*.2,l=780+t()*320,h=160+t()*260;r.position.set(Math.cos(c)*l,h/2-20,Math.sin(c)*l),r.rotation.set(0,t()*ot,0),r.scale.set(120+t()*130,h,120+t()*130),r.updateMatrix(),s.setMatrixAt(o,r.matrix);const d=.6+t()*.3;a.setRGB(d*.78,d*.84,d*.95),s.setColorAt(o,a)}s.instanceMatrix.needsUpdate=!0,s.instanceColor&&(s.instanceColor.needsUpdate=!0),this.scene.add(s)}_plaza(){const t=new ut,e=new ut;t.add(e);const n=new K(new Lt(13,14,2.2,24),nt(14209732));n.position.y=1.1,n.receiveShadow=!0,e.add(n);const s=new K(new Lt(11.6,11.6,.5,24),new Ee({color:4830954,transparent:!0,opacity:.9}));s.position.y=2.2,e.add(s);const r=new K(new Lt(1.8,2.8,7,14),nt(14998732));r.position.y=5.5,r.castShadow=!0,e.add(r);const a=new K(new Lt(5.2,2.2,1.8,18),nt(14209732));a.position.y=9.4,a.castShadow=!0,e.add(a);const o=new K(new ce(1.7,14,10),nt(4830954,!1));o.position.y=11.2,e.add(o),this._obsObj(0,0,14,12,e);const c=12;for(let x=0;x<c;x++){const S=x/c*ot,C=Math.cos(S)*52,y=Math.sin(S)*52,A=new ut;t.add(A);const R=new K(new Lt(.5,.7,12,8),nt(4015958));R.position.set(C,6,y),R.castShadow=!0,A.add(R);const N=new K(new ce(1.7,12,9),new Ee({color:16773808,emissive:7035408}));N.position.set(C,12.6,y),A.add(N);const v=new K(new be(2.4,2,8),nt(3094339));v.position.set(C,14.4,y),A.add(v),this._obsObj(C,y,1.4,15,A)}for(let x=0;x<4;x++){const S=x/4*ot+Math.PI/4,C=Math.cos(S)*78,y=Math.sin(S)*78,A=new ut;for(const b of[-1,1]){const F=new K(new Wt(2.4,16,2.4),nt(12153916));F.position.set(b*7,8,0),F.castShadow=!0,A.add(F)}const R=new K(new Wt(18,2.6,3),nt(13667146));R.position.y=17,A.add(R);const N=new K(new Wt(6,3.4,.3),nt(15091773));N.position.set(0,20,0),A.add(N),A.position.set(C,0,y),A.rotation.y=-S,t.add(A);const v=this._makeProp({object:A});for(const b of[-1,1])this._obs(C+b*7*Math.cos(S),y-b*7*Math.sin(S),1.8,17,v)}const l=An([new Wt(6,.5,1.8).translate(0,1.4,0),new Wt(6,1.6,.4).translate(0,2.4,-.8),new Wt(.5,1.4,1.6).translate(-2.5,.7,0),new Wt(.5,1.4,1.6).translate(2.5,.7,0)],!1),h=new $t(l,nt(11565637),8);h.castShadow=!0;const d=new jt;for(let x=0;x<8;x++){const S=x/8*ot+ot/16,C=Math.cos(S)*43,y=Math.sin(S)*43;d.position.set(C,0,y),d.rotation.set(0,Math.atan2(C,y)+Math.PI,0),d.updateMatrix(),h.setMatrixAt(x,d.matrix),this._obsInst(C,y,2.6,3.4,h,x,d.matrix)}h.instanceMatrix.needsUpdate=!0,t.add(h);const u=new $t(new Lt(6,6.4,1.4,20),nt(13221801),4),f=new $t(new Lt(5.3,5.3,.3,20),nt(7031340,!1),4),g=4*14,_=new $t(new ce(.75,8,6),nt(16777215,!1),g),m=new yt,p=Je(4040);let M=0;for(let x=0;x<4;x++){const S=x/4*ot,C=Math.cos(S)*33,y=Math.sin(S)*33;d.position.set(C,.7,y),d.rotation.set(0,0,0),d.updateMatrix(),u.setMatrixAt(x,d.matrix);const A=d.matrix.clone();d.position.y=1.45,d.updateMatrix(),f.setMatrixAt(x,d.matrix);const R=d.matrix.clone(),N=[{mesh:u,index:x,matrix:A},{mesh:f,index:x,matrix:R}],v=[.95,.12,.6,.78][x];for(let b=0;b<14;b++){const F=p()*ot,z=Math.sqrt(p())*4.4;d.position.set(C+Math.cos(F)*z,2.1+p()*.6,y+Math.sin(F)*z),d.scale.setScalar(.8+p()*.6),d.updateMatrix(),_.setMatrixAt(M,d.matrix),N.push({mesh:_,index:M,matrix:d.matrix.clone()}),m.setHSL((v+p()*.08)%1,.85,.62),_.setColorAt(M,m),d.scale.setScalar(1),M++}this._obs(C,y,6.2,2.6,this._makeProp({meshes:N}))}u.instanceMatrix.needsUpdate=!0,f.instanceMatrix.needsUpdate=!0,_.instanceMatrix.needsUpdate=!0,_.instanceColor&&(_.instanceColor.needsUpdate=!0),t.add(u,f,_),this.scene.add(t)}_forest(){const t=xr[1],e=Je(9001),n=Math.floor(210*this.densityScale),s=[];for(let g=0;g<n;g++){const _=e()*ot,m=Math.sqrt(e())*t.r*1.05,p=t.x+Math.cos(_)*m,M=t.z+Math.sin(_)*m;if(Math.abs(p)>zt-12||Math.abs(M)>zt-12||Math.hypot(p,M)<96||this._onRoad(p,M,3)||Math.hypot(p-cn.x,M-cn.z)<cn.r)continue;const x=.75+e()*.85;s.push({x:p,z:M,s:x,r:e()*ot})}this._plantPines(s,e),this._forestCabin();const r=new ce(1,10,7),a=new $t(r,nt(4168748),Math.floor(120*this.densityScale)),o=new jt,c=new yt;for(let g=0;g<a.count;g++){const _=e()*ot,m=Math.sqrt(e())*t.r,p=2.2+e()*3,M=t.x+Math.cos(_)*m,x=t.z+Math.sin(_)*m;if(this._onRoad(M,x,p)||Math.hypot(M-cn.x,x-cn.z)<cn.r){a.setMatrixAt(g,this._zeroMatrix);continue}o.position.set(M,p*.7,x),o.rotation.set(0,e()*ot,0),o.scale.set(p*1.2,p*.9,p*1.2),o.updateMatrix(),a.setMatrixAt(g,o.matrix),this._obsInst(M,x,p*1.05,p*1.6,a,g,o.matrix),c.setHSL(.28+e()*.06,.55,.32+e()*.12),a.setColorAt(g,c)}a.instanceMatrix.needsUpdate=!0,a.instanceColor&&(a.instanceColor.needsUpdate=!0),a.castShadow=!0,this.scene.add(a);const l=new ce(1,10,6,0,ot,0,Math.PI/2),h=new Lt(.32,.42,1.6,8),d=Math.floor(70*this.densityScale),u=new $t(l,nt(14697788),d),f=new $t(h,nt(15985366),d);for(let g=0;g<d;g++){const _=e()*ot,m=Math.sqrt(e())*t.r,p=t.x+Math.cos(_)*m,M=t.z+Math.sin(_)*m,x=.9+e()*1.5;if(this._onRoad(p,M)||Math.hypot(p-cn.x,M-cn.z)<cn.r-4){f.setMatrixAt(g,this._zeroMatrix),u.setMatrixAt(g,this._zeroMatrix);continue}o.position.set(p,1.6*x*.5,M),o.scale.setScalar(x),o.rotation.set(0,0,0),o.updateMatrix(),f.setMatrixAt(g,o.matrix),o.position.set(p,1.6*x,M),o.scale.set(x*1.5,x*1.1,x*1.5),o.updateMatrix(),u.setMatrixAt(g,o.matrix)}u.instanceMatrix.needsUpdate=!0,f.instanceMatrix.needsUpdate=!0,this.scene.add(u,f)}_plantPines(t,e){if(!t.length)return;const n=new Lt(.75,1.15,7,7),s=new $t(n,nt(8014372),t.length);s.castShadow=!0;const r=[new be(4.6,7.5,8).translate(0,8.5,0),new be(3.7,6.5,8).translate(0,13,0),new be(2.6,5.5,8).translate(0,17,0)],a=An(r,!1);r.forEach(h=>h.dispose());const o=new $t(a,nt(3116844),t.length);o.castShadow=!0;const c=new jt,l=new yt;t.forEach((h,d)=>{c.position.set(h.x,3.5*h.s,h.z),c.rotation.set(0,h.r,0),c.scale.setScalar(h.s),c.updateMatrix(),s.setMatrixAt(d,c.matrix);const u=c.matrix.clone();c.position.set(h.x,0,h.z),c.updateMatrix(),o.setMatrixAt(d,c.matrix),l.setHSL(.27+e()*.07,.6,.26+e()*.14),o.setColorAt(d,l),this._obs(h.x,h.z,1.5*h.s,18*h.s,this._makeProp({meshes:[{mesh:s,index:d,matrix:u},{mesh:o,index:d,matrix:c.matrix.clone()}]}))}),s.instanceMatrix.needsUpdate=!0,o.instanceMatrix.needsUpdate=!0,o.instanceColor&&(o.instanceColor.needsUpdate=!0),this.scene.add(s,o)}_forestCabin(){const t=cn,e=new ut,n=new K(new Wt(16,9,12),nt(10117684));n.position.y=4.5,n.castShadow=!0,e.add(n);for(const f of[-1,1])for(const g of[-1,1]){const _=new K(new Lt(.8,.8,9.4,8),nt(7226146));_.position.set(f*8,4.7,g*6),e.add(_)}const s=new Lt(11,11,14,3,1);s.rotateX(-Math.PI/2),s.scale(1,.364,1),s.translate(0,11,0);const r=new K(s,nt(6175266));r.castShadow=!0,e.add(r);const a=new K(new Wt(2.2,7,2.2),nt(9276036));a.position.set(4.2,13,-2.4),e.add(a);const o=new K(new Wt(3.4,5.6,.4),nt(4860436));o.position.set(0,2.8,6.1),e.add(o);const c=new Ee({color:16769162,emissive:9071122});for(const f of[-1,1]){const g=new K(new Wt(2.6,2.4,.3),c);g.position.set(f*5,5,6.1),e.add(g)}this.smoke=[];const l=new Ee({color:15329775,transparent:!0,opacity:.7,depthWrite:!1}),h=new ce(1,8,6);for(let f=0;f<4;f++){const g=new K(h,l.clone());g.position.set(4.2,17,-2.4),e.add(g),this.smoke.push({mesh:g,t:f/4})}e.position.set(t.x,0,t.z),e.rotation.y=Math.atan2(-165,-160),this.scene.add(e),this._obsObj(t.x,t.z,10,16,e);const d=new $t(new Lt(1.1,1.2,9,8).rotateZ(Math.PI/2),nt(8014372),3);d.castShadow=!0;const u=new jt;[[14,-6,.4],[-9,13,1.9],[12,12,2.6]].forEach(([f,g,_],m)=>{u.position.set(t.x+f,1.1,t.z+g),u.rotation.set(0,_,0),u.updateMatrix(),d.setMatrixAt(m,u.matrix),this._obsInst(t.x+f,t.z+g,2.6,2.4,d,m,u.matrix)}),d.instanceMatrix.needsUpdate=!0,this.scene.add(d)}_canyon(){const t=xr[2],e=Je(31337),n=new jt,s=new yt,r=Math.floor(150*this.densityScale),a=new ic(1,0),o=new $t(a,nt(10260346),r);o.castShadow=!0,o.receiveShadow=!0;for(let d=0;d<r;d++){const u=e()*ot,f=Math.sqrt(e())*t.r*1.05,g=t.x+Math.cos(u)*f,_=t.z+Math.sin(u)*f;if(Math.hypot(g,_)<92||this._onRoad(g,_,8)){o.setMatrixAt(d,this._zeroMatrix);continue}const m=2+e()*9;n.position.set(g,m*.62,_),n.rotation.set(e()*ot,e()*ot,e()*ot),n.scale.set(m,m*(.7+e()*.6),m),n.updateMatrix(),o.setMatrixAt(d,n.matrix),this._obsInst(g,_,m*.92,m*1.3,o,d,n.matrix);const p=.62+e()*.3;s.setRGB(p,p*.92,p*.78),o.setColorAt(d,s)}o.instanceMatrix.needsUpdate=!0,o.instanceColor&&(o.instanceColor.needsUpdate=!0),this.scene.add(o);for(let d=0;d<3;d++){const u=new ut,f=26+e()*14,g=24+e()*12;for(const y of[-1,1]){const A=new K(new Wt(8,g,9),nt(10654588));A.position.set(y*f/2,g/2,0),A.castShadow=!0,u.add(A)}const _=new K(new Wt(f+8,8,9),nt(11575428));_.position.y=g+3,_.castShadow=!0,u.add(_);const m=e()*ot,p=40+e()*70,M=t.x+Math.cos(m)*p,x=t.z+Math.sin(m)*p,S=e()*ot;u.position.set(M,0,x),u.rotation.y=S,this.scene.add(u);const C=this._makeProp({object:u});for(const y of[-1,1])this._obs(M+y*(f/2)*Math.cos(S),x-y*(f/2)*Math.sin(S),4.6,g,C)}const c=Math.floor(26*this.densityScale)+6,l=An([new Lt(.6,1.1,12,6).translate(0,6,0),new Lt(.3,.5,6,5).rotateZ(.9).translate(2.2,10,0),new Lt(.3,.5,5,5).rotateZ(-1).translate(-2,9,.5)],!1),h=new $t(l,nt(7035460),c);h.castShadow=!0;for(let d=0;d<c;d++){const u=e()*ot,f=Math.sqrt(e())*t.r,g=t.x+Math.cos(u)*f,_=t.z+Math.sin(u)*f,m=.8+e()*.7;if(this._onRoad(g,_,2)){h.setMatrixAt(d,this._zeroMatrix);continue}n.position.set(g,0,_),n.rotation.set(0,e()*ot,0),n.scale.setScalar(m),n.updateMatrix(),h.setMatrixAt(d,n.matrix),this._obsInst(g,_,1.1*m,12*m,h,d,n.matrix)}h.instanceMatrix.needsUpdate=!0,this.scene.add(h),this._crystals(t,e)}_crystals(t,e){const r=new si(1,0),a=new $t(r,new Ee({color:16777215,emissive:3816010,flatShading:!0}),7*5);a.castShadow=!0;const o=[6288383,16736215,10976255,8257456],c=new jt,l=new yt;let h=0;for(let d=0;d<7;d++){let u=t.x,f=t.z;for(let m=0;m<8;m++){const p=d/7*ot+e()*.5,M=30+e()*80;if(u=t.x+Math.cos(p)*M,f=t.z+Math.sin(p)*M,!this._onRoad(u,f,5)&&Math.abs(u)<zt-12&&Math.abs(f)<zt-12)break}const g=o[d%o.length],_=[];for(let m=0;m<5;m++){const p=3+e()*5,M=.9+e()*.8,x=m===0?0:1.6+e()*1.4,S=e()*ot;c.position.set(u+Math.cos(S)*x,p*.7,f+Math.sin(S)*x),c.rotation.set((e()-.5)*.7,e()*ot,(e()-.5)*.7),c.scale.set(M,p,M),c.updateMatrix(),a.setMatrixAt(h,c.matrix),_.push({mesh:a,index:h,matrix:c.matrix.clone()}),l.setHex(g).multiplyScalar(.85+e()*.3),a.setColorAt(h,l),h++}this._obs(u,f,3.6,8,this._makeProp({meshes:_}))}a.instanceMatrix.needsUpdate=!0,a.instanceColor&&(a.instanceColor.needsUpdate=!0),this.scene.add(a)}_lake(){const t=Je(5150),e=new jt,n=mg();n.repeat.set(6,6);const s=new ps(Gt.r,48);s.rotateX(-Math.PI/2);const r=new K(s,new Ee({map:n,color:9427199,transparent:!0,opacity:.86}));r.position.set(Gt.x,.35,Gt.z),this.scene.add(r),this.water=r;const a=new K(new Ei(Gt.r,Gt.r+7,48).rotateX(-Math.PI/2),nt(15786932,!1));a.position.set(Gt.x,.12,Gt.z),this.scene.add(a);const o=new ps(1,10).rotateX(-Math.PI/2),c=new $t(o,nt(3778618,!1),40);for(let p=0;p<40;p++){const M=t()*ot,x=Math.sqrt(t())*(Gt.r-8);e.position.set(Gt.x+Math.cos(M)*x,.55,Gt.z+Math.sin(M)*x),e.rotation.set(0,t()*ot,0),e.scale.setScalar(1.6+t()*2.6),e.updateMatrix(),c.setMatrixAt(p,e.matrix)}c.instanceMatrix.needsUpdate=!0,this.scene.add(c);const l=new Lt(.16,.26,5,5),h=Math.floor(160*this.densityScale),d=new $t(l,nt(5219898),h);for(let p=0;p<h;p++){const M=t()*ot,x=Gt.r+2+t()*16;e.position.set(Gt.x+Math.cos(M)*x,2.5,Gt.z+Math.sin(M)*x),e.rotation.set((t()-.5)*.3,t()*ot,(t()-.5)*.3),e.scale.setScalar(.7+t()*.9),e.updateMatrix(),d.setMatrixAt(p,e.matrix)}d.instanceMatrix.needsUpdate=!0,this.scene.add(d);for(let p=0;p<2;p++){const M=new ut,x=Gt.r*2+18,S=new K(new Wt(x,1.1,11),nt(12615744));S.position.y=2.2,S.receiveShadow=!0,M.add(S);const C=18;for(let y=0;y<C;y++){const A=-x/2+(y+.5)*(x/C);for(const R of[-1,1]){const N=new K(new Wt(.8,3.4,.8),nt(11104572));N.position.set(A,4,R*5),M.add(N)}}for(const y of[-1,1]){const A=new K(new Wt(x,.7,.7),nt(13671002));A.position.set(0,5.4,y*5),M.add(A)}M.position.set(Gt.x,0,Gt.z),M.rotation.y=p===0?0:Math.PI/2,this.scene.add(M)}const u=new K(new Wt(26,1,8),nt(12089918));u.position.set(Gt.x+Gt.r*.5,2,Gt.z-Gt.r-6),u.rotation.y=.4,this.scene.add(u);const f=new ut,g=new K(new ce(4,14,8,0,ot,0,Math.PI/2),nt(14704698));g.rotation.x=Math.PI,g.scale.set(1,.55,2.1),f.add(g);const _=new K(new Lt(.25,.3,9,6),nt(9067051));_.position.y=4,f.add(_);const m=new K(new Vn(5,6),new Ee({color:16446434,side:Ve}));m.position.set(1.6,4.6,0),m.rotation.y=Math.PI/2,f.add(m),f.position.set(Gt.x+Gt.r*.2,1.4,Gt.z-Gt.r*.55),f.rotation.y=.7,this.scene.add(f),this.boat=f,this._lighthouse()}_lighthouse(){const t=Math.PI*1.25,e=Gt.x+Math.cos(t)*(Gt.r+16),n=Gt.z+Math.sin(t)*(Gt.r+16),s=new ut,r=new K(new Lt(6.4,7,2,16),nt(10262154));r.position.y=1,s.add(r);const a=nt(14698299),o=nt(16118248),c=5;for(let M=0;M<c;M++){const x=4.6-M/c*1.6,S=4.6-(M+1)/c*1.6,C=new K(new Lt(S,x,5.2,16),M%2?a:o);C.position.y=2+2.6+M*5.2,C.castShadow=!0,s.add(C)}const l=2+c*5.2,h=new K(new Lt(4.2,4.2,.8,16),nt(4015958));h.position.y=l+.4,s.add(h);const d=new K(new Lt(2.4,2.4,3.6,12),new Ee({color:16773808,emissive:11901482}));d.position.y=l+2.6,s.add(d);const u=new K(new be(3.4,3.4,12),a);u.position.y=l+6.1,s.add(u);const f=new ut;f.position.y=l+2.6;const g=new be(4,46,16,1,!0);g.translate(0,-23,0),g.rotateZ(Math.PI/2);const _=new fn({color:16774072,transparent:!0,opacity:.22,depthWrite:!1,side:Ve}),m=new K(g,_),p=new K(g,_);p.rotation.y=Math.PI,f.add(m,p),s.add(f),this.spinners.push({obj:f,speed:.9}),s.position.set(e,0,n),this.scene.add(s),this._obsObj(e,n,5.6,l+8,s)}_farm(){const t=xr[4],e=Je(8686),n=new jt,s={x:t.x+6,z:t.z+74},r={x:t.x+52,z:t.z+46},a=(x,S,C)=>Math.hypot(x-s.x,S-s.z)<9+C||Math.hypot(x-r.x,S-r.z)<7+C;this._silo(s.x,s.z),this._tractor(r.x,r.z,e()*ot);for(let x=0;x<5;x++){const S=new ut,C=new K(new Lt(3.4,6.2,34,12),nt(15789280,!1));C.position.y=17,C.castShadow=!0,S.add(C);const y=new K(new be(5,7,12),nt(12597547,!1));y.position.y=37,S.add(y);const A=new K(new Lt(1.2,1.2,2.4,10),nt(9067051));A.rotation.x=Math.PI/2,A.position.set(0,31,5.2),S.add(A);const R=new ut;R.position.set(0,31,6.2);for(let z=0;z<4;z++){const H=new K(new Wt(2.6,20,.6),nt(15262418,!1));H.position.y=10;const tt=new ut;tt.add(H);const G=new K(new Wt(4.4,14,.25),nt(14703162,!1));G.position.set(1.8,11,.4),tt.add(G),tt.rotation.z=z/4*ot,R.add(tt)}S.add(R);const N=x/5*ot,v=40+e()*70,b=t.x+Math.cos(N)*v,F=t.z+Math.sin(N)*v;S.position.set(b,0,F),S.rotation.y=e()*ot,this.scene.add(S),this._obsObj(b,F,6.4,38,S),this.windmills.push({blades:R,speed:.5+e()*.5})}const o=new Lt(4,4,6,12);o.rotateZ(Math.PI/2);const c=Math.floor(34*this.densityScale)+8,l=new $t(o,nt(14727514),c);l.castShadow=!0;for(let x=0;x<c;x++){const S=e()*ot,C=Math.sqrt(e())*t.r,y=t.x+Math.cos(S)*C,A=t.z+Math.sin(S)*C;if(Math.hypot(y,A)<95||this._onRoad(y,A,5)||a(y,A,4)){l.setMatrixAt(x,this._zeroMatrix);continue}const R=.7+e()*.6;n.position.set(y,4,A),n.rotation.set(0,e()*ot,0),n.scale.setScalar(R),n.updateMatrix(),l.setMatrixAt(x,n.matrix),this._obsInst(y,A,4.2*R,8*R,l,x,n.matrix)}l.instanceMatrix.needsUpdate=!0,this.scene.add(l);const h=new be(1.1,4,5),d=Math.floor(420*this.densityScale),u=new $t(h,nt(14207306),d),f=new yt;for(let x=0;x<d;x++){const S=Math.floor(x/30),C=x%30,y=t.x-70+C*4.6+(e()-.5)*1.4,A=t.z-30+S*5.2+(e()-.5)*1.4;if(Math.abs(y)>zt-10||Math.abs(A)>zt-10||Math.hypot(y,A)<95||this._onRoad(y,A,1)||a(y,A,1)){u.setMatrixAt(x,new ie().makeScale(0,0,0));continue}n.position.set(y,2,A),n.rotation.set(0,e()*ot,0),n.scale.setScalar(.7+e()*.6),n.updateMatrix(),u.setMatrixAt(x,n.matrix),f.setHSL(.13+e()*.05,.62,.45+e()*.12),u.setColorAt(x,f)}u.instanceMatrix.needsUpdate=!0,u.instanceColor&&(u.instanceColor.needsUpdate=!0),this.scene.add(u);const g=new ut,_=new K(new Wt(34,20,24),nt(12597547,!1));_.position.y=10,_.castShadow=!0,g.add(_);const m=new Lt(19,19,26,3,1);m.rotateX(-Math.PI/2),m.scale(1,.55,1),m.translate(0,20+19*.55,0);const p=new K(m,nt(9316896,!1));p.castShadow=!0,g.add(p);const M=new K(new Wt(9,12,.6),nt(7027229));M.position.set(0,6,12.2),g.add(M),g.position.set(t.x-30,0,t.z+60),g.rotation.y=.3,this.scene.add(g),this._obsObj(t.x-30,t.z+60,19,30,g)}_silo(t,e){const n=new ut,s=new K(new Lt(6,6,30,18),nt(12109004,!1));s.position.y=15,s.castShadow=!0,n.add(s);for(let a=1;a<5;a++){const o=new K(new Lt(6.15,6.15,.5,18),nt(9082785,!1));o.position.y=a*6,n.add(o)}const r=new K(new ce(6,18,8,0,ot,0,Math.PI/2),nt(13649722,!1));r.position.y=30,n.add(r),n.position.set(t,0,e),this.scene.add(n),this._obsObj(t,e,6.4,36,n)}_tractor(t,e,n){const s=new ut,r=nt(4170573),a=nt(2303533),o=new K(new Wt(3.6,2.6,5.6),r);o.position.set(0,2.6,1.6),s.add(o);const c=new K(new Wt(4,4.2,3.6),r);c.position.set(0,4,-2.2),s.add(c);const l=new K(new Wt(4.6,.5,4.2),nt(16118248));l.position.set(0,6.4,-2.2),s.add(l);const h=new K(new Wt(3.2,2,.2),nt(12577279,!1));h.position.set(0,4.6,-.35),s.add(h);const d=new K(new Lt(.25,.25,3,6),nt(4015958));d.position.set(1.1,5,3.2),s.add(d);const u=new Lt(2.4,2.4,1.3,14).rotateZ(Math.PI/2),f=new Lt(1.3,1.3,1,12).rotateZ(Math.PI/2);for(const g of[-1,1]){const _=new K(u,a);_.position.set(g*2.6,2.4,-2.2),s.add(_);const m=new K(f,a);m.position.set(g*2.2,1.3,3.2),s.add(m)}s.position.set(t,0,e),s.rotation.y=n,this.scene.add(s),this._obsObj(t,e,4.6,7,s)}_ruins(){const t=Ls[0],e=Je(1212),n=new jt,s=10,r=new $t(new Lt(1,1.1,1,10),nt(14275264),s),a=new $t(new Wt(1,1,1),nt(13222058),s);r.castShadow=!0,a.castShadow=!0;for(let d=0;d<s;d++){const u=d/s*ot,f=t.x+Math.cos(u)*22,g=t.z+Math.sin(u)*22,_=d%3===1,m=_?4+e()*5:13+e()*4;n.position.set(f,m/2,g),n.rotation.set(0,e()*ot,_?(e()-.5)*.12:0),n.scale.set(2.2,m,2.2),n.updateMatrix(),r.setMatrixAt(d,n.matrix);const p=n.matrix.clone();_?a.setMatrixAt(d,this._zeroMatrix):(n.position.set(f,m+.7,g),n.rotation.set(0,u,0),n.scale.set(5.6,1.4,5.6),n.updateMatrix(),a.setMatrixAt(d,n.matrix));const M=[{mesh:r,index:d,matrix:p}];_||M.push({mesh:a,index:d,matrix:n.matrix.clone()}),this._obs(f,g,2.6,m+1.4,this._makeProp({meshes:M}))}r.instanceMatrix.needsUpdate=!0,a.instanceMatrix.needsUpdate=!0,this.scene.add(r,a);const o=new ut,c=new K(new Lt(7,7.6,1.2,8),nt(13222058));c.position.y=.6,o.add(c);const l=new K(new Wt(6,3,6),nt(11971475));l.position.y=2.7,l.castShadow=!0,o.add(l);const h=new K(new si(2.2,0),new Ee({color:7336191,emissive:1932684,flatShading:!0}));h.scale.set(1,1.6,1),h.position.y=8.5,o.add(h),this.spinners.push({obj:h,speed:1.1}),this.floaters.push({obj:h,y0:8.5,phase:0}),o.position.set(t.x,0,t.z),this.scene.add(o),this._obsObj(t.x,t.z,6.6,12,o)}_ferrisWheel(){const t=Ls[1],e=24,n=30,s=new ut,r=nt(16118248),a=nt(5925544),o=Math.hypot(13,n),c=Math.atan2(13,n),l=[];for(const R of[-5,5])for(const N of[-1,1])l.push(new Lt(.7,.9,o,8).rotateZ(N*c).translate(N*6.5,n/2,R));l.push(new Lt(1.4,1.4,12,10).rotateX(Math.PI/2).translate(0,n,0));const h=new K(An(l,!1),a);h.castShadow=!0,s.add(h);const d=new ut;d.position.y=n;const u=[];for(const R of[-3,3]){u.push(new Ri(e,.55,6,48).translate(0,0,R));for(let N=0;N<8;N++){const v=N/8*ot;u.push(new Wt(.45,e,.45).translate(0,e/2,0).rotateZ(v).translate(0,0,R))}}for(let R=0;R<8;R++){const N=R/8*ot;u.push(new Lt(.35,.35,6,6).rotateX(Math.PI/2).translate(Math.cos(N)*e,Math.sin(N)*e,0))}const f=new K(An(u,!1),r);f.castShadow=!0,d.add(f),s.add(d);const g=An([new Wt(3.6,3,3.4).translate(0,-2.4,0),new be(2.8,1.6,4).rotateY(Math.PI/4).translate(0,-.2,0)],!1),_=new $t(g,nt(16777215),8);_.instanceMatrix.setUsage(zs);const m=[16736122,5163519,13171554,16751165,11561471,4184496,16743093,5930495],p=new yt;m.forEach((R,N)=>_.setColorAt(N,p.setHex(R))),_.instanceColor&&(_.instanceColor.needsUpdate=!0),s.add(_);const M=new ut,x=new K(new Wt(4,4.4,4),nt(16743093));x.position.y=2.2,M.add(x);const S=new K(new be(3.8,2,4).rotateY(Math.PI/4),nt(16118248));S.position.y=5.4,M.add(S),M.position.set(-16,0,-18),s.add(M),s.position.set(t.x,0,t.z),s.rotation.y=Math.PI/2,this.scene.add(s),this.ferris={wheel:d,cabins:_,R:e,HUB:n,dummy:new jt},this._updateFerris();const C=(R,N)=>({x:t.x+N,z:t.z-R}),y=this._makeProp({object:s});for(const R of[-5,5])for(const N of[-13,13]){const v=C(N,R);this._obs(v.x,v.z,2.4,n+2,y)}for(const R of[-16,-8,0,8,16]){const N=C(R,0);this._obs(N.x,N.z,4.2,n+e,y)}const A=C(-16,-18);this._obs(A.x,A.z,3.2,6.4,y)}_updateFerris(){const t=this.ferris;if(!t)return;const e=t.wheel.rotation.z;for(let n=0;n<8;n++){const s=n/8*ot+e;t.dummy.position.set(Math.cos(s)*t.R,t.HUB+Math.sin(s)*t.R,0),t.dummy.updateMatrix(),t.cabins.setMatrixAt(n,t.dummy.matrix)}t.cabins.instanceMatrix.needsUpdate=!0}_campsite(){const t=Ls[2],e=Je(3131),n=new jt,s=new yt,r=new be(6,7,4).translate(0,3.5,0),a=new $t(r,nt(16777215),4);a.castShadow=!0;const o=new Vn(3,4.6).translate(0,2.3,0),c=new $t(o,new Ee({color:3811866,side:Ve}),4),l=[16751165,4184496,16736122,9071615];[Math.PI*.35,Math.PI*.75,Math.PI*1.25,Math.PI*1.65].forEach((p,M)=>{const x=t.x+Math.cos(p)*17,S=t.z+Math.sin(p)*17,C=Math.atan2(t.x-x,t.z-S);n.position.set(x,0,S),n.rotation.set(0,C+Math.PI/4,0),n.updateMatrix(),a.setMatrixAt(M,n.matrix),a.setColorAt(M,s.setHex(l[M]));const y=n.matrix.clone();n.position.set(x+Math.sin(C)*4.35,0,S+Math.cos(C)*4.35),n.rotation.set(-.53,C,0,"YXZ"),n.updateMatrix(),c.setMatrixAt(M,n.matrix),this._obs(x,S,4.8,7,this._makeProp({meshes:[{mesh:a,index:M,matrix:y},{mesh:c,index:M,matrix:n.matrix.clone()}]}))}),a.instanceMatrix.needsUpdate=!0,c.instanceMatrix.needsUpdate=!0,a.instanceColor&&(a.instanceColor.needsUpdate=!0),this.scene.add(a,c);const d=new ut,u=new K(new Ri(3,.8,6,12).rotateX(Math.PI/2),nt(9276036));u.position.y=.5,d.add(u);for(const p of[.5,-.6]){const M=new K(new Lt(.45,.45,5,6).rotateZ(Math.PI/2),nt(7029795));M.rotation.y=p,M.position.y=.7,d.add(M)}const f=new K(new be(1.7,4.2,7).translate(0,2.1,0),new fn({color:16742943})),g=new K(new be(.95,2.8,7).translate(0,1.4,0),new fn({color:16769126}));f.position.y=.6,g.position.y=.6,d.add(f,g),this.flames.push(f,g),d.position.set(t.x,0,t.z),this.scene.add(d),this._obsObj(t.x,t.z,3.8,4,d);const _=new $t(new Lt(.9,.9,5.5,8).rotateZ(Math.PI/2),nt(9067051),3);[.1,.55,.95].forEach((p,M)=>{const x=p*ot+Math.PI*.5,S=t.x+Math.cos(x)*8.5,C=t.z+Math.sin(x)*8.5;n.position.set(S,.9,C),n.rotation.set(0,Math.PI/2-x,0),n.updateMatrix(),_.setMatrixAt(M,n.matrix),this._obsInst(S,C,2.2,1.8,_,M,n.matrix)}),_.instanceMatrix.needsUpdate=!0,this.scene.add(_);const m=[];for(let p=0;p<9;p++){const M=Math.PI*(1.1+p/8*.8)+(e()-.5)*.15,x=27+e()*8;m.push({x:t.x+Math.cos(M)*x,z:t.z+Math.sin(M)*x,s:.8+e()*.5,r:e()*ot})}this._plantPines(m,e)}_giantMushrooms(){const t=Ls[3],e=Je(7777),n=new jt,s=new yt,r=[{ox:-6,oz:-2,h:24,cap:15,c:11561471},{ox:12,oz:20,h:16,cap:11,c:5151743},{ox:-14,oz:24,h:19,cap:12,c:16734810},{ox:10,oz:-22,h:14,cap:10,c:4184496},{ox:-22,oz:-24,h:18,cap:12,c:16743093},{ox:-26,oz:6,h:12,cap:8,c:16751165}],a=9,o=new $t(new Lt(.75,1,1,12),nt(15985366),r.length),c=new $t(new ce(1,18,9,0,ot,0,Math.PI/2),nt(16777215,!1),r.length),l=new $t(new ce(1,8,6),nt(16775920,!1),r.length*a);o.castShadow=!0,c.castShadow=!0,r.forEach((u,f)=>{const g=t.x+u.ox,_=t.z+u.oz,m=u.cap*.22;n.position.set(g,u.h/2,_),n.rotation.set(0,0,0),n.scale.set(m,u.h,m),n.updateMatrix(),o.setMatrixAt(f,n.matrix);const p=[{mesh:o,index:f,matrix:n.matrix.clone()}];n.position.set(g,u.h-.5,_),n.scale.set(u.cap,u.cap*.55,u.cap),n.updateMatrix(),c.setMatrixAt(f,n.matrix),c.setColorAt(f,s.setHex(u.c)),p.push({mesh:c,index:f,matrix:n.matrix.clone()});for(let M=0;M<a;M++){const x=f*a+M,S=M/a*ot+e()*.5,C=M===0?Math.PI/2:.35+e()*.75,y=Math.cos(C)*Math.cos(S)*u.cap,A=Math.sin(C)*u.cap*.55,R=Math.cos(C)*Math.sin(S)*u.cap,N=u.cap*(.1+e()*.05);n.position.set(g+y,u.h-.5+A,_+R),n.scale.set(N,N*.45,N),n.updateMatrix(),l.setMatrixAt(x,n.matrix),p.push({mesh:l,index:x,matrix:n.matrix.clone()})}this._obs(g,_,m+.6,u.h+u.cap*.55,this._makeProp({meshes:p}))}),o.instanceMatrix.needsUpdate=!0,c.instanceMatrix.needsUpdate=!0,l.instanceMatrix.needsUpdate=!0,c.instanceColor&&(c.instanceColor.needsUpdate=!0),this.scene.add(o,c,l);const h=Math.floor(40*this.densityScale)+10,d=new $t(An([new Lt(.18,.24,1,6).translate(0,.5,0),new ce(.6,8,5,0,ot,0,Math.PI/2).scale(1,.7,1).translate(0,1,0)],!1),new Ee({color:16777215,emissive:2767418}),h);for(let u=0;u<h;u++){const f=e()*ot,g=6+Math.sqrt(e())*(t.r-6);n.position.set(t.x+Math.cos(f)*g,0,t.z+Math.sin(f)*g),n.rotation.set(0,e()*ot,0),n.scale.setScalar(.8+e()*1.2),n.updateMatrix(),d.setMatrixAt(u,n.matrix),s.setHSL(.45+e()*.4,.9,.62),d.setColorAt(u,s)}d.instanceMatrix.needsUpdate=!0,d.instanceColor&&(d.instanceColor.needsUpdate=!0),this.scene.add(d)}_scatter(){const t=Je(60606),e=new jt,n=new yt,s=Math.floor(1400*this.densityScale),r=An([new be(.35,2.4,4).translate(0,1.2,0),new be(.3,1.9,4).rotateZ(.4).translate(.7,.9,.2),new be(.3,2,4).rotateZ(-.45).translate(-.65,1,-.2)],!1),a=new $t(r,nt(5225528),s);for(let u=0;u<s;u++){const f=(t()*2-1)*(zt-6),g=(t()*2-1)*(zt-6);if(!this._isOpenGround(f,g)){a.setMatrixAt(u,new ie().makeScale(0,0,0));continue}e.position.set(f,0,g),e.rotation.set(0,t()*ot,0),e.scale.setScalar(.7+t()*1.1),e.updateMatrix(),a.setMatrixAt(u,e.matrix),n.setHSL(.26+t()*.08,.6,.34+t()*.16),a.setColorAt(u,n)}a.instanceMatrix.needsUpdate=!0,a.instanceColor&&(a.instanceColor.needsUpdate=!0),this.scene.add(a);const o=Math.floor(560*this.densityScale),c=An([new Lt(.09,.09,1.6,4).translate(0,.8,0),new ce(.5,8,6).translate(0,1.8,0)],!1),l=new $t(c,nt(16777215,!1),o);for(let u=0;u<o;u++){const f=(t()*2-1)*(zt-8),g=(t()*2-1)*(zt-8);if(!this._isOpenGround(f,g)){l.setMatrixAt(u,new ie().makeScale(0,0,0));continue}e.position.set(f,0,g),e.rotation.set(0,t()*ot,0),e.scale.setScalar(.9+t()*.9),e.updateMatrix(),l.setMatrixAt(u,e.matrix),n.setHSL(t(),.85,.62),l.setColorAt(u,n)}l.instanceMatrix.needsUpdate=!0,l.instanceColor&&(l.instanceColor.needsUpdate=!0),this.scene.add(l);const h=Math.floor(220*this.densityScale),d=new $t(new nc(1,0),nt(10394772),h);d.castShadow=!0;for(let u=0;u<h;u++){const f=(t()*2-1)*(zt-10),g=(t()*2-1)*(zt-10);if(!this._isOpenGround(f,g)){d.setMatrixAt(u,new ie().makeScale(0,0,0));continue}const _=.7+t()*2.2;e.position.set(f,_*.4,g),e.rotation.set(t()*ot,t()*ot,t()*ot),e.scale.setScalar(_),e.updateMatrix(),d.setMatrixAt(u,e.matrix),_>1.5&&this._obsInst(f,g,_*.9,_*1.2,d,u,e.matrix)}d.instanceMatrix.needsUpdate=!0,this.scene.add(d)}_clouds(){const t=Je(11111),e=this.quality==="low"?16:34,n=new ce(1,10,7),s=new Ee({color:16777215,fog:!1});for(let r=0;r<e;r++){const a=new ut,o=3+Math.floor(t()*4);for(let c=0;c<o;c++){const l=10+t()*16,h=new K(n,s);h.position.set((t()-.5)*34,(t()-.5)*8,(t()-.5)*22),h.scale.set(l,l*.7,l),a.add(h)}a.position.set((t()*2-1)*900,150+t()*190,(t()*2-1)*900),this.scene.add(a),this.clouds.push({obj:a,speed:1.4+t()*2.6})}}_balloons(){const t=Je(24680),e=this.quality==="low"?3:7,n=[16736122,5163519,16765501,9234522,12618751,16751165];for(let s=0;s<e;s++){const r=new ut,a=n[s%n.length],o=new K(new ce(11,16,12),nt(a,!1));o.scale.set(1,1.25,1),o.position.y=12,r.add(o);const c=new K(new ce(11.1,16,12,0,.5),nt(16777215,!1));c.scale.set(1,1.25,1),c.position.y=12,r.add(c);const l=new K(new be(5,6,12),nt(a,!1));l.position.y=1,l.rotation.x=Math.PI,r.add(l);const h=new K(new Wt(6,5,6),nt(11564598,!1));h.position.y=-5,r.add(h);for(const f of[-1,1])for(const g of[-1,1]){const _=new K(new Lt(.16,.16,6,4),nt(7035460));_.position.set(f*2.6,-1.5,g*2.6),r.add(_)}const d=t()*ot,u=180+t()*380;r.position.set(Math.cos(d)*u,110+t()*110,Math.sin(d)*u),this.scene.add(r),this.balloons.push({obj:r,a:d,rad:u,speed:.035+t()*.05,bob:t()*ot,y0:r.position.y})}}isWater(t,e){return Math.hypot(t-Gt.x,e-Gt.z)<Gt.r}update(t){this.time+=t;for(let e=this._eatenProps.length-1;e>=0;e--){const n=this._eatenProps[e];n.respawn-=t,n.respawn<=0&&(n.alive=!0,this._setPropVisible(n,!0),this._eatenProps.splice(e,1))}for(const e of this.windmills)e.blades.rotation.z+=t*e.speed;this.ferris&&(this.ferris.wheel.rotation.z+=t*.12,this._updateFerris());for(const e of this.spinners)e.obj.rotation.y+=t*e.speed;for(const e of this.floaters)e.obj.position.y=e.y0+Math.sin(this.time*1.6+e.phase)*.8;for(let e=0;e<this.flames.length;e++){const n=this.flames[e],s=.85+Math.sin(this.time*(11+e*3))*.1+Math.sin(this.time*(17+e*5))*.07;n.scale.set(1,s,1),n.rotation.y+=t*(e%2?-2:1.5)}if(this.smoke)for(const e of this.smoke)e.t=(e.t+t*.22)%1,e.mesh.position.y=17+e.t*12,e.mesh.position.x=4.2+Math.sin(e.t*5)*.8+e.t*2,e.mesh.scale.setScalar(.8+e.t*2.2),e.mesh.material.opacity=.75*(1-e.t);for(const e of this.clouds)e.obj.position.x+=e.speed*t,e.obj.position.x>1100&&(e.obj.position.x=-1100);for(const e of this.balloons)e.a+=e.speed*t*.1,e.obj.position.x=Math.cos(e.a)*e.rad,e.obj.position.z=Math.sin(e.a)*e.rad,e.obj.position.y=e.y0+Math.sin(this.time*.5+e.bob)*7,e.obj.rotation.y+=t*.1;this.water&&this.water.material.map&&(this.water.material.map.offset.x=this.time*.012,this.water.material.map.offset.y=Math.sin(this.time*.15)*.02),this.boat&&(this.boat.position.y=1.4+Math.sin(this.time*.8)*.4,this.boat.rotation.z=Math.sin(this.time*.6)*.05)}}const Tl=[16731482,16747069,16765501,9234522,4184458,5163519,5930495,11561471,16736192,16777215],vg=16756736,Ih=500,Mn=24,xn=Math.ceil(zt*2/Mn);class Mg{constructor(t,e="high",n=null){this.scene=t,this.world=n,this.count=e==="low"?1500:e==="medium"?2400:3300,this.px=new Float32Array(this.count),this.pz=new Float32Array(this.count),this.sc=new Float32Array(this.count),this.grow=new Float32Array(this.count),this.timer=new Float32Array(this.count),this.cellOf=new Int32Array(this.count),this.value=new Float32Array(this.count),this.gold=new Uint8Array(this.count),this.goldChance=0,this.respawnMul=1,this.time=0,this.cells=new Array(xn*xn);for(let a=0;a<this.cells.length;a++)this.cells[a]=[];const s=new ce(1,12,9),r=new Ee({});this.mesh=new $t(s,r,this.count),this.mesh.instanceMatrix.setUsage(zs),this.mesh.frustumCulled=!1,t.add(this.mesh),this._dummy=new jt,this._color=new yt;for(let a=0;a<this.count;a++)this.cellOf[a]=-1,this._spawn(a,!0);this.mesh.instanceMatrix.needsUpdate=!0,this.mesh.instanceColor&&(this.mesh.instanceColor.needsUpdate=!0),this._dirty=!0}_cellIndex(t,e){const n=Math.min(xn-1,Math.max(0,Math.floor((t+zt)/Mn))),s=Math.min(xn-1,Math.max(0,Math.floor((e+zt)/Mn)));return n+s*xn}_addToCell(t){const e=this._cellIndex(this.px[t],this.pz[t]);this.cellOf[t]=e,this.cells[e].push(t)}_removeFromCell(t){const e=this.cellOf[t];if(e<0)return;const n=this.cells[e],s=n.indexOf(t);s>=0&&n.splice(s,1),this.cellOf[t]=-1}_randomSpot(){let t=0,e=0;for(let n=0;n<12&&(t=ye(-zt+10,zt-10),e=ye(-zt+10,zt-10),!(!(Math.hypot(t-Gt.x,e-Gt.z)<Gt.r-4)&&!(this.world&&this.world.isInsideObstacle(t,e,1.5))));n++);return{x:t,z:e}}_spawn(t,e=!1){const n=this._randomSpot(),s=this.goldChance>0&&Math.random()<this.goldChance;this.px[t]=n.x,this.pz[t]=n.z,this.gold[t]=s?1:0,this.sc[t]=s?ye(2.1,2.5):ye(.85,1.75),this.value[t]=s?Ih:Math.round(5+this.sc[t]*7),this.timer[t]=0,this.grow[t]=e?1:0,this._addToCell(t),this._color.setHex(s?vg:Tl[Math.random()*Tl.length|0]),this.mesh.setColorAt(t,this._color),this.mesh.instanceColor&&(this.mesh.instanceColor.needsUpdate=!0),this._writeMatrix(t)}_writeMatrix(t){const e=this._dummy,n=this.sc[t]*this.grow[t];if(n<=.001){e.matrix.makeScale(0,0,0),this.mesh.setMatrixAt(t,e.matrix);return}const s=this.gold[t]?1.4+Math.sin(this.time*3+t)*.6:0;e.position.set(this.px[t],n+s,this.pz[t]),e.rotation.set(0,0,0),e.scale.setScalar(n),e.updateMatrix(),this.mesh.setMatrixAt(t,e.matrix)}setMode({goldChance:t=0,respawnMul:e=1}={}){if(!(t===this.goldChance&&e===this.respawnMul)){this.goldChance=t,this.respawnMul=e;for(let n=0;n<this.count;n++)this._removeFromCell(n),this._spawn(n,!0);this._dirty=!0}}eat(t,e,n){const s=n,r=Math.max(0,Math.floor((t-s+zt)/Mn)),a=Math.min(xn-1,Math.floor((t+s+zt)/Mn)),o=Math.max(0,Math.floor((e-s+zt)/Mn)),c=Math.min(xn-1,Math.floor((e+s+zt)/Mn));let l=0,h=0,d=0,u=t,f=e;for(let g=o;g<=c;g++)for(let _=r;_<=a;_++){const m=this.cells[_+g*xn];for(let p=m.length-1;p>=0;p--){const M=m[p];if(this.timer[M]>0)continue;const x=this.px[M]-t,S=this.pz[M]-e,C=s+this.sc[M]*.6;x*x+S*S<=C*C&&(l+=this.value[M],h++,d+=this.gold[M],u=this.px[M],f=this.pz[M],this._consume(M))}}return h&&(this._dirty=!0),{value:l,count:h,gold:d,lastX:u,lastZ:f}}_consume(t){this._removeFromCell(t),this.timer[t]=ye(2.5,7)*this.respawnMul,this.grow[t]=0,this._writeMatrix(t)}attract(t,e,n,s){const r=Math.max(0,Math.floor((t-n+zt)/Mn)),a=Math.min(xn-1,Math.floor((t+n+zt)/Mn)),o=Math.max(0,Math.floor((e-n+zt)/Mn)),c=Math.min(xn-1,Math.floor((e+n+zt)/Mn)),l=[];for(let h=o;h<=c;h++)for(let d=r;d<=a;d++){const u=this.cells[d+h*xn];for(let f=0;f<u.length;f++){const g=u[f];if(this.timer[g]>0)continue;const _=t-this.px[g],m=e-this.pz[g],p=Math.hypot(_,m);if(p>n||p<.01)continue;const M=Math.min(p,(1-p/n)*60*s+6*s);this.px[g]+=_/p*M,this.pz[g]+=m/p*M,l.push(g)}}for(const h of l)this._cellIndex(this.px[h],this.pz[h])!==this.cellOf[h]&&(this._removeFromCell(h),this._addToCell(h)),this._writeMatrix(h);l.length&&(this._dirty=!0)}update(t){this.time+=t;let e=this._dirty;const n=this.goldChance>0;for(let s=0;s<this.count;s++)this.timer[s]>0?(this.timer[s]-=t,this.timer[s]<=0&&(this._spawn(s),e=!0)):(this.grow[s]<1||n&&this.gold[s])&&(this.grow[s]=Math.min(1,this.grow[s]+t*3.2),this._writeMatrix(s),e=!0);e&&(this.mesh.instanceMatrix.needsUpdate=!0,this._dirty=!1)}}const yn={COIN:0,SPEED:1,MAGNET:2,SHIELD:3};class yg{constructor(t,e="high",n=null){this.scene=t,this.world=n,this.items=[],this.time=0;const s=e==="low"?34:60,r=e==="low"?9:18,a=new Lt(1.5,1.5,.42,16);a.rotateX(Math.PI/2),this.coinMesh=new $t(a,new Ee({color:16762394,emissive:5061120}),s),this.coinMesh.instanceMatrix.setUsage(zs),this.coinMesh.frustumCulled=!1,this.coinMesh.castShadow=!0,t.add(this.coinMesh);const o=new si(2.1,0);this.powerMesh=new $t(o,new Ee({vertexColors:!1,color:16777215}),r),this.powerMesh.instanceMatrix.setUsage(zs),this.powerMesh.frustumCulled=!1,t.add(this.powerMesh);const c=new yt;for(let l=0;l<s;l++)this.items.push(this._make(yn.COIN,l,"coin"));for(let l=0;l<r;l++){const h=[yn.SPEED,yn.MAGNET,yn.SHIELD][l%3],d=this._make(h,l,"power");this.items.push(d),c.setHex(h===yn.SPEED?5163519:h===yn.MAGNET?16736122:11561471),this.powerMesh.setColorAt(l,c)}this.powerMesh.instanceColor&&(this.powerMesh.instanceColor.needsUpdate=!0),this._dummy=new jt,this._writeAll()}_freeSpot(){let t=0,e=0;for(let n=0;n<12;n++){const s=Math.random()*ot,r=Math.sqrt(Math.random())*(zt-24);if(t=Math.cos(s)*r,e=Math.sin(s)*r,!(Math.hypot(t-Gt.x,e-Gt.z)<Gt.r-4)&&!(this.world&&this.world.isInsideObstacle(t,e,3)))break}return{x:t,z:e}}_make(t,e,n){const s=this._freeSpot();return{type:t,slot:e,mesh:n,x:s.x,z:s.z,alive:!0,timer:0,phase:Math.random()*ot}}_respawn(t){const e=this._freeSpot();t.x=e.x,t.z=e.z,t.alive=!0}_writeAll(){const t=this._dummy;for(const e of this.items){const n=e.mesh==="coin"?this.coinMesh:this.powerMesh;if(!e.alive){t.matrix.makeScale(0,0,0),n.setMatrixAt(e.slot,t.matrix);continue}const s=Math.sin(this.time*2+e.phase)*.7;t.position.set(e.x,3.2+s,e.z),t.rotation.set(0,this.time*1.8+e.phase,e.mesh==="coin"?0:this.time*1.2),t.scale.setScalar(1),t.updateMatrix(),n.setMatrixAt(e.slot,t.matrix)}this.coinMesh.instanceMatrix.needsUpdate=!0,this.powerMesh.instanceMatrix.needsUpdate=!0}collect(t,e,n){const s=[];for(const r of this.items){if(!r.alive)continue;const a=r.x-t,o=r.z-e,c=n+3;a*a+o*o<=c*c&&(r.alive=!1,r.timer=r.type===yn.COIN?22:32,s.push({type:r.type,x:r.x,z:r.z}))}return s}update(t){this.time+=t;for(const e of this.items)e.alive||(e.timer-=t,e.timer<=0&&this._respawn(e));this._writeAll()}}const En=320;class Sg{constructor(t){this.scene=t;const e=new Be;this.positions=new Float32Array(En*3),this.colors=new Float32Array(En*3),e.setAttribute("position",new Xe(this.positions,3)),e.setAttribute("color",new Xe(this.colors,3)),e.setDrawRange(0,En);const n=new Th({size:2.6,map:pg(),vertexColors:!0,transparent:!0,depthWrite:!1,blending:qa,sizeAttenuation:!0});this.points=new og(e,n),this.points.frustumCulled=!1,this.points.renderOrder=500,t.add(this.points),this.vel=new Float32Array(En*3),this.life=new Float32Array(En),this.maxLife=new Float32Array(En),this.baseColor=new Float32Array(En*3),this.cursor=0;for(let s=0;s<En;s++)this.positions[s*3+1]=-9999;this.popups=[],this.popupPool=[]}burst(t,e,n,s=16777215,r=8,a=9){const o=new yt(s);for(let c=0;c<r;c++){const l=this.cursor;this.cursor=(this.cursor+1)%En,this.positions[l*3]=t,this.positions[l*3+1]=e,this.positions[l*3+2]=n;const h=Math.random()*ot,d=ye(.4,1.2),u=ye(.4,1)*a;this.vel[l*3]=Math.cos(h)*u,this.vel[l*3+1]=d*a*.7,this.vel[l*3+2]=Math.sin(h)*u,this.baseColor[l*3]=o.r,this.baseColor[l*3+1]=o.g,this.baseColor[l*3+2]=o.b,this.colors[l*3]=o.r,this.colors[l*3+1]=o.g,this.colors[l*3+2]=o.b,this.maxLife[l]=ye(.35,.7),this.life[l]=this.maxLife[l]}}popup(t,e,n,s,r="#ffd93d"){let a=this.popupPool.pop();if(!a){const c=document.createElement("canvas");c.width=256,c.height=128;const l=new oi(c);l.colorSpace=De;const h=new ec({map:l,transparent:!0,depthTest:!1,depthWrite:!1}),d=new Ah(h);d.renderOrder=950,a={canvas:c,ctx:c.getContext("2d"),tex:l,mat:h,sprite:d}}const o=a.ctx;o.clearRect(0,0,256,128),o.textAlign="center",o.font='900 68px "Nunito", "Arial Black", "Segoe UI Black", Impact, sans-serif',o.lineWidth=12,o.lineJoin="round",o.strokeStyle="rgba(0,0,0,0.9)",o.strokeText(t,128,88),o.fillStyle=r,o.fillText(t,128,88),a.tex.needsUpdate=!0,a.sprite.position.set(e,n,s),a.sprite.scale.set(8,4,1),a.mat.opacity=1,this.scene.add(a.sprite),this.popups.push({p:a,life:1.1,y0:n})}update(t){const e=this.positions;let n=!1;for(let s=0;s<En;s++){if(this.life[s]<=0)continue;if(n=!0,this.life[s]-=t,this.life[s]<=0){e[s*3+1]=-9999,this.colors[s*3]=this.colors[s*3+1]=this.colors[s*3+2]=0;continue}this.vel[s*3+1]-=24*t,e[s*3]+=this.vel[s*3]*t,e[s*3+1]+=this.vel[s*3+1]*t,e[s*3+2]+=this.vel[s*3+2]*t;const r=this.life[s]/this.maxLife[s];this.colors[s*3]=this.baseColor[s*3]*r,this.colors[s*3+1]=this.baseColor[s*3+1]*r,this.colors[s*3+2]=this.baseColor[s*3+2]*r}n&&(this.points.geometry.attributes.position.needsUpdate=!0,this.points.geometry.attributes.color.needsUpdate=!0);for(let s=this.popups.length-1;s>=0;s--){const r=this.popups[s];r.life-=t,r.p.sprite.position.y=r.y0+(1.1-r.life)*9,r.p.mat.opacity=Math.max(0,Math.min(1,r.life*1.6)),r.life<=0&&(this.scene.remove(r.p.sprite),this.popupPool.push(r.p),this.popups.splice(s,1))}}}const Fa=new Map;function Q(i,t={}){var s;const e=i+"|"+JSON.stringify(t);if(Fa.has(e))return Fa.get(e);const n=t.shiny?new cg({color:i,shininess:90,specular:7829367,flatShading:!!t.flat}):new Ee({color:i,flatShading:!!t.flat,transparent:!!t.transparent,opacity:(s=t.opacity)!=null?s:1});return t.emissive&&(n.emissive=new yt(t.emissive)),Fa.set(e,n),n}const Oa=new Map;function Li(i,t){return Oa.has(i)||Oa.set(i,t()),Oa.get(i)}const Pe=(i,t,e)=>Li(`b${i}_${t}_${e}`,()=>new Wt(i,t,e)),pe=(i,t,e,n=14)=>Li(`c${i}_${t}_${e}_${n}`,()=>new Lt(i,t,e,n)),we=(i,t=16,e=12)=>Li(`s${i}_${t}_${e}`,()=>new ce(i,t,e)),gi=(i,t=18)=>Li(`hs${i}_${t}`,()=>new ce(i,t,10,0,Math.PI*2,0,Math.PI/2)),Qe=(i,t,e=14)=>Li(`k${i}_${t}_${e}`,()=>new be(i,t,e)),kn=(i,t,e=16)=>Li(`t${i}_${t}_${e}`,()=>new Ri(i,t,8,e));function Z(i,t,e=0,n=0,s=0){const r=new K(i,t);return r.position.set(e,n,s),r.castShadow=!0,r}const Qt={none:()=>null,bunny:()=>{const i=new ut;for(const t of[-1,1]){const e=Z(we(.22,12,10),Q(16645119),t*.34,1.42,-.12);e.scale.set(1,3.1,.55),e.rotation.z=t*-.18,i.add(e);const n=Z(we(.13,10,8),Q(16757704),t*.345,1.42,-.02);n.scale.set(1,3.4,.4),n.rotation.z=t*-.18,i.add(n)}return i},cat:()=>{const i=new ut;for(const t of[-1,1]){const e=Z(Qe(.3,.55,4),Q(14251818),t*.5,.98,-.05);e.rotation.z=t*-.38,i.add(e);const n=Z(Qe(.17,.36,4),Q(16757704),t*.5,.96,.06);n.rotation.z=t*-.38,i.add(n);for(let s=0;s<3;s++){const r=Z(Pe(.55,.025,.025),Q(2830136),t*.82,.22+s*.09,.62);r.rotation.z=t*(.18-s*.18),i.add(r)}}return i},sprout:()=>{const i=new ut;i.add(Z(pe(.05,.06,.5,8),Q(4170573),0,1.18,0));for(const t of[-1,1]){const e=Z(we(.2,10,8),Q(6082378),t*.24,1.45,0);e.scale.set(1.6,.35,.8),e.rotation.z=t*.4,i.add(e)}return i},gradcap:()=>{const i=new ut;i.add(Z(pe(.68,.7,.32,18),Q(2303535),0,.84,0));const t=Z(Pe(1.6,.08,1.6),Q(2830136),0,1.04,0);t.rotation.y=Math.PI/4,i.add(t),i.add(Z(we(.08,8,6),Q(16763210),0,1.1,0));const e=Z(pe(.025,.025,.55,6),Q(16763210),.78,.82,.3);return i.add(e),i.add(Z(we(.07,8,6),Q(16763210),.78,.55,.3)),i},propeller:()=>{const i=new ut,t=Z(gi(.95,16),Q(16736122),0,.3,0);t.scale.set(1,.6,1),i.add(t);for(let e=0;e<4;e++){const n=Z(Pe(.06,.02,.9),Q(5163519),0,.86,0);n.rotation.y=e/4*Math.PI,n.position.y=.84,i.add(n)}i.add(Z(pe(.04,.04,.3,6),Q(4015958),0,.98,0));for(let e=0;e<2;e++){const n=Z(Pe(1.1,.04,.2),Q(e?16766822:8316671),0,1.14,0);n.rotation.y=e*Math.PI/2+.4,i.add(n)}return i},beret:()=>{const i=new ut,t=Z(we(.85,16,10),Q(14039610),.12,.88,-.05);return t.scale.set(1.05,.28,1.05),t.rotation.z=-.2,i.add(t),i.add(Z(pe(.03,.03,.16,6),Q(9315096),.2,1.1,-.05)),i},nerd:()=>{const i=new ut,t=Q(2830136);for(const e of[-1,1]){i.add(Z(kn(.24,.045,18),t,e*.37,.6,.79));const n=Z(pe(.22,.22,.02,16),Q(14283519,{transparent:!0,opacity:.35}),e*.37,.6,.79);n.rotation.x=Math.PI/2,i.add(n);const s=Z(Pe(.04,.04,.6),t,e*.62,.62,.5);i.add(s)}return i.add(Z(Pe(.22,.04,.04),t,0,.64,.84)),i},mohawk:()=>{const i=new ut;for(let t=0;t<6;t++){const e=t/5,n=.55-e*1.15,s=Math.sqrt(Math.max(0,1-n*n))*.98,r=.55+Math.sin(e*Math.PI)*.25,a=Z(Qe(.16,r,8),Q(t%2?16727450:16743093),0,s+r*.42,n);a.rotation.x=-n*.9,i.add(a)}return i},flame:()=>{const i=new ut,t=[16756736,16742943,16769126];for(let e=0;e<7;e++){const n=e/7*Math.PI*2,s=Z(Qe(.22,.8,8),Q(t[e%3],{emissive:6956544}),Math.cos(n)*.42,1.12,Math.sin(n)*.42-.05);s.rotation.z=-Math.cos(n)*.45,s.rotation.x=Math.sin(n)*.45,i.add(s)}return i.add(Z(Qe(.3,1.1,8),Q(16769126,{emissive:6965760}),0,1.4,-.05)),i},unicorn:()=>{const i=new ut,t=Z(Qe(.16,.95,12),Q(16766822,{shiny:!0}),0,1.28,.36);return t.rotation.x=.38,i.add(t),[16743093,11561471,8316671,13171554].forEach((n,s)=>{const r=.05-s*.32,a=Math.sqrt(Math.max(0,1-r*r)),o=Z(we(.26,10,8),Q(n),0,a+.06,r);o.scale.set(.8,1,1.2),i.add(o)}),i},tiara:()=>{const i=new ut;i.add(Z(pe(.66,.66,.1,22),Q(15265526,{shiny:!0}),0,.78,0));for(const t of[-.32,0,.32]){const e=t===0?.42:.28,n=Z(Qe(.09,e,6),Q(15265526,{shiny:!0}),t,.83+e/2,.58-Math.abs(t)*.25);i.add(n)}return i.add(Z(we(.1,10,8),Q(16736192,{emissive:5902400}),0,.95,.66)),i},snowman:()=>{const i=new ut,t=Z(Qe(.1,.5,10),Q(16747050),0,.4,1.12);return t.rotation.x=Math.PI/2,i.add(t),i.add(Z(pe(.5,.42,.6,16),Q(8226708),0,1.15,-.05)),i.add(Z(pe(.58,.58,.06,16),Q(6121074),0,.86,-.05)),i},knight:()=>{const i=new ut,t=Z(gi(1.05,18),Q(12174546,{shiny:!0}),0,-.02,0);t.scale.set(1,.95,1),i.add(t),i.add(Z(Pe(1,.12,.2),Q(1711396),0,.58,.86)),i.add(Z(Pe(.1,.5,.2),Q(1711396),0,.42,.92));const e=Z(we(.25,10,8),Q(14826299),0,1.22,-.12);return e.scale.set(.8,1.8,2.2),i.add(e),i},cosmic:()=>{const i=new ut,t=Z(Li("oct0.34",()=>new si(.34,0)),Q(16773792,{emissive:9075232}),0,1.35,0);t.scale.set(1,1.2,.35),i.add(t);const e=Z(kn(1.28,.035,40),Q(8316671,{emissive:1928588}),0,.45,0);e.rotation.x=Math.PI/2-.35,i.add(e);for(let n=0;n<5;n++){const s=n*1.3;i.add(Z(we(.05,6,4),Q(16777215,{emissive:8947848}),Math.cos(s)*.6,.75+n%2*.15,Math.sin(s)*.6))}return i},cap:()=>{const i=new ut,t=Z(gi(.92),Q(3108816),0,.24,0);t.scale.set(1,.62,1),i.add(t);const e=Z(pe(.72,.72,.07,18),Q(2381215),0,.28,.62);return e.scale.set(1,1,.7),i.add(e),i.add(Z(we(.11),Q(1723020),0,.82,0)),i},cowboy:()=>{const i=new ut,t=Z(pe(1.28,1.28,.1,22),Q(9067051),0,.5,.05);return t.scale.set(1,1,.86),i.add(t),i.add(Z(pe(.62,.72,.62,18),Q(10250035),0,.8,.02)),i.add(Z(pe(.74,.74,.12,18),Q(6044186),0,.58,.02)),i},wizard:()=>{const i=new ut;i.add(Z(pe(1.15,1.15,.09,20),Q(2834334),0,.5,0));const t=Z(Qe(.82,2,18),Q(3361183),0,1.45,-.05);t.rotation.x=-.13,i.add(t);for(let e=0;e<5;e++){const n=Z(we(.1,8,6),Q(16767293,{emissive:5915648}),Math.sin(e*2.3)*.42,.85+e*.28,Math.cos(e*2.3)*.42*(1-e*.13));n.scale.setScalar(1-e*.1),i.add(n)}return i},party:()=>{const i=new ut,t=Z(Qe(.62,1.35,16),Q(16736122),0,1.15,0);t.rotation.z=.16,i.add(t),i.add(Z(we(.16,10,8),Q(4972752),.11,1.86,0));for(let e=0;e<3;e++){const n=Z(kn(.4-e*.11,.045,14),Q(5163519),0,.72+e*.34,0);n.rotation.x=Math.PI/2,n.position.x=.04+e*.06,i.add(n)}return i},crown:()=>{const i=new ut,t=Z(pe(.78,.78,.24,20),Q(16763196,{shiny:!0}),0,.68,0);i.add(t);for(let e=0;e<6;e++){const n=e/6*Math.PI*2,s=Z(Qe(.15,.42,8),Q(16767293,{shiny:!0}),Math.cos(n)*.72,.98,Math.sin(n)*.72);i.add(s),i.add(Z(we(.08,8,6),Q(15089711),Math.cos(n)*.72,1.22,Math.sin(n)*.72))}return i},football:()=>{const i=new ut,t=Z(gi(1.04),Q(14236475),0,-.05,0);t.scale.set(1,.95,1),i.add(t);const e=Z(Pe(.16,.06,2.05),Q(16777215),0,.98,0);i.add(e);for(let s=0;s<3;s++){const r=Z(pe(.045,.045,1,8),Q(15921906),0,.05-s*.22,.92+s*.04);r.rotation.z=Math.PI/2,i.add(r)}const n=Z(kn(.5,.05,12),Q(15921906),0,-.1,.72);return n.rotation.x=1.2,i.add(n),i},santa:()=>{const i=new ut,t=Z(kn(.82,.19,18),Q(16777215),0,.52,0);t.rotation.x=Math.PI/2,i.add(t);const e=Z(Qe(.76,1.5,16),Q(14826299),.28,1.16,-.1);return e.rotation.z=-.42,i.add(e),i.add(Z(we(.22,10,8),Q(16777215),.86,1.62,-.2)),i},chef:()=>{const i=new ut;i.add(Z(pe(.66,.7,.42,18),Q(16053492),0,.68,0));const t=Z(we(.78,14,10),Q(16777215),0,1.16,0);return t.scale.set(1.05,.72,1.05),i.add(t),i.add(Z(we(.42,10,8),Q(16777215),-.5,1.08,.12)),i.add(Z(we(.42,10,8),Q(16777215),.5,1.08,-.12)),i},pirate:()=>{const i=new ut,t=Z(gi(.98,16),Q(12597547),0,.1,0);t.scale.set(1,.6,1),i.add(t),i.add(Z(Pe(.28,.2,.2),Q(10890527),-.82,.42,-.3));const e=Z(Pe(.36,.3,.06),Q(1710618),-.33,.6,.78);i.add(e);const n=Z(Pe(1.9,.09,.06),Q(1710618),0,.72,.66);return n.rotation.z=.18,i.add(n),i},halo:()=>{const i=new ut,t=Z(kn(.55,.09,20),Q(16773792,{emissive:7824128}),0,1.42,0);return t.rotation.x=Math.PI/2,i.add(t),i},devil:()=>{const i=new ut;for(const t of[-1,1]){const e=Z(Qe(.17,.55,10),Q(14039610),t*.46,1.02,-.08);e.rotation.z=t*-.32,i.add(e)}return i},headphones:()=>{const i=new ut,t=Z(kn(.95,.09,20),Q(2830136),0,.12,0);t.rotation.y=Math.PI/2,i.add(t);for(const e of[-1,1]){const n=Z(pe(.3,.3,.22,14),Q(3949136),e*.98,.1,0);n.rotation.z=Math.PI/2,i.add(n),i.add(Z(we(.13,8,6),Q(5163519,{emissive:670293}),e*1.13,.1,0))}return i},tophat:()=>{const i=new ut;return i.add(Z(pe(1.12,1.12,.1,22),Q(2369070),0,.5,0)),i.add(Z(pe(.68,.68,1.05,20),Q(2895672),0,1.05,0)),i.add(Z(pe(.7,.7,.16,20),Q(12597547),0,.66,0)),i},viking:()=>{const i=new ut,t=Z(gi(1,16),Q(10134706),0,0,0);t.scale.set(1,.78,1),i.add(t),i.add(Z(Pe(.14,.5,1.9),Q(8226708),0,.62,0));for(const e of[-1,1]){const n=Z(Qe(.22,.85,10),Q(15261640),e*.92,.62,0);n.rotation.z=e*-1,i.add(n)}return i},astro:()=>{const i=new ut,t=Z(we(1.16,20,14),Q(12577279,{transparent:!0,opacity:.34}),0,-.05,0);i.add(t);const e=Z(kn(1,.11,20),Q(14542318),0,-.3,0);return e.rotation.x=Math.PI/2,i.add(e),i},alien:()=>{const i=new ut;for(const t of[-1,1]){const e=Z(pe(.05,.05,.6,8),Q(4960331),t*.34,.98,-.05);e.rotation.z=t*-.25,i.add(e),i.add(Z(we(.15,10,8),Q(11992922,{emissive:3824144}),t*.48,1.28,-.05))}return i},robot:()=>{const i=new ut;i.add(Z(pe(.05,.05,.7,8),Q(9147811),0,1.05,0)),i.add(Z(we(.16,10,8),Q(16732754,{emissive:6689812}),0,1.42,0));const t=Z(Pe(1.5,.22,.1),Q(9147811),0,.68,.62);i.add(t);for(const e of[-1,1])i.add(Z(pe(.13,.13,.14,10),Q(7174023),e*.92,.28,.42));return i},miner:()=>{const i=new ut,t=Z(gi(.98,16),Q(15250207),0,.08,0);t.scale.set(1,.72,1),i.add(t);const e=Z(pe(.78,.78,.08,18),Q(13736465),0,.16,.5);e.scale.set(1,1,.55),i.add(e),i.add(Z(pe(.2,.2,.18,12),Q(15921906),0,.62,.72));const n=Z(pe(.19,.19,.06,12),Q(16774848,{emissive:10062394}),0,.62,.83);return n.rotation.x=Math.PI/2,i.add(n),i},ninja:()=>{const i=new ut,t=Z(pe(1.02,1.02,.3,20),Q(2304051),0,.42,0);i.add(t);const e=Z(Pe(.24,.5,.24),Q(2304051),-.9,.42,-.5);e.rotation.y=.6,i.add(e);const n=Z(Pe(.16,.9,.1),Q(2896192),-1.15,.1,-.75);return n.rotation.z=.5,i.add(n),i},shades:()=>{const i=new ut;i.add(Z(Pe(1.5,.36,.1),Q(1316380),0,.62,.78));for(let t=0;t<4;t++)i.add(Z(Pe(1.5,.05,.03),Q(14966623),0,.52+t*.09,.85));return i},thug:()=>{const i=new ut,t=Z(Pe(1.62,.34,.12),Q(1053206),0,.6,.76);i.add(t);for(let e=0;e<3;e++)i.add(Z(Pe(.5,.09,.04),Q(2764602),-.5+e*.5,.72,.83));return i},mustache:()=>{const i=new ut;for(const t of[-1,1]){const e=Z(we(.26,10,8),Q(4861984),t*.24,.2,.85);e.scale.set(1.5,.55,.4),e.rotation.z=t*.3,i.add(e)}return i},monocle:()=>{const i=new ut,t=Z(kn(.26,.05,16),Q(16767293,{shiny:!0}),.32,.6,.8);i.add(t);const e=Z(pe(.25,.25,.03,16),Q(14283519,{transparent:!0,opacity:.5}),.32,.6,.8);e.rotation.x=Math.PI/2,i.add(e);const n=Z(Pe(.03,.5,.03),Q(16767293,{shiny:!0}),.5,.3,.78);return n.rotation.z=.4,i.add(n),i}};function _i(...i){return()=>{const t=new ut;return i.forEach(e=>{const n=Qt[e]&&Qt[e]();n&&t.add(n)}),t}}const ms=[{id:"classic",price:0,color:4176127,acc:Qt.none,name:{ru:"Классик",en:"Classic",tr:"Klasik"}},{id:"party",price:40,color:12938495,acc:_i("party","shades"),name:{ru:"Вечеринка",en:"Party",tr:"Parti"}},{id:"cool",price:55,color:3133877,acc:_i("cap","shades"),name:{ru:"Крутой",en:"Cool",tr:"Havalı"}},{id:"engineer",price:75,color:16748346,acc:_i("miner","mustache"),name:{ru:"Инженер",en:"Engineer",tr:"Mühendis"}},{id:"thug",price:95,color:7306751,acc:Qt.thug,name:{ru:"Жизнь головореза",en:"Thug Life",tr:"Kabadayı"}},{id:"football",price:120,color:15921906,acc:Qt.football,name:{ru:"Футбол",en:"Football",tr:"Futbol"}},{id:"cowboy",price:150,color:14259034,acc:_i("cowboy","mustache"),name:{ru:"Ковбой",en:"Cowboy",tr:"Kovboy"}},{id:"ninja",price:185,color:15686460,acc:Qt.ninja,name:{ru:"Ниндзя",en:"Ninja",tr:"Ninja"}},{id:"wizard",price:225,color:10147583,acc:Qt.wizard,name:{ru:"Волшебник",en:"Wizard",tr:"Büyücü"}},{id:"pirate",price:270,color:16740193,acc:Qt.pirate,name:{ru:"Пират",en:"Pirate",tr:"Korsan"}},{id:"chef",price:315,color:14864639,acc:Qt.chef,name:{ru:"Повар",en:"Chef",tr:"Şef"}},{id:"dj",price:360,color:8118527,acc:Qt.headphones,name:{ru:"Диджей",en:"DJ",tr:"DJ"}},{id:"santa",price:420,color:6279802,acc:Qt.santa,name:{ru:"Дед Мороз",en:"Santa",tr:"Noel Baba"}},{id:"angel",price:480,color:16774872,acc:Qt.halo,name:{ru:"Ангел",en:"Angel",tr:"Melek"}},{id:"devil",price:540,color:16734794,acc:Qt.devil,name:{ru:"Дьявол",en:"Devil",tr:"Şeytan"}},{id:"gentleman",price:620,color:16181185,acc:_i("tophat","monocle"),name:{ru:"Джентльмен",en:"Gentleman",tr:"Centilmen"}},{id:"viking",price:700,color:6266838,acc:_i("viking","mustache"),name:{ru:"Викинг",en:"Viking",tr:"Viking"}},{id:"king",price:820,color:8673279,acc:Qt.crown,name:{ru:"Король",en:"King",tr:"Kral"}},{id:"alien",price:940,color:9234522,acc:Qt.alien,name:{ru:"Пришелец",en:"Alien",tr:"Uzaylı"}},{id:"robot",price:1080,color:12174546,acc:Qt.robot,shiny:!0,name:{ru:"Робот",en:"Robot",tr:"Robot"}},{id:"astro",price:1250,color:15791352,acc:Qt.astro,name:{ru:"Космонавт",en:"Astronaut",tr:"Astronot"}},{id:"neon",price:1500,color:3536328,acc:Qt.none,emissive:875080,name:{ru:"Неон",en:"Neon",tr:"Neon"}},{id:"gold",price:1900,color:15312933,acc:Qt.crown,shiny:!0,name:{ru:"Золотой",en:"Golden",tr:"Altın"}},{id:"diamond",price:2500,color:10416383,acc:_i("crown","astro"),shiny:!0,name:{ru:"Алмазный",en:"Diamond",tr:"Elmas"}},{id:"bunny",ads:2,color:16184063,acc:Qt.bunny,name:{ru:"Кролик",en:"Bunny",tr:"Tavşan"}},{id:"kitty",ads:2,color:16751165,acc:Qt.cat,name:{ru:"Котик",en:"Kitty",tr:"Kedicik"}},{id:"sprout",ads:2,color:14262374,acc:Qt.sprout,name:{ru:"Росток",en:"Sprout",tr:"Filiz"}},{id:"grad",ads:2,color:5930495,acc:Qt.gradcap,name:{ru:"Выпускник",en:"Graduate",tr:"Mezun"}},{id:"propeller",ads:2,color:4184496,acc:Qt.propeller,name:{ru:"Пропеллер",en:"Propeller",tr:"Pervane"}},{id:"artist",ads:2,color:16770764,acc:Qt.beret,name:{ru:"Художник",en:"Artist",tr:"Ressam"}},{id:"nerd",ads:3,color:16754856,acc:Qt.nerd,name:{ru:"Умник",en:"Brainy",tr:"Bilgiç"}},{id:"punk",ads:3,color:10185727,acc:Qt.mohawk,name:{ru:"Панк",en:"Punk",tr:"Punk"}},{id:"blaze",ads:3,color:16734762,acc:Qt.flame,emissive:3803648,name:{ru:"Огонёк",en:"Blaze",tr:"Alev"}},{id:"unicorn",ads:3,color:16639999,acc:Qt.unicorn,name:{ru:"Единорог",en:"Unicorn",tr:"Tek boynuz"}},{id:"princess",ads:3,color:14133503,acc:Qt.tiara,name:{ru:"Принцесса",en:"Princess",tr:"Prenses"}},{id:"snowman",ads:4,color:16054527,acc:Qt.snowman,name:{ru:"Снеговик",en:"Snowman",tr:"Kardan adam"}},{id:"knight",ads:4,color:12174546,acc:Qt.knight,shiny:!0,name:{ru:"Рыцарь",en:"Knight",tr:"Şövalye"}},{id:"cosmic",ads:5,color:3813263,acc:Qt.cosmic,emissive:1709136,name:{ru:"Космос",en:"Cosmic",tr:"Kozmik"}},{id:"disco",ads:5,color:14212840,acc:Qt.shades,shiny:!0,flat:!0,name:{ru:"Диско",en:"Disco",tr:"Disko"}}],wg=new Map(ms.map(i=>[i.id,i]));function Ci(i){return wg.get(i)||ms[0]}function bg(i,t){return i.name&&(i.name[t]||i.name.ru)||i.id}function Rl(i){const t={shiny:!!i.shiny,flat:!!i.flat},e=Q(i.color,t);if(i.emissive){const n=e.clone();return n.emissive=new yt(i.emissive),n}return e}let vr=null;function Dh(){if(vr)return vr;const i=new ce(1,26,14,0,Math.PI*2,0,Math.PI/2),t=new ce(1,26,14,0,Math.PI*2,Math.PI/2,Math.PI/2),e=new ps(1,26);e.rotateX(Math.PI/2);const n=new ps(1,26);n.rotateX(-Math.PI/2);const s=new ce(.15,12,10),r=new ce(.62,16,12),a=new ce(1.22,20,14),o=[];for(let m=0;m<5;m++){const p=(m-2)*.3,M=new be(.1,.22,6);M.rotateX(Math.PI),M.translate(Math.sin(p)*.86,-.1,Math.cos(p)*.86),o.push(M)}const c=An(o);o.forEach(m=>m.dispose());const l=new Ee({color:9315096,side:Ve}),h=new Ee({color:14698798}),d=new Ee({color:1316895}),u=new Ee({color:16777215}),f=new fn({map:fg(),transparent:!0,depthWrite:!1,opacity:.75}),g=new Ee({color:7000319,transparent:!0,opacity:.33,depthWrite:!1,emissive:1727104,side:Ve}),_=new Vn(2.6,2.6);return _.rotateX(-Math.PI/2),vr={upperGeo:i,lowerGeo:t,roofGeo:e,floorGeo:n,eyeGeo:s,tongueGeo:r,shieldGeo:a,shadowGeo:_,teethGeo:c,mouthMat:l,tongueMat:h,eyeMat:d,teethMat:u,shadowMat:f,shieldMat:g},vr}class Uh{constructor(t,e=!0){const n=Dh();this.detailed=e,this.skin=t||Ci("classic"),this.root=new ut,this.shadow=new K(n.shadowGeo,n.shadowMat),this.shadow.position.y=.06,this.shadow.renderOrder=1,this.root.add(this.shadow),this.pivot=new ut,this.root.add(this.pivot),this.body=new ut,this.pivot.add(this.body),this.upper=new ut,this.lower=new ut,this.body.add(this.upper,this.lower),this.bodyMat=Rl(this.skin),this.upperMesh=new K(n.upperGeo,this.bodyMat),this.lowerMesh=new K(n.lowerGeo,this.bodyMat),this.upperMesh.castShadow=this.lowerMesh.castShadow=!0,this.upper.add(this.upperMesh),this.lower.add(this.lowerMesh),this.roof=new K(n.roofGeo,n.mouthMat),this.floor=new K(n.floorGeo,n.mouthMat),this.upper.add(this.roof),this.lower.add(this.floor),e&&(this.tongue=new K(n.tongueGeo,n.tongueMat),this.tongue.scale.set(.95,.3,1),this.tongue.position.set(0,.04,.16),this.lower.add(this.tongue)),this.teeth=new K(n.teethGeo,n.teethMat),this.upper.add(this.teeth),this.eyes=[];for(const s of[-1,1]){const r=new K(n.eyeGeo,n.eyeMat),a=new U(s*.34,.55,.62).normalize().multiplyScalar(.96);r.position.copy(a),r.scale.set(.8,1.35,.8),this.upper.add(r),this.eyes.push(r)}this.accessory=null,this._applyAccessory(),this.shield=new K(n.shieldGeo,n.shieldMat),this.shield.visible=!1,this.body.add(this.shield),this.radius=1,this.chew=Math.random()*Math.PI*2,this.openAmount=.42}_applyAccessory(){if(this.accessory&&(this.upper.remove(this.accessory),this.accessory=null),this.skin.acc){const t=this.skin.acc();t&&(this.accessory=t,this.upper.add(t))}}setSkin(t){this.skin=t||Ci("classic"),this.bodyMat=Rl(this.skin),this.upperMesh.material=this.bodyMat,this.lowerMesh.material=this.bodyMat,this._applyAccessory()}setRadius(t){this.radius=t,this.body.position.y=t,this.body.scale.setScalar(t);const e=t*1.25;this.shadow.scale.set(e/1.3,1,e/1.3)}setPosition(t,e){this.root.position.set(t,0,e)}setYaw(t){this.pivot.rotation.y=t}setShield(t){this.shield.visible=t}update(t,e=0){this.chew+=t*(5.5+e*7);const n=(Math.sin(this.chew)+1)*.5;this.openAmount=.1+n*.55,this.upper.rotation.x=-this.openAmount,this.lower.rotation.x=this.openAmount*.45;const s=1+Math.sin(this.chew*.5)*.03*(.4+e);this.body.scale.set(this.radius/s,this.radius*s,this.radius/s),this.shield.visible&&(this.shield.rotation.y+=t*.8,this.shield.rotation.x+=t*.5)}dispose(){this.root.traverse(t=>{t.isMesh&&t.geometry&&t.geometry.dispose&&t.userData.own&&t.geometry.dispose()})}}function Eg(i,t=128){Dh();const e=Ag(t);if(!e)return"";const n=new bh;n.add(new Ch(16777215,5601177,2.1));const s=new Ph(16777215,1.5);s.position.set(2,4,3),n.add(s);const r=new Uh(i,!0);r.setRadius(1),r.shadow.visible=!1,r.upper.rotation.x=-.42,r.lower.rotation.x=.2,r.pivot.rotation.y=-.45,n.add(r.root);const a=new ln(34,1,.1,40);a.position.set(.4,1.85,5.4),a.lookAt(0,1.05,0),e.setSize(t,t,!1),e.render(n,a);const o=e.domElement.toDataURL("image/png");return n.clear(),o}let xi=null;function Ag(i){if(xi===null)try{xi=new wh({alpha:!0,antialias:!0,preserveDrawingBuffer:!0}),xi.setPixelRatio(1),xi.setClearColor(0,0),xi.setSize(i,i,!1)}catch{xi=!1}return xi||null}const Tg=["Максим","Соня","Артём","Полина","Данила","Мирон","Мурзик","Пельмень","Тортик","Ириска","Барсик","Кекс","Драник","Шустрый","Пончик","Ватрушка","Сырок","Бублик","ЯБольше","ОмНомНом","Обжора","Проглот","Голодный","Хомяк","Колобок","Пузырь","Шарик","Тефтеля","Котлета","Зефирка","ГрозаАрены","Царь","Батя","Легенда","Босс","Чемпион","Тихоня","Ворчун","Смельчак","Хитрюга","Задира","Ловкач","Метеор","Вихрь","Комета","Молния","Ураган","Гроза","Пират","Ниндзя","Ковбой","Викинг","Рыцарь","Самурай","Сгущёнка","Плюшка","Оладушек","Вареник","Печенька","Карамелька","Топотун","Прыгун","Круть","Лютый","Дерзкий","Стремительный","Соник","Тайфун","Циклон","Астероид","Квазар","Пульсар"],Cl=["","","","","_РФ","007","XX","2000","99","Про"];let ka=[];function Rg(){ka.length||(ka=Tg.slice().sort(()=>Math.random()-.5));const i=ka.pop(),t=Cl[Math.random()*Cl.length|0];return(i+t).slice(0,14)}function Pl(i="ru"){const t=i==="ru"?["Шарик","Едок","Мега","Супер","Босс","Ниндзя","Турбо","Гигант"]:["Ball","Eater","Mega","Super","Boss","Ninja","Turbo","Giant"];return t[Math.random()*t.length|0]+(100+(Math.random()*900|0))}function Ll(i){return 1.25*(1+Math.pow(Math.max(0,i),.34)/12)}function Cg(i){return 31/(1+i*.058)}function Pg(i){return i+120}const Br=1.18,Lg=2.2;let Ig=0;class Nh{constructor(t,e={}){this.id=++Ig,this.scene=t,this.isPlayer=!!e.isPlayer,this.name=e.name||"Player",this.score=e.score||0,this.alive=!0,this.x=e.x||0,this.z=e.z||0,this.vx=0,this.vz=0,this.yaw=ye(0,ot),this.speedMul=1,this.shieldTime=0,this.deathAnim=0,this.skin=e.skin||Ci("classic"),this.character=new Uh(this.skin,!0),this.character.setPosition(this.x,this.z),t.add(this.character.root),this.tag=new _g,this.character.root.add(this.tag.sprite),this.ai={target:null,mode:"roam",wx:ye(-Te,Te),wz:ye(-Te,Te),think:ye(0,.6),aggression:ye(.5,1),growth:e.growth||0},this._obsBuf=[],this.ateObstacles=[],this.radius=Ll(this.score),this.character.setRadius(this.radius),this._syncTag(!0)}resolveObstacles(t){if(this.ateObstacles.length=0,!t||!t.queryObstacles)return;const e=t.queryObstacles(this.x,this.z,this.radius+4,this._obsBuf);if(e.length)for(let n=0;n<3;n++){let s=!1;for(let r=0;r<e.length;r++){const a=e[r];if(this.radius>a.r*Lg){const g=this.x-a.x,_=this.z-a.z;g*g+_*_<(this.radius+a.r*.5)*(this.radius+a.r*.5)&&t.eatObstacle(a)&&this.ateObstacles.push(a);continue}let o=this.x-a.x,c=this.z-a.z,l=Math.hypot(o,c);const h=this.radius+a.r;if(l>=h)continue;l<1e-4&&(o=1,c=0,l=1);const d=o/l,u=c/l;this.x=a.x+d*h,this.z=a.z+u*h,s=!0;const f=this.vx*d+this.vz*u;f<0&&(this.vx-=f*d,this.vz-=f*u)}if(!s)break}}setSkin(t){this.skin=t,this.character.setSkin(t)}get power(){return Pg(this.score)}addScore(t){this.score=Math.max(0,this.score+t)}_syncTag(t=!1){const e=Math.max(5.5,this.radius*2.1);this.tag.setScale(e),this.tag.sprite.position.set(0,this.radius*2+1.4,0),this.tag.set(this.name,$e(this.score),this.isPlayer?"#8CFF6A":"#ffffff"),t&&(this.tag.texture.needsUpdate=!0)}move(t,e,n,s){const r=Math.hypot(e,n);let a=Cg(this.radius)*this.speedMul;s&&s.isWater(this.x,this.z)&&(a*=.72);let o=0,c=0;if(r>.001){const u=Math.min(1,r);o=e/r*a*u,c=n/r*a*u}const l=Fo(t,7);this.vx+=(o-this.vx)*l,this.vz+=(c-this.vz)*l,this.x+=this.vx*t,this.z+=this.vz*t;const h=Te-this.radius;this.x=ze(this.x,-h,h),this.z=ze(this.z,-h,h),this.resolveObstacles(s),this.x=ze(this.x,-h,h),this.z=ze(this.z,-h,h);const d=Math.hypot(this.vx,this.vz);if(d>.4){let f=Math.atan2(this.vx,this.vz)-this.yaw;for(;f>Math.PI;)f-=ot;for(;f<-Math.PI;)f+=ot;this.yaw+=f*Fo(t,9)}return d/Math.max(1,a)}syncVisual(t,e){this.radius=Ll(this.score),this.character.setPosition(this.x,this.z),this.character.setYaw(this.yaw),this.character.setRadius(this.radius),this.character.setShield(this.shieldTime>0),this.character.update(t,e),this._syncTag()}think(t,e,n,s=null){const r=this.ai;if(r.think-=t,r.think<=0){r.think=ye(.25,.6),r.mode="roam",r.target=null;const h=this.power;let d=null,u=1/0,f=null,g=1/0;for(const m of e){if(m===this||!m.alive)continue;const p=Math.hypot(m.x-this.x,m.z-this.z),M=90+this.radius*8;p>M||(m.power>h*Br?p<u&&(u=p,d=m):h>m.power*Br&&m.shieldTime<=0&&p<g&&(g=p,f=m))}const _=26+this.radius*4.5;if(d&&u<_+d.radius*2.2)r.mode="flee",r.target=d;else if(f&&g<70+this.radius*5&&Math.random()<r.aggression)r.mode="hunt",r.target=f;else{const m=Math.hypot(r.wx-this.x,r.wz-this.z),p=s&&Math.hypot(r.wx-s.nx,r.wz-s.nz)>s.nr*.8;if(m<22||p)if(s){const M=ye(0,ot),x=Math.sqrt(Math.random())*s.nr*.75;r.wx=ze(s.nx+Math.cos(M)*x,-Te+10,Te-10),r.wz=ze(s.nz+Math.sin(M)*x,-Te+10,Te-10)}else{const M=ye(0,ot),x=ye(40,170);r.wx=ze(this.x+Math.cos(M)*x,-Te+10,Te-10),r.wz=ze(this.z+Math.sin(M)*x,-Te+10,Te-10)}}}let a=0,o=0;r.mode==="flee"&&r.target&&r.target.alive?(a=this.x-r.target.x,o=this.z-r.target.z):r.mode==="hunt"&&r.target&&r.target.alive?(a=r.target.x-this.x,o=r.target.z-this.z):(a=r.wx-this.x,o=r.wz-this.z);const c=Te-30;if(Math.abs(this.x)>c&&(a-=Math.sign(this.x)*40),Math.abs(this.z)>c&&(o-=Math.sign(this.z)*40),s){const h=s.x-this.x,d=s.z-this.z,u=Math.hypot(h,d),f=Math.max(8,this.radius*1.5);if(u>.001&&u>s.r-f){const g=Math.hypot(a,o)||1,_=u>s.r?4:1.3;a=a/g+h/u*_,o=o/g+d/u*_}}const l=Math.hypot(a,o)||1;return{x:a/l,z:o/l}}dispose(){this.scene.remove(this.character.root),this.character.root.remove(this.tag.sprite),this.tag.dispose()}}const ko=[{w:.5,min:0,max:900,growth:.03},{w:.25,min:1800,max:26e3,growth:.02},{w:.15,min:45e3,max:32e4,growth:.01},{w:.1,min:5e5,max:42e5,growth:.004}];function Dg(){const i=Math.random();let t=0;for(const e of ko)if(t+=e.w,i<=t)return e;return ko[0]}function Ug(i,{forceSmall:t=!1,awayFrom:e=null,growth:n=null}={}){const s=t?ko[0]:Dg(),r=Math.floor(ye(s.min,s.max));let a,o,c=0;do a=ye(-Te+20,Te-20),o=ye(-Te+20,Te-20),c++;while(e&&c<12&&Math.hypot(a-e.x,o-e.z)<120);return new Nh(i,{name:Rg(),score:r,x:a,z:o,skin:ms[Math.random()*ms.length|0],growth:n!=null?n:s.growth})}const zo={classic:{id:"classic",bots:{low:18,medium:26,high:34},smallBots:!1,botGrowth:null,respawnBots:!0,ring:!1,timeLimit:0,playerRespawn:!1,food:{goldChance:0,respawnMul:1}},ring:{id:"ring",bots:{low:15,medium:19,high:23},smallBots:!0,botGrowth:.009,respawnBots:!1,ring:!0,timeLimit:0,playerRespawn:!1,food:{goldChance:0,respawnMul:1}},blitz:{id:"blitz",bots:{low:16,medium:22,high:28},smallBots:!0,botGrowth:.012,respawnBots:!0,ring:!1,timeLimit:180,playerRespawn:!0,food:{goldChance:.045,respawnMul:.45}}},Ng=["classic","ring","blitz"];function Gr(i){return zo[i]||zo.classic}function Fg(i,t){const e=i==="ring"?[80,50,35,20,20]:[60,40,25,15,15];return t>=1&&t<=e.length?e[t-1]:i==="ring"?8:6}const zn=[{wait:20,shrink:18,r:250,dps:.04},{wait:18,shrink:18,r:170,dps:.06},{wait:16,shrink:16,r:105,dps:.09},{wait:14,shrink:14,r:60,dps:.13},{wait:12,shrink:14,r:28,dps:.2},{wait:10,shrink:16,r:0,dps:.3}],ts=430,Og=25,kg=70;function zg(){const i=document.createElement("canvas");i.width=64,i.height=256;const t=i.getContext("2d"),e=t.createLinearGradient(0,256,0,0);e.addColorStop(0,"rgba(255,90,170,0.95)"),e.addColorStop(.35,"rgba(190,80,255,0.55)"),e.addColorStop(1,"rgba(150,80,255,0)"),t.fillStyle=e,t.fillRect(0,0,64,256),t.globalCompositeOperation="destination-out",t.strokeStyle="rgba(0,0,0,0.35)",t.lineWidth=10;for(let s=-4;s<8;s++)t.beginPath(),t.moveTo(s*24,256),t.lineTo(s*24+64,0),t.stroke();const n=new oi(i);return n.colorSpace=De,n.wrapS=hs,n.repeat.set(28,1),n}class Bg{constructor(t){this.active=!1,this.finished=!1,this.phase=0,this.state="wait",this.timer=0,this.cur={x:0,z:0,r:ts},this.from={x:0,z:0,r:ts},this.next={x:0,z:0,r:ts},this.dps=zn[0].dps,this.zone={x:0,z:0,r:ts,nx:0,nz:0,nr:ts};const e=new Lt(1,1,1,96,1,!0);e.translate(0,.5,0),this.wall=new K(e,new fn({map:zg(),transparent:!0,side:Ve,depthWrite:!1})),this.wall.renderOrder=4,this.wall.frustumCulled=!1;const n=new Ei(.985,1,128);n.rotateX(-Math.PI/2),this.marker=new K(n,new fn({color:16777215,transparent:!0,opacity:.8,depthWrite:!1})),this.marker.position.y=.35,this.marker.frustumCulled=!1,t.add(this.wall,this.marker),this._show(!1)}_show(t){this.wall.visible=t,this.marker.visible=t}start(){this.active=!0,this.finished=!1,this.phase=0,this.state="wait",this.timer=zn[0].wait,this.cur={x:0,z:0,r:ts},this.dps=zn[0].dps,this._pickNext(),this._show(!0),this._sync()}stop(){this.active=!1,this._show(!1)}_pickNext(){const t=zn[this.phase],e=Math.max(0,this.cur.r-t.r),n=this.phase===0?Math.min(40,e):e*.55,s=Math.random()*ot,r=Math.sqrt(Math.random())*n;let a=this.cur.x+Math.cos(s)*r,o=this.cur.z+Math.sin(s)*r;const c=Math.max(0,250-t.r);a=Math.max(-c,Math.min(c,a)),o=Math.max(-c,Math.min(c,o)),this.next={x:a,z:o,r:t.r}}update(t){if(this.active){if(this.state==="wait")this.timer-=t,this.timer<=0&&(this.state="shrink",this.timer=zn[this.phase].shrink,this.from={...this.cur},this.dps=zn[this.phase].dps);else if(this.state==="shrink"){this.timer-=t;const e=zn[this.phase].shrink,n=Math.min(1,Math.max(0,1-this.timer/e));this.cur.x=this.from.x+(this.next.x-this.from.x)*n,this.cur.z=this.from.z+(this.next.z-this.from.z)*n,this.cur.r=this.from.r+(this.next.r-this.from.r)*n,this.timer<=0&&(this.cur={...this.next},this.phase++,this.phase<zn.length?(this.state="wait",this.timer=zn[this.phase].wait,this._pickNext()):(this.state="final",this.timer=Og))}else this.state==="final"&&(this.timer-=t,this.timer<=0&&(this.finished=!0));this._sync(),this.wall.material.map&&(this.wall.material.map.offset.x-=t*.04)}}_sync(){const t=Math.max(.01,this.cur.r);this.wall.position.set(this.cur.x,-1,this.cur.z),this.wall.scale.set(t,kg,t),this.wall.visible=this.active&&this.cur.r>.5;const e=this.active&&this.state==="wait"&&this.next.r>.5;this.marker.visible=e,e&&(this.marker.position.x=this.next.x,this.marker.position.z=this.next.z,this.marker.scale.setScalar(this.next.r));const n=this.zone;n.x=this.cur.x,n.z=this.cur.z,n.r=this.cur.r,n.nx=this.next.x,n.nz=this.next.z,n.nr=this.next.r}contains(t,e){return Math.hypot(t-this.cur.x,e-this.cur.z)<=this.cur.r}get info(){return{state:this.state,time:Math.max(0,this.timer),phase:this.phase}}}const Fs=10,Gg=[0,150,400,800,1400,2200,3300,4800,6800,9500,13e3],Bo=[{id:"speed",base:30,icon:"ico-up-speed"},{id:"start",base:40,icon:"ico-up-start"},{id:"bite",base:25,icon:"ico-eater"},{id:"growth",base:35,icon:"ico-up-growth"},{id:"coins",base:45,icon:"ico-coins-pile"},{id:"shield",base:20,icon:"ico-up-shield"}],Os=i=>"up_"+i;function Il(i,t){return Math.round(i.base*Math.pow(1.42,t)/5)*5}function Go(i={}){const t=e=>Math.max(0,Math.min(Fs,i[e]|0));return{speed:1+t("speed")*.03,startScore:Gg[t("start")],bite:1+t("bite")*.05,growth:1+t("growth")*.06,coins:1+t("coins")*.1,shield:4+t("shield")*.6}}const Mr=110,Dl=.75;function Hg(i){return i==="cube"?new Wt(1,1,1):i==="octa"?new si(1,0):i==="tetra"?new sc(1,0):new ce(1,8,6)}class Vg{constructor(t){this.scene=t,this.def=null,this.mesh=null,this.parts=[],this._acc=0,this._time=0,this._dummy=new jt,this._color=new yt}set(t){if(this.mesh&&(this.scene.remove(this.mesh),this.mesh.geometry.dispose(),this.mesh.material.dispose(),this.mesh=null),this.def=t&&t.id!=="none"?t:null,this.parts.length=0,!this.def)return;this.mesh=new $t(Hg(t.shape),new fn({color:16777215}),Mr),this.mesh.instanceMatrix.setUsage(zs),this.mesh.frustumCulled=!1;const e=new ie().makeScale(0,0,0);for(let n=0;n<Mr;n++)this.mesh.setMatrixAt(n,e),this.mesh.setColorAt(n,this._color.setHex(16777215)),this.parts.push({life:0,x:0,y:0,z:0,vx:0,vy:0,vz:0,s:1,rot:0});this.scene.add(this.mesh),this._next=0}_spawn(t){const e=this.parts[this._next],n=this._next;this._next=(this._next+1)%Mr;const s=t.radius,r=s*.85;e.x=t.x-Math.sin(t.yaw)*r+(Math.random()-.5)*s*.7,e.z=t.z-Math.cos(t.yaw)*r+(Math.random()-.5)*s*.7,e.y=s*(.35+Math.random()*.8),e.vx=(Math.random()-.5)*2,e.vz=(Math.random()-.5)*2,e.vy=this.def.rise*(.6+Math.random()*.8),e.s=s*this.def.size*(.7+Math.random()*.6),e.rot=Math.random()*ot,e.life=Dl,this.def.rainbow?this._color.setHSL((this._time*.6+Math.random()*.08)%1,.9,.6):this._color.setHex(this.def.colors[Math.random()*this.def.colors.length|0]),this.mesh.setColorAt(n,this._color),this.mesh.instanceColor.needsUpdate=!0}update(t,e){if(!this.mesh)return;if(this._time+=t,e&&e.alive&&Math.hypot(e.vx,e.vz)>3)for(this._acc+=t;this._acc>.03;)this._acc-=.03,this._spawn(e);else this._acc=0;const s=this._dummy;for(let r=0;r<Mr;r++){const a=this.parts[r];if(a.life<=0)continue;a.life-=t;const o=Math.max(0,a.life/Dl);a.x+=a.vx*t,a.y+=a.vy*t,a.z+=a.vz*t,a.rot+=t*3;const c=a.life>0?a.s*(this.def.grow?.6+(1-o)*.9:o):0;s.position.set(a.x,a.y,a.z),s.rotation.set(a.rot,a.rot*.7,0),s.scale.setScalar(c),s.updateMatrix(),this.mesh.setMatrixAt(r,s.matrix)}this.mesh.instanceMatrix.needsUpdate=!0}}const vn=(i,t=1,e={})=>new fn({color:i,transparent:t<1,opacity:t,depthWrite:t>=1,...e});class Wg{constructor(){this.group=new ut,this.kind=null,this.items=[],this.t=0}set(t){for(const s of this.items)this.group.remove(s.mesh),s.mesh.geometry&&s.mesh.geometry.dispose(),s.mesh.material&&s.mesh.material.dispose();if(this.items.length=0,this.kind=t&&t.id!=="none"?t.kind:null,!this.kind)return;const e=t.color,n=(s,r={})=>(this.group.add(s),this.items.push({mesh:s,...r}),s);switch(this.kind){case"ring":{const s=n(new K(new Ei(1.2,1.6,48).rotateX(-Math.PI/2),vn(e,.6)));s.position.y=.06;break}case"pulse":for(let s=0;s<3;s++){const r=n(new K(new Ei(.92,1,48).rotateX(-Math.PI/2),vn(e,.7)),{phase:s/3});r.position.y=.06}break;case"orbit":for(let s=0;s<3;s++)n(new K(new ce(.17,10,8),vn(e)),{phase:s/3*ot});break;case"rainbow":for(let s=0;s<6;s++){const r=new yt().setHSL(s/6,.9,.6);n(new K(new ce(.14,10,8),vn(r)),{phase:s/6*ot})}break;case"sparkle":for(let s=0;s<9;s++){const r=Math.random()*ot,a=.3+Math.random()*1.8;n(new K(new si(.13,0),vn(e)),{phase:Math.random()*ot,x:Math.cos(r)*1.5,y:a,z:Math.sin(r)*1.5})}break;case"halo":{const s=n(new K(new Ri(.62,.08,8,32).rotateX(Math.PI/2),vn(e)));s.position.y=2.55;const r=n(new K(new Ei(.5,.95,32).rotateX(-Math.PI/2),vn(e,.35,{side:Ve})));r.position.y=2.55;break}case"flames":for(let s=0;s<10;s++){const r=s/10*ot;n(new K(new be(.2,.9,6).translate(0,.45,0),vn(s%2?16765501:e)),{phase:Math.random()*ot}).position.set(Math.cos(r)*1.18,0,Math.sin(r)*1.18)}break;case"snow":for(let s=0;s<12;s++)n(new K(new Wt(.12,.12,.12),vn(e)),{phase:Math.random()*ot,h:Math.random()*2.4,r:1.3+Math.random()*.4});break;case"zap":for(let s=0;s<2;s++){const r=n(new K(new Ri(1.45,.04,6,48),vn(e)),{phase:s*1.3});r.position.y=1}break;case"vortex":for(let s=0;s<14;s++)n(new K(new ce(.1,8,6),vn(s%2?e:16743093)),{phase:s/14});break}}update(t,e){if(!this.kind||!e)return;this.t+=t;const n=this.t;this.group.scale.setScalar(e.radius);for(const s of this.items){const r=s.mesh;switch(this.kind){case"ring":r.material.opacity=.45+Math.sin(n*3)*.2,r.rotation.y=n;break;case"pulse":{const a=(n*.6+s.phase)%1;r.scale.setScalar(1.1+a*1.2),r.material.opacity=.75*(1-a);break}case"orbit":case"rainbow":{const a=n*(this.kind==="orbit"?2.2:1.6)+s.phase,o=this.kind==="rainbow"?Math.sin(a)*.5:0;r.position.set(Math.cos(a)*1.6,1+o,Math.sin(a)*1.6);break}case"sparkle":{const a=Math.max(0,Math.sin(n*3+s.phase));r.position.set(s.x,s.y+Math.sin(n+s.phase)*.15,s.z),r.scale.setScalar(.3+a),r.rotation.y=n*2;break}case"halo":r.position.y=2.55+Math.sin(n*2)*.08;break;case"flames":r.scale.set(1,.7+Math.abs(Math.sin(n*9+s.phase))*.6,1);break;case"snow":{s.h-=t*.6,s.h<0&&(s.h+=2.4);const a=n*.8+s.phase;r.position.set(Math.cos(a)*s.r,s.h,Math.sin(a)*s.r),r.rotation.set(n,n*1.3,0);break}case"zap":r.rotation.set(n*2.4+s.phase,n*1.7,s.phase);break;case"vortex":{const a=(n*.35+s.phase)%1,o=a*ot*2+n,c=1.5-a*.6;r.position.set(Math.cos(o)*c,a*2.6,Math.sin(o)*c),r.scale.setScalar(1-a*.6);break}}}}}const Hr=[{id:"none",price:0},{id:"bubbles",price:120,shape:"sphere",colors:[12577279,8316671,16777215],rise:2.5,size:.24},{id:"smoke",price:180,shape:"sphere",colors:[15000812,12105928],rise:1.5,size:.32,grow:!0},{id:"leaves",price:260,shape:"tetra",colors:[9234522,4170573,13171554],rise:-.5,size:.22},{id:"confetti",price:400,shape:"cube",colors:[16736122,5163519,13171554,16756736,11561471],rise:.5,size:.18},{id:"stars",price:650,shape:"octa",colors:[16773792,16777215,16766822],rise:.8,size:.22},{id:"fire",ads:2,shape:"tetra",colors:[16742943,16765501,16727357],rise:4,size:.26},{id:"ice",ads:3,shape:"octa",colors:[14678271,8316671,16777215],rise:0,size:.22},{id:"neon",ads:3,shape:"sphere",colors:[13171554,3536328],rise:.3,size:.2},{id:"rainbow",ads:4,shape:"sphere",rainbow:!0,rise:.4,size:.24},{id:"galaxy",ads:5,shape:"octa",colors:[9067775,16743093,5163519,16777215],rise:1,size:.24}],Vr=[{id:"none",price:0},{id:"glow",price:150,kind:"ring",color:8316671},{id:"orbit",price:300,kind:"orbit",color:13171554},{id:"pulse",price:450,kind:"pulse",color:16743093},{id:"sparkle",price:700,kind:"sparkle",color:16769126},{id:"halo",price:900,kind:"halo",color:16773792},{id:"flames",ads:2,kind:"flames",color:16742943},{id:"snow",ads:3,kind:"snow",color:16777215},{id:"zap",ads:3,kind:"zap",color:8316671},{id:"prism",ads:4,kind:"rainbow",color:16777215},{id:"vortex",ads:5,kind:"vortex",color:11561471}],Xg=new Map(Hr.map(i=>[i.id,i])),qg=new Map(Vr.map(i=>[i.id,i])),Yg=i=>Xg.get(i)||Hr[0],$g=i=>qg.get(i)||Vr[0],za=i=>"#"+i.toString(16).padStart(6,"0");function Kg(i,t,e=4176127,n=128){const s=document.createElement("canvas");s.width=s.height=n;const r=s.getContext("2d"),a=n/128,o=(c,l,h)=>{const d=r.createRadialGradient(c-h*.35,l-h*.4,h*.1,c,l,h);d.addColorStop(0,"#ffffff"),d.addColorStop(.25,za(e)),d.addColorStop(1,"#0a0620"),r.fillStyle=d,r.beginPath(),r.arc(c,l,h,0,Math.PI*2),r.fill()};if(t.id==="none")return o(64*a,64*a,26*a),r.strokeStyle="rgba(255,255,255,0.35)",r.lineWidth=5*a,r.beginPath(),r.arc(64*a,64*a,44*a,0,Math.PI*2),r.moveTo(33*a,95*a),r.lineTo(95*a,33*a),r.stroke(),s.toDataURL("image/png");if(i==="trails"){for(let c=0;c<9;c++){const l=c/8,h=(16+l*64)*a,d=(78-Math.sin(l*3.2)*10-l*6)*a,u=(4+l*7)*a;r.fillStyle=t.rainbow?`hsl(${c*40%360},90%,62%)`:za(t.colors[c%t.colors.length]),r.globalAlpha=.35+l*.65,r.beginPath(),t.shape==="cube"?r.rect(h-u,d-u,u*2,u*2):t.shape==="octa"||t.shape==="tetra"?(r.moveTo(h,d-u*1.3),r.lineTo(h+u,d),r.lineTo(h,d+u*1.3),r.lineTo(h-u,d),r.closePath()):r.arc(h,d,u,0,Math.PI*2),r.fill()}r.globalAlpha=1,o(96*a,62*a,22*a)}else{const c=za(t.color);switch(r.strokeStyle=c,r.fillStyle=c,r.lineWidth=5*a,t.kind){case"ring":case"pulse":r.globalAlpha=.85,r.beginPath(),r.ellipse(64*a,96*a,46*a,14*a,0,0,Math.PI*2),r.stroke(),t.kind==="pulse"&&(r.globalAlpha=.4,r.beginPath(),r.ellipse(64*a,96*a,58*a,19*a,0,0,Math.PI*2),r.stroke());break;case"halo":r.beginPath(),r.ellipse(64*a,22*a,24*a,8*a,0,0,Math.PI*2),r.stroke();break;case"flames":for(let l=0;l<7;l++){const h=(22+l*14)*a;r.fillStyle=l%2?"#ffd23d":c,r.beginPath(),r.moveTo(h-6*a,104*a),r.lineTo(h,(78-l%3*6)*a),r.lineTo(h+6*a,104*a),r.fill()}break;case"zap":r.beginPath(),r.ellipse(64*a,62*a,50*a,16*a,.5,0,Math.PI*2),r.stroke(),r.beginPath(),r.ellipse(64*a,62*a,50*a,16*a,-.5,0,Math.PI*2),r.stroke();break;default:{const l=t.kind==="snow"?10:t.kind==="vortex"?12:6;for(let h=0;h<l;h++){const d=h/l*Math.PI*2,u=t.kind==="vortex"?20+h*2.6:48,f=64*a+Math.cos(d)*u*a,g=(t.kind==="vortex"?100-h*6:64+Math.sin(d)*18)*a;r.fillStyle=t.kind==="rainbow"?`hsl(${h*60},90%,62%)`:c,r.beginPath(),r.arc(f,g,(t.kind==="snow"?4:6)*a,0,Math.PI*2),r.fill()}}}r.globalAlpha=1,o(64*a,62*a,26*a)}return s.toDataURL("image/png")}class jg{constructor(t){this.canvas=t,this.move={x:0,y:0},this.yaw=0,this.pitch=.62,this.zoom=1,this.keys=new Set,this.enabled=!0,this.mouse={x:0,y:0},this.mouseEnabled=!0,this.mouseDown=!1,this.mouseHasPos=!1,this._joyId=null,this._joyOrigin={x:0,y:0},this._camId=null,this._camLast={x:0,y:0},this._pinch=0,this._pointers=new Map,this.joyEl=document.getElementById("joystick"),this.joyBase=this.joyEl?this.joyEl.querySelector(".joy-base"):null,this.joyKnob=document.getElementById("joyKnob"),this._bind()}_bind(){window.addEventListener("keydown",a=>{a.target&&/^(INPUT|TEXTAREA)$/.test(a.target.tagName)||(this.keys.add(a.code),["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(a.code)&&a.preventDefault())},{passive:!1}),window.addEventListener("keyup",a=>this.keys.delete(a.code)),window.addEventListener("blur",()=>this.keys.clear()),this.canvas.addEventListener("pointerdown",a=>{if(a.pointerType!=="touch"){if(a.button===0){this.mouseDown=!0,this._setMousePos(a.clientX,a.clientY),this._mouseId=a.pointerId,this.canvas.setPointerCapture(a.pointerId);return}(a.button===2||a.button===1)&&(this._camId=a.pointerId,this._camLast.x=a.clientX,this._camLast.y=a.clientY,this.canvas.setPointerCapture(a.pointerId))}});const t=a=>{a.pointerType!=="touch"&&((a.pointerId===this._mouseId||a.button===0)&&(this.mouseDown=!1,this._mouseId=null),this._camId===a.pointerId&&(this._camId=null))};window.addEventListener("pointerup",t),window.addEventListener("pointercancel",t),window.addEventListener("blur",()=>{this.mouseDown=!1}),window.addEventListener("pointermove",a=>{a.pointerType!=="touch"&&((a.target===this.canvas||this.mouseDown)&&this._setMousePos(a.clientX,a.clientY),this._camId===a.pointerId&&(this._orbit(a.clientX-this._camLast.x,a.clientY-this._camLast.y),this._camLast.x=a.clientX,this._camLast.y=a.clientY))});const e=a=>{this._camId===a.pointerId&&(this._camId=null)};this.canvas.addEventListener("pointerup",e),this.canvas.addEventListener("pointercancel",e),this.canvas.addEventListener("wheel",a=>{a.preventDefault(),this.zoom=ze(this.zoom*(1+Math.sign(a.deltaY)*.12),.55,2.4)},{passive:!1});const n=a=>{for(const o of a.changedTouches)this._isUiPoint(o.clientX,o.clientY)||(this._joyId===null&&this._inJoyZone(o.clientX,o.clientY)?(this._joyId=o.identifier,this._joyOrigin.x=o.clientX,this._joyOrigin.y=o.clientY,this._placeJoystick(o.clientX,o.clientY),this.joyEl&&this.joyEl.classList.add("active")):this._camId===null&&(this._camId=o.identifier,this._camLast.x=o.clientX,this._camLast.y=o.clientY),this._pointers.set(o.identifier,{x:o.clientX,y:o.clientY}));this._updatePinch(!0)},s=a=>{let o=!1;for(const c of a.changedTouches)c.identifier!==this._joyId&&c.identifier!==this._camId||(o=!0,this._pointers.set(c.identifier,{x:c.clientX,y:c.clientY}),c.identifier===this._joyId?this._updateJoystick(c.clientX,c.clientY):this._pointers.size<2&&(this._orbit(c.clientX-this._camLast.x,c.clientY-this._camLast.y),this._camLast.x=c.clientX,this._camLast.y=c.clientY));o&&(this._updatePinch(!1),a.cancelable&&a.preventDefault())},r=a=>{for(const o of a.changedTouches)this._pointers.delete(o.identifier),o.identifier===this._joyId&&(this._joyId=null,this.move.x=this.move.y=0,this._resetKnob(),this.joyEl&&this.joyEl.classList.remove("active")),o.identifier===this._camId&&(this._camId=null);this._pointers.size<2&&(this._pinch=0)};document.addEventListener("touchstart",n,{passive:!0}),document.addEventListener("touchmove",s,{passive:!1}),document.addEventListener("touchend",r,{passive:!0}),document.addEventListener("touchcancel",r,{passive:!0})}_isUiPoint(t,e){const n=document.elementFromPoint(t,e);return n?!!n.closest("button, input, .modal-layer, .stat-chip, #startScreen, #deathScreen, #loader, .overlay"):!1}_inJoyZone(t,e){const n=window.innerWidth,s=window.innerHeight;return!(t>n*.48||e<s*.35)}_placeJoystick(t,e){if(!this.joyBase)return;const n=this.joyEl.getBoundingClientRect();this.joyBase.style.left=t-n.left+"px",this.joyBase.style.bottom=n.bottom-e+"px",this._resetKnob()}_updateJoystick(t,e){const n=t-this._joyOrigin.x,s=e-this._joyOrigin.y,r=Math.min(window.innerWidth,window.innerHeight)*.11,a=Math.hypot(n,s),o=a>r?r/a:1,c=n*o,l=s*o;this.joyKnob&&(this.joyKnob.style.transform=`translate(${c}px, ${l}px)`);const h=Math.min(1,a/r);a>1e-4?(this.move.x=n/a*h,this.move.y=-s/a*h):this.move.x=this.move.y=0}_resetKnob(){this.joyKnob&&(this.joyKnob.style.transform="translate(0px, 0px)")}_orbit(t,e){this.yaw-=t*.0045,this.pitch=ze(this.pitch+e*.0035,.12,1.32)}_updatePinch(t){if(this._pointers.size!==2)return;const e=[...this._pointers.values()],n=Math.hypot(e[0].x-e[1].x,e[0].y-e[1].y);if(t||!this._pinch){this._pinch=n;return}const s=this._pinch/n;this.zoom=ze(this.zoom*(1+(s-1)*.6),.55,2.4),this._pinch=n}_setMousePos(t,e){!Number.isFinite(t)||!Number.isFinite(e)||(this.mouse.x=t,this.mouse.y=e,this.mouseHasPos=!0)}setMouseEnabled(t){this.mouseEnabled=!!t,t||(this.mouseDown=!1)}get mouseSteering(){return this.mouseEnabled&&this.mouseDown&&this.mouseHasPos}update(){if(this._joyId!==null)return;let t=0,e=0;const n=this.keys;(n.has("KeyW")||n.has("ArrowUp"))&&(e+=1),(n.has("KeyS")||n.has("ArrowDown"))&&(e-=1),(n.has("KeyA")||n.has("ArrowLeft"))&&(t-=1),(n.has("KeyD")||n.has("ArrowRight"))&&(t+=1);const s=Math.hypot(t,e);s>0&&(t/=s,e/=s),this.move.x=t,this.move.y=e}reset(){this.keys.clear(),this.move.x=this.move.y=0,this._joyId=null,this._camId=null,this._mouseId=null,this.mouseDown=!1,this._pointers.clear(),this._resetKnob(),this.joyEl&&this.joyEl.classList.remove("active")}}const Tn={SPEED:"speed",MAGNET:"magnet",SHIELD:"shield"};class Zg{constructor(t){this.canvas=t,this.quality="high",this.running=!1,this.paused=!1,this.playing=!1,this.lang="ru",this.onDeath=null,this.onStats=null,this.onCoins=null,this.onMatchEnd=null,this.onPlayerEaten=null,this.mode=zo.classic,this.matchActive=!1,this.matchTime=0,this.matchTotal=0,this.ring=null,this.playerInStorm=!1,this._playerRespawn=0,this._menuAngle=0,this.up=Go(),this.actors=[],this.player=null,this.auto=!1,this.boosts={speed:0,magnet:0,shield:0},this.sessionCoins=0,this.board=[],this._boardTimer=0,this._respawnQueue=[],this._tmpV=new U,this._tmpV2=new U}init(t="high"){this.quality=t,this.renderer=new wh({canvas:this.canvas,antialias:t!=="low",powerPreference:"high-performance",stencil:!1}),this.renderer.setPixelRatio(this._pixelRatio()),this.renderer.setSize(window.innerWidth,window.innerHeight,!1),this.renderer.outputColorSpace=De,this.renderer.shadowMap.enabled=t!=="low",this.renderer.shadowMap.type=Yl,this.scene=new bh,this.scene.background=new yt(10476799),this.scene.fog=new tc(12576511,420,1150),this.camera=new ln(58,window.innerWidth/window.innerHeight,.5,2600),this.camera.position.set(0,30,45);const e=new Ch(14086399,5939258,1.35);this.scene.add(e);const n=new Ph(16774365,1.85);if(n.position.set(60,120,40),t!=="low"){n.castShadow=!0;const s=t==="high"?2048:1024;n.shadow.mapSize.set(s,s),n.shadow.camera.near=10,n.shadow.camera.far=420,n.shadow.bias=-.0016,n.shadow.normalBias=.6,this._setShadowExtent(n,95)}this.scene.add(n),this.scene.add(n.target),this.sun=n,this.world=new xg(this.scene,t),this.food=new Mg(this.scene,t,this.world),this.pickups=new yg(this.scene,t,this.world),this.fx=new Sg(this.scene),this.ring=new Bg(this.scene),this.trail=new Vg(this.scene),this.aura=new Wg,this.input=new jg(this.canvas),window.addEventListener("resize",()=>this.resize()),this.resize()}_setShadowExtent(t,e){const n=t.shadow.camera;n.left=-e,n.right=e,n.top=e,n.bottom=-e,n.updateProjectionMatrix()}_pixelRatio(){const t=window.devicePixelRatio||1;return this.quality==="low"?1:this.quality==="medium"?Math.min(t,1.5):Math.min(t,2)}resize(){const t=window.innerWidth,e=window.innerHeight;this.renderer&&(this.renderer.setPixelRatio(this._pixelRatio()),this.renderer.setSize(t,e,!1),this.camera.aspect=t/e,this.camera.fov=e>t?68:58,this.camera.updateProjectionMatrix())}setQuality(t){t!==this.quality&&(this.quality=t,this.renderer.setPixelRatio(this._pixelRatio()),this.renderer.shadowMap.enabled=t!=="low",this.sun.castShadow=t!=="low",this.renderer.shadowMap.needsUpdate=!0)}startRun(t,e,n="classic"){this._clearActors(),this.mode=Gr(n),this.food.setMode(this.mode.food),this.player=new Nh(this.scene,{isPlayer:!0,name:t||"Player",score:this.up.startScore,x:ye(-60,60),z:ye(-60,60),skin:Ci(e)}),this.actors.push(this.player),this.aura&&this.player.character.root.add(this.aura.group);const s=this.mode.bots[this.quality]||this.mode.bots.medium;for(let r=0;r<s;r++)this.actors.push(this._spawnModeBot());this.boosts.speed=0,this.boosts.magnet=0,this.boosts.shield=0,this.player.shieldTime=this.up.shield,this.sessionCoins=0,this.auto=!1,this.playing=!0,this.matchActive=this.mode.id!=="classic",this.matchTime=0,this.matchTotal=this.actors.length,this.playerInStorm=!1,this._playerRespawn=0,this.mode.ring?this.ring.start():this.ring.stop(),this.input.reset(),this.input.yaw=this.player.yaw+Math.PI,this.input.pitch=.62,this.input.zoom=1,this._snapCamera(),this._updateBoard(!0)}_spawnModeBot(){return Ug(this.scene,{awayFrom:this.player,forceSmall:this.mode.smallBots,growth:this.mode.botGrowth})}setUpgrades(t){this.up=Go(t)}setCosmetics({trail:t="none",effect:e="none"}={}){this.trail.set(Yg(t)),this.aura.set($g(e))}_coinGain(t){return Math.max(1,Math.round(t*this.up.coins))}stopRun(){this._clearActors(),this.playing=!1,this.matchActive=!1,this.playerInStorm=!1,this._playerRespawn=0,this.ring.stop(),this.boosts.speed=this.boosts.magnet=this.boosts.shield=0}revivePlayer(t=6){if(!this.player)return;let e=0,n=0,s=-1;for(let r=0;r<24;r++){const a=ye(-Te+30,Te-30),o=ye(-Te+30,Te-30);let c=1/0;for(const l of this.actors)l===this.player||!l.alive||(c=Math.min(c,Math.hypot(l.x-a,l.z-o)-l.radius));c>s&&(s=c,e=a,n=o)}this.player.x=e,this.player.z=n,this.player.vx=this.player.vz=0,this.player.alive=!0,this.player.shieldTime=t,this.player.character.root.visible=!0,this.playing=!0,this._snapCamera()}_clearActors(){for(const t of this.actors)t.dispose();this.actors.length=0,this._respawnQueue.length=0,this.player=null}setAuto(t){this.auto=t}applyBoost(t,e){t===Tn.SPEED?this.boosts.speed=Math.max(this.boosts.speed,e||60):t===Tn.MAGNET?this.boosts.magnet=Math.max(this.boosts.magnet,e||20):t===Tn.SHIELD&&(this.boosts.shield=Math.max(this.boosts.shield,e||15))}doubleSize(){if(!this.player)return;const t=Math.max(600,Math.floor(this.player.score));this.player.addScore(t),this.fx.burst(this.player.x,this.player.radius*2,this.player.z,16765501,26,16),qt.grow()}getBoosts(){const t=[];return this.boosts.speed>0&&t.push({type:Tn.SPEED,time:this.boosts.speed}),this.boosts.magnet>0&&t.push({type:Tn.MAGNET,time:this.boosts.magnet}),this.boosts.shield>0&&t.push({type:Tn.SHIELD,time:this.boosts.shield}),t}_menuCamera(t){this._menuAngle+=t*.05;const e=this._menuAngle;this.camera.position.set(Math.sin(e)*150,78,Math.cos(e)*150),this.camera.lookAt(0,6,0)}_cameraTarget(t){const e=this.player,n=e?e.radius:2;return t.set(e?e.x:0,n*1.5+1.5,e?e.z:0),t}_cameraDistance(){return(16+(this.player?this.player.radius:2)*5.4)*this.input.zoom}_clearCameraDistance(t,e,n,s){if(!this.world||!this.world.isBlocked)return s;const r=Math.sin(e)*Math.cos(n),a=Math.sin(n),o=Math.cos(e)*Math.cos(n),c=10,l=Math.max(3,s*.22);for(let h=1;h<=c;h++){const d=h/c*s;if(this.world.isBlocked(t.x+r*d,t.y+a*d,t.z+o*d))return Math.max(l,(h-1)/c*s)}return s}_snapCamera(){const t=this._cameraTarget(this._tmpV).clone(),{yaw:e,pitch:n}=this.input,s=this._clearCameraDistance(t,e,n,this._cameraDistance());this.camera.position.set(t.x+Math.sin(e)*Math.cos(n)*s,t.y+Math.sin(n)*s,t.z+Math.cos(e)*Math.cos(n)*s),this.camera.lookAt(t)}_updateCamera(t){const e=this._cameraTarget(this._tmpV),{yaw:n,pitch:s}=this.input,r=this._clearCameraDistance(e,n,s,this._cameraDistance()),a=e.x+Math.sin(n)*Math.cos(s)*r,o=Math.max(3,e.y+Math.sin(s)*r),c=e.z+Math.cos(n)*Math.cos(s)*r,l=Math.hypot(this.camera.position.x-e.x,this.camera.position.z-e.z),h=Fo(t,r<l?20:6.5);if(this.camera.position.x+=(a-this.camera.position.x)*h,this.camera.position.y+=(o-this.camera.position.y)*h,this.camera.position.z+=(c-this.camera.position.z)*h,this.camera.lookAt(e.x,e.y,e.z),this.sun.castShadow){const d=this.player?this.player.radius:2;this._setShadowExtent(this.sun,ze(70+d*4,70,240)),this.sun.position.set(e.x+70,140,e.z+50),this.sun.target.position.set(e.x,0,e.z),this.sun.target.updateMatrixWorld()}}_moveDir(){const t=this.input.yaw,e=-Math.sin(t),n=-Math.cos(t),s=-n,r=e,a=this.input.move;if(a.x!==0||a.y!==0)return{x:s*a.x+e*a.y,z:r*a.x+n*a.y};if(this.input.mouseSteering&&this.player){const o=this._cursorDir();if(o)return{x:s*o.x+e*o.y,z:r*o.x+n*o.y}}return{x:0,z:0}}_cursorDir(){const t=window.innerWidth,e=window.innerHeight;if(!t||!e)return null;const n=this._tmpV2.set(this.player.x,this.player.radius,this.player.z).project(this.camera),s=(n.x*.5+.5)*t,r=(-n.y*.5+.5)*e,a=this.input.mouse.x-s,o=this.input.mouse.y-r,c=Math.hypot(a,o);if(!Number.isFinite(c)||c<=0)return null;const l=Math.min(t,e),h=l*.035;if(c<=h)return null;const d=Math.min(1,(c-h)/(l*.22));return{x:a/c*d,y:-o/c*d}}update(t){this.renderer&&(t=Math.min(t,.05),this.world.update(t),this.playing&&this.player&&this.player.alive?(this._updateActors(t),this._updateBoosts(t),this._resolveEating(t),this._updateBoardTimer(t)):this.player&&this._updateActors(t,!0),this.food.update(t),this.pickups.update(t),this.fx.update(t),this.trail.update(t,this.player),this.player&&this.aura.update(t,this.player),this.matchActive&&this._updateMatch(t),this.player?this._updateCamera(t):this._menuCamera(t),this.renderer.render(this.scene,this.camera))}_updateActors(t,e=!1){this.input.update();const n=this.mode.ring&&this.ring.active?this.ring.zone:null;for(const s of this.actors){if(!s.alive)continue;let r;s.isPlayer?(e?r={x:0,z:0}:this.auto?r=s.think(t,this.actors,s,n):r=this._moveDir(),s.speedMul=(this.boosts.speed>0?2:1)*this.up.speed):(r=s.think(t,this.actors,s,n),s.score+=s.score*s.ai.growth*t+6*t);const a=s.move(t,r.x,r.z,this.world);if(s.ateObstacles.length){for(const l of s.ateObstacles)this.fx.burst(l.x,Math.min(l.h,14)*.5+1.5,l.z,11065450,18,13);s.isPlayer&&qt.crunch()}let o=s.radius;s.isPlayer&&(o*=(this.boosts.magnet>0?1.15:1)*this.up.bite);const c=this.food.eat(s.x,s.z,o);c.count&&(s.addScore(s.isPlayer?c.value*this.up.growth:c.value),s.isPlayer&&(qt.eat(ze(s.radius/14,0,1)),this.fx.burst(c.lastX,2,c.lastZ,16777215,Math.min(6,c.count*2),7),c.gold&&(this.fx.burst(c.lastX,3,c.lastZ,16756736,16,11),this.fx.popup("+"+Math.round(c.gold*Ih*this.up.growth),c.lastX,5,c.lastZ,"#ffc94a")))),s.syncVisual(t,a),s.shieldTime>0&&(s.shieldTime-=t)}if(!e&&this.player&&this.player.alive){const s=this.pickups.collect(this.player.x,this.player.z,this.player.radius);for(const r of s)if(r.type===yn.COIN){const a=this._coinGain(1+Math.floor(Math.random()*3));this.sessionCoins+=a,qt.coin(),this.fx.burst(r.x,3,r.z,16765501,12,10),this.fx.popup("+"+a,r.x,5,r.z,"#ffd93d"),this.onCoins&&this.onCoins(a)}else r.type===yn.SPEED?(this.applyBoost(Tn.SPEED,12),qt.reward(),this.fx.burst(r.x,3,r.z,5163519,14,11)):r.type===yn.MAGNET?(this.applyBoost(Tn.MAGNET,16),qt.reward(),this.fx.burst(r.x,3,r.z,16736122,14,11)):r.type===yn.SHIELD&&(this.applyBoost(Tn.SHIELD,14),this.player.shieldTime=Math.max(this.player.shieldTime,14),qt.reward(),this.fx.burst(r.x,3,r.z,11561471,14,11));this.boosts.magnet>0&&this.food.attract(this.player.x,this.player.z,this.player.radius+26,t)}for(let s=this._respawnQueue.length-1;s>=0;s--)this._respawnQueue[s]-=t,this._respawnQueue[s]<=0&&(this._respawnQueue.splice(s,1),this.actors.push(this._spawnModeBot()))}_updateBoosts(t){for(const e of Object.keys(this.boosts))this.boosts[e]>0&&(this.boosts[e]=Math.max(0,this.boosts[e]-t));this.boosts.shield>0&&this.player&&(this.player.shieldTime=Math.max(this.player.shieldTime,.05))}_resolveEating(){const t=this.actors,e=[];for(let n=0;n<t.length;n++){const s=t[n];if(s.alive)for(let r=n+1;r<t.length;r++){const a=t[r];if(!a.alive)continue;const o=a.x-s.x,c=a.z-s.z,l=Math.hypot(o,c);if(l>s.radius+a.radius)continue;let h=null,d=null;if(s.power>a.power*Br)h=s,d=a;else if(a.power>s.power*Br)h=a,d=s;else continue;if(!(d.shieldTime>0)&&!(l>h.radius*.92)&&(this._devour(h,d,e),!s.alive))break}}for(const n of e){const s=this.actors.indexOf(n);s>=0&&this.actors.splice(s,1),n.dispose(),this.mode.respawnBots&&this._respawnQueue.push(ye(1.5,4))}this.mode.ring&&this.matchActive&&this.player.alive&&this._aliveCount()===1&&this._endMatch("win")}_devour(t,e,n){e.alive=!1;const s=(Math.floor(e.score*.85)+60)*(t.isPlayer?this.up.growth:1);if(t.addScore(s),this.fx.burst(e.x,e.radius*1.5,e.z,16747069,22,14),e.character.root.visible=!1,e.isPlayer){this._killPlayer(t.name);return}if(t.isPlayer){const r=this._coinGain(ze(Math.round(Math.sqrt(e.score+100)/7),1,60));this.sessionCoins+=r,qt.bigEat(),this.fx.popup("+"+r,e.x,e.radius*2+3,e.z,"#ffd93d"),this.onCoins&&this.onCoins(r)}n.push(e)}_killPlayer(t,e="eaten"){if(this.playing){if(this.player.alive=!1,this.player.character.root.visible=!1,qt.death(),this.fx.burst(this.player.x,this.player.radius*1.6,this.player.z,16731482,30,18),this.mode.playerRespawn&&this.matchActive){this.player.score=Math.floor(this.player.score*.5),this._playerRespawn=2.5,this.onPlayerEaten&&this.onPlayerEaten(t||"");return}this.playing=!1,this.mode.id==="classic"?this.onDeath&&this.onDeath(t||"",Math.floor(this.player.score)):this._endMatch(e,t||"")}}_aliveCount(){let t=0;for(const e of this.actors)e.alive&&t++;return t}_updateMatch(t){if(this.matchTime+=t,this._playerRespawn>0&&(this._playerRespawn-=t,this._playerRespawn<=0&&this.player&&(this.revivePlayer(3),this.fx.burst(this.player.x,3,this.player.z,8316671,20,12))),this.mode.ring){if(this.ring.update(t),this._applyStorm(t),!this.matchActive)return;this.ring.finished&&this._endMatch("time")}this.mode.timeLimit&&this.matchTime>=this.mode.timeLimit&&this._endMatch("time")}_applyStorm(t){this.playerInStorm=!1;const e=this.ring.dps;for(let n=this.actors.length-1;n>=0;n--){const s=this.actors[n];if(!(!s.alive||this.ring.contains(s.x,s.z))&&(s.isPlayer&&(this.playerInStorm=!0),s.score-=(s.score*e+25)*t,!(s.score>0))){if(s.score=0,s.isPlayer){if(this._killPlayer("","storm"),!this.matchActive)return;continue}s.alive=!1,this.fx.burst(s.x,s.radius*1.5,s.z,12602879,18,12),this.actors.splice(n,1),s.dispose()}}this.matchActive&&this.player&&this.player.alive&&this._aliveCount()===1&&this._endMatch("win")}_endMatch(t,e=""){if(!this.matchActive)return;this.matchActive=!1,this.playerInStorm=!1,this._playerRespawn=0;const n=this.matchTotal;let s;if(t==="win")s=1;else if(this.mode.ring&&(t==="eaten"||t==="storm"))s=this._aliveCount()+1;else{const r=this.actors.filter(a=>a.alive||a===this.player);r.sort((a,o)=>o.score-a.score),s=r.indexOf(this.player)+1}s=ze(s,1,Math.max(1,n)),this.player&&!this.player.alive&&this.mode.playerRespawn&&(this.player.alive=!0,this.player.character.root.visible=!0),this.playing=!1,(t==="win"||t==="time")&&qt.reward(),this.onMatchEnd&&this.onMatchEnd({mode:this.mode.id,reason:t,place:s,total:n,win:s===1,score:Math.floor(this.player?this.player.score:0),killer:e})}getMatchInfo(){if(this.mode.id==="classic")return null;const t={mode:this.mode.id,active:this.matchActive,alive:this._aliveCount(),total:this.matchTotal};return this.mode.timeLimit&&(t.time=Math.max(0,this.mode.timeLimit-this.matchTime)),this.mode.ring&&(t.ring=this.ring.info),t}_updateBoardTimer(t){this._boardTimer-=t,this._boardTimer<=0&&(this._boardTimer=.4,this._updateBoard(),this.onStats&&this.onStats({score:Math.floor(this.player?this.player.score:0),rank:this.playerRank,total:this.actors.length}))}_updateBoard(){const t=this.actors.slice().filter(r=>r.alive).sort((r,a)=>a.score-r.score);this.playerRank=t.indexOf(this.player)+1,this.sorted=t;const e=t.length;let n=ze(this.playerRank-3,0,Math.max(0,e-5));const s=[];for(let r=n;r<Math.min(e,n+5);r++)s.push({rank:r+1,name:t[r].name,score:$e(t[r].score,this.lang),me:t[r]===this.player});this.board=s}pause(){this.paused=!0}resume(){this.paused=!1,this.input.reset()}renderStill(){this.renderer&&this.renderer.render(this.scene,this.camera)}get playerScore(){return this.player?Math.floor(this.player.score):0}}const J=i=>document.getElementById(i),Ba=[{at:15,kind:"score",amount:4500},{at:75,kind:"spins",amount:2},{at:135,kind:"score",amount:9e3},{at:195,kind:"score",amount:13e3},{at:255,kind:"spins",amount:3},{at:315,kind:"score",amount:21e3},{at:375,kind:"coins",amount:45},{at:455,kind:"score",amount:35e3},{at:555,kind:"score",amount:43e3},{at:675,kind:"spins",amount:9},{at:855,kind:"score",amount:55e3},{at:955,kind:"score",amount:77e3}],Is=[30,50,75,110,160,220,400],Ga=3,es=[{kind:"coins",amount:9},{kind:"score",amount:3e3},{kind:"coins",amount:13},{kind:"spins",amount:1},{kind:"score",amount:15e3},{kind:"coins",amount:50},{kind:"coins",amount:23},{kind:"spins",amount:2}],Ul=["#2f80ed","#1b6fd4","#2f80ed","#1b6fd4","#2f80ed","#e07b28","#2f80ed","#1b6fd4"],Jg=180,Nl=25;class Qg{constructor(t={}){this.hooks=t,this.modalOpen=null,this.skinPreviews=new Map,this._shopTab="skins",this.spinning=!1,this._deathTimer=0,this._deathActive=!1,this._cacheNodes(),this._bind(),this._buildWheel(),nd(()=>this.refreshAll()),window.addEventListener("resize",()=>this._fitRail())}_cacheNodes(){this.loader=J("loader"),this.loaderFill=J("loaderFill"),this.loaderTip=J("loaderTip"),this.startScreen=J("startScreen"),this.hud=J("hud"),this.deathScreen=J("deathScreen"),this.resultScreen=J("resultScreen"),this.matchPill=J("matchPill"),this.stormFx=J("stormFx"),this.modalLayer=J("modalLayer"),this.pauseOverlay=J("pauseOverlay"),this.toasts=J("toasts"),this.statScore=J("statScore"),this.statCoins=J("statCoins"),this.arenaBoard=J("arenaBoard"),this.boostBar=J("boostBar"),this.hint=J("hint"),this.nickShow=J("nickShow")}_bind(){const t=(a,o)=>{a&&a.addEventListener("click",c=>{c.preventDefault(),qt.click(),o(c)})};t(J("btnPlay"),()=>this._play()),t(J("btnStartSkins"),()=>this.openPanel("modalSkins")),t(J("btnStartLeaders"),()=>this.openPanel(null,()=>this.openLeaderboard())),t(J("btnStartSettings"),()=>this.openPanel("modalSettings")),t(J("btnMenu"),()=>this.openPanel("modalSettings")),t(J("btnSkins"),()=>this.openPanel("modalSkins")),t(J("btnUpgrades"),()=>this.openPanel("modalUpgrades")),t(J("btnStartUpgrades"),()=>this.openPanel("modalUpgrades")),document.querySelectorAll(".shop-tab").forEach(a=>{t(a,()=>{this._shopTab=a.getAttribute("data-tab"),this.renderSkins()})}),t(J("btnQuickSkin"),()=>this.openPanel("modalSkins")),t(J("btnGifts"),()=>this.openPanel("modalGifts")),t(J("btnSpin"),()=>this.openPanel("modalSpin")),t(J("btnDaily"),()=>this.openPanel("modalDaily")),t(J("btnCoinsPlus"),()=>this.openPanel("modalCoins")),t(J("btnGlobalLb"),()=>this.openPanel(null,()=>this.openLeaderboard())),t(J("btnAuto"),()=>{const a=!J("btnAuto").classList.contains("on");J("btnAuto").classList.toggle("on",a),this.hooks.onAuto&&this.hooks.onAuto(a)}),t(J("btnBoostSpeed"),()=>this.hooks.onRewarded&&this.hooks.onRewarded("speed")),t(J("btnBoostSize"),()=>this.hooks.onRewarded&&this.hooks.onRewarded("size")),t(J("btnRevive"),()=>this.hooks.onRewarded&&this.hooks.onRewarded("revive")),t(J("btnRestart"),()=>{this.hideDeath(),this.hooks.onRestart&&this.hooks.onRestart()}),t(J("btnDeathMenu"),()=>{this.hideDeath(),this.hooks.onMenu&&this.hooks.onMenu()}),t(J("btnResAgain"),()=>{this.hideResult(),this.hooks.onRestart&&this.hooks.onRestart()}),t(J("btnResMenu"),()=>{this.hideResult(),this.hooks.onMenu&&this.hooks.onMenu()}),t(J("btnExitMenu"),()=>{this.closeModal(),this.hooks.onExitRun&&this.hooks.onExitRun()}),document.querySelectorAll(".mode-card").forEach(a=>{t(a,()=>{X.set("mode",a.getAttribute("data-mode")),this._syncModes()})}),t(J("btnSpinGo"),()=>this.trySpin(!1)),t(J("btnSpinCoins"),()=>this.trySpin(!0)),this.modalLayer.addEventListener("click",a=>{a.target===this.modalLayer&&this.closeModal(),a.target.closest("[data-close]")&&(qt.click(),this.closeModal())}),document.querySelectorAll(".coin-way").forEach(a=>{a.addEventListener("click",()=>{qt.click();const o=a.getAttribute("data-way");this.openModal(o==="spin"?"modalSpin":o==="daily"?"modalDaily":"modalGifts")})}),window.addEventListener("keydown",a=>{a.code==="Escape"&&this.modalOpen&&this.closeModal(),a.code==="Space"&&this._deathActive?(a.preventDefault(),this.hideDeath(),this.hooks.onRestart&&this.hooks.onRestart()):a.code==="Space"&&!this.modalOpen&&!this.resultScreen.classList.contains("hidden")&&(a.preventDefault(),this.hideResult(),this.hooks.onRestart&&this.hooks.onRestart())});const e=J("setSound"),n=J("setMusic");t(e,()=>{const a=!e.classList.contains("on");e.classList.toggle("on",a),qt.setSound(a),X.set("sound",a)}),t(n,()=>{const a=!n.classList.contains("on");n.classList.toggle("on",a),qt.setMusic(a),X.set("music",a)});const s=J("setMouse");t(s,()=>{const a=!s.classList.contains("on");s.classList.toggle("on",a),X.set("mouseCtl",a),this.hooks.onMouseControl&&this.hooks.onMouseControl(a)}),J("setQuality").querySelectorAll("button").forEach(a=>{a.addEventListener("click",()=>{qt.click();const o=a.getAttribute("data-q");X.set("quality",o),this._syncSettings(),this.hooks.onQuality&&this.hooks.onQuality(o)})});const r=J("setLang");r&&r.querySelectorAll("button").forEach(a=>{a.addEventListener("click",()=>{qt.click();const o=a.getAttribute("data-l");X.set("lang",o),Xl(o),this._syncSettings()})})}setProgress(t,e){this.loaderFill.style.width=ze(t,0,100)+"%",e&&(this.loaderTip.textContent=e)}hideLoader(){this.loader.classList.add("hidden")}showStart(){this.startScreen.classList.remove("hidden"),this.hud.classList.add("hidden"),this.showNick(),this.refreshAll()}_play(){const t=(X.get("nick")||"").trim().slice(0,14);t&&X.set("nick",t),this.startScreen.classList.add("hidden"),this.hud.classList.remove("hidden"),this.hooks.onPlay&&this.hooks.onPlay(t);const n=document.body.classList.contains("touch")?ct("hintMobile"):X.get("mouseCtl")!==!1?ct("hintMouse"):ct("hintMove");this.showHint(n,3600);const s=Gr(X.get("mode")).id;clearTimeout(this._modeHintTimer),s!=="classic"&&(this._modeHintTimer=setTimeout(()=>this.showHint(ct(s==="ring"?"ringHint":"blitzHint"),4500),3800))}_syncModes(){const t=Gr(X.get("mode")).id;document.querySelectorAll(".mode-card").forEach(s=>s.classList.toggle("on",s.getAttribute("data-mode")===t));const e=J("modeDesc");if(!e)return;let n=ct("modeDesc_"+t);t==="ring"&&X.get("ringBest")&&(n+=` · ${ct("bestPlace")}: #${X.get("ringBest")}`),t==="blitz"&&X.get("blitzBest")&&(n+=` · ${ct("bestWord")}: ${$e(X.get("blitzBest"),ke())}`),e.textContent=n}setMode(t){const e=t!=="classic"&&Ng.includes(t);this.matchPill.classList.toggle("hidden",!e),document.body.classList.toggle("has-match",e),this.setStorm(!1),this._matchHtml="",this._pillTop=null,e?this._placeMatchPill():this.boostBar&&(this.boostBar.style.top=""),this._fitRail()}_fitRail(){const t=document.querySelector(".dock"),e=document.querySelector(".boostrail, .adrail");if(!t||!e||this.hud.classList.contains("hidden"))return;document.body.classList.remove("rail-up");const n=t.getBoundingClientRect(),s=e.getBoundingClientRect(),r=n.right+16>s.left&&n.top<s.bottom+8&&n.bottom>s.top-8;document.body.classList.toggle("rail-up",r)}_placeMatchPill(){const t=this.matchPill;if(!t||t.classList.contains("hidden")||this.hud.classList.contains("hidden"))return;const e=document.querySelector(".topbar");let n=e?e.getBoundingClientRect().bottom+6:70;const s=t.getBoundingClientRect();for(const r of[".radar",".top-right"]){const a=document.querySelector(r);if(!a)continue;const o=a.getBoundingClientRect();o.width&&s.left<o.right&&s.right>o.left&&(n=Math.max(n,o.bottom+6))}n=Math.round(n-this.hud.getBoundingClientRect().top),n!==this._pillTop&&(this._pillTop=n,t.style.top=n+"px",this.boostBar&&(this.boostBar.style.top=n+t.offsetHeight+6+"px"))}setMatch(t){if(!t)return;this._placeMatchPill();let e="",n=0,s="",r=!1;if(t.mode==="blitz")e=ct("timeWord"),n=t.time,r=n<=10;else if(t.ring){const o=t.ring.state;e=ct(o==="wait"?"ringWait":o==="shrink"?"ringShrink":"ringFinal"),n=t.ring.time,r=o!=="wait",s=`${ct("aliveWord")}: ${t.alive}`}const a=e+"|"+Math.ceil(n)+"|"+s+"|"+r;a!==this._matchHtml&&(this._matchHtml=a,J("mpLabel").textContent=e,J("mpTime").textContent=Ji(n),J("mpAlive").textContent=s,J("mpAlive").classList.toggle("hidden",!s),this.matchPill.classList.toggle("warn",r))}setStorm(t){this._stormOn!==t&&(this._stormOn=t,this.stormFx.classList.toggle("on",t))}showResult(t){const e=ke(),n=t.win?ct("resWin"):t.reason==="time"?ct("resTime"):ct("resOut");J("resTitle").textContent=n,J("resTitle").classList.toggle("win",!!t.win),J("resMode").textContent=ct(t.mode==="ring"?"modeRing":"modeBlitz"),J("resPlace").textContent="#"+t.place,J("resOf").textContent=ct("ofTotal",{n:t.total}),J("resScore").textContent=$e(t.score,e),J("resCoins").textContent="+"+t.coins,J("resBest").textContent=t.mode==="ring"?`${ct("bestPlace")}: #${t.best}`:`${ct("bestWord")}: ${$e(t.best,e)}`,J("resNote").textContent=t.reason==="storm"?ct("stormKilled"):t.reason==="eaten"&&t.killer?`${ct("eatenBy")}: ${t.killer}`:"",this.setStorm(!1),this.resultScreen.classList.remove("hidden")}hideResult(){this.resultScreen.classList.add("hidden")}showHint(t,e=3e3){this.hint.textContent=t,this.hint.classList.add("show"),clearTimeout(this._hintTimer),this._hintTimer=setTimeout(()=>this.hint.classList.remove("show"),e)}setScore(t){this.statScore.textContent=$e(t,ke())}showNick(){this.nickShow&&(this.nickShow.textContent=X.get("nick")||"")}setRank(t){const e=J("statRank");e&&(e.textContent=t>0?String(t):"—")}drawMinimap(t){const e=this._radar||(this._radar=J("minimap"));if(!e||!t||!t.player)return;const n=this._radarCtx||(this._radarCtx=e.getContext("2d")),s=e.width,r=e.height,a=zt,o=f=>f/a*(s/2-8)+s/2,c=f=>f/a*(r/2-8)+r/2,l=f=>f/a*(s/2-8);n.clearRect(0,0,s,r),n.strokeStyle="rgba(214,183,126,0.28)",n.lineWidth=3,n.lineCap="round",n.beginPath();for(const f of Lh)f.forEach(([g,_],m)=>m?n.lineTo(o(g),c(_)):n.moveTo(o(g),c(_)));n.stroke(),n.fillStyle="rgba(221,213,195,0.2)",n.beginPath(),n.arc(o(0),c(0),l(Ns),0,Math.PI*2),n.fill(),n.fillStyle="rgba(46,184,230,0.22)",n.beginPath(),n.arc(o(Gt.x),c(Gt.z),l(Gt.r),0,Math.PI*2),n.fill();const h=t.mode&&t.mode.ring&&t.ring&&t.ring.active?t.ring:null;h&&(n.fillStyle="rgba(192,60,170,0.22)",n.beginPath(),n.rect(0,0,s,r),h.cur.r>.5&&n.arc(o(h.cur.x),c(h.cur.z),l(h.cur.r),0,Math.PI*2,!0),n.fill("evenodd"),h.cur.r>.5&&(n.strokeStyle="rgba(255,90,170,0.95)",n.lineWidth=2.5,n.beginPath(),n.arc(o(h.cur.x),c(h.cur.z),l(h.cur.r),0,Math.PI*2),n.stroke()),h.state==="wait"&&h.next.r>.5&&(n.strokeStyle="rgba(255,255,255,0.85)",n.lineWidth=2,n.setLineDash([6,5]),n.beginPath(),n.arc(o(h.next.x),c(h.next.z),l(h.next.r),0,Math.PI*2),n.stroke(),n.setLineDash([])));const d=t.player,u=d.power;for(const f of t.actors){if(!f.alive||f===d)continue;const g=Math.max(1.6,Math.min(7,1.4+f.radius*.22));n.fillStyle=f.power>u*1.18?"rgba(239,61,134,0.9)":"rgba(126,230,255,0.75)",n.beginPath(),n.arc(o(f.x),c(f.z),g,0,Math.PI*2),n.fill()}n.fillStyle="#c8fb62",n.beginPath(),n.arc(o(d.x),c(d.z),4.5,0,Math.PI*2),n.fill(),n.strokeStyle="rgba(10,6,32,0.9)",n.lineWidth=2,n.stroke()}setCoins(t){const e=Math.floor(t);if(this._lastCoins!==void 0&&e>this._lastCoins){const r=this.statCoins.closest(".tb-coins");r&&(r.classList.remove("bump"),r.offsetWidth,r.classList.add("bump"))}this._lastCoins=e,this.statCoins.textContent=String(e);const n=J("upCoins");n&&(n.textContent=String(e));const s=J("skinsCoins");s&&(s.textContent=String(Math.floor(t)))}setBoard(t){if(!t)return;const e=t.map(n=>`<div class="ab-row${n.me?" me":""}"><span class="ab-rank">${n.rank}.</span><span class="ab-name">${Ha(n.name)}</span><span class="ab-score">${n.score}</span></div>`).join("");e!==this._boardHtml&&(this.arenaBoard.innerHTML=e,this._boardHtml=e)}setBoosts(t){const e=t.map(n=>{const s=n.type==="speed"?ct("boostSpeed"):n.type==="magnet"?ct("boostMagnet"):ct("boostShield");return`<div class="boost-pill ${n.type}">${s} ${Math.ceil(n.time)}</div>`}).join("");e!==this._boostHtml&&(this.boostBar.innerHTML=e,this._boostHtml=e)}setAdButtonsEnabled(t){["btnBoostSpeed","btnBoostSize","btnRevive"].forEach(e=>{const n=J(e);n&&(n.disabled=!t)}),document.querySelectorAll(".up-ad, .skin-btn.ad").forEach(e=>{e.disabled=!t})}showDeath(t,e,n,s){this._deathActive=!0,J("deathScore").textContent=$e(e,ke()),J("deathBest").textContent=$e(n,ke()),J("deathKiller").textContent=t?`${ct("eatenBy")}: ${t}`:"",J("btnRevive").style.display=s?"":"none";const r=J("deathRibbon");r&&r.classList.toggle("hidden",!(e>=n&&e>0));const a=J("deathRing");if(a){const o=n>0?Math.max(.04,Math.min(1,e/n)):.04,c=2*Math.PI*52;a.style.strokeDasharray=String(c),a.style.strokeDashoffset=String(c),requestAnimationFrame(()=>{a.style.strokeDashoffset=String(c*(1-o))})}this.deathScreen.classList.remove("hidden"),this._deathTimer=15,this._tickDeath()}_tickDeath(){clearInterval(this._deathInterval),this._deathInterval=setInterval(()=>{if(!this._deathActive)return clearInterval(this._deathInterval);this._deathTimer-=.1,J("deathCountdown").textContent=Math.max(0,this._deathTimer).toFixed(1).replace(".",","),this._deathTimer<=0&&(clearInterval(this._deathInterval),this.hideDeath(),this.hooks.onRestart&&this.hooks.onRestart())},100)}hideDeath(){this._deathActive=!1,clearInterval(this._deathInterval),this.deathScreen.classList.add("hidden")}pauseDeathTimer(){clearInterval(this._deathInterval)}resumeDeathTimer(){this._deathActive&&this._tickDeath()}async openPanel(t,e){if(this.hooks.onPanelOpen)try{await this.hooks.onPanelOpen()}catch{}e?e():t&&this.openModal(t)}openModal(t){this.closeModal(!0);const e=J(t);if(e&&(this.modalLayer.classList.remove("hidden"),e.classList.add("open"),this.modalOpen=t,this.hooks.onModalChange&&this.hooks.onModalChange(!0),t==="modalSkins"&&this.renderSkins(),t==="modalUpgrades"&&this.renderUpgrades(),t==="modalGifts"&&this.renderGifts(),t==="modalDaily"&&this.renderDaily(),t==="modalSpin"&&this.renderSpin(),t==="modalSettings")){this._syncSettings();const n=!!(this.hooks.isRunActive&&this.hooks.isRunActive());J("setExitRow").classList.toggle("hidden",!n)}}isBlockingUiOpen(){return!!this.modalOpen||!this.modalLayer.classList.contains("hidden")||!this.deathScreen.classList.contains("hidden")||!this.resultScreen.classList.contains("hidden")||!this.startScreen.classList.contains("hidden")}closeModal(t=!1){document.querySelectorAll(".modal.open").forEach(e=>e.classList.remove("open")),this.modalLayer.classList.add("hidden"),this.modalOpen=null,t||(this.refreshBadges(),this.hooks.onModalChange&&this.hooks.onModalChange(!1))}_preview(t){if(!this.skinPreviews.has(t.id)){let e="";try{e=Eg(t,128)}catch{e=""}this.skinPreviews.set(t.id,e)}return this.skinPreviews.get(t.id)}renderSkins(){const t=this._shopTab;document.querySelectorAll(".shop-tab").forEach(n=>n.classList.toggle("on",n.getAttribute("data-tab")===t));const e=J("skinsGrid");e.innerHTML="",this._shopList(t).forEach((n,s)=>{const r=document.createElement("div");r.className="skin-card"+(n.ads?" ad-item":""),r.style.setProperty("--i",String(s));let a="",o="";n.current?(a="selected",o=ct("selected")):n.owned?o=ct("select"):n.ads?(a="ad",o=`<span class="rw-ico"></span>${X.adViewsOf(t,n.id)}/${n.ads}`):(a="locked",o=`<span class="stat-ico ico-coin"></span>${n.price}`),r.innerHTML=`<div class="skin-name">${Ha(n.name)}</div>`+(n.preview?`<img class="skin-prev" src="${n.preview}" alt="">`:'<div class="skin-prev"></div>')+(n.ads&&!n.owned?`<div class="skin-tag">${ct("forAds")}</div>`:"")+`<button class="skin-btn ${a}">${o}</button>`,r.querySelector(".skin-btn").addEventListener("click",()=>{qt.click(),!n.current&&(n.owned?this._equip(t,n.id):n.ads?this.hooks.onRewarded&&this.hooks.onRewarded(`item:${t}:${n.id}`):X.get("coins")>=n.price?(X.spendCoins(n.price),X.unlock(t,n.id),qt.reward(),this.toast(ct(t==="skins"?"skinBought":"itemBought")),this.setCoins(X.get("coins")),this._equip(t,n.id)):(qt.error(),this.toast(ct("notEnoughCoins"),"err")))}),e.appendChild(r)}),this.setCoins(X.get("coins")),this._syncQuickSkin()}_shopList(t){const e=ke();if(t==="skins"){const a=X.get("skin");return ms.map(o=>({id:o.id,name:bg(o,e),preview:this._preview(o),price:o.price||0,ads:o.ads||0,owned:X.ownsSkin(o.id),current:a===o.id}))}const n=t==="trails"?Hr:Vr,s=X.get(t==="trails"?"trail":"effect")||"none",r=Ci(X.get("skin")).color;return n.map(a=>{const o=`${t}:${a.id}:${r}`;if(!this.skinPreviews.has(o)){let c="";try{c=Kg(t,a,r)}catch{c=""}this.skinPreviews.set(o,c)}return{id:a.id,name:ct((t==="trails"?"trail_":"effect_")+a.id),preview:this.skinPreviews.get(o),price:a.price||0,ads:a.ads||0,owned:a.id==="none"||X.owns(t,a.id),current:s===a.id}})}_equip(t,e){t==="skins"?(X.set("skin",e),this.hooks.onSkin&&this.hooks.onSkin(e)):(X.set(t==="trails"?"trail":"effect",e),this.hooks.onCosmetic&&this.hooks.onCosmetic()),this.renderSkins()}onItemAdWatched(t,e){const s=(t==="skins"?ms:t==="trails"?Hr:Vr).find(a=>a.id===e);if(!s||!s.ads)return;const r=X.addAdView(t,e);r>=s.ads?(t==="skins"?X.unlockSkin(e):X.unlock(t,e),qt.reward(),this.toast(ct("itemUnlocked")),this._equip(t,e)):(this.toast(`${ct("adProgress")} ${r}/${s.ads}`),this.modalOpen==="modalSkins"&&this.renderSkins())}_upValue(t,e){const n=Go({[t]:e}),s=r=>"+"+Math.round((r-1)*100)+"%";switch(t){case"speed":return s(n.speed);case"start":return $e(n.startScore,ke());case"bite":return s(n.bite);case"growth":return s(n.growth);case"coins":return s(n.coins);case"shield":return n.shield.toFixed(1)+" "+ct("secShort");default:return""}}renderUpgrades(t=null){const e=J("upList");if(!e)return;const n=X.get("coins")||0;e.innerHTML="",Bo.forEach((s,r)=>{const a=X.get(Os(s.id))||0,o=a>=Fs,c=Il(s,a),l=n<c,h=document.createElement("div");h.className="up-card"+(o?" max":"")+(t===s.id?" flash":""),h.style.setProperty("--i",String(r));const d=Array.from({length:Fs},(g,_)=>`<i class="${_<a?"on":""}"></i>`).join("");h.innerHTML=`<div class="up-top"><span class="up-ico ${s.icon}"></span><div class="up-txt"><b class="up-name">${ct("up_"+s.id)}</b><span class="up-desc">${ct("up_"+s.id+"_d")}</span></div><span class="up-lvl">${ct("lvlShort")} ${a}</span></div><div class="up-pips">${d}</div><div class="up-val">${this._upValue(s.id,a)}${o?"":`<i>→</i><b>${this._upValue(s.id,a+1)}</b>`}</div><div class="up-btns">`+(o?`<span class="up-max">${ct("upMax")}</span>`:`<button class="up-buy${l?" poor":""}"><span class="stat-ico ico-coin"></span>${c}</button>`+(l?`<button class="up-ad"><span class="rw-ico"></span>${ct("upAd")}</button>`:""))+"</div>";const u=h.querySelector(".up-buy");u&&u.addEventListener("click",()=>{if(qt.click(),!X.spendCoins(c)){qt.error(),this.toast(ct("notEnoughCoins"),"err");return}X.set(Os(s.id),a+1),qt.reward(),this.toast(ct("upDone")),this.setCoins(X.get("coins")),this.hooks.onUpgrade&&this.hooks.onUpgrade(),this.renderUpgrades(s.id),this.refreshBadges()});const f=h.querySelector(".up-ad");f&&f.addEventListener("click",()=>{qt.click(),this.hooks.onRewarded&&this.hooks.onRewarded("upgrade:"+s.id)}),e.appendChild(h)}),this.setCoins(n)}_syncQuickSkin(){const t=document.querySelector(".skin-quick-dot");if(!t)return;const e=Ci(X.get("skin"));t.style.background="#"+e.color.toString(16).padStart(6,"0")}_giftElapsed(){let t=X.get("giftStart");return t||(t=Date.now(),X.set("giftStart",t)),(Date.now()-t)/1e3}renderGifts(){const t=J("giftsGrid"),e=this._giftElapsed(),n=X.get("giftIndex")||0;t.innerHTML="",Ba.forEach((s,r)=>{const a=r<n,o=!a&&e>=s.at&&r===n,c=document.createElement("div");c.className="gift-card"+(a?" done":o?" ready":"");const l=Math.max(0,s.at-e),h=s.kind==="coins"?`+${s.amount}`:s.kind==="spins"?`+${s.amount}`:$e(s.amount,ke()),d=s.kind==="coins"?"ico-coin":s.kind==="spins"?"ico-wheel":"ico-eater";c.innerHTML=`<span class="gift-tag">${h}</span><span class="gift-img ${d}"></span><span class="gift-time">${a?ct("claimed"):o?ct("claim"):dg(l)}</span>`,o&&c.addEventListener("click",()=>{qt.reward(),this._grant(s.kind,s.amount),X.set("giftIndex",n+1),this.renderGifts(),this.refreshBadges()}),t.appendChild(c)})}_dailyReady(){const t=X.get("dailyAt")||0;return Date.now()-t>=20*3600*1e3}_dailyLeft(){const t=X.get("dailyAt")||0;return Math.max(0,(t+20*3600*1e3-Date.now())/1e3)}renderDaily(){const t=J("dailyGrid"),e=X.get("dailyDay")||0,n=this._dailyReady(),s=e%Is.length,r=ke(),a=Is.map((h,d)=>`<i class="${d<s?"on":d===s&&n?"now":""}"></i>`).join("");t.innerHTML=`<div class="daily-top"><div class="daily-streak"><span>${ct("dailyStreak")}</span><b>${s}/${Is.length}</b></div><div class="daily-dots">${a}</div><div class="daily-sub">${ct("dailySub")}</div></div><div class="daily-list" id="dailyList"></div><div class="daily-foot" id="dailyFoot"></div>`;const o=J("dailyList");Is.forEach((h,d)=>{const u=d===Is.length-1,f=d<s?"claimed":d===s?n?"ready":"next":"later",g=u?"ico-gift":d<2?"ico-coin":d<4?"ico-coins-pile":"ico-calendar",_=document.createElement("div");_.className=`daily-card ${f}${u?" big":""}`,_.style.setProperty("--i",String(d));let m="";f==="claimed"?m=`<span class="daily-state">${ct("claimed")}</span>`:f==="ready"?m=`<span class="daily-claim">${ct("claim")}</span>`:f==="next"&&(m=`<span class="daily-state soon" data-daily-left>${Ji(this._dailyLeft())}</span>`),_.innerHTML=(u?`<span class="daily-ribbon">${ct("dailyBig")}</span>`:"")+`<span class="daily-day">${ct("day")} ${d+1}</span><span class="daily-img ${g}"></span><span class="daily-amt"><span class="stat-ico ico-coin"></span>+${$e(h,r)}`+(u?` <span class="daily-plus">+${Ga} <span class="stat-ico ico-wheel"></span></span>`:"")+"</span>"+m+(f==="claimed"?'<span class="daily-check">✓</span>':""),f==="ready"&&_.addEventListener("click",()=>{_.classList.contains("claiming")||(_.classList.add("claiming"),qt.reward(),this._coinBurst(_),X.addCoins(h),u&&X.set("spins",(X.get("spins")||0)+Ga),X.patch({dailyDay:e+1,dailyAt:Date.now()}),this.setCoins(X.get("coins")),this.toast("+"+h+" "+ct("coinsPlus")+(u?` · +${Ga} ${ct("luckySpin")}`:"")),setTimeout(()=>{this.modalOpen==="modalDaily"&&this.renderDaily(),this.refreshBadges()},750))}),o.appendChild(_)});const c=J("dailyFoot"),l=()=>{const h=this._dailyLeft();c.innerHTML=h>0?`${ct("dailyNext")} <b>${Ji(h)}</b>`:`<b class="daily-go">${ct("dailyClaimNow")}</b>`;const d=o.querySelector("[data-daily-left]");d&&(d.textContent=Ji(h))};l(),clearInterval(this._dailyTimerId),this._dailyTimerId=setInterval(()=>{if(this.modalOpen!=="modalDaily")return clearInterval(this._dailyTimerId);if(!n&&this._dailyReady())return this.renderDaily();l()},1e3)}_coinBurst(t){for(let e=0;e<10;e++){const n=document.createElement("span");n.className="daily-coin ico-coin";const s=e/10*Math.PI*2+Math.random()*.4,r=3+Math.random()*2.5;n.style.setProperty("--dx",(Math.cos(s)*r).toFixed(2)+"rem"),n.style.setProperty("--dy",(Math.sin(s)*r-1.5).toFixed(2)+"rem"),n.style.animationDelay=(Math.random()*.08).toFixed(2)+"s",t.appendChild(n)}}_buildWheel(){const t=J("wheel"),e=360/es.length,n=es.map((s,r)=>`${Ul[r%Ul.length]} ${r*e}deg ${(r+1)*e}deg`);t.style.background=`conic-gradient(from 0deg, ${n.join(",")})`,t.innerHTML=es.map((s,r)=>{const a=s.kind==="coins"?`+${s.amount}`:s.kind==="spins"?`+${s.amount}`:$e(s.amount,"ru"),o=s.kind==="coins"?"ico-coin":s.kind==="spins"?"ico-wheel":"ico-eater";return`<div class="wheel-seg" style="transform:rotate(${r*e+e/2}deg)">
                <div class="wheel-lbl"><span class="stat-ico ${o}"></span><br>${a}</div>
              </div>`}).join(""),this._wheelRot=0}renderSpin(){const t=Date.now(),e=X.get("spinAt")||0,n=X.get("spins")||0,s=Math.max(0,(e-t)/1e3),r=s<=0||n>0;J("spinTimer").textContent=n>0?`${ct("spinReady")} (${n})`:s>0?Ji(s):ct("spinReady"),J("btnSpinGo").disabled=!r||this.spinning,J("btnSpinCoins").disabled=this.spinning||X.get("coins")<Nl,J("spinResult").classList.add("hidden"),clearInterval(this._spinTimerId),this._spinTimerId=setInterval(()=>{if(this.modalOpen!=="modalSpin")return clearInterval(this._spinTimerId);const a=Math.max(0,((X.get("spinAt")||0)-Date.now())/1e3),o=X.get("spins")||0;J("spinTimer").textContent=o>0?`${ct("spinReady")} (${o})`:a>0?Ji(a):ct("spinReady"),this.spinning||(J("btnSpinGo").disabled=!(a<=0||o>0))},500)}trySpin(t){if(this.spinning)return;const e=X.get("spins")||0,n=(X.get("spinAt")||0)<=Date.now();if(t){if(!X.spendCoins(Nl))return qt.error(),this.toast(ct("notEnoughCoins"),"err");this.setCoins(X.get("coins"))}else if(e>0)X.set("spins",e-1);else if(n)X.set("spinAt",Date.now()+Jg*1e3);else{qt.error();return}this.spinning=!0,J("btnSpinGo").disabled=!0,J("btnSpinCoins").disabled=!0;const s=Math.random()*es.length|0,r=360/es.length;this._wheelRot+=360*6-(this._wheelRot%360+s*r+r/2),J("wheel").style.transform=`rotate(${this._wheelRot}deg)`;let a=0;const o=setInterval(()=>{qt.spinTick(),++a>26&&clearInterval(o)},140);setTimeout(()=>{clearInterval(o),this.spinning=!1;const c=es[s];this._grant(c.kind,c.amount),qt.reward();const l=c.kind==="coins"?`+${c.amount}`:c.kind==="spins"?`+${c.amount}`:$e(c.amount,ke()),h=c.kind==="coins"?"ico-coin":c.kind==="spins"?"ico-wheel":"ico-eater",d=J("spinResult");d.innerHTML=`<b>${ct("youWon")}</b><span class="prize-img ${h}"></span><b>${l}</b>`,d.classList.remove("hidden"),setTimeout(()=>{d.classList.add("hidden"),this.renderSpin()},2200),this.refreshBadges()},4600)}_grant(t,e){if(t==="coins")X.addCoins(e),this.setCoins(X.get("coins")),this.toast("+"+e+" "+ct("coinsPlus"));else if(t==="spins")X.set("spins",(X.get("spins")||0)+e),this.toast("+"+e+" "+ct("luckySpin"));else if(t==="score")if(this.hooks.onGrantScore&&this.hooks.onGrantScore(e))this.toast("+"+$e(e,ke()));else{const s=Math.max(5,Math.round(Math.sqrt(e)/4));X.addCoins(s),this.setCoins(X.get("coins")),this.toast("+"+s+" "+ct("coinsPlus"))}}async openLeaderboard(){this.openModal("modalLeaders");const t=J("leadersBody"),e=J("leadersFoot");if(t.innerHTML=`<div class="lb-loading">${ct("lbLoading")}</div>`,e.innerHTML="",!Va()&&kl()){e.innerHTML=`<div class="lb-auth"><p class="lb-auth-note">${ct("lbLoginHint")}</p><button class="btn btn-lime" id="lbLoginBtn">${ct("lbLogin")}</button></div>`;const a=J("lbLoginBtn");a.addEventListener("click",async()=>{qt.click(),a.disabled=!0;const o=await Wh();a.disabled=!1,o&&(await X.init(),this.refreshAll(),await Sr(X.get("best")||0),this.openLeaderboard())})}const n=await $h();if(!n){console.warn("[LB] panel unavailable:",Yh()),t.innerHTML=`<div class="lb-empty">${ct("lbError")}</div>`;const a=document.createElement("button");a.className="btn btn-cyan",a.textContent=ct("lbRetry"),a.addEventListener("click",()=>{qt.click(),this.openLeaderboard()}),e.appendChild(a);return}if(!n.entries.length){t.innerHTML=`<div class="lb-empty">${ct("lbEmpty")}</div>`;return}let s=0;const r=n.entries.map(a=>{const o=s&&a.rank>s+1?'<div class="lb-sep">•••</div>':"";s=a.rank;const c=a.name||ct("you"),l=a.photo?`<span class="lb-ava" style="background-image:url('${a.photo}')"></span>`:'<span class="lb-ava"></span>';return o+`<div class="lb-row${a.isMe?" me":""}"><span class="lb-rank">${a.rank}</span>${l}<span class="lb-name">${Ha(c)}</span><span class="lb-score">${$e(a.score,ke())}</span></div>`}).join("");t.innerHTML=`<div class="lb-list">${r}</div>`}showPause(){this.pauseOverlay.classList.remove("hidden")}hidePause(){this.pauseOverlay.classList.add("hidden")}toast(t,e=""){const n=document.createElement("div");n.className="toast"+(e?" "+e:""),n.textContent=t,this.toasts.appendChild(n),setTimeout(()=>{n.classList.add("out"),setTimeout(()=>n.remove(),400)},2200)}refreshBadges(){const t=this._giftElapsed(),e=X.get("giftIndex")||0,n=e<Ba.length&&t>=Ba[e].at;this._badge("giftsBadge",n?1:0);const s=X.get("spins")||0,r=s>0||(X.get("spinAt")||0)<=Date.now();this._badge("spinBadge",r?s||1:0),this._badge("dailyBadge",this._dailyReady()?1:0);const a=X.get("coins")||0;let o=0;for(const c of Bo){const l=X.get(Os(c.id))||0;l<Fs&&a>=Il(c,l)&&o++}this._badge("upBadge",o)}_badge(t,e){const n=J(t);n&&(n.textContent=String(e),n.classList.toggle("hidden",e<=0))}_syncSettings(){J("setSound").classList.toggle("on",!!X.get("sound")),J("setMusic").classList.toggle("on",!!X.get("music"));const t=J("setMouse");t&&t.classList.toggle("on",X.get("mouseCtl")!==!1);const e=X.get("quality")||"high";J("setQuality").querySelectorAll("button").forEach(s=>s.classList.toggle("on",s.getAttribute("data-q")===e));const n=J("setLang");if(n){const s=ke();n.querySelectorAll("button").forEach(r=>r.classList.toggle("on",r.getAttribute("data-l")===s))}}refreshAll(){Xa(),this.setCoins(X.get("coins")),this.showNick(),this.refreshBadges(),this._syncSettings(),this._syncQuickSkin(),this._syncModes(),this._fitRail(),this._buildWheel(),this.modalOpen==="modalSkins"&&this.renderSkins(),this.modalOpen==="modalUpgrades"&&this.renderUpgrades(),this.modalOpen==="modalGifts"&&this.renderGifts(),this.modalOpen==="modalDaily"&&this.renderDaily(),this._boardHtml="",this._boostHtml=""}}function Ha(i){return String(i).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function t_(){window.addEventListener("contextmenu",t=>t.preventDefault(),{capture:!0}),document.addEventListener("selectstart",t=>{t.target instanceof HTMLInputElement||t.target instanceof HTMLTextAreaElement||t.preventDefault()}),document.addEventListener("dragstart",t=>t.preventDefault()),["gesturestart","gesturechange","gestureend"].forEach(t=>document.addEventListener(t,e=>e.preventDefault(),{passive:!1}));let i=0;document.addEventListener("touchend",t=>{const e=Date.now();e-i<320&&t.cancelable&&t.preventDefault(),i=e},{passive:!1}),document.addEventListener("mousedown",t=>{t.button===1&&t.preventDefault()})}function e_(){const i=X.get("quality");if(i)return i;const t=Gl(),e=navigator.hardwareConcurrency||4,n=navigator.deviceMemory||4;return t&&(e<=4||n<=3)?"low":t||e<=4||n<=4?"medium":"high"}function Fl(i=150){return new Promise(t=>{let e=!1;const n=()=>{e||(e=!0,t())};requestAnimationFrame(n),setTimeout(n,i)})}function n_(){return"ontouchstart"in window||navigator.maxTouchPoints>0||Gl()}async function i_(){t_(),n_()&&document.body.classList.add("touch");const i=document.getElementById("scene"),t=new Zg(i),e=new Qg({}),n=new Set;let s=!1,r=!1;function a(){["hidden","blur","platform"].some(R=>n.has(R))&&!n.has("ad")&&t.playing?e.showPause():e.hidePause()}function o(){const y=n.size>0;y!==s&&(s=y,y?(t.pause(),e.pauseDeathTimer(),Ds()):(t.resume(),e.resumeDeathTimer(),t.playing&&yr()));const A=[...n].some(R=>R!=="modal");A!==r&&(r=A,A?qt.pause():qt.resume()),a()}function c(y){n.add(y),o()}function l(y){n.delete(y),o()}document.addEventListener("visibilitychange",()=>{document.hidden?n.add("hidden"):(n.delete("hidden"),document.hasFocus()&&n.delete("blur")),o()}),document.hidden&&n.add("hidden");let h=0;window.addEventListener("blur",()=>{clearTimeout(h),h=setTimeout(()=>{(document.hidden||!document.hasFocus())&&c("blur")},250)}),window.addEventListener("focus",()=>{clearTimeout(h),l("blur")});const d=()=>{clearTimeout(h),n.delete("blur"),document.hidden||n.delete("hidden"),o()};window.addEventListener("pointerdown",d,!0),window.addEventListener("keydown",d,!0),window.addEventListener("touchstart",d,!0),e.pauseOverlay.addEventListener("click",d),window.addEventListener("pagehide",()=>c("hidden")),window.addEventListener("pageshow",()=>{document.hidden||(n.delete("hidden"),o())}),Bh(y=>y?c("platform"):l("platform")),e.hooks.onModalChange=y=>{y&&t.player&&(t.playing||t.matchActive)?c("modal"):y||l("modal")},e.setProgress(8,ct("loading")),await Gh(),e.setProgress(26),await X.init();const u=window.__playgamaYandexShim?"en":void 0,f=X.get("lang")||Wl(Kh(),u);Xl(f),t.lang=ke(),Lr()&&(X.get("best")||0)>0&&Sr(X.get("best")),X.get("nick")||X.set("nick",Pl(ke())),qt.setSound(X.get("sound")!==!1),qt.setMusic(X.get("music")!==!1),e.setProgress(42,ct("loading")),document.fonts&&document.fonts.load&&await Promise.race([document.fonts.load("900 64px Nunito").catch(()=>null),new Promise(y=>setTimeout(y,1500))]);const g=e_();X.set("quality",g),t.init(g),t.input.setMouseEnabled(X.get("mouseCtl")!==!1),t.setUpgrades(m()),t.setCosmetics({trail:X.get("trail"),effect:X.get("effect")}),e.setProgress(80),await Fl(),t.renderStill(),e.setProgress(95),await Fl(),e.hooks.onPlay=y=>_(y),e.hooks.onRestart=()=>_(),e.hooks.onMenu=()=>p(),e.hooks.isRunActive=()=>!!t.player&&(t.playing||t.matchActive),e.hooks.onExitRun=()=>{if(t.mode.id==="classic"&&t.player){const y=Math.max(X.get("best")||0,t.playerScore);X.patch({best:y}),X.flush(),Sr(y)}p()},e.hooks.onAuto=y=>t.setAuto(y),e.hooks.onQuality=y=>t.setQuality(y),e.hooks.onMouseControl=y=>t.input.setMouseEnabled(y),e.hooks.onPanelOpen=()=>Ws.maybeShow("ui"),e.hooks.onSkin=y=>{t.player&&t.player.setSkin(Ci(y))},e.hooks.onRewarded=y=>x(y),e.hooks.onUpgrade=()=>t.setUpgrades(m()),e.hooks.onCosmetic=()=>t.setCosmetics({trail:X.get("trail"),effect:X.get("effect")}),e.hooks.onGrantScore=y=>t.playing&&t.player&&t.player.alive?(t.player.addScore(y),!0):!1,t.onCoins=y=>{X.addCoins(y),e.setCoins(X.get("coins"))},t.onStats=y=>{e.setScore(y.score),e.setRank(y.rank),e.setBoard(t.board)},t.onDeath=(y,A)=>{const R=Math.max(X.get("best")||0,A);X.patch({best:R,plays:(X.get("plays")||0)+1}),X.flush(),Sr(R),Ds(),e.showDeath(y,A,R,!0)},t.onPlayerEaten=y=>{e.toast(y?`${ct("eatenBy")}: ${y} — ${ct("blitzPenalty")}`:ct("blitzPenalty"),"warn")},t.onMatchEnd=y=>{const A=Math.round(Fg(y.mode,y.place)*t.up.coins);X.addCoins(A),e.setCoins(X.get("coins"));const R={plays:(X.get("plays")||0)+1};let N;if(y.mode==="ring"){const v=X.get("ringBest")||0;N=v?Math.min(v,y.place):y.place,R.ringBest=N,y.win&&(R.ringWins=(X.get("ringWins")||0)+1)}else N=Math.max(X.get("blitzBest")||0,y.score),R.blitzBest=N;X.patch(R),X.flush(),Ds(),setTimeout(()=>e.showResult({...y,coins:A,best:N}),y.win?500:900)},Ws.setHooks({canShow:()=>!e.isBlockingUiOpen(),onAdStart:()=>c("ad"),onAdEnd:()=>{n.delete("ad"),document.hidden||n.delete("blur"),o()}}),e.setProgress(100),e.hideLoader(),e.showStart(),Hh(),Ws.start(),C();function _(y){const A=(y||X.get("nick")||Pl(ke())).slice(0,14);X.set("nick",A),qt.unlock(),t.lang=ke();const R=Gr(X.get("mode")).id;t.startRun(A,X.get("skin"),R),e.setMode(R),e.hideDeath(),e.hideResult(),e.setScore(0),e.setCoins(X.get("coins")),e.setBoard(t.board),e.refreshBadges();const N=document.getElementById("btnAuto");N&&N.classList.remove("on"),yr()}function m(){const y={};for(const A of Bo)y[A.id]=X.get(Os(A.id))||0;return y}function p(){t.stopRun(),Ds(),e.hideDeath(),e.hideResult(),e.setMode("classic"),e.showStart()}let M=!1;async function x(y){if(M)return;M=!0,e.setAdButtonsEnabled(!1),e.pauseDeathTimer();const A=y.startsWith("upgrade:")?y.slice(8):null,R=y.startsWith("item:")?y.split(":"):null,N=R?Ms.ITEM:A?Ms.UPGRADE:y==="speed"?Ms.SPEED:y==="size"?Ms.SIZE:Ms.REVIVE;let v=!1;try{v=await Ws.showRewarded(N)}catch{v=!1}if(M=!1,e.setAdButtonsEnabled(!0),!v){e.toast(ct("adNoReward"),"warn"),e.resumeDeathTimer();return}if(R){e.onItemAdWatched(R[1],R[2]),e.resumeDeathTimer();return}else if(A){const b=Os(A);X.set(b,Math.min(Fs,(X.get(b)||0)+1)),X.flush(),t.setUpgrades(m()),e.renderUpgrades(),e.resumeDeathTimer()}else y==="speed"?(t.applyBoost(Tn.SPEED,60),e.resumeDeathTimer()):y==="size"?(t.doubleSize(),e.resumeDeathTimer()):y==="revive"&&(e.hideDeath(),t.revivePlayer(),yr());qt.reward(),e.toast(ct(N.doneKey))}const S=()=>{qt.unlock(),window.removeEventListener("pointerdown",S),window.removeEventListener("keydown",S),window.removeEventListener("touchstart",S)};window.addEventListener("pointerdown",S),window.addEventListener("keydown",S),window.addEventListener("touchstart",S);function C(){let y=performance.now(),A=0,R=0,N=0;const v=b=>{requestAnimationFrame(v);const F=Math.min((b-y)/1e3,.1);if(y=b,s){t.renderStill();return}t.update(F),A+=F,A>.2&&(A=0,e.setBoosts(t.getBoosts()),e.setMatch(t.getMatchInfo())),e.setStorm(t.playerInStorm&&t.playing),N+=F,N>.12&&t.playing&&(N=0,e.drawMinimap(t)),R+=F,R>5&&(R=0,e.refreshBadges())};requestAnimationFrame(v)}}i_().catch(i=>{console.error("[BOOT] fatal",i);const t=document.getElementById("loaderTip");t&&(t.textContent="Error: "+(i&&i.message?i.message:i))});
