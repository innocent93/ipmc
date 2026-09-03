import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'What services does IPMC Limited offer?',
    answer: 'IPMC Limited offers a comprehensive range of services including Project Monitoring & Management, Quality Health Safety & Environment (QHSE) services, ESG Solutions, Sustainable Development Goals (SDG) consulting, Manpower Services, and Financial Audits. We serve clients across the oil, gas, and energy sectors in Nigeria.',
  },
  {
    question: 'How long has IPMC been in operation?',
    answer: 'IPMC Limited has been operating for over 35 years, establishing itself as a trusted partner in project monitoring and professional consultancy services across Nigeria and West Africa.',
  },
  {
    question: 'What is Project 100 and how is IPMC involved?',
    answer: 'Project 100 is an initiative by NNPC and NCDMB to support 100 indigenous Nigerian companies. IPMC was selected as a beneficiary, recognizing our commitment to local content development and excellence in service delivery.',
  },
  {
    question: 'Do you provide ESG rating services?',
    answer: 'Yes, we provide comprehensive ESG (Environmental, Social, and Governance) assessment and rating services. We help organizations monitor their ESG performance across various metrics and align with global sustainability standards.',
  },
  {
    question: 'What industries do you serve?',
    answer: 'While we specialize in the oil and gas sector, our services extend to construction, energy, manufacturing, and infrastructure development. Our multi-disciplinary team can adapt to diverse industry requirements.',
  },
  {
    question: 'How can I request a proposal?',
    answer: 'You can request a proposal by visiting our Proposal Request page and filling out the detailed form with your project requirements. Our team will review your submission and provide a tailored proposal within 48 hours.',
  },
  {
    question: 'Do you offer career opportunities?',
    answer: 'Yes, we regularly recruit talented professionals in project management, engineering, environmental science, finance, and consulting. Visit our Careers page to view current openings and submit your application.',
  },
  {
    question: 'What is your approach to QHSE compliance?',
    answer: 'Our QHSE approach combines international standards with local regulatory requirements. We conduct thorough assessments, provide training, implement monitoring systems, and ensure continuous improvement in quality, health, safety, and environmental performance.',
  },
];

function FAQItem({ faq, index }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-gray-200 last:border-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span className="font-display text-lg font-semibold text-primary-900 group-hover:text-primary-600 transition-colors pr-4">
          {faq.question}
        </span>
        <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
          isOpen ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-primary-100'
        }`}>
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-600 leading-relaxed pr-12">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  return (
    <section className="section-padding bg-primary-50">
      <div className="container-custom max-w-4xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-primary-600 font-semibold text-sm tracking-wider uppercase">FAQ</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-900 mt-3 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-lg">
            Find answers to common questions about our services, processes, and capabilities.
          </p>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
