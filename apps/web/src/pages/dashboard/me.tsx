import React from 'react';
import useSWR from 'swr';
import ModelScoreCard from '../../components/ModelScoreCard';
import { fetchData } from '../../lib/api';
import styles from './DashboardMe.module.css';

const DashboardMe: React.FC = () => {
  const { data, error } = useSWR(`/performance/scores/me`, fetchData);

  if (error) {
    return <div>Error fetching performance score</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  const { score, model_type, periodStartDate, periodEndDate } = data;

  return (
    <div className={styles.container}>
      <ModelScoreCard
        score={score}
        modelType={model_type}
        periodStartDate={periodStartDate}
        periodEndDate={periodEndDate}
      />
    </div>
  );
};

export default DashboardMe;