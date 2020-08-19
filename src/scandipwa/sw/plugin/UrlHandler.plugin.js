export class UrlHandlerPlugin {
    aroundGetBypassCacheHosts = (args, callback, context) => ([
        ...callback.apply(context, args),
        '(?!^.*stripe)' // Stripe
    ]);
}

const {
    aroundGetBypassCacheHosts
} = new UrlHandlerPlugin();

export const config = {
    'SW/Handler/UrlHandler/getBypassCacheHosts': {
        function: aroundGetBypassCacheHosts
    }
};

export default config;
