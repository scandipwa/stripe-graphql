<?php

namespace ScandiPWA\StripeGraphQl\Plugin;

use Magento\Authorization\Model\UserContextInterface;
use Magento\Checkout\Model\PaymentInformationManagement;
use Magento\Quote\Api\Data\AddressInterface;
use Magento\Quote\Api\Data\PaymentInterface;
use Magento\Checkout\Model\Session as CheckoutSession;
use Magento\Customer\Model\Session as CustomerSession;

class PaymentInformationManagementPlugin
{
    /**
     * @var CheckoutSession
     */
    protected $checkoutSession;

    /**
     * @var CustomerSession
     */
    protected $customerSession;

    /**
     * @var UserContextInterface
     */
    protected $userContext;

    /**
     * PaymentInformationManagementPlugin constructor.
     * @param CheckoutSession $checkoutSession
     * @param UserContextInterface $userContext
     * @param CustomerSession $customerSession
     */
    public function __construct(
        CheckoutSession $checkoutSession,
        UserContextInterface $userContext,
        CustomerSession $customerSession
    ) {
        $this->checkoutSession = $checkoutSession;
        $this->userContext = $userContext;
        $this->customerSession = $customerSession;
    }

    /**
     * @param PaymentInformationManagement $subject
     * @param $cartId
     * @param PaymentInterface $paymentMethod
     * @param AddressInterface|null $billingAddress
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function beforeSavePaymentInformation(
        PaymentInformationManagement $subject,
        $cartId,
        PaymentInterface $paymentMethod,
        AddressInterface $billingAddress = null
    ) {

        $customerId = null;

        if ($this->userContext->getUserType() === UserContextInterface::USER_TYPE_CUSTOMER) {
            $customerId = $this->userContext->getUserId();
        }

        /**
         * Set quoteID to checkout session
         */
        $this->checkoutSession->setQuoteId($cartId);

        if ($customerId) {
            $this->customerSession->setCustomerId($customerId);
        }
    }
}
