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

const stations = [
  {
    id: 1,
    title: "Gartlberg Church",
    riddle: "I stand tall, a beacon of faith, where silent bells resonate with grace. Find me atop the mount, where solace you'll count.",
  },
  {
    id: 2,
    title: "Old Racetrack Area",
    riddle: "Where horses once thundered, now memories reside, a trace of the past where speed and thrill coincide. Seek the oval's remains, where history sustains.",
  },
  {
    id: 3,
    title: "Altstadt / City Wall",
    riddle: "Stone-clad embrace, guarding tales untold, walk along the path where history unfolds. Discover where the past still stands tall.",
  },
  {
    id: 4,
    title: "Wimmer-Ross Fountain",
    riddle: "Amidst the town's heart, water dances free, a symbol of life for all to see. Seek the horses drinking, where life-giving waters spring.",
  },
  {
    id: 5,
    title: "City Parish Church (Stadtpfarrkirche)",
    riddle: "Underneath the roof, adorned with art so grand, a towering spire points to the promised land. Find solace in the house of God, where your prayers are heard.",
  },
  {
    id: 6,
    title: "New + Old Town Hall",
    riddle: "Where decisions are made, and laws take flight, governance unfolds, shaping day and night. Two halls stand as one, old and new combined.",
  },
  {
    id: 7,
    title: "Heilig-Geist-Spital (Holy Spirit Hospital)",
    riddle: "In the spirit's embrace, care and comfort reside, a haven of healing where compassion is the guide. Seek the place of care, where the Holy Spirit is there.",
  },
];

export default function Home() {
  const [currentStation, setCurrentStation] = useState(1);
  const [progress, setProgress] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showOverview, setShowOverview] = useState(false);

  useEffect(() => {
    // Simulate loading or any initial setup
    // const timer = setTimeout(() => {
    //   setShowWelcome(false);
    // }, 3000); // Show welcome screen for 3 seconds

    // return () => clearTimeout(timer);
  }, []);

  const totalStations = stations.length;

  const handleAnswerSubmit = () => {
    // Placeholder logic for checking the answer
    if (answer.toLowerCase() === "correct") {
      if (currentStation < totalStations) {
        setCurrentStation(currentStation + 1);
        setProgress(((currentStation - 1) / totalStations) * 100);
        setAnswer("");
      } else {
        setIsCompleted(true);
      }
    } else {
      alert("Incorrect answer. Please try again.");
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
