// roha to manahil: this is your domain
// if needed you may create components in components/ folder
// other than that, for supabase functions, i will create some utilities later.
// for now, read from a hard-coded data that you can create here
// and show pose estimation

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

// CONFIG (LAN): Ensure your phone and computer are on the same Wi-Fi network.
// Replace SERVER_HOST with your computer's local IP address (e.g., 192.168.x.x).
const SERVER_HOST = "192.168.68.102"; 
const SERVER_PORT = 5001; // Python server listening port
const CAPTURE_INTERVAL_MS = 1; // capture cadence (ms) - faster for streaming

export default function PoseEstimationScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [isStreaming, setIsStreaming] = useState(false);
    const [statusMsg, setStatusMsg] = useState<string>("Idle");
    const cameraRef = useRef<CameraView>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [frameCount, setFrameCount] = useState(0);

    useEffect(() => {
        if (permission && !permission.granted && permission.canAskAgain) {
             requestPermission();
        }
    }, [permission, requestPermission]);

    const stopStreaming = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        setIsStreaming(false);
        setStatusMsg("Stopped");
    }, []);

    const captureAndSend = useCallback(async () => {
        if (!cameraRef.current) return;
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        try {
            const rawPhoto = await cameraRef.current.takePictureAsync({
                quality: 0.2,
                base64: true,
                skipProcessing: true
            });
            
            if (rawPhoto?.base64) {
                wsRef.current.send(rawPhoto.base64);
                setFrameCount((c) => c + 1);
                setStatusMsg(`Streaming (${frameCount} frames)`);
            }
        } catch (err: any) {
            // console.log("Capture error:", err);
        }
    }, [frameCount]);

    const startStreaming = useCallback(() => {
        if (isStreaming) return;
        setFrameCount(0);
        setIsStreaming(true);
        setStatusMsg("Connecting...");

        const ws = new WebSocket(`ws://${SERVER_HOST}:${SERVER_PORT}`);
        wsRef.current = ws;

        ws.onopen = () => {
            setStatusMsg("Connected. Streaming...");
            intervalRef.current = setInterval(captureAndSend, CAPTURE_INTERVAL_MS);
        };

        ws.onclose = () => {
            setStatusMsg("Disconnected");
            stopStreaming();
        };

        ws.onerror = (e: any) => {
            setStatusMsg(`WS Error: ${e.message}`);
        };

    }, [captureAndSend, isStreaming, stopStreaming]);

    useEffect(() => {
        return () => {
            stopStreaming();
        };
    }, [stopStreaming]);

    if (!permission) {
        return <View style={styles.centerMsg}><Text>Requesting permissions...</Text></View>;
    }

    if (!permission.granted) {
        return (
            <View style={styles.centerMsg}>
                <Text>Camera access is required for pose estimation.</Text>
                <TouchableOpacity
                    style={styles.permissionBtn}
                    onPress={requestPermission}
                >
                    <Text style={styles.btnText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                ref={cameraRef}
                facing="back"
                mode="picture"
            />
            <View style={styles.overlay}>
                <Text style={styles.status}>{statusMsg}</Text>
                <View style={styles.buttonsRow}>
                    {!isStreaming ? (
                        <TouchableOpacity style={styles.actionBtn} onPress={startStreaming}>
                            <Text style={styles.btnText}>Start</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={[styles.actionBtn, styles.stopBtn]} onPress={stopStreaming}>
                            <Text style={styles.btnText}>Stop</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <Text style={styles.hint}>
                    Streaming every {CAPTURE_INTERVAL_MS}ms to ws://{SERVER_HOST}:{SERVER_PORT}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000"
    },
    centerMsg: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24
    },
    camera: {
        flex: 1
    },
    overlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: "rgba(0,0,0,0.55)"
    },
    status: {
        color: "#fff",
        marginBottom: 8,
        fontSize: 14
    },
    buttonsRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 12
    },
    actionBtn: {
        backgroundColor: "#2563eb",
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 6
    },
    stopBtn: {
        backgroundColor: "#dc2626"
    },
    permissionBtn: {
        marginTop: 16,
        backgroundColor: "#2563eb",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 6
    },
    btnText: {
        color: "#fff",
        fontWeight: "600"
    },
    hint: {
        color: "#aaa",
        fontSize: 12
    }
});