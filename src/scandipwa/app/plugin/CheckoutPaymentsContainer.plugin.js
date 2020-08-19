import { BILLING_STEP } from 'Route/Checkout/Checkout.config';

import { STRIPE } from './CheckoutPayments.plugin';

export class CheckoutPaymentsContainerPlugin {
    aroundContainerFunctions = (originalMember, instance) => ({
        ...originalMember,
        setStripeRef: this.setStripeRef.bind(instance),
        onPaymentMethod: this.onPaymentMethod.bind(instance)
    });

    aroundDataMap = (originalMember, instance) => ({
        ...originalMember,
        [STRIPE]: this.getStripeData.bind(instance)
    });

    getStripeData() {
        // Check if one-click-payment
        const { paymentMethod } = this.state;

        if (!paymentMethod) {
            return { asyncData: this.stripeRef.submit() };
        } else {
            const { paymentMethod } = this.state;
            const token = `${paymentMethod.id}:${paymentMethod.card.brand}:${paymentMethod.card.last4}`;

            return { asyncData: Promise.resolve({ token }) };
        }
    }

    /** Instance context */
    setStripeRef(ref) {
        this.stripeRef = ref;
    }

    onPaymentMethod(paymentMethod) {
        this.setState(
            () => ({ paymentMethod }),
            () => {
                document.getElementById(BILLING_STEP).dispatchEvent(new Event('submit'));
            }
        );
    }
}

const {
    aroundContainerFunctions,
    aroundDataMap
} = new CheckoutPaymentsContainerPlugin();

export const config = {
    'Component/CheckoutPayments/Container': {
        'member-property': {
            containerFunctions: aroundContainerFunctions,
            dataMap: aroundDataMap
        }
    }
};

export default config;
