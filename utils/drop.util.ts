export const isVideo = (url: string) => {
  const fileExt = url.split('.').pop()?.toLowerCase() || '';
  return ['mp4', 'mov'].includes(fileExt);
};

export const randomNumber = () => {
  let result = '';
  for (let i = 0; i < 9; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
};
