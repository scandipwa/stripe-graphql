import Stripe from '../component/Stripe';

export const STRIPE = 'stripe_payments';

class CheckoutPaymentsPlugin {
    aroundPaymentRenderMap = (originalMember, instance) => ({
        ...originalMember,
        [STRIPE]: this.renderStripePayment.bind(instance)
    });

    renderStripePayment() {
        const {
            billingAddress,
            setStripeRef
        } = this.props;

        return (
            <Stripe
              billingAddress={ billingAddress }
              setStripeRef={ setStripeRef }
            />
        );
    }
}

const {
    aroundPaymentRenderMap
} = new CheckoutPaymentsPlugin();

const config = {
    'Component/CheckoutPayments/Component': {
        'member-property': {
            'paymentRenderMap': [
                {
                    position: 100,
                    implementation: aroundPaymentRenderMap
                }
            ]
        }
    }
};

export default config;
