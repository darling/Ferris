import { Dirent, readdirSync } from 'fs';
import { client } from '../app';

export const requireCommands = (dirname: string) => {
    const files = readdirSync(dirname + '/', { withFileTypes: true });

    files.forEach((file: Dirent) => {
        const filename = file.name;
        if (!filename.endsWith('.js')) return;

        let commandName = filename.split('.')[0];

        if (commandName === 'index') return;

        import(`${dirname}/${filename}`).then((prop) => {
            console.log('importing ' + dirname + '/' + filename);
            client.commands.set(commandName, prop);

            if (prop.aliases) {
                prop.aliases.forEach((alias: string) => {
                    client.commands.set(alias, prop);
                });
            }
        });
    });
};

const dirs = readdirSync(__dirname + '/', { withFileTypes: true })
    .filter((dirent) => {
        return dirent.isDirectory();
    })
    .map((dir) => dir.name);

dirs.forEach((dir) => {
    console.log('COMMANDS: ', 'FOUND DIRECTORY: ', dir);
    require(__dirname + '/' + dir);
});
