import { Frameworks, Framework } from '../types';
export declare const createPages: (options: any) => Promise<void>;
export declare const createPreviewRoutes: () => Promise<any>;
export declare const createTipeFolder: (folder?: string) => Promise<any>;
export declare const frameworks: Frameworks;
export declare const getFrameworkByName: (name: string) => import("../types").FrameworkConfig;
export declare const detect: (lib: Framework) => boolean;
export declare const isGatsby: () => boolean;
export declare const isNext: () => boolean;
export declare const isReact: () => boolean;
export declare const isYarn: () => Promise<boolean>;
export declare const getFramework: () => Promise<{
    modules: string[];
    name: string;
}>;
export declare const writeEnvs: (envs: {
    name: string;
    value: any;
}[]) => Promise<{
    error: boolean;
}>;
