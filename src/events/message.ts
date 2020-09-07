import { client, db } from '../app';
import { Message } from 'discord.js';
import { ensureGuild } from '../util/databaseFunctions';

// Instead of grabbing the prefix each time, we can store the current prefix of any server this shard looks at, and update it when the database updates.
import { servers } from '../util/serverinfo';

client.on('message', async (msg: Message) => {
    if (!msg.guild || msg.author.bot) return;

    const serverDoesHavePrefixLoaded = servers.has(msg.guild.id);

    // Loads the prefix and listens for any changes in the future
    if (!serverDoesHavePrefixLoaded) {
        console.log('Grabbing prefix from ' + msg.guild.name);

        const refrence = db.ref(`guilds/${msg.guild.id}/prefix`);

        const serverConfig = await refrence.once('value');

        if (!serverConfig.exists()) {
            ensureGuild(msg.guild);
        }

        servers.set(msg.guild.id, serverConfig.val());

        const serverId = msg.guild.id;

        refrence.on('value', (snapshot) => {
            servers.set(serverId, snapshot.val());
        });
    }

    const prefix = servers.get(msg.guild.id);

    if (!msg.content.startsWith(prefix)) return;

    const args = msg.content.split(/ +/g);
    const command = args.shift()!.slice(prefix.length).toLowerCase();

    const cmd = client.commands.get(command);
    if (!cmd) return;

    cmd.run(client, msg, args);
});
