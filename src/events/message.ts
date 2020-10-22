import { client } from '../app';
import { Guild, Message, TextChannel } from 'discord.js';
import { watchGuild } from '../util/databaseFunctions';

// Instead of grabbing the prefix each time, we can store the current prefix of any server this shard looks at, and update it when the database updates.
import { serverConfigs } from '../util/serverInfo';
import { ICommand } from '../types/commands';
import { argumentList } from '../util/arguments';
import { inhibitors } from '../util/inhibitor';

client.on('message', async (msg: Message) => {
    if (!msg.guild || msg.author.bot || msg.webhookID || !client.user) return;
    const guild: Guild = msg.guild;

    // Loads the prefix and listens for any changes in the future
    if (!serverConfigs.has(guild.id)) {
        await watchGuild(guild);
    }

    let prefix = serverConfigs.get(guild.id)?.config?.prefix || ';';

    const botMention = `<@!${client.user.id}>`;

    if (msg.content === botMention || msg.content.startsWith(botMention)) prefix = botMention;
    if (!msg.content.startsWith(prefix)) return;

    const [commandName, ...parameters] = msg.content.substring(prefix.length).split(/ +/g);

    const cmd = await parseCommand(commandName);
    if (!cmd) return;

    const tests = inhibitors.map((fn) => {
        return fn(msg, cmd, guild);
    });

    const testResults = await Promise.all(tests);
    console.log(testResults);
    if (testResults.includes(true)) return;

    executeCommand(msg, cmd, parameters, guild);
});

const parseCommand = async (commandName: string) => {
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

async function executeCommand(msg: Message, cmd: ICommand, parameters: string[], guild?: Guild) {
    try {
        const args = (await parseArgs(msg, cmd, parameters)) as argsType;

        if (!args) {
            console.log('no args found');
            return;
        }

        // If there's no subcommands, excecute the command in question
        const [argument] = cmd.arguments || [];
        // args needs to be parsed using the new system
        const subcommand = argument ? (args[argument.name] as ICommand) : undefined;

        if (!argument || argument.type !== 'subcommand' || !subcommand) {
            // Check for subcommand permissions here

            await cmd.run?.(msg, args, guild);
            return;
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
}

async function parseArgs(msg: Message, cmd: ICommand, params: string[]) {
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
}
