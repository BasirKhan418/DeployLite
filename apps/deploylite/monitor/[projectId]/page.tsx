'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Line } from 'react-chartjs-2';

type MetricEntry = {
    timestamp: number;
    cpu: string;
    memory: string;
};

type DecisionEntry = {
    timestamp: string;
    action: string;
};

export default function MonitorPage() {
    const { projectId } = useParams() as { projectId: string };

    const [metrics, setMetrics] = useState<MetricEntry[]>([]);
    const [logs, setLogs] = useState('');
    const [status, setStatus] = useState('Unknown');
    const [decisions, setDecisions] = useState<DecisionEntry[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const m = await fetch(`/api/metrics?projectId=${projectId}`).then(res => res.json());
            const l = await fetch(`/api/logs?projectId=${projectId}`).then(res => res.text());
            const s = await fetch(`/api/status?projectId=${projectId}`).then(res => res.text());
            const d = await fetch(`/api/decisions?projectId=${projectId}`).then(res => res.json());

            setMetrics(m);
            setLogs(l);
            setStatus(s);
            setDecisions(d);
        };

        void fetchData(); // Fetch initially
        const interval = setInterval(() => void fetchData(), 5000); // Refetch every 5s
        return () => clearInterval(interval);
    }, [projectId]);

    const chartData = {
        labels: metrics.map(d => new Date(d.timestamp).toLocaleTimeString()),
        datasets: [
            {
                label: 'CPU (%)',
                data: metrics.map(d => parseFloat(d.cpu)),
                yAxisID: 'cpu',
            },
            {
                label: 'Memory (MB)',
                data: metrics.map(d => parseFloat(d.memory)),
                yAxisID: 'mem',
            },
        ],
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Monitor: {projectId}</h1>
            <p>Status: <span className={status === 'Running' ? 'text-green-500' : 'text-red-500'}>{status}</span></p>

            <Line data={chartData} />

            <div>
                <h2 className="font-semibold text-lg">Logs (latest)</h2>
                <pre className="bg-black text-white p-2 rounded max-h-64 overflow-y-scroll">{logs}</pre>
            </div>

            <div>
                <h2 className="font-semibold text-lg">Decision History</h2>
                <ul className="bg-gray-100 p-2 rounded">
                    {decisions.map((d, i) => (
                        <li key={i}>{d.timestamp}: {d.action}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
