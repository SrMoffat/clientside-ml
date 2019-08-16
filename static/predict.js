const progressBar = document.getElementById('model-load-progress');
const modelPicker = document.getElementById('model-picker');
const imagePicker = document.getElementById('image-select');
const selectedImage = document.getElementById('selected-image');
// const modelPredictions = document.getElementById('prediction-list');
const canvas = document.getElementById('predictions-chart');
const context = canvas.getContext('2d');

const chartBackground = 'rgb(1, 84, 49)';
const borderColor = 'rgb(0, 75, 40)';

let model;
let predictions;
let top5Predictions;

const tensor = tf.fromPixels(selectedImage)
                .resizeNearestNeighbor([224, 224])
                .toFloat()
                .expandDims();

const createElem = (elem) => {
    return document.createElement(elem);
}



const preparePredictions = (predictions, count) => {
    top5Predictions = Array.from(predictions)
                            .map((probability, index) => {
                                return {
                                    probability,
                                    prediction: IMAGENET[index]
                                }
                            })
                            .sort((a, b) => {
                                return b.probability - a.probability
                            })
                            .slice(0, count);

    return top5Predictions;
}

const getLabels = (predictions) => {

    return predictions.map(({ prediction }) => {
        return prediction;
    });
}

const createPredictionsChart = (predictions) => {
    console.log(predictions.map(({ probability }) => (probability)))

    const chart = new Chart(context, {
        type: 'radar',
        data: {
            labels: getLabels(predictions),
            datasets: [{
                label: 'Predictions',
                backgroundColor: `${chartBackground}`,
                borderColor: `${borderColor}`,
                data: predictions.map(({ probability }) => (probability*100))
            }]
        },
        options: {}
    });
}

const loadTfModel = async () => {
    model = await tf.loadModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
    
    predictions = await model.predict(tensor).data();

    createPredictionsChart(preparePredictions(predictions, 5));
    
    progressBar.style.display = 'none';
    // modelPredictions.innerHTML = '';
}

imagePicker.addEventListener('change', (e) => {
    loadTfModel();

    const { target: { files } } = e;

    const reader = new FileReader();

    reader.onload = () => {
        selectedImage.setAttribute('src', reader.result);
        // modelPredictions.innerHTML = '';
    }

    reader.readAsDataURL(files[0]);
});

imagePicker.addEventListener('click', () => {
    progressBar.style.display = 'block';
});


    

