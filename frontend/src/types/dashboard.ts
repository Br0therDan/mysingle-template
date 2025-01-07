
export interface Metric {
    title: string;
    value: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    trend: string;
}

export interface PipelineStageData {
    name: string;
    value: number;
}

export interface Activity {
    avatar: string;
    name: string;
    action: string;
    time: string;
}

export interface Project {
    name: string;
    progress: number;
    status: 'On Track' | 'At Risk' | 'On Hold';
}
