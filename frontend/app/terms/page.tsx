"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, FileText, Shield, Users, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
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
            <FileText className="h-8 w-8 text-[#f9d423]" />
            <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
          </div>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Please read these terms and conditions carefully before using QuickDesk.
          </p>
          <p className="text-white/70 text-sm">
            Last updated: August 2, 2025
          </p>
        </div>

        {/* Terms Content */}
        <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
          <CardContent className="p-8 space-y-8">
            
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Users className="h-6 w-6 mr-2 text-[#f9d423]" />
                1. Acceptance of Terms
              </h2>
              <div className="text-white/90 space-y-3">
                <p>
                  By accessing and using QuickDesk, you accept and agree to be bound by the terms and provision of this agreement. 
                  If you do not agree to abide by the above, please do not use this service.
                </p>
                <p>
                  These terms apply to all users of the service, including without limitation users who are browsers, 
                  vendors, customers, merchants, and/or contributors of content.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Shield className="h-6 w-6 mr-2 text-[#f9d423]" />
                2. Use License
              </h2>
              <div className="text-white/90 space-y-3">
                <p>
                  Permission is granted to temporarily download one copy of QuickDesk per device for personal, 
                  non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                  <li>attempt to decompile or reverse engineer any software contained on the website</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
                <p>
                  This license shall automatically terminate if you violate any of these restrictions and may be terminated 
                  by us at any time. Upon terminating your viewing of these materials or upon the termination of this license, 
                  you must destroy any downloaded materials in your possession whether in electronic or printed format.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Eye className="h-6 w-6 mr-2 text-[#f9d423]" />
                3. User Accounts
              </h2>
              <div className="text-white/90 space-y-3">
                <p>
                  When you create an account with us, you must provide information that is accurate, complete, and current at all times. 
                  You are responsible for safeguarding the password and for keeping your account information up to date.
                </p>
                <p>
                  You agree not to disclose your password to any third party and to take sole responsibility for any activities 
                  or actions under your account, whether or not you have authorized such activities or actions.
                </p>
                <p>
                  You must immediately notify us of any unauthorized uses of your account or any other breaches of security.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">4. Acceptable Use</h2>
              <div className="text-white/90 space-y-3">
                <p>
                  You may not use QuickDesk for any unlawful purpose or to solicit others to perform such acts. 
                  You agree not to use the service to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violate any local, state, national, or international law</li>
                  <li>Transmit or distribute content that is harmful, offensive, or inappropriate</li>
                  <li>Interfere with or disrupt the service or servers connected to the service</li>
                  <li>Attempt to gain unauthorized access to any portion of the service</li>
                  <li>Use the service to spam, phish, or engage in other fraudulent activities</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">5. Service Availability</h2>
              <div className="text-white/90 space-y-3">
                <p>
                  We strive to provide uninterrupted access to QuickDesk, but we do not guarantee that the service will be 
                  available at all times. The service may be temporarily unavailable for maintenance, updates, or due to 
                  technical difficulties.
                </p>
                <p>
                  We reserve the right to modify or discontinue the service at any time without prior notice.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">6. Limitation of Liability</h2>
              <div className="text-white/90 space-y-3">
                <p>
                  In no event shall QuickDesk or its suppliers be liable for any damages (including, without limitation, 
                  damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
                  to use QuickDesk, even if we have been notified orally or in writing of the possibility of such damage.
                </p>
                <p>
                  Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability 
                  for consequential or incidental damages, these limitations may not apply to you.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">7. Privacy Policy</h2>
              <div className="text-white/90 space-y-3">
                <p>
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, 
                  to understand our practices.
                </p>
                <Link href="/privacy" className="text-[#f9d423] hover:underline">
                  Read our Privacy Policy →
                </Link>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">8. Changes to Terms</h2>
              <div className="text-white/90 space-y-3">
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                  If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                </p>
                <p>
                  What constitutes a material change will be determined at our sole discretion. By continuing to access 
                  or use our service after those revisions become effective, you agree to be bound by the revised terms.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">9. Contact Information</h2>
              <div className="text-white/90 space-y-3">
                <p>
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                  <p><strong className="text-white">Email:</strong> legal@quickdesk.com</p>
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
            <h3 className="text-lg font-semibold text-white mb-2">Ready to continue?</h3>
            <p className="text-white/70 mb-4">
              By using QuickDesk, you agree to these terms and conditions.
            </p>
            <div className="flex justify-center space-x-3">
              <Link href="/signup">
                <Button className="bg-white text-[#ff4e50] hover:bg-white/90 font-semibold">
                  Return to Sign Up
                </Button>
              </Link>
              <Link href="/privacy">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Read Privacy Policy
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
