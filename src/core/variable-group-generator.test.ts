import { VarEntry } from './models';
import { VariableGroupGenerator, VariableGroupGeneratorOptions} from './variable-group-generator';

test('should create cssVariables', () => {

    const options: VariableGroupGeneratorOptions = {
        themes: {
            light: (c) => `[data-theme="light"]{ ${c} }`,
            dark: [
                (c) => `[data-theme="dark"]{ ${c} }`,
                (c) => `@media(prefers-color-scheme: dark){ :root { ${c}}}`
            ]
        },
        varTokens: new Map<string, VarEntry>([
            ['color.light', { value: '#fff', themes: {'dark': { value: '#000'}}}],
            ['color.dark', { value: '#000', themes: {'dark': { value: '#fff' }}}]
        ])
    };

    const cssVariables = VariableGroupGenerator.execute(options);
});

test('should throw error with null options', () => {
    const badOptions = null as unknown as VariableGroupGeneratorOptions;
    expect(() => VariableGroupGenerator.execute(badOptions)).toThrowError();
});

test('should throw with null varTokens', () => {
    const badOptions: VariableGroupGeneratorOptions = {
        varTokens: null as unknown as Map<string, VarEntry>
    };

    expect(() => VariableGroupGenerator.execute(badOptions)).toThrowError();
});