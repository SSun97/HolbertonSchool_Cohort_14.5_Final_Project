const Stripe = require('stripe');
import axios from 'axios';
import { showAlert } from './alerts';
import { loadStripe } from '@stripe/stripe-js'

export const bookTour = async tourID => {
    try {
        const stripe = await loadStripe('pk_test_51KvXAQEe0nwrWacBy1cYng4LATKAPcWOjLcYxIGFG2DBZWu9uVrFF5N4Ju3uOiFbmAjSMOxbmBISAHvIeYebJJgZ00H0fW8a9L');
        // 1) get checkout session from API
        const session = await axios(`/api/v1/bookings/checkout-session/${tourID}`);
        // console.log(session);
        // 2) create checkout from + charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
    })
    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
}