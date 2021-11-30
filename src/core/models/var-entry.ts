import { ValueEntry } from "./value-entry";

export interface VarEntry extends ValueEntry {
    themes?: {[themeName: string]: ValueEntry};
};