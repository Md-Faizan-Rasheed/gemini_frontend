import { useState, useEffect } from 'react';
import { Check, ArrowRight, Sparkles, Zap, Shield, Users } from 'lucide-react';

const PricingPage = () => {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [userId, setUserId] = useState(null);

  // ✅ Fetch user ID on component mount
  useEffect(() => {
    const fetchAndSetUserId = async () => {
      const id = await fetchUserId();
      setUserId(id);
    };
    fetchAndSetUserId();
  }, []);
  const fetchUserId = async () => {
      console.log("Fetching user ID with token:", localStorage.getItem('token'));
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('https://jubilant-fortnight-node-backend.onrender.com/jobs/api/user-id', {
                method: 'POST',
                headers: {
                    'authorization': `${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ token })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: ${response.status} - ${errorText}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid response format: Not JSON');
            }

            const data = await response.json();
            console.log("Fetched user ID data:", data);
            return data.userId;
        } catch (error) {
            console.error('Error fetching user ID:', error.message);
            return null;
        }
    };


  // ✅ Handle FREE plan separately (no payment needed)
  const handleFreePlan = async () => {
    try {
      setLoadingPlan('FREE');
      
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to continue');
        return;
      }

      const response = await fetch(
        'https://jubilant-fortnight-node-backend.onrender.com/api/billing/activate-free-plan',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('FREE plan activated successfully!');
        // Optionally redirect to dashboard
        // window.location.href = '/dashboard';
      } else {
        alert(data.message || 'Failed to activate FREE plan');
      }
    } catch (error) {
      console.error('FREE plan activation error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  // ✅ Handle paid plans (STARTER, PRO)
  const handleBuy = async (planKey) => {
    try {
      setLoadingPlan(planKey);

      // ✅ Check authentication first
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to continue');
        window.location.href = '/login'; // Adjust to your login route
        return;
      }
     console.log("Creating order for plan for userid:", userId);
      // // ✅ Verify user ID is available
      // if (!userId) {
      //   const fetchedUserId = await fetchUserId();
      //   console.log("Fetched user ID:", fetchedUserId);
      //   if (!fetchedUserId) {
      //     alert('Unable to verify user. Please login again.');
      //     return;
      //   }
      //   setUserId(fetchedUserId);
      // }

      // Create order
      const res = await fetch(
        'https://jubilant-fortnight-node-backend.onrender.com/api/billing/create-order',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ plan: planKey }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || 'Unable to create order');
        return;
      }

      const data = await res.json();

      if (!data.success) {
        alert(data.message || 'Order creation failed');
        return;
      }

      const order = data.order;

      // ✅ Verify Razorpay SDK is loaded
      if (!window.Razorpay) {
        alert('Payment system not loaded. Please refresh the page.');
        return;
      }

      // ✅ Configure Razorpay payment options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: 'Interview Platform',
        description: `${planKey} Plan Subscription`,
        image: '/logo.png', // Add your logo
        
        // ✅ Handler for successful payment
        handler: async (response) => {
          try {
            // Verify payment with backend
            const verifyRes = await fetch(
              'https://jubilant-fortnight-node-backend.onrender.com/api/billing/verify',
              {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  plan: planKey,
                }),
              }
            );

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              alert(`🎉 Payment successful! ${planKey} plan activated.`);
              // Redirect to dashboard or success page
              setTimeout(() => {
                window.location.href = '/dashboard'; // Adjust to your route
              }, 2000);
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment completed but verification failed. Please contact support.');
          }
        },

        // ✅ Modal configuration
        modal: {
          ondismiss: () => {
            console.log('Payment cancelled by user');
            setLoadingPlan(null);
          },
        },

        // ✅ Theme customization
        theme: {
          color: '#22c55e', // Green color matching your design
        },

        // ✅ Notes for webhook processing
        notes: {
          user_id: userId,
          plan: planKey,
        },
      };

      // ✅ Open Razorpay payment modal
      const razorpayInstance = new window.Razorpay(options);
      
      razorpayInstance.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        alert(`Payment failed: ${response.error.description}`);
        setLoadingPlan(null);
      });

      razorpayInstance.open();

    } catch (err) {
      console.error('Payment error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      // Don't reset loading here - let modal dismiss handler do it
      // setLoadingPlan(null);
    }
  };

  // ✅ Main handler that routes to correct function
  const handlePlanSelection = (planKey) => {
    if (planKey === 'FREE') {
      handleFreePlan();
    } else {
      handleBuy(planKey);
    }
  };

  // ✅ Updated pricing plans (removed annual pricing)
  const pricingPlans = [
    {
      key: 'FREE',
      name: 'Free',
      price: 0,
      description: 'Try the platform with limited access',
      icon: <Users className="w-6 h-6" />,
      features: [
        '1 Job posting',
        '2 Interviews total',
        'Basic AI evaluation report',
        'Limited candidate insights',
        'Community support'
      ],
      cta: 'Get Started Free',
      popular: false
    },
    {
      key: 'STARTER',
      name: 'Starter',
      price: 999,
      description: 'Best for small teams starting AI hiring',
      icon: <Zap className="w-6 h-6" />,
      features: [
        '5 Job postings',
        '10 Interviews total',
        'Full AI evaluation reports',
        'Candidate scoring & ranking',
        'Email support',
        'Valid for 30 days'
      ],
      cta: 'Buy Starter',
      popular: true
    },
    {
      key: 'PRO',
      name: 'Pro',
      price: 3999,
      description: 'For growing teams hiring at scale',
      icon: <Shield className="w-6 h-6" />,
      features: [
        'Unlimited job postings',
        '50 Interviews total',
        'Advanced evaluation & insights',
        'Priority support',
        'Hiring analytics dashboard',
        'Valid for 30 days'
      ],
      cta: 'Buy Pro',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-lime-50/20 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto text-center mb-12 lg:mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 mb-6">
          <Sparkles className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-gray-700">
            Simple, transparent pricing
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 lg:mb-6">
          Choose the perfect plan for
          <span className="block mt-2 bg-gradient-to-r from-green-500 to-lime-500 bg-clip-text text-transparent">
            your hiring needs
          </span>
        </h1>

        <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          AI-powered interviews with clear, affordable pricing. Start for free or upgrade anytime.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
        {pricingPlans.map((plan) => (
          <div
            key={plan.key}
            className={`relative bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 ${
              plan.popular ? 'ring-2 ring-green-500 lg:scale-105' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-green-500 to-lime-500 text-white px-4 py-1.5 rounded-bl-2xl rounded-tr-3xl text-sm font-semibold">
                Most Popular
              </div>
            )}

            <div className="p-6 lg:p-8">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-lime-100 text-green-600 mb-4">
                {plan.icon}
              </div>

              {/* Plan Name & Description */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ₹{plan.price}
                </span>
                {plan.price > 0 && (
                  <span className="text-gray-500 text-sm ml-2">/30 days</span>
                )}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handlePlanSelection(plan.key)}
                disabled={loadingPlan === plan.key}
                className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 mb-8 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  plan.popular
                    ? 'bg-gradient-to-r from-green-500 to-lime-500 text-white hover:shadow-lg'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {loadingPlan === plan.key ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Features List */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-900 mb-4">
                  What's included:
                </p>
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-500 to-lime-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ or Trust Section (Optional) */}
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-gray-600 text-sm">
          All plans include secure payment processing. Need help choosing? 
          <a href="/contact" className="text-green-600 hover:text-green-700 font-medium ml-1">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
};

export default PricingPage;