
import { TOKEN_SEPARATOR, VAR_TOKEN_CLOSE, VAR_TOKEN_OPEN } from "./constants";
import { ConfigCollection, NestedConfigCollection, UtilityEntry, ValueEntry, VarEntry } from "./models";
import { isUtilityEntry } from "./utilities";
import { deepCloneUtilityEntry } from "./utilities/deep-clone.function";

export interface UtilityVariableResolverOptions {
    utilities: NestedConfigCollection<UtilityEntry>;
    varTokens: Map<string, VarEntry>;
}

export class UtilityVariableResolver {

    public static execute(options: UtilityVariableResolverOptions): NestedConfigCollection<UtilityEntry> {
        return new UtilityVariableResolver().execute(options);
    }

    public execute(options: UtilityVariableResolverOptions): NestedConfigCollection<UtilityEntry> {

        if(!options) {
            throw new Error('options must be provided');
        }

        if(!options.utilities){
            throw new Error('utilities must be provided with options');
        }

        if(!options.varTokens){
            throw new Error('varTokens must be provided with options');
        }

        return this.resolveVariables(options.utilities, options.varTokens)
    }

    private resolveVariables(utilities: NestedConfigCollection<UtilityEntry>, varTokens: Map<string, VarEntry>): NestedConfigCollection<UtilityEntry> {

        const resolvedUtilities: NestedConfigCollection<UtilityEntry> = {};

        for(const utilityName in utilities){
            const utilityValue = utilities[utilityName];           
            
            let clonedUtilityEntry: UtilityEntry;

            if(isUtilityEntry(utilityValue)){

                if(typeof(utilityValue.use) === 'string' || Array.isArray(utilityValue.use)) {

                    if(typeof(utilityValue.use) === 'string') {
                        utilityValue.use = [utilityValue.use];
                    }

                    const resolvedUses: ConfigCollection<ValueEntry> = {};

                    for(let useVar of utilityValue.use){

                        let varNamePrefix = useVar;
                        if(!varNamePrefix.endsWith(TOKEN_SEPARATOR)) {
                            varNamePrefix = varNamePrefix + TOKEN_SEPARATOR;
                        }
    
                        const matchedTokenKeys = [...varTokens.keys()].filter(k => k.startsWith(varNamePrefix));
                        if(matchedTokenKeys.length === 0){
                            throw new Error(`No variables match prefix ${utilityValue.use}`);
                        }
    
                        for(const key of matchedTokenKeys){
                            const formattedName = key.substring(key.indexOf(varNamePrefix) + varNamePrefix.length);
                            resolvedUses[formattedName] = { value: `${VAR_TOKEN_OPEN}${key}${VAR_TOKEN_CLOSE}`};
                        }
                    }

                    clonedUtilityEntry = {
                        output: utilityValue.output,
                        property: utilityValue.property,
                        use: resolvedUses
                    };


                } else {
                    clonedUtilityEntry = deepCloneUtilityEntry(utilityValue);
                }

                resolvedUtilities[utilityName] = clonedUtilityEntry;

            } else {
                const nestedResolvedUtilities = this.resolveVariables(utilityValue, varTokens);
                resolvedUtilities[utilityName] = nestedResolvedUtilities;
            }
        }

        return resolvedUtilities;
    }

}