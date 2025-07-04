import { NextRequest, NextResponse } from "next/server";
import ConnectDb from "../../../../../middleware/connectdb";
import PricingPlan from "../../../../../models/PricingPlan";

export const POST = async (req: NextRequest) => {
    try {
        await ConnectDb();
        
    

        // Clear existing plans (optional - remove if you want to keep existing)
        await PricingPlan.deleteMany({});
        console.log("Cleared existing pricing plans");

        // Define comprehensive pricing plans for chatbots
        const pricingPlans = [
            // Free Tier - Chatbot
            {
                name: "Starter",
                pcategory: "Chatbot - Free",
                features: [
                    "Up to 100 messages/month",
                    "1 knowledge base file (max 1MB)",
                    "Basic AI responses",
                    "Community support",
                    "Standard response time",
                    "Public deployment"
                ],
                ram: "512MB",
                cpu: "0.25 vCPU",
                bandwidth: "1GB",
                storage: "500MB",
                pricephour: "0",
                pricepmonth: "0",
                isfree: true
            },
            
            // Basic Chatbot Plan
            {
                name: "Basic",
                pcategory: "Chatbot - Standard",
                features: [
                    "Up to 1,000 messages/month",
                    "5 knowledge base files (max 10MB each)",
                    "Enhanced AI responses",
                    "Email support",
                    "Fast response time",
                    "Custom branding",
                    "Basic analytics",
                    "API access"
                ],
                ram: "1GB",
                cpu: "0.5 vCPU",
                bandwidth: "10GB",
                storage: "5GB",
                pricephour: "0.05",
                pricepmonth: "29",
                isfree: false
            },
            
            // Pro Chatbot Plan
            {
                name: "Professional",
                pcategory: "Chatbot - AI Enhanced",
                features: [
                    "Up to 10,000 messages/month",
                    "Unlimited knowledge base files",
                    "Advanced AI with context memory",
                    "Priority support",
                    "Ultra-fast response time",
                    "Advanced analytics",
                    "Custom domain",
                    "Webhook integrations",
                    "File upload support",
                    "Multi-language support"
                ],
                ram: "2GB",
                cpu: "1 vCPU",
                bandwidth: "50GB",
                storage: "20GB",
                pricephour: "0.15",
                pricepmonth: "99",
                isfree: false
            },
            
            // Enterprise Chatbot Plan
            {
                name: "Enterprise",
                pcategory: "Chatbot - Enterprise",
                features: [
                    "Unlimited messages",
                    "Unlimited knowledge base",
                    "Premium AI with fine-tuning",
                    "24/7 dedicated support",
                    "Instant response time",
                    "Advanced security features",
                    "Custom integrations",
                    "SSO authentication",
                    "Advanced compliance",
                    "Dedicated infrastructure",
                    "Custom AI training",
                    "Multi-region deployment"
                ],
                ram: "4GB",
                cpu: "2 vCPU",
                bandwidth: "200GB",
                storage: "100GB",
                pricephour: "0.50",
                pricepmonth: "299",
                isfree: false
            },

            // Standard App Platform Plans (for other project types)
            {
                name: "Hobby",
                pcategory: "Standard - Web Apps",
                features: [
                    "1 project",
                    "Custom domain",
                    "SSL certificate",
                    "Basic monitoring",
                    "Community support"
                ],
                ram: "512MB",
                cpu: "0.25 vCPU",
                bandwidth: "10GB",
                storage: "1GB",
                pricephour: "0.02",
                pricepmonth: "15",
                isfree: false
            },
            
            {
                name: "Pro",
                pcategory: "Standard - Web Apps",
                features: [
                    "5 projects",
                    "Advanced monitoring",
                    "Priority support",
                    "Auto-scaling",
                    "Database included",
                    "CI/CD pipeline"
                ],
                ram: "1GB",
                cpu: "0.5 vCPU",
                bandwidth: "50GB",
                storage: "10GB",
                pricephour: "0.08",
                pricepmonth: "49",
                isfree: false
            },

            // Database Plans
            {
                name: "Database Starter",
                pcategory: "Database - MySQL/PostgreSQL",
                features: [
                    "Single database instance",
                    "Auto backups",
                    "SSL encryption",
                    "Basic monitoring",
                    "Email support"
                ],
                ram: "1GB",
                cpu: "0.5 vCPU",
                bandwidth: "25GB",
                storage: "10GB",
                pricephour: "0.06",
                pricepmonth: "39",
                isfree: false
            },

            {
                name: "Database Pro",
                pcategory: "Database - Advanced",
                features: [
                    "High availability setup",
                    "Read replicas",
                    "Advanced monitoring",
                    "Point-in-time recovery",
                    "Priority support",
                    "Performance insights"
                ],
                ram: "2GB",
                cpu: "1 vCPU",
                bandwidth: "100GB",
                storage: "50GB",
                pricephour: "0.20",
                pricepmonth: "129",
                isfree: false
            },

            // Virtual Space Plans
            {
                name: "Developer",
                pcategory: "Virtual Space - Development",
                features: [
                    "Full development environment",
                    "Pre-installed tools",
                    "VS Code in browser",
                    "Git integration",
                    "Terminal access",
                    "File upload/download"
                ],
                ram: "2GB",
                cpu: "1 vCPU",
                bandwidth: "30GB",
                storage: "25GB",
                pricephour: "0.12",
                pricepmonth: "79",
                isfree: false
            },

            {
                name: "Team",
                pcategory: "Virtual Space - Collaboration",
                features: [
                    "Shared development environment",
                    "Real-time collaboration",
                    "Advanced IDE features",
                    "Docker support",
                    "Team management",
                    "Enhanced security"
                ],
                ram: "4GB",
                cpu: "2 vCPU",
                bandwidth: "100GB",
                storage: "100GB",
                pricephour: "0.30",
                pricepmonth: "199",
                isfree: false
            }
        ];

        // Insert all pricing plans
        const insertedPlans = await PricingPlan.insertMany(pricingPlans);
        
        console.log(`Successfully inserted ${insertedPlans.length} pricing plans`);
        
        return NextResponse.json({
            success: true,
            message: `Successfully seeded ${insertedPlans.length} pricing plans`,
            data: {
                totalPlans: insertedPlans.length,
                categories: [...new Set(pricingPlans.map(plan => plan.pcategory))],
                freeP: pricingPlans.filter(plan => plan.isfree).length,
                paidPlans: pricingPlans.filter(plan => !plan.isfree).length
            }
        });
        
    } catch (error: any) {
        console.error("Seed pricing plans error:", error);
        
        return NextResponse.json({
            success: false,
            message: "Error seeding pricing plans",
            error: error.message
        }, { status: 500 });
    }
};

