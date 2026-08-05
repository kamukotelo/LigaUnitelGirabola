'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';
import AnimatedCard from '@/components/ui/AnimatedCard';
import FuturisticButton from '@/components/ui/FuturisticButton';
import { useSiteSettings } from '@/lib/portal-overrides';
import PageHeader from '@/components/ui/PageHeader';

export default function ContactPage() {
  const site = useSiteSettings();
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'geral', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: 'geral', message: '' });
      
      // Reset success state after a few seconds
      setTimeout(() => setIsSuccess(false), 5000);
    }, 700);
  };

  return (
    <div className="page-shell relative z-10">
      {/* Page Header */}
      <PageHeader eyebrow="Contacto" title="Fale com a" highlight="Liga Unitel Girabola" description="Canal oficial para informações gerais, credenciação, parcerias e comunicação social." breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Contacto' }]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact Form Container */}
        <div className="lg:col-span-2">
          <AnimatedCard variant="standard" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 relative overflow-hidden">

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
                      <label htmlFor="contact-name" className="field-label">
                        Nome completo <span className="required-mark" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="contact-name" type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="field-control"
                        placeholder="João Manuel"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="contact-email" className="field-label">
                        Endereço de email <span className="required-mark" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="contact-email" type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="field-control"
                        placeholder="joao@dominio.ao"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="contact-subject" className="field-label">
                      Assunto
                    </label>
                    <select
                      id="contact-subject" value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="field-control"
                    >
                      <option value="geral">INFORMAÇÕES GERAIS</option>
                      <option value="media">CREDENCIAÇÃO DE IMPRENSA</option>
                      <option value="partners">PARCERIAS E PATROCÍNIOS</option>
                      <option value="clubs">ÁREA DE CLUBES</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="contact-message" className="field-label">
                      Mensagem <span className="required-mark" aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="contact-message" required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="field-control min-h-36 resize-y"
                      placeholder="Escreva a sua mensagem..."
                    />
                  </div>

                  {/* Button */}
                  <div className="flex justify-end pt-2">
                    <FuturisticButton variant="neon" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                          A enviar...
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
                  <h3 className="text-2xl font-display text-foreground uppercase mb-2">
                    Mensagem enviada
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 font-mono text-sm max-w-sm mb-6">
                    Recebemos a sua mensagem. A equipa da Liga responderá assim que possível.
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
          
          <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-6 space-y-6">
            <h3 className="text-lg font-display text-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
              <MapPin size={16} className="text-accent" /> Escritório central
            </h3>

            <div className="space-y-4 text-xs font-mono text-zinc-600 dark:text-zinc-400">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-foreground uppercase">Morada</h4>
                  <p className="mt-1">{site.contactAddress}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-foreground uppercase">Telefone</h4>
                  <p className="mt-1">{site.contactPhone}</p>
                  {site.contactPhone2 && <p className="mt-0.5 text-zinc-500">{site.contactPhone2}</p>}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-foreground uppercase">Email</h4>
                  <a href={`mailto:${site.contactEmail}`} className="mt-1 block hover:text-primary transition-colors">
                    {site.contactEmail}
                  </a>
                </div>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-6">
            <h3 className="text-lg font-display text-foreground uppercase tracking-wider mb-4">
              Apoio Técnico
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-mono leading-relaxed">
              Para problemas de acesso à Área de Clubes ou falhas na plataforma digital, contacte a equipa de engenharia de software em: <a href={`mailto:${site.supportEmail}`} className="text-primary font-bold hover:underline">{site.supportEmail}</a>
            </p>
          </AnimatedCard>

        </div>

      </div>

    </div>
  );
}
