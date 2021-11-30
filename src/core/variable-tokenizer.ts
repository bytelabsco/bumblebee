
import { TOKEN_SEPARATOR } from "./constants";
import { NestedConfigCollection, VarEntry } from "./models";
import { isVarEntry } from "./utilities";

export interface VariableTokenizerOptions {
    vars: NestedConfigCollection<VarEntry>
}

export class VariableTokenizer {

    public static execute(options: VariableTokenizerOptions): Map<string, VarEntry> {
        return new VariableTokenizer().execute(options);
    }

    public execute(options: VariableTokenizerOptions):  Map<string, VarEntry> {

        if(!options){
            throw new Error('options must be provided');
        }

        if(!options.vars){
            throw new Error('options.vars must be provided');
        }

        return this.generateTokens(options.vars);
    }

    private generateTokens(vars: {[name: string]: VarEntry | NestedConfigCollection<VarEntry>}, prefix?: string):  Map<string, VarEntry> {

        const tokenDefintions: Map<string, VarEntry> = new Map<string, VarEntry>();

        if(!!prefix && !prefix.endsWith(TOKEN_SEPARATOR)) {
            prefix = prefix + TOKEN_SEPARATOR;
        } else {
            prefix = '';
        }

        for(const varName in vars){
            const varValue = vars[varName];

            const varPrefix = `${prefix}${varName}`;

            if(isVarEntry(varValue)){ 
                tokenDefintions.set(varPrefix, varValue);
            } else {
                var nestedTokens = this.generateTokens(varValue, varPrefix);
                nestedTokens.forEach((v, k) => tokenDefintions.set(k, v));
            }
        }

        return tokenDefintions;
    }
}