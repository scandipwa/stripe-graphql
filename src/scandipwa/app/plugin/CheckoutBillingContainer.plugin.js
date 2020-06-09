import { STRIPE } from './CheckoutPayments.plugin'

class CheckoutBillingContainerPlugin {
    around_getPaymentData = (args, callback, instance) => {
        const [asyncData] = args;
        const { paymentMethod: code } = instance.state;

        if (code === STRIPE) {
            const [{ token, handleAuthorization }] = asyncData;
            if (token === null) {
                return false;
            }

            return {
                code,
                additional_data: {
                    cc_stripejs_token: token,
                    cc_save: false
                },
                handleAuthorization
            };
        } else {
            return callback.apply(instance, args);
        }
    }
}

const {
    around_getPaymentData
} = new CheckoutBillingContainerPlugin();

const config = {
    'Component/CheckoutBilling/Container': {
        'member-function': {
            '_getPaymentData': [
                {
                    position: 100,
                    implementation: around_getPaymentData
                }
            ]
        }
    }
};

export default config;
