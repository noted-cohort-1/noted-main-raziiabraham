import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service - Noted",
    description: "Terms of Service for Noted - Read our terms and conditions for using our service.",
};

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950">
            <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        Terms of Service
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
                            Agreement to Terms
                        </h2>
                        <p className="text-neutral-700 dark:text-neutral-300">
                            By accessing or using Noted ("Service", "we", "us", or "our"), you agree to be bound by these
                            Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service.
                        </p>
                        <p className="mt-4 text-neutral-700 dark:text-neutral-300">
                            These Terms constitute a legally binding agreement between you and Noted. Please read them carefully.
                        </p>
                    </section>

                    {/* Account Registration */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                            Account Registration and Security
                        </h2>
                        <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                            To use Noted, you must create an account. You agree to:
                        </p>
                        <ul className="mb-4 list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                            <li>Provide accurate, current, and complete information</li>
                            <li>Maintain and update your information to keep it accurate</li>
                            <li>Maintain the security of your account credentials</li>
                            <li>Be responsible for all activities under your account</li>
                            <li>Notify us immediately of any unauthorized access</li>
                            <li>Not share your account with others</li>
                        </ul>
                        <p className="text-neutral-700 dark:text-neutral-300">
                            You must be at least 13 years old to use Noted. If you are under 18, you represent that you have
                            your parent or guardian's permission to use the Service.
                        </p>
                    </section>

                    {/* Acceptable Use */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                            Acceptable Use Policy
                        </h2>
                        <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                            You agree to use Noted only for lawful purposes. You must not:
                        </p>
                        <ul className="mb-4 list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                            <li>Violate any applicable laws or regulations</li>
                            <li>Infringe on intellectual property rights of others</li>
                            <li>Upload malicious code, viruses, or harmful content</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Use the Service to harass, abuse, or harm others</li>
                            <li>Transmit spam or unsolicited communications</li>
                            <li>Impersonate any person or entity</li>
                            <li>Scrape, data mine, or use automated tools without permission</li>
                            <li>Interfere with or disrupt the Service or servers</li>
                            <li>Use the Service for any illegal or fraudulent activity</li>
                            <li>Store or share illegal, offensive, or inappropriate content</li>
                        </ul>
                        <p className="text-neutral-700 dark:text-neutral-300">
                            We reserve the right to investigate and take appropriate action against anyone who violates these
                            terms, including removing content, suspending, or terminating accounts.
                        </p>
                    </section>

                    {/* Your Content */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                            Your Content and Data
                        </h2>
                        <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                            You retain all rights to the content you create, upload, or store in Noted ("Your Content").
                            By using the Service, you grant us a limited license to:
                        </p>
                        <ul className="mb-4 list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                            <li>Store, process, and transmit Your Content to provide the Service</li>
                            <li>Back up Your Content to prevent data loss</li>
                            <li>Use Your Content to improve and develop the Service (in anonymized form)</li>
                        </ul>
                        <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                            You represent and warrant that:
                        </p>
                        <ul className="mb-4 list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                            <li>You own or have the necessary rights to Your Content</li>
                            <li>Your Content does not violate any laws or third-party rights</li>
                            <li>Your Content does not contain malicious code or harmful material</li>
                        </ul>
                        <p className="text-neutral-700 dark:text-neutral-300">
                            We are not responsible for the content you create or upload. You are solely responsible for
                            backing up Your Content independently.
                        </p>
                    </section>

                    {/* AI Features */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                            AI Features and Services
                        </h2>
                        <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                            Noted offers AI-powered features that require you to provide your own API keys for third-party
                            AI services (OpenAI, Anthropic, Google). By using these features:
                        </p>
                        <ul className="mb-4 list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                            <li>You must comply with the terms of service of the AI provider you select</li>
                            <li>You are responsible for any costs incurred with the AI provider</li>
                            <li>You acknowledge that AI-generated content may be inaccurate or inappropriate</li>
                            <li>We are not liable for AI-generated content or its accuracy</li>
                            <li>You must not use AI features for prohibited purposes</li>
                            <li>You agree to review and validate all AI-generated content</li>
                        </ul>
                        <p className="text-neutral-700 dark:text-neutral-300">
                            We do not guarantee the availability, accuracy, or quality of AI services, which are provided
                            by third parties.
                        </p>
                    </section>

                    {/* Intellectual Property */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                            Intellectual Property Rights
                        </h2>
                        <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                            The Service, including its software, design, graphics, text, and other content (excluding Your Content),
                            is owned by Noted and is protected by copyright, trademark, and other intellectual property laws.
                        </p>
                        <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                            You may not:
                        </p>
                        <ul className="mb-4 list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                            <li>Copy, modify, or distribute our proprietary content</li>
                            <li>Reverse engineer or decompile the Service</li>
                            <li>Remove or alter any copyright or proprietary notices</li>
                            <li>Use our trademarks without permission</li>
                            <li>Create derivative works based on the Service</li>
                        </ul>
                        <p className="text-neutral-700 dark:text-neutral-300">
                            All rights not expressly granted to you are reserved by Noted.
                        </p>
                    </section>

                    {/* Storage and File Limits */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                            Storage Limits and File Management
                        </h2>
                        <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                            Your account may be subject to storage limits. We reserve the right to:
                        </p>
                        <ul className="mb-4 list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                            <li>Enforce storage quotas and file size limits</li>
                            <li>Prevent uploads that exceed your storage limit</li>
                            <li>Offer paid plans with increased storage capacity</li>
                            <li>Remove or compress files to maintain system performance</li>
                        </ul>
                        <p className="text-neutral-700 dark:text-neutral-300">
                            We recommend regularly backing up your important data to prevent data loss.
                        </p>
                    </section>

                    {/* Service Availability */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                            Service Availability and Changes
                        </h2>
                        <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                            We strive to provide reliable service, but we do not guarantee uninterrupted access. We reserve
                            the right to:
                        </p>
                        <ul className="mb-4 list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                            <li>Modify, suspend, or discontinue any part of the Service</li>
                            <li>Perform maintenance and updates</li>
                            <li>Change features, functionality, or pricing with notice</li>
                            <li>Impose usage limits or restrictions</li>
                        </ul>
                        <p className="text-neutral-700 dark:text-neutral-300">
                            We will provide reasonable notice of material changes, but are not liable for any disruption
                            to your use of the Service.
                        </p>
                    </section>

                    {/* Termination */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                            Termination
                        </h2>
                        <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                            You may terminate your account at any time through the settings page. We may suspend or
                            terminate your access to the Service:
                        </p>
                        <ul className="mb-4 list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                            <li>If you violate these Terms</li>
                            <li>If your account is inactive for an extended period</li>
                            <li>If required by law or regulatory authorities</li>
                            <li>For any reason, with or without notice, at our discretion</li>
                        </ul>
                        <p className="text-neutral-700 dark:text-neutral-300">
                            Upon termination, your right to use the Service will immediately cease. We will make reasonable
                            efforts to allow you to export Your Content before account deletion, but we are not obligated to
                            retain Your Content after termination.
                        </p>
                    </section>

                    {/* Disclaimers */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                            Disclaimers
                        </h2>
                        <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER
                            EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                        </p>
                        <ul className="mb-4 list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                            <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
                            <li>Warranties regarding accuracy, reliability, or availability of the Service</li>
                            <li>Warranties that the Service will be error-free or uninterrupted</li>
                            <li>Warranties regarding the security or integrity of Your Content</li>
                        </ul>
                        <p className="text-neutral-700 dark:text-neutral-300">
                            We do not warrant that the Service will meet your requirements or that any errors will be corrected.
                            You use the Service at your own risk.
                        </p>
                    </section>

                    {/* Limitation of Liability */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                            Limitation of Liability
                        </h2>
                        <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, NOTED AND ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES,
                            AND AGENTS SHALL NOT BE LIABLE FOR:
                        </p>
                        <ul className="mb-4 list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                            <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                            <li>Loss of profits, revenue, data, or use</li>
                            <li>Cost of substitute services</li>
                            <li>Any damages arising from your use or inability to use the Service</li>
                            <li>Unauthorized access to or alteration of Your Content</li>
                            <li>Actions or omissions of third-party services (AI providers, etc.)</li>
                        </ul>
                        <p className="text-neutral-700 dark:text-neutral-300">
                            OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM YOUR USE OF THE SERVICE SHALL NOT EXCEED
                            THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM, OR $100, WHICHEVER IS GREATER.
                        </p>
                    </section>

                    {/* Indemnification */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                            Indemnification
                        </h2>
                        <p className="text-neutral-700 dark:text-neutral-300">
                            You agree to indemnify, defend, and hold harmless Noted and its affiliates from any claims,
                            damages, losses, liabilities, and expenses (including legal fees) arising from:
                        </p>
                        <ul className="mb-4 list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                            <li>Your use of the Service</li>
                            <li>Your violation of these Terms</li>
                            <li>Your violation of any third-party rights</li>
                            <li>Your Content or any content you submit</li>
                            <li>Your use of AI features or third-party services</li>
                        </ul>
                    </section>

                    {/* Dispute Resolution */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                            Dispute Resolution and Governing Law
                        </h2>
                        <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                            These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction],
                            without regard to conflict of law provisions.
                        </p>
                        <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                            Any disputes arising from these Terms or your use of the Service shall be resolved through:
                        </p>
                        <ul className="mb-4 list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                            <li>Good faith negotiation between the parties</li>
                            <li>Binding arbitration if negotiation fails</li>
                            <li>The exclusive jurisdiction of courts in [Your Jurisdiction] for non-arbitrable disputes</li>
                        </ul>
                    </section>

                    {/* General Provisions */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                            General Provisions
                        </h2>

                        <h3 className="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-200">
                            Changes to Terms
                        </h3>
                        <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                            We may revise these Terms from time to time. We will provide notice of material changes by
                            posting the updated Terms on this page with a new "Last Updated" date. Your continued use of
                            the Service after changes constitutes acceptance of the new Terms.
                        </p>

                        <h3 className="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-200">
                            Severability
                        </h3>
                        <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                            If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions
                            will remain in full force and effect.
                        </p>

                        <h3 className="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-200">
                            Entire Agreement
                        </h3>
                        <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                            These Terms, along with our Privacy Policy, constitute the entire agreement between you and
                            Noted regarding the Service.
                        </p>

                        <h3 className="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-200">
                            Waiver
                        </h3>
                        <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                            Our failure to enforce any right or provision of these Terms will not constitute a waiver of
                            such right or provision.
                        </p>
                    </section>

                    {/* Contact Information */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                            Contact Us
                        </h2>
                        <p className="text-neutral-700 dark:text-neutral-300">
                            If you have questions about these Terms of Service, please contact us at:
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
