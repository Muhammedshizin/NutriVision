'use client';

import { useState, useRef } from 'react';
import {
  Camera,
  Loader2,
  Sparkles,
  Upload,
  HeartPulse,
  Info,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getDietFeedback, getNutritionData } from '@/lib/actions';
import type { FoodAnalysis, HealthGoal, NutritionInfo } from '@/lib/types';
import { healthGoals } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { useLanguage } from '@/hooks/use-language';

type AnalysisState = 'idle' | 'analyzing' | 'feedback' | 'done';

export function ImageAnalyzer() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [healthGoal, setHealthGoal] = useState<HealthGoal>('balanced diet');
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [nutritionInfo, setNutritionInfo] = useState<NutritionInfo | null>(
    null
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [history, setHistory] = useLocalStorage<FoodAnalysis[]>(
    'food-analysis-history',
    []
  );
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { translations } = useLanguage();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'Image too large',
          description: 'Please upload an image smaller than 4MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUri = e.target?.result as string;
        setImageData(dataUri);

        // For preview, we can use a different reader to get object URL to avoid large data URI in DOM
        const previewReader = new FileReader();
        previewReader.onload = (e) =>
          setImagePreview(e.target?.result as string);
        previewReader.readAsDataURL(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imageData) {
      toast({
        variant: 'destructive',
        title: 'No image selected',
        description: 'Please upload or take a picture of your meal.',
      });
      return;
    }

    setAnalysisState('analyzing');
    setNutritionInfo(null);
    setFeedback(null);

    const nutritionResult = await getNutritionData(imageData);
    if ('error' in nutritionResult) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: nutritionResult.error,
      });
      setAnalysisState('idle');
      return;
    }
    setNutritionInfo(nutritionResult);

    setAnalysisState('feedback');
    const feedbackResult = await getDietFeedback({
      foodName: nutritionResult.foodItems.join(', '),
      calories: nutritionResult.calories,
      protein: nutritionResult.protein,
      fat: nutritionResult.fat,
      carbs: nutritionResult.carbohydrates,
      healthGoal,
    });

    if ('error' in feedbackResult) {
      toast({
        variant: 'destructive',
        title: 'Feedback Failed',
        description: feedbackResult.error,
      });
    } else {
      setFeedback(feedbackResult.feedback);
    }

    const newAnalysis: FoodAnalysis = {
      id: new Date().toISOString(),
      date: new Date().toISOString(),
      imageDataUri: imageData,
      healthGoal,
      nutritionInfo: nutritionResult,
      feedback: feedbackResult.feedback || 'No feedback generated.',
    };

    setHistory([newAnalysis, ...history]);
    setAnalysisState('done');
  };

  const handleReset = () => {
    setImagePreview(null);
    setImageData(null);
    setAnalysisState('idle');
    setNutritionInfo(null);
    setFeedback(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (cameraInputRef.current) {
        cameraInputRef.current.value = '';
    }
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl">
          {translations.analyzerTitle}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {translations.analyzerSubtitle}
        </p>
      </div>

      {!imagePreview && (
        <Card className="flex flex-col items-center justify-center border-2 border-dashed bg-card/50 p-12 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
           <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            ref={cameraInputRef}
            className="hidden"
          />
          <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium text-foreground">
            Take or upload a photo
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            PNG, JPG, WEBP up to 4MB
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" /> Upload from Device
            </Button>
            <Button
              variant="secondary"
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera className="mr-2 h-4 w-4" /> Take a Picture
            </Button>
          </div>
        </Card>
      )}

      {imagePreview && (
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Your Meal & Goal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                <Image
                  src={imagePreview}
                  alt="Your meal"
                  fill
                  className="object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8 rounded-full"
                  onClick={handleReset}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="health-goal"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <HeartPulse className="h-4 w-4" />
                  Select Your Health Goal
                </label>
                <Select
                  value={healthGoal}
                  onValueChange={(v) => setHealthGoal(v as HealthGoal)}
                  disabled={analysisState !== 'idle'}
                >
                  <SelectTrigger id="health-goal" className="w-full">
                    <SelectValue placeholder="Select a goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {healthGoals.map((goal) => (
                      <SelectItem
                        key={goal}
                        value={goal}
                        className="capitalize"
                      >
                        {goal.charAt(0).toUpperCase() + goal.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={analysisState !== 'idle'}
                className="w-full"
                size="lg"
              >
                {analysisState === 'idle' ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Analyze Meal
                  </>
                ) : (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {analysisState === 'analyzing'
                      ? 'Analyzing Nutrients...'
                      : 'Getting Feedback...'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          <div className="space-y-8">
            {analysisState !== 'idle' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Nutritional Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {nutritionInfo ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold">Identified Food</h4>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {nutritionInfo.foodItems.map((item, i) => (
                            <Badge key={i} variant="secondary">
                              {item} ({nutritionInfo.estimatedPortionSizes[i]})
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <Nutrient
                          name="Calories"
                          value={nutritionInfo.calories}
                          unit="kcal"
                          color="bg-yellow-400"
                        />
                        <Nutrient
                          name="Protein"
                          value={nutritionInfo.protein}
                          unit="g"
                          color="bg-red-400"
                        />
                        <Nutrient
                          name="Fat"
                          value={nutritionInfo.fat}
                          unit="g"
                          color="bg-blue-400"
                        />
                        <Nutrient
                          name="Carbs"
                          value={nutritionInfo.carbohydrates}
                          unit="g"
                          color="bg-green-400"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {(analysisState === 'feedback' || analysisState === 'done') && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HeartPulse className="h-5 w-5 text-primary" />
                    Personalized Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {feedback ? (
                    <p className="text-sm text-muted-foreground">
                      {feedback}
                    </p>
                  ) : (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Nutrient({
  name,
  value,
  unit,
  color,
}: {
  name: string;
  value: number;
  unit: string;
  color: string;
}) {
  const progress =
    name === 'Calories'
      ? (value / 2000) * 100
      : name === 'Protein'
      ? (value / 50) * 100
      : name === 'Fat'
      ? (value / 70) * 100
      : (value / 300) * 100;

  return (
    <div>
      <div className="mb-1 flex justify-between">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-sm font-semibold">
          {Math.round(value)} {unit}
        </span>
      </div>
      <Progress value={progress} indicatorClassName={color} />
    </div>
  );
}

// Override Progress component style locally for indicator color
const OldProgress = Progress;
Progress.defaultProps = {
  ...OldProgress.defaultProps,
  indicatorClassName: 'bg-primary',
};
