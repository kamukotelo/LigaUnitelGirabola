'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Send, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';
import AnimatedCard from '@/components/ui/AnimatedCard';
import FuturisticButton from '@/components/ui/FuturisticButton';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'geral', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: 'geral', message: '' });
      // Reset success state after a few seconds
      setTimeout(() => setIsSuccess(false), 5000);
    }, 2000);
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
      {/* Page Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-2">
          <Zap size={14} className="text-accent animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold">
            CENTRO_DE_CONTACTO
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-display text-white uppercase leading-none">
          Contacte o <span className="text-primary italic">Girabola</span>
        </h1>
        <p className="text-sm text-zinc-400 mt-2 font-mono uppercase tracking-wider">
          Canal oficial para credenciação, parcerias e informações de imprensa
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact Form Container */}
        <div className="lg:col-span-2">
          <AnimatedCard variant="hud" className="bg-zinc-950/40 border-zinc-900 p-8 relative overflow-hidden">
            
            {/* HUD Corner Accents */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-accent/40" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-accent/40" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-accent/40" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-accent/40" />

            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-mono"
                        placeholder="EX: JOÃO MANUEL"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
                        Endereço de Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-mono"
                        placeholder="EX: JOAO@DOMINIO.AO"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
                      Assunto da Mensagem
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-zinc-900/60 border border-zinc-800 text-zinc-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-mono"
                    >
                      <option value="geral">INFORMAÇÕES GERAIS</option>
                      <option value="media">CREDENCIAÇÃO DE IMPRENSA</option>
                      <option value="partners">PARCERIAS E PATROCÍNIOS</option>
                      <option value="clubs">ÁREA DE CLUBES</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
                      Mensagem
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-mono"
                      placeholder="ESCREVA A SUA MENSAGEM AQUI..."
                    />
                  </div>

                  {/* Button */}
                  <div className="flex justify-end pt-2">
                    <FuturisticButton variant="neon" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                          Transmitindo dados...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Enviar Mensagem <Send size={14} />
                        </span>
                      )}
                    </FuturisticButton>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4 animate-bounce" />
                  <h3 className="text-2xl font-display text-white uppercase mb-2">
                    Transmissão Concluída!
                  </h3>
                  <p className="text-zinc-400 font-mono text-sm max-w-sm mb-6">
                    A sua mensagem foi encriptada e enviada com sucesso para os nossos servidores. Responderemos o mais breve possível.
                  </p>
                  <FuturisticButton variant="outline" onClick={() => setIsSuccess(false)}>
                    Enviar Nova Mensagem
                  </FuturisticButton>
                </motion.div>
              )}
            </AnimatePresence>
          </AnimatedCard>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          
          <AnimatedCard variant="hud" className="bg-zinc-950/40 border-zinc-900 p-6 space-y-6">
            <h3 className="text-lg font-display text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Zap size={16} className="text-accent" /> Escritório Central
            </h3>

            <div className="space-y-4 text-xs font-mono text-zinc-400">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-white uppercase">Morada</h4>
                  <p className="mt-1">
                    Complexo Desportivo da Cidadela<br />
                    Distrito Urbano do Rangel<br />
                    Luanda, Angola
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-white uppercase">Telefone</h4>
                  <p className="mt-1">+244 923 000 000</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-white uppercase">Email</h4>
                  <p className="mt-1 hover:text-primary transition-colors">
                    info@girabola.co.ao
                  </p>
                </div>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard variant="hud" className="bg-zinc-950/40 border-zinc-900 p-6">
            <h3 className="text-lg font-display text-white uppercase tracking-wider mb-4">
              Apoio Técnico
            </h3>
            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              Para problemas de acesso à Área de Clubes ou falhas na plataforma digital, contacte a equipa de engenharia de software em: <span className="text-primary font-bold">suporte@girabola.co.ao</span>
            </p>
          </AnimatedCard>

        </div>

      </div>

    </div>
  );
}
