import { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Users, Scale, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';

const QUESTIONS = [
  { id: 'env_policy', pillar: 'Environmental', icon: Leaf, text: 'Does your organization have a documented environmental policy?' },
  { id: 'emissions', pillar: 'Environmental', icon: Leaf, text: 'Do you track and report greenhouse gas emissions?' },
  { id: 'waste', pillar: 'Environmental', icon: Leaf, text: 'Do you have a formal waste management and reduction program?' },
  { id: 'labor', pillar: 'Social', icon: Users, text: 'Are labor practices and worker safety independently audited?' },
  { id: 'diversity', pillar: 'Social', icon: Users, text: 'Does your organization track diversity and inclusion metrics?' },
  { id: 'community', pillar: 'Social', icon: Users, text: 'Do you run structured community engagement or investment programs?' },
  { id: 'board', pillar: 'Governance', icon: Scale, text: 'Is board composition and independence formally documented?' },
  { id: 'ethics', pillar: 'Governance', icon: Scale, text: 'Do you have a whistleblower policy and anti-corruption controls?' },
  { id: 'disclosure', pillar: 'Governance', icon: Scale, text: 'Do you publish an annual sustainability or ESG disclosure?' },
];

export default function EsgQuestionnaire() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const setAnswer = (id, value) => setAnswers((prev) => ({ ...prev, [id]: value }));
  const answeredCount = Object.keys(answers).length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answeredCount < QUESTIONS.length) {
      toast.error(`Please answer all ${QUESTIONS.length} questions (${answeredCount} so far).`);
      return;
    }
    setSubmitted(true);
    toast.success('Assessment submitted — an IPMC ESG consultant will follow up with your results.');
  };

  const score = Object.values(answers).filter((v) => v === 'yes').length;

  return (
    <div className="pt-24">
      <section className="relative py-20 bg-emerald-950">
        <div className="container-custom relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="text-emerald-400 font-semibold text-sm tracking-wider uppercase">Research &amp; Insights</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mt-4 mb-6">ESG Self-Assessment Questionnaire</h1>
            <p className="text-emerald-200 text-lg">A quick baseline check across Environmental, Social and Governance practice — takes about 3 minutes.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom max-w-2xl">
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
              <CheckCircle2 size={56} className="text-emerald-500 mx-auto mb-6" />
              <h2 className="font-display text-3xl font-bold text-primary-900 mb-3">Baseline Score: {score} / {QUESTIONS.length}</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                This is a directional self-assessment, not a certified rating. For a full independent ESG
                rating, explore our <a href="/services/esg-ratings" className="text-primary-600 font-semibold hover:underline">ESG Ratings &amp; Rankings</a> service.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {['Environmental', 'Social', 'Governance'].map((pillar) => (
                <div key={pillar}>
                  <h2 className="font-display text-xl font-bold text-primary-900 mb-4">{pillar}</h2>
                  <div className="space-y-4">
                    {QUESTIONS.filter((q) => q.pillar === pillar).map((q) => (
                      <div key={q.id} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                        <p className="text-sm font-medium text-gray-800 mb-3">{q.text}</p>
                        <div className="flex gap-3">
                          {['yes', 'no'].map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setAnswer(q.id, val)}
                              className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
                                answers[q.id] === val ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300'
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-gray-500">{answeredCount} of {QUESTIONS.length} answered</span>
                <button type="submit" className="btn-primary">Get My Score</button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
