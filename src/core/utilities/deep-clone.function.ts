import { ConfigCollection, UtilityEntry, ValueEntry } from "../models/";

export function deepCloneUtilityEntry(utilityEntry: UtilityEntry): UtilityEntry {

    if(!utilityEntry){
        throw new Error('utilityEntry must be provided');
    }

    if(typeof(utilityEntry.use) === 'string' || Array.isArray(utilityEntry.use)) {
        throw new Error('variable usage must be resolved before cloning utility entry');
    }

    const clone: UtilityEntry = {
        output: utilityEntry.output,
        property: utilityEntry.property,
        use: deepCloneValueEntryCollection(utilityEntry.use)
    }

    return clone;
}

export function deepCloneValueEntryCollection(collection: ConfigCollection<ValueEntry>): ConfigCollection<ValueEntry> {

    if(!collection){
        throw new Error('collection must be provided');
    }

    const clonedCollection: ConfigCollection<ValueEntry> = {};

    for(const key of Object.keys(collection)){
        clonedCollection[key] = deepCloneValueEntry(collection[key]);
    }

    return clonedCollection;
}

export function deepCloneValueEntry(valueEntry: ValueEntry): ValueEntry {

    if(!valueEntry){
        throw new Error('valueEntry must be provided');
    }

    var clone: ValueEntry = { value: valueEntry.value }
    return clone;
}

