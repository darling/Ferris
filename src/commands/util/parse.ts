import ms from 'ms';

function parseIfTime(input: string): undefined | number {
    const hasProperDateTime = /^\d{1,3}[sdmwh]$/.test(input);

    if (hasProperDateTime) return ms(input);

    return;
}

function parseChannelId(input: string): undefined | string {
    const isChannel = /^(<#|)\d{18}(>|)$/.test(input);

    if(isChannel) return input.replace("<#", "").replace(">", "");
    return;
}

export { parseIfTime, parseChannelId };