import { NestedConfigCollection, UtilityEntry } from "../models";

export function isUtilityEntry(obj: UtilityEntry | NestedConfigCollection<UtilityEntry>): obj is UtilityEntry {
    const entryObj = obj as UtilityEntry;
    return entryObj.use !== undefined && entryObj.output !== undefined && entryObj.property !== undefined;
}