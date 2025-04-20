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
      setFeedbackMessage("Station data not found.");
      return;
    }

    if (answer.toLowerCase() === currentStationData.correctAnswer.toLowerCase()) {
      setFeedbackMessage("Correct answer!");
      if (currentStation < totalStations) {
        setCurrentStation(currentStation + 1);
        setProgress(((currentStation) / totalStations) * 100);
        setAnswer("");
      } else {
        setIsCompleted(true);
      }
    } else {
      setFeedbackMessage("Incorrect answer. Please try again.");
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
            Welcome to Pfarrkirchen Explorer!
          </h1>
          <p className="text-lg text-muted-foreground">
            Get ready to discover the hidden gems of Pfarrkirchen.
          </p>
          <Button onClick={handleStartClick}>Start</Button>
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
              Discover the hidden gems of Pfarrkirchen!
            </p>
          </header>

          <Progress value={progress} className="w-full max-w-md mb-4" />
          <p className="text-sm text-muted-foreground mb-4">
            Station {currentStation} of {totalStations}
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
                placeholder="Your Answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <Button onClick={handleAnswerSubmit}>Submit Answer</Button>
              {feedbackMessage && (
                <p className="text-sm text-muted-foreground">{feedbackMessage}</p>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Congratulations!
          </h2>
          <p className="text-muted-foreground">
            You have completed all stations of the Pfarrkirchen Explorer!
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
      <h2 className="text-2xl font-bold text-foreground mb-4">Route Overview</h2>
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
      <Button onClick={onComplete}>Start Exploration</Button>
    </div>
  );
};
