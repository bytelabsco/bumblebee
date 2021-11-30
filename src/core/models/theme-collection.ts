import { contentWrapper } from "./content-wrapper.type";

export interface ThemeCollection {
    [name: string] : contentWrapper | contentWrapper[];
}