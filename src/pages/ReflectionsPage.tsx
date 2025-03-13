
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import AppLayout from '../components/AppLayout';
import { loadReflections } from '../utils/localStorageUtils';
import { BookOpen, Calendar, Edit, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

interface Reflection {
  id: string;
  date: string;
  accomplishments: string;
  challenges: string;
  insights: string;
}

const ReflectionsPage: React.FC = () => {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedReflections = loadReflections() || [];
    setReflections(savedReflections);
  }, []);

  const filteredReflections = reflections.filter(
    (reflection) =>
      reflection.accomplishments.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reflection.challenges.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reflection.insights.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatReflectionDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <BookOpen className="mr-2 h-6 w-6" />
          Reflection Library
        </h1>
        <p className="text-muted-foreground">Review your past reflections and insights</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search reflections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredReflections.length > 0 ? (
        <div className="space-y-4">
          {filteredReflections.map((reflection) => (
            <div key={reflection.id} className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-primary mr-2" />
                  <h3 className="text-lg font-semibold">{formatReflectionDate(reflection.date)}</h3>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Accomplishments</h4>
                  <p className="mt-1">{reflection.accomplishments}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Challenges</h4>
                  <p className="mt-1">{reflection.challenges}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Insights</h4>
                  <p className="mt-1">{reflection.insights}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-8 rounded-xl text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No reflections found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery ? "No reflections match your search." : "You haven't added any reflections yet."}
          </p>
          <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        </div>
      )}
    </AppLayout>
  );
};

export default ReflectionsPage;
