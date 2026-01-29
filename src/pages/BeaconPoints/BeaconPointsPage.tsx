import { useState } from "react";
import OptionsPanel from "../../components/DragDrop/OptionsPanel";
import MapCanvas from "../../components/DragDrop/MapCanvas";
import ResultModal from "../../components/DragDrop/ResultModal";
import ReviewCanvas from "../../components/DragDrop/ReviewCanvas"; 
import { ANSWERS } from "../../data/dragDropData";
import { useGameTimer } from "../../hooks/useGameTimer";

export default function BeaconPointsPage(props: { navigate: (to: string) => void; gameId: 'beaconpoints'  }) {
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const usedLabels = Object.values(placements);

  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);

  const [penalty, setPenalty] = useState(0);
  const [incorrectZones, setIncorrectZones] = useState<string[]>([]);
  const [correctZones, setCorrectZones] = useState<string[]>([]);

  const [timerKey, setTimerKey] = useState(0);

  // review flow
  const [reviewMode, setReviewMode] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false); // false=user snapshot, true=reveal correct

  const time = useGameTimer(running, timerKey);

  const handleDrop = (targetZoneId: string, label: string, fromZoneId?: string) => {
    setPlacements(prev => {
      const next = { ...prev };

      // move: remove from old zone
      if (fromZoneId && fromZoneId !== targetZoneId) {
        if (next[fromZoneId] === label) delete next[fromZoneId];
      }

      // place into target (replace allowed)
      next[targetZoneId] = label;

      return next;
    });

    // start timer on first placement
    setRunning(prev => (prev ? prev : true));

    // clear incorrect highlight if user changes that zone
    setIncorrectZones(prev => prev.filter(z => z !== targetZoneId));
    setCorrectZones(prev => prev.filter(z => z !== targetZoneId));
  };

  const handleStart = () => {
    setStarted(true);
    setRunning(false); // start timer only after first drop
  };

  const handleFinish = () => {
    const wrong: string[] = [];
    const correct: string[] = [];

    Object.entries(ANSWERS).forEach(([zone, ans]) => {
      if (placements[zone] === ans) correct.push(zone);
      else wrong.push(zone);
    });

    // optional if you re-enable penalty later:
    setPenalty(wrong.length * 10);

    setIncorrectZones(wrong);
    setCorrectZones(correct); 
    setRunning(false);
    setFinished(true);
  };

  const handleClear = () => {
    setPlacements({});
    setIncorrectZones([]);
    setCorrectZones([]);
  };

  const handleViewCorrect  = () => {
    setReviewMode(true);
    setShowCorrect(false); 
  };

  const handleRetry = () => {
    setPlacements({});
    setIncorrectZones([]);
    setCorrectZones([]);
    setFinished(false);
    setReviewMode(false);
    setShowCorrect(false);
    setPenalty(0);
    setRunning(false);
    setTimerKey(prev => prev + 1);
  };

  const handleToggleCorrect = () => {
    setShowCorrect(prev => !prev);
  };

  if (reviewMode) {
    return (
      <ReviewCanvas
        placements={placements}
        showCorrect={showCorrect}
        onToggleCorrect={handleToggleCorrect} 
        onRetry={handleRetry}
        time={time}
        penalty={penalty}
      />
    );
  }

  // GAME PAGE
  return (
    <div className="game-root">
      <OptionsPanel usedLabels={usedLabels} />

      <MapCanvas
        placements={placements}
        incorrectZones={incorrectZones}
        correctZones={correctZones} 
        onDrop={handleDrop}
        time={time}
        onFinish={handleFinish}
        onClear={handleClear}
      />

      {finished && (
        <ResultModal
          time={time}
          penalty={penalty}
          title="Exercise Completed"
          actionLabel="View Correct Answers"
          onAction={handleViewCorrect}
        />
      )}
    </div>
  );
}
