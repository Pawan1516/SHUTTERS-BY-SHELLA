import axios from 'axios';

export const trackVisitor = async () => {
  try {
    await axios.post('http://localhost:5000/api/visitors/track');
  } catch (err) {
    console.error('Visitor tracking failed', err);
  }
};

export const trackClick = async (type) => {
  try {
    await axios.post('http://localhost:5000/api/visitors/click', { type });
  } catch (err) {
    console.error(`Click tracking failed for ${type}`, err);
  }
};
