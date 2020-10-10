import ms from 'ms';

export function parseIfTime(input: string): undefined | number {
    const hasProperDateTime = /^\d{1,3}[sdmwh]$/.test(input);

    if (hasProperDateTime) return ms(input);

    return;
}

export function parseChannelId(input: string): undefined | string {
    const isChannel = /^(<#|)\d{18}(>|)$/.test(input);

    if (isChannel) return input.replace('<#', '').replace('>', '');
    return;
}

export function stripMention(input: string): string {
    return input.replace('<@', '').replace('!', '').replace('>', '');
}

export function isUserMention(input: string): boolean {
    return /^\d{18}$/.test(stripMention(input));
}
