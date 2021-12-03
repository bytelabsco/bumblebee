import { NEW_LINE } from "../constants";
import { NestedConfigCollection, VarEntry } from "../models";
import { isVarEntry } from "../utilities";
import { Formatter } from "./formatter.interface";
import { scssVariableNameFormatter } from "./scss-variable-name.formatter";
import { scssVariableReferenceFormatter } from "./scss-variable-reference.formatter";

export const scssVariablesFormatter: Formatter<NestedConfigCollection<VarEntry>> = (vars: NestedConfigCollection<VarEntry>) : string => {       

    let scssVariables = `@use "sass:map";${NEW_LINE + NEW_LINE}`;

    scssVariables += processNestedCollection(vars);

    return scssVariables;
}

const processNestedCollection = (vars: NestedConfigCollection<VarEntry>, pre?: string) : string => {

    let values = ``;

    for(let key of Object.keys(vars)) {
        
        const varDef = vars[key];

        const varName = !!pre ? `${pre}.${key}` : key;

        if(isVarEntry(varDef)) {
            const value = (typeof(varDef.value) === 'string') ? scssVariableReferenceFormatter(varDef.value) : varDef.value;
            values += `${scssVariableNameFormatter(varName)}: ${value};${NEW_LINE}`;

            if(varDef.themes){
                for(let themeKey of Object.keys(varDef.themes)){
                    const themeValue = varDef.themes[themeKey];
                    const themeVarName = `${varName}.theme.${themeKey}`;

                    values += `${scssVariableNameFormatter(themeVarName)}: ${themeValue.value};${NEW_LINE}`;
                }
            }


        } else {
            const nested = processNestedCollection(varDef, varName);
            values += nested;
        }
    }

    return values;
}