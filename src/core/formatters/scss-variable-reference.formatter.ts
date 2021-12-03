import { VAR_TOKEN_CLOSE, VAR_TOKEN_OPEN } from "../constants";
import { Formatter } from "./formatter.interface";
import { scssVariableNameFormatter } from "./scss-variable-name.formatter";

export const scssVariableReferenceFormatter: Formatter<string> = (value: string) : string => {
    
    let modifiedString = value;

    let openIdx = modifiedString.indexOf(VAR_TOKEN_OPEN); 

    while(openIdx > -1){

        let closeIdx = modifiedString.indexOf(VAR_TOKEN_CLOSE, openIdx);
        if(closeIdx > -1) {           

            const preVar = modifiedString.substr(0, openIdx);
            const postVar = modifiedString.substr(closeIdx + VAR_TOKEN_CLOSE.length);

            const varValue = modifiedString.substr(openIdx + VAR_TOKEN_OPEN.length, closeIdx - openIdx - 1);

            let styledVar = scssVariableNameFormatter(varValue);

            modifiedString = `${preVar}${styledVar}${postVar}`;
        }

        openIdx = modifiedString.indexOf(VAR_TOKEN_OPEN);
    }

    return modifiedString;
}