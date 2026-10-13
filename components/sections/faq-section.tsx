import { getTranslations } from "next-intl/server";
import { faqSchema } from "@/lib/schema";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { JsonLd } from "@/components/ui/json-ld";
import { Section, SectionHeader } from "@/components/ui/section";
import { RichText, SplitTitle } from "@/components/ui/typography";

export type FaqItem = { question: string; answer: string };

/** FAQ en accordéon à filets + balisage FAQPage */
export async function FaqSection({ items, number }: { items: FaqItem[]; number?: string }) {
  const t = await getTranslations("common");
  return (
    <Section aria-labelledby="faq-title">
      <SectionHeader
        number={number}
        label={t("faqTitle")}
        title={<SplitTitle id="faq-title" lead={t("faqTitleLead")} accent={t("faqTitleAccent")} />}
      />
      <div className="lg:ml-[25%]">
        <Accordion type="multiple">
          {items.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>
                <RichText text={item.answer} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <JsonLd data={faqSchema(items)} />
    </Section>
  );
}
