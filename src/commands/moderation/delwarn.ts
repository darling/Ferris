import { Guild, Message, TextChannel } from 'discord.js';
import { FerrisClient } from '../../app';
import { deleteWarn } from '../../util/databaseFunctions';
import { serverConfigs } from '../../util/serverInfo';
import { addWarn, IDatabaseSchema } from '../../util/databaseFunctions';

import { GuildMember } from 'discord.js';

import { client } from '../../app';
import { timeStamp } from 'console';
import { sendSimpleEmbed } from '../../util/embed';

client.commands.set('delwarn', {
    name: 'delwarn',
    guildOnly: true,
    arguments: [
        {
            name: 'member',
            type: 'member',
            required: true,
        },
        {
            name: 'warning',
            type: 'number',
            required: true,
        },
    ],
    run: (msg, args: PunishArgs, guild) => {
        if (!guild) return;

        let warnings: any = serverConfigs.get(guild.id)?.warns?.[args.member.id];

        if (!warnings) {
            sendSimpleEmbed(
                args.member.user.tag + ' does not have any warns to delete.',
                msg.channel as TextChannel
            );
            return;
        }
        const timestamp = Object.keys(warnings);
        if (args.warning < timestamp.length && args.warning >= 1) {
            deleteWarn(guild.id, args.member.id, timestamp[args.warning - 1]);
        } else {
            sendSimpleEmbed(
                'Please list a valid warn number. You can find them in the `listwarns` command.',
                msg.channel as TextChannel
            );
        }
    },
});

interface PunishArgs {
    member: GuildMember;
    warning: number;
}

// const run: RunCommand = function (client: FerrisClient, msg: Message, args: string[]): void {
//     const guild: Guild | null = msg.guild;
//     if (!guild) return;

//     const person = msg.mentions.members?.first();
//     if (!person) {
//         msg.reply('You did not mention anyone!');
//         return;
//     }

//     deleteWarn(guild.id, person.id, timestamp);
// };
