import { Guild} from 'discord.js';
import { client } from '../app';

async function unbanUserFromGuild(guild: Guild | string, user_id: string, reason?: string) {
    let targetGuild: any = guild;
    if (typeof guild == typeof 'string') {
        const resolvedGuild = client.guilds.resolve(guild);
        if (resolvedGuild != null) targetGuild = resolvedGuild;
    }

    targetGuild.members.unban(user_id, reason).catch((err: Error) => {});
}

export { unbanUserFromGuild };
