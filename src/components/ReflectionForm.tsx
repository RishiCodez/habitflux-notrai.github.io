
import React, { useState, useEffect } from 'react';
import CustomButton from './CustomButton';

interface ReflectionFormProps {
  onSubmit: (reflection: {
    accomplishments: string;
    challenges: string;
    insights: string;
  }) => void;
  onCancel: () => void;
  initialData?: {
    accomplishments: string;
    challenges: string;
    insights: string;
  } | null;
}

const ReflectionForm: React.FC<ReflectionFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [accomplishments, setAccomplishments] = useState('');
  const [challenges, setChallenges] = useState('');
  const [insights, setInsights] = useState('');
  
  // Load initial data if provided
  useEffect(() => {
    if (initialData) {
      setAccomplishments(initialData.accomplishments);
      setChallenges(initialData.challenges);
      setInsights(initialData.insights);
    }
  }, [initialData]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      accomplishments,
      challenges,
      insights
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="accomplishments" className="block text-sm font-medium mb-1">
          What did you accomplish today?
        </label>
        <textarea
          id="accomplishments"
          value={accomplishments}
          onChange={(e) => setAccomplishments(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="List your achievements, no matter how small"
          rows={3}
          required
        />
      </div>
      
      <div>
        <label htmlFor="challenges" className="block text-sm font-medium mb-1">
          What challenges did you face?
        </label>
        <textarea
          id="challenges"
          value={challenges}
          onChange={(e) => setChallenges(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="What was difficult or frustrating today?"
          rows={3}
          required
        />
      </div>
      
      <div>
        <label htmlFor="insights" className="block text-sm font-medium mb-1">
          What insights or lessons did you gain?
        </label>
        <textarea
          id="insights"
          value={insights}
          onChange={(e) => setInsights(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="What did you learn that could help you tomorrow?"
          rows={3}
          required
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <CustomButton variant="outline" type="button" onClick={onCancel}>
          Cancel
        </CustomButton>
        <CustomButton type="submit">
          Save Reflection
        </CustomButton>
      </div>
    </form>
  );
};

export default ReflectionForm;
