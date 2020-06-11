import { cloneElement } from 'react';

class CheckoutContainerPlugin {
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
    }
}

const {
    aroundRenderBillingStep
} = new CheckoutContainerPlugin();

const config = {
    'Route/Checkout/Component': {
        'member-function': {
            'renderBillingStep': [
                {
                    position: 100,
                    implementation: aroundRenderBillingStep
                }
            ]
        }
    }
};

export default config;
