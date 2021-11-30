import { contentWrapper } from "./content-wrapper.type";
import { ValueEntry } from "./value-entry";

export interface VariableGroup {
    wrapper: contentWrapper;
    definitions: Map<string, ValueEntry>;
}