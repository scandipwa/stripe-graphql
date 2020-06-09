export const STRIPE_AUTH_REQUIRED = 'Authentication Required: ';

class CheckoutContainerPlugin {
    around_handlePaymentError = (args, callback, instance) => {
        const [error, paymentInformation] = args;

        const [{ debugMessage: message = '' }] = error;
        const { paymentMethod: { handleAuthorization } } = paymentInformation;

        if (handleAuthorization && message.startsWith(STRIPE_AUTH_REQUIRED)) {
            const secret = message.substring(STRIPE_AUTH_REQUIRED.length);

            handleAuthorization(
                paymentInformation,
                secret,
                paymentInformation => instance.savePaymentInformation(paymentInformation)
            );
        } else {
            return callback.apply(instance, args);
        }
    }
}

const {
    around_handlePaymentError
} = new CheckoutContainerPlugin();

const config = {
    'Component/Checkout/Container': {
        'member-function': {
            '_handlePaymentError': [
                {
                    position: 100,
                    implementation: around_handlePaymentError
                }
            ]
        }
    }
};

export default config;
