import { Field, prepareQuery } from 'Util/Query';
import { executeGet } from 'Util/Request';
import { ONE_MONTH_IN_SECONDS } from 'Util/Request/QueryDispatcher';

import Stripe from './Stripe.component';

export const STRIPE_MODE_TEST = 'test';

/** @namespace ScandiPWA/StripeGraphql/Component/Stripe/Container */
export class StripeContainer extends PureComponent {
    state = {
        isLoading: true,
        storeConfig: {}
    };

    __construct(props) {
        super.__construct(props);

        if (window.Stripe) {
            this._requestStripeData();
        } else {
            const script = document.createElement('script');
            script.src = 'https://js.stripe.com/v3/';
            document.head.appendChild(script);
            script.addEventListener('load', () => {
                this._requestStripeData();
            }, false);
        }
    }

    containerProps = () => ({
        stripeKey: this._getStripeKey()
    });

    _requestStripeData() {
        const query = new Field('storeConfig')
            .addFieldList([
                'stripe_mode',
                'stripe_live_pk',
                'stripe_test_pk'
            ]);

        executeGet(prepareQuery([query]), 'StripeContainer', ONE_MONTH_IN_SECONDS).then(
            /** @namespace ScandiPWA/StripeGraphql/Component/Stripe/Container/executeGetThen */
            ({ storeConfig }) => this.setState({ isLoading: false, storeConfig }),
            /** @namespace ScandiPWA/StripeGraphql/Component/Stripe/Container/executeGetThen */
            () => this.setState({ isLoading: false })
        );
    }

    _getStripeKey() {
        const {
            storeConfig: {
                stripe_mode,
                stripe_live_pk,
                stripe_test_pk
            }
        } = this.state;

        return stripe_mode === STRIPE_MODE_TEST
            ? stripe_test_pk
            : stripe_live_pk;
    }

    render() {
        return (
            <Stripe
              { ...this.props }
              { ...this.state }
              { ...this.containerProps() }
            />
        );
    }
}

export default StripeContainer;
