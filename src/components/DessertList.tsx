import React, { useEffect, useState } from "react";
import { getHealthyDesserts, Recipe } from "@/src/services/gemini";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clock, ChefHat, Flame, Apple } from "lucide-react";
import { motion } from "motion/react";

export function DessertList() {
  const [desserts, setDesserts] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDesserts = async () => {
      try {
        const res = await getHealthyDesserts();
        setDesserts(res);
      } catch (error) {
        console.error("Erro ao buscar sobremesas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDesserts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-pink-600" />
        <p className="text-pink-800 font-medium">Buscando doçuras saudáveis...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {desserts.map((dessert, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow overflow-hidden bg-white">
            <div className="h-3 bg-pink-400" />
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary" className="bg-pink-50 text-pink-700 hover:bg-pink-100">
                  {dessert.difficulty}
                </Badge>
                <div className="flex items-center gap-1 text-orange-600 font-bold">
                  <Flame className="w-4 h-4" />
                  <span className="text-sm">{dessert.calories} kcal</span>
                </div>
              </div>
              <CardTitle className="text-xl text-pink-900">{dessert.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> {dessert.time}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="flex items-center gap-2 font-semibold text-pink-800 mb-2">
                  <Apple className="w-4 h-4" /> Ingredientes
                </h4>
                <ul className="grid grid-cols-1 gap-1">
                  {dessert.ingredients.map((ing, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-300 mt-1.5 shrink-0" />
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="flex items-center gap-2 font-semibold text-pink-800 mb-2">
                  <ChefHat className="w-4 h-4" /> Modo de Preparo
                </h4>
                <ol className="space-y-2">
                  {dessert.instructions.map((step, i) => (
                    <li key={i} className="text-sm text-gray-600 flex gap-3">
                      <span className="font-bold text-pink-400">{i + 1}.</span>
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
