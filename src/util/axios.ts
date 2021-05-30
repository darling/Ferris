export const URL_DATA = {
    baseURL:
        process.env.NODE_ENV == 'development'
            ? 'http://localhost:3000/api'
            : 'https://ferris.gg/api',
};
