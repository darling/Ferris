import { Guild, GuildMember, Message, MessageEmbed } from 'discord.js';
import { client } from '../app';
import moment from 'moment';
import { getConfig } from './db/config';

async function unmuteUserFromGuild(guild: string, user_id: string) {
    const resolvedGuild: Guild | null = client.guilds.resolve(guild);
    if (resolvedGuild === null) return;

    const member: GuildMember | null = resolvedGuild.member(user_id);
    if (member === null) return;

    const mutedRoleId = getConfig(guild)?.muted_role;
    if (!mutedRoleId) return;

    member.roles.remove([mutedRoleId])
}

function muteDialog(muteMember: GuildMember, time: number, msg: Message) {
    let embed = new MessageEmbed();
    embed.setColor(16646143);
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
