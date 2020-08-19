import { STRIPE } from './CheckoutPayments.plugin';

export class CheckoutBillingContainerPlugin {
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
        }

        return callback.apply(instance, args);
    };
}

const {
    around_getPaymentData
} = new CheckoutBillingContainerPlugin();

export const config = {
    'Component/CheckoutBilling/Container': {
        'member-function': {
            _getPaymentData: around_getPaymentData
        }
    }
};

export default config;
