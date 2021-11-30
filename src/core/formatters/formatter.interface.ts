import { Namespacer } from "../utilities/namespacer";

export interface Formatter<T> {
    (value: T): string;
}