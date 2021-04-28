<?php

declare(strict_types=1);

namespace ScandiPWA\StripeGraphQl\Model;

use Magento\Framework\GraphQl\Exception\GraphQlInputException;
use ScandiPWA\StripeGraphQl\Model\Config;
use Magento\QuoteGraphQl\Model\Cart\Payment\AdditionalDataProviderInterface;

/**
 * Get payment additional data for Stripe payment method
 */
class StripeAdditionalDataProvider implements AdditionalDataProviderInterface
{
    public function __construct() {}

    /**
     * @param array $data
     * @throws GraphQlInputException
     */
    protected function validateAdditionalData(array $data) {
        if (!isset($data['cc_stripejs_token'])) {
            throw new GraphQlInputException(__('Invalid or missing stripejs token.'));
        }
    }

    /**
     * Retrieve additional data for Stripe payment method
     * @param array $data
     * @return array
     * @throws GraphQlInputException
     */
    public function getData(array $data): array
    {
        $additionalData = $data[Config::METHOD_STRIPE] ?? [];
        $this->validateAdditionalData($additionalData);

        return $additionalData;
    }
}
