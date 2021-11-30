
import { contentWrapper, ThemeCollection, ValueEntry, VarEntry } from "./models";
import { VariableGroup } from "./models/variable-group";
import { collectionSize } from "./utilities";

export interface VariableGroupGeneratorOptions{
    varTokens: Map<string, VarEntry>;
    themes?: ThemeCollection;
}

export class VariableGroupGenerator {
   
    private _defaultThemeWrapper: contentWrapper = (c:string) => `:root{ ${c} }`;

    public static execute(options: VariableGroupGeneratorOptions): VariableGroup[] {
        return new VariableGroupGenerator().execute(options);
    }

    public execute(options: VariableGroupGeneratorOptions): VariableGroup[]{

        if(!options){
            throw new Error('options must be provided');
        }

        if(!options.varTokens){
            throw new Error('options.varTokens must be provided');
        }

        const cssVariables: VariableGroup[] = [];

        // create default :root
        cssVariables.push({
            wrapper: this._defaultThemeWrapper,
            definitions: this.extractValues(options.varTokens)
        })

        if(options.themes && collectionSize(options.themes) > 0) {

            for(const themeName of Object.keys(options.themes)){

                const themeDef = options.themes[themeName];

                var definitions = this.extractValues(options.varTokens, themeName);

                let themeWrappers: contentWrapper[];

                if(Array.isArray(themeDef)) {
                    themeWrappers = themeDef;
                } else {
                    themeWrappers = [themeDef];                   
                }

                for(const themeWrapper of themeWrappers) {
                    cssVariables.push({
                        wrapper: themeWrapper,
                        definitions: definitions
                    });
                }
            }
        }

        return cssVariables;
    }

    private extractValues(varTokens: Map<string, VarEntry>, themeName?: string): Map<string, ValueEntry> {

        const values: Map<string, ValueEntry> = new Map<string, ValueEntry>();

        for(const [key, varEntry] of varTokens){

            const valueEntry: ValueEntry = { value: varEntry.value };

            if(!!themeName && varEntry.themes && Object.keys(varEntry.themes).indexOf(themeName) > -1){
                valueEntry.value = varEntry.themes[themeName].value;
            }

            values.set(key, valueEntry);
        }

        return values;
    }
}