// GET endpoint to view current plans (for verification)
export const GET = async () => {
    try {
        await ConnectDb();
        
        const plans = await PricingPlan.find({}).sort({ pricepmonth: 1 });
        const stats = {
            totalPlans: plans.length,
            categories: [...new Set(plans.map(plan => plan.pcategory))],
            freePlans: plans.filter(plan => plan.isfree).length,
            paidPlans: plans.filter(plan => !plan.isfree).length,
            priceRange: {
                min: Math.min(...plans.filter(p => !p.isfree).map(p => parseInt(p.pricepmonth))),
                max: Math.max(...plans.filter(p => !p.isfree).map(p => parseInt(p.pricepmonth)))
            }
        };
        
        return NextResponse.json({
            success: true,
            message: "Current pricing plans",
            stats,
            plans: plans.map(plan => ({
                id: plan._id,
                name: plan.name,
                category: plan.pcategory,
                price: plan.isfree ? "Free" : `$${plan.pricepmonth}/month`,
                features: plan.features?.length || 0,
                resources: {
                    ram: plan.ram,
                    cpu: plan.cpu,
                    storage: plan.storage
                }
            }))
        });
        
    } catch (error: any) {
        console.error("Get pricing plans error:", error);
        
        return NextResponse.json({
            success: false,
            message: "Error fetching pricing plans",
            error: error.message
        }, { status: 500 });
    }
};