class ActionProvider {
    constructor(createChatBotMessage, setStateFunc) {
        this.createChatBotMessage = createChatBotMessage;
        this.setState = setStateFunc;
    }

    

    handleHello = () => {
        const message = this.createChatBotMessage(
            "Hello! How can I assist you today? Whether you have a question or need help with something specific, I'm here to help!"
        );
        this.addMessageToState(message);
    };

    handleNameQuery = () => {
        const message = this.createChatBotMessage(
            "I'm Mhamad Jomaa, your virtual assistant. I'm here to help with any inquiries or issues you might have. What can I do for you today?"
        );
        this.addMessageToState(message);
    };

    handleIntroduction = () => {
        const message = this.createChatBotMessage(
            "I can assist with a wide range of tasks, including product information, order tracking, account management, and more. Just let me know how I can help!"
        );
        this.addMessageToState(message);
    };

    handleHoursOfOperation = () => {
        const message = this.createChatBotMessage(
            "Our customer support is available from 9 AM to 9 PM, Monday through Saturday. Feel free to reach out during these hours, and we'll be happy to assist!"
        );
        this.addMessageToState(message);
    };

    handleContactInformation = () => {
        const message = this.createChatBotMessage(
            "You can contact our customer support team by emailing mhamad_jomaa@outlook.com or calling +96170583380. We're here to assist you with any questions or concerns!"
        );
        this.addMessageToState(message);
    };

    handleForgotPassword = () => {
        const message = this.createChatBotMessage(
            "To reset your password, click the 'Forgot Password' link on the login page, and follow the instructions. If you encounter any issues, I'm here to help."
        );
        this.addMessageToState(message);
    };

    handleCheckoutAssistance = () => {
        const message = this.createChatBotMessage(
            "If you're experiencing issues during checkout, please provide details about the problem, and I'll assist you in resolving it as quickly as possible."
        );
        this.addMessageToState(message);
    };

    handlePaymentOptions = () => {
        const message = this.createChatBotMessage(
            "We accept various payment methods, including major credit cards and PayPal. If you have any specific questions about payment, feel free to ask!"
        );
        this.addMessageToState(message);
    };

    handleOrderStatus = () => {
        const message = this.createChatBotMessage(
            "You can check your order status by logging into your account and viewing your order history. If you need more details, I'm here to assist!"
        );
        this.addMessageToState(message);
    };

    handleReturnPolicy = () => {
        const message = this.createChatBotMessage(
            "Our return policy allows for returns within 30 days of purchase on most items. For detailed information, please visit our Returns page or ask me for specific details."
        );
        this.addMessageToState(message);
    };

    handleInternationalShipping = () => {
        const message = this.createChatBotMessage(
            "Yes, we do offer international shipping! Shipping fees are calculated based on your location and will be displayed during checkout. Let me know if you need more information."
        );
        this.addMessageToState(message);
    };

    handleOrderModification = () => {
        const message = this.createChatBotMessage(
            "If you need to modify your order, please contact our customer support as soon as possible. We'll do our best to accommodate any changes you need."
        );
        this.addMessageToState(message);
    };

    handleDiscountCode = () => {
        const message = this.createChatBotMessage(
            "You can apply a discount code during the checkout process. Simply enter the code in the 'Discount Code' field on the payment page, and the discount will be applied."
        );
        this.addMessageToState(message);
    };

    handleProductReviews = () => {
        const message = this.createChatBotMessage(
            "Product reviews can be found in the 'Reviews' section on each product page. We value customer feedback and encourage you to share your experience!"
        );
        this.addMessageToState(message);
    };

    handleUnsubscribeEmails = () => {
        const message = this.createChatBotMessage(
            "To unsubscribe from our emails, please click the 'Unsubscribe' link at the bottom of any of our emails. If you have any concerns, let me know!"
        );
        this.addMessageToState(message);
    };

    handleLoyaltyProgram = () => {
        const message = this.createChatBotMessage(
            "Our loyalty program allows you to earn points on purchases that can be redeemed for discounts. To learn more, visit our Loyalty Program page or ask me for details."
        );
        this.addMessageToState(message);
    };

    handleStoreLocation = () => {
        const message = this.createChatBotMessage(
            "Our physical store is located at 123 Main Street, Anytown. We'd love to see you there! If you need directions, feel free to ask."
        );
        this.addMessageToState(message);
    };

    handleUpdateAddress = () => {
        const message = this.createChatBotMessage(
            "You can update your shipping address in your account settings under 'Shipping Information.' If you need further assistance, I'm here to help."
        );
        this.addMessageToState(message);
    };

    handleOrderCancellation = () => {
        const message = this.createChatBotMessage(
            "To cancel your order, please contact our customer support team as soon as possible. We'll guide you through the cancellation process and assist with any concerns."
        );
        this.addMessageToState(message);
    };

    handleProductAvailability = () => {
        const message = this.createChatBotMessage(
            "To check product availability, please visit the product page. If an item is out of stock, you can sign up for notifications when it becomes available."
        );
        this.addMessageToState(message);
    };

    handleGiftCardInquiry = () => {
        const message = this.createChatBotMessage(
            "We offer gift cards that can be purchased online. To learn more, please visit our Gift Cards page, or ask me for more details."
        );
        this.addMessageToState(message);
    };

    handleMembershipBenefits = () => {
        const message = this.createChatBotMessage(
            "Our membership program offers exclusive benefits, including discounts, early access to sales, and more. To learn more or join, visit our Membership page."
        );
        this.addMessageToState(message);
    };

    handleUnknown = () => {
        const message = this.createChatBotMessage(
            "I'm sorry, I didn't quite understand that. Could you please rephrase your question or ask about something else? I'm here to help with any inquiries you may have."
        );
        this.addMessageToState(message);
    };

    handleEntityRecognition(entities) {
        let responseMessage;
    
        // Define specific product entities
        const products = ['fate', 'kishk', 'labne', 'cheese', 'olives', 'tomato', 'jam'];
    
        // Check for specific entities and generate an appropriate response
        const matchedProduct = products.find(product => entities.includes(product));
    
        if (matchedProduct) {
            responseMessage = `Are you interested in learning more about our ${matchedProduct}?,please visit the products page!`;
        } else if(entities.includes('product')) {
            responseMessage = "Are you looking for information about a specific product? I can help with details, availability, or recommendations.";
        }  else if (entities.includes('order')) {
            responseMessage = "It looks like you're asking about an order. How can I assist with that?";
        } else if (entities.includes('shipping')) {
            responseMessage = "I can help with shipping information. What would you like to know?";
        }else if (entities.includes('payment')) {
            responseMessage = "I see you're inquiring about payment. Do you want to know about payment methods, transaction status, or related issues?";
        } else if (entities.includes('support')) {
            responseMessage = "It seems like you need support. Do you need help with your account, a product issue, or something else?";
        } else if (entities.includes('return')) {
            responseMessage = "I can help with returns. Are you looking to initiate a return, understand our return policy, or something else?";
        } else {
            responseMessage = "I'm here to help! Can you please provide more details on what you need?";
        }
    
        const message = this.createChatBotMessage(responseMessage);
        this.addMessageToState(message);
    }
    
    

    // askClarification = () => {
    //     const message = this.createChatBotMessage(
    //         "I didn't quite understand that. Could you please provide more details or rephrase your question?"
    //     );
    //     this.addMessageToState(message);
    // };

    // Utility function to add messages to the state
    addMessageToState = (message) => {
        this.setState((prev) => ({
            ...prev,
            messages: [...prev.messages, message],
        }));
    };
}

export default ActionProvider;
