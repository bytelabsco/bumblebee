import { NEW_LINE, TAB } from "../constants";
import { UtilityDefinition } from "../models/utility-definition";
import { Namespacer } from "../utilities/namespacer";
import { cssVariableReferenceFormatter } from "./css-variable-reference.formatter";
import { Formatter } from "./formatter.interface";
import { tokenToStyleSeparatorFormatter } from "./token-to-style-separator.formatter";

export interface ScssUtilityPlaceholderFormatterOptions {
    utilities: Map<string, UtilityDefinition>;
    mixinNamespace?: string;
};

export const scssUtilityPlaceholderFormatter: Formatter<ScssUtilityPlaceholderFormatterOptions> = (options: ScssUtilityPlaceholderFormatterOptions) : string => {       

    let scssUtilities = '';

    let mixinNamespace = options.mixinNamespace || '';
    if(mixinNamespace.length > 0 && !mixinNamespace.endsWith('.')){
        mixinNamespace += '.';
    }

    for(const [name, def] of options.utilities) {

        const namespacedClassName = Namespacer.Instance.forClass(name);
        const formattedName = tokenToStyleSeparatorFormatter(namespacedClassName);
        const formattedValue = typeof(def.value) === 'string' ? cssVariableReferenceFormatter(def.value) : def.value;

        scssUtilities += 
`%${formattedName} {
    @include ${mixinNamespace}${formattedName};
}

`;
    }

    return scssUtilities;
}