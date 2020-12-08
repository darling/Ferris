import { Guild, GuildMember, Message, MessageEmbed } from 'discord.js';
import { client } from '../app';
import moment from 'moment';
import { getConfig } from './db/config';
import { newLog } from './webhookLogging';
import { EmbedColors } from './embed';

async function unmuteUserFromGuild(guild: string, user_id: string) {
    const resolvedGuild: Guild | null = client.guilds.resolve(guild);
    if (resolvedGuild === null) return;

    const member: GuildMember | null = resolvedGuild.member(user_id);
    if (member === null) return;

    const mutedRoleId = getConfig(guild)?.muted_role;
    if (!mutedRoleId) return;

    member.roles.remove([mutedRoleId]).then((member) => {
        const embed = new MessageEmbed();

        embed.setTitle('Mute Removed')
        embed.setDescription(`<@${member.id}> has been unmuted.`)
        embed.setFooter('ID: ' + member.id);
        embed.setColor(EmbedColors.GREEN300)
        embed.setTimestamp();

        newLog('MUTE_DELETED', member.guild.id, embed);
    })
}

function muteDialog(muteMember: GuildMember, time: number, msg: Message) {
    let embed = new MessageEmbed();
    embed.setColor(EmbedColors.RED);
    embed.setTitle(muteMember.user.username + ' has been muted!');
    embed.setDescription(
        `${muteMember.user.tag} will be unmuted *${moment(Date.now() + time).fromNow()}*.`
    );
    embed.setThumbnail('https://i.imgur.com/HhpcCSo.png');
    embed.setAuthor(msg.author.tag, msg.author.avatarURL()!);
    embed.setFooter(`ID: ${muteMember.id}`).setTimestamp()
    msg.channel.send(embed);
}

export { unmuteUserFromGuild, muteDialog };
