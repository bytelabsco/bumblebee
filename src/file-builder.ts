import fs from 'fs';
import path from 'path';
import { Namespacer } from "./core/utilities/namespacer";
import { cssVariableGroupDefinitionFormatter } from "./core/formatters/css-variable-group-defintion.formatter";
import { VariableTokenizer } from "./core/variable-tokenizer";
import { VariableGroupGenerator } from "./core/variable-group-generator";
import { UtilityVariableResolver } from "./core/utility-variable-resolver";
import { UtilityExpander } from "./core/utility-expander";
import { scssUtilityPlaceholderFormatter } from "./core/formatters/scss-utility-placeholder.formatter";
import { UtilityDefinition } from "./core/models/utility-definition";
import { scssUtilityByIncludeFormatter, ScssUtilityByIncludeFormatterOptions } from "./core/formatters/scss-utility-by-include.formatter";
import { NEW_LINE } from "./core/constants";
import { ThemeCollection, BreakpointCollection, VarEntry, NestedConfigCollection, UtilityEntry, NamespaceSettings } from './core/models';
import { collectionSize } from './core/utilities';
import { scssUtilityMixinsFormatter } from './core/formatters/scss-utility-mixins.formatter';

const sass = require('sass');

export class FileBuilder {

    private _themes: ThemeCollection | undefined;
    private _breakpoints: BreakpointCollection | undefined;
    private _variableTokens: Map<string, VarEntry>| undefined;
    private _utilities: NestedConfigCollection<UtilityEntry> | undefined;

    public withNamespace(namespace: NamespaceSettings) {

        if(!namespace){
            throw new Error('namespace must be provided');
        }

        Namespacer.SetNamespace(namespace);        
    }

    public withThemes(themes: ThemeCollection) {
        
        if(!themes){
            throw new Error('themes must be provided');
        }

        this._themes = themes;
    }

    public withBreakpoints(breakpoints: BreakpointCollection) {

        if(!breakpoints){
            throw new Error('breakpoints must be provided');
        }

        this._breakpoints = breakpoints;
    }

    public withVars(vars: NestedConfigCollection<VarEntry>): FileBuilder {

        if(!vars){
            throw new Error('vars must be provided');
        }

        this._variableTokens = VariableTokenizer.execute({vars: vars});

        return this;
    }

    public withUtilities(utilities: NestedConfigCollection<UtilityEntry>): FileBuilder {

        if(!utilities){
            throw new Error('utilities must be provided');
        }

        this._utilities = utilities;

        return this;
    }

    public build(filePath: string) {

        if(this._variableTokens && this._variableTokens.size > 0){
            this.outputVariableGroups(filePath);
        }

        if(this._utilities && collectionSize(this._utilities) > 0) {
            this.outputUtilities(filePath);
        }
    }

    private outputVariableGroups(filePath: string){

        let fileContent = '';

        if(this._variableTokens) {
            const variableGroups = VariableGroupGenerator.execute({varTokens: this._variableTokens, themes: this._themes});

            variableGroups.forEach(g => {
                fileContent += cssVariableGroupDefinitionFormatter(g);
            })

            this.writeFile(filePath, 'variables.css', fileContent);
        }
    }

    private outputUtilities(filePath: string) {
        let utilities = this._utilities;

        if(utilities) {

            if(this._variableTokens) {
                utilities = UtilityVariableResolver.execute({utilities: utilities, varTokens: this._variableTokens});
            }

            var utilityValues = UtilityExpander.execute({utilities: utilities});

            this.outputScssMixins(filePath, utilityValues);
            this.outputScssPlaceholders(filePath, utilityValues);
            this.outputScssUtilities(filePath, utilityValues);
            this.compileCssUtilities(filePath, 'utilities.scss', 'utilities.css');
        }        
    }

    private outputScssMixins(outputDirectory: string, utilityValues: Map<string, UtilityDefinition>) {

        const fileName = '_mixins.scss';
       
        const fileContent = scssUtilityMixinsFormatter(utilityValues);
        this.writeFile(outputDirectory, fileName, fileContent);
    }

    private outputScssPlaceholders(outputDirectory: string, utilityValues: Map<string, UtilityDefinition>){

        const fileName = '_placeholders.scss';

        let fileContent = `@use './mixins';${NEW_LINE + NEW_LINE}`;
        fileContent += scssUtilityPlaceholderFormatter({utilities: utilityValues, mixinNamespace: 'mixins'});
        this.writeFile(outputDirectory, fileName, fileContent);
    }

    private outputScssUtilities(outputDirectory: string, utilityValues: Map<string, UtilityDefinition>) {

        const fileName = 'utilities.scss';

        let fileContent = `@use './mixins';${NEW_LINE + NEW_LINE }`;
        fileContent += `@import './variables';${NEW_LINE + NEW_LINE}`;
        
        const utilityOptions: ScssUtilityByIncludeFormatterOptions = {
            utilities: utilityValues,
            breakpoints: this._breakpoints,
            mixinNamespace: 'mixins'
        };

        fileContent += scssUtilityByIncludeFormatter(utilityOptions);

        this.writeFile(outputDirectory, fileName, fileContent);
    }

    private compileCssUtilities(outputDirectory: string, scssFilename: string, cssFilename: string) {

        const scssFile = path.join(outputDirectory, scssFilename);

        const result = sass.renderSync({
            file: scssFile
        });        

        this.writeFile(outputDirectory, cssFilename, result.css.toString());
    }

    private writeFile(filePath: string, fileName: string, content: string) {

        if(!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true});
        }
        
        var completePath = path.join(filePath, fileName);

        fs.closeSync(fs.openSync(completePath, 'w'));

        fs.writeFileSync(completePath, content);
    }
}