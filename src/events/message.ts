import { client } from '../app';
import { Guild, Message } from 'discord.js';
import { watchGuild } from '../util/databaseFunctions';

// Instead of grabbing the prefix each time, we can store the current prefix of any server this shard looks at, and update it when the database updates.
import { serverConfigs } from '../util/serverinfo';

client.on('message', async (msg: Message) => {
    if (!msg.guild || msg.author.bot) return;
    const guild: Guild = msg.guild;

    // Loads the prefix and listens for any changes in the future
    if (!serverConfigs.has(guild.id)) {
        await watchGuild(guild);
    }

    let prefix = serverConfigs.get(guild.id, "prefix");
    let modRoles: any = serverConfigs.get(guild.id, "modroles");

    // if(modRoles) {
    //     let hits = 0;
    //     for (let roleId in modRoles) {
    //         if (msg.member?.roles.cache.has(roleId)) hits++;
    //     }
    //     if (hits === 0) {
    //         return;
    //     }
    // }

    if (!msg.content.startsWith(prefix)) return;

    const args = msg.content.split(/ +/g);
    const command = args.shift()!.slice(prefix.length).toLowerCase();

    const cmd = client.commands.get(command);
    if (!cmd) return;

    cmd.run(client, msg, args);
});
