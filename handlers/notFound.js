const notFound = (req, res) => {
  res.status(404).send('404: Web address not found');
};

module.exports = notFound;