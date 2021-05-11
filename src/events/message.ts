import { Guild, Message, MessageEmbed } from 'discord.js';
import _, { compact, intersection } from 'lodash';

import { client } from '../app';
import { ICommand } from '../types/commands';
import { argumentList } from '../util/arguments';
import { getConfig } from '../util/db/config';
import { getPrefix } from '../util/db/prefix';
import { addWarn, IWarning } from '../util/db/warnings';
import { inhibitors } from '../util/inhibitor';
import { messageReply } from '../util/interactions/message';
import { passiveTests } from '../util/passiveTest';

// Instead of grabbing the prefix each time, we can store the current prefix of any server this shard looks at, and update it when the database updates.
client.on('message', async (msg: Message) => {
    if (!msg.guild || msg.author.bot || msg.webhookID || !client.user) return;

    const { guild, content, channel, member } = msg;
    const config = await getConfig(guild.id);

    let prefix = await getPrefix(guild.id);

    // If the mention of the bot is used instead of the prefix, it will pretend like the prefix is the mention.
    const botMention = `<@!${client.user.id}>`;
    if (content.startsWith(botMention)) prefix = botMention + ' ';

    // Anything below this is considered a "Command" and will be processed as such.
    if (!content.startsWith(prefix)) {
        // Handle messages that aren't "commands", such as xp, auto mod, etc.

        const tests = passiveTests.map((fn) => {
            return fn(msg);
        }); // Tests will return undefined or an infraction if punishment=true.

        const results = await Promise.all(tests);
        const hits = results.filter((value) => {
            return value;
        });

        if (hits.length > 0) {
            console.log(
                `${msg.author.username} has made ${hits.length} infraction${
                    hits.length > 1 ? 's' : ''
                }.`
            );

            addWarn(msg.guild.id, msg.author.id, compact(hits));
        }

        return;
    }

    const [commandName, ...parameters] = content.substring(prefix.length).split(/ +/g);

    const cmd = parseCommand(commandName);

    if (!cmd) {
        // Custom commands go here in a side handler

        const customCmd = config?.custom?.[commandName];

        if (customCmd) {
            if (customCmd.channel_list) {
                const isRightChannel = customCmd.channel_list.includes(channel.id);

                if (!isRightChannel) {
                    return;
                }
            }

            if (customCmd.role_list && member) {
                const memberRoleArray = member.roles.cache.array().map((role) => role.id);
                const roleList = customCmd.role_list;

                const intersectedRoles = intersection(memberRoleArray, roleList);

                if (!intersectedRoles.length) {
                    return;
                }
            }

            const embed = new MessageEmbed(customCmd.embed);

            if (embed.description) embed.setDescription(embed.description.replace(/\\n/g, '\n'));

            messageReply(channel, embed);
        } else {
            // Auto-mod and malicious checks can also go here as to not let users use the server's prefix to bypass the spam filter.
        }

        return;
    }

    const tests = inhibitors.map((fn) => {
        return fn(msg, cmd, guild);
    });

    const testResults = await Promise.all(tests);
    if (testResults.includes(true)) return;

    executeCommand(msg, cmd, parameters, guild);
});

const parseCommand = (commandName: string) => {
    const command = client.commands.get(commandName);
    if (command) return command;

    return client.commands.find((cmd) => {
        return Boolean(cmd.aliases?.includes(commandName));
    });
};

type argsType =
    | {
          [key: string]: unknown;
      }
    | false;

const executeCommand = async (msg: Message, cmd: ICommand, parameters: string[], guild?: Guild) => {
    try {
        const args = (await parseArgs(msg, cmd, parameters)) as argsType;

        if (!args) {
            return;
        }

        // If there's no subcommands, excecute the command in question
        const [argument] = cmd.arguments || [];
        // args needs to be parsed using the new system
        const subcommand = !!argument ? (args[argument.name] as ICommand) : undefined;

        if (
            !argument ||
            argument.type !== 'subcommand' ||
            // (argument.type === 'subcommand' && !argument.required) ||
            !subcommand
        ) {
            // Check for subcommand permissions here
            console.log('Running command', cmd.name);
            await cmd.run?.(msg, args, guild);
            return;
        } else {
            console.log('Running subcommand of', cmd.name);
        }

        if (![subcommand?.name, ...(subcommand?.aliases || [])].includes(parameters[0])) {
            executeCommand(msg, subcommand!, parameters, guild);
        } else {
            const subParameters = parameters.slice(1);
            executeCommand(msg, subcommand!, subParameters, guild);
        }
    } catch (error) {
        console.error(error);
    }
};

const parseArgs = async (msg: Message, cmd: ICommand, params: string[]) => {
    const args: { [key: string]: unknown } = {};
    if (!cmd.arguments) return args;

    let missingRequiredArg = false;

    const parameteres = [...params];

    for (const argument of cmd.arguments) {
        const resolver = argumentList.get(argument.type || 'string');
        if (!resolver) continue;

        const result = await resolver.execute(argument, parameteres, msg, cmd);
        if (result) {
            args[argument.name] = result;

            if (argument.type && ['...string', '...roles'].includes(argument.type)) {
                break;
            }

            parameteres.shift();
            continue;
        }

        if (Object.prototype.hasOwnProperty.call(argument, 'defaultValue')) {
            args[argument.name] = argument.defualtValue;
        } else if (argument.required !== false) {
            missingRequiredArg = true;
            argument.missing?.(msg);
            break;
        }
    }

    return missingRequiredArg ? false : args;
};
