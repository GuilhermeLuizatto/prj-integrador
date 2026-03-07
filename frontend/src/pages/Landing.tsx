import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import mascotVideo from "@/assets/mascot-wave.mp4";

import {
  KanbanSquare,
  Trophy,
  Smile,
  BarChart3,
  Users,
  Zap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const features = [
  { icon: KanbanSquare, title: "Kanban Intuitivo", desc: "Organize tarefas com drag & drop, como Trello" },
  { icon: Trophy, title: "Gamificação", desc: "Pontos, ranking e recompensas para motivar a equipe" },
  { icon: Smile, title: "Humor da Equipe", desc: "Acompanhe o bem-estar diário dos colaboradores" },
  { icon: BarChart3, title: "Dashboards", desc: "Relatórios de produtividade e satisfação em tempo real" },
  { icon: Users, title: "Gestão de Times", desc: "Convide membros, atribua tarefas e acompanhe progresso" },
  { icon: Zap, title: "Feedback Mensal", desc: "Questionários automáticos para medir engajamento" },
];

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    features: ["Até 10 usuários", "Kanban básico", "Registro de humor", "Ranking simples"],
    cta: "Começar Grátis",
    popular: false,
  },
  {
    name: "Premium",
    price: "R$ 49",
    period: "/mês",
    features: [
      "Usuários ilimitados",
      "Dashboards avançados",
      "Recompensas customizadas",
      "Relatórios de feedback",
      "Personalização completa",
      "Suporte prioritário",
    ],
    cta: "Iniciar Trial",
    popular: true,
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-heading font-bold">M</span>
            </div>
            <span className="font-heading font-bold text-xl text-foreground">MoodTask</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Funcionalidades
            </a>

            <a href="#plans" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Planos
            </a>

            <Link to="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>

            <Link to="/register">
              <Button size="sm">Começar Grátis</Button>
            </Link>
          </div>
        </div>
      </nav>


      {/* HERO */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* TEXTO */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
                <Zap className="w-4 h-4" />
                Produtividade + Bem-estar
              </div>

              <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground leading-tight mb-6">
                Tarefas com{" "}
                <span className="text-gradient-primary">propósito</span>,{" "}
                equipe com{" "}
                <span className="text-gradient-accent">energia</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-10">
                Gerencie tarefas, motive sua equipe com gamificação e acompanhe
                o humor dos colaboradores — tudo em uma plataforma.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow px-8">
                    Começar Gratuitamente
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>

                <Link to="/login">
                  <Button variant="outline" size="lg">
                    Já tenho conta
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>


          {/* MASCOTE */}
          <div className="flex justify-center">
            <motion.video
              autoPlay
              loop
              muted
              playsInline
              className="w-96 md:w-[520px]"
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <source src={mascotVideo} type="video/mp4" />
            </motion.video>
          </div>

        </div>
      </section>


      {/* FEATURES */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Tudo que sua equipe precisa
            </h2>

            <p className="text-muted-foreground text-lg">
              Funcionalidades pensadas para produtividade e bem-estar
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl p-6 border border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300 group"
              >

                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-gradient-primary group-hover:text-primary-foreground transition-all">
                  <f.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                </div>

                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                  {f.title}
                </h3>

                <p className="text-muted-foreground text-sm">{f.desc}</p>

              </motion.div>
            ))}
          </div>

        </div>
      </section>


      {/* PLANOS */}
      <section id="plans" className="py-20 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Planos simples, sem surpresas
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">

            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-card rounded-2xl p-8 border-2 transition-all ${
                  plan.popular ? "border-primary shadow-glow" : "border-border"
                }`}
              >

                {plan.popular && (
                  <div className="inline-block px-3 py-1 rounded-full bg-gradient-primary text-primary-foreground text-xs font-semibold mb-4">
                    Mais Popular
                  </div>
                )}

                <h3 className="font-heading font-bold text-2xl text-foreground">
                  {plan.name}
                </h3>

                <div className="mt-4 mb-6">
                  <span className="text-4xl font-heading font-bold text-foreground">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link to="/register">
                  <Button
                    className={`w-full ${
                      plan.popular ? "bg-gradient-primary text-primary-foreground" : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>

              </div>
            ))}

          </div>

        </div>
      </section>


      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-heading font-bold text-xs">
                M
              </span>
            </div>

            <span className="font-heading font-semibold text-foreground">
              MoodTask
            </span>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2026 MoodTask. Todos os direitos reservados.
          </p>

        </div>
      </footer>

    </div>
  );
}