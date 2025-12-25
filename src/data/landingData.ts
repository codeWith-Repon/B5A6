import { app, hero, testimonial } from "@/assets";
import { Users, User, MapPin, Star, Package, Bike, Truck, Smartphone, CheckCircle, Shield, Zap, BarChart3, TrendingUp, Clock } from 'lucide-react';

export const landingData = {
    hero: {
        title: "The Future of Mobility is Here.",
        subtitle: "Join millions of riders and drivers who trust RideFlow for safe, reliable, and efficient transportation.",
        ctaPrimary: "Book a Ride",
        ctaSecondary: "Become A Driver",
        image: hero.heroImage
    },
    stats: [
        {
            icon: Users,
            value: '1M+',
            label: 'Active Riders',
            description: 'Trusted daily across the platform',
        },
        {
            icon: User,
            value: '500K+',
            label: 'Drivers',
            description: 'Professional & verified',
        },
        {
            icon: MapPin,
            value: '100+',
            label: 'Cities',
            description: 'Nationwide coverage',
        },
        {
            icon: Star,
            value: '4.9/5',
            label: 'Avg Rating',
            description: 'Excellent service quality',
        },
    ],
    services: [
        {
            icon: MapPin,
            title: 'Intercity Rides',
            description:
                'Comfortable long-distance travel between major cities with safety features and transparent pricing.',
            color: 'from-blue-500 to-blue-600',
        },
        {
            icon: Package,
            title: 'Rentals',
            description:
                'Flexible hourly and daily car rentals for personal use, events, or business travel needs.',
            color: 'from-green-500 to-green-600',
        },
        {
            icon: Bike,
            title: 'Bike Rides',
            description:
                'Quick and affordable bike rides for short distances across the city. Fast and eco-friendly.',
            color: 'from-orange-500 to-orange-600',
        },
        {
            icon: Truck,
            title: 'Cargo & Delivery',
            description:
                'Secure goods delivery service for packages, parcels, and items. Insured and tracked.',
            color: 'from-purple-500 to-purple-600',
        },
    ],
    howItWorks: [
        {
            icon: Smartphone,
            title: 'Request a Ride',
            description:
                'Open the RideHub app, enter your destination, and book your ride instantly.',
        },
        {
            icon: Users,
            title: 'Driver Match',
            description:
                'Get matched with a nearby verified driver. Track their location in real-time.',
        },
        {
            icon: CheckCircle,
            title: 'Enjoy Your Ride',
            description:
                'Sit back and relax. Rate your driver and earn rewards after each ride.',
        },
    ],

    roleFeatures: {
        rider: [
            {
                icon: Shield,
                title: 'Safety First',
                description:
                    'All drivers are verified and background-checked. Real-time tracking and emergency SOS features.',
            },
            {
                icon: Zap,
                title: 'Quick Bookings',
                description:
                    'Get a ride in seconds with our instant booking system. No long wait times.',
            },
            {
                icon: BarChart3,
                title: 'Transparent Pricing',
                description:
                    'See the fare before you book. No hidden charges, ever. Pay securely.',
            },
        ],

        driver: [
            {
                icon: TrendingUp,
                title: 'Earn More',
                description:
                    'Flexible working hours with competitive earnings. Bonuses for top-rated drivers.',
            },
            {
                icon: Clock,
                title: 'Be Your Own Boss',
                description:
                    'Work when you want. No fixed hours or shifts. Complete freedom and control.',
            },
            {
                icon: Users,
                title: 'Community Support',
                description:
                    'Join a thriving community of drivers. Access to 24/7 support and training.',
            },
        ]
    },

    offers: [
        {
            title: '50% Off Your First Ride',
            description: 'New users get half off their first ride. Limited time offer!',
            code: 'FIRST50',
            color: 'from-blue-500 to-blue-600',
        },
        {
            title: 'Refer & Earn',
            description: 'Invite friends and earn ৳200 per successful referral.',
            code: 'REFER200',
            color: 'from-purple-500 to-purple-600',
        },
        {
            title: 'Weekend Bonanza',
            description: 'Get ৳500 in ride credits for bookings on weekends.',
            code: 'WEEKEND500',
            color: 'from-orange-500 to-orange-600',
        },
        {
            title: 'Monthly Subscription',
            description: 'Unlimited rides for ৳9,999/month. Save up to 40%.',
            code: 'MONTHLY',
            color: 'from-green-500 to-green-600',
        },
    ],
    testimonials: [
        {
            name: "Sarah Jenkins",
            role: "Daily Commuter",
            content: "RideFlow is a lifesaver! The drivers are always professional and the cars are clean.",
            avatar: testimonial.testimonial1
        },
        {
            name: "David Lee",
            role: "Driver Partner",
            content: "Driving with RideFlow gives me the flexibility I need. The pay is great too!",
            avatar: testimonial.testimonial2
        },
        {
            name: "Emily Chen",
            role: "Business User",
            content: "I use the rental service for all my client meetings. Highly recommended.",
            avatar: testimonial.testimonial3
        }
    ],
    appPromo: {
        title: "Ride on the Go",
        description: "Download the RideFlow app for the best experience. Available on iOS and Android.",
        image: app.appPromo
    },
    faq: [
        {
            question: 'How do I book a ride on RideHub?',
            answer:
                'Open the RideHub app, enter your pickup and destination, confirm the fare, and book. A nearby driver will be assigned within seconds.',
        },
        {
            question: 'Are RideHub drivers verified and safe?',
            answer:
                'Yes, all RideHub drivers go through thorough background checks, vehicle inspections, and regular safety audits. We prioritize your safety above everything.',
        },
        {
            question: 'What payment methods does RideHub accept?',
            answer:
                'We accept cash, card payments, mobile wallets (Bkash, Nagad, Rocket), and in-app wallet balance. Choose your preferred method during checkout.',
        },
        {
            question: 'How can I contact customer support?',
            answer:
                'You can reach our 24/7 customer support team via the app, phone at 1-800-RIDEHUB, email at support@ridehub.com, or live chat.',
        },
        {
            question: 'What is your cancellation policy?',
            answer:
                'You can cancel free of charge if you cancel within 30 seconds of booking. After that, a cancellation fee of ৳10-50 may apply depending on driver proximity.',
        },
        {
            question: 'How do I become a RideHub driver?',
            answer:
                'Visit our driver portal, submit your documents (ID, license, vehicle details), pass the background check, and start earning within 48 hours.',
        },
        {
            question: 'Do you offer insurance coverage?',
            answer:
                'Yes, all rides are covered by comprehensive insurance. Drivers are also protected with vehicle and liability coverage during active rides.',
        },
        {
            question: 'How are fares calculated?',
            answer:
                "Fares are calculated based on distance, time, demand, and current traffic conditions. You'll see the exact fare before confirming your booking.",
        },
    ]
}