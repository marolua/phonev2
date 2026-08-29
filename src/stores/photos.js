import { ref } from 'vue';

const demoGradients = [
    'linear-gradient(145deg, #d9b17f 0%, #6a8e8a 52%, #20373b 100%)',
    'linear-gradient(135deg, #1d3149 0%, #698da0 42%, #e9c38e 100%)',
    'linear-gradient(155deg, #7d5b73 0%, #e5a16c 48%, #273e52 100%)',
    'linear-gradient(145deg, #182c35 0%, #367578 44%, #c5b27f 100%)',
    'linear-gradient(130deg, #e6c68e 0%, #b87562 45%, #354d69 100%)',
    'linear-gradient(150deg, #506f76 0%, #b6c8b0 48%, #e29d76 100%)',
    'linear-gradient(140deg, #263f64 0%, #765f84 50%, #e0ae76 100%)',
    'linear-gradient(150deg, #a2c4ba 0%, #5a7f85 44%, #273443 100%)',
    'linear-gradient(135deg, #d68f70 0%, #f0ce91 42%, #527783 100%)',
];

export const photos = ref(demoGradients.map((gradient, index) => ({
    id: `demo-${index + 1}`,
    type: 'photo',
    gradient,
    createdAt: Date.now() - index * 1000 * 60 * 60 * 4,
})));

export const addPhoto = ({ type = 'photo' } = {}) => {
    const gradient = demoGradients[photos.value.length % demoGradients.length];
    const photo = {
        id: `capture-${Date.now()}`,
        type,
        gradient,
        createdAt: Date.now(),
    };

    photos.value.unshift(photo);
    return photo;
};

export const removePhoto = (photoId) => {
    photos.value = photos.value.filter(({ id }) => id !== photoId);
};
