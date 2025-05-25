import Stripe from 'stripe';
import Payment from '../models/Payment.js';
import Project from '../models/Project.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { projectId, amount } = req.body;

    // Verify project exists and belongs to client
    const project = await Project.findOne({ 
      _id: projectId,
      client: req.user.id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      metadata: {
        projectId,
        clientId: req.user.id,
        freelancerId: project.selectedProposal.freelancer
      }
    });

    // Create payment record
    const payment = new Payment({
      project: projectId,
      client: req.user.id,
      freelancer: project.selectedProposal.freelancer,
      amount,
      stripePaymentIntentId: paymentIntent.id
    });

    await payment.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ message: 'Error creating payment intent' });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Verify payment intent status with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(
      payment.stripePaymentIntentId
    );

    if (paymentIntent.status === 'succeeded') {
      payment.status = 'completed';
      await payment.save();

      // Update project status
      await Project.findByIdAndUpdate(payment.project, {
        status: 'in-progress'
      });

      res.json({ status: 'success' });
    } else {
      res.status(400).json({ message: 'Payment not confirmed' });
    }
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: 'Error confirming payment' });
  }
};

export const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({ status: payment.status });
  } catch (error) {
    console.error('Payment status error:', error);
    res.status(500).json({ message: 'Error getting payment status' });
  }
};