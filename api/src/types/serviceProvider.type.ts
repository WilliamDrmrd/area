import { ReactionInterface } from './reaction.type';
import { ActionInterface } from './action.type';

export type Option<T> = T | undefined;
export type CanBeAsync<T> = T | Promise<T>;

export interface ServiceProvider {
  name: string;
  description: string;

  saveService(): CanBeAsync<void>;
  saveActions(): CanBeAsync<Map<number, ActionInterface>>;
  saveReactions(): CanBeAsync<Map<number, ReactionInterface>>;

  loadActions(): CanBeAsync<Map<number, ActionInterface>>;
  loadReactions(): CanBeAsync<Map<number, ReactionInterface>>;

  authenticate(): CanBeAsync<boolean>;
}
