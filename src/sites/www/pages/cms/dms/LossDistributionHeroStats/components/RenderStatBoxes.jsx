import { fnum } from "~/utils/macros.jsx";
import React from "react";
import get from "lodash/get";

export const RenderStatBoxes = ({ total, numDeclaredEvents, numNonDeclaredEvents }) => {
    const blockClass = `w-full bg-slate-100 p-5 text-center flex flex-col`,
        blockLabelClass = `border-b-2`,
        blockValueClass = `font-medium text-xl pt-2`;
    return (
        <div className={"w-full my-1 grid grid-cols-1 md:grid-cols-2 gap-10 place-content-stretch content-center "}>
            <div className={blockClass}>
                <label className={`${ blockLabelClass } border-blue-300`}>
                    # Declared Disasters
                </label>
                <span className={blockValueClass}>
            {fnum(numDeclaredEvents)}
          </span>
            </div>

            <div className={blockClass}>
                <label className={`${ blockLabelClass } border-blue-300`}>
                    Declared Loss
                </label>
                <span className={blockValueClass}>
            {fnum(get(total, [0, "ofd_ttd"], 0), true)}
          </span>
            </div>

            <div className={blockClass}>
                <label className={`${ blockLabelClass } border-red-300`}>
                    # Non-declared Disasters
                </label>
                <span className={blockValueClass}>
            {fnum(numNonDeclaredEvents)}
          </span>
            </div>

            <div className={blockClass}>
                <label className={`${ blockLabelClass } border-red-300`}>
                    Non-declared Loss
                </label>
                <span className={blockValueClass}>
              {fnum(get(total, [0, "swd_ttd"], 0), true)}
          </span>
            </div>

        </div>
    );
};