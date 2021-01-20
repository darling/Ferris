module.exports = {
    apps: [
        {
            name: 'app',
            script: './dist/app.js',
            env: {
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
    ],

    deploy: {
        production: {
            user: 'root',
            host: '143.110.153.191',
            ref: 'origin/master',
            repo: 'ferris:darling/Ferris.git',
            'post-deploy': 'npm install && tsc && pm2 reload ecosystem.config.js --env production',
        },
    },
};
