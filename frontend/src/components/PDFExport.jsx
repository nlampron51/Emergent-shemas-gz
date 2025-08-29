import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Settings,
  Eye,
  Calendar,
  Clock,
  Users,
  Target,
  Loader2
} from 'lucide-react';
import apiService, { handleApiError } from '../services/api';
import { useToast } from '../hooks/use-toast';

const PDFExport = () => {
  const { toast } = useToast();
  const [units, setUnits] = useState([]);
  const [resources, setResources] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    loadExportData();
  }, []);

  const loadExportData = async () => {
    try {
      setLoading(true);
      
      const [unitsData, resourcesData, settingsData] = await Promise.all([
        apiService.getUnits(),
        apiService.getResources(),
        apiService.getCourseSettings()
      ]);
      
      setUnits(unitsData);
      setResources(resourcesData);
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
  
  const [exportOptions, setExportOptions] = useState({
    includeObjectives: true,
    includeLessons: true,
    includeResources: true,
    includeSchedule: true,
    includeActivities: true,
    detailLevel: 'detailed'
  });

  const [selectedUnits, setSelectedUnits] = useState(
    units.reduce((acc, unit) => ({ ...acc, [unit.id]: true }), {})
  );

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      
      const selectedUnitsList = units.filter(unit => selectedUnits[unit.id]);
      
      toast({
        title: "Export PDF en cours",
        description: `Génération du PDF avec ${selectedUnitsList.length} unités...`,
      });

      const exportOptions = {
        ...exportOptions,
        selected_units: selectedUnitsList.map(unit => unit.id)
      };

      await apiService.exportToPDF(exportOptions);
      
      toast({
        title: "PDF généré avec succès",
        description: "Le fichier a été téléchargé dans votre dossier de téléchargements.",
      });
    } catch (error) {
      const errorInfo = handleApiError(error);
      toast({
        title: "Erreur d'export",
        description: errorInfo.message,
        variant: "destructive"
      });
    } finally {
      setExporting(false);
    }
  };

  const getTotalHours = () => {
    return units
      .filter(unit => selectedUnits[unit.id])
      .reduce((acc, unit) => acc + unit.duration, 0);
  };

  const getTotalLessons = () => {
    return units
      .filter(unit => selectedUnits[unit.id])
      .reduce((acc, unit) => acc + unit.lessons.length, 0);
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
              <h1 className="text-3xl font-bold text-gray-800">Export PDF</h1>
              <p className="text-gray-600">Générer le document de schéma de cours</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Aperçu
            </Button>
            <Button onClick={handleExportPDF} className="bg-gradient-to-r from-purple-500 to-pink-600">
              <Download className="h-4 w-4 mr-2" />
              Télécharger PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Export Options */}
          <div className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Options d'export
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">Niveau de détail</label>
                  <Select value={exportOptions.detailLevel} onValueChange={(value) => 
                    setExportOptions({...exportOptions, detailLevel: value})
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Résumé simple</SelectItem>
                      <SelectItem value="detailed">Détaillé complet</SelectItem>
                      <SelectItem value="custom">Personnalisé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Sections à inclure</label>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="objectives"
                        checked={exportOptions.includeObjectives}
                        onCheckedChange={(checked) => 
                          setExportOptions({...exportOptions, includeObjectives: checked})
                        }
                      />
                      <label htmlFor="objectives" className="text-sm text-gray-700">
                        Objectifs d'apprentissage
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="lessons"
                        checked={exportOptions.includeLessons}
                        onCheckedChange={(checked) => 
                          setExportOptions({...exportOptions, includeLessons: checked})
                        }
                      />
                      <label htmlFor="lessons" className="text-sm text-gray-700">
                        Détail des leçons
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="resources"
                        checked={exportOptions.includeResources}
                        onCheckedChange={(checked) => 
                          setExportOptions({...exportOptions, includeResources: checked})
                        }
                      />
                      <label htmlFor="resources" className="text-sm text-gray-700">
                        Ressources technologiques
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="schedule"
                        checked={exportOptions.includeSchedule}
                        onCheckedChange={(checked) => 
                          setExportOptions({...exportOptions, includeSchedule: checked})
                        }
                      />
                      <label htmlFor="schedule" className="text-sm text-gray-700">
                        Calendrier et planification
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="activities"
                        checked={exportOptions.includeActivities}
                        onCheckedChange={(checked) => 
                          setExportOptions({...exportOptions, includeActivities: checked})
                        }
                      />
                      <label htmlFor="activities" className="text-sm text-gray-700">
                        Activités pédagogiques
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Résumé de l'export</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Unités sélectionnées</span>
                  <Badge>{Object.values(selectedUnits).filter(Boolean).length}/4</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Heures totales</span>
                  <Badge className="bg-blue-600">{getTotalHours()}h</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Leçons totales</span>
                  <Badge variant="outline">{getTotalLessons()}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Preview */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Aperçu du document
                </CardTitle>
                <CardDescription>
                  Sélectionnez les unités à inclure dans le PDF
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Course Overview */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
                    <h3 className="text-xl font-bold text-blue-900 mb-2">
                      ICD201 - Technologies numériques et innovations
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-blue-700">
                        <Clock className="h-4 w-4" />
                        {schedule.totalHours} heures sur {schedule.totalWeeks} semaines
                      </div>
                      <div className="flex items-center gap-2 text-blue-700">
                        <Calendar className="h-4 w-4" />
                        {new Date(schedule.startDate).toLocaleDateString('fr-FR')} - {new Date(schedule.endDate).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>

                  {/* Units Selection */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Unités du cours
                    </h4>
                    
                    {units.map(unit => (
                      <Card key={unit.id} className={`border transition-all ${selectedUnits[unit.id] ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              id={`unit-${unit.id}`}
                              checked={selectedUnits[unit.id]}
                              onCheckedChange={(checked) => 
                                setSelectedUnits({...selectedUnits, [unit.id]: checked})
                              }
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-semibold text-gray-800">
                                  Unité {unit.id}: {unit.title}
                                </h5>
                                <Badge variant="outline">{unit.duration}h</Badge>
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-3">{unit.description}</p>
                              
                              {exportOptions.includeObjectives && selectedUnits[unit.id] && (
                                <div className="mb-3">
                                  <h6 className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                                    <Target className="h-3 w-3" />
                                    Objectifs:
                                  </h6>
                                  <ul className="text-xs text-gray-600 space-y-0.5">
                                    {unit.objectives.slice(0, 2).map((obj, idx) => (
                                      <li key={idx} className="flex items-start gap-1">
                                        <span className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></span>
                                        {obj}
                                      </li>
                                    ))}
                                    {unit.objectives.length > 2 && (
                                      <li className="text-gray-500">... et {unit.objectives.length - 2} autres</li>
                                    )}
                                  </ul>
                                </div>
                              )}

                              {exportOptions.includeLessons && selectedUnits[unit.id] && (
                                <div>
                                  <h6 className="text-xs font-semibold text-gray-700 mb-1">
                                    Leçons ({unit.lessons.length}):
                                  </h6>
                                  <div className="grid grid-cols-1 gap-1">
                                    {unit.lessons.slice(0, 3).map((lesson, idx) => (
                                      <div key={idx} className="text-xs text-gray-600 flex justify-between">
                                        <span className="truncate">{lesson.title}</span>
                                        <span>{lesson.duration}h</span>
                                      </div>
                                    ))}
                                    {unit.lessons.length > 3 && (
                                      <p className="text-xs text-gray-500">
                                        ... et {unit.lessons.length - 3} autres leçons
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {exportOptions.includeResources && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Ressources technologiques</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {resources.map(resource => (
                          <div key={resource.id} className="p-3 bg-gray-50 rounded-lg">
                            <h6 className="font-medium text-sm text-gray-800">{resource.name}</h6>
                            <p className="text-xs text-gray-600">{resource.quantity} unités</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFExport;