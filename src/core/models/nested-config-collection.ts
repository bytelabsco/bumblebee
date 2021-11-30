export interface NestedConfigCollection<T> {
    [name: string]: T | NestedConfigCollection<T>;
}