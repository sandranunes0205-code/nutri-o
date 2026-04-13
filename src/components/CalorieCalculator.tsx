import React, { useState } from "react";
import { calculateCalories, CalorieResult } from "@/src/services/gemini";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Calculator, Flame, Beef, Wheat, Droplets } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function CalorieCalculator() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CalorieResult | null>(null);

  const handleCalculate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const res = await calculateCalories(description);
      setResult(res);
    } catch (error) {
      console.error("Erro ao calcular calorias:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <Calculator className="w-6 h-6" />
            Calculadora Inteligente
          </CardTitle>
          <CardDescription>
            Descreva sua refeição e a IA estimará os valores nutricionais para você.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ex: 100g de frango grelhado, 1 xícara de arroz integral e salada"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
              className="border-emerald-100 focus-visible:ring-emerald-500"
            />
            <Button 
              onClick={handleCalculate} 
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Calcular"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Card className="border-none shadow-md bg-emerald-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-emerald-900">{result.foodName}</CardTitle>
                <CardDescription className="text-emerald-700">Estimativa Nutricional</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Flame className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider">Calorias</p>
                      <p className="text-xl font-bold text-emerald-900">{result.calories} kcal</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Beef className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider">Proteína</p>
                      <p className="text-xl font-bold text-emerald-900">{result.protein}g</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Wheat className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider">Carbos</p>
                      <p className="text-xl font-bold text-emerald-900">{result.carbs}g</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Droplets className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider">Gorduras</p>
                      <p className="text-xl font-bold text-emerald-900">{result.fats}g</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-emerald-900">Análise da IA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  "{result.explanation}"
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
