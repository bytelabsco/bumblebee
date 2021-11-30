import { NestedConfigCollection, VarEntry } from "../models";

export function isVarEntry(obj: VarEntry | NestedConfigCollection<VarEntry>): obj is VarEntry {
    const entryObj = obj as VarEntry;
    return entryObj.value !== undefined;
}