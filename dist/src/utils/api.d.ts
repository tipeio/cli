/// <reference types="node" />
import { ChildProcess } from 'child_process';
import { CreateEnv, Authenticate, GetAuthToken, CreateFirstProject, GetProjects, CheckAPIKey, RetrieveAPIKeys } from '../types';
export declare const openAuthWindow: (config: {
    host: string;
    token: string;
}) => Promise<ChildProcess>;
export declare const checkAPIKey: CheckAPIKey;
export declare const getProjects: GetProjects;
export declare const createFirstProject: CreateFirstProject;
export declare const createEnv: CreateEnv;
export declare const getAuthToken: GetAuthToken;
export declare const authenticate: Authenticate;
export declare const createAPIKey: (options: {
    host: string;
    apiKey: string;
    name: string;
}) => Promise<{
    name: string;
    key: string;
}>;
export declare const retrieveAPIKeys: RetrieveAPIKeys;
