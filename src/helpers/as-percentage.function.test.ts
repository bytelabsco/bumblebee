import {asPercentage} from './as-percentage.function';

test('.5 should be "50%"', () => {
    expect(asPercentage(.5)).toBe('50%');
});

test ('0 should be "0%"', () => {
    expect(asPercentage(0)).toBe('0%');
});

test ('1 should be "100%"', () => {
    expect(asPercentage(1)).toBe('100%');
})
