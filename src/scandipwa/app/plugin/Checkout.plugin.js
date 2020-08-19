import { cloneElement } from 'react';

export class CheckoutPlugin {
    aroundRenderBillingStep = (args, callback, instance) => {
        const { paymentTotals } = instance.props;

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
    aroundRenderBillingStep
} = new CheckoutPlugin();

export const config = {
    'Route/Checkout/Component': {
        'member-function': {
            renderBillingStep: aroundRenderBillingStep
        }
    }
};

export default config;
