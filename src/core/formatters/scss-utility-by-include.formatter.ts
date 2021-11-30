import { NEW_LINE } from "../constants";
import { BreakpointCollection, contentWrapper } from "../models";
import { UtilityDefinition } from "../models/utility-definition";
import { Namespacer } from "../utilities/namespacer";
import { Formatter } from "./formatter.interface";
import { tokenToStyleSeparatorFormatter } from "./token-to-style-separator.formatter";

export interface ScssUtilityByIncludeFormatterOptions {
    utilities: Map<string, UtilityDefinition>,
    breakpoints?: BreakpointCollection,
    mixinNamespace?: string
}

export const scssUtilityByIncludeFormatter: Formatter<ScssUtilityByIncludeFormatterOptions> = (options: ScssUtilityByIncludeFormatterOptions) : string => {       

    let scssUtilities = generateExtendedClasses(options.utilities, undefined, options.mixinNamespace);

    if(!!options.breakpoints) {

        const responsiveUtilities = new Map([...options.utilities].filter(([k, v]) => v.isResponsive === true ));

        for(const breakpoint of Object.keys(options.breakpoints)) {

            const breakpointValue = options.breakpoints[breakpoint];

            const breakpointWrapper: contentWrapper = (c) => `@media ${breakpointValue} { ${NEW_LINE}${c}${NEW_LINE}}`;

            scssUtilities += generateExtendedClasses(responsiveUtilities, {wrapper: breakpointWrapper, prefix: breakpoint}, options.mixinNamespace);
        }
    }


    return scssUtilities;

}

const generateExtendedClasses = (utilities: Map<string, UtilityDefinition>, responsiveOptions?: { wrapper: contentWrapper, prefix: string}, mixinNamespace?: string): string => {

    let scssUtilities = '';

    const prefix = !!responsiveOptions ? `.${responsiveOptions.prefix}\\:` : '.';

    mixinNamespace = mixinNamespace || '';
    if(mixinNamespace.length > 0 && !mixinNamespace.endsWith('.')){
        mixinNamespace += '.';
    }

    for(const [name, def] of utilities) {

        const namespacedClassName = Namespacer.Instance.forClass(name);
        const formattedName = tokenToStyleSeparatorFormatter(namespacedClassName);
        scssUtilities += 
`${prefix}${formattedName} {
    @include ${mixinNamespace}${formattedName};
}

`
    }

    if(!!responsiveOptions) {
        scssUtilities = responsiveOptions.wrapper(scssUtilities);
    }

    return scssUtilities;
}