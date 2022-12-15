import {
  FormCustomizerContext
  } from '@microsoft/sp-listview-extensibility';

import { spfi, SPFI, SPFx } from "@pnp/sp";
import { LogLevel, PnPLogging } from "@pnp/logging";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

let _sp: SPFI = null;

export const getSP = (context?: FormCustomizerContext): SPFI => {
  if (_sp === null && context !== null) {
    _sp = spfi().using(SPFx(context)).using(PnPLogging(LogLevel.Warning));
  }
  
  return _sp;
};