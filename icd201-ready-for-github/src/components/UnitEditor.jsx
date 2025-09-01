import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  ArrowLeft, 
  Plus, 
  Edit2, 
  Save, 
  Trash2,
  Clock,
  Target,
  BookOpen,
  Settings
} from 'lucide-react';
import { mockUnits, mockResources } from '../data/mockData';
import { useToast } from '../hooks/use-toast';

const UnitEditor = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [unit, setUnit] = useState(null);
  const [resources] = useState(mockResources);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);

  useEffect(() => {
    const foundUnit = mockUnits.find(u => u.id === parseInt(id));
    setUnit(foundUnit ? JSON.parse(JSON.stringify(foundUnit)) : null);
  }, [id]);

  const handleSaveUnit = () => {
    setIsEditing(false);
    toast({
      title: "Unité sauvegardée (Simulation)",
      description: "Les modifications seraient sauvegardées dans une vraie application.",
    });
  };

  const handleAddLesson = () => {
    const newLesson = {
      id: Date.now(),
      title: "Nouvelle leçon",
      duration: 2,
      resources: [],
      activities: [],
      content: "Contenu de la leçon à définir..."
    };
    
    setUnit({
      ...unit,
      lessons: [...unit.lessons, newLesson]
    });
    
    toast({
      title: "Leçon ajoutée",
      description: "Une nouvelle leçon a été créée.",
    });
  };

  const handleDeleteLesson = (lessonId) => {
    setUnit({
      ...unit,
      lessons: unit.lessons.filter(l => l.id !== lessonId)
    });
    
    toast({
      title: "Leçon supprimée",
      description: "La leçon a été supprimée avec succès.",
    });
  };

  const updateLessonField = (lessonId, field, value) => {
    setUnit({
      ...unit,
      lessons: unit.lessons.map(lesson => 
        lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
      )
    });
  };

  if (!unit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'unité...</p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold text-gray-800">{unit.title}</h1>
              <p className="text-gray-600">Unité {unit.id} • {unit.duration} heures</p>
            </div>
          </div>
          <Button 
            onClick={isEditing ? handleSaveUnit : () => setIsEditing(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600"
          >
            {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit2 className="h-4 w-4 mr-2" />}
            {isEditing ? 'Sauvegarder' : 'Modifier'}
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="lessons">Leçons</TabsTrigger>
            <TabsTrigger value="resources">Ressources</TabsTrigger>
            <TabsTrigger value="objectives">Objectifs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Informations générales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Titre de l'unité</label>
                  {isEditing ? (
                    <Input 
                      value={unit.title}
                      onChange={(e) => setUnit({...unit, title: e.target.value})}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-gray-800">{unit.title}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-700">Description</label>
                  {isEditing ? (
                    <Textarea 
                      value={unit.description}
                      onChange={(e) => setUnit({...unit, description: e.target.value})}
                      className="mt-1 min-h-[100px]"
                    />
                  ) : (
                    <p className="mt-1 text-gray-600">{unit.description}</p>
                  )}
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-semibold text-gray-700">Durée (heures)</label>
                    {isEditing ? (
                      <Input 
                        type="number"
                        value={unit.duration}
                        onChange={(e) => setUnit({...unit, duration: parseInt(e.target.value)})}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-800">{unit.duration} heures</p>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-semibold text-gray-700">Nombre de leçons</label>
                    <p className="mt-1 text-gray-800">{unit.lessons.length} leçons</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">
                  Leçons ({unit.lessons.length})
                </h3>
                <Button onClick={handleAddLesson} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une leçon
                </Button>
              </div>

              <div className="space-y-4">
                {unit.lessons.map((lesson, index) => (
                  <Card key={lesson.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">Leçon {index + 1}</Badge>
                          <CardTitle className="text-lg">{lesson.title}</CardTitle>
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setEditingLesson(lesson)}>
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Modifier la leçon</DialogTitle>
                                <DialogDescription>
                                  Modifiez les détails de cette leçon
                                </DialogDescription>
                              </DialogHeader>
                              {editingLesson && (
                                <div className="space-y-4">
                                  <Input
                                    placeholder="Titre de la leçon"
                                    value={editingLesson.title}
                                    onChange={(e) => updateLessonField(editingLesson.id, 'title', e.target.value)}
                                  />
                                  <Input
                                    type="number"
                                    placeholder="Durée (heures)"
                                    value={editingLesson.duration}
                                    onChange={(e) => updateLessonField(editingLesson.id, 'duration', parseInt(e.target.value))}
                                  />
                                  <Textarea
                                    placeholder="Contenu de la leçon"
                                    value={editingLesson.content}
                                    onChange={(e) => updateLessonField(editingLesson.id, 'content', e.target.value)}
                                    className="min-h-[100px]"
                                  />
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteLesson(lesson.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {lesson.duration}h
                        </span>
                        <span>Ressources: {lesson.resources.length}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-3">{lesson.content}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {lesson.resources.map((resource, idx) => (
                          <Badge key={idx} variant="secondary">{resource}</Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {lesson.activities.map((activity, idx) => (
                          <Badge key={idx} variant="outline">{activity}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resources">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Attribution des ressources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resources.map(resource => (
                    <Card key={resource.id} className="border">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{resource.name}</CardTitle>
                            <CardDescription>Quantité: {resource.quantity}</CardDescription>
                          </div>
                          <Badge variant="outline">{resource.availability}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                        <p className="text-xs text-gray-500">
                          Utilisé dans {unit.lessons.filter(lesson => 
                            lesson.resources.includes(resource.id)
                          ).length} leçons
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="objectives">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Objectifs d'apprentissage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {unit.objectives.map((objective, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Badge variant="outline" className="mt-0.5">
                        {index + 1}
                      </Badge>
                      <div className="flex-1">
                        {isEditing ? (
                          <Textarea
                            value={objective}
                            onChange={(e) => {
                              const newObjectives = [...unit.objectives];
                              newObjectives[index] = e.target.value;
                              setUnit({...unit, objectives: newObjectives});
                            }}
                            className="bg-white"
                          />
                        ) : (
                          <p className="text-gray-700">{objective}</p>
                        )}
                      </div>
                      {isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newObjectives = unit.objectives.filter((_, i) => i !== index);
                            setUnit({...unit, objectives: newObjectives});
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setUnit({
                          ...unit,
                          objectives: [...unit.objectives, "Nouvel objectif d'apprentissage"]
                        });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un objectif
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UnitEditor;