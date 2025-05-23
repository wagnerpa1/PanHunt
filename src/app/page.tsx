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
import { jsPDF } from "jspdf";

export default function Home() {
  const [currentStation, setCurrentStation] = useState(1);
  const [progress, setProgress] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showOverview, setShowOverview] = useState(false);
  const [stationStage, setStationStage] = useState<
    "navigation" | "explanation" | "question"
  >("navigation"); // "navigation", "explanation", "question"
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

    if (
      answer.toLowerCase() === currentStationData.correctAnswer.toLowerCase()
    ) {
      setStationStage("explanation"); // Go to explanation after correct answer
      setSubmitted(false);
      setFeedbackMessage("");
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

  const handleNavigationArrived = () => {
    setStationStage("question");
  };

  const handleExplanationComplete = () => {
    if (currentStation < totalStations) {
      setCurrentStation(currentStation + 1);
      setStationStage("navigation");
      setProgress(((currentStation) / totalStations) * 100);
      setAnswer("");
      setFeedbackMessage("");
    } else {
      setIsCompleted(true);
    }
  };

  const handleDownloadCertificate = () => {
    const doc = new jsPDF();

    // Add content to the PDF
    doc.text("Zertifikat für den Abschluss des Pfarrkirchen Explorers", 10, 10);
    doc.text("Herzlichen Glückwunsch!", 10, 30);
    doc.text("Sie haben alle Stationen erfolgreich abgeschlossen.", 10, 40);
    doc.text("Ausgestellt am: " + new Date().toLocaleDateString(), 10, 50);

    // Download the PDF
    doc.save("Pfarrkirchen_Explorer_Zertifikat.pdf");
  };

  const handleBackToNavigation = () => {
    setStationStage("navigation");
    setAnswer("");
    setFeedbackMessage("");
    setSubmitted(false);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      {showWelcome ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Willkommen beim Pfarrkirchen Explorer!
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Mach dich bereit, die verborgenen Schätze von Pfarrkirchen zu
            entdecken.
          </p>
          <Button
            onClick={handleStartClick}
            className="transition-transform hover:scale-105"
          >
            Starten
          </Button>
        </div>
      ) : showOverview ? (
        <RouteOverview stations={stations} onComplete={handleOverviewComplete} />
      ) : !isCompleted ? (
        <div className="transition-all duration-300 ease-out w-full max-w-md">
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

          <div className="relative h-full">
            {stationStage === "navigation" && (
              <div className="slide-in-right">
                <NavigationScreen
                  station={stations[currentStation - 1]}
                  onArrived={handleNavigationArrived}
                />
              </div>
            )}
            {stationStage === "explanation" && (
              <div className="slide-in-right">
                <ExplanationScreen
                  station={stations[currentStation - 1]}
                  onComplete={handleExplanationComplete}
                />
              </div>
            )}
            {stationStage === "question" && (
              <div className="slide-in-right">
                <QuestionScreen
                  station={stations[currentStation - 1]}
                  answer={answer}
                  setAnswer={setAnswer}
                  feedbackMessage={feedbackMessage}
                  submitted={submitted}
                  handleAnswerSubmit={handleAnswerSubmit}
                  onBackToNavigation={handleBackToNavigation}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Herzlichen Glückwunsch!
          </h2>
          <p className="text-muted-foreground mb-6">
            Du hast alle Stationen des Pfarrkirchen Explorers abgeschlossen!
          </p>
          <Button
            onClick={handleDownloadCertificate}
            className="transition-transform hover:scale-105"
          >
            Zertifikat herunterladen
          </Button>
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

const RouteOverview: React.FC<RouteOverviewProps> = ({
  stations,
  onComplete,
}) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold text-foreground mb-4">
        Routenübersicht
      </h2>
      <div className="mb-4 w-full max-w-md map-animation-container">
        <Map stations={stations} currentStation={0} zoom={12} />
      </div>
      <ol className="list-decimal list-inside pl-0 max-w-md w-full">
        {stations.map((station) => (
          <li key={station.id} className="mb-2">
            <strong>{station.title}</strong>
          </li>
        ))}
      </ol>
      <Button
        onClick={onComplete}
        className="transition-transform hover:scale-105"
      >
        Erkundung starten
      </Button>
    </div>
  );
};

interface NavigationScreenProps {
  station: {
    id: number;
    title: string;
    mapUrl: string;
    googleMapsLink: string;
  };
  onArrived: () => void;
}

const NavigationScreen: React.FC<NavigationScreenProps> = ({
  station,
  onArrived,
}) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Navigation zu {station.title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <img
            src={station.mapUrl}
            alt={`Karte von ${station.title}`}
            className="rounded-md"
          />
        </div>
        <Button asChild className="transition-transform hover:scale-105">
          <a
            href={station.googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Route in Google Maps öffnen
          </a>
        </Button>
        <Button
          onClick={onArrived}
          className="transition-transform hover:scale-105"
        >
          Angekommen!
        </Button>
      </CardContent>
    </Card>
  );
};

interface ExplanationScreenProps {
  station: { id: number; title: string; explanation: string; mapUrl: string };
  onComplete: () => void;
}

const ExplanationScreen: React.FC<ExplanationScreenProps> = ({
  station,
  onComplete,
}) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Mehr über {station.title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <img
            src={station.mapUrl}
            alt={`Karte von ${station.title}`}
            className="rounded-md"
          />
        </div>
        <p>{station.explanation}</p>
        <Button
          onClick={onComplete}
          className="transition-transform hover:scale-105"
        >
          Weiter
        </Button>
      </CardContent>
    </Card>
  );
};

interface QuestionScreenProps {
  station: {
    id: number;
    title: string;
    riddle: string;
    correctAnswer: string;
  };
  answer: string;
  setAnswer: (answer: string) => void;
  feedbackMessage: string;
  submitted: boolean;
  handleAnswerSubmit: () => void;
  onBackToNavigation: () => void;
}

const QuestionScreen: React.FC<QuestionScreenProps> = ({
  station,
  answer,
  setAnswer,
  feedbackMessage,
  submitted,
  handleAnswerSubmit,
  onBackToNavigation,
}) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{station.title}</CardTitle>
        <CardDescription>{station.riddle}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {feedbackMessage && (
          <div className="text-center text-red-500 mb-2">
            {feedbackMessage}
          </div>
        )}
        <Input
          type="text"
          placeholder="Deine Antwort"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <Button
          onClick={handleAnswerSubmit}
          className="transition-transform hover:scale-105"
        >
          Antwort absenden
        </Button>
        <Button
          onClick={onBackToNavigation}
          className="transition-transform hover:scale-105"
        >
          Zurück zur Navigation
        </Button>
      </CardContent>
    </Card>
  );
};
