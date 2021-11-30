import { Namespacer } from "../utilities/namespacer";
import { Formatter } from "./formatter.interface";
import { tokenToStyleSeparatorFormatter } from "./token-to-style-separator.formatter";

export const cssVariableNameFormatter: Formatter<string> = (varName: string) : string => {       

    const namespacedVarName = Namespacer.Instance.forVar(varName);
    const styledKey = tokenToStyleSeparatorFormatter(namespacedVarName);

    return `--${styledKey}`
}