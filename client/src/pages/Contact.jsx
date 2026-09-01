import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { api } from '../utils/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', subject: '', message: '', serviceInterest: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.submitContact(formData);
      setIsSuccess(true);
      toast.success('Message sent \u2014 we\u2019ll get back to you within 24-48 hours.');
      setFormData({ name: '', email: '', phone: '', company: '', subject: '', message: '', serviceInterest: '' });
    } catch (error) {
      // Give a specific reason when we can tell the API is simply
      // unreachable (e.g. no backend deployed yet), rather than a generic
      // failure message that leaves the person guessing.
      const isNetworkError = error instanceof TypeError || error?.status === undefined;
      toast.error(
        isNetworkError
          ? 'Could not reach the server. Please email us directly at enquiries@ipmc-ng.com or try again shortly.'
          : (error.message || 'Failed to send message. Please try again.')
      );
    }
    setIsSubmitting(false);
  };

  // Real office locations from ipmc-ng.com/contacts
  const contactInfo = [
    { icon: MapPin, title: 'Head Office \u2014 Lagos', content: '18B Olu Holloway Road, Ikoyi-Lagos, Nigeria' },
    { icon: MapPin, title: 'Abuja Office', content: '32 Lusaka Crescent, Wuse Zone 6, Abuja, Nigeria' },
    { icon: MapPin, title: 'Lagos Island Office', content: '207 Igbosere Road, Lagos Island, Nigeria' },
    { icon: Phone, title: 'Call Us', content: '+234 704 026 9249', href: 'tel:+2347040269249' },
    { icon: Mail, title: 'Email Us', content: 'enquiries@ipmc-ng.com', href: 'mailto:enquiries@ipmc-ng.com' },
    { icon: Clock, title: 'Working Hours', content: 'Mon - Fri: 8:00 AM - 5:00 PM' },
  ];

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="relative py-20 bg-primary-950">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80')] bg-cover bg-center opacity-10" />
        <div className="container-custom relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="text-accent-400 font-semibold text-sm tracking-wider uppercase">Get In Touch</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mt-4 mb-6">Let's Start a Conversation</h1>
            <p className="text-primary-200 text-lg">Ready to discuss your project? Our team is here to help you achieve excellence.</p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              {contactInfo.map((info, i) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 p-6 rounded-xl bg-gray-50 hover:bg-primary-50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary-600 flex items-center justify-center shrink-0">
                    <info.icon size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-900 mb-1">{info.title}</h3>
                    {info.href ? (
                      <a href={info.href} className="text-gray-600 hover:text-primary-600 transition-colors">{info.content}</a>
                    ) : (
                      <p className="text-gray-600">{info.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              {isSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-12 text-center">
                  <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
                  <h3 className="font-display text-2xl font-bold text-emerald-800 mb-2">Message Sent Successfully!</h3>
                  <p className="text-emerald-600">We'll get back to you within 24-48 hours.</p>
                  <button onClick={() => setIsSuccess(false)} className="mt-6 text-emerald-700 font-semibold hover:underline">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
                  <h3 className="font-display text-2xl font-bold text-primary-900 mb-6">Send Us a Message</h3>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                      <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                    <input type="text" required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Interest</label>
                    <select value={formData.serviceInterest} onChange={e => setFormData({...formData, serviceInterest: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all">
                      <option value="">Select a service</option>
                      <option>Project Monitoring</option>
                      <option>Financial Advisory</option>
                      <option>Environmental Services</option>
                      <option>ESG Solutions</option>
                      <option>Quality Assurance</option>
                      <option>Fraud Prevention</option>
                    </select>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                    <textarea required rows={5} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none" />
                  </div>
                  <button type="submit" disabled={isSubmitting}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    <Send size={18} />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
