"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Map } from "./map";
import { stations } from "./stations";

export default function Home() {
  const [currentStation, setCurrentStation] = useState(1);
  const [progress, setProgress] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showOverview, setShowOverview] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Simulate loading or any initial setup
    // const timer = setTimeout(() => {
    //   setShowWelcome(false);
    // }, 3000); // Show welcome screen for 3 seconds

    // return () => clearTimeout(timer);
  }, []);

  const totalStations = stations.length;

  const handleAnswerSubmit = () => {
    const currentStationData = stations[currentStation - 1];

    if (!currentStationData) {
      setFeedbackMessage("Stationsdaten nicht gefunden.");
      return;
    }

    setSubmitted(true);

    if (answer.toLowerCase() === currentStationData.correctAnswer.toLowerCase()) {
      if (currentStation < totalStations) {
        setCurrentStation(currentStation + 1);
        setProgress(((currentStation) / totalStations) * 100);
        setAnswer("");
        setSubmitted(false);
      } else {
        setIsCompleted(true);
      }
    } else {
      setFeedbackMessage("Falsche Antwort. Bitte versuche es erneut.");
    }
  };

  const handleStartClick = () => {
    setShowWelcome(false);
    setShowOverview(true);
  };

  const handleOverviewComplete = () => {
    setShowOverview(false);
    setProgress(((currentStation - 1) / totalStations) * 100);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background py-8 px-4">
      {showWelcome ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Willkommen beim Pfarrkirchen Explorer!
          </h1>
          <p className="text-lg text-muted-foreground">
            Mach dich bereit, die verborgenen Schätze von Pfarrkirchen zu entdecken.
          </p>
          <Button onClick={handleStartClick}>Starten</Button>
        </div>
      ) : showOverview ? (
        <RouteOverview stations={stations} onComplete={handleOverviewComplete} />
      ) : !isCompleted ? (
        <>
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Pfarrkirchen Explorer
            </h1>
            <p className="text-muted-foreground">
              Entdecke die verborgenen Schätze von Pfarrkirchen!
            </p>
          </header>

          <Progress value={progress} className="w-full max-w-md mb-4" />
          <p className="text-sm text-muted-foreground mb-4">
            Station {currentStation} von {totalStations}
          </p>

          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{stations[currentStation - 1].title}</CardTitle>
              <CardDescription>
                {stations[currentStation - 1].riddle}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Input
                type="text"
                placeholder="Deine Antwort"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              {submitted && (
                <p
                  className={`text-sm text-center mb-2 ${
                    feedbackMessage === "Korrekte Antwort!"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {feedbackMessage}
                </p>
              )}
              <Button onClick={handleAnswerSubmit}>Antwort absenden</Button>

            </CardContent>
          </Card>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Herzlichen Glückwunsch!
          </h2>
          <p className="text-muted-foreground">
            Du hast alle Stationen des Pfarrkirchen Explorers abgeschlossen!
          </p>
          {/* Completion Recap and Share Button can be added here */}
        </div>
      )}
    </div>
  );
}

interface RouteOverviewProps {
  stations: { id: number; title: string; riddle: string }[];
  onComplete: () => void;
}

const RouteOverview: React.FC<RouteOverviewProps> = ({ stations, onComplete }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold text-foreground mb-4">Routenübersicht</h2>
      <div className="mb-4">
        <Map stations={stations} currentStation={0} />
      </div>
      <ul className="list-none pl-0 timeline">
        {stations.map((station) => (
          <li key={station.id} className="mb-2">
            {station.title}
          </li>
        ))}
      </ul>
      <Button onClick={onComplete}>Erkundung starten</Button>
    </div>
  );
};
