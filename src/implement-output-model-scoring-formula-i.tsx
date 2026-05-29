```typescript
// FILE: apps/api/src/modules/scoring/services/OutputModelCalculator.ts
import { ScoringService } from './ScoringService';
import { Task } from '../models/Task';
import { PerformanceScore } from '../models/PerformanceScore';
import { Op } from 'sequelize';

export class OutputModelCalculator {
  private scoringService: ScoringService;

  constructor(scoringService: ScoringService) {
    this.scoringService = scoringService;
  }

  async calculate(): Promise<number> {
    const tasks = await Task.findAll({
      where: { completed_on_time: true },
    });

    let totalScore = 0;
    let count = 0;

    for (const task of tasks) {
      const onTimeFlag = task.completed_on_time ? 1 : 0;
      const qualityWeight = task.quality_weight || 1.0;
      const complexityMultiplier = task.complexity_multiplier || 1.0;
      const peerValidationScore = task.peer_validation_score || 0;

      const score = (onTimeFlag * qualityWeight * complexityMultiplier) + peerValidationScore;
      totalScore += score;
      count++;
    }

    if (count === 0) {
      return 0;
    }

    const averageScore = totalScore / count;
    return Math.min(Math.max(averageScore * 100, 0), 100);
  }
}

// FILE: apps/api/src/modules/scoring/services/ScoringService.ts
import { OutputModelCalculator } from './OutputModelCalculator';
import BullMQ from 'bullmq';

export class ScoringService {
  private outputModelCalculator?: OutputModelCalculator;

  constructor() {
    this.outputModelCalculator = new OutputModelCalculator(this);
  }

  async recalculateScores(): Promise<void> {
    const queue = new BullMQ('score-recalc');
    await queue.add('output', {});
  }
}

// FILE: apps/api/src/modules/scoring/models/Task.ts
import { DataTypes, Model, Sequelize } from 'sequelize';

export const Task = (sequelize: Sequelize): typeof Model => {
  return sequelize.define('Task', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    completed_on_time: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    quality_weight: {
      type: DataTypes.FLOAT,
      defaultValue: 1.0,
    },
    complexity_multiplier: {
      type: DataTypes.FLOAT,
      defaultValue: 1.0,
    },
    peer_validation_score: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  });
};

// FILE: apps/api/src/modules/scoring/models/PerformanceScore.ts
import { DataTypes, Model, Sequelize } from 'sequelize';

export const PerformanceScore = (sequelize: Sequelize): typeof Model => {
  return sequelize.define('PerformanceScore', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    model_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });
};

// FILE: apps/api/src/modules/scoring/controllers/ScoreController.ts
import { Request, Response } from 'express';
import { ScoringService } from '../services/ScoringService';

export class ScoreController {
  private scoringService: ScoringService;

  constructor(scoringService: ScoringService) {
    this.scoringService = scoringService;
  }

  async recalculateScores(req: Request, res: Response): Promise<void> {
    try {
      await this.scoringService.recalculateScores();
      res.status(200).send('Scores recalculated');
    } catch (error) {
      res.status(500).send('Error recalculating scores');
    }
  }
}

// FILE: apps/api/src/modules/scoring/routes/scoreRoutes.ts
import { Router } from 'express';
import { ScoreController } from '../controllers/ScoreController';
import { ScoringService } from '../services/ScoringService';

const router = Router();
const scoringService = new ScoringService();
const scoreController = new ScoreController(scoringService);

router.post('/recalculate', scoreController.recalculateScores);

export default router;

// FILE: apps/api/src/modules/scoring/migrations/20230419_create_tasks_table.ts
import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('tasks', 'quality_weight', {
      type: DataTypes.FLOAT,
      defaultValue: 1.0,
    });
    await queryInterface.addColumn('tasks', 'complexity_multiplier', {
      type: DataTypes.FLOAT,
      defaultValue: 1.0,
    });
    await queryInterface.addColumn('tasks', 'peer_validation_score', {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('tasks', 'quality_weight');
    await queryInterface.removeColumn('tasks', 'complexity_multiplier');
    await queryInterface.removeColumn('tasks', 'peer_validation_score');
  },
};
```