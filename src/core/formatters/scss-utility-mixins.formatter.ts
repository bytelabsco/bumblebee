import { UtilityDefinition } from "../models/utility-definition";
import { Namespacer } from "../utilities/namespacer";
import { cssVariableReferenceFormatter } from "./css-variable-reference.formatter";
import { Formatter } from "./formatter.interface";
import { tokenToStyleSeparatorFormatter } from "./token-to-style-separator.formatter";

export const scssUtilityMixinsFormatter: Formatter<Map<string, UtilityDefinition>> = (utilities: Map<string, UtilityDefinition>) : string => {       

    let scssUtilities = '';

    for(const [name, def] of utilities) {

        const namespacedClassName = Namespacer.Instance.forClass(name);
        const formattedName = tokenToStyleSeparatorFormatter(namespacedClassName);
        const formattedValue = typeof(def.value) === 'string' ? cssVariableReferenceFormatter(def.value) : def.value;

        scssUtilities += 
`@mixin ${formattedName} {
    ${def.property}: ${formattedValue};
}

`;
    }

    return scssUtilities;
}