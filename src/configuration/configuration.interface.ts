import { BreakpointCollection, NamespaceSettings, NestedConfigCollection, ThemeCollection, UtilityEntry, VarEntry } from "../core/models";

export interface Configuration {
    outputPath: string;
    vars?: NestedConfigCollection<VarEntry>;
    breakpoints?: BreakpointCollection;
    themes?: ThemeCollection;
    namespace?: NamespaceSettings;
    utilities: NestedConfigCollection<UtilityEntry>;
}
