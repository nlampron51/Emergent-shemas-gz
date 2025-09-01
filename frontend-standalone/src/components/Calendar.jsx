import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock,
  Filter,
  Plus
} from 'lucide-react';
import { mockCalendarEvents, mockUnits, mockResources, mockSchedule } from '../data/mockData';
import { useToast } from '../hooks/use-toast';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState(mockCalendarEvents);
  const [units] = useState(mockUnits);
  const [resources] = useState(mockResources);
  const [filterUnit, setFilterUnit] = useState('all');
  const [filterResource, setFilterResource] = useState('all');
  const { toast } = useToast();

  // Generate a 18-week calendar view
  const generateCalendarWeeks = () => {
    const startDate = new Date('2025-01-15');
    const weeks = [];
    
    for (let i = 0; i < 18; i++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(startDate.getDate() + (i * 7));
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      weeks.push({
        weekNumber: i + 1,
        startDate: new Date(weekStart),
        endDate: new Date(weekEnd),
        events: events.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= weekStart && eventDate <= weekEnd;
        })
      });
    }
    
    return weeks;
  };

  const weeks = generateCalendarWeeks();

  const getEventsByDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const filteredEvents = events.filter(event => {
    if (filterUnit !== 'all' && event.unitId !== parseInt(filterUnit)) return false;
    if (filterResource !== 'all' && !event.resources.includes(filterResource)) return false;
    return true;
  });

  const handleAddEvent = () => {
    const newEvent = {
      id: Date.now(),
      title: "Nouvel événement",
      unitId: 1,
      lessonId: null,
      date: selectedDate.toISOString().split('T')[0],
      duration: 2,
      resources: []
    };
    
    setEvents([...events, newEvent]);
    toast({
      title: "Événement ajouté",
      description: "Un nouvel événement a été créé.",
    });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
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
              <h1 className="text-3xl font-bold text-gray-800">Calendrier du Cours</h1>
              <p className="text-gray-600">Planification sur 18 semaines • 110 heures</p>
            </div>
          </div>
          <Button onClick={handleAddEvent} className="bg-gradient-to-r from-blue-500 to-cyan-600">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un événement
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filters and Mini Calendar */}
          <div className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtres
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Unité</label>
                  <Select value={filterUnit} onValueChange={setFilterUnit}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les unités" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les unités</SelectItem>
                      {units.map(unit => (
                        <SelectItem key={unit.id} value={unit.id.toString()}>
                          Unité {unit.id}: {unit.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Ressource</label>
                  <Select value={filterResource} onValueChange={setFilterResource}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les ressources" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les ressources</SelectItem>
                      {resources.map(resource => (
                        <SelectItem key={resource.id} value={resource.id}>
                          {resource.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Navigation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Événements total</span>
                  <Badge>{filteredEvents.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Semaines actives</span>
                  <Badge variant="outline">{weeks.filter(w => w.events.length > 0).length}/18</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Heures planifiées</span>
                  <Badge className="bg-green-600">{filteredEvents.reduce((acc, event) => acc + event.duration, 0)}h</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timeline View */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Vue chronologique</CardTitle>
                <CardDescription>
                  Janvier 2025 - Mai 2025 • 18 semaines de cours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {weeks.map(week => (
                    <div key={week.weekNumber} className="border-l-4 border-indigo-200 pl-4 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">
                          Semaine {week.weekNumber}
                        </h4>
                        <span className="text-sm text-gray-600">
                          {week.startDate.toLocaleDateString('fr-FR')} - {week.endDate.toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      
                      {week.events.length > 0 ? (
                        <div className="space-y-2">
                          {week.events.map(event => {
                            const unit = units.find(u => u.id === event.unitId);
                            return (
                              <div key={event.id} className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h5 className="font-medium text-gray-800">{event.title}</h5>
                                    <p className="text-sm text-gray-600">{unit?.title}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                      <span className="flex items-center gap-1 text-xs text-gray-500">
                                        <Clock className="h-3 w-3" />
                                        {event.duration}h
                                      </span>
                                      <div className="flex gap-1">
                                        {event.resources.map((resourceId, idx) => {
                                          const resource = resources.find(r => r.id === resourceId);
                                          return (
                                            <Badge key={idx} variant="outline" className="text-xs">
                                              {resource?.name}
                                            </Badge>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                  <Badge className="ml-2">
                                    {new Date(event.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                                  </Badge>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">Aucun cours planifié cette semaine</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Events for selected date */}
            {selectedDate && (
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>
                    Événements du {selectedDate.toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getEventsByDate(selectedDate).length > 0 ? (
                    <div className="space-y-3">
                      {getEventsByDate(selectedDate).map(event => {
                        const unit = units.find(u => u.id === event.unitId);
                        return (
                          <div key={event.id} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                            <h4 className="font-semibold text-blue-900">{event.title}</h4>
                            <p className="text-blue-700 text-sm mb-2">{unit?.title}</p>
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1 text-sm text-blue-600">
                                <Clock className="h-4 w-4" />
                                {event.duration} heures
                              </span>
                              <div className="flex gap-1">
                                {event.resources.map((resourceId, idx) => {
                                  const resource = resources.find(r => r.id === resourceId);
                                  return (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {resource?.name}
                                    </Badge>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Aucun événement planifié pour cette date
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;