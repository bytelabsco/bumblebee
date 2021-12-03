import { VAR_TOKEN_CLOSE, VAR_TOKEN_OPEN } from "../constants";
import { Formatter } from "./formatter.interface";
import { scssVariableNameFormatter } from "./scss-variable-name.formatter";

export const scssMapVariableReferenceFormatter: Formatter<string> = (value: string) : string => {
    
    let modifiedString = value;

    let openIdx = modifiedString.indexOf(VAR_TOKEN_OPEN); 

    while(openIdx > -1){

        let closeIdx = modifiedString.indexOf(VAR_TOKEN_CLOSE, openIdx);
        if(closeIdx > -1) {           

            const preVar = modifiedString.substr(0, openIdx);
            const postVar = modifiedString.substr(closeIdx + VAR_TOKEN_CLOSE.length);

            const varValue = modifiedString.substr(openIdx + VAR_TOKEN_OPEN.length, closeIdx - openIdx - 1);

            let styledVar = scssFormat(varValue);

            modifiedString = `${preVar}${styledVar}${postVar}`;
        }

        openIdx = modifiedString.indexOf(VAR_TOKEN_OPEN);
    }

    return modifiedString;
}

const scssFormat = (varName: string) : string => {

    let splitVar = varName.split('.');

    if(splitVar.length < 2) {
        throw new Error(`{varName} can't be converted to sass var`);
    }

    var mapChain = `map.get(${scssVariableNameFormatter(splitVar[0])}, '${splitVar[1]}')`

    for(let i = 2; i < splitVar.length; i++){
        mapChain = `map.get(${mapChain}, '${splitVar[i]}')`;
    }

    return mapChain;
}