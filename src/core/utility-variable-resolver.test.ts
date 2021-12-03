import { NestedConfigCollection, UtilityEntry, ValueEntry, VarEntry } from './models';
import { isUtilityEntry } from './utilities';
import {UtilityVariableResolver, UtilityVariableResolverOptions } from './utility-variable-resolver';

test('should resolve variables', () => {

    const options: UtilityVariableResolverOptions = {
        varTokens: new Map<string, VarEntry>([
            ['colors.light', {value: '#fff'}],
            ['colors.dark', {value: '#000'}]
        ]),
        utilities: {
            color: {
                use: 'colors',
                output: 'standard',
                property: 'color'
            }
        }
    };

    const resolvedUtilties = UtilityVariableResolver.execute(options);

    const colorDef: UtilityEntry | NestedConfigCollection<UtilityEntry> = resolvedUtilties['color'];
    expect(colorDef).toBeDefined();

    if(!isUtilityEntry(colorDef)) {
        fail('colorDef should be a UtilityEntry');
    }

    if(typeof(colorDef.use) === 'string' || Array.isArray(colorDef.use)){
        fail('colorDef.use should be a Collection<ValueEntry>');
    }

    const colorLightDef = colorDef.use['light'];

    expect(colorLightDef).toBeDefined();
    expect(colorLightDef.value).toBe('{colors.light}');

    const colorDarkDef = colorDef.use['dark'] as ValueEntry;
    expect(colorDarkDef).toBeDefined();
    expect(colorDarkDef.value).toBe('{colors.dark}');
});

test('should throw error with null options', () => {
    var options: UtilityVariableResolverOptions = null as unknown as UtilityVariableResolverOptions;
    expect(() => UtilityVariableResolver.execute(options)).toThrowError();
});

test('should throw error with null options.utilities', () => {

    var options: UtilityVariableResolverOptions = {
        utilities: null as unknown as NestedConfigCollection<UtilityEntry>,
        varTokens: null as unknown as Map<string, VarEntry>
    };

    expect(() => UtilityVariableResolver.execute(options)).toThrowError();
});

test('should throw error with null options.varTokens', () => {
    
    var options: UtilityVariableResolverOptions = {
        utilities: {} as unknown as NestedConfigCollection<UtilityEntry>,
        varTokens: null as unknown as Map<string, VarEntry>
    };

    expect(() => UtilityVariableResolver.execute(options)).toThrowError();
});

test('should throw error with no matching vars', () => {
    
    const options: UtilityVariableResolverOptions = {
        varTokens: new Map<string, VarEntry>([
            ['colors.light', {value: '#fff'}],
            ['colors.dark', {value: '#000'}]
        ]),
        utilities: {
            color: {
                use: 'colorz',
                output: 'standard',
                property: 'color'
            }
        }
    };

    expect(() => UtilityVariableResolver.execute(options)).toThrowError();
});