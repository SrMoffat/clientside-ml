// const tf = require('@tensorflow/tfjs');

const progressBar = document.getElementById('model-load-progress');
const modelPicker = document.getElementById('model-picker');
const imagePicker = document.getElementById('image-select');
const selectedImage = document.getElementById('selected-image');
const modelPredictions = document.getElementById('predictions');

let model;

const loadTfModel = async () => {
    model = await tf.loadModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');

    console.log('MODEL', model);
    
}

imagePicker.addEventListener('change', (e) => {
    loadTfModel();

    const { target: { files } } = e;

    let reader = new FileReader();

    reader.onload = () => {
        selectedImage.setAttribute('src', reader.result);
    }

    reader.readAsDataURL(files[0]);
});

