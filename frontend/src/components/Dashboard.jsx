import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  BookOpen, 
  Calendar as CalendarIcon, 
  Settings, 
  Download,
  Clock,
  Users,
  Lightbulb,
  Cpu,
  Loader2
} from 'lucide-react';
import apiService, { handleApiError } from '../services/api';
import { useToast } from '../hooks/use-toast';

const Dashboard = () => {
  const [units, setUnits] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load units and course settings in parallel
      const [unitsData, settingsData] = await Promise.all([
        apiService.getUnits(),
        apiService.getCourseSettings()
      ]);
      
      setUnits(unitsData);
      setSchedule(settingsData);
    } catch (error) {
      const errorInfo = handleApiError(error);
      toast({
        title: "Erreur de chargement",
        description: errorInfo.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Erreur de chargement des données</p>
          <Button onClick={loadDashboardData} className="mt-4">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }
  
  const totalProgress = (units.reduce((acc, unit) => acc + unit.duration, 0) / schedule.total_hours) * 100;

  const getUnitIcon = (unitId) => {
    const icons = {
      1: <Cpu className="h-6 w-6" />,
      2: <Lightbulb className="h-6 w-6" />,
      3: <Users className="h-6 w-6" />,
      4: <BookOpen className="h-6 w-6" />
    };
    return icons[unitId] || <BookOpen className="h-6 w-6" />;
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Schéma de Cours ICD201
          </h1>
          <p className="text-lg text-gray-600">
            Technologies numériques et innovations dans un monde en évolution
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="outline" className="px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              {schedule.totalHours} heures
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <CalendarIcon className="h-4 w-4 mr-2" />
              {schedule.totalWeeks} semaines
            </Badge>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Progression du cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={totalProgress} className="h-3" />
              <p className="text-sm text-gray-600">
                {units.length} unités planifiées • {schedule.totalHours} heures totales
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/resources">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
              <CardHeader className="text-center">
                <div className="mx-auto bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Ressources</CardTitle>
                <CardDescription>Gérer les équipements</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/calendar">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
              <CardHeader className="text-center">
                <div className="mx-auto bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                  <CalendarIcon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Calendrier</CardTitle>
                <CardDescription>Planification temporelle</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/export">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
              <CardHeader className="text-center">
                <div className="mx-auto bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Export PDF</CardTitle>
                <CardDescription>Générer le document</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
            <CardHeader className="text-center">
              <div className="mx-auto bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Générateur IA</CardTitle>
              <CardDescription>Contenu automatique</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Units Overview */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Unités du cours</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {units.map((unit) => (
              <Card key={unit.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg text-white group-hover:scale-110 transition-transform">
                        {getUnitIcon(unit.id)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{unit.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {unit.duration} heures • {unit.lessons.length} leçons
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline">{unit.duration}h</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{unit.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-700">Objectifs principaux:</h4>
                    <ul className="space-y-1">
                      {unit.objectives.slice(0, 2).map((objective, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="w-1 h-1 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link to={`/unit/${unit.id}`}>
                    <Button className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300">
                      Modifier l'unité
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;