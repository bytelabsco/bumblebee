import { Namespacer } from "../utilities/namespacer";
import { Formatter } from "./formatter.interface";
import { tokenToStyleSeparatorFormatter } from "./token-to-style-separator.formatter";

export const scssVariableNameFormatter: Formatter<string> = (varName: string) : string => {       

    const namespacedVarName = Namespacer.Instance.forVar(varName);
    const styledKey = tokenToStyleSeparatorFormatter(namespacedVarName);

    return `$${styledKey}`
}