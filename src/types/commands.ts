import { Collection, Guild, Message } from 'discord.js';

export interface ICommand {
    name: string;
    aliases?: string[];
    guildOnly?: boolean;
    dmOnly?: boolean;
    permissionLevels?: // This is the permission level of each command, can have multiple. Second arg is any method that allows to test for permissions in a guild with custom perms
    | PermissionLevels[]
        | ((msg: Message, command: ICommand, guild?: Guild) => boolean | Promise<boolean>);
    botGuildPerms?: Permission[];
    botChannelPerms?: Permission[];
    userGuildPerms?: Permission[];
    userChannelPerms?: Permission[];
    arguments?: CommandArgument[];
    subcommands?: Collection<string, ICommand>;
    description?: string;
    display?: boolean;
    iconName?: string;
    run?: (msg: Message, args: any, guild?: Guild) => unknown;
}

export interface CommandArgument {
    name: string;
    /** Type of command arg, default is string */
    type?:
        | 'number'
        | 'string'
        | '...string'
        | 'boolean'
        | 'subcommand'
        | 'member'
        | 'role'
        | 'newschannel'
        | 'categorychannel'
        | 'textchannel'
        | 'command'
        | 'duration'
        | 'guild';
    /** Function that runs when arg is missing */
    missing?: (msg: Message) => unknown;
    required?: boolean;
    lowercase?: boolean;
    /** Must be one of the literals if specified */
    literals?: string[];
    /** default value */
    defualtValue?: string | boolean | number;
    description?: string;
}

export type Permission =
    | 'CREATE_INSTANT_INVITE'
    | 'KICK_MEMBERS'
    | 'BAN_MEMBERS'
    | 'ADMINISTRATOR'
    | 'MANAGE_CHANNELS'
    | 'MANAGE_GUILD'
    | 'ADD_REACTIONS'
    | 'VIEW_AUDIT_LOG'
    | 'VIEW_CHANNEL'
    | 'SEND_MESSAGES'
    | 'SEND_TTS_MESSAGES'
    | 'MANAGE_MESSAGES'
    | 'EMBED_LINKS'
    | 'ATTACH_FILES'
    | 'READ_MESSAGE_HISTORY'
    | 'MENTION_EVERYONE'
    | 'USE_EXTERNAL_EMOJIS'
    | 'CONNECT'
    | 'SPEAK'
    | 'MUTE_MEMBERS'
    | 'DEAFEN_MEMBERS'
    | 'MOVE_MEMBERS'
    | 'USE_VAD'
    | 'PRIORITY_SPEAKER'
    | 'STREAM'
    | 'CHANGE_NICKNAME'
    | 'MANAGE_NICKNAMES'
    | 'MANAGE_ROLES'
    | 'MANAGE_WEBHOOKS'
    | 'MANAGE_EMOJIS';

export enum Permissions {
    CREATE_INSTANT_INVITE = 0x00000001,
    KICK_MEMBERS = 0x00000002,
    BAN_MEMBERS = 0x00000004,
    ADMINISTRATOR = 0x00000008,
    MANAGE_CHANNELS = 0x00000010,
    MANAGE_GUILD = 0x00000020,
    ADD_REACTIONS = 0x00000040,
    VIEW_AUDIT_LOG = 0x00000080,
    VIEW_CHANNEL = 0x00000400,
    SEND_MESSAGES = 0x00000800,
    SEND_TTS_MESSAGES = 0x00001000,
    MANAGE_MESSAGES = 0x00002000,
    EMBED_LINKS = 0x00004000,
    ATTACH_FILES = 0x00008000,
    READ_MESSAGE_HISTORY = 0x00010000,
    MENTION_EVERYONE = 0x00020000,
    USE_EXTERNAL_EMOJIS = 0x00040000,
    CONNECT = 0x00100000,
    SPEAK = 0x00200000,
    MUTE_MEMBERS = 0x00400000,
    DEAFEN_MEMBERS = 0x00800000,
    MOVE_MEMBERS = 0x01000000,
    USE_VAD = 0x02000000,
    PRIORITY_SPEAKER = 0x00000100,
    STREAM = 0x00000200,
    CHANGE_NICKNAME = 0x04000000,
    MANAGE_NICKNAMES = 0x08000000,
    MANAGE_ROLES = 0x10000000,
    MANAGE_WEBHOOKS = 0x20000000,
    MANAGE_EMOJIS = 0x40000000,
}

export enum PermissionLevels {
    MEMBER,
    MODERATOR,
    ADMIN,
    SERVER_OWNER,
    FERRIS_STAFF,
    BOT_DEV,
}
