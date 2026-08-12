"use client";

import {useState} from "react";
import Image from "next/image";
import {getProject,supportFeatures} from "@/data/projects";

const supportNavCats:Record<string,string>={
  background:"/api/materials/supportNavBackground",
  positioning:"/api/materials/supportNavPositioning",
  content:"/api/materials/supportNavContent",
  ai:"/api/materials/supportNavAi",
  decision:"/api/materials/supportNavDecision",
  progress:"/api/materials/supportNavProgress",
};

const toDetailItems=(paragraphs:string[])=>paragraphs.flatMap((paragraph)=>
  paragraph.split(/(?<=。)(?=[^。｜]+｜)/).filter(Boolean)
);

function DetailItem({text}:{text:string}){
  const dividerIndex=text.indexOf("｜");

  if(dividerIndex===-1)return <>{text}</>;

  return <><strong className="font-semibold text-[#3f493f]">{text.slice(0,dividerIndex)}</strong><span aria-hidden="true">｜</span>{text.slice(dividerIndex+1)}</>;
}

export function SupportProjectSection(){
  const project=getProject("support");
  const [activeId,setActiveId]=useState(supportFeatures[0].id);
  const active=supportFeatures.find((item)=>item.id===activeId)??supportFeatures[0];
  return <section id="support" style={{backgroundImage:"url('/api/materials/supportSectionBackground')"}} className="border-t border-[#e4e6de] bg-[#f1f2eb] bg-cover bg-center bg-no-repeat px-4 pb-16 pt-[125px] sm:px-7 sm:pb-20 sm:pt-[125px] lg:px-10">
    <div className="relative mb-[100px] lg:pr-[290px]">
      <span className="eyebrow">PROJECT {project.number} · AI COMPANION</span>
      <h2 className="mt-6 max-w-4xl text-3xl font-semibold leading-[1.22] tracking-[-.04em] lg:whitespace-nowrap lg:text-[48px]">{project.title}</h2>
      <p className="mt-6 max-w-2xl text-sm leading-7 text-[#717971]">{project.description}</p>
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-[95px] left-0 h-[88px] w-[480px] max-w-full overflow-hidden sm:w-[720px]">
        <Image src="/api/materials/supportFrameTop" alt="" width={1536} height={1024} unoptimized className="absolute left-0 top-1/2 h-auto w-full -translate-y-[55%]" />
      </div>
      <div className="absolute -bottom-[100px] right-[40px] z-20 hidden h-[200px] w-[268px] overflow-hidden lg:block">
        <Image src="/api/materials/supportCat" alt="正在看书的接住猫" width={378} height={235} unoptimized className="absolute -left-[55px] -top-[15px] h-[235px] w-auto max-w-none" />
      </div>
    </div>
    <div className="relative z-10 overflow-hidden rounded-[16px] border border-[#dfe2d8] bg-white px-[30px] pb-[30px] pt-[52px]">
      <Image src="/api/materials/supportFrameBackground" alt="" fill sizes="100vw" unoptimized aria-hidden="true" className="pointer-events-none object-cover object-center" />
      <div className="relative z-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
        <span className="shrink-0 text-[10px] font-semibold tracking-[.12em] text-[#7b847b]">{active.number} · {active.label}</span>
        <h3 className="text-2xl font-semibold leading-tight tracking-[-.035em] sm:text-3xl">{active.title}</h3>
        <a href={project.demoUrl} target="_blank" rel="noreferrer" className="shrink-0 rounded-full bg-[#203b13] px-4 py-2 text-[10px] font-semibold text-white transition hover:bg-[#345527] sm:ml-auto">查看项目 ↗</a>
      </div>
      <div className="relative z-10 mt-11 grid gap-y-11 lg:grid-cols-[.75fr_1.25fr] lg:gap-x-12">
      <article className="support-copy-scroll flex max-h-[360px] min-h-[340px] flex-col overflow-y-auto pr-3 lg:min-h-0">
        <p className="max-w-lg text-base font-semibold leading-7 text-[#263129]">{active.conclusion}</p>
        <hr className="my-6 max-w-lg border-0 border-t border-[#e4e7df]" />
        <ul className="max-w-lg space-y-3.5 text-[15px] leading-[1.8] text-[#667066]">
          {toDetailItems(active.paragraphs).map((item)=><li key={item} className="flex items-start gap-3"><span aria-hidden="true" className="mt-[.72em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#9aa38f]" /><span><DetailItem text={item} /></span></li>)}
        </ul>
      </article>
      <div className="flex items-center justify-end">
        <div className="relative aspect-video w-full max-w-[900px] overflow-hidden rounded-[12px] border border-[#d9ddd2] bg-[#203b13] shadow-[0_12px_30px_rgba(32,59,19,.10)]">
          <video className="h-full w-full object-cover" controls playsInline preload="metadata" src="/api/materials/support-demo-video">你的浏览器暂不支持视频播放。</video>
        </div>
      </div>
      </div>
    </div>
    <nav aria-label="接住猫项目章节" className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{supportFeatures.map((item)=><button key={item.id} type="button" aria-pressed={activeId===item.id} onClick={()=>setActiveId(item.id)} className={`relative flex min-h-[96px] flex-col justify-between overflow-hidden rounded-[9px] border p-4 text-left transition ${activeId===item.id?"border-[#a9b480] bg-[#a9b480] text-[#203b13]":"border-[#e7e9e3] bg-[#fafbf8] hover:border-[#c5c9bc] hover:bg-[#f6f7f2]"}`}><span className="relative z-10 text-[10px] opacity-55">{item.number}</span><span aria-hidden="true" className={`pointer-events-none absolute left-[60%] h-[90px] w-[90px] -translate-x-1/2 -translate-y-1/2 ${item.id==="progress"?"top-1/2":"top-[54%]"}`}><Image src={supportNavCats[item.id]} alt="" fill sizes="90px" unoptimized className="object-contain" /></span><span className="relative z-10 flex items-end justify-between gap-2 text-xs font-semibold"><span>{item.label}</span><span aria-hidden="true">→</span></span></button>)}</nav>
  </section>;
}
