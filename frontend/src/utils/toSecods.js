const toSeconds = (date) => {
  const dateInSeconds = new Date(date);
  return dateInSeconds.getTime() / 1000;
};

export { toSeconds };
