import { NextResponse, NextRequest } from 'next/server';
import { OpenAI } from "openai";
import { appplatform } from '../../../functions/appPlatform';
import { createDatabase } from '../../../functions/createDatabase';
import { CreateWebbuilder } from '../../../functions/createWebbuilder';
import { createChatbot } from '../../../functions/createChatbot';
import { CreateVirtualSpace } from '../../../functions/createVirtualSpace';
import {cookies} from 'next/headers';
// In-memory storage for conversation state (in production, use Redis or database)
const conversationMemory = new Map();

export async function POST(request) {
    try {
        const cookieStore = await cookies();
        console.log('Cookies:', cookieStore.getAll());
        const value = cookieStore.get("token").value;
       
        const body = await request.json();
        const { messages, sessionId } = body;

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ 
                error: 'Messages array is required', 
                status: 400, 
                success: false 
            });
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY, // Fixed: removed NEXT_PUBLIC_ prefix
        });

        // Get or create conversation state
        const sessionKey = sessionId || 'default';
        if (!conversationMemory.has(sessionKey)) {
            conversationMemory.set(sessionKey, {
                pendingAction: null,
                collectedData: {},
                step: 0
            });
        }

        const conversationState = conversationMemory.get(sessionKey);

        const tools = [{
            "type": "function",
            "function": {
                "name": "appplatform",
                "description": "deploy a web application to aws using the deploylite app platform",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string",
                            "description": "enter the name of the project you want to deploy"
                        },
                        "env": {
                            "type": "string",
                            "description": "enter the environment variables you want to set for the project"
                        }
                    },
                    "required": ["name", "env"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "createDatabase",
                "description": "create a database for the project",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "dbname": {
                            "type": "string",
                            "description": "enter the name of the database you want to deploy"
                        },
                        "dbuser": {
                            "type": "string",
                            "description": "enter the username for the database you want to deploy"
                        },
                        "dbpass": {
                            "type": "string",
                            "description": "enter the password for the database you want to deploy"
                        },
                        "dbtype": {
                            "type": "string",
                            "description": "enter the type of database (mysql, mongodb, redis, qdrant)"
                        }
                    },
                    "required": ["dbname", "dbuser", "dbpass", "dbtype"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "createWebbuilder",
                "description": "create a web builder project like wordpress",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string",
                            "description": "enter the name of the project you want to deploy"
                        }
                    },
                    "required": ["name"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "createChatbot",
                "description": "create a chatbot builder for the user",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string",
                            "description": "enter the name of the chatbot you want to create"
                        },
                        "openaiapikey": {
                            "type": "string",
                            "description": "enter your openai api key"
                        },
                        "googleapikey": {
                            "type": "string",
                            "description": "enter your google api key"
                        }
                    },
                    "required": ["name", "openaiapikey", "googleapikey"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "createVirtualSpace",
                "description": "create a virtual space for the user",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string",
                            "description": "enter the name of the virtual space you want to create"
                        },
                        "password": {
                            "type": "string",
                            "description": "enter the password for the virtual space you want to create"
                        }
                    },
                    "required": ["name", "password"]
                }
            }
        }];

        const systemPrompt = `
        You are a helpful AI assistant that can answer questions about Deploylite and help users deploy applications.
        
        Here is the context about Deploylite:
        <CONTEXT>
        This AI-powered platform automates software deployment using simple text or voice commands. It helps developers launch apps, manage code, configure cloud setups, and collaborate — all through a smart agent that understands natural language.

        Key Features:
        - Dashboard: See total deployments, active projects, success rate, and trends
        - Virtual Space: Real-time, multi-user coding like VS Code in the cloud
        - App Platform: Create & manage projects with auto-detection of tech stack
        - DockerGen: AI Dockerfile Generator
        - Web Builder: WordPress deployment flow
        - Database Module: Supports MySQL, MongoDB, Redis, Valkey, Qdrant
        - Cloud Hub: Connect cloud accounts securely
        </CONTEXT>

        You have access to several tools to help users:
        1. appplatform - Deploy web applications to AWS
        2. createDatabase - Create databases (MySQL, MongoDB, Redis, Qdrant)
        3. createWebbuilder - Create WordPress-like web builder projects
        4. createChatbot - Create chatbot builders
        5. createVirtualSpace - Create virtual collaboration spaces

        When users request deployments or creations, gather all required information step by step before making function calls.
        Always be helpful and guide users through the process clearly.
        `;

        // Add system message and conversation history
        const conversationMessages = [
            { role: "system", content: systemPrompt },
            ...messages
        ];

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: conversationMessages,
            tools,
            tool_choice: "auto"
        });

        const assistantMessage = response.choices[0].message;
        let responseMessage = assistantMessage.content;
        let toolResults = [];

        // Handle tool calls
        if (assistantMessage.tool_calls) {
            for (const toolCall of assistantMessage.tool_calls) {
                const functionName = toolCall.function.name;
                const functionArgs = JSON.parse(toolCall.function.arguments);

                try {
                    let result;
                    switch (functionName) {
                        case 'appplatform':
                            result = await appplatform(functionArgs.name, functionArgs.env,value);
                            toolResults.push({
                                tool: 'appplatform',
                                result: result,
                                message: `Your app "${functionArgs.name}" deployed successfully! Project ID: ${result.projectId || 'N/A'}`
                            });
                            break;

                        case 'createDatabase':
                            result = await createDatabase(
                                functionArgs.dbname,
                                functionArgs.dbuser,
                                functionArgs.dbpass,
                                functionArgs.dbtype,
                                value
                            );
                            toolResults.push({
                                tool: 'createDatabase',
                                result: result,
                                message: `Your ${functionArgs.dbtype} database "${functionArgs.dbname}" created successfully! Project ID: ${result.projectId || 'N/A'}`
                            });
                            break;

                        case 'createWebbuilder':
                            result = await CreateWebbuilder(functionArgs.name,value);
                            toolResults.push({
                                tool: 'createWebbuilder',
                                result: result,
                                message: `Your web builder project "${functionArgs.name}" created successfully! Project ID: ${result.projectId || 'N/A'}`
                            });
                            break;

                        case 'createChatbot':
                            result = await createChatbot(
                                functionArgs.name,
                                functionArgs.openaiapikey,
                                functionArgs.googleapikey,
                                value
                            );
                            toolResults.push({
                                tool: 'createChatbot',
                                result: result,
                                message: `Your chatbot "${functionArgs.name}" created successfully! Project ID: ${result.projectId || 'N/A'}`
                            });
                            break;

                        case 'createVirtualSpace':
                            result = await CreateVirtualSpace(functionArgs.name, functionArgs.password,value);
                            toolResults.push({
                                tool: 'createVirtualSpace',
                                result: result,
                                message: `Your virtual space "${functionArgs.name}" created successfully! Project ID: ${result.projectId || 'N/A'}`
                            });
                            break;

                        default:
                            throw new Error(`Unknown function: ${functionName}`);
                    }
                } catch (error) {
                    console.error(`Error executing ${functionName}:`, error);
                    toolResults.push({
                        tool: functionName,
                        error: error.message,
                        message: `Sorry, there was an error creating your ${functionName.replace('create', '').toLowerCase()}. Please try again.`
                    });
                }
            }
        }

        // Update conversation memory
        conversationMemory.set(sessionKey, conversationState);

        // Prepare response
        const finalResponse = {
            message: responseMessage,
            toolResults: toolResults,
            success: true,
            sessionId: sessionKey
        };

        return NextResponse.json(finalResponse);

    } catch (err) {
        console.error('Error in agent route:', err);
        return NextResponse.json({ 
            error: 'Internal Server Error', 
            details: err.message,
            status: 500, 
            success: false 
        });
    }
}

// Optional: Add cleanup for memory management
export async function DELETE(request) {
    try {
        const body = await request.json();
        const { sessionId } = body;
        
        if (sessionId && conversationMemory.has(sessionId)) {
            conversationMemory.delete(sessionId);
            return NextResponse.json({ 
                message: 'Session cleared successfully', 
                success: true 
            });
        }
        
        return NextResponse.json({ 
            message: 'Session not found', 
            success: false 
        });
    } catch (err) {
        return NextResponse.json({ 
            error: 'Error clearing session', 
            status: 500, 
            success: false 
        });
    }
}