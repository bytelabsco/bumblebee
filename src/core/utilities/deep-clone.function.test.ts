import { ConfigCollection, UtilityEntry, ValueEntry } from '../models';
import { collectionSize } from './collection-size.function';
import { deepCloneUtilityEntry, deepCloneValueEntry, deepCloneValueEntryCollection } from "./deep-clone.function";

test('should clone utility entry', () => {

    const original: UtilityEntry = {
        use: {
            'light': { value: '#fff'}
        },
        output: 'standard',
        property: 'color'
    }

    const clone = deepCloneUtilityEntry(original);

    expect(clone).not.toBe(original);

    expect(clone.output).toBe(original.output);
    expect(clone.property).toBe(original.property);

    if(typeof(clone.use) === 'string' || typeof(original.use) === 'string') {
        fail('use of objects should not be a string');
    }

    if(Array.isArray(clone.use) || Array.isArray(original.use)) {
        fail('use of objects should not be a string array');
    }

    expect(clone.use).not.toBe(original.use);
    expect(doCollectionsMatch(original.use, clone.use)).toBe(true);
});

test('should throw error if source utility entry use is variable reference', () => {
    const original: UtilityEntry = {
        use: 'colors',
        output: 'standard',
        property: 'color'
    }

    expect(() => deepCloneUtilityEntry(original)).toThrowError();
});

test('should throw error if source utility entry is null', () => {
    const original: UtilityEntry = null as unknown as UtilityEntry;

    expect(() => deepCloneUtilityEntry(original)).toThrowError();
});

test('should clone value entry collection', () => {

    const original: ConfigCollection<ValueEntry> = {
        'light': {value: '#fff' },
        'dark': {value: '#000'}
    };

    const clone = deepCloneValueEntryCollection(original);

    expect(clone).not.toBe(original);
    expect(doCollectionsMatch(original, clone)).toBe(true);
});

test('should throw error if source value entry collection is null', () => {
    const original: ConfigCollection<ValueEntry> = null as unknown as ConfigCollection<ValueEntry>;

    expect(() => deepCloneValueEntryCollection(original)).toThrowError();
});

test('should clone value entry', () => {

    const original: ValueEntry = { value: '#fff'};

    const clone = deepCloneValueEntry(original);

    expect(clone).not.toBe(original);
    expect(clone.value).toBe(original.value);
});

test('should throw error if source value entry is null', () => {
    const original: ValueEntry = null as unknown as ValueEntry;

    expect(() => deepCloneValueEntry(original)).toThrowError();
});


const doCollectionsMatch = (col1: ConfigCollection<ValueEntry>, col2: ConfigCollection<ValueEntry>): boolean => {

    if(collectionSize(col1) !== collectionSize(col2)){
        return false;
    }

    for(const key of Object.keys(col1)) {

        const entry1 = col1[key];
        const entry2 = col2[key];

        if(entry1.value !== entry2.value){
            return false;
        }
    }

    return true;
}