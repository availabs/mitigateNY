import React, {useMemo} from "react";
import {fnumIndex} from "~/utils/macros.jsx";

const blockClass = `w-full h-[90px] bg-white p-5 text-center flex flex-col`,
    blockLabelClass = `border-b-2`,
    blockValueClass = `font-medium text-xl pt-2`

export const RenderDisasterLossStats = ({ totalLoss, ihpLoss, paLoss, sbaLoss, nfipLoss, usdaLoss }) => {
   return (
       <div className={"w-full grid grid-cols-6 gap-4 place-content-stretch mt-5"}>
           <div className={blockClass}>
               <label className={blockLabelClass}>Total Loss</label>
               <span className={blockValueClass}>{
                   fnumIndex(totalLoss, 2, true)
               }</span>
           </div>
           <div className={blockClass}>
               <label className={blockLabelClass}>IHP Loss</label>
               <span className={blockValueClass}>{
                   fnumIndex(ihpLoss, 2, true)
               }</span>
           </div>
           <div className={blockClass}>
               <label className={blockLabelClass}>PA Loss</label>
               <span className={blockValueClass}>{
                   fnumIndex(paLoss, 2, true)
               }</span>
           </div>
           <div className={blockClass}>
               <label className={blockLabelClass}>SBA Loss</label>
               <span className={blockValueClass}>{
                   fnumIndex(sbaLoss, 2, true)
               }</span>
           </div>
           <div className={blockClass}>
               <label className={blockLabelClass}>NFIP Loss</label>
               <span className={blockValueClass}>{
                   fnumIndex(nfipLoss, 2, true)
               }</span>
           </div>
           <div className={blockClass}>
               <label className={blockLabelClass}>USDA Loss</label>
               <span className={blockValueClass}>{
                   fnumIndex(usdaLoss, 2, true)
               }</span>
           </div>
       </div>
   )
};