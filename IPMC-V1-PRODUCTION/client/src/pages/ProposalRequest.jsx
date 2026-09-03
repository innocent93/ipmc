import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, FileText, Briefcase, Users, Building } from 'lucide-react';
import { toast } from 'react-toastify';
import { api } from '../utils/api';

const serviceOptions = [
  'Project Monitoring & Management',
  'QHSE Services',
  'ESG Solutions',
  'SDG Consulting',
  'Manpower Services',
  'Financial Audits',
  'Quality Assurance',
  'Fraud Prevention',
  'Environmental Services',
  'Other',
];

const budgetRanges = [
  'Under ₦10 Million',
  '₦10 Million - ₦50 Million',
  '₦50 Million - ₦100 Million',
  '₦100 Million - ₦500 Million',
  'Above ₦500 Million',
];

export default function ProposalRequest() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '',
    serviceType: '', budgetRange: '', projectDescription: '', timeline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.submitContact({
        ...formData,
        subject: `Proposal Request: ${formData.serviceType}`,
        message: formData.projectDescription,
        serviceInterest: formData.serviceType,
      });
      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', company: '', serviceType: '', budgetRange: '', projectDescription: '', timeline: '' });
      toast.success('Proposal request submitted \u2014 our team will reach out shortly.');
    } catch (error) {
      const isNetworkError = error instanceof TypeError || error?.status === undefined;
      toast.error(
        isNetworkError
          ? 'Could not reach the server. Please email enquiries@ipmc-ng.com directly.'
          : (error.message || 'Failed to submit request. Please try again.')
      );
    }
    setIsSubmitting(false);
  };

  return (
    <div className="pt-20 lg:pt-24">
      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-primary-950">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80')] bg-cover bg-center opacity-10" />
        <div className="container-custom relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="text-accent-400 font-semibold text-sm tracking-wider uppercase">Request a Proposal</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6">
              Let's Discuss Your Project
            </h1>
            <p className="text-primary-200 text-lg">
              Tell us about your project requirements and our team will prepare a tailored proposal 
              within 48 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FileText, step: '01', title: 'Submit Request', desc: 'Fill out the proposal request form with your project details.' },
              { icon: Users, step: '02', title: 'We Review', desc: 'Our team analyzes your requirements and prepares a custom proposal.' },
              { icon: Briefcase, step: '03', title: 'Get Proposal', desc: 'Receive a detailed proposal within 48 hours, tailored to your needs.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
                  <item.icon size={28} className="text-primary-600" />
                </div>
                <div className="text-accent-500 font-bold text-sm mb-2">Step {item.step}</div>
                <h3 className="font-display text-xl font-bold text-primary-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section-padding bg-primary-50">
        <div className="container-custom max-w-4xl">
          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-12 text-center shadow-xl"
            >
              <CheckCircle size={64} className="text-emerald-500 mx-auto mb-6" />
              <h2 className="font-display text-3xl font-bold text-emerald-800 mb-4">Request Submitted!</h2>
              <p className="text-emerald-600 text-lg mb-2">Thank you for your proposal request.</p>
              <p className="text-gray-500">Our team will review your requirements and get back to you within 48 hours.</p>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 md:p-12 shadow-xl"
            >
              <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-900 mb-8">Proposal Request Form</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company/Organization</label>
                  <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Required *</label>
                  <select required value={formData.serviceType} onChange={e => setFormData({...formData, serviceType: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all">
                    <option value="">Select a service</option>
                    {serviceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                  <select value={formData.budgetRange} onChange={e => setFormData({...formData, budgetRange: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all">
                    <option value="">Select budget range</option>
                    {budgetRanges.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Description *</label>
                <textarea required rows={5} value={formData.projectDescription} onChange={e => setFormData({...formData, projectDescription: e.target.value})}
                  placeholder="Describe your project, objectives, and any specific requirements..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none" />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Timeline</label>
                <input type="text" value={formData.timeline} onChange={e => setFormData({...formData, timeline: e.target.value})}
                  placeholder="e.g., 3 months, Q2 2024"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
              </div>

              <button type="submit" disabled={isSubmitting}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all disabled:opacity-50">
                <Send size={18} />
                {isSubmitting ? 'Submitting...' : 'Submit Proposal Request'}
              </button>
            </motion.form>
          )}
        </div>
      </section>
    </div>
  );
}
