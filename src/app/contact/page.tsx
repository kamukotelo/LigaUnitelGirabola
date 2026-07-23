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
  const [toasts, setToasts] = useState<{ id: string; text: string; type: 'info' | 'success' }[]>([]);

  const addToast = (text: string, type: 'info' | 'success' = 'info') => {
    const id = Math.random().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    
    // Multi-step simulated data transmission
    addToast("A inicializar canal seguro de dados FAF...", "info");
    
    setTimeout(() => {
      addToast("A encriptar mensagem (padrão militar AES-256)...", "info");
    }, 800000 / 1000); // 800ms

    setTimeout(() => {
      addToast("Sinal transmitido. A guardar nos servidores centrais...", "info");
    }, 1600);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      addToast("Mensagem entregue com sucesso!", "success");
      setFormData({ name: '', email: '', subject: 'geral', message: '' });
      
      // Reset success state after a few seconds
      setTimeout(() => setIsSuccess(false), 5000);
    }, 2500);
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      {/* Toast Notification Container */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className={`p-4 rounded-xl border backdrop-blur-md shadow-lg pointer-events-auto font-mono text-xs uppercase font-bold ${
                toast.type === 'success'
                  ? 'bg-green-500/15 border-green-500/40 text-green-500'
                  : 'bg-accent/15 border-accent/40 text-accent'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${toast.type === 'success' ? 'bg-green-500 status-pulse' : 'bg-accent status-pulse'}`} />
                {toast.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Page Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-2">
          <Zap size={14} className="text-accent animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold">
            CENTRO_DE_CONTACTO
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-display text-foreground uppercase leading-none">
          Contacte a <span className="text-primary italic">Liga Unitel Girabola</span>
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 font-mono uppercase tracking-wider">
          Canal oficial para credenciação, parcerias e informações de imprensa
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact Form Container */}
        <div className="lg:col-span-2">
          <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-8 relative overflow-hidden">
            
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
                        className="w-full bg-white/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-foreground rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-mono"
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
                        className="w-full bg-white/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-foreground rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-mono"
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
                      className="w-full bg-white/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-mono"
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
                      className="w-full bg-white/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-foreground rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-mono"
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
                  <h3 className="text-2xl font-display text-foreground uppercase mb-2">
                    Transmissão Concluída!
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 font-mono text-sm max-w-sm mb-6">
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
          
          <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-6 space-y-6">
            <h3 className="text-lg font-display text-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
              <Zap size={16} className="text-accent" /> Escritório Central / Sede
            </h3>

            <div className="space-y-4 text-xs font-mono text-zinc-600 dark:text-zinc-400">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-foreground uppercase">Morada</h4>
                  <p className="mt-1">
                    Rua Comandante Eurico, nº 23<br />
                    Ingombotas<br />
                    Luanda, Angola
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-foreground uppercase">Telefone</h4>
                  <p className="mt-1">+244 975 218 863</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-foreground uppercase">Email</h4>
                  <p className="mt-1 hover:text-primary transition-colors">
                    geral@ancaf.co.ao
                  </p>
                </div>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-6">
            <h3 className="text-lg font-display text-foreground uppercase tracking-wider mb-4">
              Apoio Técnico
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-mono leading-relaxed">
              Para problemas de acesso à Área de Clubes ou falhas na plataforma digital, contacte a equipa de engenharia de software em: <span className="text-primary font-bold">it@ancaf.co.ao</span>
            </p>
          </AnimatedCard>

        </div>

      </div>

    </div>
  );
}
