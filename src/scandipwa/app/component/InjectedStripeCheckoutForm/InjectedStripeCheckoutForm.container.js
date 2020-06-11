/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import { connect } from 'react-redux';
import { injectStripe } from 'react-stripe-elements';

import { showNotification } from 'Store/Notification';
import { CartDispatcher } from 'Store/Cart';
import { fetchMutation } from 'Util/Request';
import StripeQuery from '../../query/Stripe.query';
import InjectedStripeCheckoutForm from './InjectedStripeCheckoutForm.component';

export const mapDispatchToProps = dispatch => ({
    showNotification: (type, message) => dispatch(showNotification(type, message))
});

// eslint-disable-next-line no-unused-vars
export const mapStateToProps = state => ({});

class InjectedStripeCheckoutFormContainer extends ExtensiblePureComponent {
    state = {
        buttonPayEnabled: false
    };

    containerProps = () => ({
        paymentRequest: this.paymentRequest
    });

    createPaymentRequest() {
        const {
            stripe,
            paymentTotals: {
                quote_currency_code
            },
            billingAddress: {
                country_id
            }
        } = this.props;

        console.log(this.getOrderAmount());

        const paymentRequest = stripe.paymentRequest({
            country: country_id,
            currency: quote_currency_code.toLowerCase(),
            total: {
                label: 'Get your goods!',
                amount: this.getOrderAmount(),
            },
        });

        return paymentRequest;
    }

    getOrderAmount() {
        /** Determine whether currency has subunits */
        const { paymentTotals: { grand_total, quote_currency_code } } = this.props;

        const isZeroDecimal = currency => [
            'bif', 'djf',
            'jpy', 'krw',
            'pyg', 'vnd',
            'xaf', 'xpf',
            'clp', 'gnf',
            'kmf', 'mga',
            'rwf', 'vuv',
            'xof'
        ].includes(currency.toLowerCase());

        return grand_total * (isZeroDecimal(quote_currency_code) ? 1 : 100)
    }

    async handlePaymentMethod(process) {
        const { showNotification, stripe } = this.props;
        const { createPaymentIntent: { intent_client_secret } } = await this.serverGeneratedPaymentIntent;

        const { error: confirmationError } = await stripe.confirmCardPayment(
            intent_client_secret,
            { payment_method: process.paymentMethod.id },
            { handleActions: false }
        );

        if (confirmationError) {
            process.complete('fail')
            showNotification('error', confirmationError.message);
        } else {
            process.complete('success');
            const { error, paymentIntent } = await stripe.confirmCardPayment(intent_client_secret);
            if (error) {
                // TODO ask your customer for a new payment method.

                console.error(error);
                showNotification('error', confirmationError.message);
            } else {
            // The payment has succeeded.
                console.log(paymentIntent);
                console.log('Success!');
            }
        }
    }

    componentDidMount() {
        const { paymentTotals: { quote_currency_code } } = this.props;

        this.paymentRequest = this.createPaymentRequest();
        this.serverGeneratedPaymentIntent = fetchMutation(
            StripeQuery.createPaymentIntent({
                guest_cart_id: CartDispatcher._getGuestQuoteId()
            })
        );

        this.paymentRequest.canMakePayment().then(
            result => this.setState(() => ({ buttonPayEnabled: !!result }))
        );

        this.paymentRequest.on('paymentmethod', ev => this.handlePaymentMethod(ev));
    }

    render() {
        return(
            <InjectedStripeCheckoutForm
              { ...this.props }
              { ...this.containerProps() }
              { ...this.state }
            />
        )
    }
}

export default connect(
    middleware(mapStateToProps, 'Component/InjectedStripeCheckoutForm/Container/mapStateToProps'),
    middleware(mapDispatchToProps, 'Component/InjectedStripeCheckoutForm/Container/mapDispatchToProps')
)(
    injectStripe(InjectedStripeCheckoutFormContainer)
);
