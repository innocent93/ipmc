import { motion } from 'framer-motion';
import { Linkedin, Twitter, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Loader2 } from 'lucide-react';
import { FALLBACK_TEAM } from '../data/team';

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTeam()
      .then(res => setMembers(res && res.length > 0 ? res : FALLBACK_TEAM))
      .catch(() => setMembers(FALLBACK_TEAM))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-24">
      <section className="relative py-20 bg-primary-950">
        <div className="container-custom relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="text-accent-400 font-semibold text-sm tracking-wider uppercase">Our Team</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mt-4 mb-6">Meet the Experts</h1>
            <p className="text-primary-200 text-lg">A diverse team of seasoned professionals committed to delivering excellence.</p>
          </motion.div>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 size={40} className="animate-spin text-primary-600" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {members.length > 0 ? members.map((member, i) => (
                <motion.div key={member._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                    <div className="relative h-80 overflow-hidden">
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        {[Linkedin, Twitter, Mail].map((Icon, j) => (
                          <button key={j} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-accent-400 hover:text-primary-900 transition-colors">
                            <Icon size={18} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-lg font-bold text-primary-900">{member.name}</h3>
                      <p className="text-primary-600 text-sm font-medium mb-2">{member.role}</p>
                      <p className="text-gray-500 text-sm">{member.bio}</p>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="col-span-4 text-center py-20 text-gray-500">No team members found.</div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
