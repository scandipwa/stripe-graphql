import { PaymentRequestButtonElement } from 'react-stripe-elements';


/** @namespace ScandiPWA/StripeGraphql/Component/StripeOneclickPayment/Component */
export class StripeOneClickPayment extends PureComponent {
    render() {
        const { paymentRequest } = this.props;

        return (
            <div block="InjectedStripeCheckoutForm" elem="ButtonPay">
                <PaymentRequestButtonElement
                  paymentRequest={ paymentRequest }
                />
            </div>
        );
    }
}

export default StripeOneClickPayment;
