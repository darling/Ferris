import ms from 'ms';

function parseIfTime(input: string): undefined | number {
    const hasProperDateTime = /^\d{1,3}[sdmwh]$/.test(input);

    if (hasProperDateTime) return ms(input);

    return;
}

export { parseIfTime };