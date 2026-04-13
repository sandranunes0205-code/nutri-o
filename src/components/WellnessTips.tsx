import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Heart, Sun, Moon, Coffee, Activity } from "lucide-react";
import { motion } from "motion/react";

const tips = [
  {
    title: "Hidratação é Chave",
    description: "Beba pelo menos 2 litros de água por dia. A água ajuda no metabolismo e na clareza mental.",
    icon: <Sparkles className="w-6 h-6 text-blue-500" />,
    color: "bg-blue-50"
  },
  {
    title: "Sono Reparador",
    description: "Tente dormir de 7 a 9 horas por noite. O sono é essencial para a recuperação muscular e equilíbrio hormonal.",
    icon: <Moon className="w-6 h-6 text-indigo-500" />,
    color: "bg-indigo-50"
  },
  {
    title: "Alimentação Consciente",
    description: "Coma devagar e saboreie cada mordida. Isso ajuda o cérebro a processar a saciedade.",
    icon: <Heart className="w-6 h-6 text-red-500" />,
    color: "bg-red-50"
  },
  {
    title: "Movimente-se",
    description: "Pelo menos 30 minutos de atividade física moderada por dia podem transformar sua saúde cardiovascular.",
    icon: <Activity className="w-6 h-6 text-emerald-500" />,
    color: "bg-emerald-50"
  },
  {
    title: "Exposição Solar",
    description: "15 minutos de sol pela manhã ajudam na síntese de Vitamina D e regulam seu ciclo circadiano.",
    icon: <Sun className="w-6 h-6 text-amber-500" />,
    color: "bg-amber-50"
  },
  {
    title: "Pausas para Café",
    description: "O café pode ser um aliado, mas evite consumi-lo após as 15h para não prejudicar o sono.",
    icon: <Coffee className="w-6 h-6 text-orange-500" />,
    color: "bg-orange-50"
  }
];

export function WellnessTips() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tips.map((tip, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="h-full border-none shadow-md hover:shadow-lg transition-all bg-white">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className={`p-3 rounded-2xl ${tip.color}`}>
                {tip.icon}
              </div>
              <CardTitle className="text-lg text-emerald-900">{tip.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 leading-relaxed">
                {tip.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
