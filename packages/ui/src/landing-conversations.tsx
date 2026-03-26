"use client"

import * as React from "react"
import { MessageCircle } from "lucide-react"
import { cn } from "@repo/utils"

interface Message {
    sender: string
    message: string
    time: string
    isAgent?: boolean
}

interface Conversation {
    clientName: string
    status: string
    messages: Message[]
}

interface LandingConversationsProps {
    sectionTitle: string
    conversations: Conversation[]
    className?: string
}

function StatusBadge({ status }: { status: string }) {
    const isActive =
        status.toLowerCase() === "active" ||
        status.toLowerCase() === "en cours" ||
        status.toLowerCase() === "en ligne"

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
            )}
        >
            <span
                className={cn(
                    "size-1.5 rounded-full",
                    isActive ? "bg-green-500" : "bg-gray-400"
                )}
            />
            {status}
        </span>
    )
}

function ChatBubble({ message }: { message: Message }) {
    const isAgent = message.isAgent ?? false

    return (
        <div
            className={cn(
                "flex flex-col max-w-[80%] gap-1",
                isAgent ? "items-start self-start" : "items-end self-end"
            )}
        >
            <span
                className={cn(
                    "text-[11px] font-medium px-1",
                    isAgent ? "text-gray-500" : "text-green-700"
                )}
            >
                {message.sender}
            </span>
            <div
                className={cn(
                    "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                    isAgent
                        ? "bg-white text-gray-800 rounded-tl-md border border-gray-100"
                        : "bg-green-500 text-white rounded-tr-md"
                )}
            >
                {message.message}
            </div>
            <span className="text-[10px] text-gray-400 px-1">
                {message.time}
            </span>
        </div>
    )
}

function ConversationCard({ conversation }: { conversation: Conversation }) {
    return (
        <div className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-5 py-3.5">
                <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent">
                        <MessageCircle className="size-4" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                        {conversation.clientName}
                    </span>
                </div>
                <StatusBadge status={conversation.status} />
            </div>

            {/* Messages */}
            <div className="flex flex-col gap-3 p-4 bg-gray-50/30 min-h-[280px]">
                {conversation.messages.map((message, index) => (
                    <ChatBubble key={index} message={message} />
                ))}
            </div>
        </div>
    )
}

function LandingConversations({
    sectionTitle,
    conversations,
    className,
}: LandingConversationsProps) {
    return (
        <section className={cn("py-16 md:py-24", className)}>
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                {/* Title */}
                <div className="flex items-center justify-center gap-3 mb-12 md:mb-16">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-brand-accent/10">
                        <MessageCircle className="size-5 text-brand-accent" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                        {sectionTitle}
                    </h2>
                </div>

                {/* Conversation Columns */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {conversations.map((conversation, index) => (
                        <ConversationCard
                            key={index}
                            conversation={conversation}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export {
    LandingConversations,
    type LandingConversationsProps,
    type Conversation,
    type Message,
}
