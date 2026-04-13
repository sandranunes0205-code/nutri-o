import React, { useState } from "react";
import { generatePersonalizedDiet, DietPlan } from "@/src/services/gemini";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, User, Target, Activity, CheckCircle2, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function PersonalizedDiet() {
  const [formData, setFormData] = useState({
    weight: "",
    height: "",
    age: "",
    gender: "male",
    activityLevel: "1.2",
    goal: "maintenance" as "loss" | "maintenance" | "gain"
  });
  const [loading, setLoading] = useState(false);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);

  const calculateTDEE = () => {
    const w = parseFloat(formData.weight);
    const h = parseFloat(formData.height);
    const a = parseFloat(formData.age);
    const activity = parseFloat(formData.activityLevel);

    if (isNaN(w) || isNaN(h) || isNaN(a)) return 0;

    let bmr = 0;
    if (formData.gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    return Math.round(bmr * activity);
  };

  const handleGenerate = async () => {
    const tdee = calculateTDEE();
    if (tdee === 0) return;

    setLoading(true);
    try {
      const plan = await generatePersonalizedDiet(
        parseFloat(formData.weight),
        parseFloat(formData.height),
        parseFloat(formData.age),
        formData.gender === "male" ? "Masculino" : "Feminino",
        tdee,
        formData.goal
      );
      setDietPlan(plan);
    } catch (error) {
      console.error("Erro ao gerar dieta:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <User className="w-6 h-6" />
            Seu Perfil Biométrico
          </CardTitle>
          <CardDescription>
            Insira seus dados para calcularmos sua necessidade calórica e criarmos sua dieta.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="Ex: 75"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Altura (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="Ex: 175"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Idade</Label>
              <Input
                id="age"
                type="number"
                placeholder="Ex: 25"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Gênero</Label>
              <div className="flex gap-2">
                <Button
                  variant={formData.gender === "male" ? "default" : "outline"}
                  className={formData.gender === "male" ? "bg-emerald-600" : ""}
                  onClick={() => setFormData({ ...formData, gender: "male" })}
                >
                  Masculino
                </Button>
                <Button
                  variant={formData.gender === "female" ? "default" : "outline"}
                  className={formData.gender === "female" ? "bg-emerald-600" : ""}
                  onClick={() => setFormData({ ...formData, gender: "female" })}
                >
                  Feminino
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Objetivo</Label>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={formData.goal === "loss" ? "default" : "outline"}
                  className={formData.goal === "loss" ? "bg-emerald-600" : ""}
                  onClick={() => setFormData({ ...formData, goal: "loss" })}
                >
                  Perder Peso
                </Button>
                <Button
                  variant={formData.goal === "maintenance" ? "default" : "outline"}
                  className={formData.goal === "maintenance" ? "bg-emerald-600" : ""}
                  onClick={() => setFormData({ ...formData, goal: "maintenance" })}
                >
                  Manter
                </Button>
                <Button
                  variant={formData.goal === "gain" ? "default" : "outline"}
                  className={formData.goal === "gain" ? "bg-emerald-600" : ""}
                  onClick={() => setFormData({ ...formData, goal: "gain" })}
                >
                  Ganhar Massa
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Nível de Atividade</Label>
            <select
              className="w-full p-2 rounded-md border border-input bg-background"
              value={formData.activityLevel}
              onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
            >
              <option value="1.2">Sedentário (Pouco ou nenhum exercício)</option>
              <option value="1.375">Levemente Ativo (Exercício 1-3 dias/semana)</option>
              <option value="1.55">Moderadamente Ativo (Exercício 3-5 dias/semana)</option>
              <option value="1.725">Muito Ativo (Exercício 6-7 dias/semana)</option>
              <option value="1.9">Extra Ativo (Trabalho físico ou treino intenso)</option>
            </select>
          </div>

          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg"
            onClick={handleGenerate}
            disabled={loading || !formData.weight || !formData.height || !formData.age}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Gerando seu Plano...
              </>
            ) : (
              "Gerar Plano Nutricional"
            )}
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence>
        {dietPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-emerald-600 text-white border-none shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium uppercase tracking-wider opacity-80">Calorias Diárias</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{dietPlan.dailyCalories} kcal</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-none shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium uppercase tracking-wider text-emerald-600">Proteínas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-emerald-950">{dietPlan.macros.protein}g</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-none shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium uppercase tracking-wider text-emerald-600">Carbos / Gorduras</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-emerald-950">{dietPlan.macros.carbs}g / {dietPlan.macros.fats}g</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
                  <Activity className="w-5 h-5" /> Sugestões de Refeições
                </h3>
                {dietPlan.meals.map((meal, idx) => (
                  <Card key={idx} className="border-none shadow-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg text-emerald-800">{meal.name}</CardTitle>
                      <span className="text-sm font-bold text-orange-600">{meal.estimatedCalories} kcal</span>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {meal.suggestions.map((s, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {s}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
                  <Info className="w-5 h-5" /> Recomendações da IA
                </h3>
                <Card className="border-none shadow-sm bg-emerald-50">
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {dietPlan.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-sm text-emerald-900 flex items-start gap-3">
                          <Target className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
