import { NEW_LINE, TAB } from "../constants";
import { NestedConfigCollection, VarEntry } from "../models";
import { isVarEntry } from "../utilities";
import { Formatter } from "./formatter.interface";
import { scssVariableNameFormatter } from "./scss-variable-name.formatter";
import { scssMapVariableReferenceFormatter } from "./scss-map-variable-reference.formatter";

export const scssVariableMapFormatter: Formatter<NestedConfigCollection<VarEntry>> = (vars: NestedConfigCollection<VarEntry>) : string => {       

    let scssVariables = `@use "sass:map";${NEW_LINE + NEW_LINE}`;

    for(let key of Object.keys(vars)) {

        const varDef = vars[key];
        const scssVarName = scssVariableNameFormatter(key);

        if(isVarEntry(varDef)) {
            const value = (typeof(varDef.value) === 'string') ? scssMapVariableReferenceFormatter(varDef.value) : varDef.value;
            scssVariables += `${scssVarName}: ${value};${NEW_LINE + NEW_LINE}`;
        } else {
            const nested = processNestedCollection(varDef, 1);
            scssVariables += `${scssVarName}: (${nested});${NEW_LINE + NEW_LINE}`;
        }
    }

    return scssVariables;
}

const processNestedCollection = (vars: NestedConfigCollection<VarEntry>, level: number) : string => {

    let values = `${NEW_LINE}`;

    for(let key of Object.keys(vars)) {

        const varDef = vars[key];

        if(isVarEntry(varDef)) {
            const value = (typeof(varDef.value) === 'string') ? scssMapVariableReferenceFormatter(varDef.value) : varDef.value;
            values += `${tabs(level)}'${key}': ${value},${NEW_LINE}`;
        } else {
            const nested = processNestedCollection(varDef, level + 1);
            values += `${tabs(level)}'${key}': (`;
            values += nested;
            values += `${tabs(level)}),${NEW_LINE + NEW_LINE}`;
        }
    }

    return values;
}

const tabs = (num: number) : string => {

    let tabs = '';
    for(let i = 0; i < num; i++){
        tabs += TAB
    }
    return tabs;
}
