import React, { useEffect, useState } from "react";
import { getHealthyRecipes, Recipe } from "@/src/services/gemini";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clock, ChefHat, Flame, Utensils } from "lucide-react";
import { motion } from "motion/react";

export function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await getHealthyRecipes();
        setRecipes(res);
      } catch (error) {
        console.error("Erro ao buscar receitas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        <p className="text-emerald-800 font-medium">Preparando sugestões saudáveis...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {recipes.map((recipe, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow overflow-hidden bg-white">
            <div className="h-3 bg-emerald-500" />
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  {recipe.difficulty}
                </Badge>
                <div className="flex items-center gap-1 text-orange-600 font-bold">
                  <Flame className="w-4 h-4" />
                  <span className="text-sm">{recipe.calories} kcal</span>
                </div>
              </div>
              <CardTitle className="text-xl text-emerald-900">{recipe.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> {recipe.time}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="flex items-center gap-2 font-semibold text-emerald-800 mb-2">
                  <Utensils className="w-4 h-4" /> Ingredientes
                </h4>
                <ul className="grid grid-cols-1 gap-1">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="flex items-center gap-2 font-semibold text-emerald-800 mb-2">
                  <ChefHat className="w-4 h-4" /> Modo de Preparo
                </h4>
                <ol className="space-y-2">
                  {recipe.instructions.map((step, i) => (
                    <li key={i} className="text-sm text-gray-600 flex gap-3">
                      <span className="font-bold text-emerald-500">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
