import { CommandConfig } from '../types';
import { Program, Command } from '@caporal/core';
export declare const createCommand: (prog: Program, config: CommandConfig) => Command;
export declare const createCommands: (prog: Program, configs: CommandConfig[]) => Program;
