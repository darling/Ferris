import { Dirent, readdirSync } from 'fs';

export const requireCommands = (dirname: string) => {
    const files = readdirSync(dirname + '/', { withFileTypes: true });

    files.forEach((file: Dirent) => {
        const filename = file.name;

        if (file.isDirectory()) {
            require(dirname + '/' + filename);
            return;
        }

        if (!filename.endsWith('.js')) return;

        let commandName = filename.split('.')[0];

        if (commandName === 'index') return;

        require(`${dirname}/${filename}`);
    });
};

const dirs = readdirSync(__dirname + '/', { withFileTypes: true })
    .filter((dirent) => {
        return dirent.isDirectory();
    })
    .map((dir) => dir.name);

dirs.forEach((dir) => {
    require(__dirname + '/' + dir);
});
