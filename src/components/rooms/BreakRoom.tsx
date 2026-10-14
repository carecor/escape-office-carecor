import React, { useState, useRef, useEffect } from 'react';
import {
  Users,
  CheckCircle2,
  Camera,
  QrCode,
  Sparkles,
  ArrowRight,
  Eye,
  RefreshCw,
  Video,
  VideoOff
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { breakroomImg, targetPoseImg } from '../../assets/images';

interface BreakRoomProps {
  isCompleted: boolean;
  onCompleteRoom: () => void;
  onBackToOffice: () => void;
}

export const BreakRoom: React.FC<BreakRoomProps> = ({
  isCompleted,
  onCompleteRoom,
  onBackToOffice
}) => {
  const [isQrScanned, setIsQrScanned] = useState(false);
  const [showReferenceModal, setShowReferenceModal] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [poseConfirmed, setPoseConfirmed] = useState(false);

  // Fallback state for uploaded user image vs generated target pose image
  const [activePoseSrc, setActivePoseSrc] = useState<string>('/69b63476829b58109e5518757d5d9aa6.jpg');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera stream when leaving
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleStartCamera = async () => {
    sounds.playClick();
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
      } else {
        // Fallback simulation
        setIsCameraActive(true);
      }
    } catch {
      // Permission denied or camera unavailable -> graceful simulated snapshot mode
      setIsCameraActive(true);
    }
  };

  const handleStopCamera = () => {
    sounds.playClick();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleSnapPhoto = () => {
    sounds.playClick();
    setCountdown(3);

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          executeCapture();
          return null;
        }
        sounds.playTick();
        return prev - 1;
      });
    }, 800);
  };

  const executeCapture = () => {
    sounds.playFindItem();

    // If real video is active and playing, capture frame to canvas
    if (videoRef.current && streamRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 400, 300);
        setCapturedPhoto(canvas.toDataURL('image/png'));
      }
    } else {
      // Use target pose photo as the snapshot
      setCapturedPhoto(activePoseSrc);
    }
  };

  const handleConfirmPose = () => {
    sounds.playVictory();
    setPoseConfirmed(true);
    onCompleteRoom();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Story Banner */}
      <div className="bg-gradient-to-r from-white via-[#FEAEC9]/20 to-[#9AD9EA]/20 border-2 border-[#FEAEC9] rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#FEAEC9] text-pink-950 uppercase tracking-wider">
              Room 5 Challenge
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              Cooperation (Break Room)
            </h2>
          </div>
          {isCompleted && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Cooperation Door Unlocked!</span>
            </div>
          )}
        </div>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
          <strong>The Break Room:</strong> Cooperation shines brightest when teammates have fun together! The door lock is
          synchronized to our team synergy. Scan the QR code to unveil the <strong>Target pose to follow</strong>,
          then activate your camera or snap button to replicate the pose and unlock the exit!
        </p>
      </div>

      {/* Breakroom Photo Banner */}
      <div className="relative w-full h-44 sm:h-56 rounded-2xl overflow-hidden border-2 border-[#FEAEC9] shadow-sm">
        <img
          src={breakroomImg}
          alt="Carecor Breakroom"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
          <div className="text-white">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-pink-600/80 px-2 py-0.5 rounded-md">
              Breakroom Activity Zone
            </span>
            <p className="text-xs sm:text-sm font-semibold mt-0.5 text-pink-100">
              Where teamwork, laughter, and high-energy cooperation come together.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: QR Code Scan Panel & Camera Pose Verification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: QR Code Card */}
        <div className="bg-white rounded-2xl border-2 border-[#FEAEC9] p-6 shadow-sm flex flex-col justify-between items-center text-center">
          <div className="w-full">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-900 text-xs font-bold mb-3">
              <QrCode className="w-4 h-4 text-pink-600" />
              <span>Step 1: Scan Secret Team QR</span>
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-1">
              Target Pose QR Code
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Scan with your phone or tap the QR below to view the <strong>Target pose to follow</strong>!
            </p>

            {/* Interactive QR Code Graphic */}
            <div
              onClick={() => {
                sounds.playFindItem();
                setIsQrScanned(true);
                setShowReferenceModal(true);
              }}
              className="group relative w-52 h-52 sm:w-56 sm:h-56 mx-auto bg-white border-4 border-gray-900 rounded-2xl p-4 shadow-lg cursor-pointer transform hover:scale-105 transition-all flex flex-col items-center justify-center overflow-hidden"
              title="Click to view Target pose to follow"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* 3 Large Corner Position Targets */}
                <rect x="5" y="5" width="26" height="26" fill="#111827" rx="3" />
                <rect x="9" y="9" width="18" height="18" fill="#FFFFFF" />
                <rect x="13" y="13" width="10" height="10" fill="#E11D48" />

                <rect x="69" y="5" width="26" height="26" fill="#111827" rx="3" />
                <rect x="73" y="9" width="18" height="18" fill="#FFFFFF" />
                <rect x="77" y="13" width="10" height="10" fill="#E11D48" />

                <rect x="5" y="69" width="26" height="26" fill="#111827" rx="3" />
                <rect x="9" y="73" width="18" height="18" fill="#FFFFFF" />
                <rect x="13" y="77" width="10" height="10" fill="#E11D48" />

                {/* Data Matrix Dots */}
                <rect x="36" y="8" width="6" height="6" fill="#111827" />
                <rect x="46" y="8" width="6" height="6" fill="#111827" />
                <rect x="56" y="8" width="6" height="6" fill="#111827" />

                <rect x="8" y="38" width="6" height="6" fill="#111827" />
                <rect x="18" y="48" width="6" height="6" fill="#111827" />
                <rect x="38" y="28" width="6" height="6" fill="#111827" />
                <rect x="48" y="38" width="6" height="6" fill="#111827" />
                <rect x="58" y="48" width="6" height="6" fill="#111827" />

                {/* Center Badge */}
                <circle cx="50" cy="50" r="12" fill="#FEAEC9" stroke="#E11D48" strokeWidth="2" />
                <text x="50" y="53" textAnchor="middle" fill="#881337" fontSize="8" fontWeight="bold">POSE</text>

                <rect x="38" y="68" width="6" height="6" fill="#111827" />
                <rect x="48" y="78" width="6" height="6" fill="#111827" />
                <rect x="68" y="38" width="6" height="6" fill="#111827" />
                <rect x="78" y="48" width="6" height="6" fill="#111827" />
                <rect x="68" y="68" width="6" height="6" fill="#111827" />
                <rect x="82" y="78" width="6" height="6" fill="#111827" />
              </svg>

              <div className="absolute inset-0 bg-pink-500/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-white/95 text-pink-900 font-black text-xs px-3 py-1.5 rounded-full shadow-md">
                  View Target Pose
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              setIsQrScanned(true);
              setShowReferenceModal(true);
            }}
            className="mt-4 w-full py-2.5 px-4 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-950 font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Eye className="w-4 h-4 text-pink-600" />
            <span>{isQrScanned ? 'Re-open Target pose to follow' : 'Open Target pose to follow'}</span>
          </button>
        </div>

        {/* Right: Camera Verification Panel */}
        <div className="bg-white rounded-2xl border-2 border-[#9AD9EA] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-900 text-xs font-bold">
                <Camera className="w-4 h-4 text-cyan-700" />
                <span>Step 2: Strike the Pose</span>
              </span>
              {capturedPhoto && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Pose Captured
                </span>
              )}
            </div>

            <h3 className="text-lg font-black text-gray-900 mb-1">
              Camera Pose Verification
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Gather your teammates, follow the <strong>Target pose to follow</strong>, and snap the photo!
            </p>

            {/* Camera Viewfinder Area */}
            <div className="relative w-full aspect-[4/3] bg-gray-900 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center text-white">
              {/* Real Video Element if Stream active */}
              {isCameraActive && !capturedPhoto && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              )}

              {/* If Captured Photo Exists */}
              {capturedPhoto ? (
                <div className="relative w-full h-full">
                  <img
                    src={capturedPhoto}
                    alt="Captured pose"
                    onError={() => {
                      if (capturedPhoto !== targetPoseImg) {
                        setCapturedPhoto(targetPoseImg);
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>TARGET POSE MATCHED</span>
                  </div>
                </div>
              ) : !isCameraActive ? (
                <div className="p-6 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 flex items-center justify-center">
                    <Camera className="w-7 h-7 text-cyan-300" />
                  </div>
                  <p className="text-xs text-gray-300">
                    Camera is ready. Click below to activate webcam or snap pose!
                  </p>
                </div>
              ) : null}

              {/* Countdown Overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-6xl font-black text-yellow-300 animate-ping">
                  {countdown}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 space-y-2">
            {!capturedPhoto ? (
              <div className="flex gap-2">
                {!isCameraActive ? (
                  <button
                    onClick={handleStartCamera}
                    className="flex-1 py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Video className="w-4 h-4" />
                    <span>Activate Camera</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSnapPhoto}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-105 text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Snap Target Pose!</span>
                    </button>
                    <button
                      onClick={handleStopCamera}
                      className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                      title="Turn off camera"
                    >
                      <VideoOff className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            ) : !isCompleted ? (
              <div className="space-y-2">
                <button
                  onClick={handleConfirmPose}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 text-white font-black text-sm shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>Confirm Target Pose Followed & Unlock Door!</span>
                </button>

                <button
                  onClick={() => {
                    setCapturedPhoto(null);
                    setIsCameraActive(true);
                  }}
                  className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer flex items-center justify-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retake Photo</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onBackToOffice}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Cooperation Unlocked - Return to Hub</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Target Pose Reference Modal */}
      {showReferenceModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border-4 border-[#FEAEC9] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-2 border-gray-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-600" />
                <h3 className="font-black text-gray-900 text-lg">
                  Target pose to follow
                </h3>
              </div>
              <button
                onClick={() => setShowReferenceModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Target Pose Photograph */}
            <div className="relative aspect-[3/4] max-h-[55vh] mx-auto rounded-2xl overflow-hidden border-2 border-purple-200 shadow-md bg-white">
              <img
                src={activePoseSrc}
                alt="Target pose to follow"
                onError={() => {
                  if (activePoseSrc !== targetPoseImg) {
                    setActivePoseSrc(targetPoseImg);
                  }
                }}
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white text-center">
                <p className="text-xs sm:text-sm font-bold">
                  Target pose to follow
                </p>
                <p className="text-[11px] text-pink-200 mt-0.5">
                  Recreate this playful team posture with your coworkers!
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 text-center">
              <strong>Instructions:</strong> Follow the postures and playful energy shown in the <strong>Target pose to follow</strong> image. Then snap your photo to unlock the door!
            </div>

            <button
              onClick={() => setShowReferenceModal(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-sm cursor-pointer shadow-sm"
            >
              Got It! Ready to Follow Pose
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
