import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalorieCalculator } from "./components/CalorieCalculator";
import { RecipeList } from "./components/RecipeList";
import { WellnessTips } from "./components/WellnessTips";
import { PersonalizedDiet } from "./components/PersonalizedDiet";
import { DessertList } from "./components/DessertList";
import { Tracking } from "./components/Tracking";
import { auth, googleProvider } from "./firebase";
import { signInWithPopup, onAuthStateChanged, signOut, User } from "firebase/auth";
import { Leaf, Calculator, UtensilsCrossed, Sparkles, UserCircle, Cookie, LineChart, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAF9]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Leaf className="w-12 h-12 text-emerald-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-slate-900 font-sans selection:bg-emerald-100">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-24 w-64 h-64 bg-sage-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-8 md:py-12">
        <header className="mb-12 flex flex-col items-center">
          <div className="w-full flex justify-end mb-4">
            {user ? (
              <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-2 pr-4 rounded-full border border-emerald-100">
                <img src={user.photoURL || ""} alt={user.displayName || ""} className="w-8 h-8 rounded-full border-2 border-emerald-500" referrerPolicy="no-referrer" />
                <span className="text-sm font-medium text-emerald-900 hidden md:inline">{user.displayName}</span>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-emerald-700 hover:text-red-600 hover:bg-red-50 rounded-full">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={handleLogin} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6">
                <LogIn className="w-4 h-4 mr-2" /> Entrar com Google
              </Button>
            )}
          </div>

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
            className="text-emerald-800/70 text-lg max-w-2xl mx-auto text-center"
          >
            Sua jornada para uma vida saudável começa aqui.
          </motion.p>
        </header>

        <Tabs defaultValue="calculator" className="w-full">
          <div className="flex justify-center mb-8 overflow-x-auto pb-4">
            <TabsList className="bg-white/50 backdrop-blur-md border border-emerald-100 p-1 h-auto rounded-2xl shadow-sm flex-nowrap whitespace-nowrap">
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
                Plano
              </TabsTrigger>
              {user && (
                <TabsTrigger 
                  value="tracking" 
                  className="rounded-xl px-4 md:px-6 py-3 data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all flex gap-2"
                >
                  <LineChart className="w-4 h-4" />
                  Acompanhamento
                </TabsTrigger>
              )}
              <TabsTrigger 
                value="recipes" 
                className="rounded-xl px-4 md:px-6 py-3 data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all flex gap-2"
              >
                <UtensilsCrossed className="w-4 h-4" />
                Receitas
              </TabsTrigger>
              <TabsTrigger 
                value="desserts" 
                className="rounded-xl px-4 md:px-6 py-3 data-[state=active]:bg-pink-500 data-[state=active]:text-white transition-all flex gap-2"
              >
                <Cookie className="w-4 h-4" />
                Sobremesas
              </TabsTrigger>
              <TabsTrigger 
                value="wellness" 
                className="rounded-xl px-4 md:px-6 py-3 data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all flex gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Dicas
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
            {user && (
              <TabsContent value="tracking" className="mt-0 outline-none">
                <Tracking />
              </TabsContent>
            )}
            <TabsContent value="recipes" className="mt-0 outline-none">
              <RecipeList />
            </TabsContent>
            <TabsContent value="desserts" className="mt-0 outline-none">
              <DessertList />
            </TabsContent>
            <TabsContent value="wellness" className="mt-0 outline-none">
              <WellnessTips />
            </TabsContent>
          </motion.div>
        </Tabs>

        {!user && (
          <div className="mt-12 text-center p-8 bg-emerald-50 rounded-3xl border border-emerald-100">
            <h3 className="text-xl font-bold text-emerald-900 mb-2">Acompanhe seu progresso!</h3>
            <p className="text-emerald-700 mb-6">Faça login para salvar seu plano alimentar, registrar suas refeições e ver seus resultados ao longo do tempo.</p>
            <Button onClick={handleLogin} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 py-6 text-lg">
              Começar Agora
            </Button>
          </div>
        )}

        <footer className="mt-20 pt-8 border-t border-emerald-100 text-center text-emerald-800/50 text-sm">
          <p>© 2024 NutriLife - Sua jornada para uma vida mais saudável.</p>
        </footer>
      </div>
    </div>
  );
}
