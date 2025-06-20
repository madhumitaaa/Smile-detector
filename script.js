const video=document.getElementById("video")
Promise.all(
    [
        faceapi.nets.tinyFaceDetector.loadFromUri('model/tiny_face_detector_model'),
         faceapi.nets.faceLandmark68Net.loadFromUri('model/face_landmark_68_model'),     
         faceapi.nets.faceExpressionNet.loadFromUri('model/face_expression_model')
    ]
).then(startVideo);


function startVideo()
{
    navigator.mediaDevices.getUserMedia({video:{}})
    .then((stream)=>{
        video.srcObject=stream;
        video.onloadedmetadata = () => {
        video.play();
         console.log("🎥 Camera started");
        };
    })

    .catch((err)=>console.error("❌ Camera error:", err));
}
video.addEventListener("play",()=>{
    const canvas=faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);

    const displaySize={width:video.videoWidth,height:video.videoHeight};
    faceapi.matchDimensions(canvas,displaySize);


setInterval(async()=>{
    const detections=await faceapi.detectAllFaces(
        video,new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

const resizedDetections=faceapi.resizeResults(detections,displaySize);
canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height);
faceapi.draw.drawDetections(canvas,resizedDetections);
faceapi.draw.drawFaceExpressions(canvas,resizedDetections);

resizedDetections.forEach(d=>{
    if(d.expressions.happy>0.7){
        console.log("😊 You are smiling!");
    }
});

},200);

});






