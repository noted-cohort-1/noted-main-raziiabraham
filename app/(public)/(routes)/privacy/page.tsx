import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy - Noted",
    description: "Privacy Policy for Noted - Learn how we collect, use, and protect your data.",
};

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950">
            <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        Privacy Policy
                    </h1>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Last Updated: January 8, 2026
                    </p>
                </div>

                {/* Content */}
                <div className="prose prose-neutral max-w-none dark:prose-invert">
                    {/* Introduction */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                            Introduction
                        </h2>
                        <p className="text-neutral-700 dark:text-neutral-300">
                            Welcome to Noted. We respect your privacy and are committed to protecting your personal data.
                            This privacy policy explains how we collect, use, store, and protect your information when you
                            use our AI-powered note-taking and workspace application.
                        </p>
                    </section>

                    {/* Information We Collect */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                            Information We Collect
                        </h2>

                        <h3 className="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-200">
                            Account Information
                        </h3>
                        <ul className="mb-4 list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                            <li>Email address</li>
                            <li>Name</li>
                            <li>Profile picture (optional)</li>
                            <li>Authentication credentials (managed securely by Clerk)</li>
                        </ul>

                        <h3 className="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-200">
                            Content and Files
                        </h3>
                        <ul className="mb-4 list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                            <li>Documents, notes, and content you create</li>
                            <li>Files and images you upload</li>
                            <li>AI-generated content and interactions</li>
                            <li>Document metadata (creation date, modification history)</li>
                        </ul>

                        <h3 className="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-200">
                            Usage Information
                        </h3>
                        <ul className="mb-4 list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                            <li>Device information and browser type</li>
                            <li>IP address and location data</li>
                            <li>Usage patterns and feature interactions</li>
                            <li>Error logs and diagnostic data</li>
                        </ul>

                        <h3 className="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-200">
                            AI Provider Information
                        </h3>
                        <ul className="mb-4 list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                            <li>API keys you provide for AI services (OpenAI, Anthropic, Google)</li>
                            <li>AI model preferences and settings</li>
                            <li>Prompts and AI-generated responses</li>
                        </ul>
                    </section>

                    {/* How We Use Your Information */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                            How We Use Your Information
                        </h2>
                        <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                            We use your information to:
                        </p>
                        <ul className="mb-4 list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                            <li>Provide, maintain, and improve our services</li>
                            <li>Process and store your documents and files</li>
                            <li>Enable AI features using your provided API keys</li>
                            <li>Authenticate and secure your account</li>
                            <li>Send important service notifications</li>
                            <li>Analyze usage patterns to enhance user experience</li>
                            <li>Prevent fraud and ensure platform security</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    {/* Data Storage and Security */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                            Data Storage and Security
                        </h2>
                        <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                            Your data is stored securely using:
                        </p>
                        <ul className="mb-4 list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                            <li><strong>Convex:</strong> For database and real-time data synchronization</li>
                            <li><strong>EdgeStore:</strong> For secure file storage</li>
                            <li><strong>Clerk:</strong> For authentication and user management</li>
                        </ul>
                        <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                            We implement industry-standard security measures including encryption in transit and at rest,
                            regular security audits, and access controls to protect your data from unauthorized access,
                            disclosure, or destruction.
                        </p>
                    </section>

                    {/* AI Services and Third Parties */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                            AI Services and Third-Party Providers
                        </h2>
                        <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                            When you use AI features with your own API keys:
                        </p>
                        <ul className="mb-4 list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                            <li>Your content is sent to the AI provider you selected (OpenAI, Anthropic, or Google)</li>
                            <li>API keys are encrypted and stored securely</li>
                            <li>We do not access or store your API keys in plain text</li>
                            <li>AI providers may process your data according to their own privacy policies</li>
                            <li>You are responsible for reviewing and accepting each AI provider's terms</li>
                        </ul>
                        <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                            We recommend reviewing the privacy policies of:
                        </p>
                        <ul className="mb-4 list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                            <li>OpenAI: <a href="https://openai.com/privacy" className="text-blue-600 hover:underline dark:text-blue-400">openai.com/privacy</a></li>
                            <li>Anthropic: <a href="https://www.anthropic.com/privacy" className="text-blue-600 hover:underline dark:text-blue-400">anthropic.com/privacy</a></li>
                            <li>Google: <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline dark:text-blue-400">policies.google.com/privacy</a></li>
                        </ul>
                    </section>

                    {/* Data Sharing */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                            Data Sharing
                        </h2>
                        <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                            We do not sell your personal data. We may share your information only in the following circumstances:
                        </p>
                        <ul className="mb-4 list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                            <li><strong>With your consent:</strong> When you explicitly authorize us to share information</li>
                            <li><strong>Service providers:</strong> With trusted third-party services that help us operate (Convex, EdgeStore, Clerk)</li>
                            <li><strong>Legal requirements:</strong> When required by law or to protect our legal rights</li>
                            <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                        </ul>
                    </section>

                    {/* Your Rights */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                            Your Rights
                        </h2>
                        <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                            You have the right to:
                        </p>
                        <ul className="mb-4 list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                            <li><strong>Access:</strong> Request a copy of your personal data</li>
                            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                            <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                            <li><strong>Export:</strong> Download your documents and files</li>
                            <li><strong>Portability:</strong> Transfer your data to another service</li>
                            <li><strong>Opt-out:</strong> Decline certain data processing activities</li>
                        </ul>
                        <p className="text-neutral-700 dark:text-neutral-300">
                            To exercise these rights, please contact us through the settings page or email us directly.
                        </p>
                    </section>

                    {/* Data Retention */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                            Data Retention
                        </h2>
                        <p className="text-neutral-700 dark:text-neutral-300">
                            We retain your data for as long as your account is active or as needed to provide services.
                            When you delete your account, we will delete or anonymize your personal data within 30 days,
                            except where we are required to retain it for legal or regulatory purposes.
                        </p>
                    </section>

                    {/* Cookies and Tracking */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                            Cookies and Tracking
                        </h2>
                        <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                            We use cookies and similar technologies to:
                        </p>
                        <ul className="mb-4 list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                            <li>Maintain your session and authentication state</li>
                            <li>Remember your preferences and settings</li>
                            <li>Analyze usage patterns and improve performance</li>
                        </ul>
                        <p className="text-neutral-700 dark:text-neutral-300">
                            You can control cookies through your browser settings, but disabling them may affect functionality.
                        </p>
                    </section>

                    {/* Children's Privacy */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                            Children's Privacy
                        </h2>
                        <p className="text-neutral-700 dark:text-neutral-300">
                            Noted is not intended for users under the age of 13. We do not knowingly collect personal
                            information from children. If you believe a child has provided us with personal data,
                            please contact us immediately.
                        </p>
                    </section>

                    {/* International Data Transfers */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                            International Data Transfers
                        </h2>
                        <p className="text-neutral-700 dark:text-neutral-300">
                            Your data may be transferred to and processed in countries other than your own. We ensure
                            appropriate safeguards are in place to protect your data in accordance with this privacy policy
                            and applicable data protection laws.
                        </p>
                    </section>

                    {/* Changes to Privacy Policy */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                            Changes to This Privacy Policy
                        </h2>
                        <p className="text-neutral-700 dark:text-neutral-300">
                            We may update this privacy policy from time to time. We will notify you of significant changes
                            by posting the new policy on this page and updating the "Last Updated" date. Your continued use
                            of Noted after changes constitutes acceptance of the updated policy.
                        </p>
                    </section>

                    {/* Contact Information */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                            Contact Us
                        </h2>
                        <p className="text-neutral-700 dark:text-neutral-300">
                            If you have questions about this privacy policy or our data practices, please contact us at:
                        </p>
                        <div className="mt-4 rounded-lg bg-neutral-50 p-4 dark:bg-neutral-900">
                            <p className="text-neutral-700 dark:text-neutral-300">
                                Email: <a href="mailto:razii.abrhm@gmail.com" className="text-blue-600 hover:underline dark:text-blue-400">razii.abrhm@gmail.com</a>
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
