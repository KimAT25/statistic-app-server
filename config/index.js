import local from './local-port.js';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const stage = process.env.STAGE || 'local';

const defaultConfig = {
    stage,
    port: process.env.PORT,
};

const envConfig = () => {
    switch(stage) {
        case 'production':
            return 'production';
        case 'staging':
            return 'testing';
        default:
            return local;
    }
}

const exportConfig = {
    ...defaultConfig,
    ...envConfig()
}

export default exportConfig;
