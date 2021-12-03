import { Bumblebee } from './bumblebee';

import { Configuration} from "./configuration/configuration.interface";
import { BreakpointCollection, NestedConfigCollection, VarEntry } from "./core/models";
import { asPercentage } from "./helpers";

const baseSizeUnits = 'rem';
const baseSize = 1;

const sizeScale: NestedConfigCollection<VarEntry> = {
    '200': { value: baseSize * .05 + baseSizeUnits },
    '300': { value: baseSize * 0.8 + baseSizeUnits },
    '400': { value: baseSize + baseSizeUnits },
    '500': { value: baseSize * 1.25 + baseSizeUnits },
    '600': { value: baseSize * 1.6 + baseSizeUnits },
    '700': { value: baseSize * 2 + baseSizeUnits },
    '900': { value: baseSize * 3 + baseSizeUnits }
};

const baseColors: NestedConfigCollection<VarEntry> = {
    'red': {
        'light': { value: '#d48a8f' },
        'dark': { value: '#d33f49'}
    },
    'orange': {
        'light': { value: '#ffac88' },
        'dark': { value: '#fc4c02' }
    },
    'yellow': {
        'light': { value: '#f2d479' },
        'dark': { value: '#f3b700' }
    },
    'green': {
        'light': { value: '#aeffcf' },
        'dark': { value: '#06bf6f' }
    },
    'blue': {
        'light': { value: '#88c9ff' },
        'dark': { value: '#0072ce' }
    },
    'teal': {
        'light': { value: '#7ac7cc' },
        'dark': { value: '#0ebdcb' }
    },
    'cyan': {
        'light': { value: '#99f5ff' },
        'dark': { value: '#1be7ff' }
    },
    'indigo': {
        'light': { value: '#2e3742' },
        'dark': { value: '#0a2342' }
    },
    'violet': {
        'light': { value: '#65567a' },
        'dark': { value: '#0a2342' }
    },
    'pink': {
        'light': { value: '#dd7dfa' },
        'dark': { value: '#c200fb' }
    },
}

const themedColors: NestedConfigCollection<VarEntry> = {
    'dark': { value: '#1a1a1a', themes: {'dark': {value: '#f3f3f3'}} },
    'light': {value: '#f3f3f3', themes: {'dark': {value: '#1a1a1a'}} }
};

const breakpoints: NestedConfigCollection<VarEntry> = {
    'sm': { value: '36em' },
    'md': { value: '48em' },
    'lg': { value: '62em' }
}

const gaps: NestedConfigCollection<VarEntry> = {
    'top': { value: '{scale.200}' },
    'right': { value: '{scale.200}' },
    'bottom': { value: '{scale.200}' },
    'left': { value: '{scale.200}' },
}

const paddingAndMargin: NestedConfigCollection<VarEntry> = {
    'padding': gaps,
    'margin': gaps
}

export const sampleConfiguration: Configuration = {
    outputPath: '_output',
    namespace: {
        prefix: 'my-class',
        vars: 'my-var'
    },
    vars: {
        'base-colors': baseColors,
        'theme-colors':themedColors,
        scale: sizeScale,
        breakpoints: breakpoints,
        spacing: paddingAndMargin
    },
    breakpoints: {
        'sm': `(min-width: ${breakpoints.sm.value})`,
        'md': `(min-width: ${breakpoints.md.value})`,
        'lg': `(min-width: ${breakpoints.lg.value})`
    },
    themes: {
        'dark': [
            (c) => `@media(prefers-color-scheme: dark){ :root { ${c} }}`, 
            (c) => `[data-theme="dark"]{${c}}`]
    },
    utilities: {
        'bg': {
            use: 'theme-colors',
            output: 'standard',
            property: 'background'
        },
        'color': {
            use: ['base-colors', 'theme-colors'],
            output: 'standard',
            property: 'color'
        },
        'box': {
            use: {
                'block': { value: 'block' },
                'flex': { value: 'flex' },
                'hide': { value: 'none' },
                'show': { value: 'inherit' }
            },
            output: 'responsive',
            property: 'display'            
        },
        'gap': {
            'top': {
                use: 'scale',
                output: 'standard',
                property: 'margin-top'
            },
            'bottom': {
                use: 'scale',
                output: 'standard',
                property: 'margin-bottom'
            },
            'left': {
                use: 'scale',
                output: 'standard',
                property: 'margin-left'
            },
            'right': {
                use: 'scale',
                output: 'standard',
                property: 'margin-right'
            }
        },
        'pad': {
            'top': {
                use: 'scale',
                output: 'standard',
                property: 'padding-top'
            },
            'bottom': {
                use: 'scale',
                output: 'standard',
                property: 'padding-bottom'
            },
            'left': {
                use: 'scale',
                output: 'standard',
                property: 'padding-left'
            },
            'right': {
                use: 'scale',
                output: 'standard',
                property: 'padding-right'
            }
        },
        'stack': {
            use: {
                '0': { value: 0 },
                '100': { value: 100  },
                '200': { value: 200  },
                '300': { value: 300  },
                '400': { value: 400  },
                '500': { value: 500  },
                '600': { value: 600  },
                '700': { value: 700  },
                '800': { value: 800 },
                '900': { value: 900 }
            },
            output: 'standard',
            property: 'z-index'
        },
        'text': {
            use: 'scale',
            output: 'responsive',
            property: 'font-size'
        },
        'weight': {
            use: {
                'light': { value: 300 },
                'regular': { value: 400 },
                'bold': { value: 700 }
            },
            output: 'standard',
            property: 'font-weight'
        },
        'width': {
            use: {
                'full': { value: '100%' },
                'half': { value: asPercentage(1/2) },
                'thrid': { value: asPercentage(1/3) },
                'quarter': { value:  asPercentage(1/4) }
            },
            output: 'responsive',
            property: 'width'
        }
    }
};

test('should generate defaults', () => {

    Bumblebee.generate(sampleConfiguration);

});