import React, { useState, useEffect } from "react";
import { db, auth, handleFirestoreError, OperationType } from "@/src/firebase";
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc, orderBy, limit } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Utensils, 
  Droplets, 
  Smile, 
  TrendingUp, 
  Plus, 
  Trash2,
  History,
  Scale
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Tracking() {
  const [logs, setLogs] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [newFood, setNewFood] = useState("");
  const [currentLog, setCurrentLog] = useState<any>({
    date: new Date().toISOString().split('T')[0],
    adherence: true,
    foodItems: [],
    waterIntake: 0,
    wellBeing: "Ótimo",
    caloriesConsumed: 0
  });
  const [newWeight, setNewWeight] = useState("");

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const logsQuery = query(
      collection(db, "logs"),
      where("uid", "==", user.uid),
      orderBy("date", "desc"),
      limit(30)
    );

    const progressQuery = query(
      collection(db, "progress"),
      where("uid", "==", user.uid),
      orderBy("date", "desc"),
      limit(10)
    );

    const unsubLogs = onSnapshot(logsQuery, (snapshot) => {
      setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      // Check if today's log exists
      const today = new Date().toISOString().split('T')[0];
      const todayLog = snapshot.docs.find(d => d.data().date === today);
      if (todayLog) {
        setCurrentLog({ id: todayLog.id, ...todayLog.data() });
      }
    }, (err) => handleFirestoreError(err, OperationType.LIST, "logs"));

    const unsubProgress = onSnapshot(progressQuery, (snapshot) => {
      setProgress(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, "progress"));

    return () => {
      unsubLogs();
      unsubProgress();
    };
  }, [user]);

  const saveLog = async () => {
    if (!user) return;
    try {
      if (currentLog.id) {
        await updateDoc(doc(db, "logs", currentLog.id), currentLog);
      } else {
        await addDoc(collection(db, "logs"), { ...currentLog, uid: user.uid });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "logs");
    }
  };

  const addFood = () => {
    if (!newFood.trim()) return;
    setCurrentLog({
      ...currentLog,
      foodItems: [...currentLog.foodItems, newFood]
    });
    setNewFood("");
  };

  const removeFood = (idx: number) => {
    setCurrentLog({
      ...currentLog,
      foodItems: currentLog.foodItems.filter((_: any, i: number) => i !== idx)
    });
  };

  const saveProgress = async () => {
    if (!user || !newWeight) return;
    try {
      await addDoc(collection(db, "progress"), {
        uid: user.uid,
        date: new Date().toISOString().split('T')[0],
        weight: parseFloat(newWeight),
        notes: ""
      });
      setNewWeight("");
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "progress");
    }
  };

  const adherenceRate = logs.length > 0 
    ? Math.round((logs.filter(l => l.adherence).length / logs.length) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Summary Card */}
        <Card className="lg:col-span-2 border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-800">
              <Calendar className="w-6 h-6" />
              Diário de Hoje
            </CardTitle>
            <CardDescription>Registre sua alimentação e adesão ao plano.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <div className="space-y-2 flex-1 min-w-[200px]">
                <Label>Você seguiu o plano hoje?</Label>
                <div className="flex gap-2">
                  <Button
                    variant={currentLog.adherence ? "default" : "outline"}
                    className={currentLog.adherence ? "bg-emerald-600" : ""}
                    onClick={() => setCurrentLog({ ...currentLog, adherence: true })}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Sim
                  </Button>
                  <Button
                    variant={!currentLog.adherence ? "destructive" : "outline"}
                    onClick={() => setCurrentLog({ ...currentLog, adherence: false })}
                  >
                    <XCircle className="w-4 h-4 mr-2" /> Não
                  </Button>
                </div>
              </div>
              <div className="space-y-2 flex-1 min-w-[200px]">
                <Label>Como você se sente?</Label>
                <select
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={currentLog.wellBeing}
                  onChange={(e) => setCurrentLog({ ...currentLog, wellBeing: e.target.value })}
                >
                  <option>Ótimo</option>
                  <option>Bem</option>
                  <option>Cansado</option>
                  <option>Indisposto</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Utensils className="w-4 h-4" /> O que você comeu?
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: Omelete com espinafre"
                  value={newFood}
                  onChange={(e) => setNewFood(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addFood()}
                />
                <Button onClick={addFood} variant="outline" size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentLog.foodItems.map((item: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="pl-3 pr-1 py-1 gap-2 bg-emerald-50 text-emerald-700">
                    {item}
                    <button onClick={() => removeFood(idx)} className="hover:text-red-500">
                      <XCircle className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-500" /> Água (Litros)
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    step="0.5"
                    value={currentLog.waterIntake}
                    onChange={(e) => setCurrentLog({ ...currentLog, waterIntake: parseFloat(e.target.value) })}
                  />
                  <span className="text-sm text-gray-500">L</span>
                </div>
              </div>
              <div className="flex items-end">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={saveLog}>
                  Salvar Registro do Dia
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="border-none shadow-lg bg-emerald-900 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Seu Progresso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Adesão ao Plano</span>
                <span>{adherenceRate}%</span>
              </div>
              <Progress value={adherenceRate} className="bg-emerald-800" />
            </div>

            <div className="space-y-4">
              <Label className="text-white">Registrar Peso Atual (kg)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Ex: 74.5"
                  className="bg-emerald-800 border-none text-white placeholder:text-emerald-400"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                />
                <Button onClick={saveProgress} className="bg-white text-emerald-900 hover:bg-emerald-50">
                  OK
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-emerald-800">
              <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                <Scale className="w-4 h-4" /> Histórico de Peso
              </h4>
              <div className="space-y-3">
                {progress.slice(0, 3).map((p, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="opacity-70">{p.date}</span>
                    <span className="font-bold">{p.weight} kg</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <Card className="border-none shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <History className="w-6 h-6" />
            Histórico Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {logs.map((log, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-emerald-50 hover:bg-emerald-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${log.adherence ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                      {log.adherence ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-emerald-950">{log.date}</p>
                      <p className="text-xs text-gray-500">{log.foodItems.length} itens registrados • {log.waterIntake}L água</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-emerald-700 border-emerald-200">
                      {log.wellBeing}
                    </Badge>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500" onClick={async () => {
                      if (confirm("Excluir este registro?")) {
                        await deleteDoc(doc(db, "logs", log.id));
                      }
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                  Nenhum registro encontrado. Comece hoje!
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
