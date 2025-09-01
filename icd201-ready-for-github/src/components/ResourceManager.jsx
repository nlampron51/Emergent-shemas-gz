import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  ArrowLeft, 
  Plus, 
  Edit2, 
  Trash2,
  Monitor,
  Tablet,
  Printer,
  Mic,
  Calendar as CalendarIcon,
  AlertCircle
} from 'lucide-react';
import { mockResources, mockUnits, mockCalendarEvents } from '../data/mockData';
import { useToast } from '../hooks/use-toast';

const ResourceManager = () => {
  const [resources, setResources] = useState(mockResources);
  const [units] = useState(mockUnits);
  const [events] = useState(mockCalendarEvents);
  const { toast } = useToast();

  const getResourceIcon = (resourceId) => {
    const icons = {
      ordinateurs: <Monitor className="h-5 w-5" />,
      iPad: <Tablet className="h-5 w-5" />,
      imprimantes3D: <Printer className="h-5 w-5" />,
      dispositifsAudioUSB: <Mic className="h-5 w-5" />
    };
    return icons[resourceId] || <Monitor className="h-5 w-5" />;
  };

  const getResourceUsage = (resourceId) => {
    let totalUsage = 0;
    units.forEach(unit => {
      unit.lessons.forEach(lesson => {
        if (lesson.resources.includes(resourceId)) {
          totalUsage += lesson.duration;
        }
      });
    });
    return totalUsage;
  };

  const getResourceAvailability = (resourceId, date) => {
    const dayEvents = events.filter(event => 
      event.date === date && event.resources.includes(resourceId)
    );
    return dayEvents.length;
  };

  const handleAddResource = () => {
    const newResource = {
      id: `resource_${Date.now()}`,
      name: "Nouvelle ressource",
      quantity: 1,
      description: "Description à compléter",
      availability: "Disponible"
    };
    
    setResources([...resources, newResource]);
    toast({
      title: "Ressource ajoutée",
      description: "Une nouvelle ressource a été créée.",
    });
  };

  const handleDeleteResource = (resourceId) => {
    setResources(resources.filter(r => r.id !== resourceId));
    toast({
      title: "Ressource supprimée",
      description: "La ressource a été supprimée avec succès.",
    });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Gestion des Ressources</h1>
              <p className="text-gray-600">Équipements et planification d'utilisation</p>
            </div>
          </div>
          <Button onClick={handleAddResource} className="bg-gradient-to-r from-green-500 to-emerald-600">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une ressource
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="planning">Planification</TabsTrigger>
            <TabsTrigger value="usage">Utilisation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map(resource => {
                const usage = getResourceUsage(resource.id);
                const usagePercentage = (usage / 110) * 100; // Total course hours
                
                return (
                  <Card key={resource.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg text-white">
                            {getResourceIcon(resource.id)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{resource.name}</CardTitle>
                            <CardDescription>
                              {resource.quantity} unités disponibles
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteResource(resource.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">Utilisation dans le cours</span>
                            <span className="text-sm text-gray-600">{usage}h / 110h</span>
                          </div>
                          <Progress value={usagePercentage} className="h-2" />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">Statut</span>
                          <Badge 
                            variant={resource.availability === "Disponible en permanence" ? "default" : "outline"}
                          >
                            {resource.availability}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="planning">
            <div className="space-y-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Calendrier d'utilisation des ressources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.map(event => {
                      const eventUnit = units.find(u => u.id === event.unitId);
                      const eventLesson = eventUnit?.lessons.find(l => l.id === event.lessonId);
                      
                      return (
                        <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{event.title}</h4>
                            <p className="text-sm text-gray-600">
                              {eventUnit?.title} • {event.duration}h
                            </p>
                            <div className="flex gap-2 mt-2">
                              {event.resources.map((resourceId, idx) => {
                                const resourceName = resources.find(r => r.id === resourceId)?.name;
                                return (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {resourceName}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">
                              {new Date(event.date).toLocaleDateString('fr-FR')}
                            </p>
                            <p className="text-sm text-gray-600">Semaine {Math.ceil((new Date(event.date) - new Date('2025-01-15')) / (7 * 24 * 60 * 60 * 1000))}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Conflits potentiels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-800">Attention</p>
                      <p className="text-sm text-yellow-700">
                        Les imprimantes 3D sont très sollicitées en février. Considérez étaler les activités d'impression.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="usage">
            <div className="space-y-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Statistiques d'utilisation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {resources.map(resource => {
                      const totalUsage = getResourceUsage(resource.id);
                      const lessonsUsing = [];
                      
                      units.forEach(unit => {
                        unit.lessons.forEach(lesson => {
                          if (lesson.resources.includes(resource.id)) {
                            lessonsUsing.push({
                              unitTitle: unit.title,
                              lessonTitle: lesson.title,
                              duration: lesson.duration
                            });
                          }
                        });
                      });

                      return (
                        <Card key={resource.id} className="border">
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                              {getResourceIcon(resource.id)}
                              <CardTitle className="text-lg">{resource.name}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Heures totales</span>
                              <Badge>{totalUsage}h</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Leçons concernées</span>
                              <Badge variant="outline">{lessonsUsing.length}</Badge>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-gray-700">Utilisation par leçon:</p>
                              {lessonsUsing.slice(0, 3).map((lesson, idx) => (
                                <div key={idx} className="text-xs text-gray-600 flex justify-between">
                                  <span className="truncate">{lesson.lessonTitle}</span>
                                  <span>{lesson.duration}h</span>
                                </div>
                              ))}
                              {lessonsUsing.length > 3 && (
                                <p className="text-xs text-gray-500">
                                  ... et {lessonsUsing.length - 3} autres leçons
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResourceManager;