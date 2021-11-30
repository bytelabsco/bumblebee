import { ConfigCollection, NestedConfigCollection } from "../models";

export function collectionSize(collection: ConfigCollection<any> | NestedConfigCollection<any>): number {
    return Object.keys(collection).length;
}