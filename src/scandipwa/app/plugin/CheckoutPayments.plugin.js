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
            setStripeRef,
            paymentTotals,
            onPaymentMethod
        } = this.props;

        return (
            <Stripe
              billingAddress={ billingAddress }
              setStripeRef={ setStripeRef }
              paymentTotals={ paymentTotals }
              onPaymentMethod={ onPaymentMethod }
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
            'paymentRenderMap': aroundPaymentRenderMap
        }
    }
};

export default config;
