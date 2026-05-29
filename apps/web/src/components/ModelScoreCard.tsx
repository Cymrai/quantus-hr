import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import styles from './ModelScoreCard.module.css';

interface ModelScoreCardProps {
  score: number;
  modelType: string;
  periodStartDate: string;
  periodEndDate: string;
}

const ModelScoreCard: React.FC<ModelScoreCardProps> = ({ score, modelType, periodStartDate, periodEndDate }) => {
  const getVisualizationComponent = () => {
    switch (modelType) {
      case 'Time':
        return (
          <div className={styles.circularGauge}>
            <CircularProgressbar value={score} text={`${score}%`} styles={buildStyles({ pathColor: '#3e98c7' })} />
          </div>
        );
      case 'Output':
        return (
          <div className={styles.horizontalBar}>
            <div style={{ width: `${score * 2}px`, height: '20px', backgroundColor: '#3e98c7' }}></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.card}>
      <h2>{modelType} Model Score</h2>
      <p>Period: {periodStartDate} to {periodEndDate}</p>
      {getVisualizationComponent()}
    </div>
  );
};

export default ModelScoreCard;