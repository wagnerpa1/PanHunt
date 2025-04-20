"use client";

import React, { useState } from "react";
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getLocationInfo } from "@/services/open-street-maps";
import { Map } from "./map";

const stations = [
  {
    id: 1,
    title: "Gartlberg Church",
    riddle: "Solve this riddle to unlock the next station.",
  },
  {
    id: 2,
    title: "Old Racetrack Area",
    riddle: "Solve this riddle to unlock the next station.",
  },
  {
    id: 3,
    title: "Altstadt / City Wall",
    riddle: "Solve this riddle to unlock the next station.",
  },
  {
    id: 4,
    title: "Wimmer-Ross Fountain",
    riddle: "Solve this riddle to unlock the next station.",
  },
  {
    id: 5,
    title: "City Parish Church (Stadtpfarrkirche)",
    riddle: "Solve this riddle to unlock the next station.",
  },
  {
    id: 6,
    title: "New + Old Town Hall",
    riddle: "Solve this riddle to unlock the next station.",
  },
  {
    id: 7,
    title: "Heilig-Geist-Spital (Holy Spirit Hospital)",
    riddle: "Solve this riddle to unlock the next station.",
  },
];

export default function Home() {
  const [currentStation, setCurrentStation] = useState(1);
  const [progress, setProgress] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const totalStations = stations.length;

  const handleAnswerSubmit = () => {
    // Placeholder logic for checking the answer
    if (answer.toLowerCase() === "correct") {
      if (currentStation < totalStations) {
        setCurrentStation(currentStation + 1);
        setProgress((currentStation / totalStations) * 100);
        setAnswer("");
      } else {
        setIsCompleted(true);
      }
    } else {
      alert("Incorrect answer. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background py-8 px-4">
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

      {!isCompleted ? (
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

      <div className="fixed bottom-4 right-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Show Map</Button>
          </DialogTrigger>
          <DialogContent>
            <Map stations={stations} currentStation={currentStation} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
