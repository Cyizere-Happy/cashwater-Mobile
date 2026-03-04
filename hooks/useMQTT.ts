import { useEffect, useState, useRef, useCallback } from 'react';
import Paho from 'paho-mqtt';

// ─── Broker Config ───────────────────────────────────────────
const MQTT_HOST = "157.173.101.159";
const MQTT_WS_PORT = 9001;

// ─── Topics ──────────────────────────────────────────────────
const TOPIC_FLOW = "sensors/flow_rate";
const TOPIC_ANOMALY = "sensors/anomaly";
const TOPIC_HEARTBEAT = "sensors/heartbeat";
const TOPIC_VALVE_STATE = "sensors/valve_state";

// Commands outbound
const TOPIC_VALVE_CMD = "control/valve";
const TOPIC_ANOMALY_SCAN = "control/anomaly_scan";

export interface MQTTState {
    isConnected: boolean;
    mqttStatus: string;

    // Hardware Data
    flowRate: number | null;
    totalVolume: number | null;
    valveState: 'OPEN' | 'BLOCKED' | null;
    leakDetected: boolean;
    anomalyScore: number;
    lastHeartbeat: string | null;

    // Actions
    sendValveCommand: (cmd: 'OPEN' | 'BLOCKED') => void;
    sendAnomalyScan: (action: 'TRIGGER' | 'ACKNOWLEDGE') => void;
}

export function useMQTT(): MQTTState {
    const [isConnected, setIsConnected] = useState(false);
    const [mqttStatus, setMqttStatus] = useState('Connecting...');

    const [flowRate, setFlowRate] = useState<number | null>(null);
    const [totalVolume, setTotalVolume] = useState<number | null>(null);
    const [valveState, setValveState] = useState<'OPEN' | 'BLOCKED' | null>(null);
    const [leakDetected, setLeakDetected] = useState(false);
    const [anomalyScore, setAnomalyScore] = useState(0);
    const [lastHeartbeat, setLastHeartbeat] = useState<string | null>(null);

    const clientRef = useRef<Paho.Client | null>(null);

    useEffect(() => {
        const clientID = "mobile_ui_" + Math.random().toString(16).slice(2, 10);
        const client = new Paho.Client(MQTT_HOST, MQTT_WS_PORT, clientID);
        clientRef.current = client;

        client.onConnectionLost = (responseObject) => {
            setIsConnected(false);
            setMqttStatus("Offline: " + responseObject.errorMessage);
        };

        client.onMessageArrived = (message) => {
            const topic = message.destinationName;
            const payload = message.payloadString;

            try {
                if (topic === TOPIC_FLOW) {
                    const d = JSON.parse(payload);
                    if (typeof d.flow_lpm === 'number') setFlowRate(d.flow_lpm);
                    if (typeof d.total_L === 'number') setTotalVolume(d.total_L);
                    if (d.valve === 'OPEN' || d.valve === 'BLOCKED') setValveState(d.valve);
                }
                else if (topic === TOPIC_ANOMALY) {
                    const d = JSON.parse(payload);
                    if (typeof d.score === 'number') setAnomalyScore(d.score);
                    if (typeof d.leak_detected === 'boolean') setLeakDetected(d.leak_detected);
                }
                else if (topic === TOPIC_VALVE_STATE) {
                    const d = JSON.parse(payload);
                    if (d.state === 'OPEN' || d.state === 'BLOCKED') setValveState(d.state);
                }
                else if (topic === TOPIC_HEARTBEAT) {
                    setLastHeartbeat(new Date().toLocaleTimeString());
                    setMqttStatus("Connected");
                }
            } catch (e) {
                console.error("[useMQTT] Parse error", topic, e);
            }
        };

        const connectOptions = {
            useSSL: false,
            timeout: 10,
            onSuccess: () => {
                setIsConnected(true);
                setMqttStatus("Connected");
                client.subscribe(TOPIC_FLOW);
                client.subscribe(TOPIC_ANOMALY);
                client.subscribe(TOPIC_VALVE_STATE);
                client.subscribe(TOPIC_HEARTBEAT);
            },
            onFailure: (err: any) => {
                setIsConnected(false);
                setMqttStatus("Error: " + err.errorMessage);
            }
        };

        try {
            client.connect(connectOptions);
        } catch (e) {
            setMqttStatus("Init Failed");
        }

        return () => {
            if (client.isConnected()) client.disconnect();
        };
    }, []);

    const sendValveCommand = useCallback((cmd: 'OPEN' | 'BLOCKED') => {
        const client = clientRef.current;
        if (client && client.isConnected()) {
            const msg = new Paho.Message(cmd);
            msg.destinationName = TOPIC_VALVE_CMD;
            client.send(msg);
            setValveState(cmd);
        }
    }, []);

    const sendAnomalyScan = useCallback((action: 'TRIGGER' | 'ACKNOWLEDGE') => {
        const client = clientRef.current;
        if (client && client.isConnected()) {
            const msg = new Paho.Message(action);
            msg.destinationName = TOPIC_ANOMALY_SCAN;
            client.send(msg);
        }
    }, []);

    return {
        isConnected,
        mqttStatus,
        flowRate,
        totalVolume,
        valveState,
        leakDetected,
        anomalyScore,
        lastHeartbeat,
        sendValveCommand,
        sendAnomalyScan,
    };
}
