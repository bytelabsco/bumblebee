import { ConfigCollection } from "./config-collection";
import { ValueEntry } from "./value-entry";

export interface UtilityEntry {
    use: ConfigCollection<ValueEntry> | string | string[];
    output: 'standard' | 'responsive';
    property: string;
}