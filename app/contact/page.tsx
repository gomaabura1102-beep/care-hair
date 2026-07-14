import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { ContactForm } from "@/features/contact/contact-form";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "Care Hairへのお問い合わせフォームです。"
};

export default function ContactPage() {
  return (
    <main className="pt-[var(--header-height)]">
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-site px-4">
          <SectionHeading
            eyebrow="Contact"
            title="お問い合わせ"
            lead="サービスへの質問、商品情報の修正、授業発表に関する連絡などはこちらから送れます。"
          />
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
