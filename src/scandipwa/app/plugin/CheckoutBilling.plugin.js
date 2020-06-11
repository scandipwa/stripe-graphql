import { cloneElement } from 'react';

class CheckoutBillingContainerPlugin {
    aroundRenderPayments = (args, callback, instance) => {
        const {
            paymentTotals
        } = instance.props;

        const originalElement = callback.apply(instance, args);
        const additionalProps = {
            paymentTotals
        };

        return cloneElement(
            originalElement,
            additionalProps
        );
    }
}

const {
    aroundRenderPayments
} = new CheckoutBillingContainerPlugin();

const config = {
    'Component/CheckoutBilling/Component': {
        'member-function': {
            'renderPayments': [
                {
                    position: 100,
                    implementation: aroundRenderPayments
                }
            ]
        }
    }
};

export default config;
