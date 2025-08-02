"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Shield, Eye, Lock, Database, Users, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ff4e50] to-[#f9d423]">
      <div className="container mx-auto py-8 max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/signup">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sign Up
            </Button>
          </Link>
        </div>

        {/* Title */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-[#f9d423]" />
            <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
          </div>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-white/70 text-sm">
            Last updated: August 2, 2025
          </p>
        </div>

        {/* Privacy Content */}
        <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
          <CardContent className="p-8 space-y-8">
            
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Eye className="h-6 w-6 mr-2 text-[#f9d423]" />
                1. Information We Collect
              </h2>
              <div className="text-white/90 space-y-3">
                <p>
                  We collect information you provide directly to us when you create an account, use our services, 
                  or communicate with us. This includes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-white">Personal Information:</strong> Name, email address, username, department, and role</li>
                  <li><strong className="text-white">Support Data:</strong> Tickets you create, comments, attachments, and communication history</li>
                  <li><strong className="text-white">Usage Information:</strong> How you interact with our service, features used, and preferences</li>
                  <li><strong className="text-white">Device Information:</strong> IP address, browser type, operating system, and device identifiers</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Database className="h-6 w-6 mr-2 text-[#f9d423]" />
                2. How We Use Your Information
              </h2>
              <div className="text-white/90 space-y-3">
                <p>
                  We use the information we collect to provide, maintain, and improve our services. Specifically, we use your information to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide customer support and resolve technical issues</li>
                  <li>Create and manage your account</li>
                  <li>Process and respond to support tickets</li>
                  <li>Send important notifications about your account or service updates</li>
                  <li>Analyze usage patterns to improve our service</li>
                  <li>Ensure security and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Users className="h-6 w-6 mr-2 text-[#f9d423]" />
                3. Information Sharing
              </h2>
              <div className="text-white/90 space-y-3">
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-white">Within Your Organization:</strong> Support agents and administrators in your organization may access your tickets and related information</li>
                  <li><strong className="text-white">Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our service</li>
                  <li><strong className="text-white">Legal Requirements:</strong> We may disclose information when required by law or to protect our rights and safety</li>
                  <li><strong className="text-white">Business Transfers:</strong> Information may be transferred in connection with a merger, acquisition, or sale of assets</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Lock className="h-6 w-6 mr-2 text-[#f9d423]" />
                4. Data Security
              </h2>
              <div className="text-white/90 space-y-3">
                <p>
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication requirements</li>
                  <li>Employee training on data protection practices</li>
                  <li>Incident response procedures</li>
                </ul>
                <p>
                  However, no method of transmission over the Internet or electronic storage is 100% secure. 
                  While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">5. Data Retention</h2>
              <div className="text-white/90 space-y-3">
                <p>
                  We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-white">Account Information:</strong> Retained while your account is active and for a reasonable period after closure</li>
                  <li><strong className="text-white">Support Tickets:</strong> Retained for historical reference and service improvement purposes</li>
                  <li><strong className="text-white">Usage Logs:</strong> Typically retained for 12 months for security and analytics purposes</li>
                </ul>
                <p>
                  We may retain certain information for longer periods if required by law or to resolve disputes.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">6. Your Rights</h2>
              <div className="text-white/90 space-y-3">
                <p>
                  Depending on your location, you may have certain rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-white">Access:</strong> Request access to your personal information</li>
                  <li><strong className="text-white">Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong className="text-white">Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong className="text-white">Portability:</strong> Request a copy of your data in a portable format</li>
                  <li><strong className="text-white">Objection:</strong> Object to certain processing of your information</li>
                  <li><strong className="text-white">Restriction:</strong> Request restriction of processing in certain circumstances</li>
                </ul>
                <p>
                  To exercise these rights, please contact us using the information provided below.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">7. Cookies and Tracking</h2>
              <div className="text-white/90 space-y-3">
                <p>
                  We use cookies and similar tracking technologies to enhance your experience on our service:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-white">Essential Cookies:</strong> Required for basic functionality and security</li>
                  <li><strong className="text-white">Preference Cookies:</strong> Remember your settings and preferences</li>
                  <li><strong className="text-white">Analytics Cookies:</strong> Help us understand how you use our service</li>
                </ul>
                <p>
                  You can control cookie settings through your browser preferences, though disabling certain cookies may affect functionality.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">8. Children's Privacy</h2>
              <div className="text-white/90 space-y-3">
                <p>
                  Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. 
                  If you are a parent or guardian and believe your child has provided us with personal information, please contact us to have it removed.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">9. Changes to This Policy</h2>
              <div className="text-white/90 space-y-3">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page 
                  and updating the "Last updated" date. For significant changes, we may also send you an email notification.
                </p>
                <p>
                  We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Mail className="h-6 w-6 mr-2 text-[#f9d423]" />
                10. Contact Us
              </h2>
              <div className="text-white/90 space-y-3">
                <p>
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                  <p><strong className="text-white">Privacy Officer:</strong> privacy@quickdesk.com</p>
                  <p><strong className="text-white">General Contact:</strong> support@quickdesk.com</p>
                  <p><strong className="text-white">Address:</strong> 123 Support Street, Help City, HC 12345</p>
                  <p><strong className="text-white">Phone:</strong> (555) 123-4567</p>
                </div>
              </div>
            </section>

          </CardContent>
        </Card>

        {/* Footer Actions */}
        <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Understanding Our Privacy Practices</h3>
            <p className="text-white/70 mb-4">
              We're committed to protecting your privacy and being transparent about our data practices.
            </p>
            <div className="flex justify-center space-x-3">
              <Link href="/signup">
                <Button className="bg-white text-[#ff4e50] hover:bg-white/90 font-semibold">
                  Return to Sign Up
                </Button>
              </Link>
              <Link href="/terms">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Read Terms of Service
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
