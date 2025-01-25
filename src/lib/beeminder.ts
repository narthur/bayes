import type { BeeminderConfig, BeeminderDatapoint, BeeminderGoal } from './types';

const API_BASE = 'https://www.beeminder.com/api/v1';

export class BeeminderService {
  private config: BeeminderConfig;

  constructor(config: BeeminderConfig) {
    this.config = config;
  }

  async getGoals(): Promise<BeeminderGoal[]> {
    if (!this.config.username || !this.config.authToken) {
      return [];
    }

    const url = `${API_BASE}/users/${this.config.username}/goals.json?auth_token=${this.config.authToken}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }
      const goals = await response.json();
      return goals.map((goal: any) => ({
        slug: goal.slug,
        title: goal.title
      }));
    } catch (error) {
      console.error('Error fetching Beeminder goals:', error);
      return [];
    }
  }

  async createDatapoint(goalSlug: string, datapoint: BeeminderDatapoint): Promise<Response> {
    const url = `${API_BASE}/users/${this.config.username}/goals/${goalSlug}/datapoints.json`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...datapoint,
        auth_token: this.config.authToken,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors || 'Failed to create datapoint');
    }

    return response.json();
  }
}
