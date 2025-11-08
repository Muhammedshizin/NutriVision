'use client';

import { useLocalStorage } from "@/hooks/use-local-storage";
import { FoodAnalysis, HealthGoal } from "@/lib/types";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getHealthierAlternatives } from "@/lib/actions";
import { Lightbulb, Loader2 } from "lucide-react";
import { Button } from "../ui/button";

export function Recommendations() {
    const [history] = useLocalStorage<FoodAnalysis[]>('food-analysis-history', []);
    const [recommendations, setRecommendations] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRecommendations = async () => {
        if (history.length === 0) return;
        
        setIsLoading(true);
        setError(null);
        
        const recentHistory = history.slice(0, 10);
        const mostRecentGoal = recentHistory[0]?.healthGoal || 'balanced diet';

        const result = await getHealthierAlternatives({
            foodAnalysisHistory: JSON.stringify(recentHistory.map(h => h.nutritionInfo)),
            healthGoals: mostRecentGoal
        });

        if ('error' in result) {
            setError(result.error);
        } else {
            setRecommendations(result.recommendations);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (history.length > 0) {
            fetchRecommendations();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [history.length]);
    
    if (history.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-400" />
                        Healthier Choice Recommendations
                    </div>
                    <Button variant="ghost" size="sm" onClick={fetchRecommendations} disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Refresh'}
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading && !recommendations && (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
                {error && <p className="text-destructive text-sm">{error}</p>}
                {recommendations && <p className="text-muted-foreground">{recommendations}</p>}
            </CardContent>
        </Card>
    );
}
