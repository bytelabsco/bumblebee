import { VAR_TOKEN_CLOSE, VAR_TOKEN_OPEN } from "../constants";
import { Namespacer } from "../utilities/namespacer";
import { cssVariableNameFormatter } from "./css-variable-name.formatter";
import { Formatter } from "./formatter.interface";
import { tokenToStyleSeparatorFormatter } from "./token-to-style-separator.formatter";

export const cssVariableReferenceFormatter: Formatter<string> = (value: string) : string => {
    
    let modifiedString = value;

    let openIdx = modifiedString.indexOf(VAR_TOKEN_OPEN); 

    while(openIdx > -1){

        let closeIdx = modifiedString.indexOf(VAR_TOKEN_CLOSE, openIdx);
        if(closeIdx > -1) {           

            const preVar = modifiedString.substr(0, openIdx);
            const postVar = modifiedString.substr(closeIdx + VAR_TOKEN_CLOSE.length);

            const varValue = modifiedString.substr(openIdx + VAR_TOKEN_OPEN.length, closeIdx - openIdx - 1);

            let styledVar = cssVariableNameFormatter(varValue);

            modifiedString = `${preVar}var(${styledVar})${postVar}`;
        }

        openIdx = modifiedString.indexOf(VAR_TOKEN_OPEN);
    }

    return modifiedString;

}