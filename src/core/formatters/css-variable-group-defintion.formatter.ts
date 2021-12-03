import { cssVariableReferenceFormatter } from ".";
import { NEW_LINE, TAB } from "../constants";
import { VariableGroup } from "../models/variable-group";
import { cssVariableNameFormatter } from "./css-variable-name.formatter";
import { Formatter } from "./formatter.interface";

export const cssVariableGroupDefinitionFormatter: Formatter<VariableGroup> = (group: VariableGroup) : string => {       

    let cssVariables = `${NEW_LINE}`;

    for(const [key, definition] of group.definitions) {
        const cssVariableName = cssVariableNameFormatter(key);

        const value = typeof(definition.value) === 'string' ? cssVariableReferenceFormatter(definition.value) : definition.value;

        cssVariables += `${TAB}${cssVariableName}: ${value};${NEW_LINE}`;
    }

    const wrapped = group.wrapper(cssVariables);

    return `${NEW_LINE}${wrapped}${NEW_LINE}`;
}