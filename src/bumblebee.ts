import { Configuration } from "./configuration/configuration.interface";
import { FileBuilder } from "./file-builder";


export class Bumblebee {

    public static generate(config: Configuration) {
        new Bumblebee().generate(config);
    }

    public generate(config: Configuration) {

        let builder = new FileBuilder();

        if(!!config.namespace) {
            builder.withNamespace(config.namespace);
        }

        if(!!config.breakpoints){
            builder.withBreakpoints(config.breakpoints);
        }

        if(!!config.themes){
            builder.withThemes(config.themes);
        }

        if(!!config.vars) {
            builder.withVars(config.vars);
        }

        builder.build(config.utilities, config.outputPath);
    }
}