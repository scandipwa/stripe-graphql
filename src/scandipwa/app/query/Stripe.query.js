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

import { Field } from 'Util/Query';

/**
 * Slider Query
 * @class Slider
 */
export class StripeQuery extends ExtensibleClass {
    createPaymentIntent(options) {
        return new Field('createPaymentIntent')
            .addArgument('input', 'CreateIntentInput!', options)
            .addField('intent_client_secret');
    }
}

export default new (middleware(StripeQuery, 'Scandipwa/StripeGraphql/Query/Stripe'))();
