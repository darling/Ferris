import { Guild, GuildMember, Message, MessageEmbed } from 'discord.js';
import { client } from '../app';
import moment from 'moment';

async function unmuteUserFromGuild(guild: string, user_id: string, roles: string) {
    const resolvedGuild: Guild | null = client.guilds.resolve(guild);
    if (resolvedGuild === null) return;

    const member: GuildMember | null = resolvedGuild.member(user_id);
    if (member === null) return;

    const old_roles: string[] = roles.split(',');

    old_roles.map((role_id) => {
        resolvedGuild.roles.fetch(role_id, true);
    });

    member.roles.set(old_roles).catch((err: Error) => {
        console.error(err);
    });

    console.log(guild, user_id, old_roles);
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
