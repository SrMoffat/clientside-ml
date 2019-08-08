const progressBar = document.getElementById('model-load-progress');
const modelPicker = document.getElementById('model-picker');
const imagePicker = document.getElementById('image-select');
const selectedImage = document.getElementById('selected-image');
const modelPredictions = document.getElementById('prediction-list');

let model;
let predictions;
let top5Predictions;

const tensor = tf.fromPixels(selectedImage)
                .resizeNearestNeighbor([224, 224])
                .toFloat()
                .expandDims();

const loadTfModel = async () => {
    model = await tf.loadModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
    progressBar.style.display = 'none';

    predictions = await model.predict(tensor).data();

    top5Predictions = Array.from(predictions)
                            .map((probability, index) => {
                                return {
                                    probability,
                                    classname: IMAGENET[index]
                                }
                            })
                            .sort((a, b) => {
                                return b.probability - a.probability
                            })
                            .slice(0, 5);


    // console.log('MODEL', model);
    // console.log('PREDICTION', predictions);
    console.log('T5PREDICTION', top5Predictions);

}

imagePicker.addEventListener('change', (e) => {
    loadTfModel();

    const { target: { files } } = e;

    let reader = new FileReader();

    reader.onload = () => {
        selectedImage.setAttribute('src', reader.result);
        modelPredictions.innerHTML = '';
    }

    reader.readAsDataURL(files[0]);
});


    

