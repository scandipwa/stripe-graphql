import { connect } from 'react-redux';
import { CartDispatcher } from 'Store/Cart';
import { fetchMutation } from 'Util/Request';
import { showNotification } from 'Store/Notification';
import StripeQuery from '../../query/Stripe.query';
import StripeOneClickPayment from './StripeOneClickPayment.component';

export const mapStateToProps = (state) => ({})

export const mapDispatchToProps = (dispatch) => ({
    showNotification: (type, message) => dispatch(showNotification(type, message))
})

export class StripeOneClickPaymentContainer extends ExtensiblePureComponent {
    state = {
        buttonPayEnabled: false
    };

    containerProps = () => ({
        paymentRequest: this.paymentRequest
    });

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

    generatePaymentRequest() {
        const {
            stripe,
            paymentTotals: {
                quote_currency_code
            },
            billingAddress: {
                country_id
            }
        } = this.props;

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

    componentDidMount() {
        this.paymentRequest = this.generatePaymentRequest();
        this.paymentRequest.canMakePayment().then(
            can => this.setState(() => ({ buttonPayEnabled: !!can }))
        );

        this.paymentRequest.on(
            'paymentmethod',
            event => this.handlePaymentMethod(event)
        );
    }

    handleError = error => this.props.showNotification('error', error.message);

    handlePaymentMethod(process) {
        const {
            onPaymentMethod
        } = this.props;

        const { paymentMethod } = process;

        onPaymentMethod(paymentMethod);
        process.complete('success');
    }

    render() {
        const { buttonPayEnabled } = this.state;

        if (!buttonPayEnabled) {
            return null;
        }

        return (
            <div block="InjectedStripeCheckoutForm" elem="ButtonPay">
                <StripeOneClickPayment
                  { ...this.containerProps() }
                />
            </div>
        );
    }
}

export default connect(
    middleware(mapStateToProps, 'ScandiPWA/StripeGraphQl/Component/StripeOneClickPayment/Container/mapStateToProps'),
    middleware(mapDispatchToProps, 'ScandiPWA/StripeGraphQl/Component/StripeOneClickPayment/Container/mapDispatchToProps')
)(
    middleware(StripeOneClickPaymentContainer, 'ScandiPWA/StripeGraphQl/Component/StripeOneClickPayment/Container')
)
