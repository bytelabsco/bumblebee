import { NestedConfigCollection, VarEntry } from './models';
import { VariableTokenizer, VariableTokenizerOptions } from './variable-tokenizer';


test('should tokenize flat vars', () => {

    const flatVars: VariableTokenizerOptions = {
        vars: {
            color: { value: "#fff" }        
        }
    };
    
    const variableTokenDefinitions = VariableTokenizer.execute(flatVars);

    expect(variableTokenDefinitions.size).toBe(1);

    var colorDef = variableTokenDefinitions.get('color');
    expect(colorDef).toBeDefined();

    var colorDefValue = colorDef!.value;
    expect(colorDefValue).toBe('#fff');
});

test('should tokenize nested vars', () => {

    const nestedVars: VariableTokenizerOptions = {
        vars: {
            color: {
                light: { value: "#fff"},
                dark: { value: "#000"}
            }
        }
    };

    const variableTokenDefinitions = VariableTokenizer.execute(nestedVars);

    expect(variableTokenDefinitions.size).toBe(2);

    const colorLightDef = variableTokenDefinitions.get('color.light');
    expect(colorLightDef).toBeDefined();

    const colorLightValue = colorLightDef!.value;
    expect(colorLightValue).toBe('#fff');

    const colorDarkDef = variableTokenDefinitions.get('color.dark');
    expect(colorDarkDef).toBeDefined();

    const colorDarkValue = colorDarkDef!.value;
    expect(colorDarkValue).toBe('#000');

});

test('should throw error with null options', () => {
    const badOptions = null as unknown as VariableTokenizerOptions;
    expect(() => VariableTokenizer.execute(badOptions)).toThrowError();
});

test('should throw with null vars', () => {
    const badOptions: VariableTokenizerOptions = {
        vars: null as unknown as NestedConfigCollection<VarEntry>
    };

    expect(() => VariableTokenizer.execute(badOptions)).toThrowError();
});