import { NestedConfigCollection, UtilityEntry } from '../core/models';
import { UtilityExpander, UtilityExpanderOptions } from './utility-expander';

test('should compute flat utilities', () => {

    const flatUtilities: UtilityExpanderOptions =
    { 
        utilities: {
            'color': {
                use: {
                    'light': {value: '#fff'},
                    'dark': {value: '#000'}
                },
                output: 'standard',
                property: 'color'
            }
        }
    }
    
    const utilityDefinitions = UtilityExpander.execute(flatUtilities);

    expect(utilityDefinitions.size).toBe(2);

    const lightDef = utilityDefinitions.get('color.light')!;
    expect(lightDef).toBeDefined();
    expect(lightDef.property).toEqual('color');
    expect(lightDef.value).toEqual('#fff');
    expect(lightDef.isResponsive).toBe(false);

    const darkDef = utilityDefinitions.get('color.dark')!;
    expect(darkDef).toBeDefined();
    expect(darkDef.property).toEqual('color');
    expect(darkDef.value).toEqual('#000');
    expect(darkDef.isResponsive).toBe(false);
});

test ('should compute nested utilities', () => {

    const nestedUtilitiesOptions: UtilityExpanderOptions = {
        utilities: {
            'theme': {           
                'color': {
                    use: {
                        'light': {value: '#fff'},
                        'dark': {value: '#000'}
                    },
                    output: 'standard',
                    property: 'color'
                }
            }
        }
    };

    const utilityDefinitions = UtilityExpander.execute(nestedUtilitiesOptions);

    expect(utilityDefinitions.size).toBe(2);

    const lightDef = utilityDefinitions.get('theme.color.light')!;
    expect(lightDef).toBeDefined();
    expect(lightDef.property).toEqual('color');
    expect(lightDef.value).toEqual('#fff');
    expect(lightDef.isResponsive).toBe(false);

    const darkDef = utilityDefinitions.get('theme.color.dark')!;
    expect(darkDef).toBeDefined();
    expect(darkDef.property).toEqual('color');
    expect(darkDef.value).toEqual('#000');
    expect(darkDef.isResponsive).toBe(false);
});

test('should flag utilities for responsiveness', () => {

    const responsiveUtilities: UtilityExpanderOptions =
    { 
        utilities: {
            'color': {
                use: {
                    'light': {value: '#fff'},
                    'dark': {value: '#000'}
                },
                output: 'responsive',
                property: 'color'
            },
        }
    }
    
    const utilityDefinitions = UtilityExpander.execute(responsiveUtilities);

    expect(utilityDefinitions.size).toBe(2);

    const lightDef = utilityDefinitions.get('color.light')!;
    expect(lightDef).toBeDefined();
    expect(lightDef.property).toEqual('color');
    expect(lightDef.value).toEqual('#fff');
    expect(lightDef.isResponsive).toBe(true);

    const darkDef = utilityDefinitions.get('color.dark')!;
    expect(darkDef).toBeDefined();
    expect(darkDef.property).toEqual('color');
    expect(darkDef.value).toEqual('#000');
    expect(darkDef.isResponsive).toBe(true);
});

test ('should throw error if utilities reference unresolved variables', () => {

    const flatUtilities: UtilityExpanderOptions =
    { 
        utilities: {
            'color': {
                use: 'someVariable',
                output: 'standard',
                property: 'color'
            }
        }
    }

    expect(() =>  UtilityExpander.execute(flatUtilities)).toThrowError();
});

test('should throw error with null options', () => {
    const badOptions = null as unknown as UtilityExpanderOptions;
    expect(() =>  UtilityExpander.execute(badOptions)).toThrowError();
});

test('should throw with null utilities', () => {
    const badOptions: UtilityExpanderOptions = {
        utilities: null as unknown as NestedConfigCollection<UtilityEntry>
    };

    expect(() => UtilityExpander.execute(badOptions)).toThrowError();
});
