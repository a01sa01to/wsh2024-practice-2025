import ky from 'ky';

const createKyInstance = () => {
  const instance = ky.create({
    headers: {
      'Content-Type': 'application/json',
    },
    prefixUrl: process.env['API_URL'],
  });

  return instance;
};

export const apiClient = createKyInstance();
