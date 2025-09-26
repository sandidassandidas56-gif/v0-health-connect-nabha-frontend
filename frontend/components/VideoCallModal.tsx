// WebRTC signaling and video call logic for React (doctor dashboard)
import { useRef, useState, useEffect, MutableRefObject } from "react";
import io, { Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";

const SIGNALING_SERVER_URL = "http://localhost:5000"; // Change if deployed

interface VideoCallModalProps {
  roomId: string;
  open: boolean;
  onClose: () => void;
}

export default function VideoCallModal({ roomId, open, onClose }: VideoCallModalProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [streamStarted, setStreamStarted] = useState(false);

  useEffect(() => {
    if (!open) return;
    const s: Socket = io(SIGNALING_SERVER_URL);
    setSocket(s);
    s.emit("join-room", roomId);
    return () => {
      s.disconnect();
    };
  }, [open, roomId]);

  useEffect(() => {
    if (!socket || !open) return;
  const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
  const pc: RTCPeerConnection = new RTCPeerConnection(config);
  let localStream: MediaStream | undefined;
  setPeerConnection(pc);

    // Show local video immediately
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream: MediaStream) => {
      localStream = stream;
      if (localVideoRef.current) {
        (localVideoRef.current as HTMLVideoElement).srcObject = stream;
        (localVideoRef.current as HTMLVideoElement).play();
      }
      stream.getTracks().forEach((track: MediaStreamTrack) => pc.addTrack(track, stream));
      setStreamStarted(true);
    });

    pc.ontrack = (event: RTCTrackEvent) => {
      if (remoteVideoRef.current) {
        (remoteVideoRef.current as HTMLVideoElement).srcObject = event.streams[0];
        (remoteVideoRef.current as HTMLVideoElement).play();
      }
    };
    pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate && socket) {
        socket.emit("signal", { roomId, data: { candidate: event.candidate } });
      }
    };

  socket.on("signal", async ({ data }: { data: Record<string, any> }) => {
      if (data.offer) {
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("signal", { roomId, data: { answer } });
      } else if (data.answer) {
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
      } else if (data.candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch {}
      }
    });

    // Initiator: create offer
    socket.on("user-joined", async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("signal", { roomId, data: { offer } });
    });

    return () => {
      if (localStream) localStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      pc.close();
    };
  }, [socket, open, roomId]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">Video Call (WebRTC)</h2>
        <video ref={localVideoRef} autoPlay playsInline className="w-full h-48 bg-black rounded mb-2" />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-48 bg-black rounded mb-2" />
        <Button variant="destructive" onClick={onClose}>End Call</Button>
      </div>
    </div>
  );
}
