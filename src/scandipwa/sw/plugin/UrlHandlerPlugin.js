class UrlHandlerPlugin {
    aroundGetBypassCacheHosts = (originalMember, instance) => ([
        ...originalMember(),
        '(?!^.*stripe)', // Stripe
    ])
}

const {
    aroundGetBypassCacheHosts
} = new UrlHandlerPlugin();

const config = {
    'SW/Handler/UrlHandler/getBypassCacheHosts': {
        'function': [
            {
                position: 100,
                implementation: aroundGetBypassCacheHosts
            }
        ]
    }
};

export default config;
