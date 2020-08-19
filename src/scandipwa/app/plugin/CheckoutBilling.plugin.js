import { cloneElement } from 'react';

export class CheckoutBillingPlugin {
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
    };
}

const {
    aroundRenderPayments
} = new CheckoutBillingPlugin();

export const config = {
    'Component/CheckoutBilling/Component': {
        'member-function': {
            renderPayments: aroundRenderPayments
        }
    }
};

export default config;
