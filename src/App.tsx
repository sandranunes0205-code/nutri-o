import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalorieCalculator } from "./components/CalorieCalculator";
import { RecipeList } from "./components/RecipeList";
import { WellnessTips } from "./components/WellnessTips";
import { PersonalizedDiet } from "./components/PersonalizedDiet";
import { Leaf, Calculator, UtensilsCrossed, Sparkles, UserCircle } from "lucide-react";
import { motion } from "motion/react";

export default function App() {
  return (
    <div className="min-h-screen bg-[#F8FAF9] text-slate-900 font-sans selection:bg-emerald-100">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-24 w-64 h-64 bg-sage-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-8 md:py-12">
        <header className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center p-3 bg-emerald-600 rounded-2xl mb-4 shadow-lg shadow-emerald-200"
          >
            <Leaf className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-emerald-950 tracking-tight mb-2"
          >
            NutriLife
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-emerald-800/70 text-lg max-w-2xl mx-auto"
          >
            Equilíbrio e saúde na palma da sua mão. Calcule suas necessidades, descubra receitas e viva melhor.
          </motion.p>
        </header>

        <Tabs defaultValue="calculator" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-white/50 backdrop-blur-md border border-emerald-100 p-1 h-auto rounded-2xl shadow-sm flex-wrap justify-center">
              <TabsTrigger 
                value="calculator" 
                className="rounded-xl px-4 md:px-6 py-3 data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all flex gap-2"
              >
                <Calculator className="w-4 h-4" />
                Calculadora
              </TabsTrigger>
              <TabsTrigger 
                value="diet" 
                className="rounded-xl px-4 md:px-6 py-3 data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all flex gap-2"
              >
                <UserCircle className="w-4 h-4" />
                Plano Personalizado
              </TabsTrigger>
              <TabsTrigger 
                value="recipes" 
                className="rounded-xl px-4 md:px-6 py-3 data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all flex gap-2"
              >
                <UtensilsCrossed className="w-4 h-4" />
                Receitas
              </TabsTrigger>
              <TabsTrigger 
                value="wellness" 
                className="rounded-xl px-4 md:px-6 py-3 data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all flex gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Bem-estar
              </TabsTrigger>
            </TabsList>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <TabsContent value="calculator" className="mt-0 outline-none">
              <CalorieCalculator />
            </TabsContent>
            <TabsContent value="diet" className="mt-0 outline-none">
              <PersonalizedDiet />
            </TabsContent>
            <TabsContent value="recipes" className="mt-0 outline-none">
              <RecipeList />
            </TabsContent>
            <TabsContent value="wellness" className="mt-0 outline-none">
              <WellnessTips />
            </TabsContent>
          </motion.div>
        </Tabs>

        <footer className="mt-20 pt-8 border-t border-emerald-100 text-center text-emerald-800/50 text-sm">
          <p>© 2024 NutriLife - Sua jornada para uma vida mais saudável.</p>
        </footer>
      </div>
    </div>
  );
}
