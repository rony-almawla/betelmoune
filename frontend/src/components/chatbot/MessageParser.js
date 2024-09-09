import nlp from 'compromise';

class MessageParser {
    constructor(actionProvider) {
        this.actionProvider = actionProvider;
    }

    parse(message) {
        const lowerMessage = message.toLowerCase();

        // Predefined patterns for common queries
        if (/hello|hi|hey|good morning|good afternoon|good evening/.test(lowerMessage)) {
            this.actionProvider.handleHello();
        } else if (/what is your name|who are you|tell me your name|your name/.test(lowerMessage)) {
            this.actionProvider.handleNameQuery();
        } else if (/what can you do|how can you help|what are your capabilities|capabilities|how can you assist|help/.test(lowerMessage)) {
            this.actionProvider.handleIntroduction();
        } else if (/what are your hours of operation|when are you open|opening hours|working hours|business hours/.test(lowerMessage)) {
            this.actionProvider.handleHoursOfOperation();
        } else if (/how can i contact customer support|contact support|contact|help desk|customer service|how can i reach you|support/.test(lowerMessage)) {
            this.actionProvider.handleContactInformation();
        } else if (/forgot my password|reset password|lost password|can’t log in|password recovery/.test(lowerMessage)) {
            this.actionProvider.handleForgotPassword();
        } else if (/trouble checking out|issue with checkout|checkout problem|checkout issue|problem with payment|payment problem/.test(lowerMessage)) {
            this.actionProvider.handleCheckoutAssistance();
        } else if (/payment methods|how can i pay|accepted payment methods|payment options|payment/.test(lowerMessage)) {
            this.actionProvider.handlePaymentOptions();
        } else if (/where is my order|track my order|order status|order tracking|order whereabouts|order problem/.test(lowerMessage)) {
            this.actionProvider.handleOrderStatus();
        } else if (/what is your return policy|how to return|can i return|return guidelines|return process/.test(lowerMessage)) {
            this.actionProvider.handleReturnPolicy();
        } else if (/offer international shipping|ship internationally|overseas shipping|worldwide shipping|international delivery|shipping/.test(lowerMessage)) {
            this.actionProvider.handleInternationalShipping();
        } else if (/modify my order|change my order|edit order|update order|order modification|modify the order/.test(lowerMessage)) {
            this.actionProvider.handleOrderModification();
        } else if (/discount code|promo code|coupon code|voucher code|discount voucher|discount/.test(lowerMessage)) {
            this.actionProvider.handleDiscountCode();
        } else if (/where can i find product reviews|product feedback|customer reviews|reviews on products|product ratings/.test(lowerMessage)) {
            this.actionProvider.handleProductReviews();
        } else if (/unsubscribe from emails|stop emails|opt out emails|email preferences|unsubscribe from mailing list|emails/.test(lowerMessage)) {
            this.actionProvider.handleUnsubscribeEmails();
        } else if (/loyalty program|rewards program|points system|loyalty rewards|reward points/.test(lowerMessage)) {
            this.actionProvider.handleLoyaltyProgram();
        } else if (/store located|store address|physical store location|where is your store|store directions/.test(lowerMessage)) {
            this.actionProvider.handleStoreLocation();
        } else if (/update my address|change address|update shipping information|change delivery address|shipping address update/.test(lowerMessage)) {
            this.actionProvider.handleUpdateAddress();
        } else if (/cancel my order|order cancellation|cancel purchase|stop my order|cancel my transaction|stop my transaction/.test(lowerMessage)) {
            this.actionProvider.handleOrderCancellation();
        } else if (/product availability|in stock|product available|is it available|available products|available product|stock check/.test(lowerMessage)) {
            this.actionProvider.handleProductAvailability();
        } else if (/gift cards|gift card|gift certificates|gift|buy gift card|purchase gift voucher|gift card options/.test(lowerMessage)) {
            this.actionProvider.handleGiftCardInquiry();
        } else if (/membership benefits|member perks|join membership|membership program|membership options/.test(lowerMessage)) {
            this.actionProvider.handleMembershipBenefits();
        } else {
            // Use NLP to extract entities from the message
            const doc = nlp(lowerMessage);
            const terms = doc.terms().out('array');
            
            if (terms.length > 0) {
                this.actionProvider.handleEntityRecognition(terms);
            } else {
                this.actionProvider.handleUnknown();
            }
        }
    }
}

export default MessageParser;



