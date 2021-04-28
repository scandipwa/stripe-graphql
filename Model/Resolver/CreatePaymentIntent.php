<?php
/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/quote-graphql
 * @link    https://github.com/scandipwa/quote-graphql
 */
declare(strict_types=1);

namespace ScandiPWA\StripeGraphQl\Model\Resolver;

use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlInputException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Quote\Api\CartManagementInterface;
use Magento\QuoteGraphQl\Model\Cart\GetCartForUser;
use Magento\Store\Api\Data\StoreInterface;
use StripeIntegration\Payments\Helper\Generic;
use StripeIntegration\Payments\Model\Config;

/**
 * Resolver for generating Paypal token
 */
class CreatePaymentIntent implements ResolverInterface
{
    /**
     * @var Config
     */
    protected $stripeConfig;
    /**
     * @var GetCartForUser
     */
    protected $getCartForUser;
    /**
     * @var CartManagementInterface
     */
    protected $quoteManagement;
    /**
     * @var Generic
     */
    protected $stripeGeneric;

    public function __construct(
        Config $stripeConfig,
        CartManagementInterface $quoteManagement,
        GetCartForUser $getCartForUser,
        Generic $stripeGeneric
    ) {
        $this->stripeConfig = $stripeConfig;
        $this->quoteManagement = $quoteManagement;
        $this->getCartForUser = $getCartForUser;
        $this->stripeGeneric = $stripeGeneric;
    }

    /**
     * @inheritdoc
     */
    public function resolve(
        Field $field,
        $context,
        ResolveInfo $info,
        array $value = null,
        array $args = null
    ) {
        $input = $args['input'];

        $this->stripeConfig->initStripe();
        $guestCartId = $input['guest_cart_id'] ?? '';
        $customerId = $context->getUserId();

        /** @var StoreInterface $store */
        $store = $context->getExtensionAttributes()->getStore();
        $storeId = (int)$store->getId();

        if ($guestCartId !== '') {
            // At this point we assume this is guest cart
            $cart = $this->getCartForUser->execute($guestCartId, $customerId, $storeId);
        } else {
            // At this point we assume that this is mine cart
            $cart = $this->quoteManagement->getCartForCustomer($customerId);
        }

        $grandTotal = $cart->getGrandTotal();
        $currency = $cart->getQuoteCurrencyCode();

        $subUnitMultiplier = $this->stripeGeneric->isZeroDecimal($currency)
            ? 1
            : 100;

        $intent = \Stripe\PaymentIntent::create([
            'amount' => $grandTotal * $subUnitMultiplier,
            'currency' => $currency,
            'metadata' => ['integration_check' => 'accept_a_payment']
        ]);

        return [
            'intent_client_secret' => $intent['client_secret']
        ];
    }
}
