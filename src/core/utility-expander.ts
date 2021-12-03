
import { TOKEN_SEPARATOR } from "./constants";
import { NestedConfigCollection, UtilityEntry } from "./models";
import { UtilityDefinition } from "./models/utility-definition";
import { isUtilityEntry } from "./utilities";

export interface UtilityExpanderOptions {
    utilities: NestedConfigCollection<UtilityEntry>
};

export class UtilityExpander {

    public static execute(options: UtilityExpanderOptions) : Map<string, UtilityDefinition> {
        return new UtilityExpander().execute(options);
    }

    public execute(options: UtilityExpanderOptions) : Map<string, UtilityDefinition> {

        if(!options){
            throw new Error('options must be provided');
        }

        if(!options.utilities){
            throw new Error('options.utilities must be provided');
        }

        return this.expandUtilities(options.utilities);
    }

    private expandUtilities(utilities: NestedConfigCollection<UtilityEntry>, prefix?: string): Map<string, UtilityDefinition> {

        const utilityDefinitions: Map<string, UtilityDefinition> = new Map<string, UtilityDefinition>();

        if(!!prefix && !prefix.endsWith(TOKEN_SEPARATOR)) {
            prefix = prefix + TOKEN_SEPARATOR;
        } else {
            prefix = '';
        }

        for(const utilityName in utilities){
            const utilityValue = utilities[utilityName];

            const utilityPrefix = `${prefix}${utilityName}`

            if(isUtilityEntry(utilityValue)) {
                
                if(typeof(utilityValue.use) === 'string' || Array.isArray(utilityValue.use)){
                    throw new Error('variables must be resolved before utility generation');
                } else {

                    for(const entryName in utilityValue.use){
                        const entryValue = utilityValue.use[entryName];

                        const className = `${utilityPrefix}${TOKEN_SEPARATOR}${entryName}`;

                        const def: UtilityDefinition = {
                            property: utilityValue.property,
                            value: entryValue.value,
                            isResponsive: utilityValue.output === 'responsive'
                        };

                        utilityDefinitions.set(className, def);
                    }
                }

            } else {
                const nestedDefintions = this.expandUtilities(utilityValue, utilityPrefix)
                nestedDefintions.forEach((v, k) => utilityDefinitions.set(k, v));
            }
        }

        return utilityDefinitions;
    }
}